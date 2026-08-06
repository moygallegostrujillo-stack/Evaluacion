import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Recalculates overallScore and recommendation for EvaluationResults that have 0 overallScore
// but have individual dimension scores (meaning the evaluation was completed but scoring failed)
export async function POST() {
  try {
    // Find all results with overallScore = 0 but with non-zero dimension scores
    const brokenResults = await db.evaluationResult.findMany({
      where: {
        overallScore: 0,
        recommendation: 'PENDIENTE',
      },
      include: {
        position: { select: { hasKnowledgeTest: true } },
      },
    })

    console.log(`Found ${brokenResults.length} results to recalculate`)

    const updated = []

    for (const result of brokenResults) {
      // Skip if all dimensions are 0 (truly pending, no data)
      const hasData = result.openness > 0 || result.conscientiousness > 0 ||
        result.extraversion > 0 || result.empathy > 0 || result.teamwork > 0

      if (!hasData) continue

      // Calculate psicometrica average (Big Five)
      const psicometricaAvg =
        ((100 - result.neuroticism) +
          result.openness +
          result.conscientiousness +
          result.extraversion +
          result.agreeableness) / 5

      // Calculate psicologica average
      const psicologicaAvg =
        (result.stressLevel +
          result.empathy +
          result.adaptability +
          result.leadership +
          result.teamwork) / 5

      // Calculate overall score with same weights as public/apply and public/video
      let overallScore: number
      if (result.knowledgeScore !== null && result.knowledgeScore > 0) {
        overallScore = 0.30 * psicometricaAvg + 0.30 * psicologicaAvg + 0.40 * result.knowledgeScore
      } else {
        overallScore = 0.50 * psicometricaAvg + 0.50 * psicologicaAvg
      }

      // Determine recommendation
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

      if (result.extraversion >= 70) parts.push('alta extraversión')
      if (result.conscientiousness >= 70) parts.push('alta responsabilidad')
      if (result.openness >= 70) parts.push('alta apertura a la experiencia')
      if (result.agreeableness >= 70) parts.push('alta amabilidad')
      if (result.empathy >= 70) parts.push('buena empatía')
      if (result.teamwork >= 70) parts.push('buen trabajo en equipo')
      if (result.adaptability >= 70) parts.push('buena adaptabilidad')
      if (result.leadership >= 70) parts.push('buen liderazgo')

      if (result.stressLevel > 60) concerns.push('nivel de estrés elevado')
      if (result.neuroticism > 60) concerns.push('alto neuroticismo')
      if (result.empathy < 40) concerns.push('baja empatía')
      if (result.teamwork < 40) concerns.push('bajo trabajo en equipo')
      if (result.adaptability < 40) concerns.push('baja adaptabilidad')

      let summary = ''
      if (parts.length > 0) summary += `Candidato con ${parts.join(', ')}. `
      if (concerns.length > 0) summary += `Se detectaron ${concerns.join(', ')}. `

      if (result.knowledgeScore !== null && result.knowledgeScore > 0) {
        if (result.knowledgeScore >= 80) {
          summary += `Excelente dominio de conocimientos técnicos (${Math.round(result.knowledgeScore)}%). `
        } else if (result.knowledgeScore >= 60) {
          summary += `Conocimientos técnicos aceptables (${Math.round(result.knowledgeScore)}%). `
        } else {
          summary += `Conocimientos técnicos por debajo del estándar (${Math.round(result.knowledgeScore)}%). `
        }
      }

      summary += `Puntuación general: ${Math.round(overallScore)}. Recomendación: ${recommendation === 'APTO' ? 'Apto' : recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista adicional' : 'No recomendado'}.`

      // Update the result
      const updatedResult = await db.evaluationResult.update({
        where: { id: result.id },
        data: {
          overallScore: Math.round(overallScore * 100) / 100,
          recommendation,
          summary,
        },
      })

      updated.push({
        id: result.id,
        candidateName: result.candidateName,
        oldScore: 0,
        newScore: updatedResult.overallScore,
        recommendation: updatedResult.recommendation,
      })
    }

    return NextResponse.json({
      success: true,
      recalculated: updated.length,
      results: updated,
    })
  } catch (error) {
    console.error('Recalculate error:', error)
    return NextResponse.json({ error: 'Error recalculating scores' }, { status: 500 })
  }
}
