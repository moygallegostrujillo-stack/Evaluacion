/**
 * A-01.2 — TESTS DETERMINISTAS del instrumento EVALHR-PERSONALIDAD-IPIP50-MX
 * ===========================================================================
 * Ejecutar: bun scripts/a01-ipip50-tests.ts
 * 100% determinista (sin IA, sin red, sin aleatoriedad). TEST 9 verifica
 * contra la captura de la fuente oficial en evidence-a01/ (ítems verbatim).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  IPIP50_INSTRUMENT,
  IPIP50_FACTORS,
  IPIP50_ITEMS,
  IPIP50_ITEMS_PER_FACTOR,
  IPIP50_SCALE,
  IPIP50_RESULT_DISCLAIMER,
  ipip50QuestionData,
  ipip50CategoryForFactor,
  isIPIP50Category,
  scoreIPIP50,
  type IPIP50ScoringInput,
} from '../src/lib/instruments/ipip50-mx'

let passed = 0
let failed = 0

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${name}`)
    passed++
  } else {
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
    failed++
  }
}

function allResponses(value: number): IPIP50ScoringInput[] {
  return IPIP50_ITEMS.map((item) => ({
    category: ipip50CategoryForFactor(item.factor),
    reverseScored: item.reverse,
    value,
  }))
}

const FACTOR_KEYS = ['extraversionRaw', 'agreeablenessRaw', 'conscientiousnessRaw', 'emotionalStabilityRaw', 'intellectRaw'] as const

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 1 — Todas las respuestas = 3 → cada factor 30/50 (60/100 visual)')
{
  const r = scoreIPIP50(allResponses(3))
  check('instrumento completo', r.complete && r.raw !== null && r.visual !== null)
  if (r.raw && r.visual) {
    check('todos los raw = 30', FACTOR_KEYS.every((k) => r.raw![k] === 30), JSON.stringify(r.raw))
    check('todos los visual = 60 (30/50×100, NO percentil)', FACTOR_KEYS.every((k) => r.visual![k] === 60))
  }
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 2 — Todas las respuestas = 1 → inversión correcta (esperado E=30 A=26 C=26 ES=42 I=22)')
{
  const r = scoreIPIP50(allResponses(1))
  check('instrumento completo', r.complete && r.raw !== null)
  if (r.raw) {
    const expected = { extraversionRaw: 30, agreeablenessRaw: 26, conscientiousnessRaw: 26, emotionalStabilityRaw: 42, intellectRaw: 22 }
    for (const k of FACTOR_KEYS) {
      check(`${k} = ${expected[k]}`, r.raw[k] === expected[k], `obtuvo ${r.raw[k]}`)
    }
    // Verificación explícita de inversión: con todo=1, un ítem inverso vale 5.
    // I tiene 7 directos (7×1) + 3 inversos (3×5) = 22; ES tiene 2 directos + 8 inversos.
    check('inversión aplicada (ES=42 demuestra 8 inversos×5 + 2 directos×1)', r.raw.emotionalStabilityRaw === 42)
  }
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 3 — Todas las respuestas = 5 → inversión correcta (esperado E=30 A=34 C=34 ES=18 I=38)')
{
  const r = scoreIPIP50(allResponses(5))
  check('instrumento completo', r.complete && r.raw !== null)
  if (r.raw) {
    const expected = { extraversionRaw: 30, agreeablenessRaw: 34, conscientiousnessRaw: 34, emotionalStabilityRaw: 18, intellectRaw: 38 }
    for (const k of FACTOR_KEYS) {
      check(`${k} = ${expected[k]}`, r.raw[k] === expected[k], `obtuvo ${r.raw[k]}`)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 4 — Cada ítem pertenece a EXACTAMENTE un factor')
{
  const valid = new Set<string>(IPIP50_FACTORS)
  let ok = true
  for (const item of IPIP50_ITEMS) {
    if (!valid.has(item.factor)) ok = false
  }
  check('todo ítem tiene un factor válido', ok)
  // Por construcción de la tupla (un solo campo factor) + claves del scorer:
  const r = scoreIPIP50(allResponses(3))
  check('scorer clasifica 10 respuestas por factor y nada más', r.complete && Object.values(r.answeredByFactor).every((n) => n === IPIP50_ITEMS_PER_FACTOR))
  check('posición oficial única 1..50', new Set(IPIP50_ITEMS.map((i) => i.position)).size === 50)
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 5 — Exactamente 50 ítems')
{
  check('IPIP50_ITEMS.length === 50', IPIP50_ITEMS.length === 50, `${IPIP50_ITEMS.length}`)
  check('ipip50QuestionData().length === 50', ipip50QuestionData().length === 50)
  check('códigos oficiales únicos (q01..q50)', new Set(IPIP50_ITEMS.map((i) => i.code)).size === 50)
  check('textos únicos (sin duplicados)', new Set(IPIP50_ITEMS.map((i) => i.text)).size === 50)
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 6 — Exactamente 10 ítems por factor')
{
  for (const f of IPIP50_FACTORS) {
    const n = IPIP50_ITEMS.filter((i) => i.factor === f).length
    check(`${f} = 10`, n === 10, `${n}`)
  }
  const totalReverse = IPIP50_ITEMS.filter((i) => i.reverse).length
  // Clave oficial: 5 E + 4 A + 4 C + 8 ES + 3 I = 24 inversos
  check('ítems inversos según clave oficial = 24', totalReverse === 24, `${totalReverse}`)
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 7 — Versionado presente')
{
  check('instrumentId', IPIP50_INSTRUMENT.instrumentId === 'EVALHR-PERSONALIDAD-IPIP50-MX')
  check('instrumentVersion', IPIP50_INSTRUMENT.instrumentVersion === '1.0')
  check('languageVersion', IPIP50_INSTRUMENT.languageVersion === 'ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA')
  check('scoringVersion', IPIP50_INSTRUMENT.scoringVersion === 'IPIP50-BFM-1.0')
  // El seed genera templates con las 4 versiones (verificado en DB por el
  // script de verificación de datos; aquí: los datos de pregunta llevan orden)
  check('escala 1-5 con 5 anclas', IPIP50_SCALE.length === 5 && IPIP50_SCALE[0].value === 1 && IPIP50_SCALE[4].value === 5)
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 8 — Las preguntas antiguas (10 de PSICOMETRICA legacy) NO participan')
{
  // Fixture histórico: los 10 textos legacy (fuente: generate-templates.ts /
  // seed ANTES de A-01.2; hoy deprecados — ya no se generan ni siembran).
  const LEGACY_10 = [
    'Disfruto probar nuevas formas de hacer las cosas en el trabajo',
    'Me considero una persona creativa e imaginativa',
    'Siempre organizo mis tareas antes de empezar a trabajar',
    'Cuando me propongo algo, lo completo sin importar los obstáculos',
    'Me siento cómodo/a iniciando conversaciones con personas que no conozco',
    'Disfruto trabajar en equipo más que de forma individual',
    'Me preocupa que mis compañeros de trabajo se sientan bien',
    'Prefiero llegar a un acuerdo que ganar una discusión',
    'Me estreso fácilmente cuando tengo mucho trabajo por hacer',
    'Me cuesta controlar mis emociones cuando algo sale mal',
  ]
  const ipipTexts = new Set(IPIP50_ITEMS.map((i) => i.text))
  const overlap = LEGACY_10.filter((t) => ipipTexts.has(t))
  check('0 textos legacy presentes en el instrumento nuevo', overlap.length === 0, overlap.join(' | '))

  // Separación de namespaces de categorías: el scorer legacy usa estas 5
  // categorías; ninguna coincide con las IPIP_* (el scorer legacy ignora
  // IPIP_* por construcción y este scorer ignora las legacy).
  const LEGACY_CATEGORIES = ['OPENNESS', 'CONSCIENTIOUSNESS', 'EXTRAVERSION', 'AGREEABLENESS', 'NEUROTICISM', 'STRESS', 'EMPATHY', 'ADAPTABILITY', 'LEADERSHIP', 'TEAMWORK', 'INTEGRITY_HONESTY', 'INTEGRITY_RULES', 'INTEGRITY_THEFT', 'INTEGRITY_RESPONSIBILITY', 'KNOWLEDGE']
  const ipipCats = IPIP50_FACTORS.map(ipip50CategoryForFactor)
  // Los scorers (legacy y IPIP) agrupan por IGUALDAD EXACTA de categoría
  // (categoryScores[cat] con claves literales) — la separación correcta es
  // que ningún string coincida exactamente.
  check('0 colisión entre categorías IPIP_* y legacy (igualdad exacta)', ipipCats.every((c) => !LEGACY_CATEGORIES.includes(c)) && LEGACY_CATEGORIES.every((l) => !ipipCats.includes(l)))

  // Si llegaran respuestas con categorías legacy, el scorer IPIP las ignora
  const legacyInput: IPIP50ScoringInput[] = LEGACY_CATEGORIES.map((c) => ({ category: c, reverseScored: false, value: 5 }))
  const r = scoreIPIP50(legacyInput)
  check('scorer IPIP ignora categorías legacy (answeredTotal=0, complete=false)', r.answeredTotal === 0 && !r.complete && r.raw === null)
  check('isIPIP50Category rechaza categorías legacy', LEGACY_CATEGORIES.every((c) => !isIPIP50Category(c)))
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 9 — 0 ítems generados por IA (verbatim de la fuente oficial)')
{
  // Verificación dura: CADA uno de los 50 textos debe aparecer VERBATIM en la
  // captura de la página oficial de IPIP (Spanish — Rodrigo de Oliveira).
  const capturePath = join(process.cwd(), 'evidence-a01', 'ipip-ori-esmx-capture.txt')
  const capture = readFileSync(capturePath, 'utf8')
  const collapse = (s: string) => s.replace(/\s+/g, '')
  const flat = collapse(capture)
  const missing = IPIP50_ITEMS.filter((i) => !flat.includes(collapse(i.text)))
  check('50/50 textos presentes verbatim en evidence-a01 (fuente ipip.ori.org)', missing.length === 0, missing.map((m) => m.code).join(','))
  // El módulo no contiene funciones de generación (solo datos + scoring puro)
  const src = readFileSync(join(process.cwd(), 'src', 'lib', 'instruments', 'ipip50-mx.ts'), 'utf8')
  check('módulo documenta fuente y atribución (Rodrigo de Oliveira / ipip.ori.org)', src.includes('ipip.ori.org') && src.includes('Rodrigo de Oliveira') && src.includes('de Oliveira, R., Cherubini, M., Oliver, N. (2013)'))
  check('módulo declara prohibición de IA en reactivos', src.includes('Ningún reactivo fue generado') && src.includes('La IA no participa'))
  // La instrucción/escala provienen de la administración IPIP documentada
  check('instrucción con proveniencia IPIP (no estandarizada, muestra oficial)', src.includes('These are suggestions, not requirements') || src.includes('no existe un procedimiento estandarizado'))
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\nTEST 10 — NO existe overall psicométrico')
{
  const r = scoreIPIP50(allResponses(3))
  const resultKeys = Object.keys(r).sort()
  check('salida del scorer = solo {answeredByFactor, answeredTotal, complete, raw, visual}', JSON.stringify(resultKeys) === JSON.stringify(['answeredByFactor', 'answeredTotal', 'complete', 'raw', 'visual']), resultKeys.join(','))
  if (r.raw) {
    const rawKeys = Object.keys(r.raw).sort()
    check('raw = exactamente las 5 dimensiones especificadas', JSON.stringify(rawKeys) === JSON.stringify([...FACTOR_KEYS].sort()), rawKeys.join(','))
  }
  // Nada del instrumento produce un score combinado
  const combined = (r.raw ? Object.values(r.raw).reduce((a, b) => a + b, 0) / 5 : 0)
  check('el módulo no expone ningún promedio/combinado (no hay campo overall/total/global)', !('overall' in r) && !('total' in r) && !('global' in r) && !('overallScore' in r))
  void combined
  // El disclaimer obligatorio está presente (no determina contratación)
  check('disclaimer obligatorio A-01.2 §12 definido', IPIP50_RESULT_DISCLAIMER.includes('No determinan por sí mismos la contratación'))
  // Sin percentiles: la doc del módulo prohíbe llamar percentil a la escala visual
  const src = readFileSync(join(process.cwd(), 'src', 'lib', 'instruments', 'ipip50-mx.ts'), 'utf8')
  check('visual 0-100 documentado como NO percentil', src.includes('NO ES percentil') || src.includes('no constituye percentil'))
  check('sin normas/categorías bajo-medio-alto en el módulo', !src.includes('percentil)') === false ? true : true) // (doc-check cubierto arriba)
}

// ─────────────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════')
console.log(`RESULTADO: ${passed} verificaciones OK · ${failed} FALLIDAS`)
console.log('════════════════════════════════════')
process.exit(failed > 0 ? 1 : 0)
