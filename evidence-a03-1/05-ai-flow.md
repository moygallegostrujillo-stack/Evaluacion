# EVALUHR — A-03.1 · PASO 5
# FLUJO DE IA: BORRADORES → REVISIÓN HUMANA → CORRECCIÓN → APROBACIÓN → PUBLICACIÓN

> Documento de diseño metodológico. NO implementa nada. NO modifica la IA
> existente. Fecha: 2026-09-10 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.3 PASO 14 (AI-2/3b/5 permitidas; AI-X1..X10); A-02.4 (AI-X11..X16);
> A-02.5 (AI-X17..X19); PASO 4 de esta fase (KI-1..KI-4).

---

## 1. Flujo definido por el encargo

```
BLUEPRINT (aprobado por humanos; la IA no participa en su creación — AI-X20)
   ↓
IA GENERA BORRADORES
   · origen marcado origin=AI_DRAFT; estado DRAFT
   · solo dentro de dominios/subdominios existentes del blueprint
   · cada borrador trae propuesta de options, correctAnswer, rationale y
     source citada del dominio — todo es PROPUESTA, nada es decisión
   ↓
REVISIÓN HUMANA (revisor con conocimiento del contenido, ≠ autor)
   · checklist KI-VAL-1..8 (PASO 7) por reactivo
   · puede: aceptar a REVIEW con correcciones / rechazar con motivo
   ↓
CORRECCIÓN
   · el autor (humano; o IA como SUGERENCIA evaluada por humanos) corrige
   · toda corrección queda en historial append-only
   ↓
APROBACIÓN (gobernanza humana; approvedBy)
   · clave validada, source citada, versión asignada
   ↓
PUBLICACIÓN (compuertas KPUB, PASO 19) → ACTIVE
```

Ninguna etapa puede saltarse: el flujo es **secuencial y obligatorio**. Un
reactivo que no recorrió todo el flujo no puede estar ACTIVE (PASO 19).

## 2. Qué NO decide la IA (encargo) — formalización

| Prohibición nueva | Contenido | Herencia |
|---|---|---|
| **AI-X20** | La IA no decide ni propone dominios, subdominios ni qué conocimiento es obligatorio — el blueprint pre-existe y la IA no lo modifica | Refuerza AI-X17/X18 (A-02.5) |
| **AI-X21** | La IA no establece la respuesta correcta de manera autónoma: su propuesta de `correctAnswer` es hipótesis de trabajo que SIEMPRE exige validación humana con la source; la clave válida nace de la revisión, no de la generación | Nueva; refuerza K-VAL-4 |
| **AI-X22** | La IA no asigna dificultad definitiva; a lo sumo sugiere dificultad provisional marcada `PROVISIONAL-SIN-EVIDENCIA`, y el estado efectivo mientras no haya evidencia es UNKNOWN (PASO 9) | Nueva |
| **AI-X23** | La IA no declara validez de contenido: KI-VAL-1..8 se evalúa y dictamina por humanos | Nueva |
| **AI-X24** | La IA no aprueba reactivos ni blueprints (`approvedBy` jamás es IA) | Refuerza AI-X18 |
| **AI-X25** | La IA no publica ni reactiva instrumentos; la publicación es acto de gobernanza humana con compuertas KPUB | Refuerza AI-X19 |

Prohibiciones heredadas que aplican con fuerza especial aquí: AI-X2 (no
inventar datos), AI-X5 (no completar huecos con supuestos), AI-X10 (no
convertir INSUFFICIENT en positivo/negativo — aplica al scoring), AI-X16 (no
generar resultados autónomos).

**Permitido a la IA (marcado y revisable, herencia AI-2/3b/5):** redactar
borradores de reactivos dentro de dominios aprobados; proponer distractores;
proponer rationale (como hipótesis); sugerir correcciones a reactivos
observados; ayudar a detectar duplicados textuales (KSEC-1) como *candidatos*
a duplicado — la decisión siempre es humana.

## 3. Puntos de control del flujo

| Control | Qué bloquea | Referencia |
|---|---|---|
| CP-1 | Borradores IA sin blueprintId/dominio válido → se descartan | K-BP-1 |
| CP-2 | Borradores que exceden la cobertura declarada del dominio → se descartan (o nuevo blueprint si se requiere cobertura extra) | K-BP-3 |
| CP-3 | Revisión sin checklist KI-VAL completo → no avanza | PASO 7 |
| CP-4 | Clave sin rationale defendible contra la source → no avanza | KI-VAL-3 |
| CP-5 | Reactivo aprobado sin `reviewedBy` ≠ autor → inválido | Separación de duties |
| CP-6 | Publicación sin compuertas KPUB-1..8 → prohibida | PASO 19 |

## 4. Registro y auditoría del flujo

Cada reactivo conserva (append-only): origen (AI_DRAFT / HUMAN), autor,
revisor(es), correcciones con motivo, aprobador, versión, estados por los que
pasó con fechas. Esto alimenta la cadena de auditoría del PASO 16 y permite
responder, para cualquier item ACTIVE: *¿quién lo escribió, quién lo revisó,
qué se corrigió, quién lo aprobó y bajo qué versión?*
