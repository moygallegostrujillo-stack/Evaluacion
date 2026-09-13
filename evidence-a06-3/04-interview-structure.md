# A-06.3 — 04 · Estructura de la Entrevista (PASO 5)

## 1. Regla

> **ENTREVISTA ESTRUCTURADA ≠ CONVERSACIÓN LIBRE.**

La entrevista debe tener: mismas competencias evaluadas, estructura comparable, preguntas principales predefinidas, probes definidos, reglas de evidencia.

## 2. Estructura conceptual

```
INTRODUCCIÓN
→ CONSENTIMIENTO / INFORMACIÓN
→ PREGUNTAS (por competencia)
→ PROBES (profundización)
→ CIERRE
→ REVISIÓN (post-entrevista)
```

## 3. Elementos obligatorios

| Elemento | ¿Obligatorio? | Propósito |
|---|---|---|
| Introducción | ✓ SÍ | Establecer rapport; explicar formato |
| Consentimiento / Información | ✓ SÍ | LFPDPPP: informar tratamiento de datos; Art. 37 Bis |
| Preguntas predefinidas (por competencia) | ✓ SÍ | Estandarización: mismas preguntas a todos los candidatos del mismo puesto |
| Probes definidos | ✓ SÍ | Profundización cuando falte Action/Result |
| Cierre | ✓ SÍ | Agradecer; explicar próximos pasos; permitir pregunta del candidato |
| Revisión humana (post-entrevista) | ✓ SÍ | Asignar niveles; registrar evidencia; resolver conflictos |

## 4. Detalle por elemento

### 4.1 Introducción (1–2 min)

> **EJEMPLO — NO PRODUCTIVO**
>
> "Hola, soy [nombre], seré tu entrevistador hoy. Esta entrevista dura aproximadamente 30–40 minutos. Te haré preguntas sobre situaciones laborales que hayas vivido. No hay respuestas correctas o incorrectas; quiero entender cómo actuaste en experiencias reales. ¿Estás listo/a para comenzar?"

**Propósito**: rapport + formato + expectativas. **No** recoger datos en esta fase.

### 4.2 Consentimiento / Información (1–2 min)

> **EJEMPLO — NO PRODUCTIVO**
>
> "Antes de comenzar, te informo que esta entrevista es parte del proceso de selección para [puesto]. Tus respuestas se registran para evaluar tu perfil frente a las competencias del puesto. El responsable de RR.HH. revisará los resultados. Tienes derecho a no responder una pregunta si lo prefieres. ¿Estás de acuerdo en continuar?"

**Propósito**: LFPDPPP transparencia + Art. 37 Bis (no es la única base para decisión). **Obligatorio**.

### 4.3 Preguntas (por competencia) — núcleo

Cada competencia vinculada al puesto (JobCompetency con jobRelevance VALID) recibe 1–3 preguntas BDI predefinidas (ver `12-standardization.md` para número de preguntas). Orden: competencias CRITICAL primero, IMPORTANT después, STANDARD al final.

Estructura por pregunta:
1. **Pregunta principal** (BDI, pasado) — ver `05-question-design.md`.
2. **Probes** si la respuesta es vaga o incompleta — ver `06-probes.md`.
3. **Captura STAR** (Situation/Task/Action/Result).

### 4.4 Probes (profundización)

Usados cuando:
- La respuesta es vaga (falta Action específica).
- La respuesta es hipotética (falta pasado).
- Falta Result verificable.

Probes predefinidos por pregunta (ver `06-probes.md`).

### 4.5 Cierre (1–2 min)

> **EJEMPLO — NO PRODUCTIVO**
>
> "Eso es todo por mi parte. ¿Tienes alguna pregunta sobre el puesto o el proceso? Te explico los próximos pasos: [pasos]. Gracias por tu tiempo; nos comunicaremos contigo en [plazo]."

**Propósito**: cierre profesional + transparencia sobre próximos pasos. **No** recoger más evidencia.

### 4.6 Revisión (post-entrevista, 10–15 min)

El entrevistador (o un reviewer distinto):
1. Revisa las STAR capturadas por competencia.
2. Asigna `evidenceLevel` (NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG) con `rationale`.
3. Marca conflictos (CV vs entrevista, etc.) → PENDING_REVIEW.
4. Registra `InterviewReview` (append-only) — ver `16-human-review.md`.

## 5. Duración total

| Fase | Tiempo |
|---|---|
| Introducción + Consentimiento | 3–4 min |
| Preguntas (5–7 competencias × 1–3 preguntas) | 20–30 min |
| Cierre | 2–3 min |
| **Total con candidato** | **25–37 min** |
| Revisión post-entrevista | 10–15 min |

## 6. Estándar: mismas competencias + preguntas

Para el mismo puesto (mismo `jobId`):
- **Mismas competencias evaluadas** (las JobCompetency ACTIVE para ese puesto).
- **Mismas preguntas principales** (InterviewGuide ACTIVE).
- **Mismos probes definidos**.
- **Misma rúbrica**.

Esto garantiza comparabilidad entre candidatos (reducción de sesgo inter-entrevistador).

## 7. Orden de competencias

Orden recomendado (para reducir fatiga):
1. CRITICAL primero (energía alta al inicio).
2. IMPORTANT después.
3. STANDARD al final.

Dentro de cada nivel, ordenar de menor a mayor intimidad/sensibilidad.

## 8. Reglas de evidencia

1. Solo se registra evidencia de la entrevista (no se acepta evidencia externa en la sesión).
2. Si el candidato menciona experiencia del CV, se captura pero se marca para verificación cruzada (posible conflicto).
3. Si el candidato rehúsa responder, se registra NO_EVIDENCE (no se penaliza; no se infiere).
4. Si la pregunta se vuelve hipotética, se redirige a pasado ("cuéntame de una vez específica en que...").

## 9. Conexión con gates

La estructura pasa INT-G3 (question design) + INT-G5 (rubric). Sin estructura documentada + rúbrica + entrenamiento, la entrevista no es productiva.
