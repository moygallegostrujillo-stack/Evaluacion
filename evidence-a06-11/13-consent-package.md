# EVALUHR — A-06.11 · 13 · CONSENT PACKAGE (PASO 14)

## 0. Estatus y provenance

- **BORRADOR DRAFT — NO MODIFICA AVISO REAL NI FLUJOS DE CONSENTIMIENTO EXISTENTES.** Basado en el alcance A-06.9 (NO EJECUTADO) y la referencia interna del proyecto (`Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf`, no modificado).
- Regla del encargo: **no asumir que todo tratamiento requiere la misma forma de consentimiento — eso lo determina el abogado conforme a la legislación vigente.**

## 1. Separación estructural obligatoria

```
[A] INFORMACIÓN PREVIA (capa informativa)
    — aviso de privacidad integral y/o simplificado
    — qué se trata, para qué, con quién, por cuánto tiempo, derechos ARCO
    — entregada ANTES de la entrevista; comprobable (versión + timestamp + aceptación de lectura)

[B] MANIFESTACIÓN DE CONSENTIMIENTO (capa de voluntad)
    — acto expreso o tácito, según determine el dictamen para CADA tratamiento
    — granular por tratamiento (no monolítica)
    — registrada con versión del aviso, fecha, medio y evidencia de la manifestación
```

> [A] siempre existe como obligación informativa. [B] depende de la base habilitante de cada tratamiento — **por dictamen** (cuestión 3 y 4 de 19).

## 2. Tratamientos del proceso y su tratamiento de consentimiento (borrador para dictamen)

| # | Tratamiento | ¿Requiere manifestación de consentimiento? | Forma propuesta (por dictamen) |
|---|---|---|---|
| 1 | Datos identificativos mínimos para operar el proceso (nombre, contacto) | Por dictamen | Granular, en el flujo de invitación |
| 2 | Realización de la entrevista estructurada (respuestas STAR) | Por dictamen | Granular, previa a la entrevista |
| 3 | Elaboración de evidencia y revisión humana (InterviewEvidence/Review/CompetencyResult) | Por dictamen | Generalmente implícita en 2 — a confirmar |
| 4 | Uso de IA asistida sobre las respuestas (resumen borrador, detección de faltantes) | Por dictamen | Explícita y separada — riesgo de percepción de automatización |
| 5 | Grabación de audio/video | **NO APLICA — no se capturan** (06 §2.6). Cualquier habilitación = consentimiento específico + dictamen | — |
| 6 | Transferencias (hosting, IA, mensajería) | Por dictamen (36–37 LFPDPPP) | Cláusula de transferencias separada |
| 7 | Conservación y eliminación | Por dictamen | Informativa + derecho ARCO |

## 3. Borrador de estructura de granularidad (para el abogado)

| Bloque de consentimiento | Contenido mínimo |
|---|---|
| C1 Tratamiento principal del proceso | Finalidad de selección; entrevista; revisión humana; decisión de empresa |
| C2 IA asistida | Catálogo 08 §1 en lenguaje llano; prohibiciones 08 §2 declaradas |
| C3 Transferencias | Subencargados declarados; sin lista = no se transfiere |
| C4 (condicional) Grabaciones | Solo si existiera; consentimiento específico independiente |

## 4. Reglas transversales

1. **No monolítico**: un solo "acepto todo" no satisface la granularidad propuesta; el abogado fija la forma definitiva.
2. **Comprobabilidad**: cada manifestación deja evidencia (version, timestamp, medio, texto exacto mostrado) — insumo de auditoría.
3. **Retractabilidad**: derecho a revocar (por dictamen) y sus efectos operativos (bloqueo/eliminación por instrucción al encargado).
4. **Menores de edad**: el diseño no contempla candidatos menores de edad; si apareciera, **STOP** + dictamen (punto abierto).
5. **Coherencia**: el texto de consentimiento debe usar exactamente las categorías del inventario (06) y el aviso (12) — misma taxonomía.

## 5. Preguntas de dictamen asociadas

Cuestiones 3 y 4 de 19-lawyer-questions.md; filas CON-01..CON-03 de legal-opinion-request.csv.
