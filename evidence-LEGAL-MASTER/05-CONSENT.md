# EVALUHR — LEGAL MASTER PACKAGE · 05 · CONSENT (PASO 11)

## 0. Estado implementado (verificado en repo)

| Componente | Evidencia | Contenido |
|---|---|---|
| Campos de consentimiento | `User.consentGiven/consentDate/consentOption/consentConfirmed/consentVersion/consentWithdrawnAt` (schema.prisma:55-61) | Opción FULL/KNOWLEDGE_ONLY, confirmación de lectura, versión |
| Evidencia inmutable | Modelo `ConsentLog` (schema.prisma:94-120): GIVEN/WITHDRAWN/MODIFIED/REVOKED/RE_CONSENTED, IP, UA, snapshots de nombre/email/teléfono, **noticeHash SHA-256** | Binding criptográfico del aviso visto |
| API | `/api/consent` POST (consentimiento) y PATCH (retiro: borra respuestas sensibles de 14 categorías y resetea scores) | Art. 8 (ley 2011) citado en código — actualizar marco |
| Re-consentimiento | `src/lib/consent-version.ts` (`needsReconsent()` con flag `material`) aplicado en login/auto-login | Versionado del aviso |
| Canal público | `public/apply/route.ts:1612-1616` crea con `consentGiven:false` ("DO NOT auto-consent") | Bien; **pero no se verificó escritura de ConsentLog en canal público** — GAP |
| UI | ConsentView.tsx (opciones A/B, casilla de lectura confirmada, bloque 37 Bis), PublicEvaluationView (:718-778) | — |

## 1. Regla de diseño del encargo

**NO asumir que todo tratamiento requiere la misma forma de consentimiento.** Cada tratamiento lleva una marca para el abogado: REQUERIDO / EXPRESO / TACITO / EXCEPCION_LEGAL / FINALIDAD_INDEPENDIENTE — cada conclusión queda **LEGAL_REVIEW**.

## 2. Matriz por tratamiento (borrador para dictamen)

| # | Tratamiento | Consentimiento requerido | Forma propuesta | Marca | LEGAL_REVIEW |
|---|---|---|---|---|---|
| C1 | Identificativos mínimos para operar el proceso | Por dictamen | Tácito/granular en aviso (art. 9 excepciones por verificar) | TACITO | SÍ |
| C2 | Evaluación psicológica (14 categorías — sensibles) | SÍ — reforzado | **EXPRESO y por escrito** (principio sensibles confirmado 2025-2026; número exacto por confirmar) | EXPRESO | SÍ |
| C3 | Conocimientos | Por dictamen | Expreso simple / tácito | TACITO | SÍ |
| C4 | Big Five (legacy) / Integridad (aislado) | SÍ si se conservan | Expreso (sensibles) o RETIRO del instrumento | EXPRESO | SÍ |
| C5 | Uso de IA (generación de preguntas; asistencia) | Por dictamen | Expreso simple, separado | EXPRESO | SÍ |
| C6 | Video vía WhatsApp (fuera del sistema) | Por dictamen | Información previa + consentimiento simple | REQUERIDO | SÍ |
| C7 | Transferencias (Supabase Canadá, Vercel, proveedor IA) | Por dictamen (art. 15: ya no "requisito indispensable" del aviso, pero transparencia y base siguen necesarios) | Cláusula de transferencias | REQUERIDO | SÍ |
| C8 | Video si se habilitara grabación/almacenamiento | NO APLICA HOY | Consentimiento específico independiente | FINALIDAD_INDEPENDIENTE | SÍ |

## 3. Retirada (revocación)

- Implementada en canal autenticado: PATCH `/api/consent` borra respuestas sensibles y resetea scores; ConsentLog registra WITHDRAWN/REVOKED.
- **Pendiente dictamen**: efectos de la revocación sobre datos no sensibles ya tratados (conservación de conocimientos, evidencia, logs) — 15.

## 4. Gaps declarados

| Gap | Impacto | Acción post-dictamen |
|---|---|---|
| ConsentLog no verificado en canal público | Evidencia de consentimiento débil | LEGAL-0xx: unificar evidencia |
| Aviso PDF vigente cita marco 2011/INAI | Consentimiento con base normativa desactualizada | LEGAL-001/002: actualizar textos |
| Opciones A/B de consentimiento | Diferenciación granular existe; alinear con art. 15 (diferenciar finalidades) | LEGAL-0xx |
