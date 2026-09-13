# EVALUHR — A-06.11 · 09 · HUMAN REVIEW — CADENA DE DECISIÓN (PASO 10)

## 1. Cadena obligatoria

```
EVIDENCIA (InterviewEvidence, inmutable)
    ↓
REVISIÓN HUMANA (InterviewReview: evidenceLevel + rationale + conflicts + limitations)
    ↓
COMPETENCY RESULT (agregado por competencia, aprobado por humano)
    ↓
DECISIÓN DE EMPRESA (RR.HH. del cliente, con múltiples fuentes)
```

> **Nunca**: IA → CompetencyResult. **Nunca**: CompetencyResult → decisión automática.

## 2. Roles y responsabilidades (verificado A-06.3 `16-human-review.md`)

| Rol | Responsabilidad | IA permitida |
|---|---|---|
| Entrevistador | Conduce la entrevista; captura STAR; aplica protocolo UNINVITED_DISCLOSURE | Asistencia: sugerencia de probe aprobado, resumen-borrador |
| Reviewer | Revisa evidencia; asigna nivel con rationale; marca conflictos y limitaciones | Sugerencia de nivel (no decide) |
| Approver | Aprueba el CompetencyResult final | NINGUNA |
| RR.HH. de la empresa | Decide con múltiples fuentes | NINGUNA |

Recomendación de segregación: el reviewer idealmente distinto al entrevistador, para reducir el sesgo "yo lo entrevisté, yo lo evalué".

## 3. Reglas estructurales de la revisión

1. **Append-only**: la evidencia original nunca se borra ni edita; toda corrección = nueva InterviewReview versionada.
2. **Rationale obligatorio**: cada nivel asignado requiere texto que cite la conducta observada y los indicadores mapeados.
3. **Conflicto sin promedio**: CV/referencia vs entrevista → ConflictRecord + PENDING_REVIEW; no se promedia ni "gana" una fuente.
4. **Sin score global**: el CompetencyResult es etiqueta cualitativa por competencia, no agregado numérico (05 §7).
5. **Art. 37 Bis LFPDPPP**: el resultado de la entrevista es evidencia complementaria; nunca la única base de una decisión de selección.

## 4. Documentación mínima exigible (para el dictamen — cuestión 10 de 19)

Cada revisión debe dejar constancia de:
- reviewer (identificación del humano) y reviewDate;
- evidenceState (VALID / LIMITED / INSUFFICIENT / PENDING_REVIEW / INVALID) y evidenceLevel;
- rationale textual;
- conflicts[] y limitations[];
- versiones (InterviewReview-vN) y audit trail inmutable;
- en su caso, flags UNINVITED_DISCLOSURE (sin contenido).

## 5. Decisión final — siempre de la empresa cliente

- La plataforma entrega **insumos**: niveles cualitativos por competencia + contexto (decisionContext).
- La decisión de contratación la toma **RR.HH. de la empresa cliente**, considerando entrevista + otras fuentes del proceso (knowledge, integridad, referencias, juicio del entrevistador).
- El contrato y el aviso deben reflejar explícitamente esta asignación (11 §2, 12, 14 — LEGAL_REVIEW).

## 6. Qué ocurre sin revisión humana

- Sin `reviewedBy` humano, el CompetencyResult no es válido (regla A-06.3 `16-human-review.md` §9).
- Un resultado sin revisión humana no puede presentarse a la empresa.
- Incidente de gobernanza: se registra, se suspende el flujo y se regenera con revisión.
