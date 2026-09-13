# EVALUHR — A-02.3 · PASO 9
# CONFLICTO DE EVIDENCIA EN LA CAPA DE INTERPRETACIÓN

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.2 PASO 10 (definición, protocolo, casos límite) — este PASO lo
> concreta para la capa de interpretación con los cuatro escenarios del encargo.

---

## 1. Regla central (reiterada para esta fase)

> **No promediar automáticamente. No seleccionar automáticamente "la mejor
> evidencia". No ocultar contradicciones. Enviar a revisión humana.**

Todo conflicto detectado en la capa de interpretación produce:
`CriterionResult.result = CONFLICT_OPEN` + área de revisión (PASO 11) +
bloqueo de lectura interpretativa hasta cierre humano documentado.

---

## 2. Los cuatro escenarios del encargo

### 2.1 IPIP vs. entrevista
- Forma: tendencia de rasgo (auto-reporte, tipo A) vs. comportamiento
  observado/explorado en entrevista (tipo F) sobre el mismo criterio D
  (o su contextualización).
- Naturaleza: **no es un duelo de precisiones** — son métodos distintos
  (lo que la persona auto-reporta vs. lo que el entrevistador observó).
- Tratamiento: conflicto de iguales en el protocolo (ninguna fuente "gana");
  ambos registros visibles con instrumento/versión/fecha; área de revisión;
  la revisión humana documenta la lectura (p. ej., "explorar en entrevista"
  ya fue el sentido del área; el entrevistador registra su observación).
- Prohibido: usar la entrevista para "validar/invalidar" el test por sí sola;
  usar el test para descalificar la entrevista.

### 2.2 Conocimiento vs. experiencia declarada
- Forma: resultado de prueba de conocimientos (cuando exista scoring válido,
  escenario A del PASO 5) que apunta en dirección distinta a la experiencia
  declarada (LOW, contexto) sobre criterios de la misma cadena trazable.
- Matiz estructural: la experiencia **declarada** es contexto (LIMITED); no
  es "conflicto de iguales" — el sistema reporta ambos, marca la discrepancia
  y **no construye una síntesis** ("tiene experiencia, por eso sabe") ni una
  contradicción dura ("si falló la prueba, mintió en la experiencia").
- Tratamiento: área de revisión (explorar en entrevista / verificar); ninguna
  de las dos fuentes se convierte en lectura única del criterio A.
- Si no existe scoring válido (escenarios B–E del PASO 5), no hay conflicto:
  hay INSUFFICIENT — y la experiencia declarada sigue siendo contexto.

### 2.3 Experiencia declarada vs. documentación
- Forma: declaración (DECLARED) vs. verificación documental (VERIFIED
  positiva o CONTRADICTED negativa) del mismo dato.
- Tratamiento (herencia A-02.2 PASO 10 §5): **no es conflicto de iguales** —
  la verificación prevalece como registro acreditativo; la discrepancia se
  anota y **se muestra con transparencia**: dato VERIFIED citando revisor/
  fecha/regla, declaración original visible, estado CONTRADICTED cuando la
  verificación es negativa, área de revisión forzada.
- Prohibido: "reparar" la declaración para que coincida; ocultar la
  verificación negativa; rechazo automático.

### 2.4 Instrumento vs. instrumento
- Forma: dos instrumentos que evidencian el mismo criterio con lecturas
  opuestas (p. ej., dos administraciones de conocimientos con resultados
  discrepantes, o instrumento vs. simulación futura).
- Precondición de conflicto real: **ambos registros en estado VALID** (mismo
  criterio, versiones identificadas). Si uno es INSUFFICIENT/INVALID, no hay
  conflicto — hay insuficiencia o invalidez (PASO 1).
- Tratamiento: conflicto de iguales; sin jerarquía automática entre
  instrumentos; área de revisión; revisión humana puede ordenar una
  administración nueva como proceso (decisión documentada, no automática).

---

## 3. Detección y salida (resumen operativo del protocolo A-02.2)

| Paso | Acción | Autor |
|---|---|---|
| Detección | Regla determinista sobre registros ACTIVE del mismo criterio con lecturas opuestas | Reglas versionadas (nunca IA) |
| Marcado | `conflictRef` en ambos registros; `reviewRequired=true`; `reviewStatus=PENDING` | Sistema (determinista) |
| Salida | `CONFLICT_OPEN` + "Área que requiere revisión" con ambas fuentes visibles (instrumento, versión, fecha) | Capa de interpretación |
| Revisión | Persona revisora examina, puede generar evidencia nueva (p. ej., entrevista) y **documenta una lectura** | Humano (nunca IA, AI-X7) |
| Cierre | Lectura registrada en audit trail; registros originales intactos (append-only) | Sistema + humano |

---

## 4. Prohibiciones específicas de esta capa

1. ❌ Promediar, ponderar o "fusionar" fuentes en conflicto.
2. ❌ Jerarquía automática de fuentes ("el test pesa más", "la entrevista es
   más real") — no existe regla de arbitraje validada.
3. ❌ Ocultar, minimizar o difuminar contradicciones en la salida.
4. ❌ Resolver por IA o por "criterio del sistema".
5. ❌ Que el conflicto por sí mismo degrade a la persona (los estados
   describen el proceso, no personas).
6. ❌ Cerrar el conflicto sin registro humano documentado (quién, cuándo,
   con qué lectura).
