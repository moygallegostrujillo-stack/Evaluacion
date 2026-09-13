# EVALUHR — A-06.10 — 10 · Privacidad (PASOS 14 y 17)

> **PILOTO DE CAMPO CONTROLADO — NO PRODUCTIVO.**
> Verificación de privacidad **durante** el piloto, no solo al cierre. Marco: A-06.8 (protocolo 05,
> retención re-clasificada, acceso) y A-06.9 (consentimiento borrador, conservación [PLAZO POR
> DICTAMEN]).

## 1. Revelación involuntaria (PASO 14)

| Sesión | Pregunta | UNINVITED_DISCLOSURE | Protocolo 05 aplicado | Contenido registrado |
|---|---|---|---|---|
| S-PIL-03 | Q-MES-TRV-002 | **YES** (patrón H / caso M-H, simulado) | SÍ — íntegro | **NINGUNO** — solo flag |
| S-PIL-08 | Q-VEN-TRV-002 | **YES** (patrón H / caso V-H, simulado) | SÍ — íntegro | **NINGUNO** — solo flag |
| Otras 10 sesiones | — | NO | Vigilancia activa sin activación | — |

Secuencia aplicada en ambos casos (6 pasos de A-06.8 §05): ① no profundizar ② no registrar contenido
③ redirigir a conducta laboral ④ registrar solo el evento mínimo (flag sin atributo) ⑤ continuar y
cerrar con normalidad ⑥ revisión post-sesión (sin riesgo → sin escalación).

Verificación adicional: la respuesta completa se marcó **INVALID** (no se "rescata" la porción
laboral del relato — decisión DIS-01 de calibración). Los flags NO contienen el atributo, ni una
descripción, ni una categoría: solo `UNINVITED_DISCLOSURE=YES`.

## 2. Verificación en curso (PASO 17)

| Control | Verificación | Resultado |
|---|---|---|
| Minimización | Campos por registro: participantId, profileRef, jobExample, session, modality, consentFlag + notas de patrón A–J. 1 desviación de formulario detectada (campo edad aproximada heredado de plantilla, **nunca poblado**) y eliminada (INC-PIL-002) | ✔ CUMPLE (tras corrección) |
| No recopilación de datos sensibles | 0 campos sensibles en el corpus; 2 revelaciones simuladas contenidas sin registro de contenido; probes verificados sin puertas a datos sensibles (A-06.8 §04 se mantuvo) | ✔ CUMPLE |
| Acceso restringido | Participantes del piloto = 4 roles del equipo de método (INT-01/02, REV-01/02) + auditoría. Sin acceso de cliente, sin acceso productivo, sin IA con acceso autónomo a registros | ✔ CUMPLE |
| No exportación innecesaria | 1 desviación detectada y corregida: plantilla de exportación incluía campo sobrante → eliminada antes de generar cualquier archivo (INC-PIL-009 anexo en 12-incidents como parte de INC-PIL-002) | ✔ CUMPLE (tras corrección) |
| Eliminación posterior | **PURGE_PROGRAMADO**: al cierre de la revisión de esta auditoría se ejecutará purge/anonimización de las notas de sesión (procedimiento A-06.8 10 §3) con registro; los CSV y md de resultados se conservan como evidencia de auditoría (sin datos personales — son sintéticos) | ⚠ PROGRAMADO (no ejecutable en este task sin romper la cadena de evidencia) |

## 3. Datos personales reales en el corpus: CERO

- Participantes: sintéticos (P-SIM-01..12 derivados de perfiles A-06.6).
- Entrevistadores/revisores: roles funcionales sin identidad personal.
- Cliente: ninguno involucrado; sin datos de ALIMENTOS PAPO ni de EvaluHR en registros de sesión.
- El único dato "personal" en el expediente es la referencia a perfiles sintéticos documentados en
  A-06.6, que no corresponden a persona alguna.

## 4. Consentimiento del piloto

- Flujo `PILOT-SIM-CONSENT-v1` recorrido en 12/12 sesiones (fase CONSENTIMIENTO).
- Elementos mínimos de información (A-06.8 §09) verificados en el recorrido: naturaleza del piloto,
  no productivo, sin consecuencias laborales, datos mínimos, IA y sus límites, retención, derechos.
- En modo simulación no existe persona que consienta: el registro documenta que el **flujo y el
  material** son operables y comprensibles — no que alguien haya consentido.

## 5. Deuda heredada (sin cambios)

- Plazo de conservación de registros: `[PLAZO POR DICTAMEN]` (A-06.9 item 3) — INC-PIL-010.
- G7 sigue NO APPROVED: nada de lo anterior constituye dictamen ni aprobación legal.
