# EVALUHR — A-03.1 · PASO 13
# RELACIÓN CON CRITERIOS DEL PUESTO — KnowledgeRequirement → KnowledgeItem → KnowledgeResult → CriterionResult

> Documento de diseño metodológico. NO implementa nada. **NO convierte
> conocimiento en JobFit.** Fecha: 2026-09-10 · Versión: 1.0 · Estado:
> PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 3 (job↔criterion linkage); A-02.3 PASO 2/3
> (InstrumentResult ≠ JobFit; CriterionResult); A-02.5 PASO 4 (mapeo
> instrumento↔criterio, fuerza LIMITED hoy) y PASO 15 (gobernanza).

---

## 1. La cadena de correspondencia (encargo)

```
KnowledgeRequirement  (requisito de conocimiento con knowledgeRelevance=VALID;
                       fuente KF1–KF7; R-KREL-1..5)              [PASO 2]
        │  cubre
        ▼
KnowledgeBlueprint.domain/subdomain  (mapa aprobado, versionado)  [PASO 3]
        │  define cobertura
        ▼
KnowledgeItem  (reactivo vinculado al dominio; validado; versionado) [PASO 4/7]
        │  administrado
        ▼
KnowledgeResult  (administración individual; estados A–E; X/Y o null) [PASO 11]
        │  correspondencia reglada (solo si toda la cadena es válida)
        ▼
CriterionResult  (criterio de categoría A: "dominio declarativo del
                  contenido definido" — lectura descriptiva)
```

Regla clave: la cadena **no es automática** — cada flecha exige condiciones
documentadas (abajo). Un KnowledgeItem huérfano (sin dominio), un dominio sin
requisito VALID, o un instrumento sin K-VAL **cortan la cadena**: no hay
lectura del criterio.

## 2. Condiciones para que un KnowledgeResult alimente un CriterionResult

| # | Condición | Herencia |
|---|---|---|
| KC-1 | El criterio es de **categoría A (conocimientos)** y tiene `jobRelevance = VALID` (R-REL-1..5 completas) | A-02.1/A-02.5 |
| KC-2 | El blueprint del instrumento **cubre el contenido definido por el criterio** (trazabilidad dominio→criterio citada en el expediente) | K-VAL-1/2 |
| KC-3 | El **instrumento-version** con que se administró cumple K-VAL-1..8 | A-02.5 PASO 6 |
| KC-4 | La administración individual cae en escenario **A** (o LIMITED según PASO 12) — K1–K6 completos | A-02.3 |
| KC-5 | La correspondencia está **registrada en gobernanza** (criterionId ↔ blueprintId, con rationale/source/approvedBy/version — campos mínimos de A-02.5) | A-02.5 PASO 15 |
| KC-6 | Resultado sin conflicto abierto (PENDING_REVIEW bloquea la lectura hasta cierre documentado) | A-02.3 PASO 9 |

Sin KC-1..KC-6: el KnowledgeResult queda como evidencia disponible cruda;
el criterio sale "sin lectura" / INSUFFICIENT con causa — **sin excepciones**.

## 3. Qué puede y no puede concluirse (coherencia con A-02.3 PASO 3)

**Puede (lectura descriptiva, categoría A):** que la persona respondió
correctamente X de Y reactivos sobre el contenido definido del criterio —
dominio declarativo del contenido, con versión y revisión.

**No puede (prohibiciones vigentes):**

- ✗ Convertirse en lectura de competencias/habilidades (categoría B) —
  "saber el protocolo" no es "aplicarlo bajo presión".
- ✗ Alimentar criterios D (personalidad) — el IPIP es su única fuente
  admisible, y solo vía matriz A-02.5.
- ✗ Alimentar criterios E (integridad) — I-INT-1.
- ✗ Usarse como sustituto de verificación de experiencia (categoría C) —
  D-EXP-1.
- ✗ **Convertirse en JobFit por sí mismo** — el ajuste es un diseño futuro
  (A-02.4, Modelo C) que consume **CriterionResults** por reglas versionadas;
  no existe implementación y A-03.1 no crea ninguna.

## 4. Fuerza de relación (estado honesto)

A-02.5 PASO 4/11 fijó: instrumento de conocimientos → criterios A con fuerza
**LIMITED como máximo hoy** (K-INS-1: sin clave persistida en puestos
generados; sin blueprint). A-03.1 no cambia ese dictamen: si el modelo de
esta fase se aprueba, se implementa, y K-VAL se cumple, la fuerza podría
re-evaluarse hacia MODERATE (content validity documentada: blueprint
trazable + claves validadas + revisión). **Hoy: LIMITED.** Ninguna fuerza la
asigna IA (AI-X17).

## 5. Nota anti-salto (regla final del encargo)

> **NO convertir todavía conocimiento en JobFit.**

No se define ninguna fórmula, peso, gate ni compensación específica para
conocimientos en A-03.1. El modelo de gates/compensabilidad de A-02.4
recibirá los CriterionResults cuando esa fase se opere; aquí solo se garantiza
que el insumo (CriterionResult alimentado por KnowledgeResult) exista bajo
condiciones auditablemente válidas.
