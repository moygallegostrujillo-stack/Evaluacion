import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================
// POST - Mark video step complete via WhatsApp (no file storage)
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

    // Verify application exists
    const application = await db.vacancyApplication.findUnique({
      where: { id: applicationId },
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing video step:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
