# EVALUHR — A-02.4 · PASO 12
# LÍMITES DE LA IA EN EL MODELO DE NIVEL DE AJUSTE

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: A-01.3 (IA = 0 en resultado psicométrico), A-02.1 (IA = 0 en
> criterios/áreas/recomendaciones), A-02.2 PASO 12 (AI-X1..X9), A-02.3 PASO 14
> (AI-X10, AI-5). Este PASO añade las restricciones específicas del ajuste.

---

## 1. Principio

> En el modelo de nivel de ajuste, la IA **no tiene autoridad**: no toca
> parámetros (pesos, criticidad, topes, umbrales), no gestiona brechas ni
> conflictos, y **no genera el nivel de ajuste de forma autónoma**. El nivel
> es producto exclusivo de **reglas deterministas versionadas** operadas por
> el sistema.

---

## 2. La IA NO puede (restricciones del encargo + extensiones)

| # | Prohibido | Detalle / herencia |
|---|---|---|
| AI-X11 | **Cambiar pesos** (ni proponer valores productivos sin proceso de gobernanza) | Los pesos/topes son parámetros de reglas versionadas; solo gobernanza los fija o cambia (con registro). Valores ilustrativos del diseño no son operativos. |
| AI-X12 | **Cambiar criticidad** de un criterio | La criticidad vive en el Criterion Record aprobado (PASO 3); la IA no participa en criterios (herencia A-02.1). |
| AI-X13 | **Resolver missing data** (rellenar, imputar, estimar, "completar" brechas) | INSUFFICIENT ≠ 0; la ausencia solo se resuelve con evidencia real (A-02.2 PASO 11; AI-X2b heredado). |
| AI-X14 | **Resolver conflictos** o arbitrar fuentes | Revisión humana obligatoria (PASO 11; AI-X7 heredado). |
| AI-X15 | **Convertir evidencia insuficiente** en utilizable (reescribir estados, "ascender" LIMITED a VALID, suavizar INSUFFICIENT) | Los estados derivan por tabla M1–M6 (A-02.3); inmutables por IA. |
| AI-X16 | **Generar el nivel de ajuste de forma autónoma** (ni el nivel, ni gates, ni topes, ni el resultado incompleto) | JobFit = 𝒜 por reglas versionadas; la IA no es 𝒜. |
| — | (Heredadas y vigentes) AI-X1..X10 | Crear evidencia; cambiar scores; decidir calidad; inventar validación; decidir contratación; crear cortes; resolver conflictos; entrevistar; interpretar rasgos como aptitudes; convertir INSUFFICIENT en resultado positivo/negativo. |

---

## 3. La IA puede (solo esto, con marcado y validación humana)

| # | Permitido | Condiciones |
|---|---|---|
| AI-17 | **Explicar el resultado** del nivel de ajuste | Solo reformula la explicación ya producida por las reglas (criterios + evidencia + estado, PASO 17); sin añadir conclusiones, sin suavizar exclusiones/gates, sin reordenar la sustancia; texto marcado como asistido. |
| AI-2 | **Resumir evidencia ya existente** | Heredado de A-02.3: solo `evidenceId`s reales, sin añadir datos. |
| AI-5 | **Sugerir preguntas para entrevista basadas en áreas previamente identificadas** | Heredado de A-02.3: solo sobre `areaId` ya producidos por reglas; borradores para el entrevistador; no son evidencia ni áreas nuevas. |

Regla común: toda salida asistida queda **marcada** en el audit trail y
requiere **validación humana**. Ninguna salida asistida modifica el nivel,
los gates, los parámetros ni los estados.

---

## 4. Regla de detección (auditoría)

Es **violación de política** si: el nivel mostrado no reproduce desde las
reglas versionadas; un parámetro (peso/criticidad/tope/umbral) cambió sin
registro de gobernanza; una brecha o conflicto desapareció de una salida; o
un texto "explicativo" añade conclusiones ausentes de los registros.
Referencias: este PASO, PASO 16 (métricas) y la auditoría del PASO 20.
