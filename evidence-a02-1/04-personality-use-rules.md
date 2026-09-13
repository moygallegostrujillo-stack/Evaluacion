# EVALUHR — A-02.1 · PASO 4
# USO DEL IPIP-50-MX DENTRO DE LA METODOLOGÍA DE CRITERIOS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. El instrumento permanece congelado en v1.0
> (expediente A-01.3).
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Identidad del instrumento (fija, heredada de A-01.3)

| Campo | Valor |
|---|---|
| instrumentId | `EVALHR-PERSONALIDAD-IPIP50-MX` |
| instrumentVersion | 1.0 |
| languageVersion | ES-MX-IPIP50-RODRIGO-DE-OLIVEIRA |
| scoringVersion | IPIP50-BFM-1.0 |
| Estructura | 50 ítems · 5 factores · 10 ítems/factor · 24 inversos |
| Escala | 1–5 exactitud · rango por factor 10–50 · visual 0–100 **no percentil** |

---

## 2. Qué mide y qué NO mide (límites duros)

**IPIP-50-MX mide rasgos**: tendencias auto-reportadas en 5 factores del
modelo Big Five.

**NO mide directa ni indirectamente**:

- desempeño laboral;
- inteligencia o capacidad cognitiva;
- experiencia;
- conocimientos;
- honestidad o integridad;
- capacidad profesional;
- aptitud para contratar;
- "encaje cultural" o compatibilidad con equipos;
- motivación o interés por el puesto.

Cualquier afirmación de producto que atribuya al instrumento algo de esta
lista está prohibida (consistente con `08-permitted-use.md` de A-01.3).

---

## 3. Papel del IPIP-50-MX en la metodología de criterios

El IPIP-50-MX entra en la metodología como **fuente de información
complementaria sobre rasgos**, siempre asociada a un criterio de categoría D
(PERSONALIDAD) previamente definido y aprobado mediante la vinculación del
PASO 3.

```
CRITERIO D aprobado (requisito conductual del puesto, trazado al análisis)
        ↓ (vínculo documentado como hipótesis)
INFORMACIÓN DE RASGO (5 factores, auto-reporte, IPIP-50-MX v1.0)
        ↓
LECTURA DESCRIPTIVA (tendencias de respuesta, con disclaimer)
        ↓
REVISIÓN HUMANA (RH interpreta en contexto; nunca decisión automática)
```

---

## 4. La relación rasgo ↔ puesto es una HIPÓTESIS documentada

**Regla central de A-02.1**: la relación entre un rasgo y un requisito del
puesto debe quedar documentada como **hipótesis o criterio metodológico
sujeto a evidencia**.

Formato de registro de hipótesis de correspondencia (HDC):

| Campo | Contenido |
|---|---|
| `hdcId` | `HDC-<criterionId>-<NN>` |
| `criterionId` | Criterio D aprobado al que se ancla |
| `jobRequirement` | Elemento del registro del puesto (trazabilidad PASO 3) |
| `relatedTrait` | Factor Big Five involucrado (solo referencia al constructo, sin umbral) |
| `expectedDirection` | **Cualitativo y sin números**: qué aspecto del rasgo se considera relevante para el requisito y por qué (justificación escrita) |
| `status` | `HIPOTESIS` — por defecto y permanente hasta que exista evidencia |
| `evidenceRequiredToPromote` | Qué evidencia haría falta para convertir la hipótesis en criterio metodológico validado (estudio propio, criterio externo, etc.) — se define, no se posee |

**Reglas de la HDC**:

1. Toda HDC nace y muere como hipótesis mientras no exista evidencia formal
   aprobada por gobernanza. EvaluHR **no posee hoy** evidencia que permita
   convertir ninguna HDC en regla de decisión.
2. Prohibido derivar de una HDC fórmulas, umbrales, puntajes de corte,
   percentiles, categorías (bajo/medio/alto) o "perfil ideal".
3. Prohibido redactar HDCs "por factor" genérico ("para ventas se necesita
   extraversión alta") sin trazabilidad a un requisito concreto del registro.
4. La HDC no modifica el instrumento, su scoring ni su presentación: opera
   aguas abajo, en la capa de interpretación documentada.

**Ejemplo (ILUSTRATIVO, hipótesis sin umbral)**:

```
hdcId: HDC-CRIT-PER-001-01
criterionId: CRIT-PER-001 (EJEMPLO-ILUSTRATIVO)
jobRequirement: functions[2] — "atender mesas durante turnos completos
                manteniendo trato cortés con clientes" (ejemplo hipotético)
relatedTrait: Extraversión / Amabilidad (solo referencia constructual)
expectedDirection: "El requisito involucra interacción social prolongada;
                   se registrará qué factor se considera pertinente para
                   revisión humana. SIN dirección numérica, SIN umbral,
                   SIN recomendación derivada."
status: HIPOTESIS
evidenceRequiredToPromote: estudio propio de EvaluHR con criterio laboral
                           externo + aprobación de gobernanza (no existe hoy)
```

---

## 5. Prohibiciones explícitas de esta fase

NO establecer todavía:

- ❌ fórmulas tipo "Responsabilidad > X = recomendado";
- ❌ puntos de corte (cutoffs);
- ❌ percentiles o baremos;
- ❌ "perfil ideal" psicométrico del puesto;
- ❌ etiquetas APTO/NO APTO derivadas de rasgos;
- ❌ sustitución del criterio laboral por el Big Five ("el puesto pide
  escrupulosidad" ≠ criterio; el criterio describe el requisito del puesto,
  el rasgo es solo una fuente de información asociada por hipótesis);
- ❌ combinación del IPIP con otras pruebas en un puntaje agregado.

---

## 6. Coherencia con el expediente A-01.3

- Lenguaje permitido/prohibido: heredado íntegro de `08-permitted-use.md` de
  A-01.3. El IPIP-50-MX puede describirse como "evaluación de personalidad
  basada en el modelo Big Five", "50 ítems del IPIP", "versión mexicana
  documentada", "evidencia psicométrica publicada para una adaptación
  mexicana" — y nada más allá de eso.
- Los resultados del IPIP **no entran** en ningún puntaje global (exclusión
  documentada y verificada en A-01.2, TEST 10 + E2E); A-02.1 no cambia esto.
- La futura salida orientativa (PASO 8–10) podrá **referir** tendencias de
  rasgo como una de las evidencias revisadas, jamás convertirlas en veredicto.
