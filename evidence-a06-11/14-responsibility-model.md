# EVALUHR — A-06.11 · 14 · RESPONSIBILITY MODEL (PASO 15)

## 0. Clasificación propuesta (sujeta a dictamen — cuestión 1 de 19)

```
EMPRESA CLIENTE  =  RESPONSABLE del tratamiento
EVALUA HR        =  ENCARADO / OPERADOR por instrucción
```

Esta clasificación es la propuesta de diseño consolidada del registro A-06.8; **el dictamen decide si es jurídicamente correcta**.

## 1. EMPRESA CLIENTE (responsable)

| Ámbito | Contenido de la responsabilidad |
|---|---|
| Finalidad | Define y justifica la finalidad del tratamiento (proceso de selección); responde por el aviso |
| Puesto | Define los perfiles (p.ej. MESERO, VENDEDOR) y sus requisitos reales; la pertinencia de cada competencia al puesto es suya |
| Criterios | Define los criterios de evaluación y qué competencias se evalúan; aprueba guías antes de cualquier uso |
| Decisión | **Toma la decisión de empleo con múltiples fuentes** (Art. 37 Bis); la plataforma no decide |
| Revisión | Conserva capacidad de revisar/corregir resultados; responde ARCO como responsable |

## 2. EVALUA HR (encargado)

| Ámbito | Contenido de la responsabilidad |
|---|---|
| Plataforma | Provee la plataforma de evaluación y entrevista estructurada conforme a contrato (11) |
| Procesamiento | Trata datos **solo por instrucción documentada** del responsable y para la finalidad contratada |
| Seguridad | Implementa y mantiene los controles de 18; notifica incidentes |
| Trazabilidad | Mantiene audit trail inmutable, versiones y evidencia de revisión humana |
| Conservación por instrucción | Conserva/elimina según instrucciones y dictamen (10); no define plazos por cuenta propia |
| Asistencia tecnológica | Asiste el ejercicio ARCO del responsable (17); asiste al titular canalizando su solicitud al responsable |

## 3. Situaciones que pueden alterar la clasificación (el encargo pide identificarlas)

| # | Situación | Efecto potencial |
|---|---|---|
| S1 | EVALUA HR define por sí mismo criterios de evaluación, competencias o pesos sin instrucción del cliente | EVALUA HR asume rol de (co)responsable respecto de ese tratamiento — prohibido en diseño |
| S2 | EVALUA HR usa datos de candidatos para fines propios (mejora de modelos, estadística, marketing, entrenamiento de IA) | Se convierte en responsable de ese tratamiento — prohibido en diseño (11 §2) |
| S3 | La empresa cliente no entrega aviso ni obtiene base habilitante y EVALUA HR trata de todos modos | Riesgo de corresponsabilidad; el encargado debe suspender el tratamiento sin instrucción/base |
| S4 | EVALUA HR excede instrucciones (trata más datos, conserva más, accede sin necesidad) | Responsabilidad propia del encargado (tratamiento contrario a instrucciones) |
| S5 | La empresa cliente "delega" la decisión de contratación en la plataforma | La decisión automatizada no existe en diseño; si ocurriera, la empresa sigue siendo responsable y se genera incumplimiento de Art. 37 Bis |
| S6 | Evaluación de candidatos para uso propio de EVALUA HR (p.ej. sus propios RR.HH.) | En ese caso EVALUA HR = responsable de ese proceso — fuera del alcance de este expediente |
| S7 | Subencargados sin declarar ni autorizar | Incumplimiento del encargo; responsabilidad para ambos según contrato |

## 4. Matriz de acciones por parte

| Acción | EMPRESA CLIENTE | EVALUA HR |
|---|---|---|
| Entregar aviso / recabar base habilitante | ● | — |
| Definir puesto/criterios/competencias | ● | — |
| Conducir entrevista (entrevistador humano) | ● (o quien designe) | Asiste tecnológicamente |
| Revisar y asignar niveles (humano) | ● | — |
| Aprobar CompetencyResult | ● | — |
| Decidir contratación | ● | **NUNCA** |
| Responder ARCO | ● | Asiste; ejecuta por instrucción |
| Conservar / eliminar | ● (instruye) | ● (ejecuta) |
| Seguridad de la plataforma | Verificar | ● (implementa) |
| Notificar incidentes | Recibe | ● (notifica) |

## 5. Documentación de la clasificación

- Cláusula de roles (11 §1.3) — LEGAL_REVIEW.
- Aviso de privacidad de la empresa (12 §1.1) — LEGAL_REVIEW.
- Matriz de acceso técnica coherente con la clasificación (18 §3).
- Cuestión 1 de 19-lawyer-questions.md y fila RES-01 de legal-opinion-request.csv.
