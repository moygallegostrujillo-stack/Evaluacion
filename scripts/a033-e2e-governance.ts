/**
 * A-03.3 — Verificación E2E de la gobernanza de conocimientos (dev server real).
 *
 * Ejecutar: bun scripts/a033-e2e-governance.ts
 *
 * Verifica contra la ruta HTTP real:
 *   E1) El generador produce la cadena completa para un puesto NUEVO:
 *       PUESTO → BLUEPRINT(APPROVED, excepción registrada) → REQUIREMENTS
 *       (sin huérfanos) → ITEMS ligados (itemVersion 1 registrada) →
 *       ASSESSMENT KA-v1 (ACTIVE, scoringVersion, publishedBy).
 *   E2) PASO 9: al iniciar (POST 'start') se crea el snapshot de
 *       administración (assessmentVersion/blueprintVersion/scoringVersion/
 *       itemVersions SIN claves).
 *   E3) Flujo completo → result VALID, knowledgeScore=100, respuestas con
 *       correctAnswerSnapshot + itemVersionSnapshot congelados (PASO 10).
 *   E4) PASO 11/12: cambio de clave vía PUT (RH) → nueva itemVersion,
 *       versión antigua RETIRED, nueva en DRAFT, auditoría registrada;
 *       el resultado histórico y el snapshot de la sesión ya iniciada NO
 *       cambian.
 *   E5) PASO 8/14: CANDIDATO no puede modificar gobernanza (403); salida IA
 *       (origin=AI_DRAFT) nace DRAFT sin revisor/aprobador.
 *   E6) Limpieza total: la DB queda como seed.
 */
const BASE = 'http://localhost:3000'
const TAG = `A033E2E-${Date.now()}`

async function main() {
  const { getUnscopedClient } = await import('../src/lib/rls')
  const db = getUnscopedClient()
  const bcrypt = (await import('bcryptjs')).default
  const { CURRENT_CONSENT_VERSION } = await import('../src/lib/consent-version')
  const { generateTemplatesForPosition } = await import('../src/lib/generate-templates')

  const rh = await db.user.findFirst({ where: { email: 'rh@cafedechiapas.com' } })
  if (!rh) throw new Error('Seed incompleto (RH)')

  // ── E1: fixture de puesto NUEVO con cadena completa vía generador real ──
  // El puesto vive en la empresa del RH (para poder operar por la ruta real).
  const company = await db.company.findUnique({ where: { id: rh.companyId! } })
  if (!company) throw new Error('Empresa del RH no encontrada')
  const position = await db.position.create({
    data: {
      title: `E2E ${TAG}`,
      category: 'MESERO',
      hasKnowledgeTest: true,
      companyId: company.id,
    },
  })
  const gen = await generateTemplatesForPosition(position.id, position.title, 'MESERO', true)
  const kb = await db.knowledgeBlueprint.findFirst({
    where: { positionId: position.id },
    include: { requirements: true, assessments: true, questions: true },
  })
  if (!kb || kb.assessments.length === 0 || kb.requirements.length === 0) {
    throw new Error('E1 FALLO: cadena de gobernanza incompleta')
  }
  const kq = await db.question.findMany({
    where: { evaluationTemplate: { positionId: position.id }, category: 'KNOWLEDGE' },
    orderBy: { order: 'asc' },
  })
  const versionsCount = await db.knowledgeItemVersion.count({
    where: { questionId: { in: kq.map((q) => q.id) } },
  })
  const orphan = kq.filter((q) => !q.knowledgeRequirementId || !q.knowledgeBlueprintId).length
  console.log(
    `[E1] Cadena generada: blueprint=${kb.id} reqs=${kb.requirements.length} items=${kq.length} versiones=${versionsCount} assessment=${kb.assessments[0].assessmentVersion} [${kb.assessments[0].status}] — huérfanos=${orphan}`
  )
  if (kb.status !== 'APPROVED' || orphan !== 0 || versionsCount !== kq.length) {
    throw new Error('E1 FALLO: validación de cadena')
  }
  if (!kb.governanceNote?.includes('EXCEPCION_REGISTRADA')) {
    throw new Error('E1 FALLO: excepción de gobernanza no registrada (PASO 8)')
  }

  // ── Candidato fixture + login real ──
  const candidate = await db.user.create({
    data: {
      email: `${TAG}@test.local`,
      name: TAG,
      password: await bcrypt.hash('cand-test-1234', 10),
      role: 'CANDIDATO',
      companyId: company.id,
      consentGiven: true,
      consentDate: new Date(),
      consentOption: 'FULL',
      consentConfirmed: true,
      consentVersion: CURRENT_CONSENT_VERSION,
    },
  })
  const loginRes = await fetch(`${BASE}/api/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: candidate.email, password: 'cand-test-1234' }),
  })
  const loginData = await loginRes.json()
  if (!loginData.token) throw new Error('Login candidato falló: ' + JSON.stringify(loginData).slice(0, 120))
  const CH = { 'content-type': 'application/json', authorization: `Bearer ${loginData.token}` }

  const rhLogin = await fetch(`${BASE}/api/auth`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: rh.email, password: 'rh1234' }),
  })
  const rhData = await rhLogin.json()
  if (!rhData.token) throw new Error('Login RH falló')
  const RH = { 'content-type': 'application/json', authorization: `Bearer ${rhData.token}` }

  const post = async (headers: any, body: any) => {
    const res = await fetch(`${BASE}/api/evaluations`, { method: 'POST', headers, body: JSON.stringify(body) })
    return { status: res.status, data: await res.json() }
  }

  // ── E2/E3: flujo completo del candidato ──
  const created = await post(CH, { action: 'create-session', candidateId: candidate.id, positionId: position.id })
  const sessionId = created.data.session.id
  const started = await post(CH, { sessionId, action: 'start' })
  const conocimientos = (started.data.templates || []).find((t: any) => t.type === 'CONOCIMIENTOS')
  if (!conocimientos) throw new Error('E2 FALLO: sin plantilla CONOCIMIENTOS')

  const snap = await db.knowledgeAdministrationSnapshot.findUnique({ where: { sessionId } })
  if (!snap) throw new Error('E2 FALLO: snapshot de administración no creado al iniciar (PASO 9)')
  const snapItems = JSON.parse(snap.itemVersions || '[]')
  const snapHasKeys = snap.itemVersions?.includes('correctAnswer')
  console.log(
    `[E2] Snapshot PASO 9: assessment=${snap.assessmentVersion} blueprint=v${snap.blueprintVersion} scoring=${snap.scoringVersion} items=${snapItems.length} clavesExpuestas=${snapHasKeys ? 'SÍ(FALLO)' : 'NO'}`
  )
  if (snap.assessmentVersion !== 'KA-v1' || snap.blueprintVersion !== 1 || snapItems.length !== kq.length || snapHasKeys) {
    throw new Error('E2 FALLO: snapshot incompleto o con claves')
  }

  // Responder TODO el flujo (IPIP/psicología/integridad neutros; conocimientos 100% correctas)
  const keysById = new Map(kq.map((q) => [q.id, q.correctAnswer ?? 0]))
  // 'start' ya devolvió currentTemplate (paso 1) — bucle probado (A-03.2)
  let current: any = started.data.currentTemplate
  let stepCount = 0
  while (current) {
    stepCount++
    for (const q of current.questions) {
      const value =
        current.type === 'CONOCIMIENTOS'
          ? String(keysById.get(q.id) ?? 0)
          : '3'
      await post(CH, { sessionId, action: 'answer', questionId: q.id, value })
    }
    const next = await post(CH, { sessionId, action: 'next-step' })
    if (next.data.currentTemplate !== undefined && next.data.currentTemplate !== null) {
      current = next.data.currentTemplate
    } else {
      current = null
    }
  }
  console.log(`[E3] Flujo administrado (${stepCount} pasos).`)
  const completed = { data: {} as any }
  completed.data.result = await (async () => {
    const r = await db.evaluationResult.findUnique({ where: { sessionId } })
    return r
  })()
  const result = completed.data.result
  console.log(
    `[E3] Resultado: knowledgeScore=${result?.knowledgeScore} status=${result?.knowledgeStatus} overall=${result?.overallScore} rec=${result?.recommendation}`
  )
  if (result?.knowledgeScore !== 100 || result?.knowledgeStatus !== 'VALID') {
    throw new Error('E3 FALLO: resultado de conocimientos inválido')
  }
  const resp = await db.evaluationResponse.findFirst({
    where: { sessionId, question: { category: 'KNOWLEDGE' } },
  })
  if (!resp || resp.correctAnswerSnapshot === null || resp.itemVersionSnapshot !== 1) {
    throw new Error('E3 FALLO: snapshots por respuesta (clave/versión) incompletos')
  }
  console.log(`[E3] Respuesta congelada: clave=${resp.correctAnswerSnapshot} itemVersion=${resp.itemVersionSnapshot} outcome=${resp.scoringOutcome}`)

  const resultBefore = await db.evaluationResult.findUnique({ where: { sessionId } })
  const snapBefore = await db.knowledgeAdministrationSnapshot.findUnique({ where: { sessionId } })

  // ── E4: RH cambia la clave (PUT) → nueva versión; histórico y snapshot intactos ──
  // El PUT solo permite reactivos CUSTOM (guard A-03.2 correcto): RH crea uno
  // real (vía POST con gobernanza A-03.3) y luego cambia su clave.
  const postRes = await fetch(`${BASE}/api/questions`, {
    method: 'POST',
    headers: RH,
    body: JSON.stringify({
      templateId: conocimientos.id,
      text: `Reactivo RH fixture ${TAG}`,
      type: 'MULTIPLE_CHOICE',
      options: ['A', 'B', 'C', 'D'],
      category: 'KNOWLEDGE',
      correctAnswer: 1,
      origin: 'HUMAN',
    }),
  })
  const postData = await postRes.json()
  if (postRes.status !== 201) throw new Error('E4 FALLO: POST de reactivo RH: ' + JSON.stringify(postData).slice(0, 200))
  const rhQuestionId = postData.question.id
  const rhQ = await db.question.findUnique({ where: { id: rhQuestionId } })
  console.log(
    `[E4] Reactivo RH creado: status=${rhQ?.knowledgeStatus} requirement=${rhQ?.knowledgeRequirementId ? 'ligado' : 'HUÉRFANO(FALLO)'} createdBy=${rhQ?.createdBy} difficulty=${rhQ?.difficulty}`
  )
  if (rhQ?.knowledgeStatus !== 'ACTIVE' || !rhQ?.knowledgeRequirementId) {
    throw new Error('E4 FALLO: reactivo RH sin gobernanza (PASO 4)')
  }

  const putRes = await fetch(`${BASE}/api/questions`, {
    method: 'PUT',
    headers: RH,
    body: JSON.stringify({ questionId: rhQuestionId, correctAnswer: 2 }),
  })
  const putData = await putRes.json()
  if (putRes.status !== 200 || !putData.a033Versioning?.changed) {
    throw new Error('E4 FALLO: PUT de clave no versionó: ' + JSON.stringify(putData).slice(0, 200))
  }
  const versions = await db.knowledgeItemVersion.findMany({
    where: { questionId: rhQuestionId },
    orderBy: { itemVersion: 'asc' },
  })
  const audit = await db.auditLog.findFirst({
    where: { resourceId: rhQuestionId, details: { contains: 'a033Versioning' } },
  })
  console.log(
    `[E4] Cambio de clave: v1=[${versions[0]?.status}] v2=[${versions[1]?.status}/${versions[1]?.changeReason}] newItemVersion=${putData.a033Versioning.newItemVersion} audit=${audit ? 'SÍ' : 'NO'}`
  )
  if (versions[0]?.status !== 'RETIRED' || versions[1]?.status !== 'DRAFT' || !audit) {
    throw new Error('E4 FALLO: versionado de ítem incorrecto (PASO 11)')
  }
  const resultAfter = await db.evaluationResult.findUnique({ where: { sessionId } })
  const snapAfter = await db.knowledgeAdministrationSnapshot.findUnique({ where: { sessionId } })
  const unchangedResult =
    resultBefore!.knowledgeScore === resultAfter!.knowledgeScore &&
    resultBefore!.knowledgeStatus === resultAfter!.knowledgeStatus
  const unchangedSnapshot = JSON.stringify(snapBefore!.itemVersions) === JSON.stringify(snapAfter!.itemVersions)
  console.log(`[E4] Histórico intacto: result=${unchangedResult} snapshot=${unchangedSnapshot}`)
  if (!unchangedResult || !unchangedSnapshot) throw new Error('E4 FALLO: histórico/snapshot mutaron (PASO 9/11/12)')

  // ── E5a: CANDIDATO no puede modificar gobernanza (PASO 8/14) ──
  const candPut = await fetch(`${BASE}/api/questions`, {
    method: 'PUT',
    headers: CH,
    body: JSON.stringify({ questionId: rhQuestionId, correctAnswer: 0 }),
  })
  console.log(`[E5] PUT de CANDIDATO → HTTP ${candPut.status} (esperado 403)`)
  if (candPut.status !== 403) throw new Error('E5 FALLO: candidato alteró gobernanza')

  // ── E5b: salida IA nace DRAFT sin revisor/aprobador (PASO 14) ──
  const aiPost = await fetch(`${BASE}/api/questions`, {
    method: 'POST',
    headers: RH,
    body: JSON.stringify({
      templateId: conocimientos.id,
      text: `Reactivo IA fixture ${TAG}`,
      type: 'MULTIPLE_CHOICE',
      options: ['A', 'B', 'C', 'D'],
      category: 'KNOWLEDGE',
      correctAnswer: 1,
      origin: 'AI_DRAFT',
    }),
  })
  const aiData = await aiPost.json()
  const aiQ = aiData.question
  const aiFull = await db.question.findUnique({ where: { id: aiQ.id } })
  console.log(
    `[E5] Reactivo IA: status=${aiFull?.knowledgeStatus} origin=${aiFull?.origin} reviewedBy=${aiFull?.reviewedBy} approvedBy=${aiFull?.approvedBy} (esperado DRAFT/AI_DRAFT/null/null)`
  )
  if (aiFull?.knowledgeStatus !== 'DRAFT' || aiFull?.reviewedBy !== null || aiFull?.approvedBy !== null) {
    throw new Error('E5 FALLO: frontera IA no aplicada (PASO 14)')
  }

  console.log('\n════════════════════════════════════════')
  console.log('A-03.3 E2E: 5/5 ESCENARIOS APROBADOS ✓')
  console.log('════════════════════════════════════════')

  // ── E6: limpieza total (DB como seed) ──
  const allKq = kq.map((q) => q.id)
  allKq.push(rhQuestionId, aiQ.id)
  await db.knowledgeAdministrationSnapshot.deleteMany({ where: { sessionId } })
  await db.evaluationResponse.deleteMany({ where: { sessionId } })
  await db.evaluationResult.deleteMany({ where: { sessionId } })
  await db.evaluationSession.deleteMany({ where: { id: sessionId } })
  await db.knowledgeItemVersion.deleteMany({ where: { questionId: { in: allKq } } })
  await db.question.deleteMany({ where: { evaluationTemplate: { positionId: position.id } } })
  await db.knowledgeAssessment.deleteMany({ where: { positionId: position.id } })
  await db.knowledgeRequirement.deleteMany({ where: { blueprintId: kb.id } })
  await db.knowledgeBlueprint.deleteMany({ where: { positionId: position.id } })
  await db.evaluationTemplate.deleteMany({ where: { positionId: position.id } })
  await db.position.deleteMany({ where: { id: position.id } })
  await db.user.deleteMany({ where: { id: candidate.id } })
  await db.auditLog.deleteMany({
    where: { resourceId: { in: [...allKq] } },
  })
  console.log('[E6] Limpieza total: DB restaurada al estado del seed (empresa del seed intacta).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
