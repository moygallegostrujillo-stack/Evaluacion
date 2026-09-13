#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the 12 legal matrices CSVs for evidence-LEGAL-MASTER (PASO 29-30)."""
import csv, os

OUT = "/home/z/my-project/evidence-LEGAL-MASTER"
os.makedirs(OUT, exist_ok=True)

def w(name, header, rows):
    with open(os.path.join(OUT, name), "w", newline="", encoding="utf-8") as f:
        c = csv.writer(f)
        c.writerow(header)
        c.writerows(rows)
    print(f"{name}: {len(rows)} filas")

# 1. legal-data-inventory.csv
w("legal-data-inventory.csv",
  ["dato","origen","finalidad","baseJuridicaRequerida","sensible","necesario","acceso","conservacion","transferencia","riesgo","accionLegal"],
  [
    ["Nombre candidato","RR.HH. / postulacion publica","Identificar proceso","Aviso + base por dictamen","NO","SI","RR.HH., SUPER_ADMIN","730 dias (PII purge)","Supabase/Vercel","Bajo","Dictamen plazos"],
    ["Email","Invitacion / auto-login placeholder","Cuenta + contacto","Aviso + base por dictamen","NO","SI","RR.HH.","730 dias","Supabase/Vercel","Bajo","Dictamen plazos"],
    ["Telefono","RR.HH. (requerido)","Invitacion WhatsApp manual + dedupe","Aviso + base por dictamen","NO","SI","RR.HH.","730 dias","WhatsApp manual (fuera del sistema)","Medio","Transparencia en aviso; dictamen"],
    ["Edad (candidateAge)","Postulacion publica","Por definir","Por dictamen - atributo protegido","NO (pero protegido)","DUDOSO","RR.HH.","730 dias","Supabase","MEDIO-ALTO","Justificar o eliminar (PQ-22)"],
    ["Respuestas Big Five (10 items propios, legacy)","Candidato","Perfil de personalidad (excluido de overall)","Consentimiento expreso (sensibles)","SI","DUDOSO (declinado V1)","RR.HH.","90 dias inactividad","Supabase","Medio","Dictamen: retirar o licenciar (OLI-007)"],
    ["Respuestas psicologicas (14 categorias)","Candidato","Competencias psicologicas","Consentimiento expreso","SI","SI","RR.HH.","90 dias inactividad","Supabase","Medio","Tratamiento reforzado (10)"],
    ["Respuestas conocimientos + snapshots","Candidato","Aptitud tecnica","Aviso + consentimiento","NO","SI","RR.HH. (key solo admin)","730 dias / congelado","Supabase","Bajo-Medio","Dictamen exposicion admin (OLI-019)"],
    ["Respuestas integridad + integrityScore","Candidato","Indicador orientativo (aislado)","Consentimiento expreso","SI","DUDOSO","RR.HH.","90 dias inactividad","Supabase","Medio","Dictamen continuar/retirar (OLI-008)"],
    ["videoType/videoUrl (marca de paso)","Sistema","Marcar paso de video","Aviso","NO (sin grabacion)","CONDICIONADO","RR.HH.","730 dias","Video via WhatsApp fuera del sistema","Medio","Transparencia (OLI-023)"],
    ["Scores Big Five / Psicologica","Motor","Insumo informativo","Aviso + consentimiento","SI (derivados)","SI","RR.HH., candidato propio","730 dias","Supabase","Medio","Dictamen"],
    ["knowledgeScore","Motor (INSUFFICIENT != 0)","Aptitud","Aviso + consentimiento","NO","SI","RR.HH., candidato","730 dias","Supabase","Bajo","Dictamen"],
    ["overallScore (OVERALL-v1.1)","Motor (excluye Big Five e Integridad)","Orientacion de completitud","Aviso + consentimiento","Parcial","SI","RR.HH., candidato","730 dias","Supabase","Bajo","Lenguaje + art. 26 (14/25)"],
    ["recommendation (PERFIL_COMPLETO/PARCIAL/PENDIENTE)","Motor","Orientacion informativa NO decision","Aviso + consentimiento","NO","SI","RR.HH., candidato","730 dias","Supabase","Bajo","Lenguaje contractual/aviso"],
    ["InterviewSchedule (fecha/lugar/estado/notes)","RR.HH.","Agendar entrevista","Aviso","NO","SI","RR.HH.","Sin purga especifica","Supabase","Bajo","Incluir en matriz retencion"],
    ["Consentimiento (User.consent* + ConsentLog con noticeHash)","Candidato","Evidencia de consentimiento","Obligacion legal","NO","SI","Compliance/abogado","Sin purga (evidencia)","Supabase","Bajo","Dictamen plazos; gap canal publico (OLI-004)"],
    ["ArcoRequest (tipo/estados/deadline)","Titular / RR.HH.","Gestionar derechos","Obligacion legal","NO","SI","RR.HH., SUPER_ADMIN","Sin purga","Supabase","Bajo","Dictamen plazos evidencia"],
    ["AuditLog (11 acciones, IP, UA)","Sistema","Seguridad/gobernanza","Interes legitimo/obligacion","NO","SI","SUPER_ADMIN","90 dias","Supabase","Bajo","Dictamen plazo vs evidencia"],
    ["Cookie evaluhr_token (httpOnly, 8h)","Sistema","Sesion","Necesidad tecnica","NO","SI","Titular de sesion","8 horas","No","Bajo","Aviso de cookies in-app ya existe"],
    ["Metadatos de purga (piiPurgeAt/sensitivePurgeAt/retainedUntil)","Sistema","Minimizacion","Obligacion","NO","SI","Sistema","-","No","Bajo","Activar cron (OLI-011)"],
    ["Prompts/preguntas IA (VacancyQuestion AI_DRAFT)","IA (generacion de preguntas)","Asistencia RR.HH.","Aviso (uso IA) + contrato","NO (sin PII detectado)","SI","RR.HH.","Sin purga especifica","Proveedor IA","Medio","Anexo IA + subencargados (12/17)"],
  ])

# 2. legal-requirements.csv
w("legal-requirements.csv",
  ["id","norma","articulo","requisito","aplicabilidad","fuente","fechaConsulta","estado","accion"],
  [
    ["LR-01","CPEUM","Art. 1 (parr. 3)","No discriminacion","Toda seleccion","diputados.gob.mx (oficial)","2026-09-12/13","VIGENTE (parr. por confirmar)","Politica no discriminacion (11)"],
    ["LR-02","CPEUM","Art. 6","Proteccion de datos reglamentada","Todo tratamiento","diputados.gob.mx (oficial)","2026-09-12/13","VIGENTE","Dictamen"],
    ["LR-03","CPEUM","Art. 16","Vida privada","Todo tratamiento","diputados.gob.mx (oficial)","2026-09-12/13","VIGENTE","Dictamen"],
    ["LR-04","CPEUM","Art. 28","Transparencia/datos; extincion INAI (20-dic-2024)","Autoridad","DOF (oficial)","2026-09-12/13","VIGENTE","Mapear autoridad SABC"],
    ["LR-05","LFPDPPP 2025","Art. 2","Definiciones (datos personales/sensibles)","Todo","diputados.gob.mx LeyesBiblio (oficial); iapp.org","2026-09-12/13","VIGENTE (DOF 20-mar-2025; reforma 14-nov-2025)","Dictamen clasificacion"],
    ["LR-06","LFPDPPP 2025","Art. 9","Excepciones al consentimiento","Tratamientos sin consentimiento","iapp.org (analisis texto)","2026-09-12/13","VIGENTE","Dictamen bases"],
    ["LR-07","LFPDPPP 2025","Art. 11","Nueva finalidad = nuevo consentimiento","Cambios de finalidad","iapp.org","2026-09-12/13","VIGENTE","Matriz finalidades (03)"],
    ["LR-08","LFPDPPP 2025","Art. 15","Requisitos del aviso (datos+finalidades diferenciando consentimiento)","Aviso","iapp.org","2026-09-12/13","VIGENTE","Aviso consolidado (06)"],
    ["LR-09","LFPDPPP 2025","Art. 26","Oposicion: evaluacion automatizada sin intervencion humana","Scoring/presentacion","iapp.org","2026-09-12/13","VIGENTE","Salvaguardas (14/25)"],
    ["LR-10","LFPDPPP 2025","Art. 39","Atribuciones de autoridad","Fiscalizacion","iapp.org","2026-09-12/13","VIGENTE","Cooperacion"],
    ["LR-11","LFPDPPP 2025","Datos sensibles","Tratamiento reforzado; consentimiento expreso","Psicologica/Big Five/Integridad","garrigues/gtlaw (secundarias)","2026-09-12/13","VIGENTE (num. art. POR CONFIRMAR)","Matriz sensibles (10)"],
    ["LR-12","LFPDPPP 2025","ARCO","Derechos + 20 dias habiles","Titulares","resguard/growly (secundarias 2026)","2026-09-12/13","VIGENTE (num. art. POR CONFIRMAR)","Flujo ARCO (09)"],
    ["LR-13","LFPDPPP 2025","Violaciones de seguridad","Notificacion","Incidentes","nordsterntech (secundaria)","2026-09-12/13","VIGENTE (num. art. POR CONFIRMAR)","Protocolo (19)"],
    ["LR-14","LFPDPPP 2025","Multas","Hasta 320,000 UMA","Riesgo economico","nordsterntech (secundaria)","2026-09-12/13","VIGENTE (POR CONFIRMAR)","Gestion de riesgo"],
    ["LR-15","LFPDPPP 2025","Conservacion","Definir plazos; supresion al cumplir finalidad","Retencion","cosio.mx (secundaria 2026)","2026-09-12/13","VIGENTE","Matriz retencion (15)"],
    ["LR-16","LFT (nueva, DOF 15-ene-2026)","No discriminacion en el trabajo / prohibiciones al patron","Seleccion no discriminatoria","Seleccion","congresomich.site (ley publicada 15-ene-2026); sidof (reforma 1-may-2026)","2026-09-12/13","VIGENTE (articulado POR COTEJAR)","Dictamen articulado"],
    ["LR-17","LFPED","Reforma 14-nov-2025","Practicas discriminatorias (catalogo ampliado)","Empleo","sep.gob.mx; legislacion.scjn.gob.mx","2026-09-12/13","VIGENTE","Politica (11)"],
    ["LR-18","NOM-035-STPS-2018","-","Evalua entorno laboral con cuestionarios propios; no sustituye pruebas","Declaraciones del producto","gob.mx/stps (oficial); DOF 23-oct-2018","2026-09-12/13","VIGENTE","Corregir redaccion aviso (LEGAL-001)"],
    ["LR-19","Codigo Penal Federal","Arts. 210-211","Revelacion de secretos / acceso ilicito","Confidencialidad","diputados.gob.mx; oas.org","2026-09-12/13","VIGENTE","Clausula confidencialidad (08)"],
    ["LR-20","IA (Mexico)","-","Sin ley general de IA al 2S-2026; regulacion sectorial + LFPDPPP","Uso de IA","yahoo/La Cadena 23-jul-2026; lexology","2026-09-12/13","NO HAY LEY GENERAL","Anexo IA (12)"],
    ["LR-21","Reglamento LFPDPPP","-","Reglamento 2011 abrogado; nuevo PENDIENTE","Cumplimiento operativo","sharkit.mx jul-2026 (secundaria)","2026-09-12/13","PENDIENTE","Monitorear (LEGAL-025)"],
  ])

# 3. legal-question-matrix.csv
w("legal-question-matrix.csv",
  ["id","pregunta","riesgo","evidence","recomendacionAnalisis","estado"],
  [[f"PQ-{i:02d}", q, r, e, "Dictamen profesional", "OPEN"] for i,(q,r,e,_x) in enumerate([
    ("Es defendible Empresa=responsable / EvaluHR=encargado por tratamiento","ALTO","04, 03","Dictamen"),
    ("Que fundamento corresponde a cada tratamiento (LFPDPPP 2025)","ALTO","02, 01","Dictamen"),
    ("Que tratamientos requieren consentimiento y en que forma","ALTO","05","Dictamen"),
    ("Redaccion definitiva del consentimiento","MEDIO","05, 06","Dictamen"),
    ("Plazos de conservacion por categoria","MEDIO","15","Dictamen"),
    ("Que datos sensibles pueden tratarse","ALTO","10, 20, 22","Dictamen"),
    ("Suficiencia del protocolo UNINVITED_DISCLOSURE","ALTO","10","Dictamen"),
    ("Contenido del aviso y consolidacion PDF+in-app","ALTO","06","Dictamen"),
    ("Que decir sobre IA en aviso/contrato","MEDIO","12","Dictamen"),
    ("Como documentar revision humana","MEDIO","13","Dictamen"),
    ("Que transferencias requieren que mecanismo","ALTO","17, 18","Dictamen"),
    ("Que subencargados declarar","ALTO","17","Dictamen"),
    ("Obligaciones ARCO por parte y plazos vigentes","MEDIO","09","Dictamen"),
    ("Restricciones por puesto (edad/disponibilidad)","MEDIO","11, 02","Dictamen"),
    ("Controles de no discriminacion a incorporar","MEDIO","11","Dictamen"),
    ("Riesgo juridico especifico de BDI/STAR","MEDIO","24, evidence-a06-11","Dictamen"),
    ("Resultados como evidencia de competencia (art. 26)","MEDIO","25, 14","Dictamen"),
    ("Cambios al contrato maestro","ALTO","08","Dictamen"),
    ("Cambios al aviso","ALTO","06","Dictamen"),
    ("Puede cerrarse INTERVIEW-G7 con el paquete A-06.11","CRITICO","24, 23","Dictamen"),
    ("Indicador de integridad como orientacion visible","MEDIO","22","Dictamen"),
    ("Debe recolectarse candidateAge","MEDIO-ALTO","02, 11","Dictamen"),
    ("Evidencia de consentimiento suficiente (gap canal publico)","MEDIO","05","Dictamen"),
    ("Regimen de incidentes/notificacion conforme texto vigente","MEDIO","19","Dictamen"),
    ("Como documentar la no validez psicometrica sin afirmaciones enganosas","MEDIO","20","Dictamen"),
    ("Condiciones del dictamen para piloto (G9) y validacion (G10)","MEDIO","23, 24","Dictamen"),
  ], start=1)])

# 4. contract-requirements.csv
w("contract-requirements.csv",
  ["clausula","requerimiento","marca","estado"],
  [
    ["1 Objeto","Prestacion de plataforma para seleccion","LEGAL_REVIEW","BORRADOR"],
    ["2 Alcance","Demo en desarrollo; servicios incluidos","LEGAL_REVIEW","BORRADOR"],
    ["3 Roles","Cliente=responsable / EvaluHR=encargado + cambio de rol","OBLIGATORIO","BORRADOR"],
    ["4 Instrucciones","Tratamiento solo por instruccion documentada","OBLIGATORIO","BORRADOR"],
    ["5 Finalidad","Unica: seleccion; usos secundarios prohibidos","OBLIGATORIO","BORRADOR"],
    ["6 Datos","Categorias del inventario; sin ampliar sin aviso/base","OBLIGATORIO","BORRADOR"],
    ["7 Datos sensibles","Refuerzo; expreso; UNINVITED_DISCLOSURE","OBLIGATORIO","BORRADOR"],
    ["8 Seleccion","Decision de EL CLIENTE; insumo complementario","OBLIGATORIO","BORRADOR"],
    ["9 Evaluaciones","Instrumentos y limitaciones declaradas","OBLIGATORIO","BORRADOR"],
    ["10 Entrevista","Agendamiento; estructurada NO activa","OBLIGATORIO","BORRADOR"],
    ["11 IA","Anexo IA; sin entrenamiento; AI_GENERATED+HUMAN_REVIEWED","OBLIGATORIO-LEGAL_REVIEW","BORRADOR"],
    ["12 Revision humana","Cadena resultado→revision→decision","OBLIGATORIO","BORRADOR"],
    ["13 Seguridad","Controles (16); notificacion incidentes [PLAZO]","OBLIGATORIO","BORRADOR"],
    ["14 Subencargados","Lista declarada; autorizacion previa","OBLIGATORIO","BORRADOR"],
    ["15 Transferencias","Solo las declaradas; mecanismo por dictamen","OBLIGATORIO","BORRADOR"],
    ["16 Incidentes","Protocolo (19); cooperacion","OBLIGATORIO","BORRADOR"],
    ["17 ARCO","Asistencia y ejecucion por instruccion","OBLIGATORIO","BORRADOR"],
    ["18 Conservacion","Categorias (15); plazos del dictamen","OBLIGATORIO","BORRADOR"],
    ["19 Eliminacion","Eliminacion segura + certificado","OBLIGATORIO","BORRADOR"],
    ["20 Auditoria","AuditLog; derecho de auditoria del cliente","OBLIGATORIO","BORRADOR"],
    ["21 Confidencialidad","Personal bajo confidencialidad (CPF 210-211)","OBLIGATORIO","BORRADOR"],
    ["22 Propiedad intelectual","Software=Proveedor; datos=titular; resultados=Cliente","LEGAL_REVIEW","BORRADOR"],
    ["23 Responsabilidades","Regimen, indemnidades, limites, seguros","LEGAL_REVIEW","BORRADOR"],
    ["24 Limitaciones","No decidir/publicar/activar/tratar para fines propios","OBLIGATORIO","BORRADOR"],
    ["25 Terminacion","Causales, efectos, entrega/eliminacion","LEGAL_REVIEW","BORRADOR"],
    ["26 Cooperacion legal","Autoridad SABC; amparo; requerimientos","OBLIGATORIO","BORRADOR"],
  ])

# 5. privacy-notice-requirements.csv
w("privacy-notice-requirements.csv",
  ["requisito","pdfPublico","avisoInApp","brecha","accion"],
  [
    ["Identidad+domicilio responsable","SI (s1)","SI (s2-3)","-","-"],
    ["Finalidades","SI (s3)","SI (s9)","Cita NOM-035 imprecisa","Corregir redaccion"],
    ["Datos tratados","SI (s2)","SI (s6)","Faltan edad/canal publico/entrevista","Anadir"],
    ["Datos sensibles","SI (s2)","SI (s6.1-6.2)","Cita marco 2011","Actualizar"],
    ["Medios de obtencion","PARCIAL","PARCIAL","No explicito","Explicitar"],
    ["Consentimiento","SI (s4/s9)","SI (s15/s23)","Cita Art. 8 de 2011","Actualizar fundamento"],
    ["Transferencias","SI (s7)","SI (s11)","Dice no-transferencias vs infraestructura","Rehacer con subencargados"],
    ["IA","NO","PARCIAL","PDF omite IA","Anadir bloque IA"],
    ["Revision humana","PARCIAL","SI (s25)","-","Unificar"],
    ["Conservacion plazos","NO","SI (s16)","PDF omite plazos","Anadir [PLAZO POR DICTAMEN]"],
    ["ARCO","SI (s6)","SI (s13)","Autoridad obsoleta (INAI)","SABC"],
    ["Revocacion","NO","SI (s14/s22)","PDF omite","Anadir"],
    ["Contacto","SI (s10)","SI","-","-"],
    ["Cambios al aviso","SI (s11)","SI (s22)","-","-"],
    ["Cookies","NO","SI (s20)","PDF omite","Anadir"],
    ["Menores","NO","SI (s24)","PDF omite","Anadir"],
  ])

# 6. candidate-transparency.csv
w("candidate-transparency.csv",
  ["queDebeSaberse","dondeSeEntrega","estado"],
  [
    ["Que hace EvaluHR y que se evalua","Invitacion + Informacion previa al candidato (07)","BORRADOR"],
    ["Que informacion se solicita","Aviso + 07","BORRADOR"],
    ["Que NO es necesaria (protegidos)","07 + aviso","BORRADOR"],
    ["Uso de IA y sus limites","07 + aviso (bloque IA)","BORRADOR"],
    ["Revision humana y quien decide","07 + aviso + disclaimers UI (existentes)","PARCIAL"],
    ["Conservacion y derechos ARCO/revocacion","Aviso (alinear PDF)","GAP EN PDF"],
    ["Autoridad de control (SABC)","Aviso","GAP EN PDF (cita INAI)"],
    ["Tratamiento del video (fuera del sistema)","Aviso + 07","GAP"],
  ])

# 7. client-evalua-responsibilities.csv
w("client-evalua-responsibilities.csv",
  ["responsabilidad","empresaCliente","evaluaHR","legalStatus"],
  [
    ["Aviso de privacidad y bases","PRINCIPAL (bajo su nombre)","ASISTENTE (borradores)","LEGAL_REVIEW"],
    ["Definir puesto/criterios/competencias","PRINCIPAL","-","LEGAL_REVIEW"],
    ["Recabar consentimiento","PRINCIPAL","PLATAFORMA (registra evidencia)","LEGAL_REVIEW"],
    ["Conducir entrevistas / revisar resultados","PRINCIPAL","-","LEGAL_REVIEW"],
    ["Decision de contratacion","EXCLUSIVA","NUNCA","VIGENTE (diseno)"],
    ["Responder ARCO","PRINCIPAL","ASISTENTE/EJECUTOR por instruccion","LEGAL_REVIEW"],
    ["Conservar/eliminar","INSTRUYE","EJECUTA (retencion/purga)","LEGAL_REVIEW"],
    ["Seguridad de plataforma","VERIFICA","IMPLEMENTA","LEGAL_REVIEW"],
    ["Incidentes","RECIBE","NOTIFICA","LEGAL_REVIEW"],
    ["Subencargados/transferencias","AUTORIZA","DECLARA Y MANTIENE","LEGAL_REVIEW"],
    ["Cooperacion con autoridad (SABC)","PRINCIPAL","ASISTENTE","LEGAL_REVIEW"],
    ["WhatsApp/envios manuales","PRINCIPAL (practica RRHH)","-","LEGAL_REVIEW"],
    ["Entrenamiento/calibracion de evaluadores","PRINCIPAL","ASISTENTE (diseno)","LEGAL_REVIEW"],
  ])

# 8. instrument-legal-status.csv
w("instrument-legal-status.csv",
  ["instrumento","nombre/version","fuente","derechos","usoPermitido","usoProhibido","evidencia","limitaciones","estadoLegal","estadoMetodologico"],
  [
    ["PERSONALIDAD","Big Five 10 items propios (LEGACY/DEVELOPMENT_ONLY)","Items del proyecto; sin IPIP","UNKNOWN","Ninguno productivo","Decision; feed a overall (excluido)","evidence-a05-1/2/3; overall-score.ts","Sin licencia/validacion MX/baremos","LEGAL_REVIEW (retirar o licenciar)","NOT_IMPLEMENTED para V1"],
    ["CONOCIMIENTO","Cadena canonica A-03.5 (KA-vn/BP-vn)","Bancos propios + IA (AI_DRAFT)","Propios","Evaluacion tecnica; publicacion solo SYSTEM","Exponer correctAnswer al candidato","knowledge-canonical.ts; schema 486-715","Key visible en browser admin; drift prod","LEGAL_REVIEW","IMPLEMENTED"],
    ["INTEGRIDAD","Indicador orientativo (10 items)","Items del proyecto","Propios","Orientativo visible; nunca filtro","Feed a overall/JobFit (excluido)","evaluations/route.ts; overall-score.ts","Sin validacion; sensible","LEGAL_REVIEW (continuar/retirar)","Implementado; NO aprobado para agregados"],
    ["COMPETENCIAS","Modelo A-06 (12 competencias DRAFT)","Literatura + job analysis","Propios","Ninguno productivo","Activar sin gates; publicar","evidence-a06-1/2/11","Sin piloto; G7 NO APPROVED","LEGAL_REVIEW","NOT_IMPLEMENTED (design-only)"],
    ["ENTREVISTA","BDI/STAR (10 preguntas/26 probes DRAFT v2) + InterviewSchedule","Metodologia BDI/STAR","Propios","Agendamiento","Entrevista estructurada en producto","evidence-a06-3/11; interviews route","Sin piloto; sin consistencia medida","INTERVIEW-G7 = NO APPROVED","PARTIAL (agendamiento implementado)"],
  ])

# 9. retention-requirements.csv
w("retention-requirements.csv",
  ["dato","plazoSistema","fundamentoPropuesto","motivo","accionAlVencimiento","legalStatus"],
  [
    ["PII candidatos (no contratado)","730 dias","Minimizacion","Limite de finalidad","Anonimizacion","[PLAZO POR DICTAMEN]"],
    ["PII candidatos (contratado)","No diferenciado (sin hiredAt)","Relacion laboral","Historial","[POR DICTAMEN]","POR DICTAMEN"],
    ["Sensibles (psicologica/Big Five/integridad)","90 dias inactividad","Tratamiento reforzado","Refuerzo","Eliminacion","[PLAZO POR DICTAMEN]"],
    ["Conocimientos/evidencia congelada","Indefinido","Interes probatorio","Evidencia","Anonimizar/eliminar","[PLAZO POR DICTAMEN]"],
    ["Consentimiento (ConsentLog)","Indefinido","Evidencia legal","Defensa","Eliminar tras plazo de presunciones","[PLAZO POR DICTAMEN]"],
    ["ARCO (ArcoRequest)","Indefinido","Evidencia legal","Defensa","Idem","[PLAZO POR DICTAMEN]"],
    ["AuditLog","90 dias","Seguridad","Deteccion","Eliminacion","[PLAZO POR DICTAMEN]"],
    ["Resultados (scores)","730 dias (con PII)","Minimizacion","Limite","Anonimizacion","[PLAZO POR DICTAMEN]"],
    ["Grabaciones","NO EXISTEN","-","-","-","NO APLICA"],
    ["Contenido sensible involuntario","NO CONSERVAR","Protocolo","Refuerzo","Inexistente por diseno","VIGENTE (diseno)"],
  ])

# 10. subprocessor-register.csv
w("subprocessor-register.csv",
  ["proveedor","servicio","datos","pais","transferencia","subencargado","riesgo","legalStatus"],
  [
    ["Supabase","BD Postgres produccion","Todo inventario (02)","Canada (ca-central-1 documentado en auditoria previa; region real POR CONFIRMAR)","SI (posible)","SI (encargo pendiente)","ALTO","LEGAL_REVIEW - DOCUMENTACION PENDIENTE"],
    ["Vercel","Hosting app + cron","Solicitudes, logs, cookies","POR CONFIRMAR","SI (posible)","SI (encargo pendiente)","MEDIO","LEGAL_REVIEW"],
    ["Proveedor IA (endpoint Z-AI / SDK)","Generacion de preguntas","Contexto de puesto (sin PII detectado)","POR CONFIRMAR","SI (posible)","SI (encargo pendiente)","MEDIO","LEGAL_REVIEW"],
    ["WhatsApp (uso manual)","Canal invitacion/video","Nombre+enlace; video fuera del sistema","Segun servicio","De facto (manual)","NO (uso manual de RR.HH.)","MEDIO","LEGAL_REVIEW (transparencia)"],
    ["Email/SMTP/SMS","-","-","-","-","NO DETECTADO en codigo","-","NO APLICA HOY"],
  ])

# 11. transfer-register.csv
w("transfer-register.csv",
  ["transferencia","datos","destino","proveedor","mecanismo","revisionLegal"],
  [
    ["T1 Alojamiento BD produccion","Inventario completo","Canada (POR CONFIRMAR)","Supabase","Contrato de subencargo + mecanismo por dictamen (marco 2025)","LEGAL_REVIEW"],
    ["T2 Hosting/cron app","Solicitudes, logs, cookies","POR CONFIRMAR","Vercel","Idem","LEGAL_REVIEW"],
    ["T3 Proveedor IA (prompts de generacion)","Contexto de puesto (sin PII detectado)","POR CONFIRMAR","Endpoint Z-AI","Idem + prohibicion de entrenamiento","LEGAL_REVIEW"],
    ["T4 WhatsApp manual","Nombre+enlace; video","Segun uso","WhatsApp/Meta (fuera del sistema)","Sin API; transparencia en aviso","LEGAL_REVIEW"],
    ["T5 Otras","-","-","-","-","NO DETECTADA"],
  ])

# 12. 01-GATE-STATUS.csv (PASO 30)
w("01-GATE-STATUS.csv",
  ["gate","requirement","status","evidence","owner","blocking","legalReview","nextAction"],
  [
    ["LEGAL-DICTAMEN","Dictamen legal profesional emitido","BLOCKED","Paquete completo; sin dictamen","Abogado","SI","SI","Emitir dictamen (28/29)"],
    ["LEGAL-AVISO","Aviso alineado con marco 2025 y practica real","OPEN","06 (brechas PDF vs in-app)","EvaluHR+Abogado","SI (candidatos)","SI","LEGAL-001"],
    ["LEGAL-CONSENT","Formas de consentimiento por tratamiento","OPEN","05 (matriz C1-C8)","Abogado","SI","SI","LEGAL-002"],
    ["LEGAL-CONTRATO","Contrato maestro firmado","BLOCKED","08 (borrador); sin contrato real","EvaluHR+Cliente","SI","SI","LEGAL-003 + OLI-025"],
    ["LEGAL-SENSIBLES","Regimen de datos sensibles aprobado","OPEN","10, 20, 22","Abogado","SI","SI","LEGAL-006"],
    ["LEGAL-ARCO","Flujo ARCO conforme texto vigente","CONDITIONAL","09 (implementado 20 dias habiles)","EvaluHR","NO","SI","LEGAL-013"],
    ["LEGAL-RETENCION","Plazos de conservacion por dictamen","OPEN","15","Abogado+EvaluHR","SI (pre-produccion)","SI","LEGAL-004/009"],
    ["LEGAL-SUBENCARGADOS","Subencargados declarados y contratados","BLOCKED","17 (sin lista ni acuerdos)","EvaluHR","SI","SI","LEGAL-010"],
    ["LEGAL-TRANSFERENCIAS","Mecanismos de transferencia aprobados","OPEN","18","Abogado","SI","SI","LEGAL-010"],
    ["LEGAL-INCIDENTES","Protocolo de incidentes con plazos","OPEN","19","Abogado+EvaluHR","SI (produccion)","SI","LEGAL-011"],
    ["LEGAL-SEGURIDAD","Controles declarables sin certificaciones","CONDITIONAL","16 (RLS DB no ejecutado; backups sin soporte)","EvaluHR","SI (produccion)","SI","LEGAL-005/012"],
    ["LEGAL-NO-DISCRIMINACION","Politica adoptada","OPEN","11","EvaluHR+Cliente","NO","SI","LEGAL-014"],
    ["LEGAL-IA","Anexo IA validado","OPEN","12","Abogado","NO","SI","LEGAL-002/003 anexos"],
    ["LEGAL-ART26","Salvaguardas de evaluacion automatizada","OPEN","14, 25","Abogado","SI","SI","LEGAL-017"],
    ["INTERVIEW-G7","Revision legal de entrevista estructurada","BLOCKED","evidence-a06-11; banco DRAFT","Abogado","SI (activar entrevista)","SI","PQ-20/26"],
    ["INTERVIEW-G9","Piloto no productivo ejecutado","BLOCKED","A-06.10 NO EJECUTADO","EvaluHR","SI (activar entrevista)","NO","Post-dictamen"],
    ["LEGAL-G10","Validacion legal post-piloto","BLOCKED","Requiere G8+G9","Abogado","NO (post-V1)","SI","Despues del piloto"],
    ["PROD-RETENTION-CRON","Cron de retencion operativo","OPEN","15 (middleware bloquea Bearer)","EvaluHR","NO","NO","LEGAL-009 (OPER-01)"],
    ["PROD-RLS-DB","RLS Postgres activado","BLOCKED","rls-policies.sql NOT EXECUTED","EvaluHR","SI (produccion)","NO","LEGAL-005"],
    ["PROD-SCHEMA-PARITY","Paridad dev/prod de modelos","OPEN","7 modelos Knowledge ausentes en prod","EvaluHR","NO","NO","LEGAL-022"],
    ["PROD-IPIP","Licencia/retiro de Big Five","OPEN","20","EvaluHR","NO","SI","LEGAL-015"],
    ["PROD-AGE","Justificacion o eliminacion de candidateAge","OPEN","02, 11","Cliente+EvaluHR","SI (pre-produccion)","SI","LEGAL-007"],
  ])

print("OK — 12 CSVs generados")
