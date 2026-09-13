# EVALUHR — LEGAL MASTER PACKAGE · 03 · PURPOSES (PASO 6)

## 0. Matriz de finalidad

Columnas: FINALIDAD / DATOS / PROCESO / RESPONSABLE / ENCARGADO / FUNDAMENTO / RETENCIÓN / USO SECUNDARIO / ESTADO LEGAL. Regla: **usos secundarios no autorizados = PROHIBIDOS** (art. 11 LFPDPPP 2025: finalidad distinta → nuevo consentimiento).

| FINALIDAD | DATOS | PROCESO | RESPONSABLE | ENCARGADO | FUNDAMENTO | RETENCIÓN | USO SECUNDARIO | ESTADO LEGAL |
|---|---|---|---|---|---|---|---|---|
| F1 Selección laboral (gestión del proceso) | Identificativos, contacto, edad (dudosa) | Invitación → postulación → resultados → entrevista | EMPRESA CLIENTE | EVALUA HR | Aviso + base por dictamen (art. 9 excepciones por verificar) | 730 días PII | PROHIBIDO | LEGAL_REVIEW |
| F2 Evaluación psicológica | 14 categorías (sensibles) | Evaluación paso 1-2 | EMPRESA CLIENTE | EVALUA HR | Consentimiento expreso (sensibles) | 90 días inactividad (sistema) | PROHIBIDO | LEGAL_REVIEW |
| F3 Evaluación de conocimientos | Respuestas + snapshots + resultados | Evaluación paso 3 | EMPRESA CLIENTE | EVALUA HR | Aviso + consentimiento | 730 días / congelado | PROHIBIDO | LEGAL_REVIEW |
| F4 Evaluación psicométrica (Big Five) | 10 ítems propios (legacy) | Evaluación (declinado en V1) | EMPRESA CLIENTE | EVALUA HR | Consentimiento expreso | 90 días | PROHIBIDO | LEGAL_REVIEW — decidir retiro |
| F5 Indicador de integridad | 10 ítems (aislado del overall) | Evaluación | EMPRESA CLIENTE | EVALUA HR | Consentimiento expreso | 90 días | PROHIBIDO (nunca filtro automático) | LEGAL_REVIEW — decidir retiro |
| F6 Entrevista (agendamiento) | Fecha/lugar/estado/notes | InterviewSchedule | EMPRESA CLIENTE | EVALUA HR | Aviso | Sin purga definida | PROHIBIDO | LEGAL_REVIEW |
| F7 Video (paso) | videoType/SKIPPED (sin almacenamiento) | Marca de paso; envío real por WhatsApp fuera del sistema | EMPRESA CLIENTE (RR.HH.) | — | Transparencia | 730 días | PROHIBIDO | LEGAL_REVIEW |
| F8 Análisis/reportes a RR.HH. | Scores + recommendation | Presentación en panel | EMPRESA CLIENTE | EVALUA HR | Aviso + art. 26 (revisión humana) | Ídem F1 | PROHIBIDO (sin anonimización) | LEGAL_REVIEW |
| F9 Auditoría y seguridad | AuditLog, IP, UA, cookies | Registro técnico | EMPRESA CLIENTE | EVALUA HR | Interés legítimo/obligación | 90 días logs | PROHIBIDO | LEGAL_REVIEW |
| F10 Ejercicio ARCO | Datos de solicitud y respuesta | ArcoRequest | EMPRESA CLIENTE (responde) | EVALUA HR (asiste/ejecuta) | Obligación legal | Sin purga definida | PROHIBIDO | LEGAL_REVIEW |
| F11 Soporte técnico | Mínimos identificativos | Operación de plataforma | EMPRESA CLIENTE | EVALUA HR | Contrato | Por dictamen | PROHIBIDO | LEGAL_REVIEW |
| F12 Generación de preguntas (IA) | Contexto del puesto/vacante (sin PII de candidatos) | generate-questions (AI_DRAFT) | EMPRESA CLIENTE (instrucción) | EVALUA HR | Aviso (uso de IA) + contrato | Sin purga definida | PROHIBIDO (entrenamiento de modelos) | LEGAL_REVIEW |

## 1. Usos secundarios expresamente prohibidos (sin dictamen + nuevo consentimiento)

1. Entrenar/ajustar modelos de IA con respuestas de candidatos.
2. Estadísticas agregadas con datos identificables o re-identificables.
3. Marketing, prospección o contacto comercial al candidato.
4. Compartir resultados con terceros ajenos al proceso (fuera del responsable/encargado).
5. Reutilizar evaluaciones para vacantes distintas sin aviso/base.
6. Cualquier transferencia no declarada en aviso/contrato (ver 17/18).

## 2. Nota normativa (verificada)

Art. 11 LFPDPPP 2025: tratar datos para finalidad distinta a las del aviso requiere **obtener nuevamente el consentimiento** (fuente: análisis del texto, iapp.org). Art. 15: el aviso debe diferenciar finalidades que requieren consentimiento. → Esta matriz alimenta el aviso (06) y el contrato (08).
