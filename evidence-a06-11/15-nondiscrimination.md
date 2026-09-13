# EVALUHR — A-06.11 · 15 · NON-DISCRIMINATION — MATRIZ FINAL (PASO 16)

## 0. Base normativa de referencia técnica (por dictamen)

- LFT Art. 3 (no discriminación por origen étnico/nacional, género, edad, discapacidad, condición social, condiciones de salud, religión, opiniones, preferencias sexuales, estado civil, etc.).
- LFPDPPP (datos sensibles: originan discriminación — art. 3 fr. VI).
- CONAPRED (criterios de no discriminación en empleo).
- NOM-035-STPS-2018 (no sustituye evaluación del entorno; la entrevista no se usa para NOM-035 — A-06.3 `15-privacy.md` §7).

## 1. Atributos protegidos (catálogo preservado A-06.3 `13-bias.md` §2)

Edad · Género · Embarazo · Religión · Estado civil · Orientación sexual · Discapacidad · Origen étnico/nacional · Opiniones políticas · Condiciones sociales o económicas · Salud (no relevante al puesto) · Situación familiar.

## 2. Matriz final pregunta → riesgo → motivo → mitigación → legalStatus

| Pregunta / Elemento | Riesgo | Motivo | Mitigación | legalStatus |
|---|---|---|---|---|
| Q-MES-TRV-001 | Bajo | Contenido neutro sobre comunicación laboral | Rúbrica por indicador; guía estructurada | PUBLICABLE |
| Q-MES-TRV-002 | Medio | La adaptabilidad puede elicitar causas personales del cambio (familia, salud, cuidado) | Enunciado clavado a cambio operativo + guía prohíbe indagar causas + UNINVITED_DISCLOSURE | **CONDITIONAL — REVISE** |
| Q-MES-SVC-001 | Bajo | Conducta de servicio sin atributos | Doble revisión; ejemplo calibrado | PUBLICABLE |
| Q-MES-COL-001 | Bajo | Coordinación laboral; terceros sin identificar | No registrar identificadores de terceros | PUBLICABLE |
| Q-MES-ORG-001 | Bajo | Prioridades operativas | — | PUBLICABLE |
| Q-VEN-TRV-001 | Bajo | Comunicación comercial neutra; no indaga educación/acento | Guía estructurada | PUBLICABLE |
| Q-VEN-TRV-002 | Medio | Mismo riesgo de derivación personal que 2.2 | Igual mitigación | **CONDITIONAL — REVISE** |
| Q-VEN-SVC-001 | Bajo | Reclamos; registra conducta propia | No registrar historial del tercero | PUBLICABLE |
| Q-VEN-COL-001 | Medio-bias + Medio-privacidad | Apoyo entre compañeros puede arrastrar conflictos interpersonales y datos de terceros; riesgo similarity/halo al valorar "ayuda" | Límites de guía; no identificadores de terceros; doble revisión | **LEGAL_REVIEW — REVISE** |
| Q-VEN-ORG-001 | Bajo | Organización operativa | — | PUBLICABLE |
| Probes UNI-001..008 | UNI-007 medio (pensamientos → vida privada) | Derivación posible | Límite de guía: solo pensamiento sobre la situación laboral narrada | UNI-007 PUBLICABLE CON LÍMITE; resto PUBLICABLE |
| PROBE-UNI-004 | Medio | "¿Qué aprendiste?" puede elicitar autorrevelación personal | Uso opcional; respuesta no es evidencia; contenido sensible no conservar | **CONDITIONAL** |
| PROBE-COL-001-D | Medio | "¿Qué pasó con el equipo después?" puede arrastrar chismes/conflictos y terceros | Solo resultados operativos; no identificadores de terceros | **CONDITIONAL** |
| Probes SVC/ORG (14) | Bajo | Neutros | — | PUBLICABLE |
| Revelación involuntaria (cualquier pregunta) | Alto si se mal maneja | Contenido sensible expuesto sin base | Protocolo 6 pasos (07); no conservar contenido; solo flag | LEGAL_REVIEW (protocolo) |

## 3. Mitigaciones estructurales transversales (preservadas de A-06.3 `13-bias.md` §8)

1. Guía estructurada: mismas preguntas a todos los candidatos del mismo puesto.
2. Rúbrica por indicador (no impresión global) — anti-halo.
3. Entrenamiento de entrevistadores antes de cualquier uso.
4. Calibración periódica; anti-drift.
5. Doble revisión (reviewer distinto al entrevistador) — anti confirmation/similarity.
6. Auditoría de la guía (INTERVIEW-G7) y de sesgos del entrevistador.
7. Ambiente respetuoso — anti stereotype threat.

## 4. Sesgos de evaluador monitorizados (catálogo del registro A-06.7)

halo · similarity · confirmation · stereotype · leniency · severity · central tendency · drift. Registro de incidencias por entrevista; patrón de sesgo → recalibración obligatoria.

## 5. Regla dura

> Pregunta o probe que pueda revelar atributo protegido **sin relación laboral legítima y documentada** = **NO_PUBLICABLE**. En el banco actual de 10+26, ninguno cae en NO_PUBLICABLE; los 3 elementos en riesgo están en CONDITIONAL/LEGAL_REVIEW y **no se usan hasta dictamen**.

## 6. Preguntas de dictamen asociadas

Cuestión 14 (restricciones por puesto) y 15 (controles de no discriminación) de 19; filas DIS-01..DIS-03 de legal-opinion-request.csv.
