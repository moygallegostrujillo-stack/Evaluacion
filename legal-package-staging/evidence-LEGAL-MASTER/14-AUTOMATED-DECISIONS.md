# EVALUHR — LEGAL MASTER PACKAGE · 14 · AUTOMATED DECISIONS (PASO 14b)
# MAPA AUTOMATIZADO / ASISTIDO / HUMAN ONLY

## 1. Mapa completo del sistema (verificado en repo + diseño)

| Proceso | Tipo | ¿Quién? | Nota legal |
|---|---|---|---|
| Invitación y token | AUTOMATIZADO | Sistema (instrucción RR.HH.) | Tratamiento técnico por instrucción |
| Aplicación pública (datos, consentimiento) | AUTOMATIZADO + HUMAN | Sistema registra; candidato actúa | No auto-consiente; sin ConsentLog en canal público — gap |
| Scoring de conocimientos | AUTOMATIZADO | Motor (`scoreCanonicalAdministration`) | correctAnswer protegido; INSUFFICIENT ≠ 0 |
| Scoring psicológico/Big Five/Integridad | AUTOMATIZADO | Motor | Big Five e Integridad excluidos del overall (NOT_APPROVED) |
| overallScore | AUTOMATIZADO | Motor OVERALL-v1.1 | Orientación de completitud; sin pesos nuevos |
| recommendation | AUTOMATIZADO | Motor | PERFIL_COMPLETO/PARCIAL/PENDIENTE — **no decisión** |
| Generación de preguntas (IA) | ASISTIDO | IA + RR.HH. | AI_DRAFT; publicación = SYSTEM/humano |
| Entrevista estructurada (BDI/STAR, probes, rúbrica) | **HUMAN ONLY** | Entrevistador + reviewer humanos | NO ACTIVA (G7 NO APPROVED; sin modelos en producto) |
| Resumen IA de respuestas | ASISTIDO (diseño) | IA borrador + humano verifica | Solo cuando entrevista se active |
| Detección de información faltante | ASISTIDO (diseño) | IA alerta | No califica |
| **Decisión de contratación** | **HUMAN ONLY** | RR.HH. de la empresa cliente | **Ninguna función del sistema decide**; sin campos de decisión en schema |
| Retención/purga | AUTOMATIZADO | Cron diario (vercel.json) | ⚠ Cron aparentemente bloqueado por middleware (OPER-01) |

## 2. Evaluación jurídica (por dictamen)

1. Ninguna etapa produce "decisión individualizada automatizada" con efectos jurídicos sobre el titular: los scores son insumo orientativo y la decisión es humana — **tesis defendible**, a documentar.
2. **Art. 26 LFPDPPP 2025** (oposición frente a tratamiento automatizado destinado a **evaluar sin intervención humana** aspectos del titular): el diseño actual incorpora intervención humana obligatoria; el dictamen debe confirmar que la combinación scoring+presentación no constituye evaluación "sin intervención humana" y fijar salvaguardas (transparencia, revisión, oposición).
3. Lenguaje prohibido en contrato/producto: cualquier fórmula que sugiera que EvaluHR "recomienda/no recomienda contratar", "aprobó/rechazó" al candidato. Permitido: "orientación sobre completitud del perfil".

## 3. Salvaguardas requeridas (post-dictamen)

1. Declaración expresa en aviso (06) del papel de la automatización y del derecho de oposición.
2. Procedimiento de revisión humana documentada (13).
3. Bloqueo de cualquier función futura que asigne niveles/vetos sin humano (catálogo IA 12 §2).
