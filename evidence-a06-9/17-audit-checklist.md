# EVALUHR — A-06.9 — 17 · Checklist de Verificación (PASO 26)

> Fecha: 2026-09-13. Verificación de los 23 ítems del encargo A-06.9.

| # | Ítem | Estado | Evidencia |
|---|---|---|---|
| 1 | Contrato revisado | ✔ BORRADOR PREPARADO | `02-contract-draft.md` — 30 cláusulas + 10 anexos integrados; pendiente abogado |
| 2 | Aviso revisado | ✔ BORRADOR PREPARADO | `03-privacy-notice-draft.md` — específico para entrevista; aviso vigente 2026-01-v2 NO modificado |
| 3 | Consentimiento preparado | ✔ BORRADOR PREPARADO | `05-consent-draft.md` — documento independiente, lenguaje claro, manifestación de voluntad |
| 4 | Información previa preparada | ✔ BORRADOR PREPARADO | `04-candidate-information.md` — legible, distinto del contrato |
| 5 | IA documentada | ✔ | `06-ai-annex.md` — 5 permitidas condicionadas / 9 prohibiciones / controles |
| 6 | Revisión humana documentada | ✔ | `07-human-review-annex.md` — EVIDENCIA→REVISIÓN HUMANA→RESULTADO; quién revisa y cómo se documenta |
| 7 | Datos sensibles | ✔ | `08-sensitive-data-protocol.md` — 5 obligaciones + invalidación + 0 excepciones activas |
| 8 | No discriminación | ✔ | `13-nondiscrimination.md` — cláusula de uso + 13 atributos prohibidos + excepciones SOLO LEGAL_REVIEW |
| 9 | Conservación | ✔ | `09-retention-clause.md` — cláusula flexible [PLAZO POR DICTAMEN]; 2 años = recomendación, no ley; V1 sin grabación |
| 10 | Transferencias | ✔ | `10-subprocessors.md` — proveedores SUJETOS A CONFIGURACIÓN; ninguno confirmado por nombre |
| 11 | ARCO | ✔ | `11-arco.md` — quién recibe/verifica/atiende/ejecuta/conserva; sin cambios de código |
| 12 | Seguridad | ✔ | `12-security.md` — descripción jurídica SIN ISO/SOC/PCI/certificaciones |
| 13 | Responsabilidades | ✔ | `15-responsibility-model.md` + `client-evalua-legal-responsibilities.csv` (32 filas) |
| 14 | Limitaciones | ✔ | `14-limitations.md` — 7 limitaciones expresas (no contratación, no predicción, no diagnóstico, no APTO/NO APTO automático) |
| 15 | Puntos abiertos legales | ✔ | `16-legal-open-items.md` — lista cerrada de 14 asuntos SOLO-ABOGADO |
| 16 | Artículos verificados | ✔ CON MARCADORES | `01-legal-basis.md` + `legal-requirements.csv`: artículos de la nueva ley marcados [LEGAL_REVIEW]; ninguno inventado; citas históricas de la ley 2010 solo como referencia analítica |
| 17 | Fuentes oficiales | ✔ | diputados.gob.mx, gob.mx, DOF/SABG (A-06.8 §02) + `search-aviso-articulos.json` (A-06.9) |
| 18 | No se inventaron obligaciones | ✔ | "2 años" presentado como recomendación; certificaciones/registros/autorizaciones NO afirmadas |
| 19 | No se declaró cumplimiento absoluto | ✔ | Todos los documentos marcados "SUJETO A REVISIÓN LEGAL" |
| 20 | No se modificó código | ✔ | git status: solo evidence-a06-9/ + worklog; src/ y prisma/ intactos (incluye `privacy-notice.ts` y `consent-version.ts`) |
| 21 | No se modificó schema | ✔ | prisma/schema.prisma sin cambios |
| 22 | No se activó entrevista | ✔ | Sin rutas/API nuevas; entrevista sigue NO ACTIVADA |
| 23 | No se publicaron preguntas | ✔ | Banco sigue DRAFT/PILOTO; 0 ACTIVE; nada publicado |

## Verificación técnica

| Verificación | Resultado |
|---|---|
| Archivos del paquete | 18 .md + 5 .csv + 1 search json = 24 archivos en evidence-a06-9/ |
| CSV parseados | contract-change-matrix (29×7), privacy-notice-change-matrix (16×6), candidate-information-matrix (13×8), legal-requirements (20×8), client-evalua-legal-responsibilities (32×7) — 0 filas malas |
| Banner BORRADOR | Presente al inicio de cada documento (PASO 25) |
| git status | Solo `evidence-a06-9/` y `worklog.md` |

## Conclusión

23/23 ítems verificados. El paquete está **listo para entrega al abogado**. Ningún documento está
aprobado; ninguno puede firmarse, publicarse o activarse hasta cerrar los 14 open items (`16`).
