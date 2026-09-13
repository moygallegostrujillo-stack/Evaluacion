// @ts-nocheck — A-05.3 verification tooling (Bun-only, not part of the Next.js build)
/**
 * EVALUHR — A-05.3 RETIRO CONTROLADO DEL BIG FIVE DEMO DE V1
 *
 * Usage:  bun scripts/a053-tests.ts
 *
 * Tests the CANONICAL OVERALL SCORE engine after A-05.3 (Personality excluded).
 * Pure-function tests — no dev server required.
 *
 * Covers (A-05.3 PASO 13):
 *   PERS-01  Nueva evaluación no genera Big Five (generator structural check)
 *   PERS-02  Nueva evaluación no obtiene personalityScore (BIG_FIVE not in included)
 *   PERS-03  Personality no entra overallScore
 *   PERS-04  includedSections no contiene Personality (BIG_FIVE)
 *   PERS-05  excludedSections contiene Personality cuando hay data
 *   PERS-06  excludedReason = PERSONALITY_NOT_APPROVED_FOR_V1
 *   PERS-07  Cliente intenta activar personalidad → rechazado/ignorado (structural)
 *   PERS-08  Cliente intenta enviar personalityScore → rechazado/ignorado (structural)
 *   PERS-09  Histórico con personalidad permanece idéntico (legacy preserved)
 *   PERS-10  formulaVersion histórica permanece (null → LEGACY, OVERALL-v1 → OVERALL-v1)
 *   PERS-11  No se instala IPIP (grep = 0)
 *   PERS-12  Knowledge permanece intacto (INSUFFICIENT → null, excluded)
 *   PERS-13  Integrity permanece aislada
 *   PERS-14  JobFit permanece sin implementación
 *
 * Covers (A-05.3 PASO 14 — regression):
 *   Case A: BF + PSY + KN → BF excluded, overall = (PSY+KN)/2
 *   Case B: PSY + KN → same calculation (equal split, no new weights)
 *   Case C: KN INSUFFICIENT → not 0, excluded
 *   Case D: Integrity present → excluded
 *   Case E: Solo una sección válida → documented behavior
 */

import { readFileSync } from 'fs'
import {
  calculateCanonicalOverallScore,
  buildCanonicalInput,
  instrument,
  OVERALL_FORMULA_VERSION,
  classifyOverallLineage,
  type CanonicalOverallInput,
} from '../src/lib/overall-score'

const results: Array<{ id: string; desc: string; expected: string; got: string; pass: boolean }> = []

function check(id: string, desc: string, expected: string, actual: unknown, pass: boolean) {
  results.push({ id, desc, expected, got: String(actual).slice(0, 220), pass })
  console.log(`${pass ? '✅' : '❌'} [${id}] ${desc} → ${String(actual).slice(0, 140)}`)
}
function assertTrue(id: string, desc: string, cond: boolean, detail = '') {
  check(id, desc, 'true', cond ? 'true' : `false ${detail}`, cond)
}
function assertEq(id: string, desc: string, expected: unknown, actual: unknown) {
  const pass = String(expected) === String(actual)
  check(id, desc, String(expected), actual, pass)
}

// ── Helpers ───────────────────────────────────────────────────────────
function mkInput(
  bf: number | null,
  psy: number | null,
  kn: number | null,
  knStatus: any,
  int: number | null
): CanonicalOverallInput {
  return buildCanonicalInput(
    { openness: bf ?? 0, conscientiousness: bf ?? 0, extraversion: bf ?? 0, agreeableness: bf ?? 0, neuroticism: bf ?? 0 },
    { stressLevel: psy ?? 0, empathy: psy ?? 0, adaptability: psy ?? 0, leadership: psy ?? 0, teamwork: psy ?? 0 },
    kn,
    knStatus,
    int ?? 0
  )
}

// ── PERS-01: Generator does not create Big Five for new V1 positions ──
function testPERS01() {
  // Structural: verify generate-templates.ts does NOT create PSICOMETRICA template
  const src = readFileSync('./src/lib/generate-templates.ts', 'utf-8')
  const hasPsicometricaCreate = src.includes("type: 'PSICOMETRICA'")
  // The BIG_FIVE_QUESTIONS array should still exist (LEGACY reference)
  const hasLegacyArray = src.includes('BIG_FIVE_QUESTIONS')
  // The comment should mark it as LEGACY/DEVELOPMENT_ONLY
  const hasLegacyComment = src.includes('LEGACY / DEVELOPMENT_ONLY')
  assertTrue('PERS-01', 'generator does NOT create PSICOMETRICA template for V1', !hasPsicometricaCreate, '(PSICOMETRICA template creation still present)')
  assertTrue('PERS-01b', 'BIG_FIVE_QUESTIONS retained as LEGACY reference', hasLegacyArray && hasLegacyComment)
}

// ── PERS-02: New evaluation does not obtain personalityScore in overall ──
function testPERS02() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertTrue('PERS-02', 'BIG_FIVE not in includedSections', !r.includedSections.includes('BIG_FIVE'))
}

// ── PERS-03: Personality does not enter overallScore ──
function testPERS03() {
  // Same PSY/KN/INT with BF=0 vs BF=99 → same overall (BF excluded)
  const lowBF = calculateCanonicalOverallScore(mkInput(0, 60, 80, 'VALID', 55))
  const highBF = calculateCanonicalOverallScore(mkInput(99, 60, 80, 'VALID', 55))
  assertEq('PERS-03', 'overall identical regardless of Big Five value', lowBF.score, highBF.score)
}

// ── PERS-04: includedSections does not contain Personality ──
function testPERS04() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertTrue('PERS-04', 'BIG_FIVE not in includedSections', !r.includedSections.includes('BIG_FIVE'))
}

// ── PERS-05: excludedSections contains Personality when there's data ──
function testPERS05() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertTrue('PERS-05', 'BIG_FIVE in excludedSections', r.excludedSections.includes('BIG_FIVE'))
}

// ── PERS-06: excludedReason = PERSONALITY_NOT_APPROVED_FOR_V1 ──
function testPERS06() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertEq('PERS-06', 'excludedReason for BIG_FIVE', 'PERSONALITY_NOT_APPROVED_FOR_V1', r.excludedReasons.BIG_FIVE)
}

// ── PERS-07: Client cannot activate personality ──
function testPERS07() {
  // Structural: the engine has no "enableBigFive" param; buildCanonicalInput
  // always passes BIG_FIVE to the engine which unconditionally excludes it.
  // There is no client-facing toggle to re-include BIG_FIVE.
  const r1 = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  const r2 = calculateCanonicalOverallScore(mkInput(0, 60, 80, 'VALID', 55))
  assertTrue('PERS-07', 'BIG_FIVE excluded regardless of score value', r1.excludedReasons.BIG_FIVE === r2.excludedReasons.BIG_FIVE)
}

// ── PERS-08: Client cannot send personalityScore ──
function testPERS08() {
  // Structural: the engine's buildCanonicalInput derives BIG_FIVE score from
  // persisted dimensions (aggregateBigFive), NOT from a client-supplied
  // "personalityScore" field. The API routes do not read personalityScore
  // from the request body.
  const applySrc = readFileSync('./src/app/api/public/apply/route.ts', 'utf-8')
  const evalSrc = readFileSync('./src/app/api/evaluations/route.ts', 'utf-8')
  const videoSrc = readFileSync('./src/app/api/public/video/route.ts', 'utf-8')
  const hasClientPersonalityScore =
    /body\.personalityScore|body\.bigFive/.test(applySrc) ||
    /body\.personalityScore|body\.bigFive/.test(evalSrc) ||
    /body\.personalityScore|body\.bigFive/.test(videoSrc)
  assertTrue('PERS-08', 'no client-supplied personalityScore in any route', !hasClientPersonalityScore)
}

// ── PERS-09: Historical with personality remains identical ──
function testPERS09() {
  // Legacy rows (formulaVersion=null) are never recalculated.
  // classifyOverallLineage(null) = LEGACY-OVERALL.
  assertEq('PERS-09', 'null formulaVersion → LEGACY-OVERALL (preserved)', 'LEGACY-OVERALL', classifyOverallLineage(null))
}

// ── PERS-10: formulaVersion historical remains ──
function testPERS10() {
  // OVERALL-v1 (A-04.5 era, personality included) is preserved as a distinct lineage
  assertEq('PERS-10', 'OVERALL-v1 → canonical A-04.5 (preserved)', 'OVERALL-v1', classifyOverallLineage('OVERALL-v1'))
  // OVERALL-v1.1 (A-05.3, personality excluded) is the new current
  assertEq('PERS-10b', 'OVERALL-v1.1 → canonical A-05.3 (current)', 'OVERALL-v1.1', classifyOverallLineage('OVERALL-v1.1'))
  // Current engine stamps OVERALL-v1.1
  assertEq('PERS-10c', 'current formulaVersion = OVERALL-v1.1', 'OVERALL-v1.1', OVERALL_FORMULA_VERSION)
}

// ── PERS-11: No IPIP installed ──
function testPERS11() {
  const src = readFileSync('./src/lib/overall-score.ts', 'utf-8')
  const genSrc = readFileSync('./src/lib/generate-templates.ts', 'utf-8')
  assertTrue('PERS-11', 'no IPIP in overall-score.ts', !/IPIP/i.test(src))
  assertTrue('PERS-11b', 'no IPIP in generate-templates.ts', !/IPIP/i.test(genSrc))
}

// ── PERS-12: Knowledge intact (INSUFFICIENT → null, excluded) ──
function testPERS12() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 50, 'INSUFFICIENT', 55))
  assertTrue('PERS-12', 'KN INSUFFICIENT excluded', !r.includedSections.includes('KNOWLEDGE'))
  assertEq('PERS-12b', 'KN exclusion reason', 'INSUFFICIENT', r.excludedReasons.KNOWLEDGE)
}

// ── PERS-13: Integrity isolated ──
function testPERS13() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertTrue('PERS-13', 'INTEGRITY excluded', r.excludedSections.includes('INTEGRITY'))
  assertEq('PERS-13b', 'INTEGRITY exclusion reason', 'INTEGRITY_NOT_APPROVED_FOR_OVERALL', r.excludedReasons.INTEGRITY)
}

// ── PERS-14: JobFit not implemented ──
function testPERS14() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  const keys = Object.keys(r)
  assertTrue('PERS-14', 'no JobFit field in result', !keys.some((k) => k.toLowerCase().includes('jobfit')))
}

// ── Case A: BF + PSY + KN → BF excluded, overall = (PSY+KN)/2 ──
function testCaseA() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  // BF excluded (PERSONALITY_NOT_APPROVED_FOR_V1), INT excluded
  // Included: PSY(60) + KN(80) → equal split = (60+80)/2 = 70
  assertEq('CASE-A', 'BF+PSY+KN → overall 70 (BF excluded, equal split PSY+KN)', 70, r.score)
  assertEq('CASE-A-b', 'includedSections = [PSY,KN]', 'PSYCHOLOGICAL,KNOWLEDGE', r.includedSections.join(','))
  assertEq('CASE-A-c', 'excludedSections = [BF,INT]', 'BIG_FIVE,INTEGRITY', r.excludedSections.sort().join(','))
}

// ── Case B: PSY + KN → same calculation (equal split, no new weights) ──
function testCaseB() {
  const r = calculateCanonicalOverallScore(mkInput(null, 60, 80, 'VALID', null))
  // PSY(60) + KN(80) → equal split = 70 (same as Case A, confirming no new weights)
  assertEq('CASE-B', 'PSY+KN → equal split 70 (no new weights)', 70, r.score)
}

// ── Case C: KN INSUFFICIENT → not 0, excluded ──
function testCaseC() {
  const r = calculateCanonicalOverallScore(mkInput(null, 60, 50, 'INSUFFICIENT', null))
  // KN INSUFFICIENT → excluded. Only PSY(60) → overall = 60 (single section)
  assertEq('CASE-C', 'KN INSUFFICIENT excluded, PSY alone → 60', 60, r.score)
  assertTrue('CASE-C-b', 'KN excluded', r.excludedSections.includes('KNOWLEDGE'))
  assertEq('CASE-C-c', 'KN reason', 'INSUFFICIENT', r.excludedReasons.KNOWLEDGE)
}

// ── Case D: Integrity present → excluded ──
function testCaseD() {
  const r = calculateCanonicalOverallScore(mkInput(null, 60, 80, 'VALID', 30))
  // INT excluded (INTEGRITY_NOT_APPROVED_FOR_OVERALL). PSY+KN → 70
  assertEq('CASE-D', 'INT present but excluded, PSY+KN → 70', 70, r.score)
  assertTrue('CASE-D-b', 'INT excluded', r.excludedSections.includes('INTEGRITY'))
}

// ── Case E: Solo una sección válida → documented behavior ──
function testCaseE() {
  // Only PSY present
  const r = calculateCanonicalOverallScore(mkInput(null, 60, null, null, null))
  // 1 section → that section's score = 60
  assertEq('CASE-E', 'single section (PSY60 → 60)', 60, r.score)
  assertEq('CASE-E-b', 'includedSections = [PSY]', 'PSYCHOLOGICAL', r.includedSections.join(','))
  // BF excluded with PERSONALITY_NOT_APPROVED_FOR_V1 even when null
  assertEq('CASE-E-c', 'BF excluded reason (no data)', 'PERSONALITY_NOT_APPROVED_FOR_V1', r.excludedReasons.BIG_FIVE)
}

// ── Determinism check (PASO 15) ──
function testDeterminism() {
  const input = mkInput(70, 60, 80, 'VALID', 55)
  const r1 = calculateCanonicalOverallScore(input)
  const r2 = calculateCanonicalOverallScore(input)
  assertEq('DET-1', 'same input → same score', r1.score, r2.score)
  assertEq('DET-2', 'same input → same formulaVersion', r1.formulaVersion, r2.formulaVersion)
}

// ── Run all tests ─────────────────────────────────────────────────────
function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  EVALUHR — A-05.3 PERSONALITY V1 RETIREMENT — TEST SUITE')
  console.log('═══════════════════════════════════════════════════════════════\n')

  testPERS01(); testPERS02(); testPERS03(); testPERS04(); testPERS05()
  testPERS06(); testPERS07(); testPERS08(); testPERS09(); testPERS10()
  testPERS11(); testPERS12(); testPERS13(); testPERS14()
  testCaseA(); testCaseB(); testCaseC(); testCaseD(); testCaseE()
  testDeterminism()

  const passed = results.filter((r) => r.pass).length
  const total = results.length
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log(`  RESULT: ${passed}/${total} passed`)
  if (passed < total) {
    console.log('  FAILED:')
    results.filter((r) => !r.pass).forEach((r) => {
      console.log(`    ❌ [${r.id}] ${r.desc} — expected ${r.expected}, got ${r.got}`)
    })
  }
  console.log('═══════════════════════════════════════════════════════════════')
  process.exit(passed === total ? 0 : 1)
}

main()
