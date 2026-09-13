# EVALUHR — A-06.9 — 01 · Base Legal para Redacción (PASO 3)

> **Referencia de redacción — NO es dictamen.** Utiliza las conclusiones de A-06.8
> (`02-current-law.md`, verificación con fuentes oficiales del 2026-09-12/13) y las re-verifica
> solo en lo necesario para redactar. No copia grandes bloques de legislación. Evidencia de
> reverificación: `search-aviso-articulos.json`.

## 1. Norma marco

| Norma | Estado verificado | Uso en el paquete |
|---|---|---|
| Constitución Política — Art 1, 16 | Vigente (estable) | Fundamento de no discriminación y protección de datos (cláusulas 13 del contrato y aviso §1) |
| **Nueva LFPDPPP** (DOF 20-03-2025; vigor 21-03-2025; última reforma DOF 14-11-2025) | **VIGENTE — abroga la ley de 2010** | Marco de todos los borradores. **Numeración de artículos pendiente de confirmación textual → [LEGAL_REVIEW]** en cada cita |
| Reglamento de la Nueva LFPDPPP | Existe (diputados.gob.mx) | [LEGAL_REVIEW] — revisión textual por abogado |
| LFT — Art 3 (no discriminación), Arts 132-135 | Vigente | Cláusula de no discriminación; decisión laboral del patrón |
| LFPEPD (reforma DOF 14-11-2025) | Vigente | Requisito esencial del puesto / no discriminación |
| CONAPRED / NMX-R-025-SCFI-2015 | Vigente; NMX voluntaria | Criterio de referencia; **no afirmar certificación** |
| Autoridad garante: **SABG** (INAI extinto, mayo 2025) | Verificado (gob.mx 09-05-2025) | Cláusulas de quejas/notificaciones — destino institucional actualizado |

## 2. Conceptos a redactar — fundamento y regla de cita

| Concepto (PASO 3) | Fundamento (principio verificado) | Regla de redacción en el paquete |
|---|---|---|
| Finalidad | Tratamiento con finalidad específica, explícita y legítima informada al titular | Declarar finalidad concreta de entrevista estructurada para selección; nada secundario sin aviso |
| Tratamiento | Operaciones sobre datos conforme a ley y consentimiento | Definir qué hace EvaluHR (encargado) por instrucción del cliente (responsable) |
| Datos personales | Cualquier información concerniente a persona física identificada/identificable | Listar categorías mínimas del proceso de entrevista (aviso §4) |
| Datos sensibles | Categorías que afectan esfera íntima; tratamiento con base reforzada | **No solicitar; no registrar revelaciones involuntarias** (protocolo 08) |
| Consentimiento | Manifestación de voluntad libre, específica, informada e inequívoca | Documento 05; forma y fundamento exactos = [LEGAL_REVIEW] |
| Derechos ARCO | Acceso, rectificación, cancelación, oposición + revocación | Documento 11; canal ya existente en plataforma (sin cambio de código) |
| Transferencias | Comunicación de datos a terceros/países con garantías y conocimiento del titular | Documento 10 — proveedores SUJETOS A CONFIGURACIÓN, sin afirmar proveedores concretos |
| Encargados/subencargados | Encargado trata por instrucciones del responsable; cadena documentada | Cláusula 18 del contrato; anexo 10 |
| Decisiones automatizadas | No usar como única base decisiones con efectos; revisión humana | Cláusula 12 del contrato + anexo 06/07 — posición de diseño: NO existe decisión automatizada |
| Seguridad | Medidas técnicas y organizativas proporcionadas | Documento 12 — descripción SIN certificaciones |
| Conservación | Minimización: conservar solo lo necesario; cancelación ARCO | Documento 09 — cláusula flexible con [PLAZO POR DICTAMEN]; **2 años = RECOMMENDED, no ley** |
| No discriminación | LFT Art 3 + LFPEPD + Constitución Art 1 | Documento 13 — cláusula de uso con lista de atributos prohibidos |

## 3. Regla de citas en borradores

1. Cuando se cite la ley de datos: "conforme a la Ley Federal de Protección de Datos Personales
   en Posesión de los Particulares (texto vigente)" + marcador **[artículo exacto: LEGAL_REVIEW]**.
2. Las citas históricas de la ley 2010 (Art 6, 7, 16, 22, 37; Reglamento Art 74) solo se usan como
   **referencia analítica** en comentarios, nunca como texto normativo del contrato.
3. Ninguna cita de: certificaciones, registros, autorizaciones o "cumplimiento absoluto" (PASO 2).
4. Donde la redacción depende de interpretación: **"SUJETO A REVISIÓN LEGAL"**.

## 4. Reverificación puntual realizada (2026-09-13)

- Búsqueda `search-aviso-articulos.json`: los requisitos de aviso de privacidad se confirman
  como obligación vigente bajo el nuevo marco (secureprivacy.ai 2025; basham.com.mx — entrada en
  vigor 21-03-2025), pero **ninguna fuente secundaria confirma numeración de artículos** → se
  mantienen marcadores [LEGAL_REVIEW]. Esto NO bloquea la redacción: bloquea el cierre de G7.
