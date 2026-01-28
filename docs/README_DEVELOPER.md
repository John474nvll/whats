# SoftganHub - Guía del Desarrollador

## Documentación Técnica v11.0

Esta guía está diseñada para desarrolladores que trabajan con SoftganHub. Cubre la arquitectura, APIs, base de datos y personalización del sistema.

---

## Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y dev server
- **Tailwind CSS** - Estilos utilitarios
- **Shadcn UI** - Componentes de UI
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos
- **TanStack Query** - Estado del servidor
- **Wouter** - Enrutamiento

### Backend
- **Express.js** - Framework HTTP
- **TypeScript** - Tipado estático
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod** - Validación de esquemas

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Drizzle ORM** - Migraciones y queries

### IA y Servicios
- **OpenAI GPT-4o** - Generación de contenido y análisis
- **Twilio** - Voz y SMS
- **Retell AI** - Agentes de voz IA
- **Meta APIs** - WhatsApp, Instagram, Facebook

---

## Estructura del Proyecto

```
/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilidades
│   │   └── App.tsx         # Componente raíz
│   └── index.html
│
├── server/                 # Backend Express
│   ├── routes.ts           # Rutas principales
│   ├── routes/             # Rutas modulares
│   │   ├── ai.ts           # Rutas de IA
│   │   ├── twilio.ts       # Rutas de Twilio
│   │   ├── whatsapp.ts     # Rutas de WhatsApp
│   │   └── retell.ts       # Rutas de Retell
│   ├── services/           # Servicios
│   ├── storage.ts          # Capa de datos
│   └── db.ts               # Conexión a BD
│
├── shared/                 # Código compartido
│   ├── schema.ts           # Esquema de BD (Drizzle)
│   └── routes.ts           # Definición de rutas API
│
├── docs/                   # Documentación
│   ├── README_USUARIO.md
│   ├── README_ADMIN.md
│   └── README_DEVELOPER.md
│
└── package.json
```

---

## Base de Datos

### Esquema Principal

```typescript
// users - Usuarios del sistema
users = {
  id: serial,
  username: text,
  password: text,
  role: text,        // 'admin' | 'vendedor' | 'agente' | 'developer'
  createdAt: timestamp
}

// customers - Clientes
customers = {
  id: serial,
  name: text,
  email: text,
  phone: text,
  farmName: text,
  status: text,      // 'active' | 'inactive'
  leadStatus: text,  // 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  estimatedValue: integer,
  createdAt: timestamp
}

// conversations - Conversaciones
conversations = {
  id: serial,
  contactId: integer,
  status: text,      // 'active' | 'closed'
  channel: text,     // 'whatsapp' | 'instagram' | 'facebook'
  lastMessageAt: timestamp
}

// messages - Mensajes
messages = {
  id: serial,
  conversationId: integer,
  content: text,
  role: text,        // 'user' | 'agent' | 'system'
  sentiment: text,   // 'positive' | 'neutral' | 'negative'
  timestamp: timestamp
}

// purchaseOrders - Órdenes de compra
purchaseOrders = {
  id: serial,
  customerId: integer,
  orderNumber: text,
  totalAmount: integer,
  status: text,      // 'pendiente' | 'aprobada' | 'en_proceso' | 'completada' | 'cancelada'
  items: jsonb,
  createdAt: timestamp
}

// funnels - Embudos de ventas
funnels = {
  id: serial,
  name: text,
  description: text,
  type: text,        // 'sales' | 'leads' | 'webinar' | 'product'
  stages: jsonb,
  isActive: boolean,
  createdAt: timestamp
}

// voiceConfigs - Configuración de voz
voiceConfigs = {
  id: serial,
  provider: text,    // 'twilio' | 'retell'
  accountSid: text,
  authToken: text,
  apiKey: text,
  isConnected: boolean
}

// voiceAgents - Agentes de IA
voiceAgents = {
  id: serial,
  name: text,
  provider: text,
  voiceId: text,
  instructions: text,
  isActive: boolean
}
```

### Comandos de Base de Datos

```bash
# Sincronizar esquema con la base de datos
npm run db:push

# Forzar sincronización (cuidado en producción)
npm run db:push --force
```

---

## API REST

### Autenticación

Todas las rutas requieren autenticación mediante token Bearer:

```
Authorization: Bearer <token>
```

### Endpoints Principales

#### Clientes

```
GET    /api/customers          # Listar clientes
POST   /api/customers          # Crear cliente
GET    /api/customers/:id      # Obtener cliente
PATCH  /api/customers/:id      # Actualizar cliente
DELETE /api/customers/:id      # Eliminar cliente
```

#### Órdenes de Compra

```
GET    /api/purchase-orders    # Listar órdenes
POST   /api/purchase-orders    # Crear orden
GET    /api/purchase-orders/:id
PATCH  /api/purchase-orders/:id
DELETE /api/purchase-orders/:id
```

#### Funnels

```
GET    /api/funnels            # Listar funnels
POST   /api/funnels            # Crear funnel
GET    /api/funnels/:id
PATCH  /api/funnels/:id
DELETE /api/funnels/:id
POST   /api/funnels/:id/duplicate  # Duplicar funnel
```

#### WhatsApp

```
POST   /api/whatsapp/send/text     # Enviar mensaje de texto
POST   /api/whatsapp/send/bulk     # Envío masivo
POST   /api/whatsapp/send/template # Enviar plantilla
POST   /api/whatsapp/send/media    # Enviar multimedia
GET    /api/whatsapp/webhook       # Verificación de webhook
POST   /api/whatsapp/webhook       # Recibir mensajes
```

#### Voz y Twilio

```
GET    /api/twilio/status          # Estado de conexión
POST   /api/twilio/configure       # Configurar Twilio
GET    /api/twilio/numbers         # Listar números
POST   /api/twilio/sync-numbers    # Sincronizar números
```

#### Retell AI

```
GET    /api/retell/status          # Estado de conexión
POST   /api/retell/configure       # Configurar Retell
GET    /api/retell/agents          # Listar agentes IA
POST   /api/retell/agents          # Crear agente
```

#### IA

```
POST   /api/ai/generate            # Generar contenido
POST   /api/ai/image               # Generar imagen
POST   /api/ai/analyze-sentiment   # Analizar sentimiento
```

---

## Variables de Entorno

### Requeridas

```env
# Base de Datos
DATABASE_URL=postgresql://...

# Sesión
SESSION_SECRET=secreto_seguro_aqui

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=token_meta
WHATSAPP_PHONE_NUMBER_ID=phone_id
WHATSAPP_BUSINESS_ID=business_id
WHATSAPP_VERIFY_TOKEN=verify_token

# Twilio (opcional)
TWILIO_ACCOUNT_SID=ACxxxxxxx
TWILIO_AUTH_TOKEN=token
TWILIO_PHONE_NUMBER=+57xxx

# IA (configurado automáticamente por Replit)
AI_INTEGRATIONS_OPENAI_API_KEY=sk-xxx
AI_INTEGRATIONS_OPENAI_BASE_URL=https://...
```

---

## Desarrollo Local

### Instalación

```bash
# Clonar repositorio
git clone <repo>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Sincronizar base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo (puerto 5000)
npm run build      # Build de producción
npm run db:push    # Sincronizar esquema de BD
npm run lint       # Verificar código
```

---

## Personalización

### Agregar Nueva Página

1. Crear componente en `client/src/pages/`
2. Agregar ruta en `client/src/App.tsx`
3. Agregar enlace en la navegación

```tsx
// client/src/pages/NuevaPagina.tsx
export default function NuevaPagina() {
  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold text-white">Nueva Página</h1>
    </div>
  );
}

// client/src/App.tsx
<Route path="/nueva-pagina" component={NuevaPagina} />
```

### Agregar Nueva API

1. Definir ruta en `server/routes.ts` o crear módulo en `server/routes/`
2. Agregar lógica de storage en `server/storage.ts`
3. Si es necesario, actualizar esquema en `shared/schema.ts`

```typescript
// server/routes.ts
app.get("/api/mi-recurso", async (req, res) => {
  const datos = await storage.getMiRecurso();
  res.json(datos);
});

// server/storage.ts
async getMiRecurso() {
  return await db.select().from(miRecurso);
}
```

### Agregar Nueva Tabla

1. Definir tabla en `shared/schema.ts`
2. Ejecutar `npm run db:push`
3. Agregar métodos en `storage.ts`

```typescript
// shared/schema.ts
export const miTabla = pgTable("mi_tabla", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MiTabla = typeof miTabla.$inferSelect;
export type InsertMiTabla = typeof miTabla.$inferInsert;
```

---

## Integraciones

### WhatsApp Cloud API

```typescript
// Enviar mensaje
const response = await fetch(
  `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: message },
    }),
  }
);
```

### OpenAI GPT-4o

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "Eres un asistente de ventas." },
    { role: "user", content: "Ayúdame a responder este mensaje" },
  ],
});
```

---

## Despliegue

### Replit Deployment

1. Configura el deploy en Replit
2. Asegura las variables de entorno
3. El sistema detecta automáticamente el puerto 5000

### Variables de Producción

Asegúrate de configurar en producción:
- `DATABASE_URL` (base de datos de producción)
- Todos los tokens y secretos de APIs
- `SESSION_SECRET` único

---

## Mejores Prácticas

### Código
1. Usa TypeScript en todo el proyecto
2. Valida inputs con Zod
3. Maneja errores apropiadamente
4. Documenta funciones complejas

### Seguridad
1. Nunca expongas secretos en logs
2. Valida todos los inputs del usuario
3. Usa HTTPS en producción
4. Rota tokens regularmente

### Rendimiento
1. Usa índices en consultas frecuentes
2. Implementa paginación
3. Cachea respuestas cuando sea posible
4. Optimiza imágenes y assets

---

## Soporte

**Documentación**: docs.softgan.com
**Email**: dev@softgan.com

---

*SoftganHub v11.0 | softgan.com | Tecnología que impulsa tu crecimiento*
