# A-03.5 — PASO 16: TEST DE CROSS-FLOW
## Candidato interno y candidato público sobre el mismo conocimiento → mismo instrumento

## Escenario ejecutado (suite XFLOW-1..3)

1. **Candidato interno** inicia evaluación en el Position "Mesero Twin A035"
   → el freeze interno genera los templates (MESERO: 10 ítems con clave) y
   congela la cadena canónica para `jobType=POSITION`.
2. El banco del template (texto/opciones/orden/clave) se **clona byte a byte**
   a la vacante pública "A035 CrossFlow Vacancy" (mismo contenido real).
3. **Candidato público** inicia la postulación pública a esa vacante
   → freeze canónico para `jobType=VACANCY`.

## Verificaciones

| XFLOW | Aserción | Resultado |
|---|---|---|
| XFLOW-1 | **Mismos requisitos**: las estructuras de requirements de ambos blueprints (domain/subdomain/description/importance) son idénticas | ✅ |
| XFLOW-2 | **Mismos itemVersions**: firma `texto\|opciones\|clave` por ítem idéntica en ambas administraciones + mismos números de edición (v1) | ✅ |
| XFLOW-3 | **Mismo scoringVersion**: `PUB-KS-v1` en ambos canales | ✅ |

## Por qué se cumple

- Ambos canales llaman a LAS MISMAS funciones de resolución
  (`resolveCanonicalKnowledgeAssessment` + `freezeAdministrationForCandidate`).
- La forma de la administración es idéntica (`KnowledgeAdministration`); solo
  cambia `channel` y el binding (applicationId vs sessionId).
- El scoring es un único motor (`scoreCanonicalAdministration`) con un único
  `KNOWLEDGE_SCORING_VERSION = 'PUB-KS-v1'`.
- La derivación de requirements es determinista sobre el contenido: mismo
  contenido ⇒ misma estructura ⇒ mismo instrumento.

## Conclusión

**El canal (interno/público) no cambia el instrumento.** Para el mismo
conocimiento, candidato interno y candidato público reciben los mismos
requisitos, las mismas ediciones de ítems y el mismo criterio de scoring.
