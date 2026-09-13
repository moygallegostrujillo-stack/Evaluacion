# A-03.3 — PASO 18 · REGRESIÓN

## Alcance modificado (git)

```
M  prisma/schema.prisma              (+165 — 5 modelos nuevos + columnas nullable knowledge)
M  prisma/seed.ts                    (+36  — cadena de gobernanza, solo knowledge)
M  src/app/api/evaluations/route.ts  (+46/−9 — import snapshot + bloque PASO 9 + itemVersionSnapshot)
M  src/app/api/questions/route.ts    (+243/−… — gobernanza POST + versionado PUT + rol-gates PUT/DELETE)
M  src/lib/generate-templates.ts     (+33  — cadena + fix de clave RC-A03.3-11)
M  src/lib/knowledge/system-bank.ts  (+193 — catálogo de requirements)
?? src/lib/knowledge/governance.ts / governance-service.ts (nuevos, knowledge-only)
?? tests/knowledge-blueprint.test.ts, tests/bun-test.d.ts, scripts/a033-*.ts, evidence-a03-3/
```

**0 archivos de módulos prohibidos tocados** (barrido git por
ipip/integridad/competencias/fit/recomendaciones/overall/contrato/aviso/
privacy/rls/supabase/auth/consent/interview/vacancy/arco/retention ⇒ sin
coincidencias).

## Verificaciones

| Área | Resultado |
|---|---|
| IPIP-50 (instrumento + scoring) | INTACTO — `ipip50-mx.ts` y su ruta de scoring sin diff; suite A-03.2 11/11 |
| Scoring IPIP | idéntico — `scoreIPIP50`/`buildIPIP50Summary` sin cambios |
| Integridad | idéntica — `INTEGRIDAD_QUESTIONS`/scoring sin diff |
| Competencias (psicológica) | idénticas — `PSICOLOGICA_QUESTIONS`/scoring sin diff |
| Recomendaciones | idénticas — lógica de recommendation en `calculateScores` sin cambios semánticos (solo bloque knowledge tocado) |
| overallScore | idéntico — fórmulas de ponderación sin diff (knowledgeScore entra igual que antes: null⇒INSUFFICIENT no suma, VALID suma como siempre) |
| Resultados históricos | idénticos — 3 resultados demo con scores/summary originales; 0 recálculos; UI muestra 75/52 como antes |
| `bun test tests/` | 28/28 PASS (17 nuevos + 11 heredados) |
| `bun run lint` | 0 errores, 0 warnings |
| `bunx tsc --noEmit` | 46 errores = 42 baseline (auth/retention/consent/seed-supabase/page/gen-questions/skills) + 4 preexistentes de scripts de fases anteriores (a01/a032-e2e) ⇒ **0 nuevos por A-03.3** |
| Navegador (E2E visual) | login RH → dashboard (históricos 75/52 visibles) → detalle candidato (Big Five/Psicológica/Conocimientos + resumen intacto) → vista Preguntas (4 puestos × 3 plantillas, CONOCIMIENTOS 10 preguntas) — sin errores de consola |
| Responsividad | móvil 390px sin overflow horizontal; layout sin cambios en esta fase (sin elemento footer en la app — regla no aplicable, preexistente) |
| Base de datos | post-limpieza: 50 items VALIDATED-V1, 5 blueprints, 12 requirements, 5 assessments, 50 versiones, 0 huérfanos, 3 resultados demo intactos |

## Riesgo residual de regresión

- `evaluations/route.ts` y `questions/route.ts` son archivos compartidos: los
  cambios fueron quirúrgicos (bloques A-03.3 acotados + guards); el flujo
  candidato (create-session/start/answer/next-step/complete) quedó probado
  end-to-end en el E2E real, incluyendo PERFIL_COMPLETO con conocimientos
  VALID (misma semántica de A-03.2).
