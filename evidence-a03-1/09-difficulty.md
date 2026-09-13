# EVALUHR — A-03.1 · PASO 9
# DIFICULTAD — EASY / MEDIUM / HARD / UNKNOWN — NO SE INVENTA

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: PASO 4 (campo difficulty); PASO 5 (AI-X22); PASO 7 (KI-VAL-7).

---

## 1. Estados de dificultad (encargo)

| Estado | Definición | Requisito para usarlo |
|---|---|---|
| **EASY** | La mayoría de las personas con el dominio del scope la respondería correctamente | Evidencia administrativa documentada (posterior a publicar) **o** juicio humano registrado, marcado JUICIO-NO-EVIDENCIA |
| **MEDIUM** | Dificultad intermedia | Mismo requisito |
| **HARD** | Solo una minoría la respondería correctamente | Mismo requisito |
| **UNKNOWN** | No existe evidencia ni juicio registrado | **Estado por defecto** — honesto y admisible siempre |

## 2. Regla central del encargo

> **NO inventar dificultad. Si no existe evidencia: UNKNOWN.**

Formalización (reglas KD-1..KD-6):

1. **KD-1**: toda KnowledgeItem nace con `difficulty = UNKNOWN` por defecto.
   Crear un item con EASY/MEDIUM/HARD sin sustento registrado es una
   **invención prohibida**.
2. **KD-2**: la dificultad asignada por **juicio humano** (revisor con
   conocimiento del contenido) es admisible solo si queda registrada como
   `basis=JUICIO-NO-EVIDENCIA` con autor y fecha. Es una estimación
   declarativa del revisor — útil para documentación — y **no** es medición.
3. **KD-3**: la dificultad sugerida por IA (borradores) es a lo sumo
   `PROVISIONAL-SIN-EVIDENCIA` (AI-X22); se registra como tal y el estado
   efectivo hasta revisión humana es UNKNOWN.
4. **KD-4**: la dificultad **empírica** (futura) solo podrá derivarse de
   administraciones reales del instrumento publicado y con regla de cálculo
   versionada aprobada por gobernanza. A-03.1 **no define** esa regla ni
   ningún umbral: queda como trabajo futuro con validación específica.
5. **KD-5**: la dificultad es **metadato descriptivo del reactivo**.
   Prohibido usarla para: ponderar el score, definir cortes, ramificar
   adaptativamente, agrupar candidatos, o cualquier cálculo. El scoring de
   esta fase es "aciertos sobre items válidos" con peso uniforme (PASO 10).
6. **KD-6**: cambiar la dificultad declarada = cambio del reactivo → nueva
   `itemVersion` (KI-5, PASO 15); nunca se edita sobre administraciones ya
   hechas.

## 3. ¿Para qué sirve entonces la dificultad?

- **Diseño de cobertura**: documentar la intención del blueprint (mezclar
  contenidos básicos y avanzados según scope) — como intención declarada,
  con UNKNOWN por defecto.
- **Depuración**: si tras administraciones futuras (con regla validada) un
  item resulta trivial o indefendible para el scope, la gobernanza puede
  SUSPENDERLO/RETIRARLO con motivo (PASO 19).
- **Honestidad con el cliente**: comunicar que la dificultad declarada es
  juicio o evidencia, nunca un número implícito de "nivel del candidato".

## 4. Anti-ejemplo (prohibido)

> "Este reactivo vale más porque es HARD." ❌

No existe "valer más": los items no tienen pesos (K-BP-4, KD-5, KSC-3).
La dificultad no altera el scoring ni la interpretación. Un examen difícil
no es "mejor"; sin evidencia de dificultad, la etiqueta es solo ruido — por
eso el estado por defecto es UNKNOWN.
