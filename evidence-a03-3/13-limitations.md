# A-03.3 — LIMITACIONES

1. **L-1 · Sin UI de gobernanza.** Blueprint/requirement/assessment se crean
   por el generador/seed de gobernanza; no existe todavía una pantalla RH para
   editar blueprints ni transicionar estados (DRAFT→REVIEW→APPROVED…) por UI.
   Las transiciones existen como reglas del módulo; el flujo UI es fase futura.

2. **L-2 · Alcance del snapshot.** El snapshot de administración (PASO 9) se
   implementa en el flujo de evaluación por invitación (EvaluationSession). El
   flujo de vacantes públicas (VacancyApplication) congela clave+desenlace al
   calificar (A-03.2) pero aún no registra snapshot de versiones al iniciar —
   limitación documentada (la reconstrucción de clave/versiones históricas del
   flujo de vacantes depende del congelamiento por respuesta).

3. **L-3 · Historial de versiones solo hacia adelante.** Las 50 versiones v1
   se registraron en la reconstrucción del entorno (seed) con contenido real
   actual y `changeReason=INITIAL`. Para instalaciones que migren con ítems
   pre-A-03.3 ya administrados, la v1 se registrará como
   `INITIAL_REGISTRATION_BACKFILL` en su primer cambio; hasta entonces su
   evidencia histórica de clave es `EvaluationResponse.correctAnswerSnapshot`.

4. **L-4 · Cambio de ítem ⇒ DRAFT sin flujo de re-aprobación UI.** Tras un
   cambio metodológico, la nueva versión nace DRAFT (requiere re-revisión) y
   el runtime sigue sirviéndola funcionalmente (publicación ≠ funcionalidad,
   brecha heredada de A-03.1 KPUB-8). El set esperado del scoring cuenta ítems
   por plantilla, no por estado: un ítem DRAFT con clave sigue puntuando.
   Mitigación documentada; el cierre completo requiere el flujo de aprobación
   UI (L-1).

5. **L-5 · DEMO: actor único en reactivos RH.** En el DEMO un RH crea el
   reactivo y queda como autor/revisor/aprobador (con excepción registrada en
   AuditLog). La política ideal (autor≠revisor≠aprobador estrictos) requiere
   separación real de usuarios, fuera del alcance de esta fase.

6. **L-6 · Sin entorno multi-instancia.** El rate-limit y los snapshots en
   memoria siguen siendo in-memory (fase 3.5-B9); la gobernanza en DB es
   persistente y no se ve afectada.

7. **L-7 · Supabase/prod pendiente.** `prisma/schema.prod.prisma` y el schema
   de Supabase no fueron promovidos con los 5 modelos nuevos (coherente con el
   estado NO-GO producción heredado). La promoción requiere su propio
   procedimiento con credenciales.

8. **L-8 · Banco del sistema sin validación empírica.** Los dominios y claves
   siguen siendo ELABORACION_REVISADA (A-03.2); A-03.3 no añade evidencia
   psicométrica (no era el encargo). La fuerza del criterio de conocimientos
   permanece LIMITED según A-02.5.

9. **L-9 · Entorno DEV reset.** La verificación de "históricos intactos" se
   hizo sobre el estado demo restaurado (la DB del sandbox estaba vacía al
   iniciar la fase). Los resultados demo son legado del seed y permanecieron
   byte a byte sin cambios durante toda la fase.
