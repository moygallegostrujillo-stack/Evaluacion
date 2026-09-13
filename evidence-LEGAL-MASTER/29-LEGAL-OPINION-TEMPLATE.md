# EVALUHR — LEGAL MASTER PACKAGE · 29 · LEGAL OPINION TEMPLATE (PASO 22 del encargo)
# NO SE INVENTA EL DICTAMEN — SOLO SE PREPARA EL ESPACIO

## 0. Regla dura

Todos los campos quedan vacíos hasta que el abogado profesional llene y firme. Este documento NO constituye asesoría legal.

## 1. Estructura

```yaml
legalOpinion:
  reviewVersion: ""            # LegalOpinion-v1 (al recibir)
  status: ""                   # RECEIVED | UNDER_REVIEW | ISSUED | SUPERSEDED
  lawyerName: ""               # [POR COMPLETAR]
  firm: ""                     # [POR COMPLETAR]
  date: ""                     # [POR COMPLETAR]
  scope: ""                    # [POR COMPLETAR: LFPDPPP 2025, LFT vigente, LFPED, selección, IA, SaaS]
  documentsReviewed:           # [POR COMPLETAR: listar archivos del paquete con versión]
    - ""
  opinion:
    summary: ""                # [POR COMPLETAR]
    perIssue:                  # 1:1 con legal-question-matrix.csv / preguntas 1-26
      - id: ""                 # e.g. OLI-001, PQ-05, CTR-14
        decision: ""           # APPROVE | APPROVE_WITH_CHANGES | REJECT | NEEDS_MORE_INFORMATION
        legalBasis: ""         # norma y artículo vigente citado por el abogado
        requiredChange: ""
        priority: ""           # P1 | P2 | P3
        implementationNote: ""
        followUp: ""
  conditions: []               # condiciones para operación legal
  exceptions: []               # casos excluidos
  signature:
    signed: false              # true solo con evidencia real externa
    signatureEvidence: ""      # referencia a archivo firmado (no aquí)
    signedAt: ""
  gatesImpact:
    INTERVIEW_G7: ""           # NO APPROVED → solo cambia con dictamen real
    LEGAL_G8: ""               # NO APPROVED → ídem
    LEGAL_G10: ""              # NOT EVALUATED → requiere además piloto
```

## 2. Reglas de llenado

1. Cada `id` debe corresponder 1:1 con `legal-question-matrix.csv` y `27-LEGAL-OPEN-ITEMS.md` (nada sin responder).
2. `conditions` alimenta `30-IMPLEMENTATION-CHECKLIST.md` (LEGAL-001…).
3. `signature.signed` solo `true` con PDF firmado externo; el paquete guarda la referencia.
4. `gatesImpact` se actualiza una sola vez, citando la sección exacta del dictamen.
5. Si el dictamen contradice este paquete, **prevalece el dictamen** y los documentos se re-versionan (append-only).
