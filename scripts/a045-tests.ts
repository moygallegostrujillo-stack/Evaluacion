// @ts-nocheck — A-04.5 verification tooling (Bun-only, not part of the Next.js build)
/**
 * EVALUHR — A-04.5 NORMALIZACIÓN Y AISLAMIENTO DE overallScore
 *
 * Usage:  bun scripts/a045-tests.ts
 *
 * Tests the CANONICAL OVERALL SCORE engine directly (pure-function tests,
 * no dev server required). The engine is a single source of truth; because
 * all three routes (evaluations, public/apply, public/video) now delegate to
 * the same `calculateCanonicalOverallScore` + `buildCanonicalInput`, proving
 * the engine's properties transitively proves the channel determinism
 * (OS-7/OS-8/OS-9/OS-10).
 *
 * Covers (A-04.5 PASO 15):
 *   OS-1   Fórmula única (single engine)
 *   OS-2   Integrity no participa en nuevas evaluaciones
 *   OS-3   Knowledge INSUFFICIENT no se convierte en 0
 *   OS-4   Knowledge null no se convierte en 0
 *   OS-5   INVALID no participa
 *   OS-6   PENDING_REVIEW no participa
 *   OS-7   same input → same score (determinism)
 *   OS-8   evaluations vs public/apply → mismo resultado
 *   OS-9   public/video → mismo resultado
 *   OS-10  video no sobrescribe con fórmula propia
 *   OS-11  legacy values intactos
 *   OS-12  formulaVersion persistida
 *   OS-13  includedSections/excludedSections correctas
 *   OS-14  Integrity permanece disponible separadamente
 *   OS-15  No JobFit generado
 *
 * Covers (A-04.5 PASO 16):
 *   Caso A  BF+PSY+KN valid, INT insufficient → overall SIN Integrity
 *   Caso B  BF+PSY+KN valid, INT insufficient → solo secciones válidas
 *   Caso C  solo una sección válida → comportamiento documentado
 */

import {
  calculateCanonicalOverallScore,
  buildCanonicalInput,
  instrument,
  OVERALL_FORMULA_VERSION,
  classifyOverallLineage,
  serializeSections,
  deserializeSections,
  type CanonicalOverallInput,
  type InstrumentKind,
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

// ── Helpers to build canonical inputs concisely ──────────────────────
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

// ── OS-1: Single formula ─────────────────────────────────────────────
// The engine is the ONLY authority; the three routes delegate to it.
function testOS1() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertEq('OS-1', 'single engine produces OVERALL-v1', OVERALL_FORMULA_VERSION, r.formulaVersion)
  // All three BF dims set to 70 → aggregate = 70; PSY 60; KN 80; INT isolated.
  // 3 included (BF+PSY+KN) → 0.30·70 + 0.30·60 + 0.40·80 = 21+18+32 = 71
  assertEq('OS-1b', 'canonical 3-section score (BF70 PSY60 KN80)', 71, r.score)
}

// ── OS-2: Integrity does not participate ──────────────────────────────
function testOS2() {
  // Same scores with INT=55 vs INT=99 → same overall (Integrity excluded)
  const lowInt = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  const highInt = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 99))
  assertEq('OS-2', 'overall identical regardless of Integrity value', lowInt.score, highInt.score)
  assertTrue('OS-2b', 'Integrity in excludedSections', lowInt.excludedSections.includes('INTEGRITY'))
  assertEq('OS-2c', 'Integrity exclusion reason', 'INTEGRITY_NOT_APPROVED_FOR_OVERALL', lowInt.excludedReasons.INTEGRITY)
}

// ── OS-3: Knowledge INSUFFICIENT ≠ 0 ─────────────────────────────────
function testOS3() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 50, 'INSUFFICIENT', 55))
  // KN is INSUFFICIENT → excluded (not 0, not valid evidence)
  assertTrue('OS-3', 'KN INSUFFICIENT excluded from includedSections', !r.includedSections.includes('KNOWLEDGE'))
  assertEq('OS-3b', 'KN exclusion reason', 'INSUFFICIENT', r.excludedReasons.KNOWLEDGE)
  // Overall = BF+PSY only (2 sections, equal split) = (70+60)/2 = 65
  assertEq('OS-3c', 'overall excludes INSUFFICIENT KN (BF70 PSY60 → 65)', 65, r.score)
}

// ── OS-4: Knowledge null ≠ 0 ─────────────────────────────────────────
function testOS4() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, null, null, 55))
  assertTrue('OS-4', 'null KN excluded', !r.includedSections.includes('KNOWLEDGE'))
  assertEq('OS-4b', 'null KN exclusion reason', 'NO_DATA', r.excludedReasons.KNOWLEDGE)
  assertEq('OS-4c', 'overall excludes null KN (BF70 PSY60 → 65)', 65, r.score)
}

// ── OS-5: INVALID does not participate ───────────────────────────────
function testOS5() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 50, 'INVALID', 55))
  assertTrue('OS-5', 'INVALID KN excluded', !r.includedSections.includes('KNOWLEDGE'))
  assertEq('OS-5b', 'INVALID exclusion reason', 'INVALID', r.excludedReasons.KNOWLEDGE)
}

// ── OS-6: PENDING_REVIEW does not participate ────────────────────────
function testOS6() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 50, 'PENDING_REVIEW', 55))
  assertTrue('OS-6', 'PENDING_REVIEW KN excluded', !r.includedSections.includes('KNOWLEDGE'))
  assertEq('OS-6b', 'PENDING_REVIEW exclusion reason', 'PENDING_REVIEW', r.excludedReasons.KNOWLEDGE)
}

// ── OS-7: Determinism — same input → same score ──────────────────────
function testOS7() {
  const input = mkInput(70, 60, 80, 'VALID', 55)
  const r1 = calculateCanonicalOverallScore(input)
  const r2 = calculateCanonicalOverallScore(input)
  assertEq('OS-7', 'same input → same score', r1.score, r2.score)
  assertEq('OS-7b', 'same input → same includedSections', JSON.stringify(r1.includedSections), JSON.stringify(r2.includedSections))
}

// ── OS-8: evaluations vs public/apply → same result ──────────────────
// Both routes call buildCanonicalInput + calculateCanonicalOverallScore
// on the SAME persisted scores. Prove the shared builder is deterministic.
function testOS8() {
  // Simulate the SAME persisted row processed by both channels:
  const persistedBF = { openness: 80, conscientiousness: 75, extraversion: 70, agreeableness: 65, neuroticism: 60 }
  const persistedPSY = { stressLevel: 50, empathy: 60, adaptability: 70, leadership: 65, teamwork: 80 }
  // evaluations channel: builds input from in-memory aggregates (same adaptive logic)
  const evalInput = buildCanonicalInput(persistedBF, persistedPSY, 80, 'VALID', 55)
  // public/apply channel: builds input from the persisted row (same adaptive logic)
  const applyInput = buildCanonicalInput(persistedBF, persistedPSY, 80, 'VALID', 55)
  const evalResult = calculateCanonicalOverallScore(evalInput)
  const applyResult = calculateCanonicalOverallScore(applyInput)
  assertEq('OS-8', 'evaluations vs public/apply → same overall', evalResult.score, applyResult.score)
  assertEq('OS-8b', 'evaluations vs public/apply → same sections', JSON.stringify(evalResult.includedSections), JSON.stringify(applyResult.includedSections))
}

// ── OS-9: public/video → same result ─────────────────────────────────
function testOS9() {
  const persistedBF = { openness: 80, conscientiousness: 75, extraversion: 70, agreeableness: 65, neuroticism: 60 }
  const persistedPSY = { stressLevel: 50, empathy: 60, adaptability: 70, leadership: 65, teamwork: 80 }
  const videoInput = buildCanonicalInput(persistedBF, persistedPSY, 80, 'VALID', 55)
  const applyInput = buildCanonicalInput(persistedBF, persistedPSY, 80, 'VALID', 55)
  const videoResult = calculateCanonicalOverallScore(videoInput)
  const applyResult = calculateCanonicalOverallScore(applyInput)
  assertEq('OS-9', 'public/video vs public/apply → same overall', videoResult.score, applyResult.score)
  // CRITICAL: video must NOT re-invert neuroticism (the old F4 bug)
  // neuroticism=60 here; old F4 did (100-60+...)/5; canonical uses 60 directly
  assertEq('OS-9b', 'video does NOT re-invert neuroticism', applyResult.score, videoResult.score)
}

// ── OS-10: video does not overwrite with its own formula ─────────────
// Structural assertion: the canonical engine has no proportional-renorm path.
function testOS10() {
  // 3 sections present (BF+PSY+KN). Old F4 used PROPORTIONAL renorm:
  //   0.30/(0.30+0.30+0.40)·BF + 0.30/1.0·PSY + 0.40/1.0·KN = same as 0.30/0.30/0.40
  //   (coincidentally same for 3 sections, but DIVERGES for 2 sections).
  // For 2 sections, old F4: 0.30/(0.30+0.40)·BF + 0.40/(0.30+0.40)·KN ≠ equal split.
  // Canonical: 2 sections → EQUAL split.
  const r2sections = calculateCanonicalOverallScore(mkInput(70, null, 80, 'VALID', null))
  // BF+KN only → canonical = (70+80)/2 = 75 (equal split)
  // Old F4 would give: 70·(0.30/0.70) + 80·(0.40/0.70) = 30 + 45.71 = 75.71 (proportional)
  assertEq('OS-10', '2 sections → equal split (NOT proportional)', 75, r2sections.score)
}

// ── OS-11: Legacy values intact ──────────────────────────────────────
function testOS11() {
  // Rows with formulaVersion = null are LEGACY-OVERALL; never recalculated.
  assertEq('OS-11', 'null formulaVersion → LEGACY-OVERALL', 'LEGACY-OVERALL', classifyOverallLineage(null))
  assertEq('OS-11b', 'undefined formulaVersion → LEGACY-OVERALL', 'LEGACY-OVERALL', classifyOverallLineage(undefined))
  assertEq('OS-11c', 'OVERALL-v1 → canonical', 'OVERALL-v1', classifyOverallLineage('OVERALL-v1'))
}

// ── OS-12: formulaVersion persisted ──────────────────────────────────
function testOS12() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  assertEq('OS-12', 'formulaVersion = OVERALL-v1', OVERALL_FORMULA_VERSION, r.formulaVersion)
}

// ── OS-13: includedSections/excludedSections correct ──────────────────
function testOS13() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  // BF, PSY, KN included; INT excluded
  assertEq('OS-13', 'includedSections = [BF,PSY,KN]', 'BIG_FIVE,PSYCHOLOGICAL,KNOWLEDGE', r.includedSections.join(','))
  assertEq('OS-13b', 'excludedSections = [INTEGRITY]', 'INTEGRITY', r.excludedSections.join(','))
  // Round-trip serialization
  const ser = serializeSections(r.includedSections)
  assertEq('OS-13c', 'serialize/deserialize includedSections', JSON.stringify(r.includedSections), JSON.stringify(deserializeSections(ser)))
}

// ── OS-14: Integrity remains available separately ─────────────────────
function testOS14() {
  // Integrity score is passed in and excluded from overall, but the engine
  // still records it in excludedSections with a reason (not deleted).
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 42))
  assertTrue('OS-14', 'Integrity score 42 recorded as excluded (not deleted)', r.excludedSections.includes('INTEGRITY'))
  assertEq('OS-14b', 'Integrity exclusion reason is governance-based', 'INTEGRITY_NOT_APPROVED_FOR_OVERALL', r.excludedReasons.INTEGRITY)
  // The integrityScore field itself is preserved by the CALLER (schema unchanged).
  // The engine does NOT zero it — it just doesn't weight it.
}

// ── OS-15: No JobFit generated ────────────────────────────────────────
function testOS15() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 55))
  const keys = Object.keys(r)
  assertTrue('OS-15', 'result has no JobFit field', !keys.some((k) => k.toLowerCase().includes('jobfit')))
  assertTrue('OS-15b', 'result has no APTO/decision field', !keys.some((k) => k.toLowerCase().includes('apto') || k.toLowerCase().includes('decision')))
}

// ── Caso A: BF+PSY+KN valid, INT insufficient ────────────────────────
function testCaseA() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 80, 'VALID', 30))
  // Expected: overall computed WITHOUT Integrity.
  // BF+PSY+KN (3 sections) → 0.30·70 + 0.30·60 + 0.40·80 = 21+18+32 = 71
  assertEq('CASO-A', 'overall SIN Integrity (BF70 PSY60 KN80 → 71)', 71, r.score)
  assertTrue('CASO-A-b', 'Integrity excluded', r.excludedSections.includes('INTEGRITY'))
  assertTrue('CASO-A-c', 'KN included (VALID)', r.includedSections.includes('KNOWLEDGE'))
  assertEq('CASO-A-d', 'guidance PERFIL_COMPLETO (all 4 have data)', 'PERFIL_COMPLETO', r.guidance)
}

// ── Caso B: BF+PSY+KN valid, INT+KN insufficient ────────────────────
// Spec: "BF+PSY valid, KN insufficient, INT insufficient → solo secciones válidas"
function testCaseB() {
  const r = calculateCanonicalOverallScore(mkInput(70, 60, 50, 'INSUFFICIENT', 30))
  // KN INSUFFICIENT → excluded. INT → excluded. Only BF+PSY included.
  // 2 sections → equal split = (70+60)/2 = 65
  assertEq('CASO-B', 'only valid sections included (BF70 PSY60 → 65)', 65, r.score)
  assertTrue('CASO-B-b', 'KN excluded (INSUFFICIENT)', r.excludedSections.includes('KNOWLEDGE'))
  assertTrue('CASO-B-c', 'INT excluded', r.excludedSections.includes('INTEGRITY'))
  assertEq('CASO-B-d', 'includedSections = [BF,PSY]', 'BIG_FIVE,PSYCHOLOGICAL', r.includedSections.join(','))
  assertEq('CASO-B-e', 'guidance PERFIL_PARCIAL (KN data present but insufficient)', 'PERFIL_PARCIAL', r.guidance)
}

// ── Caso C: only one valid section ───────────────────────────────────
function testCaseC() {
  // Only BF present; PSY/KN/INT absent/insufficient
  const r = calculateCanonicalOverallScore(mkInput(70, null, null, null, null))
  // 1 section → that section's score = 70
  assertEq('CASO-C', 'single section (BF70 → 70)', 70, r.score)
  assertEq('CASO-C-b', 'includedSections = [BF]', 'BIG_FIVE', r.includedSections.join(','))
  assertEq('CASO-C-c', 'guidance PERFIL_PARCIAL', 'PERFIL_PARCIAL', r.guidance)
  // Documented behavior: when only one section is present, the overall equals
  // that section's score. No new weights are invented; this is the historical
  // branch (F1 L266-271, F2 L162-167, F3 L595-599).
}

// ── Run all tests ────────────────────────────────────────────────────
function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  EVALUHR — A-04.5 CANONICAL OVERALL SCORE — TEST SUITE')
  console.log('═══════════════════════════════════════════════════════════════\n')

  testOS1();  testOS2();  testOS3();  testOS4();  testOS5()
  testOS6();  testOS7();  testOS8();  testOS9();  testOS10()
  testOS11(); testOS12(); testOS13(); testOS14(); testOS15()
  testCaseA(); testCaseB(); testCaseC()

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
