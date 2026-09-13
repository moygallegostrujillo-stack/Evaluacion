/**
 * A-03.2 — Banco de claves del sistema para conocimientos (SYSTEM KNOWLEDGE BANK).
 *
 * Fuente única de claves + rationale + gobernanza para los reactivos de
 * conocimiento provistos por el sistema (generate-templates.ts y prisma/seed.ts).
 *
 * PASO 4 (fuente de correctAnswer): las claves provienen de
 * ELABORACION_REVISADA — contenido del sistema establecido y revisado por la
 * gobernanza humana de la fase A-03.2, con justificación documental por
 * reactivo. La IA NO participa (PASO 5): no hay generación ni aprobación
 * automática de claves en este módulo.
 *
 * PASO 3: un reactivo sin clave NO puede publicarse (ACTIVE) — el generador
 * y el seed solo crean reactivos ACTIVE cuando existe clave resuelta.
 */

/** Versión de la regla de scoring de conocimientos (A-03.2 PASO 9). */
export const KNOWLEDGE_SCORING_VERSION = 'KNOWLEDGE-SCORING-1.0'

/**
 * Claves + rationale por (categoría:orden) para las categorías del banco que
 * no las declaraban originalmente (COCINERO, BARTENDER, GERENTE_PISO,
 * VENDEDOR) y rationale documental para GENERAL.
 */
export const KNOWLEDGE_KEY_ADDENDUM: Record<string, { correctAnswer: number; rationale: string }> = {
  // COCINERO (10)
  'COCINERO:1': { correctAnswer: 2, rationale: 'Norma de cocción segura de aves: temperatura interna mínima 74°C.' },
  'COCINERO:2': { correctAnswer: 1, rationale: 'Definición estándar: transferencia de bacterias de un alimento a otro.' },
  'COCINERO:3': { correctAnswer: 1, rationale: 'Terminología clásica de cocina: brunoise = corte en cubos pequeños.' },
  'COCINERO:4': { correctAnswer: 1, rationale: 'Regla de refrigeración: crudos de riesgo (pollo) abajo, listos para consumo arriba — evita goteo contaminante.' },
  'COCINERO:5': { correctAnswer: 1, rationale: 'Regla de inocuidad: alimento caído al suelo se desecha (no se rescata).' },
  'COCINERO:6': { correctAnswer: 1, rationale: 'Definición de mise en place: organización y preparación previa al cocinar.' },
  'COCINERO:7': { correctAnswer: 1, rationale: 'Regla de zona de peligro: máximo 2 horas fuera de refrigeración.' },
  'COCINERO:8': { correctAnswer: 1, rationale: 'Técnica de reducción: concentrar sabor evaporando parte del líquido.' },
  'COCINERO:9': { correctAnswer: 1, rationale: 'Higiene: lavado antes de cocinar y después de manipular crudos.' },
  'COCINERO:10': { correctAnswer: 1, rationale: 'Convención de tablas por color: roja para aves/pollo.' },
  // BARTENDER (10)
  'BARTENDER:1': { correctAnswer: 1, rationale: 'Técnica de muddled: machacar para liberar sabores/aceites.' },
  'BARTENDER:2': { correctAnswer: 1, rationale: 'Receta clásica del Margarita: 45 ml de tequila.' },
  'BARTENDER:3': { correctAnswer: 1, rationale: 'Layering: capas por densidad de líquidos.' },
  'BARTENDER:4': { correctAnswer: 1, rationale: 'Denominación de origen: tequila (Jalisco) vs. mezcal (varias regiones).' },
  'BARTENDER:5': { correctAnswer: 1, rationale: 'Servicio responsable: suspender el servicio y ofrecer agua.' },
  'BARTENDER:6': { correctAnswer: 1, rationale: 'Vajilla estándar: Old Fashioned en vaso corto/rocks.' },
  'BARTENDER:7': { correctAnswer: 1, rationale: 'Terminología: on the rocks = con hielo.' },
  'BARTENDER:8': { correctAnswer: 1, rationale: 'Receta clásica del Mojito: licor base ron.' },
  'BARTENDER:9': { correctAnswer: 1, rationale: 'Medida dash: cantidad pequeña (3-5 gotas).' },
  'BARTENDER:10': { correctAnswer: 1, rationale: 'Tiraje correcto de cerveza: inclinar y enderezar gradualmente.' },
  // GERENTE_PISO (10)
  'GERENTE_PISO:1': { correctAnswer: 1, rationale: 'KPI operativo de sala: rotación de mesas.' },
  'GERENTE_PISO:2': { correctAnswer: 1, rationale: 'Protocolo de servicio: atender primero al cliente insatisfecho y escuchar.' },
  'GERENTE_PISO:3': { correctAnswer: 1, rationale: 'Definición: ticket promedio = gasto promedio por cliente.' },
  'GERENTE_PISO:4': { correctAnswer: 1, rationale: 'Gestión de conflictos: escuchar ambas partes y mediar.' },
  'GERENTE_PISO:5': { correctAnswer: 1, rationale: 'Interpretación estándar del indicador: rotación alta señala gestión/condiciones.' },
  'GERENTE_PISO:6': { correctAnswer: 1, rationale: 'Definición: captación = atraer nuevos clientes.' },
  'GERENTE_PISO:7': { correctAnswer: 1, rationale: 'Práctica de motivación: reconocimiento y capacitación.' },
  'GERENTE_PISO:8': { correctAnswer: 1, rationale: 'Checklist de apertura: reservaciones, personal y estado del salón.' },
  'GERENTE_PISO:9': { correctAnswer: 1, rationale: 'Fórmula operativa: productividad = ventas y mesas atendidas.' },
  'GERENTE_PISO:10': { correctAnswer: 1, rationale: 'Sigla: SOP = Standard Operating Procedure.' },
  // VENDEDOR (10)
  'VENDEDOR:1': { correctAnswer: 1, rationale: 'Definición de upselling: ofrecer mayor valor o complemento.' },
  'VENDEDOR:2': { correctAnswer: 1, rationale: 'Primera regla de atención: escucha activa.' },
  'VENDEDOR:3': { correctAnswer: 1, rationale: 'Manejo estándar de navegador: disponibilidad sin presión.' },
  'VENDEDOR:4': { correctAnswer: 1, rationale: 'Terminología: closing = momento de cerrar la venta.' },
  'VENDEDOR:5': { correctAnswer: 1, rationale: 'Manejo de objeción de precio: valor y beneficios, no descuento inmediato.' },
  'VENDEDOR:6': { correctAnswer: 1, rationale: 'Definición de cross-selling: productos complementarios.' },
  'VENDEDOR:7': { correctAnswer: 1, rationale: 'Terminología retail: tribanda = tres prendas como outfit.' },
  'VENDEDOR:8': { correctAnswer: 1, rationale: 'Cierre de atención: agradecer y ofrecer ayuda adicional.' },
  'VENDEDOR:9': { correctAnswer: 1, rationale: 'Definición: warm lead = cliente con interés previo.' },
  'VENDEDOR:10': { correctAnswer: 1, rationale: 'Técnica SPIN: Situation, Problem, Implication, Need.' },
  // GENERAL (10) — rationale documental de las claves ya declaradas en el banco
  'GENERAL:1': { correctAnswer: 1, rationale: 'Prioridad de servicio: cliente escuchado y satisfecho.' },
  'GENERAL:2': { correctAnswer: 1, rationale: 'Definición de trabajo en equipo: colaboración y comunicación.' },
  'GENERAL:3': { correctAnswer: 1, rationale: 'Protocolo: admitir desconocimiento y escalar a quien pueda ayudar.' },
  'GENERAL:4': { correctAnswer: 1, rationale: 'Puntualidad: impacto en equipo y operación.' },
  'GENERAL:5': { correctAnswer: 1, rationale: 'Higiene personal: baño, uniforme, manos y presentación.' },
  'GENERAL:6': { correctAnswer: 1, rationale: 'Conflictos: hablar directamente y buscar solución.' },
  'GENERAL:7': { correctAnswer: 1, rationale: 'Buen servicio: cumplir o superar expectativas.' },
  'GENERAL:8': { correctAnswer: 1, rationale: 'Lavado de manos: antes de comer, después del baño y al inicio de turno.' },
  'GENERAL:9': { correctAnswer: 1, rationale: 'Comunicación asertiva: ideas con respeto y claridad.' },
  'GENERAL:10': { correctAnswer: 1, rationale: 'Conocer el producto permite información correcta al cliente.' },
}

/**
 * Metadatos de gobernanza aplicados a TODO reactivo de conocimientos del
 * sistema (A-03.2 PASO 2/3/4): estado ACTIVE solo con clave; fuente
 * ELABORACION_REVISADA; revisión/aprobación registradas a la gobernanza
 * humana de la fase (NO IA); itemVersion inicial.
 */
export const SYSTEM_KNOWLEDGE_GOVERNANCE = {
  knowledgeStatus: 'ACTIVE',
  itemVersion: 1,
  correctAnswerSource: 'ELABORACION_REVISADA' as const,
  origin: 'SYSTEM_BANK' as const,
  reviewedBy: 'A-03.2-GOVERNANCE',
  approvedBy: 'A-03.2-GOVERNANCE',
}

/**
 * Resuelve la clave de un reactivo del banco del sistema:
 * 1) si el banco la declara explícitamente, prevalece;
 * 2) si no, se usa el addendum (claves establecidas en A-03.2);
 * 3) si no existe en ninguna fuente ⇒ null (el item NO se publica como
 *    ACTIVE con clave — PASO 3).
 */
export function resolveSystemKnowledgeKey(
  category: string,
  order: number,
  declaredCorrectAnswer?: number
): number | null {
  if (declaredCorrectAnswer !== undefined) return declaredCorrectAnswer
  const addendum = KNOWLEDGE_KEY_ADDENDUM[`${category}:${order}`]
  return addendum ? addendum.correctAnswer : null
}

/** Rationale documental de la clave de un reactivo del sistema (o null). */
export function getSystemKnowledgeRationale(category: string, order: number): string | null {
  return KNOWLEDGE_KEY_ADDENDUM[`${category}:${order}`]?.rationale ?? null
}

// ════════════════════════════════════════════════════════════════════════
// A-03.3 PASO 2/3 — CATÁLOGO DE REQUIREMENTS POR CATEGORÍA DE PUESTO
//
// Cada entrada declara un dominio de conocimiento (KnowledgeRequirement)
// que el blueprint del puesto evalúa, con justificación trazable al puesto
// (source KF1–KF7 de A-03.1 PASO 2 + rationale). Los `questionOrders`
// vinculan los reactivos EXISTENTES del banco (ya revisados — A-03.2) al
// requirement correspondiente: NO se inventan dominios ni claves; el
// catálogo DOCUMENTA los dominios que el banco revisado ya evalúa.
// importance = descriptiva (A-03.1 P4/P5) — JAMÁS peso de scoring.
// ════════════════════════════════════════════════════════════════════════

export interface SystemRequirementSeed {
  domain: string
  subdomain: string | null
  description: string
  importance: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA'
  source:
    | 'FUNCIONES'
    | 'PROCEDIMIENTOS'
    | 'POLITICAS'
    | 'CONOCIMIENTOS_TECNICOS'
    | 'NORMATIVA'
    | 'EXPERTOS'
    | 'DOCUMENTACION_CLIENTE'
  rationale: string
  /** Órdenes (1-based) de los reactivos del banco que pertenecen a este dominio. */
  questionOrders: number[]
}

function restaurantServiceRequirements(): SystemRequirementSeed[] {
  return [
    {
      domain: 'Servicio al cliente',
      subdomain: 'Atención y comunicación',
      description: 'Prioridades de atención, protocolo ante desconocimiento, definición de buen servicio y conocimiento del producto/servicio ofrecido.',
      importance: 'CRITICA',
      source: 'FUNCIONES',
      rationale: 'El puesto interactúa directamente con clientes; el blueprint evalúa dominios de servicio contenidos en el banco revisado del sistema (A-03.2, ELABORACION_REVISADA).',
      questionOrders: [1, 3, 7, 10],
    },
    {
      domain: 'Conducta laboral y trabajo en equipo',
      subdomain: 'Colaboración, puntualidad y comunicación asertiva',
      description: 'Trabajo en equipo, impacto de la puntualidad, manejo de conflictos con compañeros y comunicación asertiva.',
      importance: 'ALTA',
      source: 'POLITICAS',
      rationale: 'Conductas laborales operativas requeridas por el puesto según las políticas internas estándar del sector; evaluadas con los reactivos revisados del banco.',
      questionOrders: [2, 4, 6, 9],
    },
    {
      domain: 'Higiene y presentación personal',
      subdomain: 'Higiene corporal y lavado de manos',
      description: 'Higiene personal requerida en puestos operativos y momentos de lavado de manos.',
      importance: 'ALTA',
      source: 'NORMATIVA',
      rationale: 'Requisito sanitario básico de puestos con contacto con clientes/alimentos (norma de higiene laboral); reactivos revisados del banco GENERAL.',
      questionOrders: [5, 8],
    },
  ]
}

export const KNOWLEDGE_REQUIREMENT_CATALOG: Record<string, SystemRequirementSeed[]> = {
  GENERAL: restaurantServiceRequirements(),
  MESERO: [
    {
      domain: 'Operación y protocolo de servicio',
      subdomain: 'Servicio en mesa',
      description: 'Protocolo de mesa: verificación previa a la cuenta, manejo de reclamos, orden de servicio, transporte de platos, momento de acercarse a la mesa y servicio de bebidas.',
      importance: 'CRITICA',
      source: 'PROCEDIMIENTOS',
      rationale: 'El puesto de mesero ejecuta el protocolo de servicio en mesa definido por los procedimientos estándar del restaurante; dominios cubiertos por los reactivos revisados del banco.',
      questionOrders: [2, 3, 4, 6, 8, 10],
    },
    {
      domain: 'Conocimiento de producto y venta',
      subdomain: 'Carta, maridaje y upselling',
      description: 'Temperatura de servicio de vinos y técnica de upselling en mesa.',
      importance: 'ALTA',
      source: 'CONOCIMIENTOS_TECNICOS',
      rationale: 'El mesero recomienda y vende; requiere conocimiento de producto (carta/vinos) y técnicas de sugerencia del banco revisado.',
      questionOrders: [1, 7],
    },
    {
      domain: 'Inocuidad, higiene y alergias',
      subdomain: 'Manejo de alergias y organización previa',
      description: 'Mise en place y manejo de alergias alimentarias del cliente.',
      importance: 'CRITICA',
      source: 'NORMATIVA',
      rationale: 'Seguridad del cliente: declarar y verificar alergias es requisito sanitario del servicio de alimentos.',
      questionOrders: [5, 9],
    },
  ],
  COCINERO: [
    {
      domain: 'Inocuidad e higiene alimentaria',
      subdomain: 'Temperaturas, contaminación cruzada y zona de peligro',
      description: 'Cocción segura de aves, contaminación cruzada, orden de refrigeración, desecho de alimento caído, zona de peligro, lavado de manos y tablas por color.',
      importance: 'CRITICA',
      source: 'NORMATIVA',
      rationale: 'El cocinero manipula alimentos de riesgo; la inocuidad es requisito normativo (NOM-251-SSA1) cubierto por los reactivos revisados del banco.',
      questionOrders: [1, 2, 4, 5, 7, 9, 10],
    },
    {
      domain: 'Técnicas culinarias y organización',
      subdomain: 'Cortes, mise en place y técnicas de cocción',
      description: 'Cortes clásicos (brunoise), mise en place y reducción de salsas.',
      importance: 'ALTA',
      source: 'CONOCIMIENTOS_TECNICOS',
      rationale: 'Técnicas de cocina estándar del oficio requeridas para la producción de alimentos del puesto.',
      questionOrders: [3, 6, 8],
    },
  ],
  BARTENDER: [
    {
      domain: 'Coctelería y técnicas de preparación',
      subdomain: 'Recetas clásicas y técnicas',
      description: 'Muddled, recetas clásicas (Margarita, Mojito), layering, on the rocks, medida dash.',
      importance: 'CRITICA',
      source: 'CONOCIMIENTOS_TECNICOS',
      rationale: 'El bartender prepara coctelería clásica; las recetas y técnicas son conocimiento técnico central del oficio.',
      questionOrders: [1, 2, 3, 7, 8, 9],
    },
    {
      domain: 'Producto y vajilla',
      subdomain: 'Destilados, denominaciones y montaje',
      description: 'Denominación de origen tequila/mezcal y vajilla estándar (Old Fashioned, tiraje de cerveza).',
      importance: 'ALTA',
      source: 'CONOCIMIENTOS_TECNICOS',
      rationale: 'Identificación correcta de producto y montaje del bar conforme a estándares de servicio.',
      questionOrders: [4, 6, 10],
    },
    {
      domain: 'Servicio responsable',
      subdomain: 'Consumo responsable de alcohol',
      description: 'Suspensión del servicio a cliente en estado de ebriedad.',
      importance: 'CRITICA',
      source: 'POLITICAS',
      rationale: 'Obligación legal y de política interna del servicio responsable de alcohol.',
      questionOrders: [5],
    },
  ],
  GERENTE_PISO: [
    {
      domain: 'Indicadores y gestión operativa',
      subdomain: 'KPIs de sala y procesos',
      description: 'Rotación de mesas, ticket promedio, interpretación de rotación, productividad y SOP.',
      importance: 'CRITICA',
      source: 'FUNCIONES',
      rationale: 'El gerente de piso dirige la operación con base en indicadores y procedimientos estándar del restaurante.',
      questionOrders: [1, 3, 5, 9, 10],
    },
    {
      domain: 'Gestión de personal y servicio',
      subdomain: 'Clientes, conflictos y motivación',
      description: 'Atención al cliente insatisfecho, mediación de conflictos, captación de clientes, motivación del equipo y checklist de apertura.',
      importance: 'ALTA',
      source: 'PROCEDIMIENTOS',
      rationale: 'Funciones de supervisión directa del puesto: personal, clientes y apertura de operación.',
      questionOrders: [2, 4, 6, 7, 8],
    },
  ],
  VENDEDOR: [
    {
      domain: 'Técnicas de venta',
      subdomain: 'Upselling, cross-selling y cierre',
      description: 'Upselling, closing, manejo de objeciones de precio, cross-selling y metodología SPIN.',
      importance: 'CRITICA',
      source: 'FUNCIONES',
      rationale: 'El vendedor genera venta activa; las técnicas de venta son la función central del puesto.',
      questionOrders: [1, 4, 5, 6, 10],
    },
    {
      domain: 'Atención al cliente en piso de venta',
      subdomain: 'Experiencia del cliente',
      description: 'Escucha activa, manejo de probador, outfit/tribanda, cierre de atención y calificación de prospectos.',
      importance: 'ALTA',
      source: 'PROCEDIMIENTOS',
      rationale: 'Estándares de atención al cliente en piso de venta definidos por los procedimientos retail del banco revisado.',
      questionOrders: [2, 3, 7, 8, 9],
    },
  ],
}

/**
 * Resuelve el catálogo de requirements para una categoría de puesto.
 * Categorías sin catálogo propio usan GENERAL (mismo comportamiento del
 * fallback del banco de reactivos — generate-templates.ts).
 */
export function getSystemRequirementCatalog(category: string): SystemRequirementSeed[] {
  return KNOWLEDGE_REQUIREMENT_CATALOG[category] ?? KNOWLEDGE_REQUIREMENT_CATALOG.GENERAL
}
