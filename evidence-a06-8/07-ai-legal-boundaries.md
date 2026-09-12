# EVALUHR — A-06.8 — 07 · Límites Jurídicos de la IA (PASO 7)

> Límites jurídicos y metodológicos del uso de IA en la entrevista estructurada BDI/STAR.
> Consolida A-06.4 `08-ai-boundaries.md` + A-06.5 `13-ai-boundaries.md` + A-06.7 `12-ai-boundaries.md`
> (5 sobre-alcances RECHAZADOS). Marco: Nueva LFPDPPP 2025 (transparencia; decisión humana);
> LFT Art 3 (no inferir discriminación).

## 1. PERMITIDO — lista cerrada (con condiciones)

| # | Función permitida | Condición jurídica |
|---|---|---|
| P-1 | **Resumen** de la respuesta del candidato | Borrador visible para el entrevistador; revisión humana obligatoria antes de cualquier uso; salida marcada AI_DRAFT; nunca es evidencia por sí misma |
| P-2 | **Transcripción** (si hay grabación consentida) | Grabación solo con consentimiento específico; transcripción = borrador; si aparece contenido sensible → protocolo 05 (RA-4) + purge del segmento |
| P-3 | **Sugerencia de probe ya aprobado** | Solo probes del banco (04); sugerencia visible, nunca automática; el entrevistador decide; la IA nunca elige solo |
| P-4 | **Detección de información faltante** | Lista qué componentes STAR/indicadores no tienen aún evidencia; NO sugiere cómo "completar" la respuesta del candidato |
| P-5 | **Adaptación de lenguaje** | Claridad/formulación neutral de preguntas ya aprobadas; prohíbe cambiar el contenido semántico de la pregunta |

Fuera de esta lista cerrada, **todo uso de IA está prohibido** hasta que una revisión metodológica
+ legal lo apruebe por escrito.

## 2. PROHIBIDO — lista cerrada

| # | Uso prohibido | Riesgo jurídico |
|---|---|---|
| X-1 | Inferir atributos protegidos (edad, género, salud, religión, origen, estado civil, etc.) | LFT Art 3 / LFPEPD — discriminación; datos sensibles sin base |
| X-2 | Inferir personalidad o rasgos latentes | Tratamiento no consentido; finalidad distinta; invasión |
| X-3 | Inferir integridad ("este candidato miente") | Decisión sobre persona, no sobre competencia; riesgo de daño |
| X-4 | Inferir estado emocional | Datos sensibles de facto; sin validez; discriminatorio potencial |
| X-5 | Inventar evidencia (completar STAR que el candidato no dijo) | Falsificación de evidencia; vicia todo el proceso |
| X-6 | Decidir competencia (asignar nivel) | Decisión automatizada prohibida (08) |
| X-7 | Decidir contratación o recomendar contratación | Decisión laboral = humana (empresa cliente) |
| X-8 | Clasificar/categorizar candidatos (ranking, bucket, "fit") | Scoring encubierto; prohibición de scoring/pesos/cortes |

## 3. Reglas de operación

| Regla | Contenido |
|---|---|
| RA-1 | Toda salida de IA es **AI_DRAFT / DRAFT** y **no es evidencia** hasta revisión humana explícita. |
| RA-2 | La IA **no tiene acceso autónomo** al histórico de candidatos ni cruza datos entre procesos (11). |
| RA-3 | La IA **no procesa contenido sensible** (protocolo 05, RA-4). |
| RA-4 | Logs de toda interacción IA (entrada/salida/modelo/versión) para trazabilidad (12). |
| RA-5 | El uso de IA se informa al candidato en la información previa (09) y en el aviso (14). |
| RA-6 | La IA nunca es la **única base** de una decisión sobre el candidato (08). |
| RA-7 | Los 5 sobre-alcances RECHAZADOS en A-06.7 quedan como casos de prueba negativa para futuras implementaciones. |

## 4. Relación con la nueva ley 2025

- La transparencia sobre el uso de IA y la revisión humana son requisitos de información al titular
  → se integran al aviso/consentimiento (13/14) — redacción final REQUIERE REVISIÓN LEGAL.
- La obligación de confidencialidad ampliada (ey.com, 02) cubre a proveedores de IA → sub-encargados
  de IA deben quedar en el contrato (13).
- Cualquier función de IA que toque "decisión" o "perfilado" es LEGAL_REVIEW previo (no se propone).

## 5. Conexión con gates

INTERVIEW-G6/LEGAL-G6 requieren: lista cerrada vigente + logs + información al candidato +
sobre-alcances bloqueados. La implementación técnica de estas funciones sigue fuera de alcance
(NO IMPLEMENTAR).
