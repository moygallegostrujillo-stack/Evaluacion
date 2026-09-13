# EVALUHR — A-02.3 · PASO 14
# LÍMITES DE LA IA EN LA CAPA DE INTERPRETACIÓN Y SALIDAS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-01.3 (IA = 0 en el resultado psicométrico), A-02.1 (IA = 0 en
> criterios/áreas/recomendaciones), A-02.2 PASO 12 (AI-1..AI-4, AI-X1..X9).

---

## 1. Principio

> En la capa de interpretación y salidas, la IA **nunca crea, nunca calcula,
> nunca decide y nunca rellena**. Es, a lo sumo, **asistente de comunicación
> y preparación supervisada**: trabaja sobre evidencia y áreas **ya
> existentes**, produce borradores **revisables** y queda **marcada** en el
> audit trail.

La IA no es fuente (`source` sin valor "AI", A-02.2), no es autoridad de
calidad (AI-X3), no es revisora (PASO 13) y no es decisora (AI-X5).

---

## 2. La IA PUEDE (solo esto, con condiciones)

| # | Permitido en A-02.3 | Condiciones exactas |
|---|---|---|
| AI-2 | **Resumir evidencia ya existente** | Solo citando `evidenceId` reales; sin añadir datos, sin interpretar más allá del contenido de los registros; salida marcada y revisable por humanos. |
| AI-3b | **Convertir resultados técnicos en lenguaje comprensible** | Solo reformula lo que ya está en InstrumentResult/CriterionResult/AssessmentSummary (resultados, calidades, estados, limitaciones); prohibido añadir conclusiones nuevas, suavizar INSUFFICIENT, o traducir insuficiencia como deficiencia; texto marcado como asistido. |
| AI-5 | **Sugerir preguntas de entrevista basadas en áreas ya identificadas** | Solo sobre `areaId`/`criterionId` **ya producidos por reglas deterministas** (PASO 11); son borradores para el entrevistador humano; la IA no administra entrevistas, no registra respuestas como evidencia (AI-X8) y sus sugerencias no son evidencia ni áreas nuevas. |

Regla común (herencia A-02.2): toda salida asistida por IA queda **marcada**
en el audit trail y **requiere validación humana** antes de usarse. Ninguna
salida asistida modifica `value`, `quality`, `status`, estados (PASO 1),
resultados, áreas ni recomendaciones.

---

## 3. La IA NO PUEDE (prohibiciones absolutas)

| # | Prohibido | Racional / herencia |
|---|---|---|
| AI-X1 | **Crear evidencia** (valores, resultados, notas, verificaciones, áreas) | La evidencia nace solo de métodos humanos/deterministas (A-02.2 PASO 1). |
| AI-X2 | **Cambiar scores** (o cualquier `value`/resultado) | El resultado es del instrumento versionado; nadie lo edita. |
| AI-X2b | **Rellenar datos faltantes** (imputar, estimar, "completar con lo que sugiere el perfil") | INSUFFICIENT ≠ 0 (PASO 1); ausencia no se rellena (A-02.2 PASO 11). |
| AI-X3 | **Decidir calidad** (de registros, instrumentos o administraciones) | Calidad determinista por reglas + gobernanza (A-02.2 PASO 3/16). |
| AI-X4 | **Inventar validación** (de instrumentos, métodos, implementaciones) | La validación exige evidencia científica y gobernanza. |
| AI-X5 | **Emitir la decisión laboral** (contratar, rechazar, avanzar) | Decisión exclusivamente humana/empresa (A-02.1 PASO 11). |
| AI-X6 | **Crear puntos de corte, pesos o umbrales por sí misma** | Prohibidos en toda la cadena. |
| AI-X7 | **Resolver conflictos** o elegir "la fuente correcta" | PASO 9: revisión humana obligatoria. |
| AI-X8 | **Entrevistar** o generar notas "por" el entrevistador | La evidencia de entrevista es humana (A-02.2 PASO 9). |
| AI-X9 | **Interpretar rasgos como aptitudes/desempeño** | Herencia A-01.3/A-02.1 sin excepciones. |
| AI-X10 | **Convertir INSUFFICIENT en resultado positivo o negativo** (suavizarlo, dramatizarlo, o "leerlo" a favor/en contra de la persona) | El estado es informativo y recuperable; la IA no le añade carga valorativa. |

---

## 4. Aplicación al estado actual del sistema

- En la implementación vigente, la IA **no participa** en scoring ni
  interpretación (A-01.2/A-01.3); A-02.3 no agrega ningún flujo de IA.
- Este documento define **límites preventivos** vigentes desde ya como
  política para cualquier incorporación futura (AI-2/AI-3b/AI-5), que exigiría
  además: aprobación de gobernanza, marcado de origen, validación humana de
  cada salida y auditoría periódica.

---

## 5. Regla de detección (para auditoría del PASO 18)

Es **violación de política** si una salida: presenta como evidencia algo sin
`evidenceId` trazable; añade conclusiones ausentes de los registros; presenta
INSUFFICIENT con carga valorativa; u ofrece "preguntas sugeridas" ancladas a
áreas inexistentes. Referencias de cumplimiento: este PASO y A-02.2 PASO 12.
