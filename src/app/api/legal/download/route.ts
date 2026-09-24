import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { getAuthFromHeaders, hasRole } from '@/lib/auth'
import { LEGAL_DOCS, LEGAL_ANNEXES } from '@/lib/legal-package'

/**
 * GET /api/legal/download?doc=<id>
 * Descarga un documento del expediente jurídico.
 *
 * SEGURIDAD:
 * - CONFIDENCIAL: solo RH / SUPER_ADMIN (cookie httpOnly vía middleware).
 * - El id se resuelve contra una lista blanca fija (nunca se construye
 *   una ruta desde el parámetro → sin path traversal).
 * - Todo archivo servido es BORRADOR PARA ABOGADO.
 */
export async function GET(req: NextRequest) {
  const auth = getAuthFromHeaders(req.headers)
  if (!auth) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  if (!hasRole(auth.role, ['RH', 'SUPER_ADMIN'])) {
    return NextResponse.json(
      { error: 'Acceso restringido a Recursos Humanos' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(req.url)
  const docId = searchParams.get('doc') || ''

  // Lista blanca: documentos 00–31 + anexos. Sin coincidencia → 404.
  const doc = LEGAL_DOCS.find((d) => d.id === docId)
  const annex = LEGAL_ANNEXES.find((a) => a.id === docId)

  if (!doc && !annex) {
    return NextResponse.json(
      { error: 'Documento no encontrado en el expediente legal' },
      { status: 404 }
    )
  }

  const filename = doc ? doc.filename : (annex as { filename: string }).filename
  const location = doc ? 'evidence-LEGAL-MASTER' : (annex as { location: string }).location
  const isCsv = filename.toLowerCase().endsWith('.csv')
  const isTxt = filename.toLowerCase().endsWith('.txt')
  const contentType = isCsv
    ? 'text/csv; charset=utf-8'
    : isTxt
      ? 'text/plain; charset=utf-8'
      : 'text/markdown; charset=utf-8'

  try {
    const root = process.cwd()
    const filePath =
      location === 'root'
        ? join(root, filename)
        : join(root, 'evidence-LEGAL-MASTER', filename)

    // Doble verificación: el archivo debe existir exactamente en esa ruta.
    const s = await stat(filePath)
    if (!s.isFile()) {
      return NextResponse.json({ error: 'Documento no disponible' }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Document-Status': 'BORRADOR-PARA-ABOGADO',
      },
    })
  } catch (error) {
    console.error('Legal document download error:', error)
    return NextResponse.json(
      { error: 'Error al descargar el documento legal' },
      { status: 500 }
    )
  }
}
