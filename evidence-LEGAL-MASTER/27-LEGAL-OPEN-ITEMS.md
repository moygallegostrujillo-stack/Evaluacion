# EVALUHR — LEGAL MASTER PACKAGE · 27 · LEGAL OPEN ITEMS (PASO 31)
# LISTA ÚNICA SIN DUPLICADOS

| ID | issue | risk | whyOpen | questionForLawyer | requiredEvidence | owner | blocking | status |
|---|---|---|---|---|---|---|---|---|
| OLI-001 | No existe contrato maestro real | ALTO | 0 documentos contractuales en repo | ¿Redacta/valida el contrato maestro (08)? | Borrador 08 + facultades de las partes | EvaluHR+Cliente | SÍ (operación SaaS) | OPEN |
| OLI-002 | Aviso PDF desalineado con marco 2025 y con aviso in-app | ALTO | PDF vigente 08-ago-2026 cita marco 2011/INAI; omite IA/conservación/revocación | ¿Aprobar aviso consolidado? | 06 + PDF actual + in-app 2026-01-v2 | EvaluHR | SÍ (candidatos) | OPEN |
| OLI-003 | Consentimiento: forma por tratamiento (expreso/tácito) | ALTO | Matriz C1–C8 sin resolver (05) | ¿Qué tratamientos requieren expreso? | 05 | Abogado | SÍ | OPEN |
| OLI-004 | ConsentLog ausente en canal público | MEDIO | Evidencia de consentimiento no verificada en apply público | ¿Es suficiente la evidencia actual? | Código apply + ConsentLog | EvaluHR | NO (pre-producción) | OPEN |
| OLI-005 | candidateAge recolectado en canal público | MEDIO-ALTO | Atributo protegido sin justificación | ¿Se justifica por puesto o se elimina? | 02 §1.1 | Cliente+EvaluHR | SÍ (pre-producción) | OPEN |
| OLI-006 | Datos sensibles (psicológica/Big Five/integridad): qué puede tratarse | ALTO | Tratamiento reforzado sin dictamen | ¿Qué sensibles se permiten y con qué plazos? | 10, 20, 22 | Abogado | SÍ | OPEN |
| OLI-007 | Big Five legacy sin licencia (IPIP no implementado) | MEDIO | Ítems propios, derechos UNKNOWN | ¿Retirar o licenciar? | 20 §1, evidence-a05-* | EvaluHR | NO (declinado) | OPEN |
| OLI-008 | Integridad visible a RR.HH. sin validez | MEDIO | Instrumento orientativo aislado del overall | ¿Continuar o retirar? | 22 | Abogado+Cliente | NO | OPEN |
| OLI-009 | Plazos de conservación sin dictamen | MEDIO | Sistema usa 730/90/90 días como decisión técnica | ¿Plazos por categoría (contratado/no)? | 15 | Abogado | SÍ (pre-producción) | OPEN |
| OLI-010 | Triggers de retención inexistentes (hiredAt/notifiedAt) | MEDIO | retention.ts lo documenta | ¿Cómo marcar fin de proceso? | 15 §1 | EvaluHR | NO | OPEN |
| OLI-011 | Cron de retención aparentemente bloqueado por middleware | MEDIO | PUBLIC_ROUTES no exenta /api/retention | (técnico) | 15 §1.2 | EvaluHR | NO | OPEN |
| OLI-012 | RLS Postgres preparado pero NO ejecutado | ALTO | "NOT EXECUTED. PREPARATION ONLY" | (técnico-legal: seguridad adecuada) | 16 | EvaluHR | SÍ (producción) | OPEN |
| OLI-013 | Subencargados sin declarar y sin contratos | ALTO | Supabase/Vercel/IA sin acuerdos | ¿Qué subencargados y mecanismos? | 17, 18 | EvaluHR | SÍ | OPEN |
| OLI-014 | Región real de Supabase/Vercel sin confirmar | MEDIO | Auditoría previa marca "NO DETERMINABLE" | ¿Dónde residen los datos? | 18 | EvaluHR | NO | OPEN |
| OLI-015 | Incoherencia aviso ("no transferencias") vs infraestructura | ALTO | Aviso↔práctica | ¿Cómo declarar transferencias? | 17/18 + 06 | EvaluHR+Abogado | SÍ | OPEN |
| OLI-016 | Protocolo de incidentes inexistente | MEDIO | No implementado ni documentado | ¿Plazos y contenido de notificación? | 19 | Abogado | SÍ (producción) | OPEN |
| OLI-017 | Autoridad de control y procedimientos post-INAI | MEDIO | Marco nuevo (SABC), reglamento pendiente | ¿Procedimientos ante la nueva autoridad? | 01 | Abogado | NO | OPEN |
| OLI-018 | Art. 26 (evaluación automatizada) vs scoring actual | MEDIO | Tesis de intervención humana a validar | ¿Salvaguardas necesarias? | 14, 25 | Abogado | SÍ | OPEN |
| OLI-019 | correctAnswer accesible en browser admin | BAJO-MEDIO | Endpoints RH devuelven la key | ¿Controles suficientes? | 21 | EvaluHR | NO | OPEN |
| OLI-020 | Backups sin soporte real (aviso afirma respaldos) | MEDIO | Solo snapshot dev local | ¿Implementar o corregir aviso? | 15 §3.4, 16 | EvaluHR | SÍ (producción) | OPEN |
| OLI-021 | Drift dev/prod: 7 modelos Knowledge ausentes en schema.prod | MEDIO | Paridad rota | (técnico) | 21 §2.4 | EvaluHR | NO | OPEN |
| OLI-022 | AUDITORIA_EVALUHR.md con claims obsoletos (IA, consent fix, rate limit) | BAJO | Documento 2025-07-25 desactualizado | — (registrar provenance) | source-index | EvaluHR | NO | OPEN |
| OLI-023 | Video vía WhatsApp fuera del sistema | MEDIO | Tratamiento fuera de plataforma | ¿Transparencia suficiente? | 02 §1.2, 18 T4 | Abogado | NO | OPEN |
| OLI-024 | Entrevista estructurada: G7 NO APPROVED; piloto no ejecutado | ALTO (si se activara) | Gates abiertos | ¿Puede cerrarse G7? | evidence-a06-11 + 24 | Abogado | SÍ (para activar entrevista) | OPEN |
| OLI-025 | Documentación PENDIENTE de partes (poderes, constancias) | MEDIO | Datos declarados sin prueba | ¿Constancias suficientes? | 08 §1/§3 | Cliente+EvaluHR | SÍ (firma contrato) | OPEN |
| OLI-026 | Aviso in-app cita Art. 37 Bis / INAI (texto derogado) | MEDIO | Textos del sistema | ¿Redacción vigente? | 06 | EvaluHR+Abogado | NO | OPEN |
| OLI-027 | UI/portal ARCO para el titular inexistente | BAJO | Solo API + correo RR.HH. | ¿Canal suficiente? | 09 §4 | EvaluHR | NO | OPEN |
| OLI-028 | Menores de edad: política y bloqueo | BAJO | Aviso in-app §24 declara no dirigido a menores | ¿Salvaguardas suficientes? | 06 | Abogado | NO | OPEN |

Regla: IDs únicos; ningún asunto duplicado; cada uno con pregunta concreta para el abogado. CSV espejo: `/open-items/legal-open-items.csv`.
