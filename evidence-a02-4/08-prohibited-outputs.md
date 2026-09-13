# EVALUHR — A-02.4 · PASO 8
# PROHIBICIONES DEL MODELO DE NIVEL DE AJUSTE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.

---

## 1. Lista prohibida del encargo (el modelo no puede producir)

| # | Prohibido | Sustituto permitido |
|---|---|---|
| X1 | **APTO** | Nivel de ajuste con calificadores P6/P7 + explicación |
| X2 | **NO APTO** | "El resultado difiere de la correspondencia esperada" + áreas de revisión; resultado incompleto si procede |
| X3 | **DEBE CONTRATAR** | "Orientación técnica, no decisión de contratación" (P7); decisión exclusiva de la empresa |
| X4 | **NO DEBE CONTRATAR** | Ídem (el modelo no tiene forma de rechazo) |
| X5 | **CANDIDATO IDEAL** | Descripción de correspondencia por criterio; no existen perfiles ideales |
| X6 | **PROBABILIDAD DE ÉXITO** | No existe criterio externo ni validez predictiva (herencia A-01.3) |
| X7 | **PREDICCIÓN DE DESEMPEÑO** | Ídem; "insumo de revisión humana" |

Sustitutos prohibidos por extensión (filtro semántico de A-02.1): "idóneo",
"calificado", "recomendado para contratación", "aprobado por el sistema",
"porcentaje de encaje", "match %", "top N candidatos", "fit score".

---

## 2. Prohibiciones estructurales adicionales de esta fase

1. ❌ **INSUFFICIENT → 0** (regla maestra; aplicada como exclusión/tope/gate).
2. ❌ **Compensación de criterios críticos** (PASO 5/15).
3. ❌ Resolver conflictos matemáticamente (PASO 11).
4. ❌ Reinterpretar resultados históricos con reglas nuevas (herencia
   versionado A-01.3).
5. ❌ Consumir InstrumentResults directamente (solo CriterionResults —
   verificación del PASO 20).
6. ❌ Comparar personas en ranking; la salida nunca rankea candidatos.
7. ❌ Cualquier uso de la salida como cierre automático de un proceso.
8. ❌ Que la IA modifique pesos, criticidad, gates o el nivel producido
   (PASO 12).
9. ❌ Cerrar el gate por expiración, presión operativa o conveniencia.
10. ❌ Mostrar el nivel sin su explicación (criterios + evidencia + estado)
    y sin calificadores orientativos.

---

## 3. Vigencia

Estas prohibiciones son **política de diseño desde ya** y se verifican en la
auditoría del PASO 20 (13 verificaciones) y en cada entrega futura que
implemente o toque la capa de ajuste. Solo una decisión documentada de
gobernanza — con evidencia propia que la respalde — puede modificarlas
(coherencia con A-02.1 PASO 8 §1).
