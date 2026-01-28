# SocialHub v11.0 - CRM & Redes Sociales (Softgam Edition)

## Overview
SocialHub v11.0 es la plataforma definitiva de CRM y gestión de redes sociales para el mercado colombiano. Integra capacidades de comunicación omnicanal en tiempo real (WhatsApp Business, Instagram, Facebook), automatización por IA con GPT-4o, y una estructura PWA optimizada para movilidad total.

## User Preferences
Desarrollo iterativo con entrega funcional incremental. Documentación clara y código siguiendo mejores prácticas modernas.

## Recent Changes (January 28, 2026)

### Funnels de Ventas (Nuevo)
- Página completa de gestión de embudos de conversión
- 4 tipos de funnels: Ventas, Leads, Webinar, Producto
- CRUD completo con etapas personalizables
- Estadísticas: total, activos, visitantes, ingresos
- Funciones: duplicar, pausar/activar, eliminar

### Voz & Twilio Mejorado
- Panel de llamadas con marcador numérico integrado
- Configuración de Twilio (Account SID, Auth Token) desde UI
- Integración Retell AI con gestión de agentes IA
- Historial de llamadas con duración y estado
- Pestañas: Marcador, Números, Agentes IA, Historial

### Órdenes de Compra
- Sistema completo de gestión de pedidos
- Estados: pendiente, aprobada, en_proceso, completada, cancelada
- Filtros por estado y búsqueda
- Soporte dark/light completo

### Base de Datos Ampliada
- funnels: embudos de ventas con etapas JSON
- voiceConfigs: configuración Twilio/Retell
- voiceAgents: agentes de IA para llamadas
- callLogs: registro de llamadas

### Upgrade to v11 from GitHub (Jan 26)
- Imported full v11 branch from https://github.com/John474nvll/whats.git
- Enhanced navigation with MARKETING and PROYECTOS quick access
- Improved all modules with better functionality and design

### Key Features
- **Omni-Channel Inbox**: WhatsApp Business, Instagram, Facebook unified messaging
- **AI Generator v3.2**: GPT-4o powered content generation with 6 types
- **Marketing Studio**: Campaign orchestration with mass messaging
- **Platforms Hub**: Unified connection management for all social platforms
- **CRM Dynamic**: Lead pipeline with visual tracking
- **Project Engine**: Projects and Tasks with agile methodology
- **Invoicing Pro**: Billing and sales metrics

### WhatsApp Business Integration
- Real WhatsApp Cloud API integration
- Webhook support for incoming messages
- Bulk messaging capability
- Template messages support
- Media messages (images, documents, audio)
- Interactive messages (buttons, lists)

### API Routes
- /api/whatsapp/send/text - Send text messages
- /api/whatsapp/send/bulk - Bulk messaging
- /api/whatsapp/send/template - Template messages
- /api/whatsapp/send/media - Media messages
- /api/whatsapp/webhook - Receive incoming messages
- /api/platforms/accounts - Get connected accounts
- /api/platforms/send-message - Unified message sending
- /api/platforms/publish - Publish to Instagram/Facebook
- /api/platforms/campaigns - Create sales campaigns

## System Architecture

### UI/UX Design: Neon Forest Green
- Primary: Kiwi Green (#22c55e)
- Secondary: Cyan Neon
- Accent: Intense Raspberry
- Glassmorphism with ultra-rounded borders (3rem)
- Dark theme optimized

### Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM (WAL mode)
- **AI:** Replit AI Integrations (GPT-4o, gpt-image-1)
- **PWA:** Service Workers, offline mode, push notifications
- **Voice:** Twilio Voice SDK integration

### Database Schema
- users - User accounts with roles
- contacts - Platform contacts (WhatsApp, Instagram, Facebook)
- conversations - Chat conversations
- messages - Individual messages with sentiment
- customers - CRM customer records
- campaigns - Marketing campaigns
- social_accounts - Connected social platforms
- tickets - Support tickets
- roles - Permission roles

## Environment Variables Required

### WhatsApp Business (Meta Cloud API)
- WHATSAPP_ACCESS_TOKEN - Meta permanent access token
- WHATSAPP_PHONE_NUMBER_ID - Phone number ID from Meta
- WHATSAPP_VERIFY_TOKEN - Webhook verification token
- WHATSAPP_BUSINESS_ID - WhatsApp Business Account ID

### Twilio Voice
- TWILIO_ACCOUNT_SID
- TWILIO_API_KEY
- TWILIO_API_SECRET
- TWILIO_APP_SID
- TWILIO_PHONE_NUMBER

### AI Services
- AI_INTEGRATIONS_OPENAI_API_KEY (auto-configured by Replit)
- AI_INTEGRATIONS_OPENAI_BASE_URL (auto-configured by Replit)

## Routes
- / - Dashboard with system status
- /inbox - Unified Inbox (WhatsApp, Instagram, Facebook)
- /contacts - Contact Management
- /customers - Customer Database / CRM
- /campaigns - Marketing Studio
- /platforms - Platforms Hub (connections)
- /ai-generator - AI Content Generator
- /projects - Project Management
- /tasks - Task Board
- /analytics - Analytics Dashboard
- /funnels - Funnel Builder
- /settings - Application Settings
- /billing - Billing & Invoicing
- /voice - Voice & Retell Manager

## Development Commands
- npm run dev - Development server
- npm run db:push - Push database schema
- npm run build - Production build

---
2026 Softgam.com - Tecnologia que impulsa tu crecimiento
