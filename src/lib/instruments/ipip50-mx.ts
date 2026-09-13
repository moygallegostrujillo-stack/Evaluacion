/**
 * ============================================================================
 * EVALHR-PERSONALIDAD-IPIP50-MX
 * IPIP Big-Five Factor Markers — 50 items — Spanish (Mexican)
 * ============================================================================
 *
 * FUENTE (NO MODIFICAR — reactivos verbatim, dominio público IPIP):
 *   - IPIP (International Personality Item Pool), "Spanish Translation of the
 *     Lexical Big-Five Factor Markers", proporcionada por Rodrigo de Oliveira.
 *     https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm
 *     (enlazada desde https://ipip.ori.org/newTranslations.htm)
 *   - Referencia: de Oliveira, R., Cherubini, M., Oliver, N. (2013).
 *     "Influence of personality on satisfaction with mobile phone services."
 *     ACM Transactions on Computer-Human Interaction, 20(2), Article 10,
 *     10:1-10:23. DOI: 10.1145/2463579.2463581
 *   - Clave de corrección oficial (ítems inversos con sufijo "r") verificada
 *     contra https://ipip.ori.org/new_ipip-50-item-scale.htm
 *   - Captura de evidencia: evidence-a01/ (fecha de captura 2026-09-07)
 *
 * AUTORÍA: los reactivos y la traducción NO son de EvaluHR. EvaluHR los
 * reproduce verbatim (dominio público IPIP) con la atribución anterior.
 *
 * REGLAS PSICOMÉTRICAS DE ESTE MÓDULO:
 *   1. Los 50 textos son VERBATIM de la fuente. Ningún reactivo fue generado
 *      o alterado por IA o por humanos de EvaluHR.
 *   2. Escala de respuesta 1-5 (exactitud), anclas oficiales IPIP renderizadas
 *      al español (la administración IPIP no está estandarizada; IPIP publica
 *      la instrucción de muestra usada aquí — ver IPIP50_INSTRUCTIONS).
 *   3. Inversión SOLO en los 24 ítems marcados `reverse` según la clave
 *      oficial (6 - valor).
 *   4. Puntaje por factor = SUMA de sus 10 ítems (rango 10-50). Sin pesos.
 *   5. NO existen pesos de selección laboral, NO hay normas, NO hay
 *      percentiles, NO hay categorías bajo/medio/alto, NO hay score global.
 *   6. La IA no participa en generación, scoring ni interpretación.
 *
 * Este módulo es puro (sin I/O, sin dependencias) — usable en servidor,
 * cliente y scripts de verificación deterministas.
 * ============================================================================
 */

// ── Versionado del instrumento (A-01.2 §9) ─────────────────────────────────

export const IPIP50_INSTRUMENT = {
  instrumentId: 'EVALHR-PERSONALIDAD-IPIP50-MX',
  instrumentVersion: '1.0',
  languageVersion: 'ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA',
  scoringVersion: 'IPIP50-BFM-1.0',
} as const

export type IPIP50Factor =
  | 'EXTRAVERSION'
  | 'AGREEABLENESS'
  | 'CONSCIENTIOUSNESS'
  | 'EMOTIONAL_STABILITY'
  | 'INTELLECT'

export const IPIP50_FACTORS: readonly IPIP50Factor[] = [
  'EXTRAVERSION',
  'AGREEABLENESS',
  'CONSCIENTIOUSNESS',
  'EMOTIONAL_STABILITY',
  'INTELLECT',
] as const

/** Número de ítems por factor (clave oficial: 10 c/u). */
export const IPIP50_ITEMS_PER_FACTOR = 10

/** Rango de respuesta oficial. */
export const IPIP50_SCALE_MIN = 1
export const IPIP50_SCALE_MAX = 5

/**
 * Categorías usadas en la columna Question.category para los ítems de este
 * instrumento. El prefijo "IPIP_" garantiza separación total (test TEST 8)
 * frente a las categorías legacy (OPENNESS, CONSCIENTIOUSNESS, EXTRAVERSION,
 * AGREEABLENESS, NEUROTICISM, STRESS, EMPATHY, …) y evita que el scoring
 * legacy o el de este instrumento se contaminen mutuamente.
 */
export function ipip50CategoryForFactor(factor: IPIP50Factor): string {
  return `IPIP_${factor}`
}

/** ¿La categoría pertenece a este instrumento? */
export function isIPIP50Category(category: string | null | undefined): boolean {
  return typeof category === 'string' && category.startsWith('IPIP_')
}

// ── Los 50 reactivos (VERBATIM — fuente: ipip.ori.org / Rodrigo de Oliveira) ─

export interface IPIP50Item {
  /** Posición oficial del ítem en el inventario (1-50, orden oficial IPIP). */
  position: number
  /** Código oficial del ítem en la fuente (sufijo "r" = ítem inverso). */
  code: string
  factor: IPIP50Factor
  /** true = ítem inverso según la clave oficial (se puntúa 6 − valor). */
  reverse: boolean
  /** Texto VERBATIM de la versión Spanish (Mexican) — Rodrigo de Oliveira. */
  text: string
}

const ITEM = (
  position: number,
  code: string,
  factor: IPIP50Factor,
  reverse: boolean,
  text: string
): IPIP50Item => ({ position, code, factor, reverse, text })

export const IPIP50_ITEMS: readonly IPIP50Item[] = [
  // ── Orden oficial 1-50 (mezcla de factores según el inventario IPIP) ──
  ITEM(1,  'q01',  'EXTRAVERSION',        false, 'Soy el alma de la fiesta'),
  ITEM(2,  'q02r', 'AGREEABLENESS',       true,  'Me preocupo poco por los demás'),
  ITEM(3,  'q03',  'CONSCIENTIOUSNESS',   false, 'Siempre estoy preparado'),
  ITEM(4,  'q04r', 'EMOTIONAL_STABILITY', true,  'Me estreso con facilidad'),
  ITEM(5,  'q05',  'INTELLECT',           false, 'Tengo un vocabulario amplio'),
  ITEM(6,  'q06r', 'EXTRAVERSION',        true,  'No hablo mucho'),
  ITEM(7,  'q07',  'AGREEABLENESS',       false, 'Me intereso por la gente'),
  ITEM(8,  'q08r', 'CONSCIENTIOUSNESS',   true,  'Dejo mis pertenencias en cualquier lado'),
  ITEM(9,  'q09',  'EMOTIONAL_STABILITY', false, 'Estoy relajado la mayor parte del tiempo'),
  ITEM(10, 'q10r', 'INTELLECT',           true,  'Me cuesta entender ideas abstractas'),
  ITEM(11, 'q11',  'EXTRAVERSION',        false, 'Me siento cómodo con la gente'),
  ITEM(12, 'q12r', 'AGREEABLENESS',       true,  'Ofendo a la gente'),
  ITEM(13, 'q13',  'CONSCIENTIOUSNESS',   false, 'Pongo atención en los detalles'),
  ITEM(14, 'q14r', 'EMOTIONAL_STABILITY', true,  'Me preocupo por todo'),
  ITEM(15, 'q15',  'INTELLECT',           false, 'Tengo mucha imaginación'),
  ITEM(16, 'q16r', 'EXTRAVERSION',        true,  'Prefiero mantenerme al margen'),
  ITEM(17, 'q17',  'AGREEABLENESS',       false, 'Soy sensible hacia las emociones de otros'),
  ITEM(18, 'q18r', 'CONSCIENTIOUSNESS',   true,  'Soy desordenado'),
  ITEM(19, 'q19',  'EMOTIONAL_STABILITY', false, 'Rara vez me siento triste'),
  ITEM(20, 'q20r', 'INTELLECT',           true,  'No me interesan las ideas abstractas'),
  ITEM(21, 'q21',  'EXTRAVERSION',        false, 'Comienzo las conversaciones'),
  ITEM(22, 'q22r', 'AGREEABLENESS',       true,  'No me interesan los problemas de otras personas'),
  ITEM(23, 'q23',  'CONSCIENTIOUSNESS',   false, 'Realizo mis tareas inmediatamente'),
  ITEM(24, 'q24r', 'EMOTIONAL_STABILITY', true,  'Me molesto fácilmente'),
  ITEM(25, 'q25',  'INTELLECT',           false, 'Tengo excelentes ideas'),
  ITEM(26, 'q26r', 'EXTRAVERSION',        true,  'No tengo mucho que decir'),
  ITEM(27, 'q27',  'AGREEABLENESS',       false, 'Tengo un corazón sensible'),
  ITEM(28, 'q28r', 'CONSCIENTIOUSNESS',   true,  'A menudo olvido poner las cosas en su lugar'),
  ITEM(29, 'q29r', 'EMOTIONAL_STABILITY', true,  'Me disgusto con facilidad'),
  ITEM(30, 'q30r', 'INTELLECT',           true,  'No tengo una buena imaginación'),
  ITEM(31, 'q31',  'EXTRAVERSION',        false, 'En las fiestas hablo con muchas personas diferentes'),
  ITEM(32, 'q32r', 'AGREEABLENESS',       true,  'En realidad no me intereso por los demás'),
  ITEM(33, 'q33',  'CONSCIENTIOUSNESS',   false, 'Me gusta el orden'),
  ITEM(34, 'q34r', 'EMOTIONAL_STABILITY', true,  'Cambio mucho de humor'),
  ITEM(35, 'q35',  'INTELLECT',           false, 'Soy rápido para entender las cosas'),
  ITEM(36, 'q36r', 'EXTRAVERSION',        true,  'No me gusta llamar la atención'),
  ITEM(37, 'q37',  'AGREEABLENESS',       false, 'Dedico tiempo a los demás'),
  ITEM(38, 'q38r', 'CONSCIENTIOUSNESS',   true,  'Evado mis obligaciones'),
  ITEM(39, 'q39r', 'EMOTIONAL_STABILITY', true,  'Tengo cambios frecuentes de estado de ánimo'),
  ITEM(40, 'q40',  'INTELLECT',           false, 'Utilizo palabras difíciles'),
  ITEM(41, 'q41',  'EXTRAVERSION',        false, 'No me importa ser el centro de atención'),
  ITEM(42, 'q42',  'AGREEABLENESS',       false, 'Siento las emociones de los otros'),
  ITEM(43, 'q43',  'CONSCIENTIOUSNESS',   false, 'Hago un programa y lo sigo'),
  ITEM(44, 'q44r', 'EMOTIONAL_STABILITY', true,  'Me irrito fácilmente'),
  ITEM(45, 'q45',  'INTELLECT',           false, 'Dedico tiempo a reflexionar'),
  ITEM(46, 'q46r', 'EXTRAVERSION',        true,  'Cuando estoy entre desconocidos me mantengo callado'),
  ITEM(47, 'q47',  'AGREEABLENESS',       false, 'Hago sentir cómoda a la gente'),
  ITEM(48, 'q48',  'CONSCIENTIOUSNESS',   false, 'Soy perfeccionista en mi trabajo'),
  ITEM(49, 'q49r', 'EMOTIONAL_STABILITY', true,  'Me siento triste frecuentemente'),
  ITEM(50, 'q50',  'INTELLECT',           false, 'Estoy lleno de ideas'),
] as const

// ── Instrucción y escala (administración IPIP — ver evidencia A-01.2) ───────

/**
 * Instrucción de administración. IPIP no estandariza instrucciones
 * ("These are suggestions, not requirements") y publica una instrucción de
 * muestra oficial para el inventario de 50 ítems; esta es su renderización
 * al español, sin alterar los reactivos. Texto oficial EN en evidence-a01/.
 */
export const IPIP50_INSTRUCTIONS =
  'Describe cómo eres en general en este momento, no cómo te gustaría ser ' +
  'en el futuro. Descríbete a ti mismo/a de manera honesta, en relación con ' +
  'otras personas que conozcas de tu mismo sexo y aproximadamente de tu ' +
  'misma edad. Para que puedas describirte con honestidad, tus respuestas ' +
  'se mantendrán en absoluta confidencialidad. Para cada afirmación indica ' +
  'qué tan inexacta o exacta es como descripción de ti.'

/** Anclas oficiales de la escala 1-5 (exactitud). */
export const IPIP50_SCALE: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: 'Muy inexacta' },
  { value: 2, label: 'Moderadamente inexacta' },
  { value: 3, label: 'Ni exacta ni inexacta' },
  { value: 4, label: 'Moderadamente exacta' },
  { value: 5, label: 'Muy exacta' },
]

/** Texto fijo que debe ver el candidato (A-01.2 §11). */
export const IPIP50_CANDIDATE_TITLE = 'Evaluación de Personalidad — Modelo Big Five'

/** Aviso obligatorio en resultados RH (A-01.2 §12, texto literal). */
export const IPIP50_RESULT_DISCLAIMER =
  'Estos resultados describen tendencias de respuesta en las dimensiones ' +
  'evaluadas y constituyen información técnica de apoyo. No determinan por ' +
  'sí mismos la contratación o no contratación de una persona.'

/** Etiquetas de visualización de las 5 dimensiones (A-01.2 §12). */
export const IPIP50_DIMENSIONS: ReadonlyArray<{ key: IPIP50Factor; label: string }> = [
  { key: 'EXTRAVERSION', label: 'Extraversión' },
  { key: 'AGREEABLENESS', label: 'Amabilidad' },
  { key: 'CONSCIENTIOUSNESS', label: 'Responsabilidad' },
  { key: 'EMOTIONAL_STABILITY', label: 'Estabilidad emocional' },
  { key: 'INTELLECT', label: 'Intelecto' },
]

// ── Generación de preguntas (para templates / seed) ─────────────────────────

export interface IPIP50QuestionData {
  text: string
  category: string
  order: number
  reverseScored: boolean
}

/**
 * Datos de las 50 preguntas para crearlas en Question (orden oficial 1-50).
 * `order` = posición oficial del ítem (usada como clave de scoring).
 */
export function ipip50QuestionData(): IPIP50QuestionData[] {
  return IPIP50_ITEMS.map((item) => ({
    text: item.text,
    category: ipip50CategoryForFactor(item.factor),
    order: item.position,
    reverseScored: item.reverse,
  }))
}

// ── Scoring (puro, determinista — A-01.2 §6) ────────────────────────────────

export interface IPIP50ScoringInput {
  /** Categoría de la pregunta (debe ser IPIP_*). */
  category: string
  reverseScored: boolean
  /** Respuesta numérica 1-5. */
  value: number
}

export interface IPIP50RawScores {
  extraversionRaw: number
  agreeablenessRaw: number
  conscientiousnessRaw: number
  emotionalStabilityRaw: number
  intellectRaw: number
}

export interface IPIP50ScoreResult {
  /** Sumas por factor (10-50). Solo presentes si el instrumento está completo. */
  raw: IPIP50RawScores | null
  /**
   * Representación visual 0-100 = raw / max * 100 (raw/50*100).
   * NO ES percentil. NO implica norma poblacional.
   */
  visual: IPIP50RawScores | null
  /** Ítems con respuesta válida por factor. */
  answeredByFactor: Record<IPIP50Factor, number>
  /** true solo si los 10 ítems de CADA factor tienen respuesta válida. */
  complete: boolean
  /** Total de respuestas IPIP válidas (0-50). */
  answeredTotal: number
}

const EMPTY_ANSWERED: Record<IPIP50Factor, number> = {
  EXTRAVERSION: 0,
  AGREEABLENESS: 0,
  CONSCIENTIOUSNESS: 0,
  EMOTIONAL_STABILITY: 0,
  INTELLECT: 0,
}

/**
 * Convierte puntajes crudos (10-50) a la representación visual 0-100
 * (raw / max * 100). NO es percentil y NO implica norma poblacional.
 */
export function ipip50VisualFromRaw(rawScores: IPIP50RawScores): IPIP50RawScores {
  const toVisual = (rawValue: number): number =>
    Math.round((rawValue / (IPIP50_ITEMS_PER_FACTOR * IPIP50_SCALE_MAX)) * 100 * 100) / 100
  return {
    extraversionRaw: toVisual(rawScores.extraversionRaw),
    agreeablenessRaw: toVisual(rawScores.agreeablenessRaw),
    conscientiousnessRaw: toVisual(rawScores.conscientiousnessRaw),
    emotionalStabilityRaw: toVisual(rawScores.emotionalStabilityRaw),
    intellectRaw: toVisual(rawScores.intellectRaw),
  }
}

/**
 * Scoring oficial IPIP-50: por cada ítem, v' = reverse ? 6 - v : v;
 * puntaje del factor = suma de sus 10 v'. Sin pesos, sin normas.
 * Clamps defensivos: valores fuera de 1-5 se recortan al rango oficial.
 * La función NO produce ningún score combinado/global (TEST 10).
 */
export function scoreIPIP50(responses: readonly IPIP50ScoringInput[]): IPIP50ScoreResult {
  const sums: Record<IPIP50Factor, number> = {
    EXTRAVERSION: 0,
    AGREEABLENESS: 0,
    CONSCIENTIOUSNESS: 0,
    EMOTIONAL_STABILITY: 0,
    INTELLECT: 0,
  }
  const answered = { ...EMPTY_ANSWERED }

  for (const resp of responses) {
    if (!isIPIP50Category(resp.category)) continue
    const factor = resp.category.slice('IPIP_'.length) as IPIP50Factor
    if (!(factor in sums)) continue
    const v = Math.max(IPIP50_SCALE_MIN, Math.min(IPIP50_SCALE_MAX, Math.round(resp.value)))
    const scored = resp.reverseScored
      ? IPIP50_SCALE_MIN + IPIP50_SCALE_MAX - v
      : v
    sums[factor] += scored
    answered[factor] += 1
  }

  const answeredTotal = (Object.values(answered) as number[]).reduce((a, b) => a + b, 0)
  const complete = IPIP50_FACTORS.every((f) => answered[f] === IPIP50_ITEMS_PER_FACTOR)

  if (!complete) {
    return { raw: null, visual: null, answeredByFactor: answered, complete: false, answeredTotal }
  }

  const raw: IPIP50RawScores = {
    extraversionRaw: sums.EXTRAVERSION,
    agreeablenessRaw: sums.AGREEABLENESS,
    conscientiousnessRaw: sums.CONSCIENTIOUSNESS,
    emotionalStabilityRaw: sums.EMOTIONAL_STABILITY,
    intellectRaw: sums.INTELLECT,
  }

  const toVisual = (rawValue: number): number =>
    Math.round((rawValue / (IPIP50_ITEMS_PER_FACTOR * IPIP50_SCALE_MAX)) * 100 * 100) / 100

  const visual: IPIP50RawScores = {
    extraversionRaw: toVisual(raw.extraversionRaw),
    agreeablenessRaw: toVisual(raw.agreeablenessRaw),
    conscientiousnessRaw: toVisual(raw.conscientiousnessRaw),
    emotionalStabilityRaw: toVisual(raw.emotionalStabilityRaw),
    intellectRaw: toVisual(raw.intellectRaw),
  }

  return { raw, visual, answeredByFactor: answered, complete: true, answeredTotal }
}

/**
 * Convierte respuestas de DB (Question/EvaluationResponse o
 * VacancyApplicationResponse) a la entrada del scorer. El mapeo usa la
 * categoría IPIP_* y el flag reverseScored almacenados en Question.
 * `value` acepta numericValue o el valor textual parseado.
 */
export function toIPIP50ScoringInput(
  rows: ReadonlyArray<{ category: string | null; reverseScored: boolean; numericValue: number | null; value: string }>
): IPIP50ScoringInput[] {
  return rows
    .filter((r) => isIPIP50Category(r.category))
    .map((r) => ({
      category: r.category as string,
      reverseScored: r.reverseScored,
      value: r.numericValue ?? parseInt(r.value, 10) ?? 3,
    }))
}

// ── Resumen orientativo para resultados (texto, sin decisión de contratación)

export interface IPIP50SummaryContext {
  /** Dimensiones 0-100 visuales del instrumento completo. */
  visual: IPIP50RawScores
  guidance: 'PERFIL_COMPLETO' | 'PERFIL_PARCIAL' | 'PENDIENTE'
  hasPsychData: boolean
  hasIntegrityData: boolean
  knowledgeScore: number | null
  integrityScore: number | null
}

/**
 * Resumen orientativo para sesiones administradas con IPIP-50.
 * Solo describe tendencias de respuesta y secciones completadas;
 * no emite juicios normativos ni decisiones de contratación
 * (LFPDPPP Art. 37 Bis). Es un generador NUEVO para el instrumento NUEVO —
 * el generador legacy (generateSummary) permanece intacto y no se invoca
 * para sesiones IPIP.
 */
export function buildIPIP50Summary(ctx: IPIP50SummaryContext): string {
  const parts: string[] = []

  if (ctx.guidance === 'PERFIL_PARCIAL') {
    const administered: string[] = ['Evaluación de Personalidad (Big Five - IPIP-50)']
    if (ctx.hasPsychData) administered.push('evaluación psicológica')
    if (ctx.hasIntegrityData) administered.push('evaluación de integridad')
    if (ctx.knowledgeScore !== null) administered.push('evaluación de conocimientos')
    parts.push(`Perfil basado en ${administered.join(', ')}. `)
  } else if (ctx.guidance === 'PERFIL_COMPLETO') {
    parts.push(
      'Perfil basado en Evaluación de Personalidad (Big Five - IPIP-50), evaluación psicológica, de integridad y de conocimientos. '
    )
  }

  const dims = IPIP50_DIMENSIONS.map((d) => {
    const rawValue =
      d.key === 'EXTRAVERSION' ? ctx.visual.extraversionRaw
      : d.key === 'AGREEABLENESS' ? ctx.visual.agreeablenessRaw
      : d.key === 'CONSCIENTIOUSNESS' ? ctx.visual.conscientiousnessRaw
      : d.key === 'EMOTIONAL_STABILITY' ? ctx.visual.emotionalStabilityRaw
      : ctx.visual.intellectRaw
    return `${d.label} ${Math.round(rawValue)}/100`
  })
  parts.push(`Dimensiones de personalidad (tendencias de respuesta): ${dims.join(', ')}. `)

  if (ctx.hasIntegrityData && ctx.integrityScore !== null) {
    parts.push(
      ctx.integrityScore >= 70
        ? 'Integridad orientativa sobresaliente. '
        : ctx.integrityScore < 40
          ? 'Se sugiere explorar en entrevista aspectos relacionados con integridad y honradez. '
          : ''
    )
  }

  if (ctx.knowledgeScore !== null) {
    if (ctx.knowledgeScore >= 80) parts.push('Conocimientos técnicos sobresalientes. ')
    else if (ctx.knowledgeScore >= 60) parts.push('Conocimientos técnicos sólidos. ')
    else if (ctx.knowledgeScore >= 40) parts.push('Conocimientos técnicos en desarrollo; puede fortalecerse con capacitación. ')
    else parts.push('Conocimientos técnicos con oportunidad de mejora significativa. ')
  }

  parts.push(
    'Esta evaluación proporciona orientación informativa. La decisión final corresponde al área de Recursos Humanos.'
  )

  return parts.filter(Boolean).join('')
}
