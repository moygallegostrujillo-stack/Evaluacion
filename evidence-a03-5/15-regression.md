# A-03.5 — PASO 19: REGRESIÓN
## Todo lo prohibido permanece intacto

## Metodología

1. Snapshot previo de todas las filas LEGACY y assessments pre-existentes.
2. Ejecución de la suite completa (57 tests, incluido un recorrido HTTP real
   de una evaluación interna completa y una pública completa).
3. Snapshot posterior + comparación byte a byte.
4. Verificación numérica de las fórmulas contra expectativas calculadas
   desde los datos reales (no hardcodeadas).

## Resultados (57/57 PASS — detalle en a035-test-results.json)

| Módulo | Verificación | Test | Estado |
|---|---|---|---|
| IPIP (Big Five) | Scores idénticos a la fórmula A-03.4 para las respuestas dadas (por categoría, con reverseScored) | REG-1 | ✅ |
| Psicológica | Ídem (incluida la doble inversión histórica de STRESS en el canal público — comportamiento pre-A-03.5 preservado) | REG-2 | ✅ |
| Integridad | Ídem (orientativa, sin cambios de criterio) | REG-3 | ✅ |
| Recomendaciones | guidance PERFIL_PARCIAL/PENDIENTE sin cambios | REG-4 | ✅ |
| JobFit / nivel de ajuste / competencias / entrevista | CERO modificaciones (superficie de archivos auditada — ver abajo) | auditoría | ✅ |
| overallScore existente | Fórmulas intactas en ambos canales (SCORE-4 = 61.17 exacto; REG-5 = 77.19 exacto) | SCORE-4/REG-5 | ✅ |
| Legacy | Filas pre-A-03.4 byte-idénticas antes/después de toda la suite | REG-6 | ✅ |
| Contrato / Aviso de privacidad / RLS / Supabase / Autenticación | CERO modificaciones (superficie) | auditoría | ✅ |

## Auditoría de superficie (archivos tocados vs prohibidos)

**Modificados (todos dentro del alcance KNOWLEDGE/evaluations):**
- `prisma/schema.prisma` — entidades canónicas de knowledge + links.
- `src/lib/knowledge-canonical.ts` (NUEVO) — motor canónico único.
- `src/lib/knowledge-versioning.ts` — deny-list ampliada; wrappers que delegan en el motor canónico (un solo motor de publicación).
- `src/app/api/public/apply/route.ts` — freeze canónico + sello de administración + KnowledgeResult.
- `src/app/api/evaluations/route.ts` — freeze interno + serving congelado + validación de respuestas + scoring canónico + retirada de correctAnswer de serializaciones.
- `src/lib/generate-templates.ts` — persistencia de correctAnswer (fix raíz A-03.1, dentro del alcance).
- `src/app/api/vacancies/[id]/questions/route.ts` + `generate-questions/route.ts` — marcado de origen (RH_MANUAL/AI_DRAFT).

**NO tocados (prohibidos):** IPIP, personalidad, integridad, competencias,
entrevista, JobFit, nivel de ajuste, recomendaciones, contrato, aviso,
`src/lib/rls.ts`, cualquier archivo de Supabase, autenticación
(`src/lib/auth.ts`, middleware), scoring global (fórmulas).

## Nota de compatibilidad interna

La única conducta pre-existente que cambió en el canal interno es la exigida
por la normalización: el paso conocimientos ahora se congela/se puntúa por la
cadena canónica (antes: banco vivo + claves nunca persistidas ⇒ siempre 0).
Ese cambio ES la fase. Los pesos/fórmulas del overall y el resto de secciones
son bit-idénticos.
