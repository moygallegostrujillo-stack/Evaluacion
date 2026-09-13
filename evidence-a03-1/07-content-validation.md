# EVALUHR — A-03.1 · PASO 7
# VALIDACIÓN DE CONTENIDO — DE DRAFT A VALID POR REACTIVO

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.5 PASO 6 (K-VAL todo-o-nada por instrumento-version); PASO 4/5
> de esta fase (KI-1..KI-4, CP-3); PASO 19 (estados).

---

## 1. Dos niveles de validación (no confundir)

| Nivel | Objeto | Checklist | Regla de paso |
|---|---|---|---|
| **Instrumento** | La evaluación completa (blueprint + items + scoring) | K-VAL-1..8 (A-02.5 PASO 6) | Todo-o-nada, por instrumento-version |
| **Reactivo** | Cada KnowledgeItem individual | **KI-VAL-1..8 (esta fase, nuevo)** | Todo-o-nada, por item-version |

Un item solo puede pasar de DRAFT a un estado publicable (APPROVED, previo a
ACTIVE) si **todos** los KI-VAL se cumplen. Un instrumento solo es VALID si
además cumple K-VAL-1..8. Ambos niveles son necesarios; ninguno sustituye al
otro.

## 2. Checklist KI-VAL-1..8 (requisitos del encargo)

| # | Requisito | Definición operacional | Verificación |
|---|---|---|---|
| KI-VAL-1 | **Relevancia** | El contenido evaluado pertenece al dominio del blueprint y a un requisito con knowledgeRelevance = VALID | Trazabilidad item→dominio→requisito |
| KI-VAL-2 | **Claridad** | El enunciado es inequívoco, gramaticalmente correcto y plantea un solo problema por pregunta | Lectura del revisor; sin dobles negativas ni preguntas compuestas |
| KI-VAL-3 | **Una sola respuesta correcta** | Exactamente una opción es defendiblemente correcta **contra la source citada**; distractores son incorrectos de forma verificable; existe rationale | Contraste clave↔source; rationale registrado |
| KI-VAL-4 | **Coherencia con el blueprint** | El item cubre lo que el dominio/subdominio declara (content + scope), ni más ni menos | Comparación contra blueprint versionado |
| KI-VAL-5 | **Ausencia de ambigüedad** | Ninguna opción puede leerse como "también correcta" por interpretación razonable; opciones homogéneas en formato y longitud razonable | Revisión adversaria (buscar la interpretación que rompe la clave) |
| KI-VAL-6 | **Ausencia de información innecesaria** | El enunciado no incluye datos que sugieran la respuesta ni contenido ajeno al dominio (pistas, redundancias, relleno) | Lectura del revisor |
| KI-VAL-7 | **Dificultad razonable** | La dificultad declarada es honesta: UNKNOWN salvo evidencia; si existe dificultad provisional (juicio), está marcada como tal y es plausible para el scope del dominio (familiaridad/aplicación/dominio) | PASO 9; prohibido exigir dominio experto a un puesto de nivel básico sin sustento en scope |
| KI-VAL-8 | **Relación con la función del puesto** | Saber el contenido es exigible por la función (trazabilidad R-KREL-1); preguntarlo no invade datos sensibles ni excede el puesto | Referencia a función + proporcionalidad |

Reglas:

1. **KI-V-1**: KI-VAL es **todo-o-nada** por item-version; no existe VALID
   "parcial" ni "casi válido".
2. **KI-V-2**: aplica por **item-version**: corregir el item produce una
   versión nueva que recorre la validación completa desde DRAFT.
3. **KI-V-3**: el dictamen de cada KI-VAL (cumple/no cumple, con nota) queda
   registrado; "no cumple" con motivo = corrección o rechazo (REJECTED).
4. **KI-V-4**: la validación la ejecuta y dictamina un **humano** con
   conocimiento del contenido (AI-X23); la IA puede pre-chequear duplicados
   textuales y flaggear problemas como *candidatos*, jamás dictaminar.

## 3. Criterios de rechazo (REJECTED) de un reactivo

- Falta de clave o clave indefendible (KI-VAL-3) — incluye el caso del
  generador legacy (PASO 6).
- Fuera de dominio / relleno (KI-VAL-1/4).
- Ambigüedad no corregible (KI-VAL-5).
- Pregunta de opinión/preferencia disfrazada de conocimiento (PASO 8).
- Duplicado de otro item ACTIVE (KSEC-1).
- Contenido invasivo de privacidad o ajeno al puesto (KI-VAL-8; herencia
  LFPDPPP/proporcionalidad).

## 4. Estado resultante

```
DRAFT ──(KI-VAL completo + revisión)──► REVIEW ──(dictamen + aprobación)──► APPROVED
   ▲                                      │
   └──── corrección (nueva versión) ◄─────┘
                                          └──(motivo registrado)──► REJECTED
```

APPROVED ≠ publicado: ACTIVE exige además las compuertas KPUB (PASO 19).
Ningún estado intermedio administra candidatos (K-BP-7).
