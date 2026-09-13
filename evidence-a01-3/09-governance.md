# A-01.3 — PASO 10: GOBERNANZA DEL INSTRUMENTO

> Define roles y reglas de cambio para EVALHR-PERSONALIDAD-IPIP50-MX.
> Regla central: **ningún cambio directo sobre v1.0.** Todo cambio genera una nueva
> versión (v1.1, v2.0, …) según impacto.

## 1. Propietario del instrumento (Instrument Owner)

- **Propietario**: la persona designada por la dirección de EvaluHR como responsable
  del instrumento (por defecto, el Product Owner de EvaluHR). Registro del titular
  vigente: anotar aquí nombre y fecha al momento de designación formal.
  *(Designación actual: Product Owner de EvaluHR — pendiente de nominalización formal
  por la dirección; mientras tanto, el rol lo ejerce quien administre el repositorio
  con aprobación de la dirección.)*
- Responsabilidades: custodiar este expediente; autorizar cambios; asegurar que el
  expediente y el código no se contradigan; aprobar o rechazar nuevas versiones.

## 2. Quién puede MODIFICAR el instrumento

- Nadie modifica v1.0 en producción. Los cambios se desarrollan como candidate
  version en rama/entorno aparte.
- El equipo de desarrollo puede proponer cambios técnicos (bug fixes de plataforma que
  no toquen reactivos, orden, scoring ni interpretación) — estos no requieren nueva
  versión del instrumento si son transparentes para el candidato y no alteran
  resultado alguno (p. ej., mejoras de accesibilidad visual), documentándose en el
  registro de cambios sin tocar la cuádruple versión.
- Cualquier cambio que toque **reactivos, texto de ítems, orden, número de ítems,
  escala, instrucción, scoring o resultados** requiere nueva versión (Sección 6).

## 3. Quién puede APROBAR una nueva versión

- Aprobación mínima: **Instrument Owner + dirección de EvaluHR** (dos firmas).
- Para cambios psicométricos (reactivos, scoring, escala), se requiere además
  **asesoría psicometría** documentada (interna o externa) que emita opinión escrita
  sobre la evidencia que acompañará la nueva versión.

## 4. Quién puede CAMBIAR el scoring

- El scoring es parte congelada de `scoringVersion`. Solo puede cambiarse mediante una
  **nueva `scoringVersion`** (p. ej., IPIP50-BFM-1.1) aprobada como en Sección 3.
- Prohibido: añadir/quitar inversiones, cambiar la fórmula de suma, añadir pesos,
  baremos, percentiles, categorías o scores globales sin pasar por el proceso anterior.
- Los resultados históricos **nunca se recalculan** con un scoring nuevo (ver
  `10-version-control.md`).

## 5. Quién puede TRADUCIR o editar la redacción

- v1.0 usa la traducción publicada por Rodrigo de Oliveira verbatim. **Nadie edita la
  redacción sobre v1.0** (ni siquiera "erratas" ortográficas o de estilo).
- Una futura edición lingüística (traducción nueva o ajuste de ítems, incluida la
  eventual revisión de q36r sugerida por los autores del estudio) genera una nueva
  `languageVersion` y una nueva versión del instrumento, con: justificación escrita,
  método documentado (p. ej., back-translation independiente o consenso de expertos),
  y evidencia psicométrica propia de la nueva redacción antes de publicarse
  (Sección 7).

## 6. Qué evidencia debe existir ANTES de publicar una nueva versión

Checklist obligatorio de publicación (ningún ítem opcional):

1. **Justificación** del cambio (motivo, impacto esperado, alternativas descartadas).
2. **Clasificación de impacto** (mayor/menor — ver Sección 8) y número de versión
   propuesto.
3. **Expediente actualizado**: inventario, fuente, derechos, evidencia, item-map,
   scoring spec y matrices reflejan la nueva versión (nueva carpeta de evidencia o
   anexos numerados).
4. **Evidencia psicométrica de la nueva versión** para cambios de reactivos/escala/
   scoring: al menos un estudio documentado (p. ej., consistencia interna en muestra
   pertinente, y análisis que respalde la estructura) — **no se publica una versión
   nueva de reactivos o scoring sin datos propios**.
5. **Pruebas deterministas** equivalentes a los TEST 1–10 (adaptadas a la nueva
   versión) ejecutadas y conservadas (0 fallidas).
6. **E2E de plataforma** conservado (raws correctos, separación de instrumentos,
   versiones persistidas).
7. **Revisión jurídica-documental** contra `08-permitted-use.md` y
   `12-legal-language-matrix.md`.
8. **Plan de coexistencia**: cómo convivirán la versión anterior y la nueva, y qué se
   mostrará a RH con resultados de ambas (sin reinterpretar históricos).
9. **Aprobación** registrada (Sección 3) con fecha y responsables.

## 7. Quién puede RETIRAR una versión

- El retiro (desactivar la administración de una versión para nuevos procesos) lo
  decide el Instrument Owner con la dirección.
- El retiro **no borra ni reinterpreta** resultados históricos: los resultados siguen
  siendo de la versión con que fueron producidos y consultables con su cuádruple
  identificador.
- Toda retirada se documenta (fecha, motivo, versión sustituta si la hay).

## 8. Clasificación de impacto de los cambios

| Cambio | Tipo de versión | Ejemplos |
|---|---|---|
| Cambio de reactivos, su redacción, número u orden | **Mayor** (v2.0) | Reemplazar ítems; aplicar la revisión de q36r |
| Cambio de escala, anclas o instrucción | **Mayor** (v2.0) | Pasar a 7 puntos; nueva instrucción |
| Cambio de scoring (inversiones, fórmula, pesos) | **Mayor** (v2.0) | Nueva scoringVersion |
| Cambio de fuente/versión lingüística (otra traducción publicada) | **Mayor** si cambia reactivos; **Menor** si es corrección documental sin cambio de textos | Adoptar otra adaptación publicada |
| Corrección de defectos de plataforma sin efecto en reactivos/scoring/resultados | **Menor** (v1.1) o solo parche técnico | Fix de UI, rendimiento |
| Actualización documental (este expediente) sin cambio del instrumento | Sin versión nueva del instrumento (revisión documental) | Nuevas capturas, erratas de expediente |

## 9. Registro de cambios (CHANGELOG del instrumento)

| Versión | Fecha | Cambio | Evidencia |
|---|---|---|---|
| 1.0 | 2026-09 (A-01.2) | Implementación inicial: IPIP-50 es-MX verbatim, scoring oficial, 4-tuple versionado | `evidence-a01/`, `00-master-dossier.md` |

## 10. Guardas adicionales

1. **Congelación del módulo**: `src/lib/instruments/ipip50-mx.ts` es la única fuente de
   reactivos/scoring; cualquier cambio allí implica proceso de gobernanza completo.
2. **Anti-IA permanente**: prohibido generar, "mejorar" o completar reactivos, anclas o
   scoring con IA en cualquier versión. La IA solo podría asistir en una futura capa de
   explicación, sin participación en generación/puntaje/decisión.
3. **Auditoría periódica**: al menos una vez por ciclo de producto, verificar que
   código y expediente coinciden (el checklist `13-audit-checklist.md` sirve de guion).
4. **Trazabilidad**: cada resultado persiste el cuádruple identificador; los reportes
   indican la versión del instrumento con que se produjeron.

— FIN DEL DOCUMENTO DE GOBERNANZA —
