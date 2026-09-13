/**
 * A-01.2 — E2E determinista vía API real (dev server :3000)
 * =========================================================
 * Recorre el flujo completo del candidato con el instrumento IPIP-50-MX:
 *   login → create-session → start → 50 respuestas IPIP + psicológica(10) +
 *   integridad(10) + conocimientos(10, todas correctas) → complete
 * y verifica:
 *   - result.instrumentId / versiones
 *   - raws IPIP exactos con patrón fijo (todas=4 → E=30 A=32 C=32 ES=24 I=34)
 *   - columnas legacy Big Five en 0 (separación de instrumentos)
 *   - overallScore = f(psicología, integridad, conocimientos) SIN IPIP → 75
 *   - recommendation PERFIL_COMPLETO
 *   - summary del instrumento nuevo + sin promedio IPIP
 */
const BASE = 'http://localhost:3000'

async function api(path: string, init?: RequestInit) {
  const res = await fetch(BASE + path, init)
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

// Pre-paso: limpiar sesiones/responses/resultados demo previos del candidato
// (datos generados por corridas anteriores de ESTE E2E) para que el flujo sea
// determinista. No toca datos de otros usuarios ni templates.
async function cleanupCandidate() {
  const { db } = await import('../src/lib/db')
  const candidate = await db.user.findUnique({ where: { email: 'juan.perez@email.com' }, select: { id: true } })
  if (!candidate) return
  const sessions = await db.evaluationSession.findMany({ where: { candidateId: candidate.id }, select: { id: true } })
  const ids = sessions.map((s) => s.id)
  if (ids.length > 0) {
    await db.evaluationResponse.deleteMany({ where: { sessionId: { in: ids } } })
    await db.evaluationResult.deleteMany({ where: { sessionId: { in: ids } } })
    await db.evaluationSession.deleteMany({ where: { id: { in: ids } } })
  }
  await db.$disconnect()
}

async function main() {
  await cleanupCandidate()
  console.log('0) limpieza de sesiones demo previas OK')
  console.log('=== A-01.2 E2E — flujo completo IPIP-50-MX ===')

  // 1) Login candidato demo
  const login = await api('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: 'juan.perez@email.com', password: 'candidato1234' }),
  })
  if (login.status !== 200 || !login.json.token) {
    throw new Error(`login falló: ${login.status} ${JSON.stringify(login.json).slice(0, 200)}`)
  }
  const token = login.json.token
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  console.log('1) login OK')

  // 2) Posiciones disponibles
  const evals = await api('/api/evaluations', { headers: auth })
  if (evals.status !== 200) throw new Error(`evaluations GET: ${evals.status}`)
  // Determinista: Gerente de Piso (Café de Chiapas = empresa del candidato;
  // conocimientos del seed sin clave de respuesta — ver checks de Parte A)
  const position = evals.json.availablePositions?.find((p: any) => p.title === 'Gerente de Piso')
    || evals.json.availablePositions?.find((p: any) => p.company?.name === 'Café de Chiapas')
  if (!position) throw new Error('no hay posiciones disponibles')
  console.log(`2) posición: ${position.title} (${position.company?.name})`)

  // 3) create-session + start
  const created = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ action: 'create-session', candidateId: undefined, positionId: position.id }),
  })
  if (!created.json.session?.id) throw new Error(`create-session: ${JSON.stringify(created.json).slice(0, 200)}`)
  const sessionId = created.json.session.id

  const started = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ sessionId, action: 'start' }),
  })
  if (started.status !== 200) throw new Error(`start: ${started.status}`)
  let templates = started.json.templates
  console.log(`3) sesión iniciada — ${templates.length} secciones: ${templates.map((t: any) => `${t.type}(${t.questionCount})`).join(' + ')}`)

  // Validación previa: la primera sección debe ser IPIP-50-MX con 50 ítems
  const psico = templates[0]
  if (psico.questionCount !== 50) throw new Error(`sección psicométrica tiene ${psico.questionCount} ítems (esperado 50)`)
  if (!psico.questions.every((q: any) => q.category.startsWith('IPIP_'))) throw new Error('ítems no-IPIP en la sección psicométrica')
  console.log('   sección 1 = IPIP-50-MX (50 ítems IPIP_*) ✓')

  // 4) Responder TODO con patrón determinista:
  //    - IPIP: todas = 4 → raws esperados E=30 A=32 C=32 ES=24 I=34
  //    - resto LIKERT: 3; conocimientos: respuesta correcta (índice de correctAnswer)
  let step = 0
  let answeredIPIP = 0
  while (step < templates.length) {
    const t = templates[step]
    for (const q of t.questions) {
      const isIpip = q.category.startsWith('IPIP_')
      const numericValue = isIpip ? 4 : (q.type === 'MULTIPLE_CHOICE' ? (q.correctAnswer ?? 0) : 3)
      const value = q.type === 'MULTIPLE_CHOICE' ? String(q.correctAnswer ?? 0) : String(numericValue)
      const r = await api('/api/evaluations', {
        method: 'POST', headers: auth,
        body: JSON.stringify({ sessionId, action: 'answer', questionId: q.id, value, numericValue }),
      })
      if (r.status !== 200) throw new Error(`answer ${q.id}: ${r.status} ${JSON.stringify(r.json).slice(0, 150)}`)
      if (isIpip) answeredIPIP++
    }
    if (step === templates.length - 1) break
    const ns = await api('/api/evaluations', {
      method: 'POST', headers: auth,
      body: JSON.stringify({ sessionId, action: 'next-step' }),
    })
    if (ns.status !== 200) throw new Error(`next-step: ${ns.status} ${JSON.stringify(ns.json).slice(0, 150)}`)
    step++
  }
  console.log(`4) respuestas IPIP enviadas: ${answeredIPIP}/50`)

  // 5) complete
  const done = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ sessionId, action: 'complete' }),
  })
  if (done.status !== 200) throw new Error(`complete: ${done.status} ${JSON.stringify(done.json).slice(0, 200)}`)
  const result = done.json.result
  console.log('5) evaluación completada')

  // 6) Verificaciones
  const expectedRaws = { extraversionRaw: 30, agreeablenessRaw: 32, conscientiousnessRaw: 32, emotionalStabilityRaw: 24, intellectRaw: 34 }
  const checks: Array<[string, boolean, string]> = []
  checks.push(['instrumentId correcto', result.instrumentId === 'EVALHR-PERSONALIDAD-IPIP50-MX', String(result.instrumentId)])
  checks.push(['instrumentVersion 1.0', result.instrumentVersion === '1.0', String(result.instrumentVersion)])
  checks.push(['languageVersion', result.languageVersion === 'ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA', String(result.languageVersion)])
  checks.push(['scoringVersion', result.scoringVersion === 'IPIP50-BFM-1.0', String(result.scoringVersion)])
  for (const k of Object.keys(expectedRaws) as Array<keyof typeof expectedRaws>) {
    checks.push([`raw ${k} = ${expectedRaws[k]}`, result[k] === expectedRaws[k], String(result[k])])
  }
  checks.push(['legacy openness = 0 (separación)', result.openness === 0, String(result.openness)])
  checks.push(['legacy neuroticism = 0 (separación)', result.neuroticism === 0, String(result.neuroticism)])
  // Puesto sembrado (Gerente de Piso): sin template INTEGRIDAD y conocimientos
  // SIN clave de respuesta (comportamiento legacy existente del seed) →
  // overallScore = 0.5×(psic=50) + 0.5×(knowledge=0) = 25 — SIN IPIP
  // y guidance PERFIL_PARCIAL (falta integridad) — semántica legacy intacta.
  checks.push(['overallScore = 25 (psic=50 + knowledge=0; SIN IPIP)', Math.round(result.overallScore) === 25, String(result.overallScore)])
  checks.push(['recommendation = PERFIL_PARCIAL (puesto sin INTEGRIDAD — semántica legacy)', result.recommendation === 'PERFIL_PARCIAL', String(result.recommendation)])
  checks.push(['knowledgeScore = 0 (seed sin clave — legacy existente)', Math.round(result.knowledgeScore ?? -1) === 0, String(result.knowledgeScore)])
  checks.push(['summary del instrumento nuevo (menciona IPIP-50)', String(result.summary || '').includes('IPIP-50'), String(result.summary).slice(0, 80)])
  checks.push(['summary sin decisión de contratación', String(result.summary || '').includes('La decisión final corresponde al área de Recursos Humanos'), ''])
  checks.push(['summary menciona dimensiones (tendencias de respuesta)', String(result.summary || '').includes('tendencias de respuesta'), ''])

  let failures = 0
  for (const [name, ok, detail] of checks) {
    console.log(`  ${ok ? '✅' : '❌'} ${name}${ok ? '' : ` — obtuvo: ${detail}`}`)
    if (!ok) failures++
  }
  console.log('--- Parte A (puesto sembrado sin INTEGRIDAD/clave de conocimientos) lista ---')

  // =============================================================
  // PARTE B: puesto NUEVO (con INTEGRIDAD + conocimientos con clave)
  // para validar la ruta completa PERFIL_COMPLETO / overallScore=75
  // =============================================================
  const rhLogin = await api('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: 'rh@cafedechiapas.com', password: 'rh1234' }),
  })
  if (rhLogin.status !== 200 || !rhLogin.json.token) throw new Error('login RH falló')
  const rhAuth = { Authorization: `Bearer ${rhLogin.json.token}`, 'Content-Type': 'application/json' }

  const stamp = Date.now()
  const posCreate = await api('/api/positions', {
    method: 'POST', headers: rhAuth,
    body: JSON.stringify({
      title: `Mesero A01-E2E ${stamp}`,
      sector: 'RESTAURANT',
      category: 'MESERO',
      description: 'puesto temporal E2E A-01.2',
      hasKnowledgeTest: true,
    }),
  })
  if (posCreate.status !== 200 && posCreate.status !== 201) {
    throw new Error(`positions POST: ${posCreate.status} ${JSON.stringify(posCreate.json).slice(0, 200)}`)
  }
  const newPosition = posCreate.json.position || posCreate.json
  console.log(`B) puesto nuevo creado: ${newPosition.title}`)

  const createdB = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ action: 'create-session', positionId: newPosition.id }),
  })
  if (!createdB.json.session?.id) throw new Error(`create-session B: ${JSON.stringify(createdB.json).slice(0, 200)}`)
  const sessionIdB = createdB.json.session.id
  const startedB = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ sessionId: sessionIdB, action: 'start' }),
  })
  if (startedB.status !== 200) throw new Error(`start B: ${startedB.status}`)
  const templatesB = startedB.json.templates
  console.log(`   secciones: ${templatesB.map((t: any) => `${t.type}(${t.questionCount})`).join(' + ')}`)

  let stepB = 0
  while (stepB < templatesB.length) {
    const t = templatesB[stepB]
    for (const q of t.questions) {
      const isIpip = q.category.startsWith('IPIP_')
      const correct = q.type === 'MULTIPLE_CHOICE' && q.correctAnswer !== null && q.correctAnswer !== undefined
      const numericValue = isIpip ? 4 : (correct ? q.correctAnswer : 3)
      const value = q.type === 'MULTIPLE_CHOICE' ? String(correct ? q.correctAnswer : 0) : String(numericValue)
      const r = await api('/api/evaluations', {
        method: 'POST', headers: auth,
        body: JSON.stringify({ sessionId: sessionIdB, action: 'answer', questionId: q.id, value, numericValue }),
      })
      if (r.status !== 200) throw new Error(`answer B ${q.id}: ${r.status}`)
    }
    if (stepB === templatesB.length - 1) break
    const ns = await api('/api/evaluations', {
      method: 'POST', headers: auth,
      body: JSON.stringify({ sessionId: sessionIdB, action: 'next-step' }),
    })
    if (ns.status !== 200) throw new Error(`next-step B: ${ns.status}`)
    stepB++
  }
  const doneB = await api('/api/evaluations', {
    method: 'POST', headers: auth,
    body: JSON.stringify({ sessionId: sessionIdB, action: 'complete' }),
  })
  if (doneB.status !== 200) throw new Error(`complete B: ${doneB.status} ${JSON.stringify(doneB.json).slice(0, 200)}`)
  const rb = doneB.json.result
  console.log('B) evaluación completa completada')

  const checksB: Array<[string, boolean, string]> = [
    ['instrumentId correcto', rb.instrumentId === 'EVALHR-PERSONALIDAD-IPIP50-MX', String(rb.instrumentId)],
    ['raws IPIP (todas=4): E=30 A=32 C=32 ES=24 I=34',
      rb.extraversionRaw === 30 && rb.agreeablenessRaw === 32 && rb.conscientiousnessRaw === 32 && rb.emotionalStabilityRaw === 24 && rb.intellectRaw === 34,
      JSON.stringify({ e: rb.extraversionRaw, a: rb.agreeablenessRaw, c: rb.conscientiousnessRaw, es: rb.emotionalStabilityRaw, i: rb.intellectRaw })],
    ['legacy Big Five = 0 (separación)', rb.openness === 0 && rb.neuroticism === 0, `o=${rb.openness} n=${rb.neuroticism}`],
    // NOTA: defecto PREEXISTENTE del repo (NO tocado en A-01.2 por la regla
    // "no modificar otros instrumentos"): generate-templates.ts nunca persiste
    // correctAnswer en las preguntas de conocimientos generadas → knowledgeScore=0.
    ['knowledgeScore = 0 (defecto preexistente: correctAnswer no se persiste)', Math.round(rb.knowledgeScore ?? -1) === 0, String(rb.knowledgeScore)],
    ['integrityScore ≈ 50 (todo=3)', Math.round(rb.integrityScore ?? -1) === 50, String(rb.integrityScore)],
    ['overallScore = 25 = 0.5×(psic50+integ50)/2 + 0.5×0 — SIN IPIP', Math.round(rb.overallScore) === 25, String(rb.overallScore)],
    ['recommendation = PERFIL_COMPLETO', rb.recommendation === 'PERFIL_COMPLETO', String(rb.recommendation)],
    ['summary menciona IPIP-50 y tendencias', String(rb.summary || '').includes('IPIP-50') && String(rb.summary || '').includes('tendencias de respuesta'), String(rb.summary).slice(0, 80)],
    ['summary NO crea score global psicométrico', !/\bIPIP overall\b|overall psicométrico/i.test(String(rb.summary || '')), ''],
  ]
  for (const [name, ok, detail] of checksB) {
    console.log(`  ${ok ? '✅' : '❌'} ${name}${ok ? '' : ` — obtuvo: ${detail}`}`)
    if (!ok) failures++
  }

  console.log('=== E2E RESULTADO:', failures === 0 ? 'TODAS LAS VERIFICACIONES OK' : `${failures} FALLAS`, '===')
  process.exit(failures > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('E2E FAILED:', e)
  process.exit(1)
})
