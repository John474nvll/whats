# 🌐 SocialHub - Plataforma Integral de Gestión de Redes Sociales

Una plataforma moderna y completa para gestionar mensajes, campañas, contactos y analítica en Instagram, Facebook y WhatsApp desde un único dashboard.

## ✨ Características

### 📊 Dashboard Principal
- **Métricas en Tiempo Real**: Mensajes nuevos, campañas activas, seguidores, tasa de engagement
- **Gráficos Interactivos**: Visualización de actividad de mensajes con Recharts
- **Vista Rápida**: Mensajes y campañas recientes
- **Sistema de Búsqueda**: Busca mensajes y campañas al instante

### 💬 Gestión de Mensajes
- **Inbox Unificado**: Todos los mensajes de Instagram, Facebook y WhatsApp en un solo lugar
- **Chat en Tiempo Real**: Interfaz moderna de chat con soporte para múltiples plataformas
- **IA Asistente**: Respuestas automáticas con inteligencia artificial
- **Estado del Contacto**: Visualiza el estado y plataforma de cada contacto

### 👥 Gestión de Contactos
- **Base de Datos de Contactos**: Almacena contactos de todas las plataformas
- **Búsqueda Avanzada**: Filtra contactos por nombre, teléfono o plataforma
- **Importación/Exportación**: Importa contactos en lote desde CSV
- **Segmentación**: Organiza contactos por etiquetas y grupos

### 🎯 Campañas
- **Gestor de Campañas**: Crea y administra campañas en múltiples plataformas
- **Programación**: Programa mensajes para enviar en horarios específicos
- **Análisis de Resultados**: Métricas detalladas de alcance y engagement
- **Plantillas**: Usa plantillas predefinidas para acelerar creación

### 🤖 Herramientas IA Integradas
- **Generador de Contenido**: Crea posts, captions y mensajes con IA
- **Respuestas Inteligentes**: Genera respuestas automáticas contextuales
- **Generador de Imágenes**: Crea imágenes para posts con IA
- **Análisis de Sentimiento**: Analiza el tono de mensajes

### ⚙️ Configuración Multi-Cuenta
- **Admin de Cuentas**: Gestiona múltiples cuentas por plataforma
- **Control de Acceso**: Asigna roles y permisos por usuario
- **Integración de Plataformas**: Conecta Instagram, Facebook y WhatsApp
- **Webhooks**: Configura webhooks para sincronización en tiempo real

### 🎨 Diseño Moderno
- **Interfaz Oscura Profesional**: Tema moderno y amigable con los ojos
- **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil
- **Animaciones Suaves**: Transiciones y animaciones con Framer Motion
- **Modo Claro/Oscuro**: Toggle de tema integrado

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js 18+ y npm
- PostgreSQL (opcional, usa memoria en desarrollo)
- Cuentas de desarrollador en Meta (Instagram/Facebook/WhatsApp)

### Paso 1: Clonar y Instalar Dependencias
```bash
# Clonar repositorio
git clone https://github.com/yourusername/socialhub.git
cd socialhub

# Instalar dependencias
npm install
```

### Paso 2: Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Database (opcional, usa memoria por defecto)
DATABASE_URL=postgresql://user:password@localhost:5432/socialhub

# Meta (Facebook/Instagram/WhatsApp)
META_ACCESS_TOKEN=tu_access_token_aqui
META_VERIFY_TOKEN=tu_verify_token_aqui
META_PHONE_NUMBER_ID=tu_phone_number_id_aqui

# OpenAI (para IA)
OPENAI_API_KEY=sk_...

# Sesión
SESSION_SECRET=tu_secret_aleatorio_aqui
```

### Paso 3: Ejecutar en Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Paso 4: Build para Producción
```bash
npm run build
npm start
```

## 📋 Estructura del Proyecto

```
socialhub/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Inbox.tsx
│   │   │   ├── Contacts.tsx
│   │   │   └── Settings.tsx
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ui/          # Componentes Shadcn
│   │   │   ├── AIWidgets.tsx
│   │   │   ├── AccountManager.tsx
│   │   │   └── app-sidebar.tsx
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilidades
│   │   └── index.css        # Estilos globales
│   └── vite.config.ts
├── server/                    # Backend Express
│   ├── index.ts             # Entry point
│   ├── routes.ts            # Rutas API
│   ├── storage.ts           # Capa de datos
│   └── vite.ts              # Server Vite
├── shared/                    # Código compartido
│   ├── schema.ts            # Esquemas Zod
│   └── routes.ts            # Tipos API
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔌 API Endpoints

### Conversaciones
- `GET /api/conversations` - Listar conversaciones
- `GET /api/conversations/:id` - Obtener conversación
- `POST /api/messages` - Enviar mensaje
- `PATCH /api/conversations/:id/bot` - Toggle bot

### Contactos
- `GET /api/contacts` - Listar contactos
- `POST /api/contacts` - Crear contacto
- `PATCH /api/contacts/:id` - Actualizar contacto
- `DELETE /api/contacts/:id` - Eliminar contacto

### Canales
- `GET /api/channels` - Listar canales conectados
- `PATCH /api/channels/:platform` - Actualizar configuración

## 🌍 Desplegar en Vercel

### Paso 1: Preparar Repositorio GitHub
```bash
# Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/socialhub.git
git push -u origin main
```

### Paso 2: Conectar a Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Selecciona tu repositorio de GitHub
4. Configura las siguientes variables de entorno:
   - `DATABASE_URL` (si usas PostgreSQL)
   - `META_ACCESS_TOKEN`
   - `META_VERIFY_TOKEN`
   - `META_PHONE_NUMBER_ID`
   - `OPENAI_API_KEY`
   - `SESSION_SECRET`

### Paso 3: Configuración Build
- **Framework**: Next.js (se detecta automáticamente)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Output Directory**: `dist/public`

### Paso 4: Desplegar
Haz clic en "Deploy" - ¡Listo! Tu app estará en vivo en `https://yourproject.vercel.app`

## 🔐 Seguridad

- ✅ Validación de entrada con Zod
- ✅ Variables de entorno protegidas
- ✅ CORS configurado correctamente
- ✅ Sesiones seguras con cookies
- ✅ Rate limiting en producción

## 🤝 Integración de Plataformas

### Instagram & Facebook
1. Crea app en [Meta Developers](https://developers.facebook.com)
2. Copia los tokens de acceso
3. Configura webhook en Settings
4. URL Webhook: `https://tudominio.com/webhooks/meta`

### WhatsApp Business
1. Accede a [WhatsApp Business Platform](https://business.facebook.com)
2. Obtén Phone Number ID
3. Genera access token
4. Configura como se describe en Settings

## 📚 Documentación Adicional

- [Documentación de Meta API](https://developers.facebook.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 🐛 Troubleshooting

### Error de conexión a base de datos
```bash
# Crear base de datos
createdb socialhub

# Push schema
npm run db:push
```

### Error de variables de entorno en Vercel
- Verifica que todas las variables estén en Settings → Environment Variables
- Redeploy después de agregar variables

### WebHooks no funcionan
- Asegúrate que el dominio sea HTTPS
- Verifica el verify token en configuración
- Revisa logs en Vercel Analytics

## 📞 Soporte

Para issues o preguntas:
- GitHub Issues: [Reportar bug](https://github.com/yourusername/socialhub/issues)
- Documentación: Ver [docs/](./docs)
- Email: support@socialhub.com

## 📄 Licencia

MIT - Libre para usar en proyectos comerciales y personales

## 🎉 Changelog

### v1.0.0 (2024-12-21)
- ✅ Dashboard con métricas
- ✅ Gestión de mensajes
- ✅ Gestión de contactos
- ✅ Integración de plataformas
- ✅ Herramientas IA
- ✅ Soporte multi-cuenta

---

**Hecho con ❤️ por el equipo de SocialHub**
