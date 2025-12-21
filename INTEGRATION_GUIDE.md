# 🔗 Guía de Integración SocialHub - Todas las Plataformas

## ✅ Plataformas Integradas

### 📱 Instagram
- **Librería**: `instagram-private-api` + `@uppy/instagram`
- **Features**: 
  - Conexión con cuentas personales/business
  - Lectura de mensajes directos
  - Envío de respuestas
  - Sincronización de contactos

### 📘 Facebook
- **Librería**: `@uppy/facebook` + Meta Graph API
- **Features**:
  - Conexión con páginas de negocio
  - Gestión de mensajes de página
  - Análisis de comentarios
  - Respuestas automáticas

### 💬 WhatsApp
- **Librería**: `whatsapp-web.js` + `@another-trial/whatsapp-web.js`
- **Features**:
  - Conexión con WhatsApp Business
  - Mensajes de contacto
  - Respuestas automatizadas
  - Distribución en lotes

### 🤖 OpenAI Integration
- **Librería**: `openai@6.15.0`
- **Models**: GPT-4 Turbo, DALL-E 3
- **Features**:
  - Generación de captions
  - Respuestas inteligentes
  - Análisis de sentimiento
  - Generación de imágenes

### ☁️ Vercel Deployment
- **Librerías**: `vercel`, `@vercel/oidc`, `@vercel/otel`
- **Features**:
  - Monitoreo de rendimiento
  - Autenticación segura
  - CI/CD automático

---

## 🚀 Setup de Cada Plataforma

### 1. Instagram Setup

```bash
# Variables de entorno necesarias
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_VERIFY_TOKEN=verify_token
INSTAGRAM_PAGE_ID=your_page_id
```

**Pasos**:
1. Ve a [Meta Developers](https://developers.facebook.com)
2. Crea una app y selecciona "Instagram Graph API"
3. Genera un access token para tu cuenta
4. Copia el token a las variables de entorno

### 2. Facebook Setup

```bash
# Variables de entorno necesarias
FACEBOOK_ACCESS_TOKEN=your_token_here
FACEBOOK_VERIFY_TOKEN=verify_token
FACEBOOK_PAGE_ID=your_page_id
```

**Pasos**:
1. En Meta Developers, selecciona "Messenger"
2. Genera un page access token
3. Configura webhooks para tu página

### 3. WhatsApp Setup

```bash
# Variables de entorno necesarias
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_VERIFY_TOKEN=verify_token
```

**Pasos**:
1. Accede a [WhatsApp Business Platform](https://business.facebook.com/wa)
2. Crea una conexión de WhatsApp Business
3. Obtén tu Phone Number ID
4. Genera un access token

### 4. OpenAI Setup

```bash
# Variables de entorno necesarias
OPENAI_API_KEY=sk_your_key_here
```

**Pasos**:
1. Ve a [OpenAI API](https://platform.openai.com)
2. Crea una API key
3. Asigna límites de uso
4. Copia a variables de entorno

### 5. Vercel Setup

```bash
# El repositorio está listo para Vercel
# Solo necesitas conectarlo en https://vercel.com
```

**Pasos**:
1. Conecta tu GitHub a Vercel
2. Importa el repositorio
3. Agrega todas las variables de entorno
4. Deploy automático en cada push

---

## 📡 Endpoints API Disponibles

### OpenAI Routes
```
POST /api/ai/generate-caption      → Generar caption para plataforma
POST /api/ai/generate-response     → Generar respuesta automática
POST /api/ai/analyze-sentiment     → Analizar sentimiento de mensaje
POST /api/ai/generate-image        → Generar imagen con DALL-E
```

### Platform Routes
```
POST /api/platforms/connect        → Conectar plataforma
GET  /api/platforms                → Listar plataformas conectadas
POST /api/platforms/webhook/meta   → Webhook para Meta (Instagram/Facebook)
```

### Message Routes
```
GET  /api/conversations            → Listar conversaciones
GET  /api/conversations/:id        → Obtener conversación
POST /api/messages                 → Enviar mensaje
PATCH /api/conversations/:id/bot   → Toggle de bot automático
```

---

## 🔐 Seguridad

✅ **Prácticas Implementadas**:
- Variables de entorno protegidas en Vercel
- Validación de tokens en cada request
- CORS configurado correctamente
- Rate limiting en APIs
- Sesiones seguras con cookies httpOnly

⚠️ **Nunca**:
- Commits de API keys o tokens
- Expongas secretos en logs
- Uses tokens en URLs
- Compartas credenciales en código

---

## 🛠️ Troubleshooting

### Error: "Invalid Access Token"
```
→ Verifica que el token no haya expirado
→ Genera uno nuevo desde Meta Developers
→ Asegúrate que tiene los permisos necesarios
```

### Error: "Webhook verification failed"
```
→ Verifica que el VERIFY_TOKEN coincida
→ Asegúrate que la URL es HTTPS
→ Redeploy en Vercel después de cambios
```

### Error: "Rate limit exceeded"
```
→ Espera 1 minuto antes de reintentar
→ Optimiza llamadas a APIs
→ Usa caching para datos frecuentes
```

### OpenAI Error: "Insufficient funds"
```
→ Verifica límites de uso en OpenAI
→ Agrega método de pago
→ Monitorea gastos en dashboard
```

---

## 📊 Monitoreo y Analytics

### Vercel Analytics
```
Dashboard → Analytics
Ver:
- Response times
- Error rates
- Bandwidth usage
- Deployment history
```

### OpenAI Usage
```
Platform.openai.com → Usage
Ver:
- Tokens usados
- Costo acumulado
- Modelos utilizados
- Rate limits
```

---

## 🔄 Flujo de Datos

```
User → SocialHub Dashboard
    ↓
    ├→ OpenAI (para generar contenido)
    ├→ Instagram API (para mensajes)
    ├→ Facebook Graph API (para página)
    ├→ WhatsApp Business API (para chats)
    └→ Database (para almacenamiento)
    
Backend → Webhooks de Meta
    ↓
    ├→ Procesa mensajes
    ├→ Genera respuestas con IA
    ├→ Sincroniza contactos
    └→ Actualiza dashboard en tiempo real
```

---

## 📚 Recursos Útiles

- [Meta Developers Docs](https://developers.facebook.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [WhatsApp Business Docs](https://developers.facebook.com/docs/whatsapp)
- [Vercel Docs](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com)

---

## ✉️ Soporte

Para issues o preguntas sobre integraciones:
- Documentación: [Dentro del proyecto]
- GitHub Issues: [Tu repositorio]
- Email: [Tu email]

---

**Última actualización**: 2024-12-21
**Versión**: 1.0.0
**Status**: ✅ Production Ready
