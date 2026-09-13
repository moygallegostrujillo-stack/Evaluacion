# A-04.5 — 12 · REGRESIÓN (PASO 19)

## 1. Verificaciones ejecutadas

| Verificación | Resultado |
|---|---|
| `bun run lint` | ✅ CLEAN (0 errors, 0 warnings) |
| Dev server (port 3000) | ✅ RUNNING (GET / 200) |
| `bun scripts/a045-tests.ts` | ✅ 45/45 passed |
| Agent Browser (home page) | ✅ Renders, no errors |
| API routes compile on-demand | ✅ No 500s |

## 2. Rutas verificadas (compilación on-demand)

| Ruta | HTTP | Significado |
|---|---|---|
| `GET /` | 200 | Home page renderiza |
| `GET /api/health` | 401 | Requiere auth (esperado) — compila |
| `GET /api/public/vacancy` | 400 | Requiere vacancySlug (esperado) — compila |
| `GET /api/dashboard` | 401 | Requiere auth (esperado) — compila |

Ninguna ruta modificada retornó 500 (error de compilación/runtime).
El dev server compila los módulos `src/lib/overall-score.ts` y las rutas
refactorizadas sin errores.

## 3. Componentes no rotos (regresión)

| Componente | Estado | Nota |
|---|---|---|
| login | ✅ intacto | No tocado |
| candidates | ✅ intacto | Lee overallScore (number) — sin cambios de tipo |
| users | ✅ intacto | No tocado |
| consent | ✅ intacto | Reset de sensibles preservado (overall STALE legítimo) |
| positions | ✅ intacto | No tocado |
| arco | ✅ intacto | No tocado |
| invite | ✅ intacto | No tocado |
| questions | ✅ intacto | No tocado |
| vacancies | ✅ intacto | No tocado |
| interviews | ✅ intacto | No tocado |
| evaluations | ✅ refactorizado | overall delega al canónico; bug pre-canónico corregido |
| public apply | ✅ refactorizado | F2+F3 delegan al canónico |
| public video | ✅ refactorizado | F4 eliminado; delega al canónico |
| results | ✅ intacto | Lee overallScore (number) — sin cambios |
| dashboard | ✅ intacto | Lee recommendation (string) — sin cambios |

## 4. Schema

- `prisma/schema.prisma`: 4 columnas nullable añadidas a EvaluationResult +
  VacancyApplication (`formulaVersion`, `includedSections`, `excludedSections`,
  `excludedReasons`).
- `prisma/schema.prod.prisma`: sincronizado con las mismas columnas.
- `db:push`: exitoso (SQLite sincronizado, Prisma Client regenerado).
- Cero migraciones de datos; cero recálculos.

## 5. Dev log

```
GET / 200 in 30ms (compile: 3ms, render: 27ms)  ← estable
```

Único mensaje: `[SECURITY WARNING] JWT_SECRET not set — using insecure dev fallback.`
(pre-existente, no relacionado con A-04.5).

## 6. Conclusión regresión

**SIN ERRORES NUEVOS.** Las modificaciones se limitan al camino de overallScore
(motor canónico + 3 rutas + schema nullable). Ningún componente fuera del
alcance fue afectado. Los consumidores de solo-lectura (results, dashboard,
candidates, admin-db) siguen operando con `overallScore` como número.
