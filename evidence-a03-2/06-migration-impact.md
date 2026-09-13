# EVALUHR — A-03.2 · PASO 13/18e
# MIGRACIÓN E IMPACTO EN DATOS EXISTENTES (06-migration-impact)

> Documento de migración. Fecha: 2026-09-10. Fase A-03.2.
> Principio rector: **NO modificar silenciosamente resultados históricos**;
> no inventar claves para resultados históricos; no recalcular sin
> autorización metodológica.

---

## 1. Cambios de schema (aplicados con `bun run db:push` — SQLite local)

| Modelo | Campos nuevos | Default | Impacto en filas existentes |
|---|---|---|---|
| `Question` | `knowledgeStatus String?` | null | null = sin ciclo knowledge (IPIP/psicología/integridad quedan null) |
| | `itemVersion Int` | 1 | existentes = 1 |
| | `correctAnswerSource/correctAnswerRationale/origin/reviewedBy/approvedBy String?` | null | null hasta gobernanza |
| | `previousCorrectAnswer Int?` / `correctAnswerChangedAt DateTime?` | null | null |
| `EvaluationResponse` | `correctAnswerSnapshot Int?` / `scoringOutcome String?` | null | históricos: null (sin snapshot — nacieron antes del congelamiento) |
| `EvaluationResult` | `knowledgeStatus/knowledgeReasonCode/knowledgeScoringVersion String?` | null | históricos: null = legacy |
| `VacancyApplication` | ídem | null | ídem |
| `EvaluationTemplate` | `knowledgeScoringVersion String?` | null | solo CONOCIMIENTOS nuevos lo traen |

Todos los campos son **aditivos y nullables** (o con default neutro): ningún
dato existente cambia de valor. RLS/Supabase NO tocados (las columnas nuevas
son compatibles; su replicación en schema.prod/Supabase queda fuera del
alcance autorizado — documentado como pendiente operacional).

## 2. Clasificación de preguntas existentes (PASO 13)

Script de solo lectura: `scripts/a032-classify-knowledge.ts` (output verificado
el 2026-09-10 tras re-seed):

```
Total KNOWLEDGE/MULTIPLE_CHOICE: 50
  A (clave válida): 50 · B (ausente): 0 · C (dudosa): 0 · D (legacy): 0
EvaluationResult: 3 → knowledgeStatus = null (legacy), scores históricos intactos
VacancyApplication: 0
```

Tratamiento definido por categoría:

| Clase | Tratamiento | Autorización |
|---|---|---|
| **A — clave válida** | Se conservan tal cual; aptas para scoring con el nuevo módulo | — |
| **B — clave ausente** | Se conservan con clave null; bajo el nuevo scoring son NOT_SCORABLE ⇒ administración INSUFFICIENT (visible y honesto). **NO se inventan claves** para hacerlas puntuables | — |
| **C — clave dudosa** | Se conservan; quedan marcadas para revisión humana de gobernanza; el scoring las trata por su clave actual; la corrección pasa por PUT versionado + auditoría | — |
| **D — legacy (auto-reporte KS-3)** | Se conservan como histórico; **NO se administran a candidatos nuevos** (el generador ya no produce este banco — reemplazado por GENERAL con claves) | — |

## 3. Resultados históricos

1. **No se recalculó ninguno** (no existe código de recálculo).
2. Los resultados previos mantienen su `knowledgeScore` original y ahora
   exhiben `knowledgeStatus = null` → la UI los trata como "legacy": se
   muestran igual que antes (verificado en navegador: 55% visible).
3. El único efecto retroactivo posible sería una corrección metodológica
   explícita — **fuera de alcance**, requiere autorización y sería un
   proceso documentado append-only (nunca un UPDATE silencioso).

## 4. Datos sembrados (seed)

- El seed re-creado persiste las 50 claves (5 posiciones × 10) con
  gobernanza completa (ACTIVE/ELABORACION_REVISADA/A-03.2-GOVERNANCE) y
  `knowledgeScoringVersion` en sus 5 plantillas CONOCIMIENTOS.

## 5. Riesgo de migración a producción (Supabase) — documentado, no ejecutado

- Al promover a staging/producción: ejecutar el push equivalente del schema
  prod con las mismas columnas nullables (sin backfill de datos), verificar
  RLS sobre las tablas tocadas (ninguna política cambia), y correr
  `a032-classify-knowledge` para clasificar el stock real antes de decidir
  correcciones de clase C/B.
