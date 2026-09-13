# EVALUHR — LEGAL MASTER PACKAGE · 12 · AI ANNEX (PASO 13)
# ANEXO DE IA DE EVALUHR — BORRADOR PARA ABOGADO

## 1. Uso real de IA en el sistema (verificado en repo)

| Uso | Ubicación | Detalle |
|---|---|---|
| Generación de preguntas de conocimientos para vacantes | `src/app/api/vacancies/[id]/generate-questions/route.ts` (`callAI()`:191-246) | SDK `z-ai-web-dev-sdk` (con fallback `ZAI_BASE_URL`/`ZAI_API_KEY`); resultado con origen **AI_DRAFT**; **la IA no tiene autoridad de publicación** (publicación = SYSTEM:KNOWLEDGE_FREEZE) |
| Ningún otro uso en producto | — | No hay IA en scoring, evaluación de candidatos ni análisis |

Nota de provenance: `AUDITORIA_EVALUHR.md` (2025-07-25) afirmaba que el SDK no se usaba — **desactualizado**; este documento refleja el código actual.

## 2. Catálogo del anexo

### PERMITIDO (5)
1. **Resumen** de material del proceso (borrador, verificado por humano).
2. **Adaptación de lenguaje** de textos del instrumento.
3. **Sugerencia de probes aprobados** (cuando la entrevista estructurada se active).
4. **Detección de información faltante** en respuestas.
5. **Asistencia documental** (borradores internos).

### PROHIBIDO (8)
1. Decidir contratación.
2. Decidir competencias o niveles.
3. Inferir atributos protegidos.
4. Inferir personalidad.
5. Inferir integridad.
6. Inventar evidencia.
7. Generar veto.
8. Modificar criterios (rúbricas, pesos, aprobaciones).

## 3. Etiquetado obligatorio

- Toda salida IA: **AI_GENERATED** + **HUMAN_REVIEWED**; origen `AI_DRAFT` permanente (nunca pierde la marca).
- Visibilidad: "Contenido generado por IA — requiere revisión humana."
- Prohibido entrenar modelos con datos de candidatos (declararlo en contrato 08 §11 y en subencargados 17).

## 4. Marco normativo (verificado)

- **No existe ley general de IA en México** al 2º semestre de 2026 (comisión especializada del Senado; iniciativas pendientes) — la regulación aplicable corre por la **LFPDPPP 2025**, incl. el derecho de **oposición (art. 26) frente a tratamiento automatizado destinado a evaluar sin intervención humana**.
- Consecuencia contractual: transparencia sobre IA en aviso (06 §2.6) y contrato; supervisión humana documentada (13/14).

## 5. Puntos LEGAL_REVIEW

1. Identidad/condición del proveedor IA como subencargado y su régimen de datos (entrenamiento, retención, país).
2. Redacción del bloque de IA del aviso (llano, no tecnológico).
3. Efectos del art. 26 sobre cualquier función futura de evaluación automatizada.
