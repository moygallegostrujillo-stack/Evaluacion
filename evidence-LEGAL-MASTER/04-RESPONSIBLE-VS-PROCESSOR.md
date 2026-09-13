# EVALUHR — LEGAL MASTER PACKAGE · 04 · RESPONSIBLE VS PROCESSOR (PASO 7)

## 0. Tesis a auditar

**EMPRESA CLIENTE = Responsable · EVALUA HR = Encargado.** El sistema ya lo declara así en el aviso in-app (privacy-notice.ts §4–5, glosario) y en el PDF (§1). El dictamen debe determinar si es defendible **para cada tratamiento** de la matriz de finalidades (03) y del inventario (02).

## 1. Argumentos a favor (según diseño verificado)

1. Finalidades definidas por la empresa (selección de su personal); EvaluHR procesa por instrucción técnica.
2. El aviso identifica a la EMPRESA como responsable y a EvaluHR como encargado.
3. El sistema no decide contratación: recommendation = orientación de completitud; disclaimers en UI; sin campos de decisión.
4. Eliminación/conservación por instrucción (purga del responsable vía retención/cleanup).

## 2. Tratamientos donde EvaluHR podría convertirse en responsable (riesgo)

| # | Tratamiento | Riesgo | Mitigación requerida |
|---|---|---|---|
| R1 | Generación de preguntas con IA por su propia biblioteca/endpoint | Si EvaluHR define los contenidos y los modelos, hay finalidad propia de proveedor | Contrato: preguntas = servicio por instrucción; origin AI_DRAFT sin autoridad de publicación |
| R2 | Estadísticas/mejoras del producto con datos de clientes | Uso propio → responsable | Prohibición contractual expresa (08 §5) |
| R3 | Operación de infraestructura (Supabase/Vercel/proveedor IA) | Es subencargo del encargo, no responsabilidad de titular — pero si contratos no existen, no hay encargo válido de los subencargados | Registro de subencargados (17) + cláusulas de encargo |
| R4 | Uso de EvaluHR para candidatos propios de EvaluHR | Fuera de alcance; en ese caso EvaluHR = responsable | Declarar alcance en contrato |
| R5 | Datos enviados por WhatsApp manual por RR.HH. (video/enlace) | Tratamiento fuera del sistema bajo control del responsable | Transparencia en aviso (06); dictamen |
| R6 | `candidateAge` si la finalidad no se justifica | Tratamiento sin base defendible | Justificar o eliminar (LEGAL-0xx) |

## 3. Consecuencias si la clasificación falla

- EvaluHR como responsable asumiría aviso, consentimiento, ARCO directo, plazos y responsabilidad ante la autoridad (Secretaría Anticorrupción y Buen Gobierno) y el titular.
- El contrato debe prever esta re-clasificación (cláusula de cambio de rol y cooperación) — 08 §6.

## 4. Posición de partida para el dictamen

| Tratamiento (03) | Clasificación defendible hoy | Nota |
|---|---|---|
| F1, F2, F3, F6, F8, F9, F10, F11 | Empresa = responsable / EvaluHR = encargado | Defendible con contrato + aviso correctos |
| F4, F5 (legacy sensibles) | Ídem, PERO la necesidad está en duda | Dictamen: conservar/retirar |
| F7 (WhatsApp) | Empresa = responsable del envío manual | Fuera de plataforma — informar |
| F12 (IA) | Defendible como encargo; riesgo R1 | Cláusulas IA (08 §11) |
