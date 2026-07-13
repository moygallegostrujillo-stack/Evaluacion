import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

// ============================================
// POST - Upload video (public, NO auth)
// ============================================

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const applicationId = formData.get('applicationId') as string | null
    const video = formData.get('video') as File | null
    const videoType = formData.get('videoType') as string | null

    if (!applicationId || !video) {
      return NextResponse.json(
        { error: 'applicationId and video are required' },
        { status: 400 }
      )
    }

    // Verify application exists
    const application = await db.vacancyApplication.findUnique({
      where: { id: applicationId },
      include: { vacancy: true },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate filename
    const timestamp = Date.now()
    const ext = video.name?.endsWith('.mp4') ? 'mp4' : 'webm'
    const filename = `${applicationId}-${timestamp}.${ext}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    const arrayBuffer = await video.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filepath, buffer)

    // Update application with video info
    await db.vacancyApplication.update({
      where: { id: applicationId },
      data: {
        videoUrl: `/uploads/videos/${filename}`,
        videoType: videoType || 'RECORDED',
        currentStep: 5, // Move to done step
      },
    })

    // Calculate final scores if all steps are done
    // The overall score should already have been calculated when completing step 3
    // But if the video step is the last, ensure we calculate overall
    const updatedApp = await db.vacancyApplication.findUnique({
      where: { id: applicationId },
    })

    if (updatedApp && updatedApp.overallScore === 0) {
      // Recalculate overall score
      const psicometricaAvg =
        (100 - updatedApp.neuroticism +
          updatedApp.openness +
          updatedApp.conscientiousness +
          updatedApp.extraversion +
          updatedApp.agreeableness) / 5

      const psicologicaAvg =
        (updatedApp.stressLevel +
          updatedApp.empathy +
          updatedApp.adaptability +
          updatedApp.leadership +
          updatedApp.teamwork) / 5

      let overallScore: number
      if (updatedApp.knowledgeScore !== null) {
        overallScore = 0.30 * psicometricaAvg + 0.30 * psicologicaAvg + 0.40 * updatedApp.knowledgeScore
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

      if (updatedApp.extraversion >= 70) parts.push('alta extraversión')
      if (updatedApp.conscientiousness >= 70) parts.push('alta responsabilidad')
      if (updatedApp.openness >= 70) parts.push('alta apertura a la experiencia')
      if (updatedApp.agreeableness >= 70) parts.push('alta amabilidad')
      if (updatedApp.empathy >= 70) parts.push('buena empatía')
      if (updatedApp.teamwork >= 70) parts.push('buen trabajo en equipo')
      if (updatedApp.adaptability >= 70) parts.push('buena adaptabilidad')
      if (updatedApp.leadership >= 70) parts.push('buen liderazgo')

      if (updatedApp.stressLevel > 60) concerns.push('nivel de estrés elevado')
      if (updatedApp.neuroticism > 60) concerns.push('alto neuroticismo')
      if (updatedApp.empathy < 40) concerns.push('baja empatía')
      if (updatedApp.teamwork < 40) concerns.push('bajo trabajo en equipo')
      if (updatedApp.adaptability < 40) concerns.push('baja adaptabilidad')

      let summary = ''
      if (parts.length > 0) summary += `Candidato con ${parts.join(', ')}. `
      if (concerns.length > 0) summary += `Se detectaron ${concerns.join(', ')}. `

      if (updatedApp.knowledgeScore !== null) {
        if (updatedApp.knowledgeScore >= 80) {
          summary += `Excelente dominio de conocimientos técnicos (${updatedApp.knowledgeScore}%). `
        } else if (updatedApp.knowledgeScore >= 60) {
          summary += `Conocimientos técnicos aceptables (${updatedApp.knowledgeScore}%). `
        } else {
          summary += `Conocimientos técnicos por debajo del estándar (${updatedApp.knowledgeScore}%). `
        }
      }

      summary += `Puntuación general: ${Math.round(overallScore)}. Recomendación: ${recommendation === 'APTO' ? 'Apto' : recommendation === 'ENTREVISTA_ADICIONAL' ? 'Entrevista adicional' : 'No recomendado'}.`

      await db.vacancyApplication.update({
        where: { id: applicationId },
        data: {
          overallScore: Math.round(overallScore * 100) / 100,
          recommendation,
          summary,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
