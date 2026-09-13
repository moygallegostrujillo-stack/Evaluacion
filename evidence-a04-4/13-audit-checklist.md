# A-04.4 — 13 · AUDITORÍA FINAL (PASO 18)

Verificación punto por punto sobre `main@b5dcfb6`, árbol limpio. Fecha: 2026-09-11.

---

- [x] **estado real de IPIP confirmado** — NOT_IMPLEMENTED; nunca existió en ninguna ref alcanzable (`git log -S "IPIP" -- src/` = 0; `-S "IPIP50-MX"` = 0; grep actual = 0; 0 en clean-main/main-clean/origin/main). → `02-ipip-reconciliation.md`
- [x] **estado real Knowledge confirmado** — IMPLEMENTED: 7/7 modelos canónicos en schema (L485–L699); motor único `scoreCanonicalAdministration` para INTERNAL_POSITION y PUBLIC_VACANCY (canonical L773–792); INSUFFICIENT→null (L827–830); capa legada activa y divergente. → `03-knowledge-reconciliation.md`
- [x] **estado real Integrity confirmado** — generada siempre (10 ítems, 4 subcat), puntuada en F1/F2, `integrityScore Float @default(0)` NOT NULL sin estado INSUFFICIENT, pondera overall 0.15–1.00 (video: 0). → `04-integrity-reconciliation.md`
- [x] **todas las fórmulas overall localizadas** — 4 implementaciones (F1 evaluations L145–339; F2 apply-step L43–233; F3 apply-final L547–670; F4 video L83–175) + vector intra-F1 (overall pre-canónico); consumidores catalogados. → `05-overall-reconciliation.md`
- [x] **video auditado** — por qué recalcula (gate `overallScore === 0`), fórmula propia (sin INT, N re-invertido, /5 fijo, renormalización proporcional), instrumentos (BF/PSY/KN), null/0 (`>0`), puede diferir del flujo principal: SÍ, demostrado; además omite integrityScore en el puente. → `07-video-audit.md`
- [x] **public apply auditado** — score por paso (F2) + final (`calculateOverallScore` L1626 tras persist L1619–1622); usa Integrity (SÍ) y Knowledge (canónico + legado); puente con `|| 0`. → `08-public-apply-audit.md`
- [x] **evaluations auditado** — F1 con params muertos, KN legacy estricto, override canónico post-overall, clasificación de completitud (PERFIL_COMPLETO/PARCIAL/PENDIENTE, sin umbrales). → `09-evaluations-audit.md`
- [x] **null→0 auditado** — inventario completo I-1..I-8, K-1..K-7, P-1..P-6, O-1..O-4, F-1..F-3; `Math.max/min` solo clamps; `parseFloat/Number(` ausentes del scoring. → `10-null-zero-audit.md`
- [x] **reportes anteriores reconciliados** — 29 filas: 14 CONFIRMED, 3 CONTRADICTED (A-01.2 IPIP; A-04.1 C4; A-04.2 GATE-10), 11 NOT_VERIFIABLE (expedientes ausentes), 1 fila de hallazgos nuevos. → `06-report-reconciliation.csv`
- [x] **contradicción IPIP explicada** — sin inventar: ninguna ref contiene código IPIP; ninguna rama; ningún commit de adición/eliminación; única fuente contemporánea in-repo dice lo contrario de A-01.2; dossier A-01.2 ausente del disco. → `02-ipip-reconciliation.md §6`
- [x] **contradicción overall documentada** — MÚLTIPLES fórmulas enumeradas sin corregir (4 + vector); divergencias demostradas. → `05-overall-reconciliation.md §3–4`
- [x] **no se modificó código** — cero escrituras en src/, prisma/, scripts/, public/; verificación: `git status` limpio al cierre (ver 00-master §20).
- [x] **no se modificó datos** — ningún comando de DB, migración, db push o escritura de datos; solo lectura (`git log/diff/show/grep`, `sed -n`, `Read`, `Grep`).

**Resultado: 13/13 verificadas.**
