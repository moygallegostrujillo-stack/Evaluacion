# A-04.2 — PASO 16: CRITERIOS DE ACTIVACIÓN (GATES) DE INTEGRIDAD

Fase: A-04.2 (solo análisis y documentación — NO IMPLEMENTAR, cumplido).
Fecha: 2026-09-11 (America/Mexico_City).

Propósito: definir las condiciones OBJETIVAS y verificables para que la
evaluación de Integridad pase por los tres estados:

```
NO IMPLEMENTADA (estado actual metodológico)
      │  requiere: GATE-1, GATE-2, GATE-3, GATE-7, GATE-9
      ▼
APROBADA PARA PILOTO (indicador experimental, no decisorio)
      │  requiere: GATE-1..GATE-10 completos
      ▼
APROBADA PARA USO PRODUCTIVO (con decisión explícita sobre JobFit)
```

Regla general: cada GATE exige evidencia documentada en el expediente. Un gate
sin evidencia = NO PASADO. La aprobación de cada gate es una decisión HUMANA
registrada; la IA no tiene autoridad de aprobación (coherente con la gobernanza
existente: publicación solo SYSTEM, IA = AI_DRAFT).

NOTA ESTADO ACTUAL (transparencia): en el código demo existe una sección
INTEGRIDAD (10 ítems) que ya aporta peso a `overallScore` (0.15/0.40). Esta fase
NO modifica código. El estado metodológico oficial queda definido por este
documento como NO IMPLEMENTADA (no hay instrumento aprobado, versionado ni
validado); la contradicción del demo queda registrada como DEUDA TÉCNICA /
DECISIÓN PENDIENTE para una fase de implementación futura.

---

## GATE-1 — CONSTRUCTO

**Pregunta:** ¿Qué mide exactamente "Integridad" en EvaluHR?

**Condición objetiva:** existir una DECLARACIÓN DE CONSTRUCTO por escrito,
aprobada por el responsable metodológico, que especifique:
- Definición operacional adoptada (p. ej., integridad laboral operacionalizada
  vía Honesty-Humility + comportamiento normativo) — heredable de
  evidence-a04-1/01-integrity-construct.md.
- Lo que NO es: NO es personalidad general (Big Five), NO es honestidad genérica
  declarada, NO es detección de fraude, NO es diagnóstico moral.
- Frontera con constructos ya medidos (Conciencia, Responsabilidad) y por qué
  la distinción justifica una medición adicional.
- Comportamientos criterio objetivo que pretende anticipar (tipo CWB).

**Evidencia requerida:** documento de constructo versionado + acta de aprobación.
**Fallo típico:** usar "integridad" como etiqueta sin definición operacional.

## GATE-2 — INSTRUMENTO

**Pregunta:** ¿Con qué instrumento se medirá y con qué expediente?

**Condición objetiva:** instrumento seleccionado con:
- Ficha técnica documentada (origen, número de ítems, formato, tiempo).
- Si es de terceros: derechos verificados (ver GATE-3) y citación técnica.
- Si es desarrollo propio: separación explícita DESARROLLO TÉCNICO vs
  VALIDACIÓN PSICOMÉTRICA (regla A-04.1: crear preguntas ≠ validar instrumento),
  con plan de validación aprobado ANTES de escribir ítems definitivos.
- Contenido bajo versionado (patrón Knowledge: Assessment/ItemVersion con hash;
  publicación solo SYSTEM; IA solo AI_DRAFT).

**Evidencia requerida:** ficha de instrumento + plan de validación + esquema de
versionado. Rechazo automático si los derechos son UNKNOWN.

## GATE-3 — DERECHOS

**Pregunta:** ¿Existe ruta jurídicamente clara de uso comercial?

**Condición objetiva (sin excepciones):**
- Clasificación de derechos verificada con fuente primaria:
  PUBLIC DOMAIN / OPEN LICENSE / COMMERCIAL LICENSE. Si queda UNKNOWN → NO PASA.
- Para IPIP/IPIP-HEXACO: declaración de dominio público del repositorio
  (verificada en A-04.1, 06-rights.md) + confirmación legal de uso en SaaS
  comercial en México → **REQUIERE REVISIÓN LEGAL** (condición C1 de A-04.1).
- Para CWB-C: solo como criterio de investigación con condiciones del autor
  (compartir resultados); NUNCA como producto comercial sin autorización.
- Para comerciales: contrato/licencia firmado con alcance de uso SaaS, marcas,
  reproducción, scoring y modificación definidos.
- Prohibido asumir dominio público por disponibilidad en Internet (anti-patrón
  documentado en A-04.1).

**Evidencia requerida:** memorandum de derechos + dictamen legal firmado.
**Marca permanente en este gate:** REQUIERE REVISIÓN LEGAL.

## GATE-4 — EVIDENCIA PSICOMÉTRICA

**Pregunta:** ¿El instrumento funciona psicométricamente?

**Condición objetiva (piloto, criterios internos definidos a priori en el
protocolo — no se declaran estándares científicos universales):**
- Análisis de ítems (discriminación, distribución de respuestas, ambigüedad).
- Consistencia interna reportada (p. ej., alfa) con umbral interno mínimo
  propuesto: α ≥ .70 para el piloto (criterio interno, no estándar universal).
- Estructura explorada y coherente con el constructo declarado (GATE-1).
- Control de deseabilidad social documentado (indicador o diseño de ítems).
- Scoring versionado, transparente y determinista; semántica INSUFFICIENT
  (datos insuficientes ≠ 0; patrón Knowledge aprobado en A-03.5).
- Ninguna puntuación se interpreta sin el manual del expediente.

**Evidencia requerida:** reporte psicométrico del piloto + scoring versionado.
**Fallo típico:** declarar "validado" con un solo análisis descriptivo.

## GATE-5 — CONTEXTO LABORAL

**Pregunta:** ¿Sirve para selección laboral y aporta algo nuevo?

**Condición objetiva:**
- Evidencia de uso/aplicabilidad en contexto de selección (de la literatura de
  la clase o del propio piloto con candidatos reales).
- Criterio laboral definido y medido (CWB-C con permiso del autor y
  compartición de resultados, o criterio interno equivalente documentado).
- **Validez incremental demostrada frente a lo ya medido** (Big Five /
  Conciencia / entrevista): el piloto debe mostrar que el indicador aporta
  información no redundante o se descarta (respuesta al PASO 2 de A-04.2).

**Evidencia requerida:** análisis de validez incremental + definición de criterio.
**Fallo típico:** medir dos veces lo mismo (Conciencia) con dos etiquetas.

## GATE-6 — CONTEXTO MÉXICO

**Pregunta:** ¿Existe evidencia para población mexicana?

**Condición objetiva:**
- Estado de partida documentado: **NOT ESTABLISHED** (A-04.1, 05). Este gate NO
  se puede aprobar citando equivalencias culturales inventadas ni Marketing de
  proveedores.
- Adaptación al español mexicano con jueces nativos y trazabilidad de ítems
  fuente (condición C2 de A-04.1).
- Piloto en población laboral mexicana con reporte de resultados.
- Normas: solo interpretación relativa interna; prohibido publicar percentiles
  "mexicanos" sin normas construidas y documentadas.

**Evidencia requerida:** protocolo y reporte de adaptación + piloto MX.
**Fallo típico:** traducir y declarar "validado en México".

## GATE-7 — REVISIÓN LEGAL

**Pregunta:** ¿El uso es jurídicamente defendible?

**Condición objetiva (dictamen firmado; evaluación conceptual previa en
evidence-a04-1/08-risk-analysis.md, Parte B):**
- Proporcionalidad y necesidad evaluadas POR PUESTO (no global): justificar
  qué puestos requieren integridad y por qué no basta una medida menos invasiva.
- Finalidad específica informada; no reutilización de respuestas para otros fines.
- Exclusión de ítems con datos delicados (drogas, violencia, creencias) —
  condición C5 de A-04.1.
- Transparencia al candidato (qué se mide, cómo se usa, quién ve resultados).
- Consentimiento y aviso actualizados para esta finalidad concreta.
- Decisión humana obligatoria: prohibido el veto/rechazo automático derivado de
  la puntuación.

**Evidencia requerida:** dictamen legal + aviso/consentimiento actualizados.
**Marca permanente:** REQUIERE REVISIÓN LEGAL.

## GATE-8 — VALIDACIÓN INTERNA

**Pregunta:** ¿Los resultados del piloto se sostienen?

**Condición objetiva:**
- Replicación o confirmación sobre segunda muestra o periodo adicional, con
  métricas estables respecto al protocolo de GATE-4.
- Análisis de casos límite: comportamiento del indicador ante faking sospechoso
  (escalas/indicadores), respuestas incompletas (INSUFFICIENT) y errores.
- Suite de regresión aprobada y ejecutada: consent-gate (KNOWLEDGE_ONLY no ve la
  sección; OPTION_B_VIOLATION se rechaza en servidor), purga al retiro de
  consentimiento, scoring determinista, versionado, ausencia de cualquier ruta
  de rechazo automático.
- Revisión humana documentada en el flujo (no hay decisión sin persona).

**Evidencia requerida:** reporte de replicación + registro de ejecución de
pruebas de regresión.

## GATE-9 — GOBERNANZA

**Pregunta:** ¿Quién aprueba, con qué expediente y con qué controles?

**Condición objetiva:**
- Autoridad de aprobación designada (rol humano: responsable metodológico +
  product owner; asesoría legal para GATE-3/GATE-7). La IA NO aprueba.
- Expediente metodológico completo y versionado: declaración de constructo,
  ficha de instrumento, memorandum de derechos, dictamen legal, reportes
  psicométricos, manual de interpretación (qué mide, cómo se califica, qué NO
  significa — condición C7 de A-04.1), historial de versiones.
- Publicación solo SYSTEM (patrón Knowledge: "AI code has no write path").
- Auditoría: cada publicación/cambio de scoring queda en AuditLog.
- Cadencia de revalidación definida (cuándo se re-revisa el instrumento).

**Evidencia requerida:** expediente completo + registro de aprobación firmado.

## GATE-10 — IMPACTO EN JOBFIT

**Pregunta:** ¿Qué relación tendrá el indicador con JobFit/overallScore?

**Condición objetiva (regla obligatoria de A-04.2, PASO 13):**
- Mientras Integridad no esté metodológicamente aprobada, versionada, validada
  y legalmente revisada (GATE-1..9), **NO entra en JobFit/overallScore**.
- Cuando entre: decisión metodológica EXPLÍCITA y registrada, con pesos
  publicados, indicador separado visible, revisión humana obligatoria y
  prohibición de rechazo automático. No se diseñan fórmulas en esta fase.
- Corrección de la deuda del demo (pesos 0.15/0.40 actuales) SOLO en una fase
  de implementación futura que cumpla estos gates; en esta fase NO se modificó
  código (verificado).

**Evidencia requerida:** decisión metodológica documentada con justificación de
pesos/notas y análisis de impacto en candidatos.

---

## MATRIZ DE TRANSICIÓN (resumen)

| Estado destino | Gates requeridos | Autoridad |
|---|---|---|
| NO IMPLEMENTADA → APROBADA PARA PILOTO | GATE-1, GATE-2, GATE-3, GATE-7, GATE-9 | Responsable metodológico + Legal |
| APROBADA PARA PILOTO → APROBADA PARA USO PRODUCTIVO | GATE-1..GATE-10 completos | Comité (metodología + producto + legal) |
| Cualquier gate NO PASADO | permanencia en estado anterior | — |

Si GATE-3 o GATE-7 no pueden aprobarse nunca (p. ej., derechos UNKNOWN o
dictamen negativo), el estado final es NO IMPLEMENTAR / mantener solo lo
orientativo del demo con su documentación de limitaciones (OPTION C como
fallback, coherente con A-04.2 PASO 10).
