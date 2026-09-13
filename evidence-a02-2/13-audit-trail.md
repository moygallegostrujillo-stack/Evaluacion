# EVALUHR — A-02.2 · PASO 13
# AUDIT TRAIL (PISTA DE AUDITORÍA DE LA EVIDENCIA)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Coherente con A-01.3 (`10-version-control.md`: append-only, no
> reinterpretación) y A-02.1 (registros de criterios y de revisión humana).

---

## 1. Objetivo

> Debe ser posible **reconstruir, sin ambigüedad**, para cualquier evidencia:
>
> 1. **quién generó la evidencia**;
> 2. **qué instrumento se utilizó**;
> 3. **qué versión**;
> 4. **qué datos fueron utilizados**;
> 5. **qué cálculo posterior se hizo**;
> 6. **quién revisó**;
> 7. **cuándo**.

El audit trail es la memoria reconstructiva del sistema: permite responder
"¿qué se sabía en el momento t y con qué reglas?", incluso años después y
aunque reglas o versiones hayan cambiado.

---

## 2. Contenido mínimo del trail (mapeo de los 7 puntos)

| Pregunta | Qué se conserva |
|---|---|
| 1. Quién generó | `source` (SYSTEM_INSTRUMENT / HUMAN_INTERVIEW / DOCUMENT_VERIFICATION / CANDIDATE_DECLARATION / GOVERNANCE_REGISTRY) + identidad del actor: cuenta del sistema/tenant para instrumentos; nombre/rol del entrevistador o verificador para evidencia humana. Acciones de IA marcadas como asistencia (nunca como fuente; PASO 12). |
| 2. Qué instrumento | `instrument` (identificador) + vínculo a la aprobación criterio↔instrumento vigente (matriz A-02.1). |
| 3. Qué versión | `instrumentVersion` (+ languageVersion/scoringVersion cuando aplique, cuádruple identificador estilo A-01.3) + versión del criterio (`criterionVersion`) + versión de las reglas de calidad aplicadas (esta fase, cuando se implemente: `qualityRulesVersion`). |
| 4. Qué datos | Referencias a los datos crudos: respuestas (IDs de sesión/respuestas), documentos referenciados (no el documento), notas de entrevista (texto registrado), declaraciones. Los datos crudos se conservan según política de retención vigente (`retention.ts`, que no se modifica). |
| 5. Qué cálculo posterior | Cada transformación futura de evidencia (interpretación, composición, niveles de ajuste — fases posteriores) debe registrar: regla aplicada + versión + entradas (`evidenceId`s) + salida. En A-02.2 **no existen cálculos**: este punto queda definido como obligación de toda fase futura. |
| 6. Quién revisó | Revisor humano identificado (nombre/rol), distinto del generador cuando sea posible (separación de duties, PASO 16). |
| 7. Cuándo | `timestamp` UTC de captura + fechas de registro, revisión, invalidación y toda acción posterior. Zona horaria de captura declarada. |

---

## 3. Propiedades del trail

1. **Append-only**: nada se borra ni se edita; las correcciones son registros
   nuevos con referencia al original; la invalidación es un evento
   (`status=INVALIDATED` + motivo + autor).
2. **Inmutable ante la interpretación**: los registros crudos no cambian
   aunque cambien reglas; las reglas versionadas conviven con los datos que
   generaron.
3. **Completo de extremo a extremo**: desde la captura hasta cada uso
   posterior ("esta evidencia alimentó X el día Y con la regla Z/vN").
4. **Sin reinterpretación retroactiva**: los históricos se leen con las
   reglas de su época (herencia A-01.3; los futuros "niveles de ajuste"
   heredarán la misma regla).

---

## 4. Eventos que SIEMPRE se registran

| Evento | Contenido mínimo |
|---|---|
| Captura de evidencia | Todos los campos del EvidenceRecord + actor + UTC |
| Asignación de calidad | Nivel + regla que la produjo (versión de reglas) |
| Cambio de reviewStatus | De → A, revisor, fecha, nota |
| Conflicto marcado/cerrado | Registros involucrados (`conflictRef`), fecha, lectura humana de cierre |
| Invalidación | Autor (gobernanza), motivo, fecha, evidencia sustituta si existe |
| Uso de la evidencia en cualquier salida | evidenceId(s) + regla/versión + destino de la salida |
| Asistencia de IA (si alguna vez se autoriza) | Tarea, salida producida, validador humano — marcada como asistencia |

---

## 5. Reconstrucción (prueba de la memoria)

El trail debe permitir reconstruir un caso completo con estas preguntas:

```
1. ¿Qué criterios tenía el puesto y en qué versión?      → A-02.1 registros
2. ¿Qué instrumentos/métodos se aplicaron y qué versión? → puntos 2–3
3. ¿Qué evidencia se capturó, cuándo y por quién?        → punto 1, 4, 7
4. ¿Qué calidad tenía y por qué?                         → regla + versión
5. ¿Quién revisó qué y cuándo?                           → punto 6, 7
6. ¿Hubo conflictos/invalidaciones y cómo se cerraron?   → eventos §4
7. ¿Qué salidas usaron esta evidencia y con qué reglas?  → punto 5
```

Si alguna pregunta no puede responderse desde el trail, el diseño está
incompleto — obligación de verificación en las fases de implementación
futuras (no en A-02.2, que no implementa).

---

## 6. Privacidad y acceso

- El trail contiene referencias, no necesariamente documentos; los datos
  personales siguen sujetos al aviso de privacidad y a la política de
  retención vigentes (que A-02.2 no modifica).
- El acceso al trail es para roles de auditoría/gobernanza; la persona
  evaluada puede ejercer derechos conforme al aviso vigente.
- El trail no expone secretos ni datos sensibles innecesarios en los
  registros de eventos.
