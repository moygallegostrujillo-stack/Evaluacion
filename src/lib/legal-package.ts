/**
 * LEGAL MASTER PACKAGE — Manifiesto del expediente jurídico.
 *
 * Fuente de verdad en disco: /evidence-LEGAL-MASTER/ (32 documentos 00–31)
 * + 12 matrices CSV + LAWYER-README.md + LAWYER-REVIEW-RESPONSE.md.
 * ZIP compilado: /EVALUHR-LEGAL-MASTER-PACKAGE.zip (+ SHA-256).
 *
 * REGLA DURA (00-MASTER-LEGAL-DOSSIER §4): todo documento es
 * BORRADOR PARA ABOGADO; ninguno es definitivo ni aprobado.
 * 17 documentos requieren REVISIÓN OBLIGATORIA según el encargo:
 * 01 (marco), 04/08 (roles/contrato), 05/06 (consentimiento/aviso),
 * 10 (sensibles), 14/25 (art. 26), 15 (plazos), 17/18
 * (subencargados/transferencias), 19 (incidentes), 20–24 (instrumentos).
 */

export type LegalReviewLevel = 'REVISION_OBLIGATORIA' | 'BORRADOR_ABOGADO'

export interface LegalDocumentMeta {
  /** Identificador estable usado en la URL de descarga (ej. "01") */
  id: string
  /** Nombre de archivo real en evidence-LEGAL-MASTER/ */
  filename: string
  /** Título corto en español */
  title: string
  /** Tema del documento (PASO de origen del encargo) */
  topic: string
  /** Nivel de revisión asignado por el encargo legal */
  reviewLevel: LegalReviewLevel
  /** Motivo de la revisión obligatoria (solo cuando aplica) */
  reviewScope?: string
  /** Agrupación temática para la UI */
  category: string
}

const DOCS: LegalDocumentMeta[] = [
  {
    id: '00',
    filename: '00-MASTER-LEGAL-DOSSIER.md',
    title: 'Master Legal Dossier — índice y reglas del expediente',
    topic: 'Estatus del paquete, partes, contenido y reglas de lectura',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Expediente',
  },
  {
    id: '01',
    filename: '01-LEGAL-FRAMEWORK.md',
    title: 'Marco legal vigente (fuentes oficiales)',
    topic: 'Constitución, LFT, LFPDPPP 2025, reglamento, CONAPRED, disposiciones de IA',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Marco jurídico — cotejo de artículos vigentes',
    category: 'Marco y datos',
  },
  {
    id: '02',
    filename: '02-DATA-INVENTORY.md',
    title: 'Inventario de datos personales',
    topic: 'Mapa completo de datos con origen, finalidad y base jurídica',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Marco y datos',
  },
  {
    id: '03',
    filename: '03-PURPOSES.md',
    title: 'Matriz de finalidades',
    topic: 'Finalidad primaria, uso secundario y fundamentos por tratamiento',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Marco y datos',
  },
  {
    id: '04',
    filename: '04-RESPONSIBLE-VS-PROCESSOR.md',
    title: 'Responsable vs Encargado',
    topic: 'Tesis: EMPRESA CLIENTE = Responsable · EVALUA HR = Encargado',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Roles y responsabilidades (responsable/encargado)',
    category: 'Marco y datos',
  },
  {
    id: '05',
    filename: '05-CONSENT.md',
    title: 'Consentimiento por tratamiento',
    topic: 'Estado implementado (ConsentLog, hashes) y consentimientos requeridos',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Consentimiento — forma y alcance',
    category: 'Consentimiento y aviso',
  },
  {
    id: '06',
    filename: '06-PRIVACY-NOTICE.md',
    title: 'Aviso de privacidad (borrador + brechas)',
    topic: 'Doble aviso detectado (PDF 2011 vs in-app 2026) y consolidación propuesta',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Aviso de privacidad — aprobación de contenido',
    category: 'Consentimiento y aviso',
  },
  {
    id: '07',
    filename: '07-CANDIDATE-INFORMATION.md',
    title: 'Información previa al candidato',
    topic: 'Documento independiente en lenguaje claro, previo a la evaluación',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Consentimiento y aviso',
  },
  {
    id: '08',
    filename: '08-MASTER-CONTRACT.md',
    title: 'Contrato maestro (borrador)',
    topic: 'Cláusulas SaaS / encargado de tratamiento — no existe contrato real',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Contrato — redacción y validación de cláusulas',
    category: 'Marco y datos',
  },
  {
    id: '09',
    filename: '09-ARCO.md',
    title: 'ARCO — flujo y responsabilidades',
    topic: 'Solicitud de derechos implementada (20 días hábiles) y roles',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Derechos y controles',
  },
  {
    id: '10',
    filename: '10-SENSITIVE-DATA.md',
    title: 'Datos sensibles y divulgación no solicitada',
    topic: 'Clasificación de sensibles, protocolo UNINVITED_DISCLOSURE (solo flag)',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Datos sensibles — tratamiento reforzado',
    category: 'Derechos y controles',
  },
  {
    id: '11',
    filename: '11-NON-DISCRIMINATION.md',
    title: 'No discriminación',
    topic: 'Auditoría por superficie (candidateAge, atributos protegidos) y policy',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Derechos y controles',
  },
  {
    id: '12',
    filename: '12-AI-ANNEX.md',
    title: 'Anexo de IA',
    topic: 'Usos reales de IA, usos permitidos (5) y prohibidos (8)',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'IA y decisiones',
  },
  {
    id: '13',
    filename: '13-HUMAN-REVIEW.md',
    title: 'Revisión humana',
    topic: 'Cadena de decisión EVIDENCIA → revisión humana → decisión de empresa',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'IA y decisiones',
  },
  {
    id: '14',
    filename: '14-AUTOMATED-DECISIONS.md',
    title: 'Mapa de decisiones automatizadas',
    topic: 'Mapa AUTOMATIZADO / ASISTIDO / HUMAN ONLY de todo el sistema',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Art. 26 — decisiones automatizadas sobre datos personales',
    category: 'IA y decisiones',
  },
  {
    id: '15',
    filename: '15-RETENTION.md',
    title: 'Retención y eliminación',
    topic: 'Plazos implementados (PII 730 días, sensibles 90) vs plazo por dictamen',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Plazos de conservación — determinación legal',
    category: 'Derechos y controles',
  },
  {
    id: '16',
    filename: '16-SECURITY.md',
    title: 'Seguridad legal',
    topic: 'Controles verificados (JWT, bcrypt, RLS) sin certificaciones inventadas',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Derechos y controles',
  },
  {
    id: '17',
    filename: '17-SUBPROCESSORS.md',
    title: 'Subencargados',
    topic: 'Registro observado en código; lo no confirmado = PENDIENTE DE CONFIGURACIÓN',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Subencargados — autorización y contratos',
    category: 'Terceros y transferencias',
  },
  {
    id: '18',
    filename: '18-INTERNATIONAL-TRANSFERS.md',
    title: 'Transferencias internacionales',
    topic: 'Posibles transferencias por proveedores — todas POR CONFIRMAR',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Transferencias — mecanismo y consentimiento',
    category: 'Terceros y transferencias',
  },
  {
    id: '19',
    filename: '19-INCIDENTS-BREACHES.md',
    title: 'Incidentes y brechas',
    topic: 'Protocolo propuesto (borrador) — no existe protocolo implementado',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Incidentes — obligación de notificar y plazos',
    category: 'Terceros y transferencias',
  },
  {
    id: '20',
    filename: '20-INSTRUMENTS.md',
    title: 'Instrumentos de evaluación',
    topic: 'Personalidad (Big Five propio), Knowledge, Integrity, Competencias, JobFit',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Instrumentos — validez, derechos y uso permitido',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '21',
    filename: '21-KNOWLEDGE.md',
    title: 'Módulo de conocimientos',
    topic: 'Auditoría: clave protegida server-side, congelamiento e inmutabilidad',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Instrumentos — conocimiento técnico',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '22',
    filename: '22-INTEGRITY.md',
    title: 'Módulo de integridad',
    topic: 'IMPLEMENTADO como instrumento; NO aprobado para agregados (GATE 1–10)',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Instrumentos — integridad (alto riesgo)',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '23',
    filename: '23-COMPETENCIES.md',
    title: 'Módulo de competencias',
    topic: 'NOT_IMPLEMENTED en producto — diseño y gates COMP-G1..G10',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Instrumentos — competencias y entrevista estructurada',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '24',
    filename: '24-INTERVIEW.md',
    title: 'Módulo de entrevista',
    topic: 'Agendamiento IMPLEMENTED; entrevista estructurada BDI/STAR NOT_IMPLEMENTED',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Instrumentos — entrevista estructurada',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '25',
    filename: '25-OVERALL-JOBFIT.md',
    title: 'Overall Score / JobFit / Recomendación',
    topic: 'Fórmula OVERALL-v1.1, exclusión de secciones, etiqueta de completitud',
    reviewLevel: 'REVISION_OBLIGATORIA',
    reviewScope: 'Art. 26 — decisiones automatizadas / scoring',
    category: 'Instrumentos de evaluación',
  },
  {
    id: '26',
    filename: '26-CLIENT-EVALUA-RESPONSIBILITIES.md',
    title: 'Responsabilidades Cliente / EvaluHR',
    topic: 'Asignación de responsabilidades propuesta, sujeta a dictamen',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
  {
    id: '27',
    filename: '27-LEGAL-OPEN-ITEMS.md',
    title: 'Asuntos jurídicos abiertos (OLI)',
    topic: 'Lista única sin duplicados: OLI-001..N con riesgo y bloqueo',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
  {
    id: '28',
    filename: '28-LAWYER-QUESTIONS.md',
    title: 'Preguntas al abogado',
    topic: 'Preguntas cerradas con referencia a documentos del expediente',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
  {
    id: '29',
    filename: '29-LEGAL-OPINION-TEMPLATE.md',
    title: 'Plantilla de dictamen (vacía)',
    topic: 'NO SE INVENTA EL DICTAMEN — solo se prepara el espacio de respuesta',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
  {
    id: '30',
    filename: '30-IMPLEMENTATION-CHECKLIST.md',
    title: 'Checklist de implementación post-dictamen',
    topic: 'Conversión del dictamen en trabajo técnico — nada se ejecuta hoy',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
  {
    id: '31',
    filename: '31-AUDIT-CHECKLIST.md',
    title: 'Auditoría de integridad del paquete',
    topic: '36 ítems de verificación de completitud del expediente',
    reviewLevel: 'BORRADOR_ABOGADO',
    category: 'Gobernanza',
  },
]

export interface LegalAnnexMeta {
  id: string
  filename: string
  /** Ubicación real del archivo (relativa a la raíz del proyecto) */
  location: 'evidence-LEGAL-MASTER' | 'root'
  title: string
  format: 'CSV' | 'MD' | 'TXT'
  description: string
}

const ANNEXES: LegalAnnexMeta[] = [
  {
    id: 'annex-gate-status',
    filename: '01-GATE-STATUS.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'GATE-STATUS',
    format: 'CSV',
    description: 'Estado de gates de activación (G7, G9, G10 y demás)',
  },
  {
    id: 'annex-legal-requirements',
    filename: 'legal-requirements.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Requisitos legales',
    format: 'CSV',
    description: 'Matriz de requisitos legales aplicables',
  },
  {
    id: 'annex-legal-data-inventory',
    filename: 'legal-data-inventory.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Inventario de datos (CSV)',
    format: 'CSV',
    description: 'Versión tabular del mapa de datos (doc 02)',
  },
  {
    id: 'annex-privacy-notice-requirements',
    filename: 'privacy-notice-requirements.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Requisitos del aviso',
    format: 'CSV',
    description: 'Requisitos de contenido del aviso de privacidad',
  },
  {
    id: 'annex-contract-requirements',
    filename: 'contract-requirements.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Requisitos del contrato',
    format: 'CSV',
    description: '26 elementos requeridos del contrato maestro',
  },
  {
    id: 'annex-candidate-transparency',
    filename: 'candidate-transparency.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Transparencia al candidato',
    format: 'CSV',
    description: 'Información previa y transparencia (doc 07)',
  },
  {
    id: 'annex-instrument-legal-status',
    filename: 'instrument-legal-status.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Estatus legal de instrumentos',
    format: 'CSV',
    description: 'Cada instrumento: validez, derechos, uso permitido/prohibido',
  },
  {
    id: 'annex-retention-requirements',
    filename: 'retention-requirements.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Requisitos de retención',
    format: 'CSV',
    description: 'Plazos por categoría de datos',
  },
  {
    id: 'annex-subprocessor-register',
    filename: 'subprocessor-register.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Registro de subencargados',
    format: 'CSV',
    description: 'Proveedores observados; no confirmados = PENDIENTE',
  },
  {
    id: 'annex-transfer-register',
    filename: 'transfer-register.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Registro de transferencias',
    format: 'CSV',
    description: 'Posibles transferencias internacionales POR CONFIRMAR',
  },
  {
    id: 'annex-client-responsibilities',
    filename: 'client-evalua-responsibilities.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Responsabilidades Cliente/EvaluHR',
    format: 'CSV',
    description: 'Matriz de responsabilidades (doc 26)',
  },
  {
    id: 'annex-legal-question-matrix',
    filename: 'legal-question-matrix.csv',
    location: 'evidence-LEGAL-MASTER',
    title: 'Matriz de preguntas legales',
    format: 'CSV',
    description: 'Preguntas cerradas para el abogado (doc 28)',
  },
  {
    id: 'annex-lawyer-readme',
    filename: 'LAWYER-README.md',
    location: 'root',
    title: 'LAWYER-README',
    format: 'MD',
    description: 'Guía de lectura del paquete para el abogado (10 secciones)',
  },
  {
    id: 'annex-lawyer-response',
    filename: 'LAWYER-REVIEW-RESPONSE.md',
    location: 'root',
    title: 'LAWYER-REVIEW-RESPONSE (plantilla)',
    format: 'MD',
    description: 'Plantilla de respuesta con 4 decisiones posibles',
  },
  {
    id: 'annex-sha256',
    filename: 'EVALUHR-LEGAL-MASTER-PACKAGE.SHA256.txt',
    location: 'root',
    title: 'SHA-256 del paquete',
    format: 'TXT',
    description: 'Suma de verificación del ZIP compilado',
  },
]

export const LEGAL_PACKAGE_NAME = 'EVALUHR-LEGAL-MASTER-PACKAGE'
export const LEGAL_PACKAGE_ZIP = 'EVALUHR-LEGAL-MASTER-PACKAGE.zip'
export const LEGAL_PACKAGE_DIR = 'evidence-LEGAL-MASTER'

export const LEGAL_DOCS: LegalDocumentMeta[] = DOCS
export const LEGAL_ANNEXES: LegalAnnexMeta[] = ANNEXES

export const MANDATORY_REVIEW_COUNT = DOCS.filter(
  (d) => d.reviewLevel === 'REVISION_OBLIGATORIA'
).length
