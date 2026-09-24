import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { getAuthFromHeaders, hasRole } from '@/lib/auth'
import { LEGAL_PACKAGE_ZIP, LEGAL_PACKAGE_NAME } from '@/lib/legal-package'

/**
 * GET /api/legal/download-package
 * Descarga el ZIP completo del expediente jurídico
 * (EVALUHR-LEGAL-MASTER-PACKAGE.zip) + suma SHA-256 en cabecera.
 *
 * CONFIDENCIAL: solo RH / SUPER_ADMIN (cookie httpOnly vía middleware).
 * El ZIP es BORRADOR PARA ABOGADO — ninguno de sus documentos está aprobado.
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

  try {
    const root = process.cwd()
    const zipPath = join(root, LEGAL_PACKAGE_ZIP)

    const s = await stat(zipPath)
    if (!s.isFile()) {
      return NextResponse.json(
        { error: 'Paquete ZIP no disponible' },
        { status: 404 }
      )
    }

    const fileBuffer = await readFile(zipPath)

    // Intentar adjuntar la suma SHA-256 oficial del paquete (si existe).
    let sha256: string | null = null
    try {
      const checksumFile = await readFile(
        join(root, `${LEGAL_PACKAGE_NAME}.SHA256.txt`),
        'utf-8'
      )
      const match = checksumFile.match(/^([a-f0-9]{64})\s+/i)
      if (match) sha256 = match[1]
    } catch {
      // Sin archivo de checksum — no se inventa la suma.
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${LEGAL_PACKAGE_ZIP}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Package-Status': 'BORRADOR-PARA-ABOGADO',
        ...(sha256 ? { 'X-File-SHA256': sha256 } : {}),
      },
    })
  } catch (error) {
    console.error('Legal package download error:', error)
    return NextResponse.json(
      { error: 'Error al descargar el paquete legal' },
      { status: 500 }
    )
  }
}
