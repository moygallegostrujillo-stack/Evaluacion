# A-06.5 — 07 · Reglas de Evidencia (PASO 7)

## 1. Estructura

Para cada pregunta definir:

- `WHAT_COUNTS_AS_EVIDENCE`: qué constituye evidencia válida.
- `WHAT_DOES_NOT_COUNT`: qué NO constituye evidencia.

## 2. WHAT_COUNTS_AS_EVIDENCE

| Tipo | Descripción | Nivel resultante |
|---|---|---|
| Acción concreta realizada por el candidato | "Me disculpé, le expliqué, le pregunté si quería pan" | LIMITED / SUPPORTED / STRONG |
| Contexto laboral específico | "Trabajaba como mesero en restaurante italiano, viernes 8pm" | Contexto (complementa Action) |
| Result verificable | "El cliente dejó propina del 15%, sin reclamo posterior" | Complementario |
| Múltiples indicadores observados | Action mapea a 3+ indicadores | SUPPORTED |
| Múltiples ejemplos consistentes | 2+ ejemplos claros con Results verificables | STRONG |

## 3. WHAT_DOES_NOT_COUNT

| Tipo | Ejemplo | Por qué NO cuenta |
|---|---|---|
| Afirmación general | "Soy excelente atendiendo clientes" | Opinión, no conducta |
| Opinión | "Creo que el servicio es importante" | Opinión, no evidencia |
| Intención hipotética | "Haría X si pasara Y" | Intención, no pasado (HYPOTHETICAL → LIMITED) |
| Supuesto | "Probablemente el cliente quería X" | Suposición, no conducta |
| Resultado externo sin Action | "Aumenté las ventas 50%" (sin describir cómo) | Result sin Action; PENDING_REVIEW |
| Equipo (no el candidato) | "El equipo resolvió el problema" | No es Action del candidato |
| Atributo protegido | "Soy joven y enérgico" | Discriminatorio; irrelevante |
| Respuesta memorizada | Texto genérico que parece ensayado | Posible faking; requiere profundización |

## 4. Ejemplo por pregunta — EJEMPLO — NO PRODUCTIVO

> **EJEMPLO — NO PRODUCTIVO**
>
> **Pregunta**: Q-SVC-001-A "Cuéntame de una vez específica en que tuviste que atender a un cliente insatisfecho..."
>
> **WHAT_COUNTS_AS_EVIDENCE**:
> - Action específica realizada por el candidato (escuchó, identificó necesidad, explicó alternativas, mantuvo conducta profesional).
> - Contexto laboral (Situation + Task).
> - Result verificable (cliente satisfecho, propina, sin reclamo, referencia confirma).
>
> **WHAT_DOES_NOT_COUNT**:
> - "Soy excelente atendiendo clientes" (afirmación general).
> - "Haría X si un cliente se enojara" (hipotético).
> - "El equipo resolvió el problema" (no es Action del candidato).
> - "Aumenté las ventas" (result sin Action).
> - Atributos protegidos (edad, género, etc.).

## 5. Regla: separar conducta de opinión

> Una respuesta que mezcla opinión + conducta se evalúa solo por la conducta. La opinión no cuenta.

**Ejemplo**:
- Candidato: "Soy muy empático (opinión). Una vez un cliente estaba triste porque era su cumpleaños y le traje un postre gratis (conducta)."
- Evaluación: la opinión se ignora; la conducta (trajo postre gratis) mapea a indicador → LIMITED (un indicador, un ejemplo).

## 6. Regla: RESULTADO POSITIVO ≠ competencia

> Un resultado positivo por sí solo NO demuestra competencia (A-06.3 `03-star.md`).

- Result sin Action específica → INSUFFICIENT o PENDING_REVIEW.
- Result + Action específica → SUPPORTED.
- Result + Action + múltiples ejemplos → STRONG.

## 7. Registro

```
InterviewEvidence {
  evidenceId: string
  questionId: string
  star: STAREvidence
  whatCounts: string[]        // elementos de evidencia identificados
  whatDoesNotCount: string[]   // elementos descartados
  evidenceLevel: 'NO_EVIDENCE' | 'INSUFFICIENT' | 'LIMITED' | 'SUPPORTED' | 'STRONG'
  rationale: string
}
```

## 8. Conexión con gates

Las reglas de evidencia pasan INTERVIEW-G4 (question quality) + INTERVIEW-G8 (human review). Sin `evidenceExpected` + `notEvidence` definidos por pregunta, la pregunta no pasa a ACTIVE.
