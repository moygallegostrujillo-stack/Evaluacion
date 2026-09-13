# LAW-SOURCES REPORT — VERIFICACIÓN DEL MARCO LEGAL (12–13/sep/2026)
# Method: web search (z-ai web_search) + full-text page read (page_reader de iapp.org). Sin acceso directo a gob.mx desde el sandbox (curl timeout) — el cotejo final contra el texto oficial íntegro queda como PASO PENDIENTE para el abogado (artículos POR CONFIRMAR en doc 01).

## Hallazgos verificados (resumen)

| # | Hecho | Fuente(s) principal(es) | Clase |
|---|---|---|---|
| 1 | Nueva LFPDPPP publicada DOF 20-mar-2025, en vigor 21-mar-2025, abroga la LFPDPPP 2011; texto vigente con última reforma DOF 14-nov-2025 | diputados.gob.mx/LeyesBiblio; basham.com.mx; littler.com; ey.com; gtlaw.com | Oficial + secundarias |
| 2 | El decreto del 20-mar-2025 expide además Ley General de Transparencia y Ley General de Protección de Datos Personales | dof.gob.mx (Decreto 20-mar-2025) | Oficial |
| 3 | Extinción del INAI: reforma constitucional en vigor 20-dic-2024; acuerdo de extinción 01-abr-2025 | directoriolegislativo.org; sidof.segob.gob.mx | Oficial + referencia |
| 4 | Autoridad: Secretaría Anticorrupción y Buen Gobierno; unidades 120 días (19-jun-2025); amparo contra resoluciones | iapp.org (con cita DOF 21-mar-2025 nota 5752650); idconline.mx | Oficial-indirecto + secundaria |
| 5 | Arts. verificados del texto nuevo: 2 (definiciones), 9 (excepciones consentimiento), 11 (nueva finalidad→nuevo consentimiento), 15 (requisitos aviso; transferencias ya no requisito indispensable), 26 (oposición: evaluación automatizada sin intervención humana), 39 (atribuciones autoridad) | iapp.org (lectura full-text del análisis del texto) | Secundaria especializada |
| 6 | Datos sensibles: consentimiento expreso por escrito (principio) | garrigues.com; gtlaw.com; sep.gob.mx (ley análoga) | Secundarias |
| 7 | ARCO 20 días hábiles persiste | resguard-solutions.com (feb-2026); growlysales.com (jul-2026) | Secundarias 2026 |
| 8 | Violaciones de seguridad: obligación de notificar; multas hasta 320,000 UMA | nordsterntech.com (sep-2026) | Secundaria 2026 |
| 9 | Obligación de plazos de conservación | cosio.mx (guía 2026) | Secundaria 2026 |
| 10 | Reglamento nuevo PENDIENTE (a jul-2026); Reglamento 2011 abrogado | sharkit.mx (jul-2026); basham.com.mx | Secundarias |
| 11 | Nueva LFT publicada DOF 15-ene-2026; reforma de jornada 40h en vigor 1-may-2026 (gradual a 2030); reforma plataformas vigor 22-jun-2025 | congresomich.site (15-ene-2026); mexico.justia.com; deloitte.com (Flash 09/2026); jadelrio.com; latam.university | Oficial-indirecto + secundarias |
| 12 | LFPED vigente (reforma 14-nov-2025); CONAPRED opera | sep.gob.mx; legislacion.scjn.gob.mx; conapred.gob.mx; gob.mx | Oficial |
| 13 | Sin ley general de IA al 2S-2026; iniciativas en Senado | La Cadena Política 23-jul-2026 (vía yahoo); lexology dic-2025; observatorio-ia-mexico.com | Prensa/especializadas |
| 14 | NOM-035-STPS-2018 vigente; evalúa entorno con sus propios cuestionarios (no sustituye pruebas de candidatos) | gob.mx/stps; dof.gob.mx nota 5541828; psicotest.mx | Oficial |
| 15 | CPF arts. 210–211 (revelación de secretos) vigentes | diputados.gob.mx; oas.org; mexico.justia.com | Oficial |

## Archivos de evidencia incluidos

- `s1-lgpd.json` … `s16-cp.json` — resultados de búsqueda (URL, fecha, snippet).
- `p1-iapp.json` — lectura full-text del análisis IAPP de la nueva ley (fuente de los números de artículo de §5).
- `p2-cosio.json` — guía 2026 (conservación).

## Pendiente de cotejo oficial (por el abogado)

1. Texto íntegro vigente de la LFPDPPP 2025 (diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf) para confirmar los artículos marcados POR CONFIRMAR (sensibles/ARCO/violaciones/multas).
2. Texto íntegro de la nueva LFT (DOF 15-ene-2026) para cotejar el articulado de no discriminación y prohibiciones al patrón.
3. Región real y términos de Supabase/Vercel/proveedor IA (DOCUMENTACIÓN PENDIENTE).
