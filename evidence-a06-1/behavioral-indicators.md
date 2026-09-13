# A-06.1 — Behavioral Indicators (PASO 4)

## 1. Regla

Una competencia debe traducirse en **indicadores observables**. Un indicador no es un rasgo latente ni una inferencia; es una conducta específica que un evaluador puede presenciar y documentar.

## 2. Qué NO es un indicador

| Tipo | Ejemplo | Por qué NO |
|---|---|---|
| Rasgo latente | "Es empático" | Inferencia, no observable |
| Juicio global | "Es bueno atendiendo clientes" | Vago, no accionable |
| Score | "Puntuó 85 en servicio" | Output de un instrumento, no conducta |
| Adjetivo | "Proactivo" | Etiqueta, no conducta |
| Actitud | "Le gusta ayudar" | Estado interno, no conducta |

## 3. Qué SÍ es un indicador

Un indicador es una **acción observable** en una situación de trabajo, descrita en presente, con verbo activo, que un tercero puede presenciar.

### EJEMPLO — NO PRODUCTIVO

> **Competencia: "Servicio al cliente"**
>
> Indicadores conductuales:
> - escucha activamente las solicitudes del cliente antes de responder;
> - identifica la necesidad subyacente formulando preguntas de clarificación;
> - explica alternativas o soluciones de forma comprensible;
> - mantiene una conducta profesional bajo presión o reclamo;
> - hace seguimiento posterior para confirmar que la necesidad fue resuelta.

### EJEMPLO — NO PRODUCTIVO

> **Competencia: "Trabajo en equipo"**
>
> Indicadores conductuales:
> - comparte información relevante con los compañeros sin que se la pidan;
> - reconoce públicamente las contribuciones de otros;
> - expone desacuerdos de manera respetuosa y orientada al problema;
> - asiste a un compañero sobrecargado cuando su propia carga lo permite;
> - integra sugerencias de otros en su propio plan de acción.

**Nota**: estos ejemplos están marcados `EJEMPLO — NO PRODUCTIVO` hasta aprobación formal por un revisor humano. No deben usarse en producción hasta pasar COMP-G3 (behavioral indicators).

## 4. Estructura de un indicador

```
BehavioralIndicator {
  indicatorId: string
  competencyId: string          // FK a Competency
  text: string                 // conducta observable, verbo presente
  level: string?               // opcional: nivel esperado (NO scoring — solo clasificación cualitativa)
  evidenceType: 'INTERVIEW' | 'OBSERVATION' | 'WORK_SAMPLE' | 'SJT' | 'DOCUMENT'
  status: DRAFT | REVIEW | APPROVED | RETIRED
  approvedBy: string?          // humano
}
```

**Sin scoring**: no hay 0-100, ni pesos, ni cortes. El `level` opcional es solo una etiqueta cualitativa (e.g. "básico"/"avanzado") para ordenar la progresión conductual — NO se convierte en número.

## 5. Reglas de redacción

1. **Verbo en presente** (escucha, identifica, explica — no "debería escuchar").
2. **Contexto laboral** específico (no genérico).
3. **Observable** por un tercero (no "piensa en").
4. **Una conducta por indicador** (no agrupar múltiples acciones).
5. **Neutral** (no valorativo: "explica" no "explica bien").
6. **Culturalmente apropiado** para el contexto laboral mexicano.

## 6. Papel de la IA en indicadores (PASO 8)

La IA puede:
- **sugerir** borradores de indicadores a partir de la definición de la competencia;
- **adaptar** el lenguaje al contexto del puesto;
- **parafrasear** indicadores existentes para claridad.

La IA **NO** puede:
- **aprobar** un indicador como productivo;
- **decidir** que un indicador es correcto;
- **crear** evidencia de que el candidato posee la competencia;
- **asignar nivel** al candidato.

Toda salida de IA = `AI_DRAFT_ORIGIN` + `human reviewed` (el `status` solo pasa a APPROVED tras revisión humana).

## 7. Validación de indicadores

Antes de pasar a APPROVED, un indicador debe:
- ser revisado por un profesional de RR.HH. (reviewedBy);
- ser probado en una guía de entrevista piloto (COMP-G9 pilot);
- demostrar que los evaluadores pueden observar la conducta y documentarla;
- pasar COMP-G3 (behavioral indicators gate).

## 8. Conexión con evidencia

Un indicador no produce por sí mismo un score. Produce **evidencia contextual** que el evaluador humano interpreta. La evidencia se registra con su nivel (VALID/LIMITED/INSUFFICIENT/PENDING_REVIEW/INVALID — ver `evidence-model.md`) y el evaluador determina si la competencia está `NO_EVIDENCE/INSUFFICIENT/LIMITED/SUPPORTED/STRONG` (ver `conflict-rules.md`).
