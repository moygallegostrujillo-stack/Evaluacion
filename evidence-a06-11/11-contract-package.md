# EVALUHR — A-06.11 · 11 · CONTRACT PACKAGE (PASO 12)

## 0. Estatus y provenance

- **BORRADOR DRAFT — NO MODIFICA CONTRATO REAL.** Este documento reconstruye a nivel DRAFT los 12 elementos definidos en el alcance A-06.9 (NO EJECUTADO) para que el abogado disponga de un objeto concreto de dictamen. Cada elemento se marca: **OBLIGATORIO / RECOMENDADO / LEGAL_REVIEW**.
- Partes definidas en el alcance (para borrador interno; ver 01 §6):
  - **EVALUA HR** (proveedor / presunto encargado): Moisés Gallegos Trujillo · RFC GATM7010257U6 · Tuxtla Gutiérrez, Chiapas.
  - **EMPRESA CLIENTE** (presunta responsable, referencia demo): ALIMENTOS PAPO · RFC APA240229EA9 · Representante: Manuel Araujo Zenteno · RR.HH.: Lic. Eva.

## 1. Los 12 elementos

### 1. Cláusula propuesta — encargo de tratamiento de datos personales (LEGAL_REVIEW)
Borrador de núcleo: "LA EMPRESA encarga a EVALUA HR el tratamiento de datos personales de candidatos, limitado a la prestación de la plataforma de evaluación y entrevista estructurada, conforme a las instrucciones documentadas de LA EMPRESA, al aviso de privacidad aplicable y a la LFPDPPP; EVALUA HR no tratará los datos para fines propios."
- Marca: **LEGAL_REVIEW** (la redacción definitiva la fija el abogado; incluye la determinación correcta de roles, ver 14).

### 2. Finalidad (OBLIGATORIO)
- Única: operar el proceso de selección de LA EMPRESA (invitación, evaluación, entrevista, resultados cualitativos como insumo).
- Prohibidas: fines propios de EVALUA HR (mejora de modelos, estadística agregada identificable, marketing, desarrollo de producto con datos personales) salvo habilitación expresa por dictamen y aviso.

### 3. Roles (OBLIGATORIO — sujeto a dictamen)
- EMPRESA CLIENTE = responsable del tratamiento; EVALUA HR = encargado.
- Situaciones que podrían alterar la clasificación: ver 14 §3 (documento 14).

### 4. Tratamiento (OBLIGATORIO)
- Alcance: datos identificativos mínimos, respuestas de entrevista, evidencia, revisión, auditoría (06).
- Prohibido: tratar datos sensibles; conservar contenido de revelación involuntaria (07).

### 5. IA (OBLIGATORIO)
- Catálogo cerrado de 08 (5 permitidas / 8 prohibidas) incorporado por referencia.
- Declaración de subencargados/proveedores de IA y prohibición de usar respuestas para entrenar modelos (LEGAL_REVIEW — identidad de proveedores).

### 6. Revisión humana (OBLIGATORIO)
- Cadena EVIDENCIA → REVISIÓN HUMANA → COMPETENCY RESULT → DECISIÓN DE EMPRESA (09).
- La plataforma no decide contratación; Art. 37 Bis por referencia.

### 7. Seguridad (OBLIGATORIO)
- Controles de 18 por referencia (autenticación, autorización, mínimo privilegio, aislamiento multi-tenant, auditoría, eliminación).
- Notificación de incidentes de seguridad a LA EMPRESA en plazo [DEFINIR CON ABOGADO] (LEGAL_REVIEW).

### 8. Conservación (OBLIGATORIO)
- Por categorías de 10; plazos = los que dicte el dictamen; eliminación segura al vencimiento; conservación por instrucción.

### 9. ARCO (OBLIGATORIO)
- Flujo de 17: LA EMPRESA recibe y responde la solicitud; EVALUA HR asiste, localiza, suspende y ejecuta por instrucción; evidencia del cumplimiento.

### 10. Subencargados (OBLIGATORIO — LEGAL_REVIEW)
- Lista declarada (hosting/BD, proveedor IA, mensajería para invitaciones — nombres por identificar en A-06.9 real); autorización previa de LA EMPRESA para cambios; obligaciones fluyan por contrato.

### 11. Responsabilidad (OBLIGATORIO — LEGAL_REVIEW)
- Régimen de responsabilidad por incumplimiento del encargo (daños y perjuicios ante el titular por tratamiento contrario a instrucciones); indemnidades recíprocas por actos de cada parte; límites [DEFINIR CON ABOGADO].

### 12. Limitaciones y prohibiciones (OBLIGATORIO)
- EVALUA HR NO: decide contratación; publica preguntas sin aprobación; activa componentes sin gates; usa datos para fines propios; transfiere sin base; conserva datos sensibles.
- LA EMPRESA: responsable de finalidad, aviso, consentimiento, decisión y respuestas ARCO (15).

## 2. Matriz de marcas

| Elemento | OBLIGATORIO | RECOMENDADO | LEGAL_REVIEW |
|---|---|---|---|
| 1 Cláusula propuesta | — | — | ● |
| 2 Finalidad | ● | — | — |
| 3 Roles | ● | — | ● (confirmación) |
| 4 Tratamiento | ● | — | — |
| 5 IA | ● | — | ● (proveedores) |
| 6 Revisión humana | ● | — | — |
| 7 Seguridad | ● | — | ● (plazo de notificación) |
| 8 Conservación | ● | — | ● (plazos) |
| 9 ARCO | ● | — | — |
| 10 Subencargados | ● | — | ● (lista) |
| 11 Responsabilidad | ● | ● (seguro de ciber) | ● |
| 12 Limitaciones | ● | — | — |

## 3. Preguntas de dictamen asociadas

Cuestión 18 de 19-lawyer-questions.md ("¿Qué cambios exige el contrato maestro?") + legal-opinion-request.csv filas CTR-01..CTR-04. Este paquete NO modifica el contrato maestro real.
