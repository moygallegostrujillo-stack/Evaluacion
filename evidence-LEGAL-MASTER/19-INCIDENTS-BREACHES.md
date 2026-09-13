# EVALUHR — LEGAL MASTER PACKAGE · 19 · INCIDENTS & BREACHES (PASO 26)

## 0. Estado actual

- **No existe protocolo implementado** ni documentado en el repo (verificado).
- El PDF del aviso §8 menciona "medidas de seguridad y respaldo" sin procedimiento de incidentes.
- Obligación de notificar vulneraciones existe en el marco 2025 (confirmado por fuentes secundarias; número de artículo y plazos exactos **POR CONFIRMAR** en texto oficial — no se inventan plazos jurídicos).

## 1. Protocolo propuesto — BORRADOR PARA ABOGADO

```
1. DETECCIÓN
   - Canales: alertas de plataforma, AuditLog (login fallido, UNAUTHORIZED_ATTEMPT),
     reporte de RR.HH./candidato, aviso del proveedor (Supabase/Vercel/IA).
2. CONTENCIÓN
   - Revocar accesos/sesiones (cookies 8h), aislar componente, cortar integración afectada.
3. EVALUACIÓN
   - Qué datos (categorías del inventario 02), cuántos titulares, sensibilidad
     (psicológica/Big Five/integridad = sensibles), tenant(s) afectado(s).
4. DOCUMENTACIÓN
   - Registro del incidente: descripción, alcance, medidas, fechas (audit trail append-only).
5. NOTIFICACIÓN
   - AL RESPONSABLE (empresa cliente): inmediata, [PLAZO POR DICTAMEN].
   - A LA AUTORIDAD (Secretaría Anticorrupción y Buen Gobierno): por EL RESPONSABLE o
     EL ENCARGADO según dictamen; plazos [POR DICTAMEN — texto vigente].
   - A LOS TITULARES: cuando aplique según dictamen (riesgo significativo).
6. COOPERACIÓN
   - EL ENCARGADO asiste al RESPONSABLE en toda la cadena; contenido mínimo de la
     notificación (qué, cuándo, alcance, medidas, contacto) [POR DICTAMEN].
```

## 2. Contenido mínimo propuesto de la notificación interna (encargo→responsable)

1. Qué ocurrió (hechos) y cuándo se detectó.
2. Categorías y volumen aproximado de datos y titulares.
3. Tenants (empresas) afectados.
4. Medidas de contención ejecutadas y pendientes.
5. Plan de remediación y responsable de cada acción.
6. Canal de contacto del proveedor.

## 3. Conexión con contratos

Cláusula 16 del borrador maestro (08) e incidentes en 08 §13; plazo de notificación interna propuesto: **inmediata y no mayor a [PLAZO POR DICTAMEN]**.

## 4. Regla

No se declaran plazos legales de notificación (48/72 horas u otros) sin confirmación del texto vigente — el dictamen los fija.
