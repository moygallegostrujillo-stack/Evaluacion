# EVALUHR — LEGAL MASTER PACKAGE · 10 · SENSITIVE DATA (PASO 5)

## 1. Clasificación de datos sensibles en EvaluHR (verificada en repo)

| Dato | ¿Sensible? | Estado |
|---|---|---|
| Respuestas de evaluación psicológica (14 categorías) | **SÍ** — así declarado en aviso (PDF §2; in-app §6.1 tipo/Art.) | Tratamiento reforzado existente |
| Respuestas Big Five (10 ítems propios, legacy) | **SÍ** (personalidad/salud mental) | Declinado para puestos V1; retención sensible 90 días |
| integrityScore + respuestas de integridad | **SÍ** — UI lo etiqueta "Dato sensible (LFPDPPP). Indicador orientativo" (`CandidateDetailView.tsx:501`) | Aislado del overall |
| Salud/discapacidad/religión/orientación/estado civil | **NO EXISTEN** — 0 campos en schema | Fuera del sistema |
| Edad (candidateAge) | No es sensible per se, pero es atributo protegido | Riesgo de discriminación — dictamen |

## 2. Qué puede existir / qué no debe solicitarse / qué debe quedar fuera

| Categoría | Determinación |
|---|---|
| PUEDE EXISTIR (con consentimiento expreso y necesidad justificada) | Evaluación psicológica del proceso; (en discusión) Big Five e integridad — el dictamen decide si continúan |
| NO DEBE SOLICITARSE | Salud, embarazo, discapacidad, religión, origen, orientación, estado civil, política, situación económica |
| DEBE EVITARSE | Preguntas que induzcan relatos personales (probes sensibles ya marcados CONDICIONAL en A-06) |
| FUERA DEL SISTEMA | Grabaciones de video/audio (no hay almacenamiento); contenido de revelación involuntaria (nunca se guarda) |

## 3. Protocolo UNINVITED_DISCLOSURE (operativo)

1. **NO indagar** — el entrevistador/evaluador no hace preguntas de seguimiento sobre lo revelado.
2. **NO reanudar** el tema.
3. **NO registrar contenido** — ni en evidencia, ni en revisión, ni en auditoría, ni en IA.
4. **Redirigir** a la siguiente pregunta o al aspecto laboral.
5. **Mínimo evento**: solo flag `UNINVITED_DISCLOSURE=YES/NO` con fecha/hora (sin contenido).
6. **Riesgo → detener** y canalizar según instrucción del responsable.

Estado: definido en cadena de auditoría A-06.8 (registro) y pendiente de implementación operativa junto con la entrevista — no existe código (coherente con "NO IMPLEMENTAR").

## 4. Tratamiento reforzado existente (verificado)

- Consentimiento expreso para sensibles (ConsentView/PublicEvaluationView; opciones A/B).
- Retención diferenciada: `sensitivePurgeAt` — 90 días de inactividad ("process conclusion") (`retention.ts`).
- Retiro de consentimiento borra físicamente las 14 categorías sensibles y resetea scores (`/api/consent` PATCH).
- Regla de oro para sensibles en aviso in-app §16.2.

## 5. Regla dura

> **No almacenar datos sensibles innecesarios.** Sin nuevas excepciones sin dictamen. Contenido sensible innecesario → NO CONSERVAR. El dictamen determina: (a) qué sensibles pueden tratarse; (b) plazos; (c) suficiencia del protocolo UNINVITED_DISCLOSURE; (d) si Big Five e integridad permanecen o se retiran.
