# A-04.4 — 02 · RECONCILIACIÓN IPIP (PASO 2 + PASO 12)

Pregunta PASO 2: ¿existe `EVALHR-PERSONALIDAD-IPIP50-MX`? Respuesta corta: **NO — NOT_IMPLEMENTED, y nunca existió en esta historia git**.

---

## 1. Búsqueda en el árbol ACTUAL (fuente de verdad)

| Búsqueda | Alcance | Resultado |
|---|---|---|
| `grep IPIP` (case-insensitive) | `src/`, `prisma/`, `scripts/`, `public/` (ts, tsx, md, prisma, json) | **0 coincidencias** |
| `EVALHR-PERSONALIDAD-IPIP50-MX` | todo el árbol + pickaxe `git log -S "IPIP50-MX"` | **0 en árbol; 0 commits en toda la historia** |
| Módulo / import / scoring / schema / seed / frontend / EvaluationResult / VacancyApplication | ídem | No existe ningún artefacto con ese identificador |

## 2. Forense de historia (PASO 12) — sin supuestos, solo git

Comandos: `git log --all --oneline -i -S "IPIP"`, `git log -S "IPIP" -- src/`, `-- prisma/`, `git grep` por rama.

| Consulta | Resultado |
|---|---|
| `git log --all -S "IPIP"` (toda la historia) | 7 commits — **todos DOCUMENTALES, ninguno de código** |
| `git log --all -S "IPIP" -- src/` | **0 commits** |
| `git log --all -S "IPIP" -- prisma/` | **0 commits** |
| `git log --all -S "IPIP50-MX"` | **0 commits** |
| `git grep -i ipip` en `clean-main`, `main-clean`, `origin/main` (src/prisma/public) | **0 en las tres ramas** |

### Los 7 commits que añadieron el string "IPIP" (todos en documentación)

| Commit | Fecha | Archivos tocados | Naturaleza |
|---|---|---|---|
| `fd38991` | 2026-08-24 | AUDITORIA_EVALUHR.md/.html, public/AUDITORIA pdf, script pdf | Auditoría técnica in-repo — dice que NO se cita IPIP |
| `25300a6` | 2026-08-24 | public/AUDITORIA_EVALUHR.md, api/download | Ídem (actualización) |
| `77e289e` | 2026-09-10 | evidence-a03-4/* + knowledge-versioning.ts, apply/route.ts, schema.prisma | Menciones en evidencia ("IPIP idéntico (REG-1)" = prueba de regresión de que el Big Five demo NO cambió) |
| `0414fba` | 2026-09-10 | evidence-a03-5/* | Ídem ("IPIP (Big Five) scores idénticos…") |
| `1af682b` | 2026-09-11 | evidence-a04-1 + evidence-a03-4/5 | Investigación A-04.1 (IPIP-HEXACO como CANDIDATO futuro) |
| `5633dc6` | 2026-09-11 | evidence-a04-2/* | Decisión A-04.2 (IPIP-HEXACO = base candidata, no implementada) |
| `b5dcfb6` | 2026-09-11 | evidence-a04-3/* | Auditoría A-04.3 ("IPIP no existe en el código") |

## 3. ¿Fue eliminado? ¿Estuvo en otra rama? ¿Otro estado del repo?

| Hipótesis | Veredicto | Evidencia |
|---|---|---|
| IPIP existe hoy | **FALSO** | grep = 0 en src/prisma/scripts/public |
| Fue eliminado posteriormente | **FALSO** | pickaxe `-S "IPIP" -- src/` = 0 commits: NINGÚN commit añadió ni quitó código IPIP; no existe commit de eliminación |
| Estaba en otra rama | **FALSO** | `git grep` en clean-main, main-clean, origin/main = 0 |
| Corresponde a otro estado del repo | **NO DEMOSTRABLE desde este repo** | ninguna huella en ninguna ref alcanzable; la implementación de la que hablara A-01.2 nunca entró a esta historia |

## 4. El único artefacto contemporáneo in-repo dice lo contrario de A-01.2

`AUDITORIA_EVALUHR.md` (fecha del documento 2025-07-25; entró al repo en `fd38991`/`25300a6`, 2026-08-24):

- **L17**: «Las 4 pruebas usan preguntas redactadas por el desarrollador, NO adaptadas de instrumentos validados. El "Big Five" se menciona como nombre descriptivo del modelo, **sin citar IPIP, NEO-PI-R, BFI**, Maslach, IRI, Reid, Hogan ni ningún instrumento normado.»
- **L111**: PSICOMETRICA = «"Big Five" (nombre descriptivo, **sin citar IPIP/NEO/BFI**), 10 (2 por dimensión)… NO IMPLEMENTADO (referencias a validación)».
- **L120**: items de Big Five = «paráfrasis vagas de items IPIP/PSS pero no verificables como adaptaciones formales».

## 5. Qué instrumento de personalidad existe HOY

`src/lib/generate-templates.ts`: `BIG_FIVE_QUESTIONS` (L10) — 10 ítems LIKERT propios del demo (2 por dimensión O/C/E/A/N), generados para cada posición (bucle L231); fallback público `HARDCODED_BIG_FIVE` (`public/apply/route.ts` L239–250). Sin identificador de instrumento, sin versionado de ítems, sin baremos, sin citación. Es el instrumento de personalidad que SÍ participa en overallScore.

## 6. Resolución de la contradicción A-01.2 vs A-04.3 (PASO 12 — respuesta directa)

1. **¿IPIP existe?** NO (PASO 2).
2. **¿Fue eliminado posteriormente?** NO — nunca hubo commit que lo añadiera o quitara (pickaxe por ruta = 0).
3. **¿Estaba en otra rama?** NO — 0 en las tres ramas alternativas.
4. **¿El informe anterior corresponde a otro estado del repo?** POSIBLE PERO NO DEMOSTRABLE: el expediente `evidence-a01-2/` NO está en disco, así que ni siquiera puede verificarse el texto exacto del reclamo. Nada de este historial lo respalda.
5. **¿Qué commit contiene la implementación?** NINGUNO.
6. **¿Qué commit la eliminó?** NINGUNO (no aplica).

**Explicación honesta (sin inventar)**: el string `EVALHR-PERSONALIDAD-IPIP50-MX` no aparece en ninguna ref alcanzable de este repositorio. Las dos únicas explicaciones compatibles con la evidencia son (a) el reclamo de A-01.2 describía un diseño/etiqueta que nunca se materializó en código, o (b) el informe A-01.2 se redactó sobre un estado externo a este historial. En ambos casos, **A-04.3 queda CONFIRMADO y A-01.2 queda CONTRADICTED por el repo, con fuente NOT_VERIFIABLE** (dossier ausente del disco).

## 7. Veredicto de implementación (PASO 2)

| Dimensión | Estado |
|---|---|
| Módulo IPIP-50-MX | **NOT_IMPLEMENTED** |
| Imports / scoring / schema / seed / frontend | NOT_IMPLEMENTED (0 referencias) |
| EvaluationResult / VacancyApplication | No contienen campo ni etiqueta IPIP |
| Instrumento de personalidad REAL que puntúa | Big Five demo propio (10 ítems) |
| Reconciliación | A-04.3 = CONFIRMED · A-01.2 = CONTRADICTED (fuente no disponible) |
