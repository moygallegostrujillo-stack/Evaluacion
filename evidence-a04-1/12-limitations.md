# A-04.1 — PASO 19: LIMITACIONES Y REGISTRO DE FUENTES

Fase: A-04.1 (solo investigación). Fecha: 2026-09-10 (America/Mexico_City).

---

## 1. LIMITACIONES DE ESTA INVESTIGACIÓN

1. **Acceso técnico a fuentes**: el servicio de lectura de páginas falló (502/504)
   o bloqueó (Cloudflare/WAF) varias páginas oficiales durante la auditoría:
   opm.gov (Access Denied a crawler), hexaco.org (página de licencia de
   investigadores), evaluar.com, y la ficha directa de TestGorilla (404).
   En esos casos se citan por (a) página leída alternativa del mismo dominio o
   (b) snippet de búsqueda con URL, y se marca ◐. Ninguna afirmación crítica
   descansa solo en una fuente no verificable.
2. **Manuales técnicos propietarios**: los proveedores comerciales no publican
   manuales (confiabilidad, normas). Las propiedades científicas de Hogan/Mettl/
   Wonderlic se citan solo a nivel declarativo del proveedor y quedan "media"
   en transparencia.
3. **Cifras meta-analíticas**: .41/.47 (Ones 1993) y d=.90/1.32 (meta faking) se
   tomaron de registros/abstracts accesibles; no se recalcularon. El debate
   Van Iddekinge 2012 vs Ones 2012 se documenta como debate, no como veredicto.
4. **México**: la conclusión NOT ESTABLISHED refleja lo encontrado en fuentes
   públicas indexadas en la fecha de consulta; no excluye la existencia de
   tesis, congresos o documentación comercial no indexada.
5. **Precios**: ninguno fue inventado; todos los comerciales quedaron
   "NO PÚBLICO — REQUIERE COTIZACIÓN". El modelo de suscripción de TestGorilla
   es público pero el monto por test no fue verificado.
6. **Idioma de la evidencia**: la literatura central es en inglés (EE.UU.);
   la extrapolación a español mexicano está prohibida en este expediente.
7. **Fecha de corte**: fuentes consultadas el 2026-09-10; mercados y licencias
   pueden cambiar (ej. Reid Report ya está discontinuado — encontré "discontinued"
   en el distribuidor durante la consulta).

## 2. TIPOLOGÍA DE FUENTES USADAS (regla PASO 19)

- ✔ Fuente primaria leída completa en esta auditoría: ipip.ori.org (portada de
  dominio público + newCitation.htm), hexaco.org (portada), paulspector.com
  (CWB-C, condiciones, traducciones), creativeorgdesign.com (Reid Report).
- ◐ Resultado de búsqueda con URL (snippet): registros académicos
  (experts.umn.edu, PubMed, sciencedirect, SAGE, PMC, homepages.se.edu,
  mikechristian.web.unc.edu), gubernamentales (opm.gov, OTA/princeton.edu),
  oficiales de proveedor (hoganassessments.com, wonderlic.com, mettl.com,
  testgorilla.com, testlify.com, evaluar.com, arhca.com, armstrong.com.mx,
  psigmacorp.com, alva.lat), Buros (buros.org), UNAM/CNEIP/Scielo (México).
- NO usadas como fuente científica: blogs de preparación de exámenes
  (wonderlictestprep.com, jobtestprep.com, integrityfirsttests.com) — solo se
  mencionan como evidencia de existencialidad de producto, nunca de validez.

## 3. REGISTRO Afirmación → Fuente

| Afirmación | Fuente | Estado |
|---|---|---|
| IPIP es dominio público (copiar/traducir/usar) | ipip.ori.org | ✔ |
| IPIP-HEXACO es medida public-domain de los 6 factores | Ashton & Lee 2007, JRP (sciencedirect) | ◐ |
| CWB-C: copyright Spector & Fox 2002; uso gratis condicionado a compartir resultados | paulspector.com (2 páginas) | ✔ |
| CWB-C traducciones ES (AR 2014; 45-ítems 2014) | paulspector.com translations | ✔ |
| Reid Report discontinuado | creativeorgdesign.com | ✔ |
| HEXACO-PI-R es de Lee & Ashton; H es un factor | hexaco.org | ✔ |
| Uso comercial de HEXACO requiere permiso | db.arabpsychology.com (secundaria) | ◐ |
| Overt vs personality-based | opm.gov (snippet) | ◐ |
| Meta 1993: 665 coeficientes; ρ .41/.47 | experts.umn.edu; academia.edu | ◐ |
| Re-examen crítico 2012 + réplica Ones 2012 | PubMed; discovery.fiu.edu | ◐ |
| Faking overt d=0.90, coaching d=1.32 | journals.sagepub.com (meta) | ◐ |
| Lau 2023: validez para workplace deviance | journals.sagepub.com | ◐ |
| SJT: validez y uso para integridad | Christian 2010; Whetzel & McDaniel 2009; de Leng 2018 | ◐ |
| Hogan: 40+ idiomas; 450+ estudios | hoganassessments.com; whitepaper GMAC | ◐ |
| WonScore: 3 secciones ~35 min | wonderlic.com FAQ | ◐ |
| Mettl/Testlify/TestGorilla venden integridad/ética (ES disponible) | mettl.com; testlify.com; testgorilla.com | ◐ |
| Vendedores LatAm/MX sin manuales públicos | arhca.com; armstrong.com.mx; psigmacorp.com; alva.lat; evaluar.com | ◐ |
| HEXACO usado en muestra mexicana (bienestar, no selección) | revistacneipne.org | ◐ |
| Metodología de validación culturalmente relevante en México | Reyes Lagunes & García y Barragán (UNAM) | ◐ |
| EvaluHR demo: módulo INTEGRIDAD con ítems propios, orientativo, consent-gated | src/lib/generate-templates.ts; EvaluationView.tsx (solo lectura) | ✔ |

## 4. DECLARACIÓN DE ALCANCE

Este expediente es investigación documental. No implementa nada, no modifica el
schema, ni IPIP, ni personalidad, ni integridad (módulo), ni competencias, ni
JobFit, ni contrato, ni aviso, ni scoring existente.
