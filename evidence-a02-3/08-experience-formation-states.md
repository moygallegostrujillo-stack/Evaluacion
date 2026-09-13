# EVALUHR — A-02.3 · PASO 8
# EXPERIENCIA Y FORMACIÓN — ESTADOS DECLARATIVOS E INFERENCIAS PERMITIDAS

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad. **No se implementa nada en A-02.3.**
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA
> Base: A-02.2 PASO 8 (declarado vs. verificado, regla D-EXP-1), matriz de
> calidad A-02.2 PASO 14 (tipos D/E), PASO 1 de este dossier (estados).

---

## 1. Cuatro estados para experiencia y formación

> A-02.2 estableció la separación estricta **declarado vs. verificado**
> (D-EXP-1: nunca "declaración verificada por el candidato"). A-02.3 la
> convierte en **cuatro estados de interpretación** para las salidas.

| Estado | Definición | Registro típico (A-02.2) | Estado de evidencia (PASO 1) |
|---|---|---|---|
| **DECLARED** | La persona declaró el dato y fue capturado como declaración estructurada (puesto, periodo, funciones / nivel, certificación, curso). No se ha sometido a verificación ni se exige aún. | `source=CANDIDATE_DECLARATION`, `unit=DECLARATIVE`, quality LOW máx | LIMITED (contexto) |
| **UNVERIFIED** | Existe una declaración cuya verificación fue **requerida o iniciada** (p. ej., documento solicitado, proceso de verificación en curso) y **aún no concluye**. | Registro declarativo + pendiente documental; `reviewStatus=PENDING` cuando la revisión está en curso | PENDING_REVIEW (si revisión iniciada) / LIMITED |
| **VERIFIED** | Verificación documental **positiva** completada: documento/acto identificado, revisor humano, fecha, regla de decisión documentada, resultado `BOOLEAN_VERIFIED=true`. | `source=DOCUMENT_VERIFICATION`, `unit=BOOLEAN_VERIFIED`, quality MEDIUM–HIGH | VALID (acreditación documental del dato) |
| **CONTRADICTED** | La verificación resultó **negativa** (`false`) o la documentación **contradice** la declaración (periodo, nivel, emisor, vigencia no coinciden). Resultado legítimo, no censura técnica. | `source=DOCUMENT_VERIFICATION`, `unit=BOOLEAN_VERIFIED=false`, o discrepancia registrada | VALID (como verificación negativa) + área de revisión obligatoria |

Reglas de asignación:

1. Los cuatro estados son **mutuamente excluyentes por dato** (un dato de
   trayectoria está en uno solo).
2. `DECLARED` y `UNVERIFIED` nunca producen lectura de cumplimiento.
3. `VERIFIED` acredita **el dato** (que el documento existe, es legible,
   vigente y corresponde) — **no** acredita capacidad, desempeño ni
   conocimiento vigente (eso sería categoría A/B con sus propios métodos).
4. `CONTRADICTED` no descarta automáticamente a la persona (prohibición de
   rechazo automático, A-02.1 PASO 8): genera área de revisión y se resuelve
   por vías humanas documentadas (aclaración, nueva documentación, entrevista).

---

## 2. Qué tipo de inferencia permite cada estado

| Estado | Inferencia PERMITIDA | Inferencia PROHIBIDA |
|---|---|---|
| **DECLARED** | Contexto orientativo de trayectoria ("declara 3 años en puesto similar"); insumo para guiar verificación y entrevista | Asumir cumplimiento del requisito; usar como lectura del criterio; convertir años en capacidad; "verificado por el candidato" (D-EXP-1) |
| **UNVERIFIED** | Informar "pendiente de verificación"; motivar área de revisión/completación | Tratar como cumplido por defecto; trazar como incumplimiento por demora; ocultar el pendiente |
| **VERIFIED** | Acreditación documental del dato ("certificación vigente verificada por revisor X en fecha Y según regla Z") | Inferir competencia/conocimiento vigente del dato acreditado; usar la acreditación como score |
| **CONTRADICTED** | Registrar la discrepancia como resultado legítimo; contrastar con la persona por vías humanas; area de revisión | Rechazo automático; tratar la contradicción como "mentira probada" (eso es una lectura humana, no del sistema); ocultar la verificación negativa |

---

## 3. Reglas de salida

1. Toda salida de criterio C distingue **por dato** su estado (no un promedio
   de la trayectoria: los datos se muestran uno a uno con su estado).
2. `DECLARED`/`UNVERIFIED` aparecen como **contexto** (LIMITED) o como áreas
   de revisión — con lenguaje permitido ("evidencia declarada no verificada").
3. `VERIFIED` permite la lectura "acreditación documental del requisito"
   (fase futura con revisión humana, herencia matriz A-02.2).
4. `CONTRADICTED` genera **área de revisión obligatoria** (PASO 11,
   `RA-09`) — nunca un veredicto del sistema.
5. La verificación negativa no se "repara" en silencio: si la persona aporta
   nueva documentación, se registra una verificación nueva (append-only); la
   anterior permanece.

---

## 4. Relación con estados de evidencia (PASO 1)

```
DECLARED      → LIMITED (contexto; jamás lectura)
UNVERIFIED    → LIMITED o PENDING_REVIEW (según haya proceso de verificación abierto)
VERIFIED      → VALID (lectura = acreditación documental del dato)
CONTRADICTED  → VALID como verificación negativa + área de revisión forzada
                (la discrepancia es información, no un 0 ni un descarte)
```

Ambigüedad resuelta por regla: si una misma experiencia tiene declaración y
verificación positiva, el dato se reporta VERIFIED citando ambos registros;
si la verificación contradice, se reporta CONTRADICTED con ambos visibles
(transparencia hacia la persona revisora; herencia A-02.2 PASO 10 §5).
