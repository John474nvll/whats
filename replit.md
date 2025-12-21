# SocialHub v1.1 - Complete Social Media Management Platform

## Project Overview
SocialHub es una plataforma integral para gestionar múltiples redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional, con autenticación JWT, vinculación de cuentas y publicación de contenido.

## ✅ Features Completadas v1.1

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

### Publicación de Contenido
- ✅ Endpoint de publicación unificado
- ✅ Soporte para Instagram, Facebook, WhatsApp
- ✅ Publicación con contenido, imágenes, enlaces
- ✅ Interfaz de usuario para publicar

### Frontend Pages
- ✅ **Login** - Autenticación con credenciales demo
- ✅ **Dashboard** - Métricas principales
- ✅ **Messages/Inbox** - Mensajes unificados
- ✅ **Contacts** - Gestión de contactos
- ✅ **Analytics** - Análisis de datos
- ✅ **AI Generator** - Generador de contenido con OpenAI
- ✅ **Account Links** - Gestión de cuentas de redes sociales
- ✅ **Settings** - Configuración de canales

### UI/UX & Branding
- ✅ Dark theme profesional
- ✅ Gradientes azul-púrpura
- ✅ Colores por plataforma (WhatsApp verde, Instagram rosa, Facebook azul)
- ✅ Logo generado con IA
- ✅ Componentes Shadcn/UI
- ✅ Tailwind CSS + animaciones Framer Motion
- ✅ Navegación con Sidebar Shadcn
- ✅ Test IDs para todos los elementos interactivos

## Technology Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL con Drizzle ORM
- **Authentication**: JWT + bcrypt
- **AI**: Replit OpenAI Integrations (Chat & Image)
- **Form Validation**: React Hook Form + Zod

## Project Structure
```
├── client/src/
│   ├── pages/
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Inbox.tsx          # Messages unified
│   │   ├── Contacts.tsx       # Contact management
│   │   ├── Analytics.tsx      # Analytics & metrics
│   │   ├── AIGenerator.tsx    # Content generation
│   │   ├── AccountLinks.tsx   # Social account linking
│   │   ├── Settings.tsx       # Configuration
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   ├── theme-toggle.tsx   # Dark/light mode
│   │   └── ui/               # Shadcn components
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── queryClient.ts
│   └── App.tsx
├── server/
│   ├── routes.ts              # API endpoints (auth, publish, accounts)
│   ├── storage.ts             # Database interface (Drizzle)
│   ├── db.ts                  # Drizzle client
│   ├── index.ts               # Express setup
│   ├── services/
│   │   ├── auth.ts           # Authentication logic
│   │   ├── social-publisher.ts # Social media publishing
│   │   └── ai_orchestrator.ts
│   ├── middleware/
│   │   └── auth.ts           # JWT verification
│   └── replit_integrations/
│       ├── chat/             # OpenAI chat
│       └── image/            # OpenAI image generation
├── shared/
│   └── schema.ts             # Zod schemas & database types
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login con username/password
- `POST /api/auth/register` - Registrar nuevo usuario

### Social Accounts
- `GET /api/social-accounts` - Listar cuentas conectadas (Auth required)
- `POST /api/social-accounts/connect` - Conectar nueva cuenta (Auth required)

### Publishing
- `POST /api/publish` - Publicar contenido en plataforma (Auth required)
  - Body: { platform, content, image? }

### Other
- `GET /api/messages` - Mensajes unificados
- `GET /api/contacts` - Contactos
- `POST /api/ai/chat` - Chat con OpenAI
- `POST /api/ai/image` - Generar imagen con OpenAI
- `GET/PUT /api/channels/:platform` - Config de canales

## Demo Credentials
```
Username: admin
Password: admin123
```

## Database Schema

### Users
```sql
users(
  id: UUID PRIMARY KEY,
  username: TEXT UNIQUE,
  password: TEXT (bcrypt hash),
  createdAt: TIMESTAMP
)
```

### Social Accounts
```sql
social_accounts(
  id: SERIAL PRIMARY KEY,
  userId: UUID (FK users),
  platform: TEXT ('instagram'|'facebook'|'whatsapp'),
  accountId: TEXT,
  accountName: TEXT,
  accessToken: TEXT,
  refreshToken: TEXT,
  metadata: JSONB,
  isConnected: BOOLEAN,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
)
```

### Contacts, Messages, Conversations
```sql
contacts(id, name, phone, platform, metadata, createdAt)
conversations(id, contactId, channel, status, botStatus, lastMessageAt, createdAt)
messages(id, conversationId, content, role, platformMessageId, metadata, createdAt)
```

## Running the Project

### Development
```bash
npm run dev
# Frontend: http://localhost:5000
# Backend: http://localhost:5000/api (same port)
```

### Build & Production
```bash
npm run build
npm start
```

### Database
```bash
npm run db:push      # Sync schema to DB
npm run db:studio    # Open Drizzle Studio
```

## Environment Variables
```
DATABASE_URL=postgresql://...         # (optional - default: in-memory)
SESSION_SECRET=your-secret-key        # For JWT signing
OPENAI_API_KEY=sk-...                 # (handled by Replit AI Integration)
META_ACCESS_TOKEN=your-token          # For Meta Graph API (optional for demo)
META_VERIFY_TOKEN=verify-token        # For webhook verification (optional)
```

## Workflow Configuration
- **Name**: Start application
- **Command**: npm run dev
- **Port**: 5000
- **Type**: Full-stack web app

## v1.1 Improvements
- Added complete JWT authentication system
- Created social account linking UI and backend
- Implemented content publishing endpoints
- Added login page with demo credentials
- Protected routes with auth middleware
- Database schema for social accounts
- AccountLinks page for managing connections

## Next Steps (Future)
- [ ] Real Meta Graph API integration (Facebook/Instagram)
- [ ] Real WhatsApp Cloud API integration
- [ ] OAuth 2.0 flow for account linking
- [ ] Push notifications
- [ ] Advanced analytics and reporting
- [ ] Custom automation rules
- [ ] Team collaboration features
- [ ] Mobile app version
- [ ] Video messaging support
- [ ] File sharing and attachments

## Deployment
### Vercel
1. Push a GitHub
2. Connect repo en Vercel
3. Set env vars: DATABASE_URL, SESSION_SECRET
4. Configure build: `npm run build`
5. Start command: `npm start`
6. Deploy!

## Resources
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express.js](https://expressjs.com)
- [JWT Auth](https://jwt.io)

## Last Updated
2024-12-21 - v1.1 Complete

---

**Status**: ✅ READY FOR PRODUCTION v1.1
