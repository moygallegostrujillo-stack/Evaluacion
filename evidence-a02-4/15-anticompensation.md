# EVALUHR — A-02.4 · PASO 15
# PRUEBA CONCEPTUAL DE ANTICOMPENSACIÓN (REGLA FORMAL)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.

---

## 1. El caso de prueba del encargo

> Un candidato obtiene: personalidad = alta · conocimiento = alto ·
> experiencia = alta — pero **criterio crítico = INSUFFICIENT**.
>
> El sistema **NO debe producir "ALTO"** sin una condición adicional.
> Documentar la regla.

---

## 2. La regla (formal)

> **REGLA DE NO-COMPENSACIÓN DE BRECHAS CRÍTICAS (anticompensación):**
>
> ```
> Sea c* un criterio con criticality(c*) = CRITICAL.
> Si state(r*) ≠ VALID   (INSUFFICIENT, INVALID)
>    ∨ estado de conflicto abierto (CONFLICT_OPEN / PENDING_REVIEW por conflicto)
>    ∨ revisión obligatoria pendiente (PENDING_REVIEW),
> entonces:
>    FitLevel NO SE PRODUCE.
>    Salida = "Evidencia insuficiente para determinar el nivel de ajuste."
>             + criterios que activan el gate + áreas + revisión humana.
> ```
>
> La condición adicional que exige el encargo es exactamente esta: **ningún
> nivel (ni siquiera para "el resto del perfil") se emite mientras exista un
> gate crítico**. No hay excepción por fortalezas en otros criterios, por
> cantidad de criterios cumplidos, ni por el promedio del conjunto.

Corolarios (igual de obligatorios):

1. **Tampoco se produce "BAJO"**: la ausencia de evidencia **no es evidencia
   negativa** (INSUFFICIENT ≠ 0). El gate no es una calificación; es la
   declaración honesta de que la medida no puede emitirse.
2. **El resto del perfil no desaparece**: los resultados de criterio sin gate
   siguen visibles (evidencia por instrumento y por criterio) — solo el
   agregado se suprime.
3. **La prohibición cubre toda vía de compensación**: promedios, renormalización,
   "bonus por fortalezas", descuento proporcional, fusión bayesiana,
   "impresión general" — ninguna operación puede salvar el gate.
4. **Con brecha IMPORTANT** (no crítica): el gate es suave — el nivel se
   produce **acotado** (tope, nunca ALTO) con la brecha visible (PASO 6 §2,
   PROPUESTA).

---

## 3. Verificación del caso de prueba paso a paso

| Paso | Con el caso del encargo |
|---|---|
| 1. Se evalúa cada criterio | personalidad: lectura descriptiva VALID (contexto D — nunca cumplimiento) · conocimiento: VALID CORRESPONDE · experiencia: VALID CORRESPONDE · criterio crítico: INSUFFICIENT |
| 2. Se evalúan los gates | G1 activo: ∃ CRITICAL con state=INSUFFICIENT |
| 3. ¿Se compone el perfil? | **NO.** El paso de agregación termina en la etapa de gates |
| 4. Salida | "Evidencia insuficiente para determinar el nivel de ajuste." + criterio crítico listado con su causa (no evaluable / evidencia insuficiente) + área RA-01 (HIGH) + bloque de revisión humana |
| 5. ¿Puede recomendar entrevista? | Sí, si hay evidencia parcial utilizable (C1–C6) — la vía humana para completar el crítico |
| 6. ¿"ALTO"? | **Imposible por construcción** — no existe camino de ejecución de 𝒜 que produzca nivel con G1 activo |

Notas del caso:
- La "personalidad alta" además no era candidato a compensación por sí sola:
  el IPIP no produce cumplimiento (A-02.3 PASO 4) — doble barrera.
- El "conocimiento alto" y la "experiencia alta" solo compensorían brechas
  COMPENSABLE/PARTIALLY — y aquí la brecha es NON-COMPENSABLE (crítica).

---

## 4. Dónde vive la regla en el modelo

1. **Gates (PASO 6)**: G1–G3 — condición previa de la agregación 𝒜 (PASO 13
   §4, paso 1).
2. **Topes (PASO 13 §4, paso 4)**: segunda barrera para IMPORTANT.
3. **Exclusiones declaradas (PASO 13 §4, paso 2)**: tercera barrera — lo
   excluido no entra como 0 y su causa es visible.
4. **Métricas (PASO 16)**: la auditoría interna puede detectar intentos de
   elusión (p. ej., nivel producido con criterios críticos no evaluados).
5. **Auditoría (PASO 20)**: verificaciones 1 y 2 ("no convierte INSUFFICIENT
   en 0", "no permite compensación indebida") y 3 ("criterios críticos
   tratados separadamente").
