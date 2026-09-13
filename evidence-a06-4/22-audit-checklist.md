# A-06.4 — 22 · Auditoría Final (PASO 25)

## Checklist (26 cajas)

- [x] legislación vigente investigada
  → `01-legal-framework.md`: LFT, LFPDPPP (reformada 2025), LFPEPD, CONAPRED, NOM-035, Constitución.

- [x] fuentes oficiales
  → diputados.gob.mx, gob.mx, dof.gob.mx, stps.gob.mx, conapred.gob.mx, nmx.conapred.gob.mx, snedh.segob.gob.mx.

- [x] artículos no inventados
  → LFT Art 3 (texto verificado en gob.mx + justia + snedh); LFPDPPP Art 6/7/16/22/37 (diputados.gob.mx); Constitución Art 1.

- [x] finalidad definida
  → `02-purpose.md`: "obtención de evidencia conductual relacionada con las competencias y criterios del puesto específico dentro del proceso de selección laboral".

- [x] proporcionalidad
  → `05-proportionality.md`: 5 preguntas por pregunta; NO_PUBLICABLE si falla.

- [x] datos personales
  → `03-data-categories.md`: 7 categorías clasificadas (PERMITIDO/CONDICIONAL/NO RECOMENDADO/PROHIBIDO).

- [x] datos sensibles
  → `04-prohibited-data.md` + `03-data-categories.md` (categoría G): PROHIBIDO salvo BFOQ con consentimiento expreso.

- [x] discriminación
  → `13-discrimination.md`: matriz completa (PUBLICABLE/CONDICIONAL/NO_PUBLICABLE/LEGAL_REVIEW).

- [x] preguntas prohibidas
  → `04-prohibited-data.md`: 20+ atributos protegidos identificados con ejemplos de preguntas prohibidas.

- [x] BFOQ tratado prudentemente
  → `14-bfoq.md`: excepcional, restrictivo, caso por caso, NO automatizable, REQUIERE REVISIÓN LEGAL.

- [x] IA limitada
  → `08-ai-boundaries.md`: asiste (transcripción/resumen/probes) pero NO decide/infiere; AI_GENERATED + HUMAN_REVIEWED.

- [x] decisión humana
  → `07-automated-decisions.md` + `16-human-review.md`: IA no decide; cadena Evidencia → Revisión humana → CompetencyResult.

- [x] grabación analizada
  → `09-recording-transcription.md`: 4 modalidades (A/B/C/D); A recomendada V1; C/D no recomendadas.

- [x] transcripción analizada
  → `09-recording-transcription.md` modalidad B: condicional con consentimiento expreso.

- [x] conservación analizada
  → `10-retention.md`: plazo recomendado 2 años (no contratados); REQUIERE REVISIÓN LEGAL para plazo exacto.

- [x] acceso definido
  → `11-access-control.md`: 8 roles + matriz de permisos (ver/ver respuestas/revisar/modificar/invalidar/exportar/eliminar).

- [x] trazabilidad
  → `17-traceability.md`: cadena candidate→job→competency→indicator→question→questionVersion→response→evidenceState→reviewer→reviewDate→conflicts→limitations→AI involvement.

- [x] empresa cliente vs EvaluHR
  → `19-client-evalua-responsibilities.md`: matriz de 20 actividades; responsable (empresa) vs encargado (EvaluHR).

- [x] impacto contrato identificado
  → `18-contract-impact.md`: 25 cambios necesarios en contrato maestro (finalidad, encargado, datos, conservación, ARCO, seguridad, brechas, terminación).

- [x] impacto aviso identificado
  → `18-contract-impact.md`: 12 cambios necesarios en aviso de privacidad (finalidad, datos, consentimiento, destinatarios, transferencias, ARCO, IA, revisión humana, contacto).

- [x] gates legales
  → `21-gates.md`: LEGAL-G1..G10; G1-G7/G9 APROBADO (análisis); G8 (conservación) + G10 (transparencia) CONDICIONAL (REQUIERE REVISIÓN LEGAL).

- [x] no se creó scoring
  → CompetencyResult sin campo score; niveles cualitativos; no pesos ni cortes.

- [x] no se crearon preguntas productivas
  → Todos los ejemplos marcados "EJEMPLO — NO PRODUCTIVO"; ningún status ACTIVE.

- [x] no se modificó código
  → `git status`: solo `evidence-a06-4/` (nuevo) + worklog; cero cambios en src/, prisma/, scripts/, public/.

- [x] no se modificó contrato
  → A-06.4 solo identifica cambios necesarios (`18-contract-impact.md`); no redacta ni modifica.

- [x] no se modificó aviso
  → A-06.4 solo identifica cambios necesarios; no redacta ni modifica el aviso de privacidad.

## Resultado: 26/26 ✓
