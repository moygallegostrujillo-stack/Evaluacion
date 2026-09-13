# A-06.4 — 15 · Gobernanza del Entrevistador (PASO 15)

## 1. Riesgos del entrevistador

| Riesgo | Descripción |
|---|---|
| Improvisación | El entrevistador hace preguntas no aprobadas (fuera de guía) |
| Preguntas fuera de guía | Desviación del script; puede elicitar atributos protegidos |
| Sesgo | Halo, similaridad, confirmación, drift (ver A-06.3 `13-bias.md`) |
| Comentarios personales | Opiniones del entrevistador que pueden influir o sesgar |
| Captura de información irrelevante | Registrar datos no pertinentes (e.g. apariencia, atributos protegidos) |
| Trato desigual | Diferente tono, duración, o profundidad según el candidato |
| Inferencias | Atribuir al candidato características no evidentes (e.g. "parece perezoso") |

## 2. Controles

### 2.1 Guía aprobada

- La guía de entrevista (InterviewGuide) está pre-aprobada (status APPROVED).
- Contiene solo preguntas PUBLICABLE (pasaron `13-discrimination.md`).
- El entrevistador **debe** usar la guía; no improvisar.

### 2.2 Preguntas aprobadas

- Solo preguntas con status ACTIVE (pasaron INT-G3 + LEGAL-G5).
- El entrevistador no puede añadir preguntas no aprobadas.

### 2.3 Probes aprobados

- Solo probes del banco aprobado (pasaron INT-G4 + LEGAL-G5).
- El entrevistador no improvisa probes.

### 2.4 Capacitación

- El entrevistador debe completar entrenamiento antes de conducir entrevistas productivas.
- El entrenamiento cubre: estructura BDI/STAR, uso de rúbrica, sesgos, no discriminación, privacidad.
- Competencia del entrevistador se evalúa en pilotaje (INT-G9).

### 2.5 Auditoría

- Las entrevistas se auditan periódicamente (muestra aleatoria).
- Auditoría verifica: uso de guía, no preguntas prohibidas, captura proporcional, asignación consistente.
- Violaciones se documentan; medidas correctivas.

### 2.6 Revisión

- Un reviewer distinto al entrevistador revisa la evidencia (cuando posible).
- La revisión es append-only (no modifica la evidencia original).
- El reviewer asigna el `evidenceLevel` final.

## 3. Obligaciones del entrevistador

1. **Usar la guía aprobada** — no improvisar preguntas.
2. **No preguntar atributos protegidos** — si el candidato los revela, no profundizar; no registrar.
3. **Mantener trato igualitario** — mismo tono, duración, profundidad para todos los candidatos del puesto.
4. **Capturar solo conducta observable** — formato STAR; no inferencias; no comentarios personales.
5. **Respetar el "no puedo recordar"** — no presionar; registrar INSUFFICIENT si aplica.
6. **Mantener confidencialidad** — no compartir fuera del proceso.
7. **Reportar violaciones** — si nota que otro entrevistador violó la guía, reportar.

## 4. Prohibiciones del entrevistador

| Prohibición | Razón |
|---|---|
| Hacer preguntas no aprobadas | Violación de guía; puede ser discriminatoria |
| Preguntar atributos protegidos | LFT Art 3; LFPEPD |
| Hacer comentarios personales sobre el candidato | Sesgo; irrelevante |
| Capturar apariencia física o atributos protegidos | Discriminación; LFPDPPP |
| Inferir rasgos latentes (personalidad, integridad) | No autorizado; Personality retirada; Integrity aislada |
| Compartir evidencia fuera del proceso | Violación de confidencialidad |
| Dejar que la IA decida el nivel | Decisión humana obligatoria |

## 5. Sanciones

Las violaciones de guía se documentan y pueden resultar en:
- Reentrenamiento.
- Suspensión de la función de entrevistador.
- Medidas disciplinarias según la política de la empresa.

## 6. Conexión con gates

La gobernanza del entrevistador pasa INT-G9 (Pilot — calibración de entrevistadores) + LEGAL-G7 (revisión humana). Sin entrevistadores entrenados + auditoría, la entrevista no se activa.
