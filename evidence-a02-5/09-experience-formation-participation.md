# EVALUHR — A-02.5 · PASO 9
# EXPERIENCIA Y FORMACIÓN: ESTADOS Y PARTICIPACIÓN EN EL AJUSTE

> Documento de diseño metodológico. NO implementa nada. NO define umbrales.
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.2 §3.2–3.5 y PASO 8 (evidencia de experiencia/formación);
> A-02.3 PASO 8 (4 estados con tablas de inferencia, D-EXP-1); A-02.4
> fit-state-rules.csv (efecto de LIMITED sobre el ajuste).

---

## 1. Los cuatro estados (herencia A-02.3, sin cambios)

| Estado | Definición | Permitido | Prohibido |
|---|---|---|---|
| **DECLARED** | Dato afirmado por la persona, sin verificación | Contexto descriptivo (LIMITED máx); orientar entrevista y verificación | Contar como cumplimiento; promediar; convertir en "cumple" |
| **UNVERIFIED** | Verificación requerida/iniciada y no concluida | Pendiente visible; área de revisión | Lectura alguna mientras pendiente; suponer verdad o falsedad |
| **VERIFIED** | Acreditación documental del **dato** (revisor humano, fecha, regla aplicada) | Lectura de acreditación del dato del criterio C (VALID en su tipo) | Inferir capacidad, conocimiento vigente o desempeño ("experiencia ≠ saber hacer") |
| **CONTRADICTED** | Verificación con resultado negativo | Resultado legítimo; área de revisión forzada; transparencia | Rechazo automático; "mentira probada" por el sistema; ocultar |

Regla D-EXP-1 (declaración ≠ cumplimiento) y "nunca promedio de trayectoria"
permanecen vigentes.

---

## 2. Pregunta del encargo

> ¿Cuándo cada estado puede participar en el **JobFit** (nivel de ajuste)?

| Estado | Participación en el ajuste (A-02.4) |
|---|---|
| DECLARED | **No contribuye como lectura.** Entra solo como contexto orientativo (LIMITED → contexto, nunca cumplimiento — fit-state-rules). No dispara gates por sí solo, pero tampoco suma. |
| UNVERIFIED | **No contribuye.** Visible como pendiente; alimenta área de revisión (T3). Si el criterio es CRITICAL, la verificación incompleta impide lectura utilizable → hard gate. |
| VERIFIED | **Único estado que puede sostener lectura utilizable de criterios C** (acreditación del dato). Contribuye al ajuste solo dentro de las inferencias permitidas de la categoría C (el dato acreditado, jamás "capacidad"). |
| CONTRADICTED | **No contribuye como lectura positiva.** Genera área de revisión forzada (PENDING_REVIEW); si el criterio es CRITICAL → hard gate hasta cierre humano documentado. Nunca baja el ajuste "en automático" (la contradicción es dato de proceso, no puntaje). |

---

## 3. Condiciones para que VERIFIED sostenga lectura de criterio C

| # | Condición |
|---|---|
| C-EXP-1 | El criterio C declara **cómo se verifica** (regla de verificación definida al aprobar el criterio — herencia A-02.1: "REQUIRED solo si la empresa puede verificarlo") |
| C-EXP-2 | La acreditación cita la fuente documental (documento, referencia, registro) con fecha y revisor humano |
| C-EXP-3 | La regla aplicada está versionada (mismo requisito verificado igual para todos) |
| C-EXP-4 | La lectura resultante se enuncia como acreditación del dato ("cuenta con X acreditado"), no como aptitud ni conocimiento vigente |

Sin C-EXP-1..4, el dato queda DECLARED (contexto) aunque la empresa "confíe".

---

## 4. Formación (mismo régimen)

- Cursos/títulos ≠ evidencia de conocimiento (herencia A-02.2 §3.2–3.5): un
  curso acreditado verifica el **hecho formativo**, no el saber actual ni la
  habilidad. Si el puesto exige el saber, se evalúa con la vía de
  conocimientos (PASO 6); si exige el hecho formativo, es criterio C.
- Formación DECLARED = contexto; VERIFIED (certificado revisado) = dato
  acreditado; CONTRADICTED = área forzada. Idéntico al régimen de
  experiencia.

---

## 5. Prohibiciones específicas

1. ❌ Tratar DECLARED como VERIFIED (o como cumplimiento).
2. ❌ Verificaciones "informales" sin regla versionada (C-EXP-3) que
   convierten declaraciones en lecturas.
3. ❌ Sumar años de experiencia como puntaje (no promediar, no sumar
   trayectoria; el criterio C es de acreditación, no de conteo, salvo que el
   criterio mismo defina explícitamente el dato escalonado a verificar).
4. ❌ Usar CONTRADICTED como causa de rechazo automático o como punto
   negativo en cualquier agregado.
5. ❌ Inferir integridad (categoría E) desde contradicciones de experiencia:
   la discrepancia es dato de proceso para revisión humana, no diagnóstico
   de honestidad.
