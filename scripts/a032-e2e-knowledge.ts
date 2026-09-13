/**
 * A-03.2 — Verificación E2E del flujo de conocimientos (contra el dev server).
 *
 * Ejecutar: bun scripts/a032-e2e-knowledge.ts
 *
 * Escenarios verificados:
 *   1) La API NO expone correctAnswer a un CANDIDATO por la ruta real
 *      (POST 'start'/'next-step') (RC-7).
 *   2) Sesión completa → knowledgeScore calculado, knowledgeStatus=VALID,
 *      snapshots congelados en respuestas (PASO 10).
 *   3) Sesión con un item sin clave (simulado temporalmente en DB) →
 *      knowledgeScore=null (NO 0), knowledgeStatus=INSUFFICIENT,
 *      reasonCode=KNOWLEDGE_KEY_MISSING (PASO 7/8).
 *   4) Limpieza: los datos creados se eliminan al final (DB queda como seed).
 */
const BASE = 'http://localhost:3000'

async function main() {
  const { getUnscopedClient } = await import('../src/lib/rls')
  const db = getUnscopedClient()

  const candidate = await db.user.findFirst({ where: { role: 'CANDIDATO' } })
  const position = await db.position.findFirst({ where: { hasKnowledgeTest: true } })
  if (!candidate || !position) throw new Error('Seed incompleto')

  // Limpieza de sesiones huérfanas de corridas previas (no COMPLETED)
  const strays = await db.evaluationSession.findMany({ where: { candidateId: candidate.id, status: { not: 'COMPLETED' } } })
  for (const s of strays) {
    await db.evaluationResponse.deleteMany({ where: { sessionId: s.id } })
    await db.evaluationResult.deleteMany({ where: { sessionId: s.id } })
    await db.evaluationSession.delete({ where: { id: s.id } })
  }

  // Login real vía /api/auth (JWT del middleware)
  const loginRes = await fetch(`${BASE}/api/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: candidate.email, password: 'candidato1234' }),
  })
  const loginData = await loginRes.json()
  if (!loginData.token) throw new Error('Login falló: ' + JSON.stringify(loginData).slice(0, 120))
  const H = { 'content-type': 'application/json', authorization: `Bearer ${loginData.token}` }

  // Setup de prueba: alinear consentimiento con la versión vigente
  // (el seed usa una versión anterior — el gate de re-consentimiento bloquea)
  const { CURRENT_CONSENT_VERSION } = await import('../src/lib/consent-version')
  await db.user.update({ where: { id: candidate.id }, data: { consentVersion: CURRENT_CONSENT_VERSION } })

  console.log(`Candidato: ${candidate.email} · Puesto: ${position.title}`)

  const post = async (body: any) => {
    const res = await fetch(`${BASE}/api/evaluations`, { method: 'POST', headers: H, body: JSON.stringify(body) })
    return { status: res.status, data: await res.json() }
  }

  // ── SESIÓN 1: flujo normal (todas las claves presentes) ──
  const created = await post({ action: 'create-session', candidateId: candidate.id, positionId: position.id })
  const sessionId = created.data.session.id
  console.log(`\n[1] Sesión creada: ${sessionId} (HTTP ${created.status})`)

  const started = await post({ sessionId, action: 'start' })
  const templates: any[] = started.data.templates || []
  const conocimientos = templates.find((t) => t.type === 'CONOCIMIENTOS')
  if (!conocimientos) throw new Error('No se encontró plantilla CONOCIMIENTOS: ' + JSON.stringify(started.data).slice(0, 150))

  const leak = conocimientos.questions.some((q: any) => q.correctAnswer !== undefined && q.correctAnswer !== null)
  console.log(`[2] Fuga de clave a CANDIDATO (ruta real start/next-step): ${leak ? 'SÍ (FALLO)' : 'NO (OK — RC-7 corregida)'}`)

  // Responder TODO el flujo paso a paso (IPIP/psicología/integridad con 3s;
  // conocimientos: 8 correctas y 2 incorrectas usando claves de lado servidor)
  const dbQuestions = await db.question.findMany({
    where: { evaluationTemplateId: conocimientos.id, category: 'KNOWLEDGE' },
    orderBy: { order: 'asc' },
  })
  const answerFor = (q: any, indexInTemplate: number, templateType: string): string => {
    if (templateType !== 'CONOCIMIENTOS') return '3' // LIKERT
    const dq = dbQuestions.find((d) => d.id === q.id)!
    const correctIdx = dq.correctAnswer ?? 0
    const wrong = (correctIdx + 1) % (JSON.parse(dq.options || '[]').length || 4)
    const total = dbQuestions.length
    const order = indexInTemplate
    return order >= total - 2 ? String(wrong) : String(correctIdx) // últimas 2 incorrectas
  }

  // 'start' ya devolvió currentTemplate (paso 1)
  let current: any = started.data.currentTemplate
  let stepCount = 0
  const sentKnowledge: string[] = []
  while (current) {
    stepCount++
    for (let i = 0; i < current.questions.length; i++) {
      const q = current.questions[i]
      if (current.type === 'CONOCIMIENTOS') {
        const dq = dbQuestions.find((d) => d.id === q.id)!
        const v = answerFor(q, i, current.type)
        sentKnowledge.push(`i=${i} order=${dq.order} key=${dq.correctAnswer} → "${v}"`)
      }
      await post({ sessionId, action: 'answer', questionId: q.id, value: answerFor(q, i, current.type) })
    }
    const next = await post({ sessionId, action: 'next-step' })
    if (next.data.currentTemplate !== undefined && next.data.currentTemplate !== null) {
      current = next.data.currentTemplate
    } else {
      // auto-complete o fin
      current = null
    }
  }
  console.log(`[3] Flujo administrado (${stepCount} pasos). Respuestas: ${sentKnowledge.length} de conocimiento`)
  for (const s of sentKnowledge) console.log(`    ${s}`)

  const result1 = await db.evaluationResult.findUnique({ where: { sessionId } })
  if (!result1) throw new Error('No se creó resultado')
  console.log(`[4] Resultado: knowledgeScore=${result1.knowledgeScore} (esperado 80) · knowledgeStatus=${result1.knowledgeStatus} · reasonCode=${result1.knowledgeReasonCode} · scoringVersion=${result1.knowledgeScoringVersion}`)
  console.log(`    overallScore=${result1.overallScore} · recommendation=${result1.recommendation}`)

  const resp1 = await db.evaluationResponse.findMany({ where: { sessionId }, include: { question: true } })
  const knowledgeResp1 = resp1.filter((x) => x.question.category === 'KNOWLEDGE')
  const frozen = knowledgeResp1.length > 0 && knowledgeResp1.every((x) => x.scoringOutcome !== null && x.scoringOutcome !== undefined)
  console.log(`[5] Snapshots congelados en respuestas: ${frozen ? 'OK' : 'FALLO'} (${knowledgeResp1.length} items)`)

  // ── SESIÓN 2: un item SIN clave (simulación temporal) → INSUFFICIENT ──
  const victim = dbQuestions[0]
  const originalKey = victim.correctAnswer
  await db.question.update({ where: { id: victim.id }, data: { correctAnswer: null } })
  console.log(`\n[6] Simulación: clave eliminada temporalmente de "${victim.text.slice(0, 40)}…"`)

  const created2 = await post({ action: 'create-session', candidateId: candidate.id, positionId: position.id })
  const sessionId2 = created2.data.session.id
  // Responder TODO el set — aunque responda todo, un item sin clave ⇒ INSUFFICIENT.
  const started2 = await post({ sessionId: sessionId2, action: 'start' })
  let cur2: any = started2.data.currentTemplate
  while (cur2) {
    for (const q of cur2.questions) {
      const v = cur2.type === 'CONOCIMIENTOS' ? '0' : '3'
      await post({ sessionId: sessionId2, action: 'answer', questionId: q.id, value: v })
    }
    const next = await post({ sessionId: sessionId2, action: 'next-step' })
    cur2 = next.data.currentTemplate ?? null
  }
  const result2 = await db.evaluationResult.findUnique({ where: { sessionId: sessionId2 } })
  if (!result2) throw new Error('No se creó resultado 2')
  console.log(`[7] Resultado: knowledgeScore=${result2.knowledgeScore} (esperado null — NO 0) · knowledgeStatus=${result2.knowledgeStatus} · reasonCode=${result2.knowledgeReasonCode}`)
  console.log(`    summary: ${(result2.summary || '').slice(0, 160)}`)

  // Restaurar la clave original
  await db.question.update({ where: { id: victim.id }, data: { correctAnswer: originalKey } })
  const restored = await db.question.findUnique({ where: { id: victim.id } })
  console.log(`\n[8] Clave restaurada (correctAnswer=${restored!.correctAnswer}, itemVersion=${restored!.itemVersion} — sin cambios de versión por restauración de estado)`)

  // ── Limpieza: eliminar sesiones/resultados de verificación ──
  for (const sid of [sessionId, sessionId2]) {
    await db.evaluationResult.deleteMany({ where: { sessionId: sid } })
    await db.evaluationResponse.deleteMany({ where: { sessionId: sid } })
    await db.evaluationSession.deleteMany({ where: { id: sid } })
  }
  console.log('[9] Limpieza completa: sesiones de verificación eliminadas.')

  const pass = !leak
    && result1.knowledgeScore === 80 && result1.knowledgeStatus === 'VALID' && frozen
    && result2.knowledgeScore === null && result2.knowledgeStatus === 'INSUFFICIENT' && result2.knowledgeReasonCode === 'KNOWLEDGE_KEY_MISSING'
  console.log(`\n=== VEREDICTO E2E: ${pass ? 'APROBADO (5/5 verificaciones)' : 'FALLO'} ===`)
  process.exit(pass ? 0 : 1)
}

main().catch((e) => { console.error(e); process.exit(1) })
