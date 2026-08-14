'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { apiFetch, apiPost, apiPut, apiPatch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Building2, Users, UserPlus, Plus, RefreshCw,
  Briefcase, Hash, CheckCircle2, XCircle, Mail, Phone,
  Pencil, KeyRound, ShieldOff, ShieldCheck, Trash2, AlertTriangle,
  MoreVertical, Eye, EyeOff, Copy, Check, UserCog, Lock,
  ShieldAlert, UserX, RotateCcw, Power, PowerOff
} from 'lucide-react'

interface CompanyData {
  id: string
  name: string
  sector: string
  plan: string
  active: boolean
  phone?: string
  address?: string
  city: string
  state: string
  country: string
  maxCandidatesPerMonth: number
  _count?: {
    users: number
    positions: number
    vacancies: number
  }
}

interface UserData {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  companyId?: string
  active: boolean
  createdAt?: string
  company?: { id: string; name: string }
}

/** Generate a random temporary password */
function generateTempPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

export default function CompanyManagementView() {
  const user = useAppStore((s) => s.user)
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  // Create company form
  const [showCreateCompany, setShowCreateCompany] = useState(false)
  const [companyForm, setCompanyForm] = useState({
    name: '',
    sector: 'RESTAURANT',
    plan: 'BASIC',
    phone: '',
    address: '',
    city: 'Tuxtla Gutiérrez',
    state: 'Chiapas',
    country: 'México',
  })
  const [creatingCompany, setCreatingCompany] = useState(false)

  // Create user form
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'RH',
    companyId: '',
    phone: '',
  })
  const [creatingUser, setCreatingUser] = useState(false)

  // Temporary password display after creation
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [tempPasswordInfo, setTempPasswordInfo] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [passwordCopied, setPasswordCopied] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Edit user modal
  const [showEditUser, setShowEditUser] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'RH',
    companyId: '',
  })
  const [editingUser, setEditingUser] = useState(false)

  // Change password modal
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    id: '',
    name: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordText, setShowPasswordText] = useState(false)

  // Reset password (generate random)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetPasswordInfo, setResetPasswordInfo] = useState({
    id: '',
    name: '',
    newPassword: '',
  })
  const [resettingPassword, setResettingPassword] = useState(false)
  const [resetCopied, setResetCopied] = useState(false)

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null)
  const [deletingUser, setDeletingUser] = useState(false)

  // Revoke access confirmation
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<UserData | null>(null)
  const [revokingAccess, setRevokingAccess] = useState(false)

  // Action loading per user
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const res = await apiFetch('/api/companies')
      const data = await res.json()
      if (data.companies) {
        setCompanies(data.companies)
      }
    } catch (err) {
      console.error('Error fetching companies:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (companyId?: string) => {
    try {
      const url = companyId ? `/api/users?companyId=${companyId}` : '/api/users'
      const res = await apiFetch(url)
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    fetchUsers(selectedCompanyId || undefined)
  }, [selectedCompanyId])

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreatingCompany(true)

    try {
      const res = await apiPost('/api/companies', companyForm)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear empresa')
        return
      }

      setSuccess(`Empresa "${data.company.name}" creada exitosamente`)
      setShowCreateCompany(false)
      setCompanyForm({
        name: '',
        sector: 'RESTAURANT',
        plan: 'BASIC',
        phone: '',
        address: '',
        city: 'Tuxtla Gutiérrez',
        state: 'Chiapas',
        country: 'México',
      })
      await fetchCompanies()
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setCreatingCompany(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreatingUser(true)

    try {
      const res = await apiPost('/api/users', userForm)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear usuario')
        return
      }

      // Show the temporary password dialog
      setTempPasswordInfo({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
      })
      setShowTempPassword(true)
      setShowCreateUser(false)
      setUserForm({
        email: '',
        name: '',
        password: '',
        role: 'RH',
        companyId: '',
        phone: '',
      })
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setCreatingUser(false)
    }
  }

  // Edit user handler
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEditingUser(true)

    try {
      const res = await apiPut('/api/users', {
        id: editForm.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        companyId: editForm.companyId,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al editar usuario')
        return
      }

      setSuccess(`Usuario "${editForm.name}" actualizado exitosamente`)
      setShowEditUser(false)
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setEditingUser(false)
    }
  }

  const openEditModal = (u: UserData) => {
    setEditForm({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
      companyId: u.companyId || '',
    })
    setError('')
    setShowEditUser(true)
  }

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setChangingPassword(true)

    try {
      const res = await apiPatch('/api/users', {
        id: passwordForm.id,
        action: 'change_password',
        newPassword: passwordForm.newPassword,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al cambiar contraseña')
        return
      }

      setSuccess('Contraseña actualizada exitosamente')
      setShowChangePassword(false)
      setPasswordForm({ id: '', name: '', newPassword: '', confirmPassword: '' })
      setShowPasswordText(false)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setChangingPassword(false)
    }
  }

  const openPasswordModal = (u: UserData) => {
    setPasswordForm({
      id: u.id,
      name: u.name,
      newPassword: '',
      confirmPassword: '',
    })
    setError('')
    setShowPasswordText(false)
    setShowChangePassword(true)
  }

  // Reset password handler (generate random)
  const handleResetPassword = async () => {
    if (!resetPasswordInfo.id) return
    setError('')
    setSuccess('')
    setResettingPassword(true)

    try {
      const res = await apiPatch('/api/users', {
        id: resetPasswordInfo.id,
        action: 'change_password',
        newPassword: resetPasswordInfo.newPassword,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al restablecer contraseña')
        return
      }

      setSuccess(`Contraseña restablecida para "${resetPasswordInfo.name}"`)
      setShowResetPassword(false)
      setResetPasswordInfo({ id: '', name: '', newPassword: '' })
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setResettingPassword(false)
    }
  }

  const openResetPasswordModal = (u: UserData) => {
    const newPwd = generateTempPassword(12)
    setResetPasswordInfo({
      id: u.id,
      name: u.name,
      newPassword: newPwd,
    })
    setResetCopied(false)
    setError('')
    setShowResetPassword(true)
  }

  // Toggle access handler
  const handleToggleAccess = async (u: UserData) => {
    setError('')
    setSuccess('')
    setRevokingAccess(true)

    try {
      const res = await apiPatch('/api/users', {
        id: u.id,
        action: 'toggle_access',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al cambiar acceso')
        return
      }

      setSuccess(u.active ? `Acceso revocado para "${u.name}"` : `Acceso restaurado para "${u.name}"`)
      setShowRevokeConfirm(false)
      setRevokeTarget(null)
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setRevokingAccess(false)
    }
  }

  // Delete user handler
  const handleDeleteUser = async () => {
    if (!deleteTarget) return
    setError('')
    setSuccess('')
    setDeletingUser(true)

    try {
      const res = await apiPatch('/api/users', {
        id: deleteTarget.id,
        action: 'delete',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al eliminar usuario')
        return
      }

      setSuccess(`Usuario "${deleteTarget.name}" eliminado permanentemente`)
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setDeletingUser(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId)
  const companyUsers = selectedCompanyId
    ? users.filter(u => u.companyId === selectedCompanyId)
    : users

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Acceso no autorizado</p>
      </div>
    )
  }

  const roleLabel = (role: string) => {
    switch (role) {
      case 'RH': return 'Recursos Humanos'
      case 'GERENTE': return 'Gerente / Admin Sucursal'
      case 'SUPER_ADMIN': return 'Super Admin'
      default: return role
    }
  }

  const roleBadgeColor = (role: string) => {
    switch (role) {
      case 'RH': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'GERENTE': return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'SUPER_ADMIN': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return ''
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
            <p className="text-gray-500 text-sm mt-1">
              Crea empresas y asigna administradores para cada una
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { fetchCompanies(); fetchUsers(selectedCompanyId || undefined); }}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Actualizar
            </Button>
            <Dialog open={showCreateCompany} onOpenChange={setShowCreateCompany}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-1" /> Nueva Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Empresa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCompany} className="space-y-4 mt-2">
                  <div>
                    <Label htmlFor="company-name">Nombre *</Label>
                    <Input
                      id="company-name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ej: Restaurante El Sazón"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="company-sector">Sector</Label>
                      <Select
                        value={companyForm.sector}
                        onValueChange={(v) => setCompanyForm(f => ({ ...f, sector: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESTAURANT">Restaurante</SelectItem>
                          <SelectItem value="RETAIL">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company-plan">Plan</Label>
                      <Select
                        value={companyForm.plan}
                        onValueChange={(v) => setCompanyForm(f => ({ ...f, plan: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Básico</SelectItem>
                          <SelectItem value="PRO">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company-phone">Teléfono</Label>
                    <Input
                      id="company-phone"
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+52 961 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-address">Dirección</Label>
                    <Input
                      id="company-address"
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Av. Central #123"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="company-city">Ciudad</Label>
                      <Input
                        id="company-city"
                        value={companyForm.city}
                        onChange={(e) => setCompanyForm(f => ({ ...f, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-state">Estado</Label>
                      <Input
                        id="company-state"
                        value={companyForm.state}
                        onChange={(e) => setCompanyForm(f => ({ ...f, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateCompany(false)}>Cancelar</Button>
                    <Button type="submit" disabled={creatingCompany || !companyForm.name} className="bg-emerald-600 hover:bg-emerald-700">
                      {creatingCompany ? 'Creando...' : 'Crear Empresa'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Success/Error messages */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-700">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-emerald-600 hover:text-emerald-800 text-lg">&times;</button>
          </div>
        )}
        {error && !showCreateCompany && !showCreateUser && !showEditUser && !showChangePassword && !showDeleteConfirm && !showResetPassword && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800 text-lg">&times;</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-xs text-gray-500">Empresas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role !== 'CANDIDATO').length}</p>
                <p className="text-xs text-gray-500">Administradores</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {companies.reduce((sum, c) => sum + (c._count?.positions || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">Posiciones</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies List + Users Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Cards */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Empresas
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : companies.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No hay empresas</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Crea tu primera empresa haciendo clic en &quot;Nueva Empresa&quot;
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCompanyId === company.id
                        ? 'ring-2 ring-emerald-500 border-emerald-200'
                        : ''
                    }`}
                    onClick={() => setSelectedCompanyId(
                      selectedCompanyId === company.id ? null : company.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{company.name}</h3>
                            <Badge variant={company.active ? 'default' : 'secondary'} className="text-xs">
                              {company.active ? 'Activa' : 'Inactiva'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {company.sector === 'RESTAURANT' ? 'Restaurante' : 'Retail'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {company.plan}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {company.city}, {company.state}, {company.country}
                          </p>
                          {company.phone && (
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {company.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-900">{company._count?.users || 0}</p>
                            <p className="text-xs text-gray-500">Usuarios</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">{company._count?.positions || 0}</p>
                            <p className="text-xs text-gray-500">Posiciones</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">{company._count?.vacancies || 0}</p>
                            <p className="text-xs text-gray-500">Vacantes</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Users Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedCompany ? `Admins de ${selectedCompany.name}` : 'Todos los Admins'}
              </h2>
              <Dialog open={showCreateUser} onOpenChange={(open) => { setShowCreateUser(open); if (open && selectedCompanyId && !userForm.companyId) { setUserForm(f => ({ ...f, companyId: selectedCompanyId })); } }}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <UserPlus className="w-4 h-4 mr-1" /> Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Administrador</DialogTitle>
                    <DialogDescription>
                      Crea un nuevo administrador para una empresa. La contraseña se mostrará una sola vez después de crearlo.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="user-company">Empresa *</Label>
                      <Select
                        value={userForm.companyId || (selectedCompanyId || '')}
                        onValueChange={(v) => setUserForm(f => ({ ...f, companyId: v }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Seleccionar empresa" /></SelectTrigger>
                        <SelectContent>
                          {companies.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-name">Nombre completo *</Label>
                      <Input
                        id="user-name"
                        value={userForm.name}
                        onChange={(e) => setUserForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Ej: Eva Martínez"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Correo electrónico *</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="eva@empresa.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-password">Contraseña inicial *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="user-password"
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Mínimo 6 caracteres"
                          required
                          minLength={6}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => {
                            const pwd = generateTempPassword(12)
                            setUserForm(f => ({ ...f, password: pwd }))
                          }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Se mostrará una sola vez al crear el usuario</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="user-role">Rol</Label>
                        <Select
                          value={userForm.role}
                          onValueChange={(v) => setUserForm(f => ({ ...f, role: v }))}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RH">Recursos Humanos</SelectItem>
                            <SelectItem value="GERENTE">Gerente / Admin Sucursal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="user-phone">Teléfono</Label>
                        <Input
                          id="user-phone"
                          value={userForm.phone}
                          onChange={(e) => setUserForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+52 961..."
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateUser(false)}>Cancelar</Button>
                      <Button
                        type="submit"
                        disabled={creatingUser || !userForm.email || !userForm.name || !userForm.password || !userForm.companyId}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {creatingUser ? 'Creando...' : 'Crear Administrador'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* User List */}
            {companyUsers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {selectedCompany
                      ? 'No hay administradores para esta empresa'
                      : 'Selecciona una empresa para ver sus administradores'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {companyUsers
                  .filter(u => u.role !== 'CANDIDATO')
                  .map((u) => (
                  <Card key={u.id} className={`${u.active ? '' : 'opacity-70 border-red-200'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                          u.active
                            ? u.role === 'RH' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm text-gray-900">{u.name}</p>
                            <Badge className={`text-xs border ${roleBadgeColor(u.role)}`}>
                              {u.role === 'RH' ? 'RH' : u.role === 'GERENTE' ? 'Gerente' : u.role}
                            </Badge>
                            {!u.active && (
                              <Badge variant="destructive" className="text-xs">
                                Sin acceso
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {u.email}
                          </p>
                          {u.company && !selectedCompanyId && (
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {u.company.name}
                            </p>
                          )}
                          {u.phone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {u.phone}
                            </p>
                          )}
                        </div>

                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            {/* Edit */}
                            <DropdownMenuItem onClick={() => openEditModal(u)} className="cursor-pointer">
                              <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Editar usuario</span>
                            </DropdownMenuItem>

                            {/* Change Password */}
                            <DropdownMenuItem onClick={() => openPasswordModal(u)} className="cursor-pointer">
                              <KeyRound className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Cambiar contraseña</span>
                            </DropdownMenuItem>

                            {/* Reset Password */}
                            <DropdownMenuItem onClick={() => openResetPasswordModal(u)} className="cursor-pointer">
                              <RotateCcw className="w-4 h-4 mr-2 text-violet-500" />
                              <span>Restablecer contraseña</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Toggle Access */}
                            {u.active ? (
                              <DropdownMenuItem
                                onClick={() => { setRevokeTarget(u); setShowRevokeConfirm(true); }}
                                className="cursor-pointer text-amber-700 focus:text-amber-700"
                              >
                                <ShieldOff className="w-4 h-4 mr-2" />
                                <span>Revocar acceso</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => { setRevokeTarget(u); setShowRevokeConfirm(true); }}
                                className="cursor-pointer text-emerald-700 focus:text-emerald-700"
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                <span>Restaurar acceso</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={() => { setDeleteTarget(u); setShowDeleteConfirm(true); }}
                              className="cursor-pointer text-red-700 focus:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span>Eliminar usuario</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Quick Info */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-900 text-sm flex items-center gap-1">
                  <Hash className="w-4 h-4" /> Flujo de trabajo
                </h4>
                <ol className="mt-2 space-y-1 text-xs text-amber-800 list-decimal list-inside">
                  <li>Crea una empresa con <strong>&quot;Nueva Empresa&quot;</strong></li>
                  <li>Selecciona la empresa en la lista</li>
                  <li>Crea un administrador con <strong>&quot;Nuevo&quot;</strong></li>
                  <li>Guarda la contraseña temporal que se muestra</li>
                  <li>Usa el menú <strong>⋮</strong> para editar, cambiar contraseña o revocar acceso</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ============================================ */}
        {/* Temporary Password Dialog (after creation)  */}
        {/* ============================================ */}
        <Dialog open={showTempPassword} onOpenChange={setShowTempPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Administrador Creado
              </DialogTitle>
              <DialogDescription>
                Guarda esta contraseña. Por seguridad, no se volverá a mostrar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Nombre</p>
                  <p className="text-sm font-semibold text-emerald-900">{tempPasswordInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Correo</p>
                  <p className="text-sm font-semibold text-emerald-900">{tempPasswordInfo.email}</p>
                </div>
                <Separator className="bg-emerald-200" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">Contraseña temporal</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-lg font-mono font-bold text-emerald-900 bg-white px-3 py-1 rounded border border-emerald-200 flex-1 text-center tracking-wider">
                      {tempPasswordInfo.password}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={async () => {
                        const ok = await copyToClipboard(tempPasswordInfo.password)
                        if (ok) {
                          setPasswordCopied(true)
                          setTimeout(() => setPasswordCopied(false), 2000)
                        }
                      }}
                    >
                      {passwordCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Comparte estas credenciales de forma segura con el administrador
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowTempPassword(false)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Entendido, ya guardé la contraseña
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================================ */}
        {/* Edit User Modal                              */}
        {/* ============================================ */}
        <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-gray-700" />
                Editar Usuario
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="edit-name">Nombre completo *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Eva Martínez"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Correo electrónico *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="eva@empresa.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+52 961..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-role">Rol</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(v) => setEditForm(f => ({ ...f, role: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RH">Recursos Humanos</SelectItem>
                      <SelectItem value="GERENTE">Gerente / Admin Sucursal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-company">Empresa *</Label>
                  <Select
                    value={editForm.companyId}
                    onValueChange={(v) => setEditForm(f => ({ ...f, companyId: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Seleccionar empresa" /></SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-gray-50 border rounded-lg p-3 text-xs text-gray-600">
                <p className="font-medium mb-1">Nota sobre la contraseña:</p>
                <p>La contraseña no se puede ver porque está encriptada. Usa &quot;Cambiar contraseña&quot; o &quot;Restablecer contraseña&quot; desde el menú de opciones del usuario.</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditUser(false)}>Cancelar</Button>
                <Button
                  type="submit"
                  disabled={editingUser || !editForm.email || !editForm.name || !editForm.companyId}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingUser ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ============================================ */}
        {/* Change Password Modal                        */}
        {/* ============================================ */}
        <Dialog open={showChangePassword} onOpenChange={(open) => { setShowChangePassword(open); if (!open) setShowPasswordText(false); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-gray-700" />
                Cambiar Contraseña
              </DialogTitle>
              <DialogDescription>
                Establece una nueva contraseña para <strong>{passwordForm.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="new-password">Nueva contraseña *</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-password"
                    type={showPasswordText ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
                <Input
                  id="confirm-password"
                  type={showPasswordText ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repetir contraseña"
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setShowChangePassword(false); setShowPasswordText(false); }}>Cancelar</Button>
                <Button
                  type="submit"
                  disabled={changingPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ============================================ */}
        {/* Reset Password Modal (auto-generated)        */}
        {/* ============================================ */}
        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-violet-600" />
                Restablecer Contraseña
              </DialogTitle>
              <DialogDescription>
                Se generó una nueva contraseña temporal para <strong>{resetPasswordInfo.name}</strong>. 
                Guárdala ahora, no se volverá a mostrar.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <p className="text-xs text-violet-700 font-medium mb-1">Nueva contraseña temporal</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-violet-900 bg-white px-3 py-1 rounded border border-violet-200 flex-1 text-center tracking-wider">
                    {resetPasswordInfo.newPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={async () => {
                      const ok = await copyToClipboard(resetPasswordInfo.newPassword)
                      if (ok) {
                        setResetCopied(true)
                        setTimeout(() => setResetCopied(false), 2000)
                      }
                    }}
                  >
                    {resetCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Al confirmar, la contraseña anterior dejará de funcionar inmediatamente.
              </p>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowResetPassword(false)} disabled={resettingPassword}>
                Cancelar
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {resettingPassword ? 'Guardando...' : 'Confirmar nuevo contraseña'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================================ */}
        {/* Revoke/Restore Access Confirmation            */}
        {/* ============================================ */}
        <AlertDialog open={showRevokeConfirm} onOpenChange={(open) => { setShowRevokeConfirm(open); if (!open) setRevokeTarget(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {revokeTarget?.active ? (
                  <>
                    <ShieldOff className="w-5 h-5 text-amber-500" />
                    Revocar Acceso
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Restaurar Acceso
                  </>
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {revokeTarget?.active ? (
                  <>
                    ¿Estás seguro de revocar el acceso a <strong>{revokeTarget?.name}</strong>? 
                    El usuario no podrá iniciar sesión, pero su cuenta no será eliminada.
                  </>
                ) : (
                  <>
                    ¿Deseas restaurar el acceso de <strong>{revokeTarget?.name}</strong>? 
                    El usuario podrá iniciar sesión nuevamente.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={revokingAccess}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => revokeTarget && handleToggleAccess(revokeTarget)}
                disabled={revokingAccess}
                className={revokeTarget?.active 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
                }
              >
                {revokingAccess 
                  ? 'Procesando...' 
                  : revokeTarget?.active 
                    ? 'Sí, revocar acceso' 
                    : 'Sí, restaurar acceso'
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ============================================ */}
        {/* Delete Confirmation                          */}
        {/* ============================================ */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={(open) => { setShowDeleteConfirm(open); if (!open) setDeleteTarget(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="w-5 h-5" />
                Eliminar Usuario Permanentemente
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de eliminar a <strong>{deleteTarget?.name}</strong>? 
                Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todas sus evaluaciones, 
                resultados y datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingUser}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={deletingUser}
                className="bg-red-600 hover:bg-red-700"
              >
                {deletingUser ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
