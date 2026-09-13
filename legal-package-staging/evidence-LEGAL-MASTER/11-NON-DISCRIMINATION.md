# EVALUHR — LEGAL MASTER PACKAGE · 11 · NON-DISCRIMINATION (PASO 15)

## 1. Auditoría por superficie (verificada en repo + diseño A-06)

| Superficie | Hallazgo | Riesgo | Mitigación existente | Acción |
|---|---|---|---|---|
| Preguntas de evaluación | Banco de evaluación: ítems de comportamiento/trabajo; sin preguntas sobre atributos protegidos (0 campos de salud/religión/etc.) | Bajo | Diseño de ítems; sanitización | Mantener |
| **candidateAge** | Edad recolectada en canal público (`VacancyApplication.candidateAge`) | **MEDIO-ALTO** | Ninguna identificada | Justificar finalidad por puesto o eliminar (LEGAL_REVIEW) |
| Criterios/competencias | Catálogo DRAFT (12 competencias), 0 en producto | Bajo hoy | Gates COMP antes de activar | Mantener gates |
| Entrevista | BDI/STAR DRAFT; banco 10 preguntas / 26 probes con 3 REVISE y 2 CONDITIONAL (evidence-a06-11/03-04); G7 NO APPROVED | Bajo hoy (no activa) | Rúbrica por indicador; doble revisión; guía estructurada | Dictamen antes de activar |
| Datos | `candidateAge` = único campo protegido | Medio | — | Ídem |
| IA | Genera preguntas; prohibido inferir atributos/personalidad/integridad (catálogo cerrado) | Bajo | Catálogo en diseño (12) + AI_DRAFT sin autoridad | Anexo contractual |
| Resultados | overallScore excluye Big Five e Integridad (razones `NOT_APPROVED` registradas); recommendation = orientación de completitud | Bajo | Disclaimers UI; "never auto-filter" | Mantener lenguaje |
| Entrevistador (futuro) | Sesgos: halo, similarity, confirmation, stereotype, leniency, severity, central tendency, drift | Medio futuro | Entrenamiento/calibración definidos en diseño A-06 | Piloto antes de activar |

## 2. Atributos protegidos (base vigente)

CPEUM art. 1 (origen étnico/nacional, género, edades, discapacidades, condición social, condiciones de salud, religión, opiniones, preferencias sexuales, estado civil o cualquier otra); LFPED (reforma 14-nov-2025, catálogo ampliado — incl. apariencia física); LFT (nueva, DOF 15-ene-2026 — cotejar articulado).

## 3. NON-DISCRIMINATION POLICY — BORRADOR (para adopción por EvaluHR y sus clientes)

1. Ninguna herramienta de EvaluHR pregunta, infiere ni puntúa atributos protegidos.
2. La edad solo se trata si el puesto la exige con justificación documentada — por dictamen; por defecto: no recolectar.
3. Los resultados son orientativos; **ningún score ni etiqueta produce un filtro, veto o descalificación automática** (códigos "never auto-filter / never as disqualification" en el motor).
4. La entrevista estructurada usa preguntas iguales para candidatos del mismo puesto y rúbrica por indicador.
5. La IA no infiere atributos protegidos ni produce vetos.
6. Revelaciones involuntarias de contenido sensible: protocolo de 6 pasos, no conservar contenido.
7. Incidencias de discriminación percibida se registran y escalan al responsable.
8. La política se anexa al contrato maestro (08) y se refleja en el aviso (06).

## 4. Conexión con dictamen

Preguntas 14–15 del marco (28) y filas DIS-01..03 de `legal-question-matrix.csv`. BFOQ: como excepción jurídica exclusiva — ver `evidence-a06-11/16-bfoq.md` (protocolo 7 pasos, ninguna aplicación activa).
