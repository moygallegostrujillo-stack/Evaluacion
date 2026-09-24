import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { join } from 'path'
import { getAuthFromHeaders, hasRole } from '@/lib/auth'
import {
  LEGAL_DOCS,
  LEGAL_ANNEXES,
  LEGAL_PACKAGE_NAME,
  LEGAL_PACKAGE_ZIP,
  MANDATORY_REVIEW_COUNT,
} from '@/lib/legal-package'

/**
 * GET /api/legal/documents
 * Lista el expediente jurídico (32 documentos + anexos) con estado real en disco.
 * CONFIDENCIAL: solo RH / SUPER_ADMIN. Todo documento es BORRADOR PARA ABOGADO.
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
    const legalDir = join(root, 'evidence-LEGAL-MASTER')

    async function describe(path: string) {
      try {
        const s = await stat(path)
        return { exists: true, sizeBytes: s.size, modifiedAt: s.mtime.toISOString() }
      } catch {
        return { exists: false, sizeBytes: 0, modifiedAt: null }
      }
    }

    const documents = await Promise.all(
      LEGAL_DOCS.map(async (doc) => ({
        ...doc,
        ...(await describe(join(legalDir, doc.filename))),
      }))
    )

    const annexes = await Promise.all(
      LEGAL_ANNEXES.map(async (annex) => ({
        ...annex,
        ...(await describe(
          annex.location === 'root'
            ? join(root, annex.filename)
            : join(legalDir, annex.filename)
        )),
      }))
    )

    const zipInfo = await describe(join(root, LEGAL_PACKAGE_ZIP))

    return NextResponse.json({
      package: {
        name: LEGAL_PACKAGE_NAME,
        status: 'BORRADOR PARA ABOGADO — NINGÚN DOCUMENTO APROBADO',
        resultState: 'READY_FOR_LAWYER_REVIEW',
        systemState: 'DEMO EN DESARROLLO — NO EN PRODUCCIÓN',
        disclaimer:
          'Todo documento es borrador para revisión de abogado profesional. Ningún documento constituye dictamen, aprobación ni asesoría legal. Este expediente no modifica el contrato real, el aviso real ni el código del sistema.',
        documentsCount: LEGAL_DOCS.length,
        mandatoryReviewCount: MANDATORY_REVIEW_COUNT,
        draftCount: LEGAL_DOCS.length - MANDATORY_REVIEW_COUNT,
        annexCount: LEGAL_ANNEXES.length,
      },
      zip: {
        filename: LEGAL_PACKAGE_ZIP,
        ...zipInfo,
      },
      documents,
      annexes,
    })
  } catch (error) {
    console.error('Legal documents listing error:', error)
    return NextResponse.json(
      { error: 'Error al listar el expediente legal' },
      { status: 500 }
    )
  }
}
