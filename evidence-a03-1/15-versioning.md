# EVALUHR — A-03.1 · PASO 15
# VERSIONADO — 4 DIMENSIONES Y RESULTADOS HISTÓRICOS INTACTOS

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 18 §4 (mayor/menor, append-only); K-VAL-6 (control de
> versión por instrumento); PASO 14 de esta fase (KSEC-5/6).

---

## 1. Las cuatro versiones (encargo)

| Versión | Qué identifica | Cuándo cambia (mayor x+1.0 / menor x.1) |
|---|---|---|
| `assessmentVersion` | La evaluación completa administrada: qué blueprint + qué set de items + qué regla de scoring la componen | **Mayor**: cambia el set puntuable, el blueprint base o la regla de scoring. **Menor**: cambio cosmético sin efecto en contenido/claves/scoring |
| `blueprintVersion` | El mapa de dominios/subdominios y cobertura | **Mayor**: entra/sale un dominio, cambia content/scope/cobertura. **Menor**: redacción sin cambio semántico |
| `itemVersion` | Cada reactivo: enunciado, opciones, clave, rationale, dificultad declarada | **Mayor**: cambia enunciado, opciones o **clave**. **Menor**: ortografía sin cambio de contenido |
| `scoringVersion` | La regla de calificación (cómo se computa el score sobre el set) | **Mayor**: cambia la fórmula o el tratamiento de casos (p. ej., manejo de no-respondidos). **Menor**: documentación |

Regla de composición: `assessmentVersion` **fija** las otras tres — una
assessment version = (blueprintVersion exacta + set de itemVersion exactas +
scoringVersion exacta). No existe assessment "con items flotantes".

## 2. Reglas maestras (KVER-1..KVER-6)

1. **KVER-1**: todo KnowledgeResult conserva **las cuatro versiones** con
   que se administró (campos version, blueprintVersion + itemVersion por
   item + scoringVersion). Sin versiones registradas ⇒ scoring no
   reconstruible ⇒ INSUFFICIENT (PASO 12).
2. **KVER-2**: **una nueva versión NO modifica resultados históricos.**
   Los resultados previos permanecen vinculados a sus versiones originales;
   jamás se re-puntúan, recalculan o "actualizan" (coherencia con la regla
   de no-retroactividad de A-02.3 PASO 13 y KSEC-6).
3. **KVER-3**: los ids son inmutables y no reutilizables (blueprintId,
   itemId — herencia anti "id fantasma"). Cambiar un item = misma identidad
   + nueva versión; reemplazar el contenido por otro = item nuevo con id
   nuevo (el viejo RETIRED).
4. **KVER-4**: el historial de versiones es **append-only y consultable**:
   para cualquier versión pueden recuperarse el blueprint, los items y la
   regla de scoring tal como eran (condición de reproducibilidad del
   scoring, KSC-1).
5. **KVER-5**: la administración registra las versiones al momento de
   responder (no al momento de calificar): la calificación usa las versiones
   concretas del registro de administración (KSEC-10).
6. **KVER-6**: cualquier cambio que afecte el set puntuable de una
   assessment ya publicada exige **nueva assessmentVersion** y republicación
   con compuertas KPUB; el instrumento previo pasa a SUSPENDED/RETIRED con
   motivo (PASO 19).

## 3. Escenarios típicos (coherencia total con PASO 14)

| Situación | Qué versión cambia | Efecto en históricos |
|---|---|---|
| Corrección ortográfica de un item ACTIVE | itemVersion menor → nueva assessmentVersion menor | Históricos intactos (con la versión anterior) |
| Clave incorrecta confirmada | itemVersion mayor (clave nueva) + SUSPENDED del item → nueva assessmentVersion sin el item o con item corregido | Administraciones previas: INSUFFICIENT (score no reconstruible) con causa; **no re-puntuación** |
| Cambia el manual citado (source) | Dominios → REVIEW (KSEC-11) → si cambia contenido: blueprintVersion mayor | Administraciones previas se re-evalúan metodológicamente; si el contenido quedó obsoleto, las lecturas previas se marcan para revisión humana (no se reescriben) |
| Se agrega un dominio con cobertura nueva | blueprintVersion mayor → assessmentVersion mayor | Históricos intactos; el nuevo instrumento no es "el mismo examen" |

## 4. Qué NO hace el versionado

- No "mejora retroactivamente" resultados viejos.
- No permite comparar scores de versiones distintas como si fueran la misma
  medición (comparabilidad entre versiones exige validación específica —
  trabajo futuro; hoy solo se declara la cautela).
- No es sustituto de la validación: versionar no hace válido un item
  inválido (KI-VAL sigue siendo todo-o-nada).
