# EVALUHR — A-06.11 · 08 · AI PACKAGE — CATÁLOGO CERRADO (PASO 9)

## 0. Regla general

> Toda salida de IA: `AI_GENERATED` + `HUMAN_REVIEWED`. La IA **asiste**; **no decide**.
> Catálogo **cerrado**: cualquier función fuera de las listas está prohibida hasta que exista dictamen + gobernanza que la habiliten.

## 1. PERMITIDO (5 funciones — catálogo preservado del registro A-06.8, coherente con A-06.3 `14-ai.md`)

| # | Función | Alcance exacto | Restricciones |
|---|---|---|---|
| 1 | **Resumen** | Sintetizar la respuesta del candidato en formato STAR estructurado como borrador de trabajo | AI_DRAFT_ORIGIN; el humano verifica contra la respuesta original; el resumen no sustituye la evidencia; excluye pasajes de revelación involuntaria |
| 2 | **Transcripción si existe fuente consentida** | Convertir a texto una fuente de audio **solo si existe consentimiento específico** válido para ello | En el diseño actual no se capturan grabaciones (06 §2.6); si se habilitara, requiere dictamen + aviso + consentimiento; sin fuente consentida = no aplica |
| 3 | **Sugerir probe aprobado** | Ante respuesta vaga/hipotética, sugerir del banco aprobado (p.ej. UNI-001, UNI-005) | Solo probes del banco; nunca crea probes; el entrevistador decide el uso; uno a la vez |
| 4 | **Detectar información faltante** | Señalar ausencia de Action específica, Result o Situation en la respuesta | Alerta operativa al entrevistador/reviewer; no califica ni puntúa |
| 5 | **Adaptación lingüística** | Ajustar claridad/registro de textos del instrumento (preguntas/probes) por contexto del puesto/sector | AI_DRAFT_ORIGIN; nunca modifica un texto APPROVED; versiones nuevas pasan flujo humano |

## 2. PROHIBIDO (8 funciones — catálogo preservado)

| # | Acción prohibida | Razón |
|---|---|---|
| 1 | **Inferir atributos** (edad, género, origen, salud, situación familiar, etc.) | Atributos protegidos; discriminación; el texto narrado no autoriza inferencia |
| 2 | **Inferir personalidad** | Rasgo latente — frontera prohibida con IPIP/Personality (intocable por regla del proyecto) |
| 3 | **Inferir integridad** | Fronto prohibida con el módulo Integrity (intocable) |
| 4 | **Inventar evidencia** | La evidencia proviene del candidato observado por humano; la IA genera texto, no observación |
| 5 | **Decidir competencia** | La competencia se infiere de conducta evaluada por humano ( cadena EVIDENCIA → REVISIÓN HUMANA) |
| 6 | **Decidir contratación** | Decisión exclusiva de la empresa (LFPDPPP Art. 37 Bis) |
| 7 | **Decidir nivel** (NO_EVIDENCE..STRONG) | El nivel lo asigna humano con rationale; IA solo sugiere |
| 8 | **Producir veto** | No existe "no recomendado por IA"; ninguna salida IA constituye rechazo |

## 3. Modelo de proveniencia (verificado A-06.3 `14-ai.md` §5)

```
origin: AI_DRAFT_ORIGIN | AI_SUGGESTED | RH_MANUAL | SYSTEM
aiModel / aiPromptHash / aiGeneratedAt
humanReviewedBy / humanReviewedAt
humanApprovedBy / humanApprovedAt
```

- `origin` es **permanente**: un artefacto AI_DRAFT_ORIGIN nunca pierde la marca, incluso tras aprobación humana.
- Toda salida visible al entrevistador o RR.HH. lleva la marca: "Contenido generado por IA — requiere revisión humana."

## 4. Regla anti-autoridad-de-facto

Si existe riesgo de que la IA se convierta en autoridad (humano acepta ciegamente la sugerencia), la función se marca **PROHIBIDO**. Mitigaciones exigidas:
1. La asignación de nivel exige `rationale` textual del humano.
2. La IA no escribe en `evidenceLevel`; solo sugiere.
3. Advertencia visible en UI.
4. Auditoría periódica sugerencia-IA vs decisión-humana.

## 5. Mapa de automatización del proceso (HUMAN ONLY — preservado del registro A-06.8)

| Etapa | Ejecución | IA |
|---|---|---|
| Entrevista (conducción, probes) | HUMANO | Solo sugerencia de probe aprobado |
| Captura de evidencia (STAR) | HUMANO | Solo resumen-borrador verificado |
| Revisión (evidenceLevel, rationale) | HUMANO | Solo alerta de información faltante |
| CompetencyResult | HUMANO (approver) | NINGUNA |
| Decisión de empleo | HUMANO (empresa cliente) | NINGUNA |

## 6. Datos y IA

- La IA procesa exclusivamente texto de respuestas y textos del instrumento; no accede a identificativos más allá de lo funcional de la sesión.
- Pasajes de revelación involuntaria: excluidos del procesamiento IA (07 §3).
- Prohibida la retención de respuestas por parte de proveedores de IA para entrenamiento — a declarar en contrato y subencargados (11 §7, LEGAL_REVIEW).

## 7. Conexión con gates

Gobernanza IA pasa INTERVIEW-G8 (governance) y COMP-G6. El dictamen debe confirmar los catálogos cerrados (cuestión 9 de 19-lawyer-questions.md) y el tratamiento de datos por el proveedor de IA.
