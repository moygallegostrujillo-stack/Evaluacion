# A-01.3 — PASO 11: CONTROL DE VERSIONES

## 1. Estado actual

| Campo | Valor vigente |
|---|---|
| instrumentId | `EVALHR-PERSONALIDAD-IPIP50-MX` |
| instrumentVersion | **1.0** (implementación actual) |
| languageVersion | `ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA` |
| scoringVersion | `IPIP50-BFM-1.0` |

v1.0 = la implementación descrita en este expediente: 50 ítems verbatim de la versión
mexicana publicada por Rodrigo de Oliveira en el IPIP, escala 1–5 de exactitud,
inversión 6−v solo en los 24 ítems de la clave oficial, suma por factor (10–50),
visual raw/50×100, sin pesos, sin baremos, sin overall.

## 2. Identificación cuádruple en cada resultado histórico

Todo resultado generado por la plataforma persiste y debe conservar de forma
indefinida el cuádruple identificador:

```
instrumentId        = EVALHR-PERSONALIDAD-IPIP50-MX
instrumentVersion   = 1.0
languageVersion     = ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA
scoringVersion      = IPIP50-BFM-1.0
```

Implementado en `EvaluationTemplate`, `EvaluationResult` y `VacancyApplication`
(columnas `instrumentId`, `instrumentVersion`, `languageVersion`, `scoringVersion`;
null = instrumentos legacy, que conservan su comportamiento histórico intacto).

Propósito: que cualquier resultado pueda reconstruirse e interpretarse **según la
versión exacta con que fue producido**, aunque el sistema evolucione.

## 3. Regla de no reinterpretación automática

**Un resultado histórico NO debe reinterpretarse automáticamente con una versión
nueva.** Concretamente:

1. Al existir v1.1, v2.0 o superior, los resultados existentes **siguen siendo v1.0**:
   no se recalculan, no se migran puntajes, no se reetiquetan.
2. Cualquier vista, reporte o exportación debe mostrar el resultado con su versión
   original (y, si conviene, con la nota de qué versión representa).
3. Si se desea comparar resultados entre versiones, debe hacerse mediante un estudio
   de equivalencia documentado — nunca por simple traslación de números.
4. La única intervención legítima sobre un resultado histórico es su lectura tal cual
   fue producido (crudo, visual, resumen, disclaimer de su versión).

## 4. ¿Qué ocurre cuando exista una v1.1? (cambio menor)

Escenario: corrección documental o de plataforma sin tocar reactivos/escala/scoring.

- `instrumentVersion` pasa a `1.1`; `languageVersion` y `scoringVersion` permanecen.
- Nuevas sesiones se generan ya con `1.1`.
- Resultados con `1.0` permanecen `1.0`; ambos convivirán y el sistema podrá mostrar
  la versión en los reportes.
- El expediente recibe un anexo con el motivo y la evidencia del cambio (sin reescribir
  la historia de v1.0).

## 5. ¿Qué ocurre cuando exista una v2.0? (cambio mayor)

Escenario: cambio de reactivos, orden, escala, instrucción o scoring.

- Cambian `instrumentVersion` (→ 2.0) y, según el caso, `languageVersion` y/o
  `scoringVersion`.
- v1.0 puede: (a) retirarse para nuevas administraciones (con aviso en este registro),
  o (b) coexistir temporalmente si algún proceso la sigue administrando — en cuyo caso
  los reportes distinguen explícitamente ambas versiones.
- Los resultados v1.0 conservan sus puntajes y su resumen original para siempre. El
  sistema no debe sugerir equivalencias ("equivale a X en v2.0") sin estudio de
  equiparación aprobado por gobernanza.
- La nueva versión requiere su propio expediente completo (gobernanza, §6: evidencia
  antes de publicar).

## 6. Correspondencia con las versiones de las capas

| Capa | Identificador | Qué controla |
|---|---|---|
| Instrumento | `instrumentVersion` | Contenido y estructura (ítems, orden, escala, instrucción) |
| Lengua | `languageVersion` | Qué textos lingüísticos se administran (reactivos verbatim + instrucción renderizada) |
| Scoring | `scoringVersion` | Algoritmo de puntaje (inversiones, suma, visual) |
| Instrumento lógico | `instrumentId` | Identidad del instrumento dentro de EvaluHR |

Cada capa versiona de forma independiente; un cambio de una capa no implica cambios en
las demás (pero siempre provoca revisión de gobernanza y, si procede, bump de
`instrumentVersion`).

## 7. Registro de versiones

| instrumentVersion | languageVersion | scoringVersion | Estado | Desde | Notas |
|---|---|---|---|---|---|
| 1.0 | ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA | IPIP50-BFM-1.0 | ACTIVA | 2026-09 (A-01.2) | Implementación inicial documentada en este expediente |

(Ninguna versión retirada a la fecha.)

## 8. Reglas de retención

1. Los resultados y su cuádruple identificador se conservan de acuerdo con la política
   de datos de EvaluHR (LFPDPPP) — el versionado no expira con el tiempo.
2. Este registro es append-only: nunca se borra una entrada; las correcciones se
   agregan como nueva entrada que referencia a la anterior.
3. Cambios de este documento (política de versiones) no requieren nueva versión del
   instrumento, pero sí quedan registrados en el expediente con fecha.

— FIN DEL DOCUMENTO DE CONTROL DE VERSIONES —
