# SocialHub v3.0 - Platform PWA Completa de Gestión de Redes Sociales

## 📋 Descripción General
SocialHub v3.0 es una **plataforma integral, renovada y completamente funcional como PWA** para gestionar múltiples redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional con autenticación JWT, vinculación de cuentas, publicación de contenido, gestión avanzada de clientes, campañas multicanal, y generación de contenido con IA. Totalmente instalable como aplicación nativa en móviles y con soporte offline.

## ✨ Características Principales v3.0

### PWA Completa
- ✅ Progressive Web App funcional
- ✅ Service Worker con caché inteligente
- ✅ Instalable en dispositivos (Android/iOS)
- ✅ Offline capabilities
- ✅ Sincronización en background
- ✅ Soporte de notificaciones push
- ✅ Manifesto PWA completo
- ✅ Iconos maskable para todos los dispositivos

### 🔐 Autenticación & Usuarios
- ✅ Sistema de login/registro con JWT
- ✅ Autenticación basada en tokens (Bearer)
- ✅ Hash de contraseñas con bcrypt (seguro)
- ✅ Middleware de autenticación protegido
- ✅ **Dos cuentas demo pre-creadas con acceso rápido**
  - Admin: `socialadmin` / `SocialPass2025`
  - Manager: `manager` / `Manager2025`

### 🎨 Diseño Renovado v3.0
- ✅ **Colores Neon Completos:**
  - Verde Kiwi (HSL 142 92% 48%) - Primario
  - Cian Neon (HSL 183 100% 50%) - Secundario
  - Frambuesa Intensa (HSL 336 100% 60%) - Acento
  - Piña Neon (HSL 48 100% 50%) - Complementario
- ✅ Border radius ultra-redondeado (3rem)
- ✅ Glassmorphism y efectos neon
- ✅ Gradientes y fondos animados
- ✅ Login completamente renovado con interfaz impresionante
- ✅ Componentes Shadcn mejorados
- ✅ Responsive en mobile y desktop

### 👥 Gestión de Clientes (NUEVO)
- ✅ Base de datos completa de clientes
- ✅ Almacenamiento de información de contacto
- ✅ Tags y metadatos personalizados
- ✅ Estados de cliente (activo, inactivo, bloqueado)
- ✅ Integración con plataformas sociales
- ✅ **CRUD endpoints completos**
- ✅ Búsqueda y filtrado avanzado
- ✅ Estadísticas en tiempo real

### 📢 Campañas Multicanal (MEJORADO)
- ✅ Creación de campañas con IA
- ✅ Soporte para múltiples plataformas
- ✅ Métricas y tracking
- ✅ Programación de campañas
- ✅ **Dropdowns inteligentes para selección**
- ✅ Estados de campaña (draft, active, completed)
- ✅ Previsualización de contenido

### 🤖 Generador de Contenido con IA
- ✅ Integración con OpenAI (Replit Integration)
- ✅ Generación de texto con IA
- ✅ Generación de imágenes con IA
- ✅ Chat interactivo inteligente
- ✅ Sugerencias automáticas

### 📱 Integración de Redes Sociales
- ✅ Sistema de vinculación de cuentas
- ✅ Almacenamiento seguro de credenciales
- ✅ Endpoints de conexión/desconexión
- ✅ Gestión de múltiples cuentas
- ✅ **Conexión directa en dashboard**

### 📊 Páginas Completas
- ✅ **Login** - Diseño renovado con acceso rápido a cuentas demo
- ✅ **Dashboard** - Resumen inteligente y gestión de cuentas
- ✅ **Customers** - Gestión completa de base de datos de clientes
- ✅ **Contacts** - Gestión de contactos por plataforma
- ✅ **Campaigns** - Campañas multicanal con IA
- ✅ **Inbox** - Mensajes unificados
- ✅ **Analytics** - Análisis y métricas en tiempo real
- ✅ **AI Generator** - Generador de contenido con OpenAI
- ✅ **Account Links** - Gestión de cuentas sociales
- ✅ **Settings** - Configuración de canales
- ✅ **Funnel Builder** - Constructor de embudos de venta
- ✅ **Music Manager** - Gestor de contenido musical

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Shadcn UI |
| **Backend** | Express.js + TypeScript |
| **Base de Datos** | PostgreSQL con Drizzle ORM |
| **Autenticación** | JWT + bcrypt |
| **IA** | Replit OpenAI Integrations (Chat & Image) |
| **Forms** | React Hook Form + Zod |
| **Estado** | TanStack React Query v5 |
| **Routing** | Wouter |
| **Animaciones** | Framer Motion |

## 📂 Estructura del Proyecto

```
SocialHub/
├── client/src/
│   ├── pages/
│   │   ├── Login.tsx              # Login renovado (v2.0)
│   │   ├── Dashboard.tsx          # Dashboard con gestión de cuentas
│   │   ├── Customers.tsx          # Gestión de clientes (NUEVO)
│   │   ├── Contacts.tsx           # Gestión de contactos
│   │   ├── Campaigns.tsx          # Campañas multicanal
│   │   ├── Inbox.tsx             # Mensajes unificados
│   │   ├── Analytics.tsx          # Análisis de datos
│   │   ├── AIGenerator.tsx        # Generador de contenido
│   │   ├── AccountLinks.tsx       # Gestión de cuentas sociales
│   │   ├── Settings.tsx           # Configuración
│   │   ├── FunnelBuilder.tsx      # Constructor de embudos
│   │   ├── MusicManager.tsx       # Gestor de música
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── app-sidebar.tsx        # Sidebar de navegación
│   │   ├── theme-toggle.tsx       # Toggle de tema
│   │   └── ui/                    # Componentes Shadcn
│   ├── hooks/
│   │   ├── use-contacts.ts
│   │   ├── use-conversations.ts
│   │   ├── use-channels.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── queryClient.ts
│   └── App.tsx
├── server/
│   ├── routes.ts                  # API endpoints
│   ├── storage.ts                 # Interfaz de BD
│   ├── db.ts                      # Cliente Drizzle
│   ├── index.ts                   # Setup Express
│   ├── services/
│   │   ├── auth.ts               # Lógica de autenticación
│   │   ├── social-publisher.ts   # Publicación en redes
│   │   ├── openai.ts             # Servicios OpenAI
│   │   ├── ai_orchestrator.ts    # Orquestación de IA
│   │   ├── platforms.ts          # Integraciones de plataformas
│   │   └── music.ts              # Servicios de música
│   ├── middleware/
│   │   └── auth.ts               # Verificación JWT
│   └── replit_integrations/
│       ├── chat/                 # OpenAI chat
│       └── image/                # Generación de imágenes
├── shared/
│   ├── schema.ts                 # Esquemas Zod + tipos
│   ├── models/
│   └── routes.ts
└── package.json
```

## 🗄️ Esquema de Base de Datos v2.0

### Tabla: Users
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

### Tabla: Customers (NUEVA)
```sql
customers(
  id: SERIAL PRIMARY KEY,
  userId: UUID (FK users),
  name: TEXT NOT NULL,
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

### Tabla: Campaigns
```sql
campaigns(
  id: SERIAL PRIMARY KEY,
  userId: UUID (FK users),
  name: TEXT NOT NULL,
  platform: TEXT ('all'|'whatsapp'|'instagram'|'facebook'),
  status: TEXT ('draft'|'active'|'completed'),
  content: TEXT,
  aiGenerated: BOOLEAN,
  metrics: JSONB,
  scheduledAt: TIMESTAMP,
  createdAt: TIMESTAMP
)
```

### Otras Tablas
- `social_accounts` - Cuentas conectadas
- `contacts` - Contactos por plataforma
- `conversations` - Conversaciones activas
- `messages` - Historial de mensajes
- `widgets` - Widgets personalizados
- `salesFunnels` - Embudos de venta
- `channelConfigs` - Configuración de canales
- `artistProfiles` - Perfiles de artistas
- `musicContent` - Contenido musical

## 🔌 API Endpoints - Completos

### Autenticación
```
POST /api/auth/login       # Login (usuario/contraseña)
POST /api/auth/register    # Registrar nueva cuenta
```

### Clientes (NUEVO)
```
GET    /api/customers      # Listar todos los clientes
GET    /api/customers/:id  # Obtener cliente específico
POST   /api/customers      # Crear nuevo cliente
PATCH  /api/customers/:id  # Actualizar cliente
DELETE /api/customers/:id  # Eliminar cliente
```

### Campañas
```
GET    /api/campaigns      # Listar campañas
POST   /api/campaigns      # Crear campaña
PATCH  /api/campaigns/:id  # Actualizar campaña
DELETE /api/campaigns/:id  # Eliminar campaña
```

### Cuentas Sociales
```
GET    /api/social-accounts              # Listar cuentas conectadas
POST   /api/social-accounts/connect      # Conectar nueva cuenta
PATCH  /api/social-accounts/:id          # Actualizar cuenta
DELETE /api/social-accounts/:id          # Desconectar cuenta
```

### Publicación
```
POST /api/publish  # Publicar contenido en plataforma
```

### Mensajes & Conversaciones
```
GET  /api/messages          # Mensajes unificados
GET  /api/conversations     # Conversaciones activas
GET  /api/conversations/:id # Detalles de conversación
POST /api/conversations/:id/messages # Enviar mensaje
```

### Contactos
```
GET    /api/contacts       # Listar contactos
GET    /api/contacts/:id   # Obtener contacto
POST   /api/contacts       # Crear contacto
PATCH  /api/contacts/:id   # Actualizar contacto
DELETE /api/contacts/:id   # Eliminar contacto
```

### IA & Contenido
```
POST /api/ai/chat      # Chat con OpenAI
POST /api/ai/image     # Generar imagen con IA
```

### Otros
```
GET    /api/widgets                # Obtener widgets del usuario
PATCH  /api/widgets/:id            # Actualizar widget
GET    /api/funnels                # Embudos de venta
POST   /api/funnels                # Crear embudo
GET    /api/artists                # Perfiles de artistas
POST   /api/artists                # Crear perfil de artista
GET    /api/channels               # Configuración de canales
PUT    /api/channels/:platform     # Actualizar canal
```

## 🎨 Sistema de Colores v3.0

| Color | HSL | Uso |
|-------|-----|-----|
| **Kiwi Green** | 142 92% 48% | Primario (botones, links) |
| **Cyan Neon** | 183 100% 50% | Secundario (acentos) |
| **Frambuesa** | 336 100% 60% | Acento (alertas, highlights) |
| **Piña** | 48 100% 50% | Complementario (notificaciones) |

## 🚀 Cómo Ejecutar

### Desarrollo
```bash
npm run dev
# Frontend & Backend: http://localhost:5000
```

### Build & Producción
```bash
npm run build
npm start
```

### Base de Datos
```bash
npm run db:push      # Sincronizar schema
npm run check        # Verificar tipos
```

## 🔐 Variables de Entorno
```
DATABASE_URL=postgresql://...     # Conexión PostgreSQL
SESSION_SECRET=your-secret-key    # Para JWT
OPENAI_API_KEY=sk-...            # (Replit Integration)
```

## 📊 Credenciales de Prueba

### Cuenta Admin
- **Usuario:** `socialadmin`
- **Contraseña:** `SocialPass2025`
- **Rol:** Admin (acceso completo)

### Cuenta Manager
- **Usuario:** `manager`
- **Contraseña:** `Manager2025`
- **Rol:** User (acceso limitado)

Ambas cuentas están **pre-creadas** en la BD. Acceso instantáneo desde el login.

## 🔧 Configuración del Workflow
- **Nombre:** Start application
- **Comando:** npm run dev
- **Puerto:** 5000
- **Tipo:** Full-stack web app (webview)

## ✅ Mejoras v2.0 vs v1.1

| Aspecto | v1.1 | v2.0 | v3.0 |
|--------|------|------|------|
| Login | Básico | ✨ Renovado + Acceso rápido | ✅ Mismo |
| Colores | Azul/Púrpura | 🎨 Neon Completo | ✅ Mismo |
| Border Radius | Moderado | 🔘 Ultra-redondeado (3rem) | ✅ Mismo |
| Clientes | ❌ No | ✅ CRUD completo | ✅ Mismo |
| Campañas | Básico | ✨ Con dropdowns y IA | ✅ Mismo |
| Endpoints | 15+ | ✅ 30+ completos | ✅ Mismo |
| Módulos | 8 | ✅ 12 + 4 completos | ✅ Mismo |
| BD | Estándar | 🗄️ Ampliada | ✅ Mismo |
| **PWA** | ❌ No | ❌ No | ✨ **COMPLETA** |
| **Offline** | ❌ No | ❌ No | ✨ **SÍ** |
| **Instalable** | ❌ No | ❌ No | ✨ **SÍ** |

## 🎯 Próximos Pasos (Futuros)

- ✅ **Catálogo de Productos:** CRUD completo para gestionar inventario centralizado.
- ✅ **Tracking de Links:** Sistema de acortamiento con métricas de clics por plataforma.
- ✅ **Orquestación Master:** Lanzamiento masivo a múltiples cuentas seleccionadas.
- ✅ **Roles de Venta:** Dashboard optimizado para vendedoras con métricas de ROI y leads.
- ✅ **Integración Total:** Todos los módulos conectados y funcionales en v2.0.

## 📦 Deployment

### Replit
1. Base de datos PostgreSQL incluida
2. Variables de entorno pre-configuradas
3. Build: `npm run build`
4. Run: `node ./dist/index.cjs`

### Vercel/Railway
1. Configurar PostgreSQL externa
2. Configurar env vars
3. Deploy automático desde Git

## 📚 Documentación Adicional

- [API Reference](./API.md)
- [Setup Guide](./SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🏆 Features Completados

- ✅ Autenticación JWT (segura)
- ✅ Gestión de múltiples cuentas
- ✅ Base de datos expandida
- ✅ Todos los endpoints
- ✅ Todas las páginas
- ✅ Diseño renovado
- ✅ Sistema de colores neon
- ✅ IA integrada
- ✅ Gestión de clientes
- ✅ Campañas multicanal

## 📞 Soporte

Para preguntas o issues, contacta al equipo de desarrollo.

---

**Última Actualización:** 27 de Diciembre de 2025  
**Versión:** 3.0 PWA COMPLETA  
**Estado:** ✅ PRODUCCIÓN LISTA + PWA COMPLETAMENTE FUNCIONAL

**SocialHub v3.0 PWA - La plataforma más completa y moderna para gestionar tus redes sociales desde cualquier dispositivo.**
