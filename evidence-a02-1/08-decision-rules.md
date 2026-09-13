# EVALUHR — A-02.1 · PASO 8
# REGLAS DE DECISIÓN (LO QUE EL SISTEMA PODRÁ Y NO PODRÁ PRODUCIR)

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Lo que queda PROHIBIDO crear (ahora y mientras no se autorice expresamente)

| Prohibido | Motivo |
|---|---|
| Etiquetas **APTO** / **NO APTO** | Implican veredicto de idoneidad que EvaluHR no puede emitir ni sostener con evidencia |
| **Recomendado automáticamente** (contratar/descartar) | La decisión laboral es de la empresa tras revisión humana |
| **Rechazo automático** | Prohibido por diseño de producto y por límites metodológicos |
| **Puntos de corte** | No existe evidencia para fijarlos; fijarlos sin evidencia es arbitrario y riesgoso |
| Percentiles, baremos, "perfil ideal" | Heredado de A-01.3 (no existen para ningún instrumento de EvaluHR) |
| Fórmulas de decisión ("si X > umbral entonces Y") | Sin evidencia y sin aprobación de gobernanza |

Estas prohibiciones aplican a cualquier capa futura del producto (reglas,
IA, reportes) hasta que una decisión de gobernanza documentada las modifique
con evidencia propia que lo respalde.

---

## 2. Lo que el sistema PODRÁ producir posteriormente

El sistema podrá generar, una vez implementada la capa correspondiente, una
**salida orientativa** con estas características:

1. **Basada en criterios documentados**: solo criterios aprobados (PASO 3)
   con evidencia disponible y trazable a un puesto definido (PASO 1).
2. **Descriptiva, no veredictual**: reporta correspondencia entre evidencia
   y criterios; no emite juicio sobre la persona.
3. **Orientativa por definición**: toda salida se presenta como insumo para
   revisión humana, nunca como conclusión final.
4. **Transparente y trazable**: cada elemento de la salida puede rastrearse a
   (a) criterio → (b) requisito del puesto → (c) evidencia → (d) instrumento
   con versión.
5. **Con revisión humana obligatoria aguas abajo** (PASO 11): EvaluHR genera
   evidencia técnica → RH revisa → empresa decide.
6. **Con lenguaje controlado**: solo términos del directorio permitido
   (`output-language-matrix.md`).

---

## 3. Contrato de la salida orientativa (spec conceptual, sin implementar)

```
SALIDA ORIENTATIVA = {
  contexto:        puesto + versión del registro + criterios aprobados usados
  evidencia:       lista de (criterio, instrumento+versión, resultado,
                   completitud)
  interpretación:  descripción de correspondencia con criterios,
                   en lenguaje permitido, con disclaimer
  áreas:           "Áreas que requieren revisión" (PASO 10)
  recomendación:   "Recomendación técnica: Considerar para entrevista"
                   (PASO 10) — opcional, siempre orientativa
  limitaciones:    bloque fijo de limitaciones (limitations.md)
  revisión:        registro de revisión humana pendiente/realizada
}
```

Restricciones estructurales de la salida:

- Ningún elemento de la salida puede reducirse a un único número "global"
  que decida (el futuro "nivel de ajuste" se define conceptualmente en
  PASO 9 y **no** es hoy ni un número ni una fórmula).
- La salida no compara candidatos entre sí en un ranking de "mejor persona".
- La salida completa queda registrada con versiones (instrumento, criterios,
  reglas) para auditoría posterior.

---

## 4. Puertas de control antes de cualquier capa de decisión futura

Cuando —y solo cuando— gobernanza autorice diseñar la capa de salida:

1. Criterios aprobados y vigentes para el puesto (sin criterios huérfanos).
2. Evidencia disponible para los criterios que la salida use (sin
   sustituciones entre constructos).
3. Regla de composición documentada y aprobada (hoy **no existe**).
4. Validación de lenguaje contra `output-language-matrix.md`.
5. Bloque de revisión humana integrado (no opcional).
6. Registro auditable de cada salida producida (qué reglas, qué versión).

Si alguna puerta falla → el sistema solo produce **evidencia cruda por
instrumento**, sin capa interpretativa.
