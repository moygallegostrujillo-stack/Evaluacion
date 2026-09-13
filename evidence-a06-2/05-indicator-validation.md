# A-06.2 — 05 · Validación de Indicadores (PASO 6)

## 1. Reglas de calidad CI-VAL-1..8

Todo indicador conductual debe cumplir 8 reglas antes de poder pasar a APPROVED. Un indicador que no cumpla una condición = **NO_PUBLICABLE**.

| Regla | Nombre | Criterio | Cómo se verifica |
|---|---|---|---|
| CI-VAL-1 | Observable | La conducta puede ser presenciada o documentada por un tercero | Pregunta: ¿puede un observador presenciar esto? Si NO → falla |
| CI-VAL-2 | Específico | Describe una conducta concreta, no un juicio global o un rasgo | Pregunta: ¿es vago como "es responsable"? Si SÍ → falla |
| CI-VAL-3 | Relacionado con el trabajo | La conducta ocurre en contexto laboral relevante para el puesto | Pregunta: ¿aplica al puesto objetivo? Si NO → falla |
| CI-VAL-4 | Diferenciable | Distinto de otros indicadores de la misma competencia y de indicadores de otras competencias | Pregunta: ¿se solapa >80% con otro? Si SÍ → falla |
| CI-VAL-5 | No redundante | No repite lo que ya cubre otro indicador o instrumento (Knowledge, Personality, Integrity) | Pregunta: ¿lo mide ya Knowledge canónico o PSICOLOGICA? Si SÍ → falla o reclasificar |
| CI-VAL-6 | No discriminatorio | No introduce atributos protegidos (edad, género, religión, estado civil, discapacidad, origen) ni preguntas irrelevantes al puesto | Pregunta: ¿puede sesgar por atributo protegido? Si SÍ → falla + revisión legal |
| CI-VAL-7 | Evaluable mediante evidencia | Puede producirse evidencia conductual verificable (entrevista, observación, documento) | Pregunta: ¿qué evidencia lo demuestra? Si ninguna → falla |
| CI-VAL-8 | Trazable a una fuente | El indicador tiene origen documentado (JOB_ANALYSIS, LITERATURE, EXPERT, AI_DRAFT_ORIGIN) | Pregunta: ¿de dónde viene? Si UNKNOWN → falla |

## 2. Aplicación a ejemplos (EJEMPLO — NO PRODUCTIVO)

### IND-SVC-001-A: "escucha activamente la solicitud del cliente formulando preguntas de clarificación antes de responder"

| Regla | Cumple | Nota |
|---|---|---|
| CI-VAL-1 Observable | ✓ SÍ | Se puede presenciar en entrevista o mesa |
| CI-VAL-2 Específico | ✓ SÍ | Conducta concreta: "formula preguntas de clarificación" |
| CI-VAL-3 Relacionado trabajo | ✓ SÍ | Aplica a MESERO, CAJERO, VENDEDOR |
| CI-VAL-4 Diferenciable | ✓ SÍ | Distinto de IND-SVC-001-B (identifica necesidad) |
| CI-VAL-5 No redundante | ✓ SÍ | No cubierto por Knowledge ni PSICOLOGICA |
| CI-VAL-6 No discriminatorio | ✓ SÍ | Sin atributos protegidos |
| CI-VAL-7 Evaluable | ✓ SÍ | Evidencia: entrevista STAR, observación |
| CI-VAL-8 Trazable | ⚠ PENDIENTE | Requiere source documentado antes de APPROVED |

**Veredicto**: VÁLIDO condicional a CI-VAL-8 (trazabilidad). Status: DRAFT.

### Ejemplo FALLIDO: "es responsable con sus tareas"

| Regla | Cumple | Nota |
|---|---|---|
| CI-VAL-1 Observable | ✗ NO | "ser responsable" no es conducta presenciable |
| CI-VAL-2 Específico | ✗ NO | Juicio global, vago |
| CI-VAL-4 Diferenciable | ✗ NO | Se solapa con COMP-ORG-001 |
| CI-VAL-7 Evaluable | ✗ NO | No produce evidencia conductual directa |

**Veredicto**: **NO_PUBLICABLE**. Reformular como conducta observable.

### Ejemplo FALLIDO: "tiene energía y juventud"

| Regla | Cumple | Nota |
|---|---|---|
| CI-VAL-6 No discriminatorio | ✗ NO | "Juventud" introduce edad (atributo protegido) |

**Veredicto**: **NO_PUBLICABLE + REQUIERE REVISIÓN LEGAL**. Discriminatorio.

## 3. Flujo de validación

```
Indicador DRAFT
    ↓
Revisión contra CI-VAL-1..8 (por reviewer humano)
    ↓
¿Cumple las 8?
    ├── SÍ → status = REVIEW → (tras aprobación) APPROVED
    └── NO → status = DRAFT (rechazado), NO_PUBLICABLE
```

La IA puede sugerir indicadores (AI_DRAFT_ORIGIN), pero la validación contra CI-VAL-1..8 es **humana**. La IA no puede auto-aprobar.

## 4. Matriz de validación (preview del CSV)

El CSV `indicator-quality.csv` (PASO 21) registra el cumplimiento de CI-VAL-1..8 (como 1/0) por indicador, más `source` y `status`. Un indicador con cualquier 0 = status DRAFT (NO_PUBLICABLE).

## 5. Revisión periódica

Los indicadores APPROVED pueden ser re-auditados periódicamente (calibración COMP-G9 pilot). Si en el pilotaje se detecta que un indicador no es observable en la práctica (CI-VAL-1 falla en campo), se desciende a REVIEW o DRAFT.

## 6. Conexión con gates

La validación CI-VAL-1..8 pasa COMP-G3 (behavioral indicators gate). Sin esta validación, ningún indicador puede estar ACTIVE.
