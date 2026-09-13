# EVALUHR — A-06.8 — 05 · Protocolo de Revelación Involuntaria (PASO 5)

> **PROTOCOLO OBLIGATORIO** cuando el candidato revela espontáneamente información sensible
> (estado de salud, embarazo, religión, origen, opinión, vida familiar, orientación, etc.).
> Evidencia que motiva: M-H (embarazo) y V-H (religión) — A-06.6. Marco: LFT Art 3; LFPEPD;
> Nueva LFPDPPP 2025 (datos sensibles, minimización, proporcionalidad).

## 1. Definición

**Revelación involuntaria**: todo dato personal sensible que el candidato menciona
espontáneamente, sin que la pregunta o probe lo solicite, durante la entrevista, en notas,
transcripción o conversación colateral (antes/después).

## 2. Protocolo obligatorio (6 pasos)

| # | Paso | Operación |
|---|---|---|
| 1 | **No solicitar detalles** | El entrevistador NO hace preguntas de seguimiento sobre el dato revelado. NO indaga, NO confirma, NO comenta el contenido. |
| 2 | **No registrar información no necesaria** | NO se anota el contenido del dato sensible (ni en notas STAR, ni en campos libres, ni en la transcripción manual). Se retoma la conducta laboral de la competencia en curso. |
| 3 | **No utilizarla para CompetencyResult** | El dato NO alimenta indicadores, nivel, rationale ni decisión. Si un reviewer detecta que el contenido entró en notas/rationale → INVALIDACIÓN (append-only) + purge del contenido. |
| 4 | **Continuar con la competencia** | Frase de contención aprobada (§4) y regreso inmediato al hilo conductual ("¿Y qué fue lo que hiciste tú en esa situación?"). |
| 5 | **Registrar únicamente que ocurrió** | Se permite y se exige registrar **solo el hecho**: flag `involuntary_disclosure = true` con timestamp y competencia en curso, **sin el contenido**. Finalidad exclusiva: auditoría y mejora del proceso. |
| 6 | **Activar revisión cuando exista riesgo jurídico** | Escalar a revisión humana cuando: (a) el candidato insiste en discutir el tema; (b) el contenido apareció registrado pese al protocolo; (c) hay queja o reclamo del candidato; (d) el entrevistador duda del manejo. Revisión = reviewer + legal según gravedad. |

## 3. Reglas de almacenamiento

| Regla | Contenido |
|---|---|
| RA-1 | El contenido sensible revelado **NO se almacena** en ningún campo de la plataforma. |
| RA-2 | El flag del evento (paso 5) almacena: fecha/hora, questionId, competencia, "ocurrió revelación" — **sin texto del dato**. |
| RA-3 | Si existiera transcripción (grabación con consentimiento), el segmento sensible debe **purgarse** en cuanto se identifique; la retención de transcripciones ya es de plazo corto (10). |
| RA-4 | La IA **NO** procesa, resume ni archiva contenido sensible (07); si aparece en un borrador de transcripción, se marca para purge humano inmediato. |
| RA-5 | El flag es visible solo para reviewer/admin de auditoría; NO para quien decide contratación (11). |
| RA-6 | El purge del flag al cierre del ciclo de retención se registra en audit trail (10). |

## 4. Frase de contención (módulo M1/M3 — A-06.7)

Guion entrenado (para el material de entrenamiento, no productivo): reconocer sin explorar y
redirigir — p. ej.: *"Gracias por compartirlo. No necesitamos entrar en eso; concentrémonos en
lo que hiciste tú en esa situación."* El módulo incluye viñetas de calibración M-H y V-H.

## 5. Qué NO hacer (prohibiciones)

- NO usar el dato ni para "conocer mejor al candidato", ni para empatizar, ni para contextualizar.
- NO pedir disculpas por el tema ni comentar el contenido (reconocer y redirigir).
- NO documentar el contenido "por si acaso" — la minimización es la regla.
- NO deducir ni inferir el atributo si el candidato no lo dijo explícitamente.
- NO permitir que la ausencia de respuesta sobre el tema penalice ninguna competencia.

## 6. Entrenamiento y medición

- Prerequisito para entrevistar: módulo M1/M3 impartido y evaluado (condición de Q-MES-TRV-002 y
  Q-VEN-TRV-002 — 03; y prerequisito del piloto de campo — 15).
- Checkpoints de calibración: M-H y V-H como casos de referencia (A-06.7, CAL).
- KPI de auditoría del piloto: # de flags por 100 sesiones; # de fugas de contenido (objetivo = 0).

## 7. Conexión con gates

- INTERVIEW-G6 (bias) y LEGAL-G4 (datos sensibles) + LEGAL-G5 (no discriminación) requieren este
  protocolo activo. Su cumplimiento se verifica en el piloto de campo (15/16).
