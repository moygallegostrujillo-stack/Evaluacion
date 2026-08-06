import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// ============================================
// POST - Mark video step complete via WhatsApp (no file storage)
// Also creates EvaluationResult bridge records for HR/Admin visibility
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { applicationId, videoSent } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
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

    // Update application - mark step as complete
    const updateData: Record<string, unknown> = {
      currentStep: 5,
      videoType: videoSent ? 'WHATSAPP' : 'SKIPPED',
      videoUrl: videoSent ? 'via-whatsapp' : null,
    }

    // Calculate final scores if all steps are done
    if (application.overallScore === 0) {
      // Psicometrica average
      const psicometricaAvg =
        (100 - application.neuroticism +
          application.openness +
          application.conscientiousness +
          application.extraversion +
          application.agreeableness) / 5

      // Psicologica average
      const psicologicaAvg =
        (application.stressLevel +
          application.empathy +
          application.adaptability +
          application.leadership +
          application.teamwork) / 5

      let overallScore: number
      if (application.knowledgeScore !== null) {
        overallScore = 0.30 * psicometricaAvg + 0.30 * psicologicaAvg + 0.40 * application.knowledgeScore
      } else {
        overallScore = 0.50 * psicometricaAvg + 0.50 * psicologicaAvg
      }

      let recommendation: string
      if (overallScore >= 70) {
        recommendation = 'APTO'
      } else if (overallScore >= 50) {
        recommendation = 'ENTREVISTA_ADICIONAL'
      } else {
        recommendation = 'NO_RECOMENDADO'
      }

      // Generate summary
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
      if (concerns.length > 0) summary += `Se detectaron ${concerns.join(', ')}. `

      if (application.knowledgeScore !== null) {
        if (application.knowledgeScore >= 80) {
          summary += `Excelente dominio de conocimientos técnicos (${application.knowledgeScore}%). `
        } else if (application.knowledgeScore >= 60) {
          summary += `Conocimientos técnicos aceptables (${application.knowledgeScore}%). `
        } else {
          summary += `Conocimientos técnicos por debajo del estándar (${application.knowledgeScore}%). `
        }
      }

      summary += `Puntuación general: ${Math.round(overallScore)}. Recomendación: ${recommendation === 'APTO' ? 'Apto' : recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista adicional' : 'No recomendado'}.`

      updateData.overallScore = Math.round(overallScore * 100) / 100
      updateData.recommendation = recommendation
      updateData.summary = summary
      updateData.status = 'COMPLETED'
      updateData.completedAt = new Date()
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
            password: hashPassword(`candidate_${Date.now()}`),
            role: 'CANDIDATO',
            companyId,
            phone: application.candidatePhone,
            consentGiven: true,
            consentDate: application.startedAt || new Date(),
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
