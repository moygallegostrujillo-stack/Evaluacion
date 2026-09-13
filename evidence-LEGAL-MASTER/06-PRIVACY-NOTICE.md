# EVALUHR — LEGAL MASTER PACKAGE · 06 · PRIVACY NOTICE (PASO 9)

## 0. Estatus

**BORRADOR PARA ABOGADO — NO modifica el aviso real.** Existen DOS avisos en el sistema (hallazgo central):

| Aviso | Ubicación | Estado | Observación |
|---|---|---|---|
| **PDF público descargable** | `Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf` (root + `public/`), vigente desde 08-ago-2026, 11 secciones | EXISTE — **DESALINEADO** | Cita marco 2011/LFPDPPP+Reglamento/INAI; **NO menciona IA, ni plazos de conservación, ni revocación** como procedimiento propio; revisión humana solo parcial |
| **Aviso in-app** | `src/lib/privacy-notice.ts` — versión `2026-01-v2`, ~44 secciones (HTML servido por `/api/privacy-notice`, editable por RR.HH.) | EXISTE — más completo | Incluye encargado, sensibles, no-decisión (cita 37 Bis — actualizar), transferencias, revocación, cookies, menores, decisiones automatizadas, glosario |

**Riesgo**: el documento que el candidato descarga y firma es el PDF (el más débil). Alinear ambos es accion LEGAL-001.

## 1. Brechas del PDF frente al paquete (verificadas)

| Requisito (PASO 9) | PDF | In-app | Acción |
|---|---|---|---|
| Identidad + domicilio del responsable | ✔ §1 | ✔ §2-3 | — |
| Finalidades | ✔ §3 (5 finalidades, cita NOM-035/LFT 132) | ✔ §9 | Quitar declaraciones NOM-035 imprecisas |
| Datos tratados | ✔ §2 | ✔ §6 | Añadir edad/canál público/entrevista |
| Datos sensibles | ✔ §2 | ✔ §6.1-6.2 | Confirmar contra nueva ley |
| Medios de obtención | PARCIAL | PARCIAL | Explicitar (directo/no directo) |
| Consentimiento | ✔ §4/§9 (cita Art. 8 2011) | ✔ §15/§23 | Actualizar fundamento |
| Transferencias | ✔ §7 (cita Art. 10 2011) | ✔ §11 | Rehacer con registro de subencargados (17) |
| **IA** | ✘ AUSENTE | PARCIAL | Añadir bloque IA (12) |
| **Revisión humana** | PARCIAL | ✔ §25 (árbol de decisiones) | Unificar |
| **Conservación (plazos)** | ✘ AUSENTE | ✔ §16 | Añadir plazos del dictamen |
| ARCO | ✔ §6 (20 días hábiles) | ✔ §13 | Actualizar autoridad (SABC) |
| Revocación | ✘ AUSENTE | ✔ §14/§22 | Añadir |
| Contacto | ✔ §10 | ✔ | Ídem |
| Cambios al aviso | ✔ §11 | ✔ §22 | Ídem |
| Autoridad de control | ✘ (INAI implícito) | ✔ §21 (cita INAI) | **Sustituir por Secretaría Anticorrupción y Buen Gobierno** |

## 2. BORRADOR — estructura propuesta (para dictamen)

1. Identidad y domicilio del RESPONSABLE (empresa cliente; datos por cliente) y del ENCGARGADO tecnológico (EVALUA HR — Moisés Gallegos Trujillo, RFC GATM7010257U6, Capistrano 364, Col. El Campanario, CP 29057, Tuxtla Gutiérrez, Chiapas).
2. Datos tratados (categorías del inventario 02; incl. edad y su justificación o eliminación).
3. Finalidades — diferenciando las que requieren consentimiento (art. 15 LFPDPPP 2025).
4. Datos sensibles: no se solicitan; las respuestas de evaluación psicológica se tratan como sensibles con consentimiento expreso; protocolo UNINVITED_DISCLOSURE.
5. Medios de obtención: directo (invitación/postulación) y no directo (no aplica hoy).
6. IA: funciones permitidas/prohibidas (12); revisión humana; el sistema no decide contratación.
7. Revisión humana: cadena resultado → revisión RR.HH. → decisión de la empresa.
8. Transferencias: subencargados declarados (17); sin lista confirmada → "sin transferencias adicionales a las declaradas".
9. Conservación: plazos por categoría [PLAZO POR DICTAMEN] (15).
10. ARCO: medio, plazo de respuesta (20 días hábiles — por confirmar número de artículo), autoridad: Secretaría Anticorrupción y Buen Gobierno.
11. Revocación del consentimiento: procedimiento y efectos.
12. Contacto y cambios al aviso (re-consentimiento si material).
13. Cookies: única cookie técnica `evaluhr_token`.
14. Menores: el sistema no está dirigido a menores.

Cada cláusula del borrador queda marcada **LEGAL_REVIEW**. El texto definitivo lo redacta el abogado conforme a la LFPDPPP 2025 vigente.

## 3. Regla de coherencia

Aviso ↔ práctica: todo lo declarado debe coincidir con 02/03/10/12/15/17. Discrepancia aviso↔práctica = hallazgo crítico (ya existe: PDF dice "no transferencias" mientras la infraestructura implica proveedores — ver 17/18).
