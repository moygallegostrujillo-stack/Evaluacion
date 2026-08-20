import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const doc = searchParams.get('doc')

    const documents: Record<string, { file: string; name: string; type: string }> = {
      'aviso-privacidad': {
        file: 'Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf',
        name: 'Aviso_de_Privacidad_Consentimiento_EvaluHR.pdf',
        type: 'application/pdf',
      },
    }

    const docConfig = documents[doc || '']
    if (!docConfig) {
      return NextResponse.json(
        { error: 'Documento no encontrado', available: Object.keys(documents) },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), 'public', docConfig.file)
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': docConfig.type,
        'Content-Disposition': `attachment; filename="${docConfig.name}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Error al descargar documento' }, { status: 500 })
  }
}
