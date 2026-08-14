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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2, Users, UserPlus, Plus, RefreshCw,
  Briefcase, Hash, CheckCircle2, XCircle, Mail, Phone,
  Pencil, KeyRound, ShieldOff, ShieldCheck, Trash2, AlertTriangle
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
  company?: { id: string; name: string }
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

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null)
  const [deletingUser, setDeletingUser] = useState(false)

  // Action loading per user (for toggle access)
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
      setCreatingUser(false)
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

      setSuccess(`Usuario "${data.user.name}" (${data.user.role}) creado exitosamente`)
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

      setSuccess('Contraseña actualizada')
      setShowChangePassword(false)
      setPasswordForm({ id: '', name: '', newPassword: '', confirmPassword: '' })
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
    setShowChangePassword(true)
  }

  // Toggle access handler
  const handleToggleAccess = async (u: UserData) => {
    setError('')
    setSuccess('')
    setActionLoadingId(u.id)

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

      setSuccess(u.active ? 'Acceso revocado' : 'Acceso restaurado')
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setActionLoadingId(null)
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

      setSuccess(`Usuario "${deleteTarget.name}" eliminado`)
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
      await fetchUsers(selectedCompanyId || undefined)
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setDeletingUser(false)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Crea empresas y asigna administradores (RH) para cada una
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
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-emerald-600 hover:text-emerald-800">×</button>
        </div>
      )}
      {error && !showCreateCompany && !showCreateUser && !showEditUser && !showChangePassword && !showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
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
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="w-5 h-5 text-blue-600" />
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

      {/* Companies List */}
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
                  <UserPlus className="w-4 h-4 mr-1" /> Nuevo Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Administrador</DialogTitle>
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
                      placeholder="Ej: María García"
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
                      placeholder="maria@empresa.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Contraseña *</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
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
                          <SelectItem value="GERENTE">Gerente</SelectItem>
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
                    : 'No hay administradores creados'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {companyUsers
                .filter(u => u.role !== 'CANDIDATO')
                .map((u) => (
                <Card key={u.id} className={u.active ? '' : 'opacity-60'}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">{u.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {u.role === 'RH' ? 'RH' : u.role === 'GERENTE' ? 'Gerente' : u.role}
                          </Badge>
                          {!u.active && (
                            <Badge variant="destructive" className="text-xs">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {u.email}
                        </p>
                        {u.company && !selectedCompanyId && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {u.company.name}
                          </p>
                        )}
                        {u.phone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {u.phone}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openEditModal(u)}
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openPasswordModal(u)}
                          title="Cambiar contraseña"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleToggleAccess(u)}
                          disabled={actionLoadingId === u.id}
                          title={u.active ? 'Revocar acceso' : 'Restaurar acceso'}
                        >
                          {u.active ? (
                            <ShieldOff className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => { setDeleteTarget(u); setShowDeleteConfirm(true); }}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
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
                <li>Crea una empresa con el botón <strong>&quot;Nueva Empresa&quot;</strong></li>
                <li>Selecciona la empresa en la lista</li>
                <li>Crea un administrador (RH) con <strong>&quot;Nuevo Admin&quot;</strong></li>
                <li>Comparte las credenciales con el administrador</li>
                <li>El admin entra y solo ve los datos de <strong>su empresa</strong></li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="edit-name">Nombre completo *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: María García"
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
                placeholder="maria@empresa.com"
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
                    <SelectItem value="GERENTE">Gerente</SelectItem>
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

      {/* Change Password Modal */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Cambiar contraseña para <strong>{passwordForm.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="new-password">Nueva contraseña *</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Repetir contraseña"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>Cancelar</Button>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={(open) => { setShowDeleteConfirm(open); if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Eliminar Usuario
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a <strong>{deleteTarget?.name}</strong>? Esta acción es permanente y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
              disabled={deletingUser}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deletingUser}
            >
              {deletingUser ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
