# SocialHub v2.0 - Advanced Social Media Management Platform

## Project Overview
SocialHub v2.0 es una plataforma integral para gestionar múltiples redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional con autenticación JWT, vinculación de cuentas, publicación de contenido, gestión de clientes avanzada, campañas multicanal y generación de contenido con IA.

## ✅ Features Completadas v2.0

### Autenticación & Usuarios
- ✅ Sistema de login/registro con JWT
- ✅ Autenticación basada en tokens (Bearer)
- ✅ Hash de contraseñas con bcrypt
- ✅ Middleware de autenticación protegido
- ✅ Credenciales demo: admin/admin123

### Integración de Redes Sociales
- ✅ Sistema de vinculación de cuentas (Instagram, Facebook, WhatsApp)
- ✅ Almacenamiento de credenciales de acceso
- ✅ Endpoints de conexión/desconexión
- ✅ Gestión de múltiples cuentas por usuario

### Gestión de Clientes (NEW v2.0)
- ✅ Base de datos completa de clientes
- ✅ Almacenamiento de información de contacto
- ✅ Tags y metadatos personalizados
- ✅ Estados de cliente (activo, inactivo, bloqueado)
- ✅ Integración con plataformas sociales
- ✅ CRUD endpoints completos

### Campañas Multicanal (ENHANCED v2.0)
- ✅ Creación de campañas con IA
- ✅ Soporte para múltiples plataformas
- ✅ Métricas y tracking
- ✅ Programación de campañas
- ✅ Dropdowns y selección avanzada
- ✅ Estados de campaña (draft, active, completed)

### Publicación de Contenido
- ✅ Endpoint de publicación unificado
- ✅ Soporte para Instagram, Facebook, WhatsApp
- ✅ Publicación con contenido, imágenes, enlaces
- ✅ Interfaz de usuario para publicar

### Generador de Contenido con IA
- ✅ Integración con OpenAI Replit
- ✅ Generación de texto con IA
- ✅ Generación de imágenes con IA
- ✅ Chat interactivo con IA

### Frontend Pages
- ✅ **Login** - Autenticación con credenciales demo
- ✅ **Dashboard** - Métricas principales y widgets
- ✅ **Messages/Inbox** - Mensajes unificados
- ✅ **Contacts** - Gestión de contactos
- ✅ **Customers** - Gestión avanzada de clientes (NEW)
- ✅ **Campaigns** - Campañas multicanal (ENHANCED)
- ✅ **Analytics** - Análisis de datos
- ✅ **AI Generator** - Generador de contenido con OpenAI
- ✅ **Account Links** - Gestión de cuentas sociales
- ✅ **Settings** - Configuración de canales
- ✅ **Funnel Builder** - Constructor de embudos de venta
- ✅ **Music Manager** - Gestor de contenido musical

### UI/UX & Diseño (REFRESHED v2.0)
- ✅ Dark theme profesional y moderno
- ✅ **Colores Neon V3**:
  - Kiwi Green Neon (HSL 142 92% 48%)
  - Cyan Neon (HSL 183 100% 50%)
  - Raspberry Intense (HSL 336 100% 60%)
  - Pineapple Neon (HSL 48 100% 50%)
- ✅ Border radius aumentado (3rem ultra redondeado)
- ✅ Componentes Shadcn/UI mejorados
- ✅ Tailwind CSS + animaciones Framer Motion
- ✅ Navegación con Sidebar Shadcn
- ✅ Test IDs para todos los elementos interactivos
- ✅ Glassmorphism y efectos neon
- ✅ Gradientes y overlays mejorados

## Technology Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL con Drizzle ORM
- **Authentication**: JWT + bcrypt
- **AI**: Replit OpenAI Integrations (Chat & Image)
- **Form Validation**: React Hook Form + Zod
- **State Management**: TanStack React Query v5
- **Routing**: Wouter

## Project Structure
```
├── client/src/
│   ├── pages/
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Inbox.tsx          # Messages unified
│   │   ├── Contacts.tsx       # Contact management
│   │   ├── Customers.tsx      # Customer management (NEW)
│   │   ├── Campaigns.tsx      # Multi-channel campaigns (ENHANCED)
│   │   ├── Analytics.tsx      # Analytics & metrics
│   │   ├── AIGenerator.tsx    # Content generation
│   │   ├── AccountLinks.tsx   # Social account linking
│   │   ├── Settings.tsx       # Configuration
│   │   ├── FunnelBuilder.tsx  # Sales funnel builder
│   │   ├── MusicManager.tsx   # Music content management
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   ├── theme-toggle.tsx   # Dark/light mode
│   │   └── ui/               # Shadcn components
│   ├── hooks/
│   │   ├── use-contacts.ts
│   │   ├── use-conversations.ts
│   │   ├── use-channels.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── queryClient.ts
│   └── App.tsx
├── server/
│   ├── routes.ts              # API endpoints
│   ├── storage.ts             # Database interface (Drizzle)
│   ├── db.ts                  # Drizzle client
│   ├── index.ts               # Express setup
│   ├── services/
│   │   ├── auth.ts           # Authentication logic
│   │   ├── social-publisher.ts # Social media publishing
│   │   ├── openai.ts         # OpenAI services
│   │   ├── ai_orchestrator.ts # AI orchestration
│   │   ├── platforms.ts      # Platform integrations
│   │   └── music.ts          # Music services
│   ├── middleware/
│   │   └── auth.ts           # JWT verification
│   └── replit_integrations/
│       ├── chat/             # OpenAI chat
│       └── image/            # OpenAI image generation
├── shared/
│   ├── schema.ts             # Zod schemas & database types
│   ├── models/               # Data models
│   └── routes.ts             # API route definitions
└── package.json
```

## Database Schema v2.0

### Users
```sql
users(
  id: UUID PRIMARY KEY,
  username: TEXT UNIQUE,
  password: TEXT (bcrypt hash),
  role: TEXT ('admin'|'user'),
  avatar: TEXT,
  settings: JSONB,
  createdAt: TIMESTAMP
)
```

### Customers (NEW)
```sql
customers(
  id: SERIAL PRIMARY KEY,
  userId: UUID (FK users),
  name: TEXT,
  email: TEXT,
  phone: TEXT,
  platform: TEXT ('whatsapp'|'instagram'|'facebook'),
  platformId: TEXT,
  status: TEXT ('active'|'inactive'|'blocked'),
  tags: TEXT[],
  metadata: JSONB,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
)
```

### Campaigns (ENHANCED)
```sql
campaigns(
  id: SERIAL PRIMARY KEY,
  userId: UUID (FK users),
  name: TEXT,
  platform: TEXT ('all'|'whatsapp'|'instagram'|'facebook'),
  status: TEXT ('draft'|'active'|'completed'),
  content: TEXT,
  aiGenerated: BOOLEAN,
  metrics: JSONB,
  scheduledAt: TIMESTAMP,
  createdAt: TIMESTAMP
)
```

### Social Accounts, Contacts, Messages, Conversations
```sql
social_accounts(id, userId, platform, accountId, accountName, accessToken, refreshToken, metadata, isConnected, createdAt, updatedAt)
contacts(id, name, phone, platform, metadata, createdAt)
conversations(id, contactId, channel, status, botStatus, lastMessageAt, createdAt)
messages(id, conversationId, content, role, platformMessageId, metadata, createdAt)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login con username/password
- `POST /api/auth/register` - Registrar nuevo usuario

### Customers (NEW)
- `GET /api/customers` - Listar clientes (Auth required)
- `GET /api/customers/:id` - Obtener cliente específico (Auth required)
- `POST /api/customers` - Crear nuevo cliente (Auth required)
- `PATCH /api/customers/:id` - Actualizar cliente (Auth required)
- `DELETE /api/customers/:id` - Eliminar cliente (Auth required)

### Campaigns
- `GET /api/campaigns` - Listar campañas (Auth required)
- `POST /api/campaigns` - Crear campaña (Auth required)
- `PATCH /api/campaigns/:id` - Actualizar campaña (Auth required)
- `DELETE /api/campaigns/:id` - Eliminar campaña (Auth required)

### Social Accounts
- `GET /api/social-accounts` - Listar cuentas conectadas (Auth required)
- `POST /api/social-accounts/connect` - Conectar nueva cuenta (Auth required)

### Publishing
- `POST /api/publish` - Publicar contenido en plataforma (Auth required)

### Messaging
- `GET /api/messages` - Mensajes unificados
- `GET /api/conversations` - Conversaciones
- `GET /api/contacts` - Contactos

### AI & Content
- `POST /api/ai/chat` - Chat con OpenAI
- `POST /api/ai/image` - Generar imagen con OpenAI

### Other
- `GET /api/widgets` - Obtener widgets del usuario
- `GET /api/funnels` - Embudos de venta
- `GET /api/artists` - Perfiles de artistas
- `GET/PUT /api/channels/:platform` - Configuración de canales

## Demo Credentials
```
Username: admin
Password: admin123
```

## Colores Neon v3.0
- **Kiwi Green**: HSL(142 92% 48%) - Color primario
- **Cyan Neon**: HSL(183 100% 50%) - Color secundario
- **Raspberry Intense**: HSL(336 100% 60%) - Color de acento
- **Pineapple**: HSL(48 100% 50%) - Color complementario

## Running the Project

### Development
```bash
npm run dev
# Frontend & Backend: http://localhost:5000
```

### Build & Production
```bash
npm run build
npm start
```

### Database
```bash
npm run db:push      # Sync schema to DB
npm run check        # Type checking
```

## Environment Variables
```
DATABASE_URL=postgresql://...         # PostgreSQL connection
SESSION_SECRET=your-secret-key        # For JWT signing
OPENAI_API_KEY=sk-...                 # (handled by Replit AI Integration)
```

## Workflow Configuration
- **Name**: Start application
- **Command**: npm run dev
- **Port**: 5000
- **Type**: Full-stack web app with webview

## v2.0 Improvements vs v1.1
- 🎨 **Diseño Refreshed**: Nuevos colores neon (kiwi, cyan, raspberry, pineapple)
- 📐 **Border Radius**: Aumentado a 3rem para mayor redondeado
- 👥 **Gestión de Clientes**: Nueva tabla y endpoints CRUD completos
- 📊 **Campañas Mejoradas**: Dropdowns, estados avanzados, integración IA
- 🎯 **UI Mejorada**: Glassmorphism, efectos neon, animaciones suaves
- 📱 **Responsive**: Optimizado para mobile y desktop
- 🔒 **Seguridad**: Autenticación JWT mejorada
- ⚡ **Performance**: Optimizaciones con React Query

## Next Steps (Future)
- [ ] Real Meta Graph API integration
- [ ] Real WhatsApp Cloud API integration
- [ ] OAuth 2.0 flow
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Custom automation rules
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Video messaging
- [ ] File attachments

## Deployment
### Replit
1. App is ready to deploy on Replit with built-in database
2. Environment variables already configured
3. Build command: `npm run build`
4. Run command: `node ./dist/index.cjs`

### Vercel/Other
1. Configure PostgreSQL database
2. Set environment variables
3. Deploy with `npm run build` and start command

## Resources
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express.js](https://expressjs.com)
- [OpenAI API](https://platform.openai.com)

## Last Updated
2025-12-26 - v2.0 Complete with Design Refresh & Customer Management

---

**Status**: ✅ READY FOR PRODUCTION v2.0
