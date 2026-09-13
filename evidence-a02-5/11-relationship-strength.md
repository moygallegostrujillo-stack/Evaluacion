# EVALUHR — A-02.5 · PASO 11
# MATRIZ DE FUERZA DE RELACIÓN (instrumento → criterio)

> Documento de diseño metodológico. NO implementa nada. NO define umbrales
> numéricos. Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA
> METODOLÓGICA.
> Base: PASO 4 (mapeo por instrumento); PASO 5 (rasgo→criterio);
> PASO 10 (métodos); A-02.5 matriz `instrument-criterion-strength.csv`.

---

## 1. La escala

La **fuerza de relación** describe qué tan bien documentada está la relación
entre un instrumento (con su versión) y un criterio aprobado. Es una escala
**de evidencia metodológica**, no de personas ni de puntajes.

| Nivel | Definición (condiciones documentales) | Qué permite |
|---|---|---|
| **STRONG** | Relación sostenida por: evidencia de criterio en contexto comparable (PASO 10) **+** análisis de contenido o funcionalidad **+** juicio de expertos panelizado **+** aprobación de gobernanza vigente | Uso del instrumento como antecedente documentado del criterio, con las salidas permitidas de su categoría; aun así **sin** puntos de corte ni decisión laboral |
| **MODERATE** | Relación sostenida por: análisis de contenido/funcionalidad completo **+** juicio de expertos panelizado **+** gobernanza (sin evidencia de criterio propia aún) | Igual que STRONG, con nota de ausencia de evidencia de criterio |
| **LIMITED** | Documentación parcial: p. ej., solo análisis de puesto, o método existente con brecha conocida (K-INS-1) | Orientar el análisis; no sostiene lecturas de cumplimiento por sí sola |
| **HYPOTHESIS** | Relación plausible documentada como hipótesis (H-1..H-4 del PASO 5) sin cadena de validación | Solo hipótesis explícita y áreas de entrevista; nunca cumplimiento |
| **NOT_SUPPORTED** | Sin relación documentada, o relación expresamente prohibida (transversalidad de categorías) | Nada; intentar el vínculo está prohibido |

Reglas de escala:

1. **La fuerza se asigna por par instrumento-version ↔ criterio-version**;
   un cambio de versión obliga a re-evaluar (PASO 18).
2. **Asciende solo con evidencia nueva documentada** (acto de gobernanza);
   **desciende** si su evidencia se invalida (herencia de invalidación
   A-02.2 PASO 16).
3. **La escala nunca opera como multiplicador de puntajes** ni produce
   "porcentaje de validez": es cualitativa y estructural.
4. **STRONG no equivale a "aprobado para decidir"**: ninguna fuerza habilita
   APTO/NO APTO, cortes ni automatizaciones (PASO 12).

---

## 2. Inventario actual (estado hoy — honestidad documental)

| Par instrumento → categoría de criterio | Fuerza hoy | Base |
|---|---|---|
| IPIP-50-MX v1.0 → D | **HYPOTHESIS** (máximo) | H-1..H-4 posibles; ES-1..ES-5 inexistentes |
| IPIP-50-MX v1.0 → A/B/C/E | **NOT_SUPPORTED** | Transversalidad prohibida |
| Prueba de conocimientos → A | **LIMITED** | Ruta content-valid correcta; brecha correctAnswer (K-INS-1) + sin blueprint formal |
| Competencias (método futuro) → B | **NOT_SUPPORTED** | NO_METHOD; cadena PASO 7 sin cumplir |
| Integridad (sin instrumento válido) → E | **NOT_SUPPORTED** | I-INT-1; checklist I-VAL sin cumplir |
| Entrevista (sin guía estructurada) → C | **LIMITED** | Verificación depende de regla versionada (C-EXP) que hoy no existe |
| Entrevista (sin guía estructurada) → B | **HYPOTHESIS** | Indicadores conductuales futuros (PASO 7) |
| Entrevista → D/E | **NOT_SUPPORTED** | Protocolo de conflictos / prohibición de proxy |

**Conclusión del inventario: hoy no existe ningún par con fuerza
MODERATE o STRONG.** La ruta para construirlos está definida (PASOS 6, 7, 10)
y exige gobernanza (PASO 15).

---

## 3. Cómo ascendería cada par (ruta documental, no operativa)

| Par | Para MODERATE necesita | Para STRONG necesita |
|---|---|---|
| IPIP → D | ES-1..ES-4 (análisis funcional + panel + evidencia externa + revisión de proporcionalidad) | ES-5 + evidencia de criterio en contexto comparable |
| Conocimientos → A | K-VAL-1..7 completos (incluye corrección correctAnswer, fuera de A-02.5) | + evidencia de criterio futura |
| Competencias → B | P-COMP-1..6 (PASO 7) con rúbricas versionadas | + evidencia de criterio futura |
| Integridad → E | I-VAL-1..8 (PASO 8) + justificación de proporcionalidad (PASO 14) | + evidencia de criterio futura |
| Entrevista → C/B | Guía estructurada versionada + reglas de verificación (C-EXP) | + evidencia de criterio futura |

---

## 4. Asignación y registro

- La fuerza se declara en el registro del criterio/instrumento y se publica
  en `instrument-criterion-strength.csv` (PASO 17), con `evidenceBasis`
  citando los documentos del expediente.
- El cambio de fuerza es **acto de gobernanza versionado** (PASO 15/18);
  queda trazado con fecha, revisor y base.
- La fuerza vigente se muestra en la documentación metodológica del criterio
  (no en la salida al candidato: es información interna de gobernanza —
  la explicabilidad al candidato se rige por A-02.4 PASO 17).

---

## 5. Regla de IA (mandato del encargo)

> **NO utilizar IA para asignar la fuerza sin evidencia.**

- **AI-X17 (nuevo)**: la IA no asigna, sugiere ni modifica la fuerza de
  relación instrumento→criterio. La fuerza nace de documentos de validación
  revisados por humanos.
- La IA puede **transcribir o reformular** la fuerza ya aprobada (AI-3b)
  con marcado, sin conclusiones nuevas.
- La IA tampoco infiere fuerza "por analogía" entre puestos o empresas
  ("en otro cliente era MODERATE" está prohibido — la fuerza no se hereda,
  PASO 10 §4).
