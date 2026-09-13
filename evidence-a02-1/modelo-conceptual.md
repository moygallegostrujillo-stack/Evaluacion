# EVALUHR — A-02.1 · PASO 16
# MODELO CONCEPTUAL DE EXTREMOS A EXTREMOS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Cadena maestra

```
┌─────────────────────────────────────────────────────────────────┐
│  PUESTO                                                          │
│  Registro con 10 campos mínimos (01 §2), fuentes F1–F5,          │
│  estado VIGENTE. Sin registro vigente, no hay cadena.            │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  CRITERIOS                                                       │
│  Requisitos traducidos a criterios evaluables (PASO 3):          │
│  criterionId · categoría A–E · jobRelevance trazada ·            │
│  requiredOrPreferred · evidenceSource · approvedBy · version     │
│  Prohibido: criterios "porque parecen útiles" / sin trazabilidad │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  INSTRUMENTOS                                                    │
│  Asignación documentada criterio → instrumento (matriz PASO 13): │
│  A CONOCIMIENTOS  → evaluación de conocimientos (con reserva)    │
│  B COMPETENCIAS   → (futuro método conductual; hoy auto-reporte) │
│  C EXPERIENCIA    → verificación documental / entrevista (futuro)│
│  D PERSONALIDAD   → EVALHR-PERSONALIDAD-IPIP50-MX v1.0           │
│  E INTEGRIDAD     → legacy orientativo (estatus abierto)         │
│  Cada instrumento con identidad y versión registradas.           │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  EVIDENCIA                                                       │
│  Resultados concretos por persona: instrumento + versión,        │
│  completitud, resultados por constructo (sin mezclas).           │
│  Si falta evidencia → "sin evidencia disponible" (sin sustituir  │
│  constructos). La evidencia NO es un veredicto sobre la persona. │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  INTERPRETACIÓN                                                  │
│  Lectura descriptiva y trazable de la correspondencia entre      │
│  evidencia y criterios, en lenguaje permitido (PASO 14).         │
│  Concepto compuesto futuro: "Nivel de ajuste respecto de los     │
│  criterios definidos para el puesto" (PASO 9 — sin fórmula,      │
│  sin pesos, sin cálculo en A-02.1).                              │
│  Reglas: sin APTO/NO APTO, sin cortes, sin percentiles,          │
│  sin "perfil ideal", sin decisión automática.                    │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  ÁREAS DE REVISIÓN                                               │
│  "Áreas que requieren revisión": criterios con evidencia         │
│  ausente, ambigua o en desacuerdo cualitativo con la hipótesis   │
│  registrada (PASO 10). Cada área trazada a un criterionId.       │
│  → pueden derivar en "Recomendación técnica: Considerar para     │
│  entrevista" (orientación técnica, NO decisión).                 │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  REVISIÓN HUMANA                                                 │
│  RH de la empresa revisa evidencia + áreas + recomendación,      │
│  entrevista, contrasta y documenta su lectura (PASO 11).         │
│  Obligatoria antes de cualquier uso decisorio.                   │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  DECISIÓN DE LA EMPRESA                                          │
│  Entrevistar / avanzar / descartar / contratar: decisión laboral │
│  exclusivamente humana y de la empresa (empleador).              │
│  PROHIBIDO que una recomendación de EvaluHR constituya la        │
│  decisión laboral final.                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Composición de cada eslabón (resumen de responsabilidades)

| Eslabón | Dueño | Artefacto | Documento de diseño |
|---|---|---|---|
| PUESTO | Empresa (con marco EvaluHR) | Registro de puesto vigente | `01-job-definition-model.md` |
| CRITERIOS | Empresa + revisión RH | Criterion Records aprobados | `03-job-criterion-linkage.md` |
| INSTRUMENTOS | Gobernanza EvaluHR | Matriz instrumento↔criterio | PASO 13 + A-01.3 |
| EVIDENCIA | Sistema EvaluHR | Resultados versionados | A-01.2/A-01.3 (existente) |
| INTERPRETACIÓN | Sistema (reglas) + RH (lectura) | Salida orientativa | `08`, `09`, `10` |
| ÁREAS DE REVISIÓN | Sistema (reglas) | Lista de áreas trazadas | `10-interview-areas.md` |
| REVISIÓN HUMANA | RH de la empresa | Registro de revisión | `11-human-review-model.md` |
| DECISIÓN DE LA EMPRESA | Empresa (empleador) | Decisión laboral externa | `11-human-review-model.md` |

---

## 3. Garde-fous transversales de la cadena

1. **Sin adelante sin atrás**: cada eslabón requiere el anterior (puesto
   vigente → criterios aprobados → instrumento asignado → evidencia...).
   Un eslabón débil no se "tapa" con el siguiente (se declara vacío).
2. **No sustitución de constructos**: nunca se sustituye evidencia de una
   categoría por otra (A↔D, B↔D, E↔D).
3. **Lenguaje controlado**: toda transmisión entre eslabones usa el
   directorio de `output-language-matrix.md`.
4. **IA = 0 en criterios e interpretación**: determinismo y auditabilidad
   (excepciones futuras solo por gobernanza expresa).
5. **Append-only + versiones**: nada se reinterpreta retroactivamente.
6. **Responsabilidad humana final**: la empresa decide; EvaluHR acompaña.

---

## 4. Estados límite (qué muestra la cadena cuando algo falta)

| Situación | Comportamiento de la cadena |
|---|---|
| Puesto sin registro vigente | Cadena bloqueada: no hay criterios ni salidas |
| Criterios sin evidencia | Áreas = "sin evidencia disponible"; recomendación solo si hay base suficiente; jamás inferir |
| Categoría D sin criterios aprobados | El IPIP puede administrarse como evidencia, pero no genera áreas de revisión laborales (no hay criterio al que anclarse) |
| Instrumento deprecado (psicológica legacy) | Solo lectura histórica; no entra en cadenas nuevas |
| Evidencia de conocimientos poco confiable (brecha documentada) | No alimenta interpretación de nivel de ajuste hasta corrección autorizada |
| Empresa decide sin revisar | Riesgo documentado (L15); el sistema no ofrece lenguaje ni función decisorios |
