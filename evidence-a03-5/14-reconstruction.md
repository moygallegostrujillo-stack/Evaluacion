# A-03.5 — PASO 18: TEST DE RECONSTRUCCIÓN
## El resultado histórico sigue siendo reconstruible aunque cambie el mundo vivo

## Escenario ejecutado (suite REC-1..REC-4)

Estado inicial: candidato **A** completó su evaluación sobre KA-v1/BP-v1 con
knowledgeScore=100 y su KnowledgeResult VALID almacenado.

| Mutación del mundo vivo | Efecto esperado | Verificación |
|---|---|---|
| Cambiar el TEXTO de un item del banco (cq1) | Estructura cambiada → próxima administración publica blueprint NUEVO (BP-v2) | REC-1 |
| Nuevo candidato D inicia | Nueva generación: assessment NUEVO para D; el assessment de A queda RETIRED (pero intacto) | REC-1 |
| Blueprint histórico BP-v1 | status RETIRED; sus 3 requirements intactos (0 borrados, 0 editados) | REC-2 |
| Re-construir el resultado de A desde SOLO su cadena congelada | `scoreCanonicalAdministration(admA)` sobre administration→assessment RETIRED→items→itemVersions→respuestas | REC-3: **100 = 100 exacto** |
| KnowledgeResult almacenado de A | Sin recálculo ni mutación | REC-4: byte-idéntico |

## Cadena de reconstrucción (independiente del banco vivo)

```
KnowledgeAdministration (A)
  → KnowledgeAssessment KA-v1 (RETIRED, intacto)
    → KnowledgeAssessmentItem (questionSnapshot + correctAnswerSnapshot congelados)
      → KnowledgeItemVersion (edición inmutable, requirement de linaje)
        → Responses (valor + snapshot + sello de administración)
          → knowledgeScore reconstruido = resultado histórico original
```

## Por qué funciona

- Las copias congeladas (snapshot por administración) NO dependen del banco vivo.
- Las ediciones canónicas (KnowledgeItemVersion) son inmutables; los cambios crean ediciones nuevas.
- Los assessments/blueprints supersedados no se borran ni se editan — solo cambian de status.
- El scoring canónico solo lee la cadena congelada — jamás `VacancyQuestion`/`Question` vivos.

## Alcance de la verificación

- Cubre: mutación de texto del banco (estructura) + claves + retiro de
  assessment y blueprint (el escenario completo del PASO 18).
- Las filas pre-A-03.4 (LEGACY) también quedan intocadas (REG-6) — su
  reconstrucción depende de sus propios snapshots históricos de A-03.4.
