# A-04.3 — PASO 14: ESCENARIOS CONCEPTUALES DEL overallScore

Fase: A-04.3 (solo auditoría y diseño — NO MODIFICAR IMPLEMENTACIÓN, cumplido).
Fecha: 2026-09-11 (America/Mexico_City).

Método: valores numéricos de referencia fijados para hacer computable cada caso
(NINGÚN resultado fue recalculado ni persistido en el sistema; esto es análisis
documental de la fórmula leída en código):

- BigFive (BF) = 70.00 (promedio de dimensiones con respuesta, normalizado 0–100)
- Psicológica (PSY) = 60.00
- Integridad (INT) = 55.00
- Conocimientos (KN) = 80.00 (canónico, VALID)

Fórmula vigente (flujo interno, src/app/api/evaluations/route.ts L255–304):

```
4 secciones:            overall = 0.25·BF + 0.25·PSY + 0.15·INT + 0.35·KN
BF+PSY+INT (sin KN):    overall = 0.30·BF + 0.30·PSY + 0.40·INT
BF+PSY+KN (sin INT):    overall = 0.30·BF + 0.30·PSY + 0.40·KN   (legacy)
KN + k behaviorales:    overall = 0.50·media(BF,PSY,INT presentes) + 0.50·KN
2 secciones:            overall = media simple (50/50)
1 sección:              overall = esa sección (100%)
0 secciones:            overall = 0
```

`recommendation` NO depende del valor del score: es PENDIENTE (0 secciones),
PERFIL_COMPLETO (BF+PSY+INT+KN con datos), PERFIL_PARCIAL (resto) — L310–317.

---

## Escenario A — Todos los instrumentos válidos

- Participan: BF, PSY, INT, KN (4 secciones).
- overall = 0.25·70 + 0.25·60 + 0.15·55 + 0.35·80 = 17.50 + 15.00 + 8.25 + 28.00
- **overallScore = 68.75** · recommendation = **PERFIL_COMPLETO**
- Nota: Integridad no validada participa con peso 0.15.

## Escenario B — Knowledge INSUFFICIENT (canónico → null)

- Comportamiento canónico: keyedAnswered=0 → knowledgeScore = **null** (INSUFFICIENT,
  nunca 0; knowledge-canonical.ts L827-830) → sección EXCLUIDA del overall.
- Participan: BF, PSY, INT (3 secciones, rama sin KN).
- overall = 0.30·70 + 0.30·60 + 0.40·55 = 21.00 + 18.00 + 22.00
- **overallScore = 61.00** · recommendation = **PERFIL_PARCIAL**
- Hallazgo de renormalización: al desaparecer KN, el peso de INT salta 0.15→0.40
  (×2.67). El mismo candidato cae de 68.75 a 61.00 SOLO por renormalización, y la
  integridad no validada pasa a determinar el 40% del score.
- Respuesta a PASO 5: INSUFFICIENT → **null → excluido → renormalizado** (NO 0).

## Escenario C — Integridad "INSUFFICIENT"

No existe estado INSUFFICIENT para Integridad (schema: `integrityScore Float
@default(0)`). El concepto se materializa de 3 formas DIVERGENTES:

- **C1 — interno, sección sin responder** (p. ej., consentimiento retirado con
  purga de sensibles): hasIntegrityData=false → participan BF, PSY, KN.
  overall = 0.30·70 + 0.30·60 + 0.40·80 = **71.00** · **PERFIL_PARCIAL**.
- **C2 — público**, `integrityScore > 0` como proxy de datos (L568): cualquier
  integridad almacenada 0.00 (default O peor-respuesta-posible: todas las
  respuestas = 1 → normalización 0.00) se trata como AUSENTE → ídem C1 (71.00).
  CONFUSIÓN documentada: peor puntaje real = sin datos.
- **C3 — interno, candidato respondió TODO lo peor** (todas = 1): tiene
  respuestas → hasIntegrityData=true → INT=0.00 PARTICIPA:
  - con KN: overall = 0.25·70 + 0.25·60 + 0.15·0 + 0.35·80 = **60.50**
  - sin KN: overall = 0.30·70 + 0.30·60 + 0.40·0 = **39.00** · **PERFIL_PARCIAL**
- Demostración R7: los mismos datos subyacentes producen 39.00 (interno) vs
  71.00 (público) según qué implementación procese la fila.

## Escenario D — IPIP válido (solo personalidad)

- Aclaración PASO 9: **IPIP-50-MX NO existe en el código** (grep = 0 en src/).
  Lo que existe y participa es el Big Five demo de 10 ítems. "IPIP válido" aquí
  = BF demo con datos.
- Participa: BF solo (1 sección) → **overallScore = 70.00** · **PERFIL_PARCIAL**
  (overall = 100% de la única sección con datos).

## Escenario E — Psychology válido + Integrity insufficient

- Participa: PSY solo → **overallScore = 60.00** · **PERFIL_PARCIAL**
- La ausencia de Integridad es irrelevante aquí (ya solo queda 1 sección = 100%).

## Escenario F — Knowledge valid + Integrity insufficient

- Participa: KN solo → **overallScore = 80.00** · **PERFIL_PARCIAL**
- Con KNOWLEDGE_ONLY (consentimiento), este es el caso típico: el overall queda
  = % de conocimientos, etiquetado como score "general".

## Escenario G — Knowledge insufficient + Integrity insufficient

- Participan: BF, PSY (2 secciones) → media simple (70+60)/2
- **overallScore = 65.00** · **PERFIL_PARCIAL**
- Renormalización: 50/50 igualitario; ni INT ni KN participan.

## Escenario H — Todos excepto Psychology (BF + INT + KN)

- sectionsWithData = 3; cae en rama "KN + behavioral" (KN presente, PSY ausente):
  overall = 0.50·media(70, 55) + 0.50·80 = 0.50·62.50 + 40.00 = 31.25 + 40.00
- **overallScore = 71.25** · **PERFIL_PARCIAL**
- Pesos EFECTIVOS: BF 25%, INT 25%, KN 50% — es decir, al faltar PSY, el peso
  de KN sube a 0.50 y BF/INT se reparten 0.25 cada uno (distinto de las ramas
  0.30/0.30/0.40). No existe una rama específica BF+INT+KN: la cobertura de
  casos es por orden de ifs, no por matriz de pesos explícita.

---

## Síntesis de comportamiento

| Caso | Participan | overall | recommendation |
|---|---|---|---|
| A | BF+PSY+INT+KN | 68.75 | PERFIL_COMPLETO |
| B (KN INSUFFICIENT→null) | BF+PSY+INT | 61.00 | PERFIL_PARCIAL |
| C1 (INT sin datos, interno) | BF+PSY+KN | 71.00 | PERFIL_PARCIAL |
| C2 (INT=0.00, público) | BF+PSY+KN | 71.00 | PERFIL_PARCIAL |
| C3 (INT=0.00 real, interno) | BF+PSY+INT(=0) | 60.50 (con KN) / 39.00 (sin KN) | PERFIL_PARCIAL |
| D (solo BF) | BF | 70.00 | PERFIL_PARCIAL |
| E (solo PSY) | PSY | 60.00 | PERFIL_PARCIAL |
| F (solo KN) | KN | 80.00 | PERFIL_PARCIAL |
| G (BF+PSY) | BF+PSY | 65.00 | PERFIL_PARCIAL |
| H (BF+INT+KN) | BF+INT+KN | 71.25 | PERFIL_PARCIAL |

Observaciones de auditoría (sin modificar nada):

1. El MISMO candidato obtiene 68.75 / 61.00 / 71.00 / 65.00 / 71.25 según qué
   secciones falten — la renormalización por ramas mueve el score ±10 puntos
   sin cambio de desempeño.
2. El peso de Integridad (no validada) varía 0.15 → 0.40 → 0.50 (efectivo) →
   1.00 según el patrón de datos: la participating-no-validada puede llegar a
   ser el 100% del overall (escenario de 1 sección).
3. `recommendation` nunca usa umbrales de score: solo presencia de datos.
4. Ruta de video (si overallScore===0 al llegar al paso de video): otra fórmula
   (0.30/0.30/0.40 proporcional, SIN integridad, Big Five con neuroticismo
   re-invertido y /5 fijo) puede SOBREESCRIBIR el overall — escenario A ahí no
   daría 68.75 sino un valor distinto e inconsistente con el flujo principal.
