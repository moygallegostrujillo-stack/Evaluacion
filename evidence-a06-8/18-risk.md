# EVALUHR — A-06.8 — 18 · Riesgos Consolidados

> Matriz de riesgos jurídicos y operativos identificados en A-06.4–A-06.8. Probabilidad (P) e
> impacto (I): ALTO/MEDIO/BAJO. Riesgo residual tras mitigación de diseño.

| # | Riesgo | Categoría | P | I | Mitigación de diseño (A-06.8) | Residual | Owner |
|---|---|---|---|---|---|---|---|
| R-01 | Renumeración de la nueva LFPDPPP 2025 sin mapeo textual; citas a ley 2010 en documentos previos | Legal-documental | ALTA | ALTO | 02: referencia analítica marcada; bloque LEGAL_REVIEW; no citar artículos nuevos sin verificación | MEDIO hasta dictamen | Legal (abogado) |
| R-02 | Incertidumbre procesal con SABG (quejas ARCO, brechas) tras extinción del INAI | Legal-procesal | MEDIA | MEDIO | 02 §2.7; matrices 13/14 con destino SABG; mecánica = LEGAL_REVIEW | BAJO-MEDIO | Legal |
| R-03 | Revelación involuntaria de datos sensibles en entrevista (M-H/V-H demostraron que ocurre) | Legal-datos | MEDIA | ALTO | Protocolo obligatorio 05 + entrenamiento M1/M3 + flag sin contenido + purge | BAJO (con entrenamiento impartido) | EvaluHR ops + cliente |
| R-04 | Uso de IA fuera de límites (inferencia/decisión) | Legal-técnico | BAJA | ALTO | Lista cerrada 07 + logs + AI_DRAFT sin efecto + sobre-alcances rechazados A-06.7 | BAJO | EvaluHR |
| R-05 | Retención "2 años" presentada como obligación legal sin fuente | Legal-documental | MEDIA | MEDIO | 10: RE-clasificada RECOMMENDED; lenguaje "política de conservación"; plazo = LEGAL_REVIEW | BAJO tras corrección de lenguaje | Legal + producto |
| R-06 | Aviso de privacidad y contrato desactualizados respecto de la entrevista | Legal-contractual | ALTA | ALTO | Matrices 13/14 con prioridad OBLIGATORIO; bloqueo de activación hasta cierre | ALTO hasta abogado | Legal + cliente |
| R-07 | Variabilidad entre entrevistadores (sesgos: halo, leniency, etc.) | Metodológico | MEDIA | MEDIO | Rúbrica v2 con anclas + calibración 7 pasos + 28 casos + entrenamiento de 8 sesgos (A-06.7) | BAJO-MEDIO; se mide en piloto | EvaluHR ops |
| R-08 | Preguntas TRV-002 usadas sin entrenamiento de revelación impartido | Legal-operativo | MEDIA | ALTO | legalStatus CONDICIONAL (03); prerequisito bloqueante en piloto (15) | BAJO con prerequisito | EvaluHR ops |
| R-09 | PROBE-COL-001-D percibido como presión (no pilotado) | Metodológico/legal | MEDIA | BAJO-MEDIO | Condición: tono entrenado + máx 1 uso + stop rule + re-piloto (04/15) | BAJO | EvaluHR ops |
| R-10 | Datos de participantes reales en piloto sin consentimiento adecuado | Legal-datos | BAJA | ALTO | 15: consentimiento reforzado; fase A internos/sintéticos; sin consecuencias; purge al cierre | BAJO | EvaluHR ops |
| R-11 | Uso indebido de resultados del piloto para contratar | Legal-operativo | BAJA | ALTO | 15 C-5: prohibición documentada; resultados marcados PILOTO/NO PRODUCTIVO | BAJO | Cliente + EvaluHR |
| R-12 | Transferencias internacionales (cloud) sin garantías específicas | Legal-datos | MEDIA | MEDIO | 13: REVISIÓN LEGAL con mecanismo según ley vigente; sub-encargados notificados | MEDIO hasta dictamen | Legal + infra |
| R-13 | Brecha de seguridad con datos de candidatos | Seguridad | BAJA | ALTO | 11: mínimo privilegio + logs; plan de seguridad + notificación (SABG) | MEDIO (plan pendiente de ejecución) | EvaluHR infra |
| R-14 | Sobreafirmación pública de validez ("válido en México") por marketing o producto | Reputacional/legal | MEDIA | ALTO | 16/17: límites explícitos; G10 NOT EVALUATED; lenguaje controlado en todo el expediente | BAJO con disciplina documental | Producto + legal |
| R-15 | Preguntas "¿por qué dejaste tu último empleo?" u otras LEGAL_REVIEW se cuelan en guías | Legal | BAJA | MEDIO | Banco A-06.5: LEGAL_REVIEW/NO_PUBLICABLE excluidos; filtro por pregunta antes de uso | BAJO | EvaluHR ops |

## Lectura

- Los 3 riesgos con mayor exposición actual: **R-06 (contrato/aviso), R-01 (mapeo nueva ley),
  R-03 (revelación involuntaria)**.
- Ningún riesgo identificado se resuelve con código: todos requieren procesos, entrenamiento,
  dictamen legal o disciplina documental.
- El bloqueo de activación (G7 + LEGAL-G8/G10) es la mitigación maestra mientras persistan
  riesgos ALTO no mitigados.
