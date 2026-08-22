# EvaluHR — Documento de Estado del Proyecto

> **Última actualización:** 21 Agosto 2026
> **Propósito:** Contexto completo para futuras sesiones de desarrollo

---

## 1. Resumen del Proyecto

**EvaluHR** es una plataforma SaaS multi-tenant de evaluación psicométrica y psicológica para recursos humanos. Permite a empresas (restaurantes y retail) evaluar candidatos mediante tests de personalidad (Big Five), competencias psicológicas y conocimientos técnicos, generando **orientación informativa** al reclutador (PERFIL_COMPLETO / PERFIL_PARCIAL / PENDIENTE).

> **Política clave (Art. 37 Bis LFPDPPP):** El sistema **NO decide** la contratación. Solo ofrece orientación sobre el perfil del candidato. La decisión final corresponde siempre al área de Recursos Humanos.

**Casos de uso principales:**
- Invitación de candidatos vía WhatsApp/Email con token único
- Evaluación en 3 pasos: psicométrica → psicológica → conocimientos
- Comparación lado a lado de candidatos
- Vacantes públicas con link compartible (`?v=slug`) para aplicación directa
- Grabación/subida de video como paso final en vacantes
- Gestión de entrevistas post-evaluación
- Panel SUPER_ADMIN para administrar múltiples empresas

**Stack tecnológico:**

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| Runtime | React + Bun | React 19, Bun runtime |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS 4 + shadcn/ui | Tailwind 4 |
| Estado | Zustand | 5.0.6 |
| ORM | Prisma | 6.11.1 |
| DB Local | SQLite (desarrollo) | — |
| DB Prod | PostgreSQL (Supabase) | 17 |
| Auth | JWT con jose | 6.2.8 |
| Hashing | bcryptjs | 3.0.3 |
| Gráficas | Recharts | 2.15.4 |
| Drag & Drop | @dnd-kit | 6.3.1 |
| AI | z-ai-web-dev-sdk | 0.0.18 |
| Forms | react-hook-form + zod | 7.60.0 / 4.0.2 |

---

## 2. Arquitectura

### Patrón: SPA con App Router

EvaluHR es una **Single Page Application** construida sobre Next.js 16 App Router. A diferencia de una MPA tradicional, toda la navegación ocurre del lado del cliente mediante Zustand (`currentView`), con un único `page.tsx` que renderiza la vista activa.

```
src/
├── app/
│   ├── layout.tsx          # RootLayout (fuentes Geist, Toaster)
│   ├── page.tsx            # SPA router — renderiza vista según Zustand
│   ├── globals.css
│   └── api/                # API Routes (backend)
├── components/
│   ├── views/              # 14 vistas principales
│   └── ui/                 # 48 componentes shadcn/ui
├── lib/
│   ├── store.ts            # Zustand store (estado global)
│   ├── api.ts              # apiFetch wrapper (JWT automático)
│   ├── auth.ts             # JWT sign/verify + helpers
│   ├── rls.ts              # Row-Level Security (Prisma Extension)
│   ├── db.ts               # PrismaClient singleton
│   ├── db-rls-session.ts   # DB-level RLS session variables
│   ├── password.ts         # bcrypt + migración legacy SHA-256
│   └── utils.ts            # cn() utility
├── middleware.ts           # JWT verification + header injection
└── prisma/
    ├── schema.prisma       # SQLite (dev)
    ├── schema.prod.prisma  # PostgreSQL (prod)
    ├── seed.ts             # Seed script
    └── rls-policies.sql    # PostgreSQL RLS policies
```

### Flujo de datos

```
Usuario → Zustand (currentView) → page.tsx → renderView() → [ViewComponent]
                                                        ↓
                                               apiFetch() → /api/* → middleware.ts (JWT)
                                                        ↓                    ↓
                                                  Prisma RLS ← getAuthFromHeaders()
                                                        ↓
                                                   Supabase/SQLite
```

### Gestión de estado (Zustand)

**Archivo:** `src/lib/store.ts`

El store centraliza:
- **Auth:** `user`, `token`, `setAuth()`, `clearAuth()`
- **Navegación:** `currentView` (tipo `ViewType` con 18 valores posibles)
- **Selección:** `selectedCandidateId`, `selectedPositionId`, `selectedResultId`
- **Evaluación:** `evaluationSessionId`, `currentStep`, `currentQuestionIndex`, `answers`
- **Comparación:** `compareIds`
- **Invitación:** `invitationToken`
- **Vacante pública:** `vacancySlug`, `vacancyApplicationId`, `vacancyCurrentStep`, `vacancyAnswers`

Persistencia: `localStorage` para token y user; se restaura en `useAuthRestore()` al recargar.

---

## 3. Despliegue

### Infraestructura

| Servicio | Detalle |
|----------|---------|
| Hosting | **Vercel** — deploy automático desde GitHub |
| Base de datos | **Supabase** — PostgreSQL 17 con connection pooling (pgbouncer) |
| CDN | Vercel Edge Network |
| Runtime | Bun (producción: `bun .next/standalone/server.js`) |

### Flujo de deploy

1. Push a GitHub → Vercel detecta cambios
2. Vercel ejecuta `buildCommand` definido en `vercel.json`:
   ```bash
   bash scripts/vercel-build.sh
   ```
3. El script (`scripts/vercel-build.sh`):
   - Copia `prisma/schema.prod.prisma` → `prisma/schema.prisma` (switch a PostgreSQL)
   - Ejecuta `npx prisma generate` para generar client PostgreSQL
   - Verifica que `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` estén configurados
   - Ejecuta `npx next build` con 3GB de memoria
4. Vercel despliega el resultado

### Configuración Vercel

**Archivo:** `vercel.json`
```json
{
  "buildCommand": "bash scripts/vercel-build.sh",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

### Configuración Supabase

**Archivo:** `supabase/config.toml`
- Puerto API: 54321
- Puerto DB: 54322
- Puerto Studio: 54323
- DB major version: 17
- Auth JWT expiry: 3600s (1h) — **Nota:** La app usa su propio JWT (8h), independiente de Supabase Auth
- Storage habilitado con límite de 50MiB
- Email SMTP local habilitado para desarrollo

### Scripts auxiliares

| Script | Propósito |
|--------|-----------|
| `scripts/vercel-build.sh` | Build de producción (switch schema + prisma generate + next build) |
| `scripts/seed-superadmin.ts` | Crear SUPER_ADMIN inicial |
| `scripts/seed-supabase.ts` | Seed completo para Supabase |
| `scripts/seed-supabase-clean.mjs` | Seed limpio |
| `scripts/apply-supabase-schema.mjs` | Aplicar schema a Supabase |
| `scripts/add-admin.ts` | Agregar admin |
| `scripts/fix-admin.ts` | Corregir admin |

---

## 4. Schema de Base de Datos

### Models (14 modelos)

**Schema dev:** `prisma/schema.prisma` (SQLite)
**Schema prod:** `prisma/schema.prod.prisma` (PostgreSQL con `directUrl`)

Ambos schemas son idénticos en modelos/campos; solo difieren en el datasource.

#### Company (Raíz del tenant)
```
id, name, sector (RESTAURANT|RETAIL), plan (BASIC), maxCandidatesPerMonth (150),
phone?, address?, city ("Tuxtla Gutiérrez"), state ("Chiapas"), country ("México"),
active (true), createdAt, updatedAt
```
Relaciones: users, positions, invitations, results, interviews, questions, vacancies, vacancyApplications

#### User
```
id, email (unique), name, password, role (CANDIDATO), phone?, companyId?,
active (true), consentGiven (false), consentDate?, createdAt, updatedAt
```
- `companyId` es **opcional** — SUPER_ADMIN tiene `null`
- Relaciones: company?, sessions, results, sentInvitations, interviews

#### Position
```
id, title, sector (RESTAURANT|RETAIL), category (MESERO|COCINERO|BARTENDER|GERENTE_PISO|VENDEDOR),
description?, hasKnowledgeTest (false), companyId, active (true), createdAt, updatedAt
```
Relaciones: company, evaluationTemplates, invitations, sessions, results, interviews

#### EvaluationTemplate
```
id, name, type (PSICOMETRICA|PSICOLOGICA|CONOCIMIENTOS), description?,
order (1), active (true), positionId, createdAt, updatedAt
```
Relaciones: position, questions

#### Question
```
id, text, type (LIKERT|MULTIPLE_CHOICE|YES_NO), options? (JSON),
category (OPENNESS|CONSCIENTIOUSNESS|EXTRAVERSION|AGREEABLENESS|NEUROTICISM|
          STRESS|EMPATHY|ADAPTABILITY|LEADERSHIP|TEAMWORK|KNOWLEDGE),
reverseScored (false), order, evaluationTemplateId,
isCustom (false), correctAnswer?, companyId?, createdAt
```
- `companyId` opcional: `null` = pregunta global del sistema, valor = pregunta personalizada
- Relaciones: evaluationTemplate, responses, company?

#### CandidateInvitation
```
id, candidateName?, email?, phone?, token (unique),
status (PENDING|REGISTERED|COMPLETED|EXPIRED),
channel (WHATSAPP|EMAIL), companyId, positionId, invitedBy,
expiresAt, createdAt, updatedAt
```
- **`candidateName` y `email` son nullable** — cambio reciente para permitir invitaciones solo con teléfono

#### EvaluationSession
```
id, candidateId, positionId, companyId,
status (NOT_STARTED|IN_PROGRESS|COMPLETED),
currentStep (1=psicométrica, 2=psicológica, 3=conocimientos),
currentQuestionIndex (0), startedAt?, completedAt?, createdAt, updatedAt
```

#### EvaluationResponse
```
id, sessionId, questionId, value, numericValue?, createdAt
@@unique([sessionId, questionId])
```

#### EvaluationResult
```
id, sessionId (unique), candidateId, candidateName, positionId, positionTitle, companyId,
openness, conscientiousness, extraversion, agreeableness, neuroticism (Big Five 0-100),
stressLevel, empathy, adaptability, leadership, teamwork (Psicológica 0-100),
knowledgeScore? (0-100, null si no aplica),
overallScore (0-100), recommendation (PERFIL_COMPLETO|PERFIL_PARCIAL|PENDIENTE),
summary?, createdAt
```

> **Nota (Junio 2025):** Antes usaba `APTO|ENTREVISTA_ADICIONAL|NO_RECOMENDADO` (decisión de contratación).
> Cambiado a `PERFIL_COMPLETO|PERFIL_PARCIAL|PENDIENTE` para cumplir Art. 37 Bis LFPDPPP
> — el sistema orienta, no decide. Ver changelog 20 Junio 2025.

#### InterviewSchedule
```
id, candidateId, companyId, positionId?, scheduledAt,
status (SCHEDULED|COMPLETED|CANCELLED),
location?, notes?, notified (false), createdAt, updatedAt
```

#### Vacancy
```
id, title, slug (unique), description?, sector (GENERAL|RESTAURANT|RETAIL),
status (ACTIVE|PAUSED|CLOSED), includePsicometrica (true), includePsicologica (true),
maxVideoSeconds (60), companyId, createdAt, updatedAt
```

#### VacancyQuestion
```
id, text, type (MULTIPLE_CHOICE), options? (JSON), correctAnswer?,
order, vacancyId, createdAt
```

#### VacancyApplication
```
id, vacancyId, companyId, candidateName, candidateEmail, candidatePhone?,
candidateAge?, videoUrl?, videoType? (RECORDED|UPLOADED),
status (IN_PROGRESS|COMPLETED),
currentStep (0=data, 1=psicométrica, 2=psicológica, 3=conocimientos, 4=video, 5=done),
currentQuestionIndex (0), startedAt?, completedAt?, createdAt, updatedAt,
+ mismos campos de scoring que EvaluationResult
```

#### VacancyApplicationResponse
```
id, applicationId, questionId?, vacancyQuestionId?,
section (PSICOMETRICA|PSICOLOGICA|CONOCIMIENTOS),
value, numericValue?, createdAt
```

### Diagrama de relaciones clave

```
Company ──┬── User (companyId opcional)
          ├── Position ──── EvaluationTemplate ──── Question (companyId opcional)
          ├── CandidateInvitation
          ├── EvaluationSession ──── EvaluationResponse
          ├── EvaluationResult
          ├── InterviewSchedule
          ├── Vacancy ──┬── VacancyQuestion
          │              └── VacancyApplication ──── VacancyApplicationResponse
          └── Question (custom)
```

---

## 5. Sistema de Autenticación

### Flujo completo

1. **Login:** `POST /api/auth { action: "login", email, password }`
   - Verifica contra bcrypt (o SHA-256 legacy con migración automática)
   - Genera JWT con jose (HS256, 8h expiración, issuer: "evaluhr")
   - Retorna `{ user, token }` + cookie httpOnly `evaluhr_token`
2. **Middleware** (`src/middleware.ts`):
   - Intercepta TODAS las rutas `/api/*`
   - Rutas públicas (sin auth): `/api/auth`, `/api/public`, `/api/seed`, `/api/health`
   - Extrae token de: `Authorization: Bearer <token>` → Cookie `evaluhr_token`
   - Verifica JWT, inyecta headers: `x-user-id`, `x-user-email`, `x-user-name`, `x-user-role`, `x-user-company-id`, `x-user-company-name`, `x-user-company-sector`
3. **API Routes:** Leen auth con `getAuthFromHeaders(req.headers)`
4. **Cliente:** `apiFetch()` en `src/lib/api.ts` añade `Authorization: Bearer <token>` automáticamente; maneja 401 limpiando auth

### JWT Payload

```typescript
interface AuthPayload {
  sub: string        // user.id
  email: string
  name: string
  role: string       // SUPER_ADMIN, RH, GERENTE, CANDIDATO
  companyId?: string
  companyName?: string
  companySector?: string
}
```

### Roles y permisos

| Rol | Acceso |
|-----|--------|
| **SUPER_ADMIN** | Sin companyId (null). Ve todas las empresas. Puede crear empresas, usuarios RH/GERENTE. Puede operar en cualquier tenant. |
| **RH** | Pertenece a una empresa. Invita candidatos, ve evaluaciones, gestiona entrevistas. Puede crear/editar usuarios dentro de su empresa. |
| **GERENTE** | Pertenece a una empresa. Ve candidatos, comparaciones, vacantes. No puede invitar ni gestionar entrevistas. |
| **CANDIDATO** | Pertenece a una empresa. Solo ve su evaluación y consentimiento. Layout simplificado sin sidebar. |

### Password hashing

**Archivo:** `src/lib/password.ts`
- bcrypt con 12 rounds (actual)
- Soporte legacy SHA-256 con migración transparente: si `verifyPassword()` detecta hash SHA-256 y es válido, retorna `needsRehash: true` para re-hashear con bcrypt

### ⚠️ Advertencia de middleware deprecado

Next.js 16 muestra un warning sobre el uso de `middleware.ts` con el config matcher. Esto es un known issue y no afecta funcionalidad.

---

## 6. Row-Level Security (RLS)

EvaluHR implementa RLS en **dos capas** (defense-in-depth):

### Capa 1: Application-Level RLS (Prisma Client Extension)

**Archivo:** `src/lib/rls.ts`

Funciona mediante `Prisma.defineExtension()` que intercepta todas las operaciones del query engine:

**Modelos con scope directo (tienen `companyId`):**

| Modelo | companyId requerido? |
|--------|---------------------|
| User | Opcional (null = SUPER_ADMIN) |
| Position | Requerido |
| Question | Opcional (null = global) |
| CandidateInvitation | Requerido |
| EvaluationSession | Requerido |
| EvaluationResult | Requerido |
| InterviewSchedule | Requerido |
| Vacancy | Requerido |
| VacancyApplication | Requerido |

**Modelos con scope indirecto (vía parentId):**
- EvaluationTemplate → via Position.companyId
- EvaluationResponse → via EvaluationSession.companyId
- VacancyQuestion → via Vacancy.companyId
- VacancyApplicationResponse → via VacancyApplication.companyId

**Cómo funciona `createRLSClient(auth)`:**

```typescript
const { client: rlsDb, context } = createRLSClient(auth)
// Ahora TODAS las queries en rlsDb están scopeadas a auth.companyId
const candidates = await rlsDb.user.findMany({ where: { role: 'CANDIDATO' } })
// ↑ Automáticamente añade where: { companyId: 'xxx' }
```

- **findMany/findFirst/count/aggregate/groupBy:** auto-inyecta `companyId` en `where`
- **findUnique:** añade `companyId` al where (convierte a findFirst implícitamente)
- **create:** valida que `data.companyId` coincida o lo auto-inyecta
- **update/delete:** añade `companyId` al `where` para prevenir cross-tenant updates
- **SUPER_ADMIN bypass:** Si `isSuperAdmin=true`, no se aplica ningún filtro
- **RLSViolationError:** Se lanza si se intenta crear/actualizar con companyId de otro tenant

**`getUnscopedClient()`:** Retorna el Prisma client sin extensiones. Solo debe usarse para:
- Login/register (sin tenant context)
- Operaciones SUPER_ADMIN cross-tenant
- Endpoints públicos (derivan companyId de los datos)

### Capa 2: Database-Level RLS (PostgreSQL Policies)

**Archivo:** `prisma/rls-policies.sql`

- Habilita RLS en todas las tablas tenant-scoped
- Crea policies SELECT/INSERT/UPDATE/DELETE para cada tabla
- Usa session variables: `app.current_company_id` y `app.is_super_admin`
- SUPER_ADMIN bypass: `current_setting('app.is_super_admin', true) = 'true'`
- User/Question con companyId opcional: permiten ver registros con `companyId IS NULL` (globales)
- **Estado:** No activado por defecto en producción (requiere ejecutar el SQL manualmente)

**Helper para sesiones DB:** `src/lib/db-rls-session.ts`
- `setRLSSession(tx, { companyId, isSuperAdmin })` — establece variables dentro de una transacción
- `withRLSTransaction(config, callback)` — wrapper conveniente

### Patrón SUPER_ADMIN con scoping

Cuando SUPER_ADMIN necesita operar dentro de un tenant específico:

```typescript
const targetCompanyId = req.nextUrl.searchParams.get('companyId')
const { client: rlsDb } = targetCompanyId
  ? createRLSClient({ ...auth, companyId: targetCompanyId })
  : createRLSClient(auth)
```

### Endpoint de auditoría RLS

`GET /api/rls-audit?mode=verify&companyId=xxx` — Solo SUPER_ADMIN. Verifica que RLS filtra correctamente para cada modelo.

`GET /api/rls-audit?mode=cross-tenant&companyId=xxx` — Test de aislamiento cross-tenant.

`GET /api/rls-audit?mode=stats` — Estadísticas de cobertura RLS.

---

## 7. API Routes

### Resumen completo

| Endpoint | Métodos | Auth | Propósito |
|----------|---------|------|-----------|
| `GET /api` | GET | No | Health check básico |
| `POST /api/auth` | POST | No | Login (`action=login`), Register (`action=register`), Logout (`action=logout`) |
| `GET /api/health` | GET | No | Diagnóstico de producción (DB, env vars, SUPER_ADMIN) |
| `GET /api/seed` | GET | No* | Seed: `?mode=superadmin` (prod con secret) o `?mode=full` (dev) |
| `GET /api/dashboard` | GET | Sí | Stats: candidatos, evaluaciones, recomendaciones, resultados recientes |
| `GET/POST /api/candidates` | GET, POST | Sí | Listar candidatos (con resultados) / Crear candidato + sesión |
| `GET/POST /api/invite` | GET, POST | Sí | Listar invitaciones / Crear invitación (token único, 7 días exp) |
| `GET/POST /api/evaluations` | GET, POST | Sí | Obtener sesión+preguntas / Enviar respuesta, avanzar paso, completar |
| `GET /api/results` | GET | Sí | Resultados: por candidateId, resultId, o compareIds (comparación) |
| `GET/POST /api/positions` | GET, POST | Sí | Listar puestos / Crear puesto |
| `GET/POST/PUT/DELETE /api/questions` | GET, POST, PUT, DELETE | Sí | Listar preguntas por template/position / Crear custom / Editar custom / Eliminar custom |
| `GET/POST/PATCH /api/interviews` | GET, POST, PATCH | Sí | Listar / Crear / Actualizar status (SCHEDULED→COMPLETED→CANCELLED) |
| `GET/POST /api/companies` | GET, POST | Sí (SA) | Listar empresas / Crear empresa (solo SUPER_ADMIN) |
| `GET/POST/PUT/PATCH/DELETE /api/users` | GET, POST, PUT, PATCH, DELETE | Sí | CRUD de usuarios (gestión de equipo) |
| `POST /api/consent` | POST | Sí | Registrar consentimiento de candidato |
| `POST /api/consent/fix` | POST | Sí (Admin) | Registrar consentimiento retroactivamente |
| `GET/POST /api/vacancies` | GET, POST | Sí | Listar vacantes / Crear vacante con preguntas |
| `GET/PUT/DELETE /api/vacancies/[id]` | GET, PUT, DELETE | Sí | Detalle / Editar / Eliminar vacante |
| `GET/POST /api/vacancies/[id]/applications` | GET, POST | Sí | Listar aplicaciones / (crear es público vía /api/public/apply) |
| `GET/POST/PUT/DELETE /api/vacancies/[id]/questions` | — | Sí | CRUD de preguntas de vacante |
| `POST /api/vacancies/[id]/generate-questions` | POST | Sí | Generar preguntas con IA (z-ai-web-dev-sdk) |
| `GET /api/public/vacancy` | GET | No | Obtener vacante pública por slug |
| `POST /api/public/apply` | POST | No | Aplicar a vacante pública (crear aplicación, enviar respuestas, completar) |
| `POST /api/public/video` | POST | No | Marcar paso de video completado (verificación por slug token) |
| `GET /api/rls-audit` | GET | Sí (SA) | Auditoría RLS: verify, stats, cross-tenant |

### Detalle del flujo de evaluación (`/api/evaluations`)

- `GET /api/evaluations?sessionId=xxx` → Obtiene sesión con preguntas del paso actual
- `POST /api/evaluations` con body:
  - `{ action: "start", sessionId }` → Inicia sesión (status → IN_PROGRESS)
  - `{ action: "answer", sessionId, questionId, value, numericValue }` → Guarda respuesta
  - `{ action: "next_step", sessionId }` → Avanza al siguiente paso
  - `{ action: "complete", sessionId }` → Calcula scores, genera EvaluationResult, marca COMPLETED

### Algoritmo de scoring

1. **Big Five (0-100):** Promedio de respuestas LIKERT por categoría, normalizado: `((avg - 1) / 4) * 100`
2. **Psicológica (0-100):** Mismo cálculo para STRESS, EMPATHY, ADAPTABILITY, LEADERSHIP, TEAMWORK
3. **Conocimientos (0-100):** Porcentaje de respuestas correctas en MULTIPLE_CHOICE
4. **Overall (0-100):** Promedio ponderado según categoría del puesto (restaurante vs retail)
5. **Recomendación:**
   - `APTO` si overall ≥ 70 y ninguna categoría < 30
   - `ENTREVISTA_ADICIONAL` si overall ≥ 50 o alguna categoría < 30
   - `NO_RECOMENDADO` si overall < 50

---

## 8. Vistas del Frontend

**Archivo principal:** `src/app/page.tsx` — SPA router que renderiza vistas según `currentView` de Zustand.

| Vista | Componente | Acceso | Descripción |
|-------|-----------|--------|-------------|
| `login` / `register` | `LoginView` | Público | Login + registro con token de invitación |
| `consent` | `ConsentView` | CANDIDATO | Aceptar términos y privacidad antes de evaluación |
| `dashboard` | `DashboardView` | RH, GERENTE, SA | Panel con KPIs: candidatos, evaluaciones, recomendaciones |
| `candidates` | `CandidatesView` | RH, GERENTE | Tabla de candidatos con resultados y filtros |
| `candidate-detail` | `CandidateDetailView` | RH, GERENTE | Detalle de candidato con gráficas radar y scores |
| `take-evaluation` | `EvaluationView` | CANDIDATO | Test en 3 pasos (psicométrica → psicológica → conocimientos) |
| `evaluation-complete` | `EvaluationCompleteView` | CANDIDATO | Pantalla de evaluación completada |
| `compare` | `CompareView` | RH, GERENTE | Comparación lado a lado de múltiples candidatos |
| `invite` | `InviteView` | RH | Formulario de invitación + lista de invitaciones |
| `vacancies` | `VacancyManagementView` | RH, GERENTE | CRUD de vacantes con preguntas y aplicaciones |
| `questions` | `QuestionsManagementView` | RH, GERENTE | Gestión de preguntas personalizadas |
| `interviews` | `InterviewsView` | RH | Calendario/gestión de entrevistas |
| `companies` | `CompanyManagementView` | SUPER_ADMIN | CRUD de empresas + gestión de usuarios por empresa |
| `public-evaluation` | `PublicEvaluationView` | Público | Evaluación pública vía vacante (`?v=slug`) |
| `public-evaluation-complete` | Inline | Público | Confirmación de evaluación pública completada |

### Navegación

- **RH/GERENTE/SA:** Sidebar con menú condicional según rol
- **CANDIDATO:** Barra de navegación simple (sin sidebar)
- **Público:** Sin navegación (flujo autocontenido)

### Hooks de inicialización (en `page.tsx`)

1. `useAuthRestore()` — Restaura auth desde localStorage al recargar
2. `useInvitationCheck()` — Detecta `?token=xxx` en URL para registro
3. `useVacancyLinkCheck()` — Detecta `?v=slug` en URL o localStorage para evaluación pública

---

## 9. Componentes Clave

### shadcn/ui (48 componentes)

**Directorio:** `src/components/ui/`

| Componente | Uso principal |
|-----------|---------------|
| `card` | Layout de vistas y dashboards |
| `button` | Acciones en toda la UI |
| `dialog` | Modales (confirmaciones, formularios) |
| `sheet` | Paneles laterales |
| `table` | Tablas de datos (candidatos, usuarios, etc.) |
| `badge` | Estados, roles, recomendaciones |
| `tabs` | Navegación dentro de vistas |
| `select` | Filtros y dropdowns |
| `input` / `textarea` | Formularios |
| `chart` | Gráficas Recharts |
| `slider` | Rango de valores |
| `progress` | Barra de progreso en evaluación |
| `toast` / `toaster` / `sonner` | Notificaciones |
| `form` | Validación con react-hook-form |
| `avatar` | Perfil de usuario |
| `accordion` | Secciones colapsables |
| `dropdown-menu` | Menús contextuales |
| `command` | Búsqueda/command palette (cmdk) |
| `scroll-area` | Scroll custom |
| `alert` / `alert-dialog` | Alertas y confirmaciones |
| `skeleton` | Loading states |
| `switch` | Toggles |
| `checkbox` / `radio-group` | Selección |
| `separator` | Divisores |
| `popover` / `hover-card` | Tooltips y popovers |
| `calendar` / `date-picker` | Selección de fechas |
| `drawer` (vaul) | Drawers móviles |
| `collapsible` | Secciones colapsables |
| `carousel` | Carruseles |
| `resizable` | Paneles redimensionables |
| `navigation-menu` / `menubar` / `breadcrumb` | Navegación |
| `toggle` / `toggle-group` | Botones toggle |
| `tooltip` | Tooltips |
| `context-menu` | Menús contextuales |
| `input-otp` | Input OTP |
| `pagination` | Paginación |
| `aspect-ratio` | Aspect ratio |

### Componentes custom de vistas

**Directorio:** `src/components/views/`

Todos los archivos `.tsx` con sufijo `View`. Los más complejos:
- `EvaluationView.tsx` — Test multi-paso con progress bar y diferentes tipos de pregunta
- `PublicEvaluationView.tsx` — Flujo público completo (datos → psicométrica → psicológica → conocimientos → video → done)
- `CandidatesView.tsx` — Tabla con filtros, búsqueda, y resultados inline
- `VacancyManagementView.tsx` — CRUD completo con drag & drop para reordenar preguntas
- `CompanyManagementView.tsx` — Panel SUPER_ADMIN con gestión de empresas y usuarios
- `CompareView.tsx` — Gráficas radar comparativas

---

## 10. Cambios Recientes (Esta Sesión)

### 🔴 CRITICAL FIX: RLS Bypass en SUPER_ADMIN con empresa seleccionada (21 Ago 2026)

**Causa raíz:** Cuando SUPER_ADMIN seleccionaba una empresa específica, `createRLSClient({ ...auth, companyId: targetCompanyId })` preservaba `isSuperAdmin=true` desde el objeto `auth`. La extensión RLS tiene la lógica `if (!isSuperAdmin ...)` que salta TODOS los filtros cuando `isSuperAdmin=true`. Resultado: se devolvían datos de TODAS las empresas en vez de solo la seleccionada.

**Ejemplo:** El dropdown de "Invitar Candidato" mostraba "Test Integridad" (de otra empresa) en vez de "Cajero" (de la empresa seleccionada).

**Fix:** Usar `createSuperAdminRLSClient(targetCompanyId)` que internamente fuerza `isSuperAdmin=false` para que el RLS sí aplique filtros por `companyId`.

**Archivos corregidos (16 ocurrencias en 8 endpoints):**
- `/api/positions` (GET, POST, DELETE)
- `/api/questions` (GET, POST, PUT, DELETE)
- `/api/candidates` (GET, POST)
- `/api/vacancies` (GET, POST)
- `/api/results` (GET)
- `/api/invite` (POST)
- `/api/interviews` (GET, POST)
- `/api/dashboard` (GET)

**Regla actualizada para desarrolladores:** Cuando SUPER_ADMIN opera en un tenant específico, SIEMPRE usar `createSuperAdminRLSClient(targetCompanyId)` en vez de `createRLSClient({ ...auth, companyId: targetCompanyId })`.

### Limpieza de email del flujo de candidatos (21 Ago 2026)
- El candidato SOLO proporciona nombre + teléfono. NUNCA email.
- Email es exclusivo para usuarios de plataforma (RH, GERENTE, SUPER_ADMIN).
- Se eliminó la acción `register` de `/api/auth` (91 líneas de código muerto).
- El email auto-generado (`cand_XXX@evaluhr.auto`) es un detalle técnico invisible.

### Botón eliminar puesto (21 Ago 2026)
- `QuestionsManagementView` ahora tiene botón "Eliminar Puesto" con diálogo de confirmación.
- Ejecuta `DELETE /api/positions?id=xxx` que hace soft-delete (`active=false`).

### Limpieza de producción (21 Ago 2026)
- Endpoint `/api/cleanup` creado (SUPER_ADMIN only, con `dryRun` support). **TEMPORAL — eliminar después de uso.**
- Ejecutado en producción: eliminados 4 resultados, 4 sesiones, 4 invitaciones, 70 preguntas, 7 plantillas, 2 puestos, 3 candidatos de Café DeChiapas.
- DB de producción limpia, lista para empezar desde cero.
- Corregido orden FK: EvaluationResult > EvaluationResponse > EvaluationSession (antes fallaba por violacion de constraint).

### Sesiones anteriores (resumen)

- **Gestión de usuarios:** `/api/users` CRUD completo, solo SUPER_ADMIN crea/edita/elimina
- **Flujo de invitación:** Solo nombre+teléfono, token único, expiración 7 días
- **Generación de preguntas con IA:** `/api/vacancies/[id]/generate-questions` con z-ai-web-dev-sdk
- **Vacantes públicas:** Link compartible `?v=slug`, flujo sin auth, persistencia en localStorage

---

## 11. Integración con IA

### z-ai-web-dev-sdk

**Paquete:** `z-ai-web-dev-sdk` v0.0.18

**Uso actual:** Generación de preguntas de conocimiento para vacantes

**Endpoint:** `POST /api/vacancies/[id]/generate-questions`
- Envía contexto (título de vacante, sector) al SDK
- Recibe preguntas generadas (texto, opciones, respuesta correcta)
- Las guarda como `VacancyQuestion` en la base de datos

### Variables de entorno requeridas

```
ZAI_BASE_URL     — URL base del servicio Z.ai
ZAI_API_KEY      — API key de autenticación
ZAI_CHAT_ID      — ID del chat/modelo a usar
ZAI_USER_ID      — ID del usuario Z.ai
ZAI_TOKEN        — Token de sesión Z.ai
```

**Nota:** Estas variables deben configurarse en Vercel para que la generación de preguntas funcione en producción.

---

## 12. Problemas Conocidos / TODOs

### Críticos

| Issue | Detalle | Prioridad |
|-------|---------|-----------|
| Middleware deprecated warning | Next.js 16 muestra warning sobre `middleware.ts` config matcher. No rompe funcionalidad pero debe ajustarse en futura versión. | Media |
| DB-level RLS no activado | `prisma/rls-policies.sql` existe pero no se ha ejecutado en producción. Solo App-level RLS (Prisma Extension) está activo. **Recomendación:** ejecutar SQL contra Supabase y activar `db-rls-session.ts`. | Alta |
| Seguridad de endpoints públicos | `/api/public/apply` y `/api/public/video` usan verificación por slug token (ligera). Considerar rate limiting y CAPTCHA. | Alta |
| Endpoint /api/cleanup expuesto | Endpoint temporal de limpieza aún existe en código. Debe eliminarse o deshabilitarse. | Media |

### Auditoría legal (31 secciones)

| Issue | Detalle | Estado |
|-------|---------|--------|
| Aviso de privacidad | Pendiente implementar 31 secciones de auditoría legal para cumplimiento LFPDPPP (México) | Pendiente |
| Consentimiento | Sistema de consentimiento LFPDPPP-compliant implementado (Opciones A/B/C + audit log) | ✅ Completado |
| Datos sensibles | Se almacenan datos psicométricos — base legal: consentimiento expreso (Art. 8 LFPDPPP) | ✅ Completado |

---

## 12.5. Sistema de Consentimiento (LFPDPPP-Compliant) — IMPLEMENTADO

### Resumen

El sistema de consentimiento informado cumple con la **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)** y la **NOM-035-STPS-2018**. Permite a los candidatos elegir entre 3 opciones de participación antes de iniciar la evaluación.

### Opciones de Participación

| Opción | Código | Descripción |
|--------|--------|-------------|
| **A** | `FULL` | Evaluación Completa (psicométrica + psicológica + conocimientos) |
| **B** | `KNOWLEDGE_ONLY` | Solo Conocimientos (sin datos psicológicos sensibles) |
| **C** | `anonymousStats=true` | Estadísticas Anónimas (opcional, independiente de A/B) |

### Esquema de Base de Datos (Modelo User)

```prisma
model User {
  // ... campos básicos ...
  consentGiven         Boolean   @default(false)    // ¿Aceptó el consentimiento?
  consentDate          DateTime?                    // Fecha de aceptación
  consentOption        String?                      // FULL o KNOWLEDGE_ONLY
  anonymousStats       Boolean   @default(false)    // Opción C (estadísticas anónimas)
  consentConfirmed     Boolean   @default(false)    // Confirmó lectura de opciones + ARCO
  consentWithdrawnAt   DateTime?                    // Fecha de retiro (FULL → KNOWLEDGE_ONLY)
  consentVersion       String?                      // Versión del aviso de privacidad (actual: 2026-01-v1)
}
```

### Modelo ConsentLog (Audit Trail)

```prisma
model ConsentLog {
  id              String   @id @default(cuid())
  userId          String                        // FK → User
  action          String                        // GIVEN, MODIFIED, WITHDRAWN
  previousOption  String?                        // FULL, KNOWLEDGE_ONLY
  newOption       String?                        // FULL, KNOWLEDGE_ONLY
  anonymousStats  Boolean  @default(false)
  consentVersion  String?                        // Versión del aviso
  ipAddress       String?                        // IP del cliente (para auditoría)
  createdAt       DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Endpoints API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/consent` | POST | Registrar consentimiento (Opción A/B + C) |
| `/api/consent` | PATCH | Retirar consentimiento de datos sensibles (FULL → KNOWLEDGE_ONLY) |
| `/api/migrate` | POST | Migrar BD producción (añadir columnas consent + ConsentLog) — SUPER_ADMIN only |

### Características LFPDPPP

- ✅ **Consentimiento expreso** (Art. 8): El candidato debe seleccionar una opción Y confirmar lectura
- ✅ **Datos sensibles** (Art. 7): Las respuestas psicométricas/psicológicas se tratan como datos sensibles
- ✅ **Derechos ARCO**: Acceso, Rectificación, Cancelación, Oposición (mostrados en la UI)
- ✅ **Retiro de consentimiento**: El candidato puede retirar consentimiento en cualquier momento (botón "Retirar consentimiento" en EvaluationView)
- ✅ **No discriminación** (Art. 37 Bis): La elección de opción NO afecta oportunidades
- ✅ **Audit trail**: ConsentLog registra GIVEN, MODIFIED, WITHDRAWN con IP y versión
- ✅ **Períodos de conservación**: 2 años datos personales, eliminación al concluir para sensibles
- ✅ **Versión del aviso**: `consentVersion = "2026-01-v1"` (bump cuando cambie el aviso)

### Flujo de Consentimiento

```
Candidato abre link (?token=xxx)
  ↓
InvitationWelcomeView (muestra info de empresa/puesto)
  ↓ (Click "Comenzar Evaluación")
Auto-login (POST /api/auth {action: "auto-login"})
  ↓ (Crea usuario si no existe, genera JWT)
ConsentView (selección de Opción A/B/C + confirmación)
  ↓ (Click "Continuar" → POST /api/consent)
EvaluationView (evaluación según opción elegida)
```

### Arquitectura de Resiliencia

El consent API usa `safeFindUserById()` con cliente **unscoped** (no RLS) para evitar el error "Usuario no encontrado" cuando hay discrepancias de companyId entre JWT y BD (usuarios huérfanos de invitaciones eliminadas).

**Patrón:**
1. Lookup con cliente unscoped (confía en JWT para auth)
2. Verificación explícita de ownership (`user.companyId === auth.companyId`)
3. Fallback a SQL crudo si faltan columnas de consent
4. Audit log write no bloqueante (try/catch)

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/components/views/ConsentView.tsx` | UI de consentimiento (Opciones A/B/C con toggle) |
| `src/components/views/InvitationWelcomeView.tsx` | Welcome page del candidato |
| `src/app/api/consent/route.ts` | POST (registrar) + PATCH (retirar) consentimiento |
| `src/app/api/auth/route.ts` | Auto-login (crea usuario + JWT) |
| `src/app/api/migrate/route.ts` | Migración de BD para consent columns |
| `prisma/schema.prisma` | Schema SQLite (local) |
| `prisma/schema.prod.prisma` | Schema PostgreSQL (producción) |

### Funcionalidad pendiente

| TODO | Detalle |
|------|---------|
| Notificaciones WhatsApp | El sistema genera tokens de invitación pero no envía mensajes automáticamente. Integrar Twilio/WhatsApp Business API. |
| Notificaciones Email | Similar — no hay envío real de emails de invitación. |
| Reportes PDF | No hay generación de reportes descargables. |
| Dashboard mejorado | Faltan gráficas de tendencia temporal, funnel de candidatos. |
| Rate limiting | No hay rate limiting en endpoints API. |
| Tests | No hay tests automatizados (unit, integration, e2e). |
| CI/CD | No hay pipeline de CI — solo deploy directo a Vercel. |

### Hardening de seguridad

- [ ] Activar DB-level RLS en Supabase (ejecutar `rls-policies.sql`)
- [ ] Implementar rate limiting (Vercel Edge Middleware o Upstash Ratelimit)
- [ ] Añadir CAPTCHA en registro público
- [ ] Rotar `JWT_SECRET` periódicamente
- [ ] Implementar refresh tokens (actualmente solo access token de 8h)
- [ ] Añadir CSP headers
- [ ] Auditoría de logs de acceso

---

## 13. Variables de Entorno

### Desarrollo local (`.env`)

```env
DATABASE_URL=file:./prisma/db/custom.db
JWT_SECRET=evaluhr-dev-jwt-secret-change-in-production
```

### Producción (Vercel Environment Variables)

```env
# ── Base de datos (Supabase) ──
DATABASE_URL=postgresql://postgres.USERNAME:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres

# ── Autenticación ──
JWT_SECRET=<producción-secret-mínimo-32-caracteres>

# ── Seed/Reset (protección del endpoint /api/seed) ──
EVALUHR_SEED_RESET=<secret-para-resetear-DB>

# ── IA (z-ai-web-dev-sdk) ──
ZAI_BASE_URL=<url-base-zai>
ZAI_API_KEY=<api-key-zai>
ZAI_CHAT_ID=<chat-id-zai>
ZAI_USER_ID=<user-id-zai>
ZAI_TOKEN=<token-zai>
```

### Notas importantes

- `DATABASE_URL` **debe** incluir `?pgbouncer=true` para connection pooling en Supabase
- `DIRECT_URL` es necesaria para Prisma migrations (conexión directa sin pooler)
- `JWT_SECRET` tiene un fallback de desarrollo pero **debe cambiarse** en producción
- `EVALUHR_SEED_RESET` es requerida para el endpoint `/api/seed?mode=superadmin` en producción
- Las variables `ZAI_*` son opcionales — sin ellas, la generación de preguntas con IA no funciona

---

## 14. Quick Start para Desarrolladores

### Setup local

```bash
# 1. Instalar dependencias
bun install

# 2. Generar Prisma client (SQLite para dev)
npx prisma generate

# 3. (Opcional) Seed con datos de demo
npx prisma db push
# Luego visitar http://localhost:3000/api/seed?mode=full

# 4. Iniciar dev server
bun dev
# → http://localhost:3000
```

### Credenciales de desarrollo (después de seed)

| Rol | Email | Password |
|-----|-------|----------|
| SUPER_ADMIN | admin@evaluhr.com | admin123 |
| RH (Café de Chiapas) | rh@cafedechiapas.com | rh123 |
| RH (Marlui) | rh@marlui.com | rh123 |

### Comandos útiles

```bash
bun dev                    # Dev server (puerto 3000)
npx prisma studio          # Visor visual de DB
npx prisma db push         # Sync schema → DB (sin migraciones)
npx prisma migrate dev     # Crear migración
npx prisma generate        # Regenerar client
bun run lint               # ESLint
```

### Convenciones

- **API routes:** Usar `createRLSClient(auth)` para queries scoped, `getUnscopedClient()` solo cuando sea necesario
- **Nuevas vistas:** Añadir al tipo `ViewType` en `store.ts`, crear componente en `views/`, añadir caso en `renderView()` en `page.tsx`
- **Nuevos modelos:** Actualizar ambos schemas (`schema.prisma` y `schema.prod.prisma`), añadir a `TENANT_SCOPED_MODELS` en `rls.ts` si tiene `companyId`
- **SUPER_ADMIN scoping:** Usar `createSuperAdminRLSClient(targetCompanyId)` cuando SUPER_ADMIN opera en un tenant específico. NUNCA usar `createRLSClient({ ...auth, companyId: targetCompanyId })` porque preserva `isSuperAdmin=true` y el RLS no filtra (bug corregido 21 Ago 2026)

---

## 15. Changelog

### 21 Agosto 2026 — Fix RLS bypass SUPER_ADMIN + Limpieza de producción

**Commits:** `a8be259` → `fa3d4ad` → `0e89348` → `40d761d` → `775070c` (todos pushed a main)

**Archivos modificados (10):**
- `src/app/api/positions/route.ts` — createSuperAdminRLSClient + DELETE endpoint + import fix
- `src/app/api/questions/route.ts` — createSuperAdminRLSClient (4 handlers)
- `src/app/api/candidates/route.ts` — createSuperAdminRLSClient (2 handlers)
- `src/app/api/vacancies/route.ts` — createSuperAdminRLSClient (2 handlers)
- `src/app/api/results/route.ts` — createSuperAdminRLSClient
- `src/app/api/invite/route.ts` — createSuperAdminRLSClient
- `src/app/api/interviews/route.ts` — createSuperAdminRLSClient (2 handlers)
- `src/app/api/dashboard/route.ts` — createSuperAdminRLSClient
- `src/app/api/cleanup/route.ts` (NUEVO, TEMPORAL) — SUPER_ADMIN cleanup endpoint (deshabilitar/eliminar después de uso)
- `src/components/views/QuestionsManagementView.tsx` — Botón eliminar puesto
- `src/app/api/auth/route.ts` — Eliminada acción register (código muerto)
- `src/app/api/invite/route.ts` — Email eliminado del flujo de invitación

**Estado de producción:**
- Café DeChiapas: DB limpia (0 puestos, 0 candidatos, 0 invitaciones)
- Usuarios RH/GERENTE preservados
- Deploy Vercel: ✅ activo en `evaluacion-murex.vercel.app`

---

### 20 Agosto 2026 — Aviso por empresa, Integridad 4to paso, SA agregados, limpieza APTO

**Commit:** `d36b33c` (pushed to main)

**Archivos modificados (19):**
- `prisma/schema.prisma` + `schema.prod.prisma` — CompanyPrivacyNotice, integrityScore, includeIntegridad
- `src/lib/privacy-notice.ts` (NUEVO) — Generador aviso LFPDPPP 31+ secciones
- `src/lib/generate-templates.ts` — INTEGRIDAD_QUESTIONS (10 preguntas) + template INTEGRIDAD
- `src/app/api/privacy-notice/route.ts` (NUEVO) — GET/PUT/POST regenerate
- `src/app/api/companies/route.ts` — Auto-crea aviso, candidateCount para SA
- `src/app/api/evaluations/route.ts` — Scoring adaptativo 4 secciones (0.25/0.25/0.15/0.35)
- `src/app/api/public/apply/route.ts` — Mismo scoring integridad + HARDCODED_INTEGRIDAD
- `src/app/api/public/video/route.ts` — Scoring adaptativo, limpieza APTO
- `src/app/api/candidates/route.ts` — SA aggregated mode
- `src/app/api/companies/route.ts` — SA audit log
- `src/app/api/results/route.ts` — SA aggregated mode
- `src/app/api/dashboard/route.ts` — Limpieza APTO/NO_RECOMENDADO
- `src/app/api/migrate/route.ts` — integrityScore columns + CompanyPrivacyNotice table
- `src/components/views/ConsentView.tsx` — Responsable/Encargado
- `src/components/views/EvaluationView.tsx` — ShieldCheck, INTEGRIDAD en consent filter
- `src/components/views/CandidatesView.tsx` — Limpieza APTO legacy
- `src/components/views/CandidateDetailView.tsx` — Limpieza APTO legacy
- `src/components/views/CompareView.tsx` — Limpieza APTO legacy
- `src/components/views/VacancyManagementView.tsx` — Limpieza APTO legacy

#### A. Aviso de Privacidad por Empresa
- Modelo `CompanyPrivacyNotice` con `companyId @unique`, `contentHtml`, `version='2026-01-v2'`, `isCustom`
- Generador automático con 31+ secciones LFPDPPP (Responsable, Encargado, datos sensibles, ARCO, integridad)
- Auto-creación al crear empresa (non-fatal)
- GET público (auto-genera si no existe), PUT (RH edita), POST regenerate
- ConsentView muestra "Responsable: {companyName}" y "EvaluHR es Encargado"

#### B. Evaluación de Integridad — 4to paso (sensible, orientativa)
- 10 preguntas LIKERT: INTEGRITY_HONESTY (3), RULES (3), THEFT (2), RESPONSIBILITY (2)
- Template `type: INTEGRIDAD, order: 3 o 4` según hasKnowledgeTest
- `integrityScore` en EvaluationResult y VacancyApplication
- `includeIntegridad` en Vacancy (default true)
- Scoring adaptativo 4 secciones: 0.25*BigFive + 0.25*Psico + 0.15*Integridad + 0.35*Conocimientos
- KNOWLEDGE_ONLY oculta integridad (dato sensible)
- UI: ShieldCheck, labels, "Retirar consentimiento" activo en paso integridad
- Regla 6 respetada: integridad NUNCA como filtro de descarte automático

#### C. SUPER_ADMIN solo agregados + suplantación explícita
- SA sin companyId → `{ aggregated: [...], mode: 'aggregated' }` (counts, NO PII)
- SA con `?companyId=xxx` → vista normal scoped + `[AUDIT]` log
- Aplica a /api/candidates, /api/companies, /api/results

#### D. Limpieza APTO/NO_RECOMENDADO/ENTREVISTA_ADICIONAL
- 0 referencias restantes en todo `src/`
- CompareView, VacancyManagementView, CandidatesView, CandidateDetailView, dashboard, public/video

#### E. Migrate endpoint
- Agrega integrityScore (EvaluationResult, VacancyApplication), includeIntegridad (Vacancy)
- Crea tabla CompanyPrivacyNotice con FK, unique, index

#### Post-deploy requerido
- Ejecutar `POST /api/migrate` como SUPER_ADMIN para aplicar columnas/tablas nuevas en producción
- Las 6 reglas de NO ROMPER (CHAT_Z_HANDOFF.md) siguen vigentes

---

### 20 Junio 2025 — Fix 3 bugs críticos + violación de política (orientación vs decisión)

**Archivos modificados:**
- `src/app/api/evaluations/route.ts` — Scoring adaptativo, orientación neutral, unscoped client para upsert
- `src/app/api/public/apply/route.ts` — Mismos fixes de scoring y orientación
- `src/app/api/dashboard/route.ts` — Nuevos contadores de guidance
- `src/components/views/DashboardView.tsx` — Vista de orientación en vez de recomendación
- `src/components/views/CandidatesView.tsx` — Badges de orientación
- `src/components/views/CandidateDetailView.tsx` — Labels de orientación
- `src/components/views/EvaluationView.tsx` — Error handling en handleComplete

#### Bug 1: Resultados no aparecen en dashboard

**Síntoma:** Dos candidatos completaron evaluación de conocimientos por invitación pero sus resultados no aparecían en el dashboard del administrador.

**Causa raíz:** `completeEvaluation()` usaba `rlsDb.evaluationResult.upsert({ where: { sessionId } })`. La extensión RLS agregaba automáticamente un filtro `companyId` al `where`, pero `EvaluationResult` tiene `@@unique([sessionId])` — NO `@@unique([sessionId, companyId])`. Prisma rechazaba el upsert porque el `where` no coincidía con la constraint única de la tabla. El error era tragado silenciosamente porque el frontend no verificaba la respuesta del API y navegaba directamente a la pantalla de completado.

**Fix:**
1. Usar `getUnscopedClient()` para `findUnique` + `create/update` en vez de `upsert` con RLS
2. Verificar `res.ok` en el frontend (`handleComplete`) antes de navegar

#### Bug 2: Todos clasificados como "no apta"

**Síntoma:** Ambos candidatos fueron clasificados como "no apta" a pesar de haber completado las preguntas de conocimiento.

**Causa raíz:** Cuando faltaban secciones (ej. solo conocimientos completados, sin psicométrica ni psicológica), las categorías sin respuestas obtenían score 0. Con la fórmula `0.30*0 + 0.30*0 + 0.40*conocimiento`, incluso con 100% en conocimientos el máximo posible era 40 (por debajo del umbral de 50 = NO_RECOMENDADO).

**Fix:** Scoring adaptativo — solo promedia las categorías que tienen respuestas reales. Los pesos se ajustan dinámicamente según las secciones disponibles. Si solo hay conocimientos, el overall score refleja solo conocimientos.

#### Bug 3 (Violación de política): Sistema decide en vez de orientar

**Síntoma:** Sistema usaba APTO/ENTREVISTA_ADICIONAL/NO_RECOMENDADO como decisión de contratación, violando el acuerdo de que el sistema solo debe ofrecer orientación (Art. 37 Bis LFPDPPP).

**Causa raíz:** Los valores del enum `recommendation` representaban una decisión binaria sobre la contratación.

**Fix:**
1. Cambio de valores: `PERFIL_COMPLETO` (todas las secciones completadas) / `PERFIL_PARCIAL` (secciones parciales) / `PENDIENTE` (evaluación incompleta)
2. Summary ahora describe el perfil del candidato sin emitir juicio de contratación
3. Cierre neutral obligatorio: "La decisión final corresponde al área de Recursos Humanos."
4. Dashboard, CandidatesView y CandidateDetailView actualizados con nueva terminología
5. Mismo cambio aplicado en `/api/public/apply/route.ts` para vacantes públicas

#### Bug 4 (Descubierto durante investigación): Frontend no detectaba errores

**Síntoma:** El frontend navegaba a "evaluation-complete" sin importar si el API había fallado.

**Fix:** Verificar `res.ok` en `handleComplete()` antes de navegar. Mostrar error al usuario si falla.

**Estado:** Commited y pushed a GitHub.

---

### 20 Agosto 2026 — Fix "Usuario no encontrado" en consent flow

**Commit:** `e0d2b08` → `751cf3b` (pushed to main)

**Problema:** Al crear una invitación nueva y abrir el link, el candidato llegaba a la vista de consentimiento pero al hacer clic en "Continuar" recibía el error "Usuario no encontrado" (HTTP 404).

**Causa raíz:** El API de consentimiento usaba `rlsDb.user.findUnique()` con el cliente RLS (Row-Level Security), que agrega automáticamente un filtro `companyId`. Si había cualquier discrepancia entre el `companyId` del JWT y el `companyId` real del usuario en la BD (usuarios huérfanos de invitaciones eliminadas), la búsqueda retornaba `null` → "Usuario no encontrado".

**Fixes aplicados:**

1. **`src/app/api/consent/route.ts`** — Reescritura completa del lookup del usuario:
   - Cambió de `rlsDb.user.findUnique` (RLS) → `safeFindUserById()` con cliente **unscoped**
   - 3 niveles de fallback (full query → minimal select → bare minimum) para resiliencia a columnas faltantes
   - Verificación explícita de ownership como defense-in-depth
   - Fallback a SQL crudo si Prisma update fall
   - Logging detallado con prefijo `[consent]`

2. **`src/app/api/auth/route.ts` (auto-login)** — Fix de usuarios huérfanos:
   - Cuando reutiliza un usuario huérfano existente (mismo teléfono), ahora **actualiza su companyId** para que coincida con la invitación actual
   - Manejo graceful de fallos de create con fallback a campos mínimos

3. **`src/app/api/invite/route.ts` (bulk delete)** — Limpieza de huérfanos:
   - Al borrar todas las invitaciones (`?all=true`), también elimina los usuarios candidatos auto-creados (`cand_*.auto`), sus sesiones de evaluación y logs de consentimiento

4. **`src/app/api/migrate/route.ts`** — Cobertura completa de columnas:
   - Ahora agrega las **7 columnas** de consent (antes solo 5): consentGiven, consentDate, consentOption, anonymousStats, consentConfirmed, consentWithdrawnAt, consentVersion
   - Limpia usuarios huérfanos como parte de la migración

**Verificación en producción:**
- ✅ Deploy exitoso a Vercel
- ✅ Migración ejecutada (todas las columnas existen, no hay huérfanos)
- ✅ Test end-to-end con Agent Browser: invitación → auto-login → consentimiento → evaluación (sin errores)

---

### Agosto 2026 — Sistema de Consentimiento LFPDPPP

**Implementación completa del sistema de consentimiento informado:**

- ConsentView con 3 opciones (A=FULL, B=KNOWLEDGE_ONLY, C=anonymousStats)
- ConsentLog audit table (GIVEN, MODIFIED, WITHDRAWN)
- Botón "Retirar consentimiento" en EvaluationView
- Opción B con toggle (click para seleccionar/deseleccionar)
- Versión del aviso de privacidad: `2026-01-v1`
- Períodos de conservación documentados
- Derechos ARCO en la UI
- Aviso de no discriminación (Art. 37 Bis)
- Endpoint `/api/migrate` para sync de schema en producción
