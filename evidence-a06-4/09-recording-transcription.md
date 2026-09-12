# A-06.4 — 09 · Grabación y Transcripción (PASO 9)

## 1. Regla

NO implementar grabación en V1. Esta fase solo **analiza** las modalidades y sus requisitos.

## 2. Modalidades analizadas

| Modalidad | Descripción |
|---|---|
| A. Sin grabación | El entrevistador toma notas manuales; no se registra audio/video |
| B. Transcripción | Se transcribe la respuesta (texto); no hay audio/video persistente |
| C. Grabación de audio | Se graba el audio de la entrevista |
| D. Grabación de video | Se graba audio + video del candidato |

## 3. Análisis por modalidad

### A. Sin grabación (recomendado para V1)

| Aspecto | Valor |
|---|---|
| Necesidad | BAJA — las notas del entrevistador + formato STAR son suficientes para CompetencyResult |
| Proporcionalidad | ALTA — minimiza datos (LFPDPPP Art 6) |
| Datos tratados | Notas manuales (texto) |
| Riesgos | BAJO — sin biometría, sin audio sensible |
| Consentimiento/información | Estándar (información al candidato) |
| Conservación | Notas se conservan según `10-retention.md` |
| Acceso | Solo entrevistador + reviewer + RR.HH. |
| Eliminación | Notas se eliminan al purge |
| Recomendación V1 | ✓ **RECOMENDADO** |

### B. Transcripción (texto, sin audio)

| Aspecto | Valor |
|---|---|
| Necesidad | MEDIA — facilita revisión por reviewer distinto; útil para auditoría |
| Proporcionalidad | MEDIA — más datos que notas, pero sin biometría |
| Datos tratados | Transcripción textual de la respuesta |
| Riesgos | MEDIO — transcripción puede contener datos sensibles revelados involuntariamente |
| Consentimiento/información | Informar al candidato; consentimiento expreso recomendado |
| Conservación | Transcripción se conserva según `10-retention.md` |
| Acceso | Restringido; reviewer + RR.HH. |
| Eliminación | Transcripción se elimina al purge |
| Recomendación V1 | ⚠ CONDICIONAL — solo si se justifica necesidad + consentimiento expreso |

### C. Grabación de audio

| Aspecto | Valor |
|---|---|
| Necesidad | BAJA-MEDIA — permite verbatim, pero notas suficientes |
| Proporcionalidad | BAJA — audio contiene biometría (voz) + datos sensibles potenciales |
| Datos tratados | Audio (voz del candidato = dato biométrico sensible) |
| Riesgos | ALTO — biometría (voz), datos sensibles, riesgo de filtración |
| Consentimiento/información | **Expreso y por escrito** (LFPDPPP Art 7 — datos sensibles) |
| Conservación | Plazo corto; purge post-revisión |
| Acceso | Muy restringido; solo entrevistador + reviewer autorizado |
| Eliminación | Obligatoria post-revisión (no conservar audio a largo plazo) |
| Recomendación V1 | ✗ **NO RECOMENDADO** para V1 (riesgo + proporcionalidad) |

### D. Grabación de video

| Aspecto | Valor |
|---|---|
| Necesidad | BAJA — no aporta a evaluación de competencias |
| Proporcionalidad | MUY BAJA — video contiene imagen del candidato (biometría facial) + entorno personal |
| Datos tratados | Video (imagen facial = dato biométrico altamente sensible) |
| Riesgos | MUY ALTO — biometría facial, inferencia de atributos protegidos (edad, género, discapacidad visible) |
| Consentimiento/información | **Expreso y por escrito** + justificación específica |
| Conservación | No conservar; usar solo para transcripción en tiempo real |
| Acceso | Muy restringido |
| Eliminación | Inmediata post-transcripción |
| Recomendación V1 | ✗ **PROHIBIDO** para V1 (proporcionalidad + discriminación) |

## 4. Regla de proporcionalidad

> La modalidad elegida debe ser **la menos intrusiva** que cumpla la finalidad.

Para V1, la modalidad A (sin grabación) o B (transcripción con consentimiento) son proporcionales. C y D son desproporcionadas para evaluación de competencias.

## 5. Consentimiento para grabación

Si se usa C (audio) o D (video):
- Consentimiento **expreso y por escrito** (LFPDPPP Art 7 — datos sensibles/biométricos).
- Información específica: qué se graba, por cuánto, quién accede, cuándo se elimina.
- Derecho a rehusar sin penalización (el candidato puede optar por notas manuales).

## 6. Transcripción automática (IA)

Si la IA transcribe en tiempo real:
- La transcripción (texto) se trata como modalidad B.
- El audio (si se procesa en memoria y no se persiste) reduce riesgo.
- Si el audio se persiste temporalmente para transcripción, debe eliminarse inmediatamente después.
- La IA que transcribe NO puede inferir atributos protegidos (voz, acento → origen).

## 7. Regla de no inferencia

La transcripción (manual o IA) NO debe registrar:
- Atributos protegidos revelados involuntariamente (edad, género, etc.).
- Datos personales no relevantes a la competencia.
- Inferencias de rasgos latentes (personalidad, integridad).

El transcriptor (humano o IA) filtra el contenido a formato STAR + conducta observable.

## 8. Conexión con gates

La modalidad de grabación/transcripción pasa LEGAL-G9 (Seguridad) + LEGAL-G10 (Transparencia). Sin modalidad definida + consentimiento documentado, la entrevista no se activa.
