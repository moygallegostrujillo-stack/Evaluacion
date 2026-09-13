# EVALUHR — A-02.5 · PASO 13
# PERSONALIDAD COMO CRITERIO: RIESGOS Y SALVAGUARDAS

> Documento de diseño metodológico. NO implementa nada. NO define umbrales.
> Fecha: 2026-09-09 · Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.1 PASO 4 (reglas de uso de personalidad) y PASO 11 (revisión
> humana); A-01.3 (limitaciones del IPIP); PASOS 3, 5, 11 de este dossier;
> contexto normativo mexicano (LFT: no discriminación laboral; LFPDPPP:
> datos personales) — referencias conceptuales, no asesoría jurídica.

---

## 1. El riesgo específico (mandato del encargo)

> Analizar el riesgo de **convertir rasgos psicológicos en requisitos
> laborales arbitrarios**.

Mecanismos por los que ocurre (y que A-02.5 bloquea):

| # | Mecanismo | Descripción | Contramedida estructural |
|---|---|---|---|
| R1 | **Reificación** | Tratar "extraversión" como requisito del puesto ("buscamos extrovertidos") sin función que lo justifique | PASO 5: relación solo HYPOTHESIS/EVIDENCE-SUPPORTED; PASO 1: trazabilidad a función real |
| R2 | **Perfil ideal** | Construir un "perfil psicométrico" del puesto y recortar personas contra él | Prohibición explícita (A-02.1 PASO 4; sin umbrales — regla principal del encargo) |
| R3 | **Stereotipos de rol** | Asumir rasgos por demografía o "tipo de puesto" ("vendedor = extrovertido", "mesera = amable") | PASO 1 §2 (bibliotecas prohibidas); PASO 12; salvaguarda SG-3 |
| R4 | **Impacto diferencial** | Exigir rasgos que excluyen desproporcionadamente a grupos protegidos sin necesidad funcional demostrada | Salvaguardas SG-4/SG-5; PASO 3 §4 (personalidad no CRITICAL) |
| R5 | **Deslizamiento semántico** | "Preferente" que en la práctica opera como filtro obligatorio | PASO 18 (publicación) + regla de no-filtro automático heredada |
| R6 | **Autoridad de la IA** | Sugerencias de la IA que se convierten en requisitos de facto | AI-X18/X19 (PASO 15); cero participación de IA en criterios (A-02.1) |

---

## 2. Salvaguardas obligatorias (mandato del encargo)

| # | Salvaguarda | Operacionalización en A-02.5 |
|---|---|---|
| **SG-1** | **Relación funcional** | El análisis de puesto documenta **cómo** la tendencia del rasgo se relaciona con la función concreta (ES-1); sin funcionalidad, no hay criterio D |
| **SG-2** | **Relevancia documentada** | jobRelevance con cadena R-REL-1..5 (PASO 1); la relevancia de un criterio D exige la misma disciplina que cualquier otro |
| **SG-3** | **Ausencia de estereotipos** | Revisión de redacción del criterio: prohibidos rasgos asociados a género, edad, apariencia, origen u otras condiciones protegidas; el criterio describe la función, no "el tipo de persona" |
| **SG-4** | **Ausencia de discriminación** | Ningún criterio D puede ser CRITICAL (PASO 3 §4); revisión de proporcionalidad (SG-5); ninguna salida filtra automáticamente (herencia "never auto-filter") |
| **SG-5** | **Revisión humana** | Aprobación del criterio por humano designado + revisión periódica (PASO 18); la IA excluida (AI-X18) |
| **SG-6** | **Prohibición de puntos de corte no validados** | Regla principal del encargo: sin umbrales, sin percentiles, sin "mínimos de rasgo"; la relación se documenta, no se cuantifica contra personas |

---

## 3. Reglas de redacción de criterios D (apoyo a SG-3)

1. El criterio D se formula como **"información de rasgo pertinente para
   [función]"**, nunca como "**requiere ser** [rasgo]".
   - ✅ "Explorar tendencias de sociabilidad pertinentes a la función de
     contacto con clientes (HYPOTHESIS)"
   - ❌ "Persona extrovertida y dinámica"
2. El campo `requiredOrPreferred` de un criterio D es **PREFERRED por
   defecto**; REQUIRED exige la misma cadena imposible de hoy (PASO 3 §4)
   y no existe ningún caso actual.
3. Cada criterio D declara su **grado de relación vigente**
   (HYPOTHESIS hoy) en el registro y en las matrices (PASO 17).

---

## 4. Qué sí puede hacer el sistema con criterios D (diferencia legítima)

- Mostrar tendencias descriptivas del IPIP (P8) **junto a** los criterios D
  del puesto con su etiqueta HYPOTHESIS, como **insumo de entrevista**
  (áreas ya identificadas; AI-5 asiste solo ahí).
- Registrar la relación documentada para futura validación (PASO 11 §3).

Lo que **no** puede: comparar, recortar, puntuar, rankear, decidir, ni
declarar "ajuste conductual".

---

## 5. Referencia normativa (conceptual)

- **LFT (Ley Federal del Trabajo)**: principio de no discriminación en el
  acceso al empleo; los requisitos deben relacionarse con las funciones.
  A-02.5 no realiza asesoría jurídica: documenta salvaguardas metodológicas
  que facilitan la defensa de cada criterio (funcionalidad, trazabilidad,
  proporcionalidad).
- **LFPDPPP**: los rasgos de personalidad son datos personales; su
  tratamiento se rige por el aviso vigente (que A-02.5 **no modifica**).
  La finalidad declarada (evaluación por criterios del puesto) debe seguir
  siendo proporcional (PASO 14).

Cualquier criterio D que no pueda defender su funcionalidad con el
expediente completo (PASOS 1, 5, 10) **no se publica** (PASO 18).
