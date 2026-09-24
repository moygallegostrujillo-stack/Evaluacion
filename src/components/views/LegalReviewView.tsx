'use client'

/**
 * LegalReviewView — Sección de descarga del expediente jurídico
 * (LEGAL MASTER PACKAGE).
 *
 * REGLA DURA: los 32 documentos están marcados BORRADOR PARA ABOGADO;
 * ninguno está aprobado. 17 requieren REVISIÓN OBLIGATORIA según el encargo:
 * 01 (marco), 04/08 (roles/contrato), 05/06 (consentimiento/aviso),
 * 10 (sensibles), 14/25 (art. 26), 15 (plazos), 17/18
 * (subencargados/transferencias), 19 (incidentes), 20–24 (instrumentos).
 *
 * Esta vista SOLO descarga documentos: no modifica contrato, aviso,
 * código ni schema. El dictamen corresponde al abogado profesional.
 */

import React, { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  BadgeCheck,
  Download,
  FileSpreadsheet,
  FileText,
  FileWarning,
  FolderArchive,
  Gavel,
  Info,
  Lock,
  RefreshCw,
  Scale,
} from 'lucide-react'

interface LegalDocRow {
  id: string
  filename: string
  title: string
  topic: string
  reviewLevel: 'REVISION_OBLIGATORIA' | 'BORRADOR_ABOGADO'
  reviewScope?: string
  category: string
  exists: boolean
  sizeBytes: number
  modifiedAt: string | null
}

interface LegalAnnexRow {
  id: string
  filename: string
  title: string
  format: 'CSV' | 'MD' | 'TXT'
  description: string
  exists: boolean
  sizeBytes: number
  modifiedAt: string | null
}

interface LegalDocumentsResponse {
  package: {
    name: string
    status: string
    resultState: string
    systemState: string
    disclaimer: string
    documentsCount: number
    mandatoryReviewCount: number
    draftCount: number
    annexCount: number
  }
  zip: { filename: string; exists: boolean; sizeBytes: number; modifiedAt: string | null }
  documents: LegalDocRow[]
  annexes: LegalAnnexRow[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

/** Fila de documento del expediente (00–31) */
function DocumentRow({ doc }: { doc: LegalDocRow }) {
  const mandatory = doc.reviewLevel === 'REVISION_OBLIGATORIA'
  return (
    <div
      className={`flex items-start sm:items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        mandatory
          ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {/* Número */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
          mandatory ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
        }`}
        aria-hidden="true"
      >
        {doc.id}
      </div>

      {/* Título + tema */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{doc.title}</p>
          {mandatory ? (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 gap-1">
              <FileWarning className="w-3 h-3" /> Revisión obligatoria
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-500 border-gray-300">
              Borrador
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{doc.topic}</p>
        {mandatory && doc.reviewScope && (
          <p className="text-xs text-amber-700 mt-1 font-medium">
            Ámbito: {doc.reviewScope}
          </p>
        )}
      </div>

      {/* Metadatos + descarga */}
      <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex flex-col items-end text-xs text-gray-400">
          <span>{formatBytes(doc.sizeBytes)}</span>
          <span>{formatDate(doc.modifiedAt)}</span>
        </div>
        {doc.exists ? (
          <a
            href={`/api/legal/download?doc=${encodeURIComponent(doc.id)}`}
            download={doc.filename}
            aria-label={`Descargar documento ${doc.id}: ${doc.title}`}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-medium transition-colors min-w-[44px] min-h-[44px] sm:min-h-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar</span>
          </a>
        ) : (
          <Badge variant="outline" className="text-red-500 border-red-200">
            No disponible
          </Badge>
        )}
      </div>
    </div>
  )
}

/** Fila de anexo (CSV / plantillas / checksum) */
function AnnexRow({ annex }: { annex: LegalAnnexRow }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
        {annex.format === 'CSV' ? (
          <FileSpreadsheet className="w-4 h-4" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{annex.title}</p>
          <Badge variant="outline" className="text-teal-600 border-teal-200">
            {annex.format}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{annex.description}</p>
        <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{annex.filename}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end text-xs text-gray-400">
          <span>{formatBytes(annex.sizeBytes)}</span>
          <span>{formatDate(annex.modifiedAt)}</span>
        </div>
        {annex.exists ? (
          <a
            href={`/api/legal/download?doc=${encodeURIComponent(annex.id)}`}
            download={annex.filename}
            aria-label={`Descargar anexo: ${annex.title}`}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-medium transition-colors min-w-[44px] min-h-[44px] sm:min-h-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar</span>
          </a>
        ) : (
          <Badge variant="outline" className="text-red-500 border-red-200">
            No disponible
          </Badge>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  tone: 'total' | 'mandatory' | 'draft' | 'annex'
}) {
  const tones: Record<string, string> = {
    total: 'bg-emerald-50 text-emerald-700',
    mandatory: 'bg-amber-50 text-amber-700',
    draft: 'bg-gray-100 text-gray-600',
    annex: 'bg-teal-50 text-teal-700',
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
      </div>
    </div>
  )
}

export default function LegalReviewView() {
  const user = useAppStore((s) => s.user)
  const { toast } = useToast()
  const [data, setData] = useState<LegalDocumentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/legal/documents')
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      const body = (await res.json()) as LegalDocumentsResponse
      setData(body)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast({
        title: 'Error al cargar el expediente',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const mandatoryDocs = data?.documents.filter(
    (d) => d.reviewLevel === 'REVISION_OBLIGATORIA'
  ) ?? []
  const draftDocs = data?.documents.filter(
    (d) => d.reviewLevel === 'BORRADOR_ABOGADO'
  ) ?? []

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revisión Legal</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Expediente jurídico — Legal Master Package · Documentos para dictamen profesional
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 gap-1">
                <FileWarning className="w-3 h-3" /> BORRADOR PARA ABOGADO
              </Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 gap-1">
                <BadgeCheck className="w-3 h-3" /> READY_FOR_LAWYER_REVIEW
              </Badge>
              <Badge variant="outline" className="text-gray-500 border-gray-300 gap-1">
                <Lock className="w-3 h-3" /> Solo {isSuperAdmin ? 'RH / Super Admin' : 'RH'}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadDocuments}
          disabled={loading}
          className="gap-2 self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Advertencia dura */}
      <Alert className="border-amber-300 bg-amber-50">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <AlertTitle className="text-amber-900 font-semibold">
          Ningún documento está aprobado
        </AlertTitle>
        <AlertDescription className="text-amber-800 text-sm leading-relaxed">
          Los {data?.package.documentsCount ?? 32} documentos del expediente son{' '}
          <strong>BORRADOR PARA ABOGADO</strong> y requieren revisión de abogado profesional
          (datos personales / protección de datos, derecho laboral, contratos SaaS y
          regulación de IA en México). Ningún documento constituye dictamen, aprobación
          ni asesoría legal. Este expediente no modifica el contrato real, el aviso real
          ni el código del sistema.
        </AlertDescription>
      </Alert>

      {/* Estado de carga */}
      {loading && !data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-12 rounded-lg" />
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-red-200">
          <CardContent className="py-8 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-gray-700 font-medium">No se pudo cargar el expediente</p>
            <p className="text-xs text-gray-500">{error}</p>
            <Button variant="outline" size="sm" onClick={loadDocuments} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contenido */}
      {data && (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={<Gavel className="w-5 h-5" />}
              value={data.package.documentsCount}
              label="Documentos del expediente (00–31)"
              tone="total"
            />
            <StatCard
              icon={<FileWarning className="w-5 h-5" />}
              value={data.package.mandatoryReviewCount}
              label="Revisión obligatoria del abogado"
              tone="mandatory"
            />
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              value={data.package.draftCount}
              label="Borrador para abogado"
              tone="draft"
            />
            <StatCard
              icon={<FileSpreadsheet className="w-5 h-5" />}
              value={data.package.annexCount}
              label="Anexos y matrices CSV"
              tone="annex"
            />
          </div>

          {/* Paquete completo */}
          <Card className="border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderArchive className="w-5 h-5 text-emerald-600" />
                Paquete completo para el abogado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                Descarga el expediente íntegro (32 documentos + matrices CSV + guía de lectura
                y plantilla de respuesta) en un solo archivo. El estado del sistema es{' '}
                <strong>{data.package.systemState}</strong> y el resultado permitido es{' '}
                <strong>{data.package.resultState}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {data.zip.exists ? (
                  <a
                    href="/api/legal/download-package"
                    download={data.zip.filename}
                    className="flex-1 flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors min-h-[44px]"
                  >
                    <FolderArchive className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        Descargar paquete ZIP
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.zip.filename} · {formatBytes(data.zip.sizeBytes)}
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  </a>
                ) : (
                  <div className="flex-1 flex items-center gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700 font-medium">
                      El ZIP del paquete no está disponible en el servidor
                    </p>
                  </div>
                )}
                <a
                  href="/api/legal/download?doc=annex-sha256"
                  download
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  <BadgeCheck className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">SHA-256</p>
                    <p className="text-xs text-gray-500">Verificación de integridad</p>
                  </div>
                  <Download className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </a>
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                El ZIP excluye secretos, llaves API y datos reales de candidatos. Verifica la
                suma SHA-256 antes de remitirlo al abogado.
              </p>
            </CardContent>
          </Card>

          {/* Documentos por nivel de revisión */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Documentos del expediente</CardTitle>
              <p className="text-sm text-gray-500">
                Los 32 documentos están marcados <strong>BORRADOR PARA ABOGADO</strong>. Los que
                tienen <span className="text-amber-700 font-medium">revisión obligatoria</span>{' '}
                no pueden dictaminarse sin leerlos completos.
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mandatory" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="mandatory" className="gap-1.5 text-xs sm:text-sm">
                    <FileWarning className="w-3.5 h-3.5" />
                    Obligatoria ({mandatoryDocs.length})
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="gap-1.5 text-xs sm:text-sm">
                    <FileText className="w-3.5 h-3.5" />
                    Borrador ({draftDocs.length})
                  </TabsTrigger>
                  <TabsTrigger value="annexes" className="gap-1.5 text-xs sm:text-sm">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Anexos ({data.annexes.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mandatory" className="mt-0">
                  <Alert className="mb-3 border-amber-200 bg-amber-50/60">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-xs text-amber-800">
                      Revisión obligatoria según el encargo: 01 marco · 04/08 roles y contrato ·
                      05/06 consentimiento y aviso · 10 sensibles · 14/25 art. 26 · 15 plazos ·
                      17/18 subencargados y transferencias · 19 incidentes · 20–24 instrumentos.
                    </AlertDescription>
                  </Alert>
                  <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1 legal-scroll">
                    {mandatoryDocs.map((doc) => (
                      <DocumentRow key={doc.id} doc={doc} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="draft" className="mt-0">
                  <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1 legal-scroll">
                    {draftDocs.map((doc) => (
                      <DocumentRow key={doc.id} doc={doc} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="annexes" className="mt-0">
                  <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1 legal-scroll">
                    {data.annexes.map((annex) => (
                      <AnnexRow key={annex.id} annex={annex} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Cómo proceder */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gavel className="w-5 h-5 text-emerald-600" />
                Cómo proceder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                <li>
                  Descarga el paquete ZIP completo y verifica la suma SHA-256.
                </li>
                <li>
                  Remítelo a abogado profesional (protección de datos, laboral, contratos SaaS e IA).
                </li>
                <li>
                  El abogado responde con la plantilla{' '}
                  <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                    LAWYER-REVIEW-RESPONSE.md
                  </code>{' '}
                  (APPROVE / APPROVE_WITH_CHANGES / REJECT / NEEDS_MORE_INFORMATION).
                </li>
                <li>
                  Solo después del dictamen se ejecuta la checklist de implementación
                  (documento 30) — <strong>nada se implementa hoy</strong>.
                </li>
              </ol>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
