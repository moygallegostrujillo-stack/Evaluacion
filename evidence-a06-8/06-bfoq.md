# EVALUHR — A-06.8 — 06 · BFOQ (PASO 6)

> Bona Fide Occupational Qualification / requisito esencial del puesto. **Excepcionalísmo**:
> procedimiento solo para casos donde una característica personal pueda tener relevancia legal.
> Marco: LFT Art 3; LFPEPD (requisito esencial/acciones afirmativas); Nueva LFPDPPP 2025
> (datos sensibles). Base previa: A-06.4 `14-bfoq.md` (sin cambios sustantivos).

## 1. Reglas duras (invocables en conjunto, nunca individualmente)

| # | Regla |
|---|---|
| B-1 | **No automatizable** — ningún campo del sistema (p. ej. `bfoq: true`) habilita preguntas prohibidas por sí mismo. |
| B-2 | **No interpretable por IA** — la IA no detecta, sugiere ni evalúa BFOQ (07). |
| B-3 | **Revisión jurídica obligatoria** — dictamen de abogado especializado (laboral + datos). |
| B-4 | **Aprobación humana dual** — empresa cliente (responsable) + EvaluHR (encargado) firman la justificación. |
| B-5 | **Justificación específica del puesto** — el atributo debe ser esencial a las funciones centrales, documentado en análisis de puesto. |
| B-6 | **Caso por caso** — no se generaliza a familia de puestos ni a otros clientes. |
| B-7 | **Mínimo necesario** — se verifica por **documento, no por pregunta de entrevista** (A-06.4 §7). |
| B-8 | **Revisión periódica** — el BFOQ caduca si desaparece la justificación o cambia el puesto. |

## 2. Procedimiento (7 pasos)

| Paso | Actor | Acción | Registro |
|---|---|---|---|
| 1 | Empresa cliente | Solicitud escrita: puesto + atributo + razón operativa inicial | Solicitud BFOQ-REQ |
| 2 | Empresa cliente + EvaluHR | Análisis de puesto: qué función central exige el atributo; por qué no hay alternativa razonable | Anexo al análisis de puesto (JOB_ANALYSIS) |
| 3 | EvaluHR legal / cliente | Verificación de alternativa menos restrictiva (debe NO existir) | Memoria de alternativas descartadas |
| 4 | **Abogado externo** | Dictamen: la distinción es exigible y no discriminatoria bajo LFT Art 3 / LFPEPD / nueva LFPDPPP | Dictamen legal (legalReviewId) |
| 5 | Aprobación humana dual | Cliente + EvaluHR aprueban con firmas | Acta de aprobación |
| 6 | EvaluHR | Si procede: incorporación documental con `bfoq_justified: true` + `legalReviewId` + vigencia + texto EXACTO del requisito (verificación por documento) | Registro append-only |
| 7 | Revisión periódica | Re-evaluar vigencia (cambio de puesto/norma); caducidad automática al vencer | Log de revisión |

## 3. Qué NO es BFOQ (recordatorio A-06.4 §4)

- Preferencia del cliente ("el cliente prefiere hombres").
- Estereotipo ("las mujeres son mejores para atención al cliente").
- Conveniencia operativa ("es más fácil contratar solteros").
- Cualquier atributo protegido sin justificación específica del puesto.
- Automatización o interpretación por IA.

## 4. Ejemplos de frontera (hipotéticos, de A-06.4 — sin cambios)

| Atributo | Posible excepción | Tratamiento correcto |
|---|---|---|
| Género | Refugio de mujeres (revictimización) | Publicar requisito; verificar por documento; la entrevista de competencias NO pregunta |
| Edad | Restricción legal (LFT Art 22/22 Bis) | Verificar documento; no "edad" como tal |
| Salud | NOM-251 manipulación de alimentos (carta de salud) | Documento requerido por norma; NO pregunta de entrevista |
| Idioma | Puesto turístico bilingüe | Verificar capacidad; no inferir por origen/acento |
| Discapacidad | Puesto diseñado como acción afirmativa | Marco LFPEPD; documentado |

**Estado del banco actual**: **0 BFOQ activos**. Ninguna de las 10 preguntas candidatas requiere
BFOQ. Cualquier futuro BFOQ nace NULO hasta completar los 7 pasos.

## 5. Conexión con gates

BFOQ cruza LEGAL-G4 (sensibles) + LEGAL-G5 (no discriminación) + INTERVIEW-G7 (legal). Sin dictamen
legal profesional, **ningún gate puede aprobarse** en presencia de un BFOQ pendiente.
