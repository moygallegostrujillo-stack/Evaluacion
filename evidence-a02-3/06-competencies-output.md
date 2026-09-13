# EVALUHR — A-02.3 · PASO 6
# SALIDA DE COMPETENCIAS — ESTADO ACTUAL Y DISEÑO CONCEPTUAL FUTURO

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.1 PASO 6 (competencias CANDIDATAS, sin método conductual), A-02.2
> PASO 6 (cadena competencia→indicador→evidencia→fuente→revisión; NO_METHOD).

---

## 1. Estado actual obligatorio

> **Competencias hoy: `NO_METHOD` → salida `INSUFFICIENT`.**

- No existe método conductual aprobado ni versionado → **no hay lectura
  posible** de ningún criterio de categoría B.
- Salida: "Información insuficiente para evaluar este criterio." con causa
  "no existe un método aprobado para evaluar esta competencia"
  (`reasonCode=NO_METHOD`, regla R2 de A-02.2).
- El auto-reporte de competencias (legacy) **no cuenta** como competencia
  medida: como máximo es contexto (LIMITED), nunca lectura.
- Prohibido fabricar puntajes de competencia a partir de: Big Five,
  auto-reporte, entrevista sin método aprobado, o IA.

---

## 2. Diseño conceptual FUTURO (solo cuando exista un método aprobado)

> Este diseño es **condicional y aspiracional**: se activa únicamente si
> gobernanza aprueba un método conductual versionado para una competencia
> aprobada del puesto. Nada de esto existe hoy ni se implementa en A-02.3.

### 2.1 Cadena conceptual completa

```
Competencia aprobada (A-02.1, deja de ser CANDIDATA)
        ↓
Método conductual aprobado y versionado (p. ej., entrevista por
eventos conductuales / simulación / ejercicio observado — método, no test)
        ↓
Indicadores conductuales definidos por competencia
(cada indicador = comportamiento observable, sin escala aprobada aún)
        ↓
Registro de evidencia por indicador (EvidenceRecord, tipo C):
  - qué indicador se observó / no se observó
  - hecho observado descripto (conducta, situación, resultado)
  - evaluador humano identificado + fecha + contexto
        ↓
CriterionResult (PASO 3): lectura DESCRIPTIVA por indicador
  - result = DESCRIPTIVE_READING solo si el método se aplicó íntegro
  - reviewRequired = true (siempre)
  - quality = MEDIUM–HIGH según integridad de aplicación del método
        ↓
Revisión humana (PASO 13): confirma, amplía, contextualiza, contradice o
descarta la lectura — con registro
```

### 2.2 Reglas conceptuales del diseño futuro

1. **Sin score compuesto por defecto**: si algún diseño futuro quisiera
   agregar indicadores en un valor, requeriría su propia fase de diseño
   aprobada (pesos/puntos de corte seguirían prohibidos sin ese proceso). En
   este modelo, la salida de competencia es **descriptiva por indicador**.
2. **Integridad de aplicación**: método aplicado parcialmente → indicadores
   no observados quedan INSUFFICIENT (`PARTIAL_RESPONSE`), sin promediar con
   lo observado.
3. **Trazabilidad total**: cada indicador citado traza a competencia → método
   (versión) → evidencia (evidenceId) → evaluador → fecha.
4. **IA excluida**: la IA no observa, no evalúa, no registra competencias
   (herencia AI-X1/X8; A-02.1 PASO 6).
5. **Separación de constructos**: el futuro método de competencia no reutiliza
   el IPIP ni ningún test como sustituto de la observación conductual.

### 2.3 Puertas de activación (checklist antes de producir lecturas)

| # | Puerta |
|---|---|
| 1 | Competencia ya no CANDIDATA: aprobada con metodología conductual documentada |
| 2 | Método versionado con procedimiento de observación y registro |
| 3 | Indicadores conductuales aprobados por competencia |
| 4 | Evaluadores formados e identificados (no IA) |
| 5 | Formato de registro indicador-por-indicador (hechos, no impresiones) |
| 6 | Revisión humana obligatoria configurada |

Mientras falte cualquiera: **INSUFFICIENT (NO_METHOD)** — sin excepciones.
