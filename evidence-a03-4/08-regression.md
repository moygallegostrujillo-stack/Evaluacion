# A-03.4 — 08 · REGRESIÓN (PASO 14)

**Principio:** solo se modificaron `/api/public/apply`, modelos directamente
necesarios para el congelamiento de knowledge, código de administración/
snapshot/versionado de knowledge, el cliente del flujo público y tests
específicos. Cero cambios en scoring de personalidad, integridad,
competencias, JobFit, nivel de ajuste, recomendaciones, contrato, aviso, RLS,
Supabase, autenticación.

## Verificaciones ejecutadas (tests reales, 34/34)

| # | Área | Verificación | Resultado |
|---|---|---|---|
| REG-1 | IPIP idéntico | Flujo público psicométrico vía `calculateStepScores` (sin tocar): openness=100 con Likert 5; neuroticismo reverse-scored =100 con Likert 1 | ✅ |
| REG-2 | Scoring IPIP / knowledge interno | `/api/evaluations` NO fue modificado (ni una línea); endpoint vivo y auth-gated (401 esperado) | ✅ |
| REG-3 | overallScore intacto | Fórmula/ponderaciones de `calculateOverallScore` sin cambios (0.25/0.25/0.15/0.35 y adaptativas). Corregido SOLO el orden persist→compute dentro de /api/public/apply (ver 04-version-change-tests.md). A: overall = knowledge = 66.67 | ✅ |
| REG-4 | Resultados legacy | Fila COMPLETED pre-A-03.4: knowledgeScore 42.42 / overall 42.42 / sin metadatos — idéntica tras toda la batería | ✅ |
| REG-5 | INSUFFICIENT ≠ 0 | Vacante sin knowledge: NOT_APPLICABLE, `knowledgeScore=null` (nunca 0), completa sin errores | ✅ |
| REG-6 | Integridad | `calculateStepScores` paso 3 y `HARDCODED_INTEGRIDAD` sin cambios (comportamiento de facto preservado) | ✅ (código) |
| REG-7 | Recomendaciones/guidance | `PERFIL_COMPLETO/PERFIL_PARCIAL/PENDIENTE` sin cambios; A → PERFIL_PARCIAL (REG-3) | ✅ |
| REG-8 | JobFit / nivel de ajuste / contrato / aviso / RLS / Supabase / auth | Ningún archivo de esos módulos tocado (ver lista de archivos en 00-master-dossier §archivos) | ✅ (código) |

## Dif de superficie (auditable)

Archivos modificados/creados por A-03.4:

1. `prisma/schema.prisma` — SOLO adiciones: `KnowledgeAssessment`,
   `KnowledgeAssessmentItem`, campos de freeze en `VacancyApplication`,
   campos de snapshot en `VacancyApplicationResponse`, relaciones. Ningún
   campo/rélation preexistente alterado o borrado.
2. `src/lib/knowledge-versioning.ts` (nuevo).
3. `src/app/api/public/apply/route.ts` (flujo público — alcance explícito).
4. `src/app/api/vacancies/[id]/knowledge-versions/route.ts` (nuevo, lectura).
5. `src/components/views/PublicEvaluationView.tsx` (2 mapeos de paso).
6. `scripts/a034-tests.ts` (nuevo, tooling).

**NO modificados** (verificados por revisión): `/api/evaluations/**`,
scoring de IPIP/Big Five/psicológica/integridad, `EvaluationResult`,
`generate-templates.ts`, consentimiento, privacidad, retención, RLS
(`src/lib/rls.ts`), auth (`src/lib/auth.ts`), middleware, Supabase, NextAuth,
recomendaciones, entrevistas.

## Estado de la base

- La base dev estaba VACÍA antes de A-03.4; se reseteó a baseline pristine
  entre ejecuciones; los datos actuales son exclusivamente fixtures de
  verificación de A-03.4 (empresas/vacantes `A034*`), sin mezcla con datos
  previos.
