# A-04.1 — PASOS 14-17: OPCIÓN SIN INSTRUMENTO, DESARROLLO PROPIO, RECOMENDACIÓN Y ESTADO

Fase: A-04.1 (solo investigación). Fecha: 2026-09-10 (America/Mexico_City).

---

## PASO 14 — OPCIÓN "NO IMPLEMENTAR" (evaluada contra comprar/licenciar/desarrollar)

### Beneficio de NO implementar
- Cero costo de licenciamiento; cero riesgo legal adicional; cero carga de
  validación; el demo ya tiene una sección INTEGRIDAD "orientativa" que cumple
  función informativa sin pretensión psicométrica.

### Riesgo de NO implementar
- Se pierde la oportunidad de apoyar decisiones en evidencia (meta-análisis: la
  clase de instrumentos sí predice CWB, ρ ≈ .47, con debate en desempeño).
- El ítem propio actual mide "honestidad" declarada sin control de deseabilidad
  ni validez — riesgo de sobreinterpretación igual o mayor que un instrumento
  formal, pero sin trazabilidad.
- Competitivo: plataformas ES ya comercializan pruebas de integridad.

### Costo / Complejidad de NO implementar
- Costo 0; complejidad 0. Impacto en JobFit: nulo (sin cambios).

### Comparación (síntesis)
| Criterio | NO implementar | Comprar/licenciar (B/C) | Desarrollar (base pública) |
|---|---|---|---|
| Beneficio | Bajo | Alto si evidencia aplicada | Alto si validación bien hecha |
| Riesgo | Bajo técnico / medio informativo | Medio (dependencia, opacidad) | Medio (ejecución de validación) |
| Costo | 0 | Licencias recurrentes NO PÚBLICAS | Validación interna (tiempo equipo) |
| Complejidad | 0 | Media (contratos, integración) | Alta (método psicométrico) |
| Impacto en JobFit | Ninguno | Requiere decisión metodológica explícita | Indicador separado (sin peso oculto) |

Conclusión PASO 14: "NO IMPLEMENTAR" es defendible como estado actual, pero
deja sin resolver la falta de fundamento del módulo existente. La alternativa
intermedia (base de dominio público + validación gradual) domina a las otras dos
en relación beneficio/riesgo para un producto en demo.

## PASO 15 — DESARROLLO PROPIO: DESARROLLO TÉCNICO ≠ VALIDACIÓN PSICOMÉTRICA

- **DESARROLLO TÉCNICO** (alcanzable): redactar viñetas SJT propias, adaptar
  ítems IPIP al español mexicano, construir scoring transparente, versionar el
  contenido (patrón Assessment/ItemVersion de A-03.5), controlar deseabilidad.
- **VALIDACIÓN PSICOMÉTRICA** (requisito independiente): análisis de ítems,
  confiabilidad (α), estructura factorial, validez de constructo (vs Conciencia),
  validez criterio (criterio tipo CWB-C con permiso, o indicadores internos),
  normas locales. Requiere muestras, tiempo y método (tradición Reyes Lagunes
  disponible en México).
- **Regla innegociable: crear preguntas ≠ validar un instrumento.** EvaluHR puede
  "desarrollar" en semanas, pero no puede **declarar validado** nada sin el
  proceso de validación. Mientras no haya validación, todo resultado se rotula
  "indicador de evidencia, no prueba validada".

## PASO 16 — RECOMENDACIÓN

### OPTION A (RECOMENDADA) — "Indicador de Integridad Laboral" fase piloto, base de dominio público
- Constructo: integridad laboral operacionalizada vía Honesty-Humility
  (representación IPIP-HEXACO, PUBLIC DOMAIN, Ashton & Lee 2007) + viñetas SJT
  éticas propias en DRAFT con revisión humana.
- Uso: **indicador de evidencia separado** — replicando el patrón de separación
  de A-03.5 (knowledgeScore vs overallScore): el indicador de integridad NO
  entra automáticamente al overallScore ni a JobFit; cualquier incorporación
  futura es una decisión metodológica explícita posterior.
- Justificación: evidencia (04), derechos claros (06), español adaptable (01),
  costo marginal bajo, riesgo controlable con revisión humana (08), y habilita
  validación mexicana propia (05).

### OPTION B — Licenciar comercial premium (Hogan) — FUTURO
- Justificada solo si el piloto demuestra valor y hay presupuesto; hoy sin costo
  público ni evidencia mexicana pública.

### OPTION C — Licenciar comercial digital (Mettl/TestGorilla/Testlify) — FUTURO
- Rápido pero opaco (sin manuales públicos) y sin evidencia MX.

### OPTION D — NO IMPLEMENTAR — EVALUADA
- Estado defendible; no resuelve la deuda de fundamento del módulo actual.

Selección: **OPTION A**.

## PASO 17 — ESTADO: GO-WITH-CONDITIONS

El estado GO significa: "avanzar a una fase de diseño/validación del indicador".
**NO significa** implementación productiva ni cambio de código en esta fase.

Condiciones exactas para pasar a implementación (todas obligatorias):
- C1. Derechos: auditoría legal de la declaración de dominio público IPIP y del
  uso en SaaS comercial en México — REQUIERE REVISIÓN LEGAL.
- C2. Adaptación: traducción/adaptación al español mexicano con jueces nativos y
  trazabilidad de ítems fuente.
- C3. Piloto de validación: muestra real, análisis de ítems, confiabilidad (α),
  evidencia de estructura; criterio de validación definido (CWB-C con permiso o
  criterio interno equivalente).
- C4. Uso: indicador separado, sin peso automático en overallScore/JobFit; sin
  vetos automáticos; revisión humana obligatoria.
- C5. Privacidad: consentimiento y aviso actualizados para este fin específico;
  exclusión de ítems de datos delicados (drogas/violencia/creencias) — REQUIERE
  REVISIÓN LEGAL.
- C6. Gobernanza IA: IA solo borradores (09-ai-boundaries.md); publicación
  versionada con aprobación humana.
- C7. Documentación: manual interno (qué mide, cómo se califica, qué NO significa)
  antes de exponer resultados a clientes.

Si alguna condición no puede cumplirse → el estado cae a NO-GO y se mantiene
OPTION D (no implementar / mantener solo lo orientativo actual).
