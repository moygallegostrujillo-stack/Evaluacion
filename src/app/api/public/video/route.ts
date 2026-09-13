import { NextRequest, NextResponse } from 'next/server'
import { getUnscopedClient } from '@/lib/rls'
import { hashPassword } from '@/lib/password'
import { verifyPublicToken } from '@/lib/public-token'
import {
  calculateCanonicalOverallScore,
  buildCanonicalInput,
  serializeSections,
  serializeExcludedReasons,
  type EvidenceStatus,
} from '@/lib/overall-score'

// ============================================
// POST - Mark video step complete via WhatsApp (no file storage)
// Also creates EvaluationResult bridge records for HR/Admin visibility
//
// PHASE 3.5-B.2 (B3): Token is now REQUIRED (not optional).
// The token must be a signed HMAC that binds the applicationId to the
// server secret. This prevents cross-tenant access — an attacker who
// knows an applicationId from another company cannot use it without
// the signed token.
// ============================================

export async function POST(req: NextRequest) {
  try {
    const db = getUnscopedClient()
    const body = await req.json()
    const { applicationId, videoSent, token } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      )
    }

    // PHASE 3.5-B.2 (B3): Token is REQUIRED for all requests.
    // Previously token was optional — anyone with applicationId could
    // mark the video step complete. Now requires a signed token.
    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido', code: 'TOKEN_REQUIRED' },
        { status: 403 }
      )
    }

    // PHASE 3.5-D.2.9 (PARTE 6): CORRECT ORDER — the HMAC token is
    // self-contained (HMAC of the applicationId), so it is verified
    // CRYPTOGRAPHICALLY BEFORE any database lookup. This removes the
    // 404-vs-403 existence oracle: an unauthenticated caller can no longer
    // use this endpoint to enumerate valid applicationIds. Lookup happens
    // only after the token proves possession of the server secret.
    if (!verifyPublicToken(token, applicationId)) {
      console.warn(`[SECURITY] Public video endpoint: token verification FAILED for application ${applicationId}`)
      return NextResponse.json(
        { error: 'Token de verificación inválido', code: 'TOKEN_INVALID' },
        { status: 403 }
      )
    }

    // Verify application exists with vacancy and company info
    const application = await db.vacancyApplication.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // If candidateEmail is available, log the access for audit
    if (application.candidateEmail) {
      console.log(`[SECURITY] Public video endpoint: application ${applicationId} accessed by ${application.candidateEmail}`)
    }

    // Update application - mark step as complete
    const updateData: Record<string, unknown> = {
      currentStep: 5,
      videoType: videoSent ? 'WHATSAPP' : 'SKIPPED',
      videoUrl: videoSent ? 'via-whatsapp' : null,
    }

    // ── A-04.5: CANONICAL OVERALL SCORE ─────────────────────────────────
    // BEFORE A-04.5, this endpoint OVERWROTE overallScore with a FOURTH
    // divergent formula (no Integrity, neuroticism RE-INVERTED, fixed /5
    // denominators, PROPORTIONAL renormalization, 0.00-KN = absent). That
    // divergence is REMOVED: the endpoint now delegates to the SAME
    // canonical engine as evaluations and public/apply. Same persisted
    // data → same overall, regardless of channel (PASO 12 determinism).
    //
    // The gate (only recompute when overallScore === 0) is PRESERVED as a
    // "scoring closure" fallback — it does NOT introduce a new formula.
    if (application.overallScore === 0) {
      // Look up the canonical Knowledge evidence status so INSUFFICIENT
      // evidence is EXCLUDED (never coerced to 0).
      const appWithKn = await db.vacancyApplication.findUnique({
        where: { id: applicationId },
        include: {
          vacancy: true,
          knowledgeAdministration: { include: { knowledgeResult: true } },
        },
      })
      const knowledgeResult = appWithKn?.knowledgeAdministration?.knowledgeResult
      const knowledgeEvidenceStatus: EvidenceStatus = knowledgeResult
        ? (knowledgeResult.evidenceStatus as EvidenceStatus)
        : null

      const canonicalInput = buildCanonicalInput(
        {
          openness: application.openness,
          conscientiousness: application.conscientiousness,
          extraversion: application.extraversion,
          agreeableness: application.agreeableness,
          neuroticism: application.neuroticism,
        },
        {
          stressLevel: application.stressLevel,
          empathy: application.empathy,
          adaptability: application.adaptability,
          leadership: application.leadership,
          teamwork: application.teamwork,
        },
        application.knowledgeScore,
        knowledgeEvidenceStatus,
        application.integrityScore
      )
      const canonical = calculateCanonicalOverallScore(canonicalInput)

      // Generate neutral summary (orientation, not decision)
      const parts: string[] = []
      const concerns: string[] = []

      if (application.extraversion >= 70) parts.push('alta extraversión')
      if (application.conscientiousness >= 70) parts.push('alta responsabilidad')
      if (application.openness >= 70) parts.push('alta apertura a la experiencia')
      if (application.agreeableness >= 70) parts.push('alta amabilidad')
      if (application.empathy >= 70) parts.push('buena empatía')
      if (application.teamwork >= 70) parts.push('buen trabajo en equipo')
      if (application.adaptability >= 70) parts.push('buena adaptabilidad')
      if (application.leadership >= 70) parts.push('buen liderazgo')

      if (application.stressLevel > 60) concerns.push('nivel de estrés elevado')
      if (application.neuroticism > 60) concerns.push('alto neuroticismo')
      if (application.empathy < 40) concerns.push('baja empatía')
      if (application.teamwork < 40) concerns.push('bajo trabajo en equipo')
      if (application.adaptability < 40) concerns.push('baja adaptabilidad')

      let summary = ''
      if (parts.length > 0) summary += `Candidato con ${parts.join(', ')}. `
      if (concerns.length > 0) summary += `Áreas a explorar: ${concerns.join(', ')}. `

      if (application.knowledgeScore !== null) {
        summary += `Conocimientos técnicos: ${application.knowledgeScore}%. `
      }

      const perfilScope = canonical.guidance === 'PERFIL_COMPLETO' ? 'completo' : 'parcial'
      summary += `Puntuación general: ${Math.round(canonical.score)}. Alcance del perfil: ${perfilScope}. La decisión final corresponde al área de Recursos Humanos.`

      updateData.overallScore = canonical.score
      updateData.recommendation = canonical.guidance
      updateData.summary = summary
      updateData.status = 'COMPLETED'
      updateData.completedAt = new Date()
      // A-04.5: persist the canonical formula version + section audit
      updateData.formulaVersion = canonical.formulaVersion
      updateData.includedSections = serializeSections(canonical.includedSections)
      updateData.excludedSections = serializeSections(canonical.excludedSections)
      updateData.excludedReasons = serializeExcludedReasons(canonical.excludedReasons)
    }

    await db.vacancyApplication.update({
      where: { id: applicationId },
      data: updateData,
    })

    // ============================================
    // Create EvaluationResult bridge record for HR/Admin visibility
    // ============================================
    try {
      const vacancy = application.vacancy
      const companyId = vacancy.companyId

      // Find or create a User record for this candidate
      let candidateUser = await db.user.findUnique({
        where: { email: application.candidateEmail },
      })

      if (!candidateUser) {
        candidateUser = await db.user.create({
          data: {
            email: application.candidateEmail,
            name: application.candidateName,
            password: await hashPassword(`candidate_${Date.now()}`),
            role: 'CANDIDATO',
            companyId,
            phone: application.candidatePhone,
            // DO NOT auto-consent: LFPDPPP Art. 8 requires explicit consent from the data subject
            consentGiven: false,
            consentOption: null,
            anonymousStats: false,
            consentConfirmed: false,
            active: true,
          },
        })
      }

      // Find a Position matching the vacancy's sector for this company
      let position = await db.position.findFirst({
        where: {
          companyId,
          sector: vacancy.sector,
          active: true,
        },
      })

      // Fallback: any position from the company
      if (!position) {
        position = await db.position.findFirst({
          where: {
            companyId,
            active: true,
          },
        })
      }

      if (position) {
        // Create EvaluationSession
        const session = await db.evaluationSession.create({
          data: {
            candidateId: candidateUser.id,
            positionId: position.id,
            companyId,
            status: 'COMPLETED',
            startedAt: application.startedAt || application.createdAt,
            completedAt: application.completedAt || new Date(),
          },
        })

        // Create EvaluationResult - use updateData values which have the calculated scores
        // (application.* still holds the OLD values from before the update)
        const calculatedOverallScore = (updateData.overallScore as number) || application.overallScore || 0
        const calculatedRecommendation = (updateData.recommendation as string) || application.recommendation || 'PENDIENTE'
        const calculatedSummary = (updateData.summary as string) || application.summary
        // A-04.5: propagate canonical formula version + section audit (if computed)
        const calculatedFormulaVersion = (updateData.formulaVersion as string | undefined) ?? application.formulaVersion
        const calculatedIncludedSections = (updateData.includedSections as string | undefined) ?? application.includedSections
        const calculatedExcludedSections = (updateData.excludedSections as string | undefined) ?? application.excludedSections
        const calculatedExcludedReasons = (updateData.excludedReasons as string | undefined) ?? application.excludedReasons

        await db.evaluationResult.create({
          data: {
            sessionId: session.id,
            candidateId: candidateUser.id,
            candidateName: application.candidateName,
            positionId: position.id,
            positionTitle: position.title,
            companyId,
            openness: application.openness,
            conscientiousness: application.conscientiousness,
            extraversion: application.extraversion,
            agreeableness: application.agreeableness,
            neuroticism: application.neuroticism,
            stressLevel: application.stressLevel,
            empathy: application.empathy,
            adaptability: application.adaptability,
            leadership: application.leadership,
            teamwork: application.teamwork,
            knowledgeScore: application.knowledgeScore,
            overallScore: calculatedOverallScore,
            recommendation: calculatedRecommendation,
            summary: calculatedSummary,
            formulaVersion: calculatedFormulaVersion,
            includedSections: calculatedIncludedSections,
            excludedSections: calculatedExcludedSections,
            excludedReasons: calculatedExcludedReasons,
          },
        })
      }
    } catch (bridgeError) {
      // Log but don't fail the main flow
      console.error('Error creating EvaluationResult bridge record:', bridgeError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing video step:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
