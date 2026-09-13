# EVALUHR — A-02.4 · PASO 11
# CONFLICTOS EN EL NIVEL DE AJUSTE (INTEGRACIÓN DEL PROTOCOLO A-02.3)

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-09 ·
> Versión: 1.0 · Estado: PROPUESTA DE DISEÑO.
> Base: A-02.3 PASO 9 (4 escenarios + protocolo) — aquí se define su efecto
> sobre el ajuste.

---

## 1. Regla central

> Si existe conflicto de evidencia — **IPIP ≠ entrevista**, **experiencia
> declarada ≠ documentación**, **instrumento A ≠ instrumento B** — sobre un
> criterio: **NO se resuelve matemáticamente** (ni promedio, ni fusión, ni
> "evidencia ganadora", ni ponderación por confianza). El criterio entra en
> **PENDING_REVIEW** y su efecto en el ajuste se rige por criticidad
> (PASO 6).

La composición del ajuste **no tiene ningún mecanismo de resolución de
conflictos**: no existe tal operación en el modelo.

---

## 2. Efecto por criticidad

| Conflicto sobre… | Efecto en el nivel de ajuste |
|---|---|
| Criterio **CRITICAL** | **Hard gate (G2)**: no se produce nivel; resultado incompleto con el conflicto listado y sus dos fuentes visibles |
| Criterio **IMPORTANT** | El criterio no contribuye hasta cierre; **soft gate**: nivel acotado (nunca ALTO) + conflicto visible (PROPUESTA) |
| Criterio **STANDARD** | El criterio queda excluido temporalmente; el ajuste se produce con la exclusión declarada y el conflicto visible como área abierta |

En los tres casos: la salida muestra **ambas fuentes** (instrumento, versión,
fecha, estado), el `areaId` del área de revisión (RA-10 de A-02.3) y el
estado PENDING_REVIEW. Nada se difumina en el agregado.

---

## 3. Prohibiciones (reiteradas para esta capa)

1. ❌ Promediar evidencias en conflicto (ni explícita ni implícitamente
   dentro del agregador).
2. ❌ Seleccionar automáticamente "la mejor evidencia" (sin jerarquía entre
   fuentes).
3. ❌ Ocultar la contradicción detrás del nivel ("el MEDIO ya la absorbe" —
   falso: el criterio en conflicto no contribuye).
4. ❌ Cerrar el conflicto sin revisión humana documentada (A-02.3 PASO 13).
5. ❌ Que la IA opine sobre el conflicto o lo resuelva (AI-X7).
6. ❌ Continuar produciendo el nivel con un conflicto crítico abierto.

---

## 4. Cierre del conflicto y recomposición

1. El conflicto se cierra **solo** por revisión humana documentada
   (AssessmentReview: quién, cuándo, lectura, base) — con posible evidencia
   nueva (entrevista, verificación).
2. Cerrado el conflicto, el criterio recupera su estado según sus registros
   (VALID u otro) y la próxima consolidación recomputa el ajuste **con la
   versión de reglas vigente** — sin reinterpretar consolidaciones históricas
   (append-only; herencia versionado).
3. Si la revisión concluye que una de las fuentes era inválida → invalidación
   documentada por gobernanza (A-02.2 PASO 16), nunca "corrección" silenciosa.
