# EVALUHR — A-02.4 · PASO 13
# PROPUESTA MATEMÁTICA — FÓRMULA CONCEPTUAL DEL MODELO HÍBRIDO (C)

> Documento de diseño metodológico. NO implementa nada. NO elige valores
> definitivos de pesos. **Todo valor numérico de este documento es ilustrativo
> y debe leerse como: "SOLO EJEMPLO — NO PRODUCTIVO".** Los umbrales aparecen
> como θ (SIN DEFINIR — A VALIDAR). Fecha: 2026-09-09 · Versión: 1.0 ·
> Estado: PROPUESTA DE DISEÑO.

---

## 1. Entradas (una por criterio aprobado cᵢ del puesto)

| Símbolo | Campo | Fuente |
|---|---|---|
| `cᵢ` | **Criterio** aprobado + versión | Criterion Record (A-02.1 PASO 3) |
| `Kᵢ` | **Criticidad**: CRITICAL / IMPORTANT / STANDARD | Criterion Record aprobado (PASO 3 de este dossier) |
| `sᵢ` | **Estado de evidencia**: VALID / LIMITED / INSUFFICIENT / INVALID / PENDING_REVIEW | Tabla M1–M6 (A-02.3 PASO 1) sobre el CriterionResult |
| `qᵢ` | **Calidad** de la evidencia: HIGH / MEDIUM / LOW / INSUFFICIENT | A-02.2 PASO 3/14 |
| `rᵢ` | **CriterionResult**: lectura de correspondencia descrita | A-02.3 PASO 3 |

## 2. Correspondencia por criterio (descriptor `corrᵢ`)

Definida por **reglas de lectura deterministas por categoría** (cumple la
condición previa 3 de A-02.1 PASO 9), como PROPUESTA:

- **CONOCIMIENTOS (A)**: de "aciertos X/Y" con K1–K6 y revisión: la regla de
  lectura describe la correspondencia **sin punto de corte operativo** —
  salidas: CORRESPONDE / PARCIAL / NO_CORRESPONDE / SIN_LECTURA según la
  regla aprobada del criterio (estructura; fronteras = θ, SIN DEFINIR).
- **HAB/COMP (B)**: hoy siempre SIN_LECTURA (NO_METHOD). Futuro: descriptiva
  por indicadores (A-02.3 PASO 6).
- **EXP/FORM (C)**: VERIFIED → corresponde/no corresponde según la regla
  documentada del requisito (binariedad del dato acreditado, no corte
  psicométrico); DECLARED/UNVERIFIED → sin lectura (contexto).
- **PERSONALIDAD (D)**: **no produce cumplimiento**. Participa como contexto
  descriptivo (tendencias + HDC cualitativa sin umbral) — `corrᵢ` no existe
  para D; el criterio D contribuye solo informativamente (§5).
- **INTEGRIDAD (E)**: hoy siempre SIN_LECTURA (I-INT-1).

Regla dura: ninguna regla de lectura introduce puntos de corte de
instrumento, percentiles ni "perfiles ideales" (herencia X8/X9/X5).

## 3. Contribución estructural de cada criterio (concepto, no puntaje crudo)

```
Para cada cᵢ:
  si sᵢ ≠ VALID            → cᵢ NO aporta lectura (exclusión o gate; §4)
  si sᵢ = VALID            → cᵢ aporta: (corrᵢ, Kᵢ, qᵢ)
  Contribución estructural: Wᵢ = CriticalWeight(Kᵢ) × QualityFactor(qᵢ)

  CriticalWeight(Kᵢ) — estructura (valores ilustrativos):
     CRITICAL → NO participa como peso: SU BRECHA ACTIVA GATE (no suma/resta)
     IMPORTANT → wI    (SOLO EJEMPLO — NO PRODUCTIVO: wI = 2)
     STANDARD  → wS    (SOLO EJEMPLO — NO PRODUCTIVO: wS = 1)

  QualityFactor(qᵢ) — estructura (valores ilustrativos):
     HIGH   → 1.0     (SOLO EJEMPLO — NO PRODUCTIVO)
     MEDIUM → 0.75    (SOLO EJEMPLO — NO PRODUCTIVO)
     LOW    → no contribuye como cumplimiento (solo contexto)
```

## 4. Agregación (regla de composición `𝒜`)

```
𝒜 = GATES → EXCLUSIONES → PERFILES → TOPES → NIVEL

1. GATES (PASO 6): si ∃ cᵢ con Kᵢ=CRITICAL y sᵢ≠VALID (G1/G4),
   conflicto abierto (G2) o revisión pendiente (G3) — o sin reglas
   versionadas (G6)/sin criterios (G5):
       SALIDA = "Evidencia insuficiente para determinar el nivel de ajuste."
       (resultado incompleto; FIN — no se compone nada)

2. EXCLUSIONES: todo cᵢ con sᵢ ≠ VALID queda FUERA de la composición,
   declarado con su causa ("no evaluable" / "evidencia insuficiente").
   NINGUNA exclusión aporta 0. (INSUFFICIENT ≠ 0)

3. PERFIL DE CORRESPONDENCIA del conjunto excluido lo anterior:
   P = { (cᵢ, Kᵢ, corrᵢ, qᵢ) : sᵢ = VALID }

4. TOPES (anticompensación, PASO 15):
   - ∃ cᵢ IMPORTANT con corrᵢ = NO_CORRESPONDE  → tope: nivel máximo = MEDIO
     (SOLO EJEMPLO — NO PRODUCTIVO; el tope es parámetro θ)
   - ∃ cᵢ IMPORTANT con corrᵢ = PARCIAL         → tope: nivel máximo = MEDIO
     o ALTO según regla aprobada (θ, SIN DEFINIR)
   - ∃ cᵢ STANDARD con corrᵢ = NO_CORRESPONDE   → sin tope; reduce el perfil
     (con exclusión visible y área de completación)

5. NIVEL (estructura; umbrales θ SIN DEFINIR — A VALIDAR):
   FitLevel = ALTO   si ∀ cᵢ∈P: corrᵢ = CORRESPONDE en todos los IMPORTANT,
                      y la fracción de STANDARD correspondidos ≥ θ_high,
                      y ningún tope aplica
            = BAJO   si la correspondencia agregada ponderada (Qᴾ) < θ_low
            = MEDIO  en los demás casos
   donde Qᴾ = Σ Wᵢ · Comp(corrᵢ) / Σ Wᵢ   (SOLO EJEMPLO — NO PRODUCTIVO;
   Comp(CORRESPONDE)=1, Comp(PARCIAL)=0.5, Comp(NO_CORRESPONDE)=0)
   y Qᴾ opera SOLO sobre criterios VALID — jamás incluye exclusiones como 0.

6. SALIDA: FitLevel + explicación completa (PASO 17) + exclusiones declaradas
   + áreas + métricas de completitud (PASO 16) + calificadores P6/P7.
```

## 5. Participación de categorías (condición previa 5 de A-02.1)

| Categoría | Participación en 𝒜 |
|---|---|
| A CONOCIMIENTOS | Como cumplimiento (corr) con su regla aprobada |
| B HAB/COMP | Hoy: exclusión (NO_METHOD). Futuro: descriptiva por indicadores |
| C EXP/FORM | Como cumplimiento solo con VERIFIED; declarado = contexto |
| D PERSONALIDAD | **Nunca como cumplimiento**: contexto descriptivo (tendencias/HDC) citado en la explicación; no entra en Qᴾ |
| E INTEGRIDAD | Hoy: exclusión estructural (I-INT-1). Si hay criterio E crítico → gate G1 |

## 6. Propiedades de la fórmula (auto-verificación conceptual)

1. **INSUFFICIENT nunca es 0**: las exclusiones no suman (salen del dominio
   de Qᴾ); no renormalizan en silencio — el denominador declara qué criterios
   participan (explicabilidad).
2. **Anticompensación**: un crítico sin lectura ni siquiera llega a 𝒜 (gate);
   un importante sin correspondencia acota el nivel (tope). Ningún
   "conocimiento alto + personalidad alta" produce ALTO con brechas así.
3. **Sin cortes de instrumento**: las fronteras θ son reglas de composición
   aprobadas por gobernanza sobre correspondencias descritas — no cortes
   psicométricos de instrumentos (herencia X8/X9).
4. **Determinismo y versionado**: `fitRulesVersion` registra la versión de
   reglas y parámetros; históricos no se reinterpretan.
5. **Sin decisión**: el nivel es orientativo (P6/P7); la empresa decide.

## 7. Qué falta para productivo (remite a dossier §19)

1. Valores de wI, wS, factores de calidad, Comp(PARCIAL), θ_high, θ_low y
   topes: **SIN DEFINIR — A VALIDAR** con datos reales y aprobación de
   gobernanza.
2. Reglas de correspondencia por criterio (estructura propuesta; contenido
   por criterio real).
3. Criticidad real declarada en Criterion Records reales.
4. Implementación como código versionado y auditado (otra fase, autorizada).
