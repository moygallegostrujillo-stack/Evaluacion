# EVALUHR — A-03.1 · PASO 16
# AUDITORÍA Y TRAZABILIDAD — CADENA COMPLETA DEL INSTRUMENTO

> Documento de diseño metodológico. NO implementa nada. Fecha: 2026-09-10 ·
> Versión: 1.0 · Estado: PROPUESTA METODOLÓGICA.
> Base: A-02.3 PASO 15 (cadena de 10 eslabones PUESTO→…→DECISIÓN DEL CLIENTE,
> versiones en todo eslabón); A-02.2 PASO 13 (audit trail append-only).

---

## 1. Cadena de trazabilidad del encargo (11 eslabones)

```
job                puesto vigente (jobId) — fuente de todos los eslabones
  → blueprint      KnowledgeBlueprint (blueprintId, blueprintVersion)
     → item        KnowledgeItem (itemId, itemVersion)
        → source   documento/función citada con versión (KF1–KF7)
           → correctAnswer   clave validada + rationale (versión de la clave)
              → reviewer     reviewedBy humano ≠ autor (+ fecha)
                 → version   las 4 versiones del PASO 15
                    → administration   administración (id, fecha, set exacto)
                       → response      respuestas del candidato (set ligado)
                          → score      cálculo con scoringVersion
                             → result  KnowledgeResult (status, reasonCode)
```

Cada eslabón conoce al siguiente y al anterior **con su identificador y
versión** (bidireccional, herencia A-02.3 PASO 15). La cadena del instrumento
se engancha a la cadena macro del sistema: `job → … → result → EvidenceRecord
→ CriterionResult → … → DECISIÓN DEL CLIENTE` (10 eslabones de A-02.3).

## 2. Qué debe poder responderse (pruebas de auditoría)

Para cualquier KnowledgeResult almacenado:

1. ¿De qué puesto y blueprint (versión) proviene?
2. ¿Qué items exactos (ids + versiones) se administraron y cuáles eran
   puntuables?
3. ¿De qué documento/fuente con versión salió cada contenido y cada clave?
4. ¿Quién escribió, quién revisó y quién aprobó cada item?
5. ¿Qué versión de scoring produjo el número y es reproducible hoy con esas
   versiones (KSC-1)?
6. Si el status es INSUFFICIENT/INVALID/PENDING_REVIEW: ¿cuál es la causa
   documentada y quién la registró?
7. ¿Qué transiciones de estados vivió cada item y quién las autorizó?

Si alguna pregunta no puede responderse ⇒ **anomalía de auditoría**: el
resultado afectado no puede tratarse como evidencia válida (caída a
INSUFFICIENT con causa) y el hueco se reporta a gobernanza.

## 3. Reglas de registro (KAUD-1..KAUD-6)

1. **KAUD-1**: todo evento (creación, corrección, transición de estado,
   administración, calificación, invalidación) se registra con actor, fecha
   y motivo — append-only; prohibida la edición y el borrado.
2. **KAUD-2**: las versiones se registran **al momento del evento**, no
   reconstruidas después (KVER-5).
3. **KAUD-3**: los actos de gobernanza (aprobación, publicación, suspensión,
   retiro) llevan identificación del responsable humano (AI-X24/X25: jamás
   IA como actor de gobernanza).
4. **KAUD-4**: el registro de administración es el **punto de acoplamiento**
   respuestas↔versiones: sin él, no hay scoring reconstruible (KSEC-10).
5. **KAUD-5**: los accesos a claves/rationale quedan registrados (KSEC-9).
6. **KAUD-6**: la matriz `knowledge-evidence-model.csv` (PASO 18) es la
   **vista** de la cadena para auditoría documental; ante discrepancia entre
   matriz y registros fuente, prevalecen los registros fuente (la matriz se
   regenera, no se edita a mano sobre datos vivos).

## 4. Relación con la auditoría del sistema

- El audit trail de A-02.2 PASO 13 cubre los eventos de plataforma; esta
  cadena especifica los eslabones **metodológicos** del instrumento de
  conocimientos dentro de esa infraestructura.
- La auditoría final de la fase (PASO 20) verifica el expediente; la
  auditoría operacional (muestreos de KSEC-4, verificación de
  reproducibilidad) será un proceso de gobernanza cuando el modelo se
  implemente — queda definida como requerimiento, no implementada.
