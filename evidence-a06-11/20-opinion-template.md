# EVALUHR — A-06.11 · 20 · OPINION TEMPLATE — ESTRUCTURA PARA EL DICTAMEN (PASO 22)

## 0. Regla dura

> **No inventar el dictamen. Solo preparar el espacio.** Todos los campos quedan vacíos/placeholder hasta que el abogado profesional los llene y firme. Este documento NO constituye asesoría legal ni dictamen.

## 1. Estructura definida para almacenar posteriormente

```yaml
legalOpinion:
  reviewVersion: ""            # e.g. LegalOpinion-v1 (asignada al recibir)
  status: ""                   # RECEIVED | UNDER_REVIEW | ISSUED | SUPERSEDED
  lawyerName: ""               # [POR COMPLETAR AL RECIBIR EL DICTAMEN]
  firm: ""                     # [POR COMPLETAR]
  date: ""                     # [POR COMPLETAR]
  scope: ""                    # [POR COMPLETAR] — materia revisada (entrevista BDI/STAR, LFPDPPP, LFT Art. 3, etc.)
  documentsReviewed:           # lista de documentos del expediente realmente revisados
    - ""                       # [POR COMPLETAR — citar por nombre de archivo y versión]
  opinion:                     # respuesta global
    summary: ""                # [POR COMPLETAR]
    perIssue:                  # una entrada por fila de legal-opinion-request.csv
      - issueId: ""            # e.g. RES-01, CON-02, GAT-01 ...
        answer: ""             # APPROVE | APPROVE_WITH_CHANGES | REJECT | NEEDS_MORE_INFORMATION
        observations: ""       # [POR COMPLETAR]
  conditions:                  # condiciones para cerrar INTERVIEW-G7 / LEGAL-G8
    - ""                       # [POR COMPLETAR]
  exceptions:                  # excepciones y casos excluidos del alcance
    - ""                       # [POR COMPLETAR]
  signature:
    signed: false              # true solo con firma/evidencia real del profesional
    signatureEvidence: ""      # [POR COMPLETAR] — referencia al archivo firmado (PDF/scan), NO aquí
    signedAt: ""               # [POR COMPLETAR]
  gatesImpact:
    INTERVIEW_G7: ""           # NO APPROVED (inicial) → solo cambia con dictamen real
    LEGAL_G8: ""               # NO APPROVED (inicial) → solo cambia con dictamen real
    LEGAL_G10: ""              # NOT EVALUATED (inicial) → requiere además piloto
```

## 2. Reglas de llenado (para cuando exista el dictamen real)

1. Cada `issueId` de `perIssue` debe corresponder 1:1 con las filas de `legal-opinion-request.csv` (nada sin responder; NEEDS_MORE_INFORMATION es respuesta válida).
2. `conditions` alimenta directamente el plan de cambios pre-productivo; ningún cambio se ejecuta mientras G7/G8 sigan NO APPROVED.
3. `signature.signed` solo puede ser `true` con evidencia externa real (PDF firmado por el profesional); el expediente guarda la referencia, no la fabrica.
4. `gatesImpact` se actualiza una sola vez, por el responsable de gobernanza, citando la sección exacta del dictamen que lo sustenta.
5. Si el dictamen contradice algún documento de este expediente, **prevalece el dictamen** y los documentos se re-versionan (append-only).

## 3. Ubicación futura del dictamen

- `evidence-a06-11/opinion/` (carpeta a crear cuando se reciba el documento firmado).
- Registro del evento en el audit trail de gobernanza.
- Hasta entonces, todos los gates permanecen en su estado actual (02).
