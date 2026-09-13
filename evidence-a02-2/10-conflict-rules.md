# EVALUHR — A-02.2 · PASO 10
# CONFLICTOS ENTRE FUENTES DE EVIDENCIA

> Documento de diseño metodológico. NO modifica código, schema, base de datos,
> scoring, fórmulas, IPIP-50-MX, preguntas, IA, recomendaciones, frontend,
> contrato ni aviso de privacidad.
> Fecha: 2026-09-09 · Versión del documento: 1.0 · Estado: PROPUESTA METODOLÓGICA

---

## 1. Definición de conflicto

> Existe **conflicto de evidencia** cuando dos registros válidos (calidad
> MEDIUM/HIGH, sin invalidar) asociados al **mismo criterio** — o a criterios
> de la misma categoría vinculados por trazabilidad — apuntan a lecturas
> **opuestas o incompatibles** del criterio.

Ejemplo canónico del encargo:

```
IPIP-50-MX indica una tendencia (evidencia de rasgos, tipo A)
+
entrevista muestra comportamiento diferente (evidencia humana, tipo F)
→ conflicto sobre el criterio D correspondiente
```

Otros ejemplos: experiencia declarada (LOW) vs. verificación documental
negativa; nota de entrevista vs. resultado de conocimientos — siempre que
ambos registros sean utilizables y contradigan la misma lectura.

---

## 2. Regla central: NO resolver automáticamente

> **El sistema NO resuelve conflictos automáticamente.**
> Ni promedia, ni elige ganador, ni pondera por "confianza", ni silencia una
> de las fuentes. **Todo conflicto pasa a revisión humana.**

Motivación:

1. Las fuentes miden cosas distintas con métodos distintos (auto-reporte vs.
   observación); "resolver" sería mezclar constructos (prohibido desde
   A-02.1).
2. No existe regla de arbitraje validada; inventar una sería diseñar fórmula
   sin evidencia (prohibido en A-02.2).
3. La discrepancia es **información valiosa** para la entrevista y la
   revisión — perderla sería peor que el conflicto mismo.

---

## 3. Protocolo de conflicto (definido, no implementado)

```
Detección (determinista, por reglas — nunca IA):
  dos+ registros ACTIVE del mismo criterio con lecturas opuestas
        ↓
Marcado:
  ambos registros conservan su calidad y status ACTIVE
  se crea vínculo de conflicto (conflictRef en ambos registros)
  reviewRequired = true (forzado) y reviewStatus = PENDING
        ↓
Salida:
  el criterio se reporta como "Área que requiere revisión" (A-02.1 PASO 10)
  con ambos datos visibles y sus fuentes/versiones
        ↓
Revisión humana:
  RH examina ambos registros (y puede generar evidencia nueva,
  p. ej. entrevista — PASO 9)
  la revisión DOCUMENTA una lectura; no edita ni borra registros
        ↓
Registro:
  la lectura de revisión queda en el audit trail (PASO 13);
  los registros originales permanecen intactos (append-only)
```

---

## 4. Reglas específicas

1. **Sin jerarquía automática**: ningún tipo de evidencia "gana" por defecto
   (ni el test sobre la entrevista, ni la entrevista sobre el test).
2. **Sin destrucción**: el conflicto nunca invalida registros por sí mismo;
   la invalidación es acto explícito de gobernanza (PASO 16).
3. **Sin agregación**: prohibido promediar, sumar, normalizar o "fusionar"
   registros en conflicto.
4. **Transparencia**: la salida muestra ambas fuentes (qué instrumento, qué
   versión, qué fecha) — la persona revisora ve el conflicto completo.
5. **Bloqueo interpretativo**: mientras el conflicto esté `PENDING`, el
   criterio no puede alimentar ninguna lectura interpretativa (solo muestra
   el área de revisión).
6. **IA excluida**: la detección es por reglas; la resolución es humana; la
   IA no opina sobre "quién tiene razón" (PASO 12).

---

## 5. Casos límite

| Caso | Tratamiento |
|---|---|
| Conflicto entre declarado (LOW) y verificado | No es "conflicto de iguales": el declarado es contexto y la verificación prevalece como registro — se anota la discrepancia para revisión (transparencia hacia la persona) |
| Conflicto dentro del mismo instrumento (respuestas inconsistentes) | Se registra la inconsistencia como observación del registro; calidad puede degradarse por regla (PASO 3); nunca se "corrige" respuestas |
| Conflicto resuelto por nueva evidencia | Se agregan registros nuevos; el vínculo de conflicto se cierra documentadamente (quién, cuándo, con qué lectura) — los originales permanecen |
| Persona revisora coincide con una fuente | Válido: registra su lectura con motivación; el "perdedor" no se borra |
