# EVALUHR — A-06.7 — 08 · Protocolo Refinado de Conflictos (PASO 9)

> **PILOTO / DRAFT / NO PRODUCTIVO.** Refina A-06.4 `12-conflicts.md` y A-06.5/A-06.6: **CONFLICT →
> PENDING_REVIEW** — nunca promedio, nunca "gana el más alto", nunca resolución automática.
> Piloto: M-F y V-F (CV "supervisé 15 personas" vs entrevista sin conducta).

## 1. Principio

Cuando dos fuentes de información sobre el mismo hecho se contradicen, **ninguna fuente gana por
autoridad** (ni el CV, ni la entrevista, ni la referencia). La contradicción se documenta y se eleva a
revisión humana. La resolución humana puede: aclarar, confirmar, refutar o dejar pendiente — siempre
con rationale registrada.

## 2. Fuentes y pares de conflicto

| Par de fuentes | Ejemplo típico | Estado |
|---|---|---|
| CV vs entrevista | CV: "supervisé 15 personas"; entrevista: sin conducta de supervisión | CONFLICT → PENDING_REVIEW |
| Entrevista vs entrevista | "Nunca tuve un reclamo" (Q1) vs narrativa de reclamo detallada (Q2) | CONFLICT → PENDING_REVIEW |
| Referencia vs entrevista | Referencia: "resolvía quejas él solo"; entrevista: siempre escalaba al encargado | CONFLICT → PENDING_REVIEW |
| Referencia vs CV | Referencia: "puesto operativo"; CV: "supervisor de área" | CONFLICT → PENDING_REVIEW |

## 3. Protocolo refinado (v2)

| # | Paso |
|---|---|
| **C-1** | **Detección**: solo contradicciones sobre **hechos verificables** (roles, alcance, logros, fechas). No son conflictos: detalles imprecisos ("15" vs "como 12 personas"), ni contradicciones de opinión. |
| **C-2** | **Registro**: ConflictRecord {conflictId, candidateId, jobId, questionId(s), fuentes en pugna, quote de cada fuente, fecha}. Append-only. |
| **C-3** | **Estado**: la unidad de evidencia afectada → **PENDING_REVIEW** (la evidencia no válida ni se descarta; queda congelada a la espera de revisión). |
| **C-4** | **Información adicional** (ver §4): el revisor puede solicitar datos permitidos para aclarar. Prohibido introducir preguntas discriminatorias. |
| **C-5** | **Resolución humana** (entrevistador ≠ revisor del conflicto cuando exista segundo revisor; ver `14-human-review.md`): (a) **Aclarado** — era imprecisión de redacción → se anota y el estado vuelve a la regla normal con rationale; (b) **Confirmado** — la entrevista aporta el ejemplo conductual faltante → se evalúa ese ejemplo por sí mismo (el CV no "sube" el nivel); (c) **Refutado** — la conducta afirmada no se sostiene → la evidencia queda limitada a lo mostrado en entrevista; la contradicción se anota en limitaciones; (d) **No resuelto** → PENDING_REVIEW permanece; la competencia queda **excluida de agregación automática**. |
| **C-6** | **Documentación**: toda resolución con rationale; la IA no resuelve ni sugiere veredictos (puede listar las contradicciones textuales detectadas — asistencia). |
| **C-7** | **No escalado**: resolver un conflicto NUNCA puede elevar el nivel por encima de lo que la evidencia conductual de la entrevista sustenta (el CV o la referencia no generan indicadores observados). |

## 4. Información adicional que el revisor PUEDE solicitar (sin introducir discriminación)

**Permitido:**
1. Aclarar con el candidato (en entrevista o por el medio del proceso) el **alcance del rol** declarado en el CV ("¿qué entendías por 'supervisé'?", "¿cuántas personas reportaban directamente a ti y qué decidías tú?").
2. Pedir al candidato **un ejemplo específico pasado** que demuestre la conducta afirmada (redirección BDI estándar).
3. Solicitar **referencia laboral** del empleador relevante, con consentimiento del candidato (A-06.4 `10-retention.md`/`06-consent-information.md`).
4. Verificar **documentos de empleo** que el propio proceso ya contempla (cartas de empleo, con consentimiento).

**Prohibido (lista no exhaustiva — ver A-06.4 `04-prohibited-data.md`):**
- Preguntas sobre embarazo, planes familiares, edad, religión, origen, salud o discapacidad para "explicar" la contradicción.
- Indagar situación económica, familiar o de pareja del candidato como verificación.
- Pedir "pruebas" de circunstancias personales (p. ej., certificados médicos para explicar vacíos).
- Tonos de interrogatorio adversarial o accusatorio; la verificación es de **hechos laborales verificables**, no de la persona.
- Solicitar datos sensibles o usar el conflicto para elicitar atributos protegidos (toda revelación involuntaria sigue la regla: no registrar, no usar, retomar conducta).

## 5. Ejemplos de calibración

| Caso | Conflicto | Resolución modelo |
|---|---|---|
| M-F / V-F (piloto) | CV "supervisé 15" vs entrevista sin conducta | PENDING_REVIEW; el revisor puede pedir ejemplo específico (C-4.2); si no emerge conducta → refutado en lo conductual: la supervisión no se acredita por el CV; se anota en limitaciones. Nunca "gana el CV". |
| CAL-27 (nuevo) | Referencia: "manejaba la caja sin errores"; entrevista: cuenta que le descontaron por faltante | CONFLICT → PENDING_REVIEW; revisor solicita aclaración con el candidato (C-4.1); resolución documentada; la conducta de caja se evalúa solo por lo mostrado en entrevista. |
| CAL-28 (nuevo) | Entrevista Q1: "nunca me he atrasado"; Q3 (ORG): narrativa de llegadas tardías reiteradas | CONFLICT entre respuestas → PENDING_REVIEW; sin promediar; se registra y eleva. |
