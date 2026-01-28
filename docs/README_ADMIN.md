# SoftganHub - Guía del Administrador

## Panel de Administración v11.0

Esta guía está diseñada para administradores del sistema SoftganHub. Cubre la configuración, gestión de usuarios, integraciones y mantenimiento del sistema.

---

## Roles del Sistema

### Tipos de Usuario

| Rol           | Permisos | Descripción                                       |
| ------------- | -------- | ------------------------------------------------- |
| **Admin**     | Completo | Acceso total al sistema, configuración y usuarios |
| **Vendedor**  | Medio    | Gestión de clientes, órdenes y comunicaciones     |
| **Agente**    | Limitado | Solo inbox y atención al cliente                  |
| **Developer** | Técnico  | Acceso a APIs y configuración técnica             |

---

## Configuración de Plataformas

### WhatsApp Business API

**Requisitos:**

- Cuenta de Meta Business verificada
- WhatsApp Business API aprobada
- Token de acceso permanente

**Configuración:**

1. Ve a **Configuración > Plataformas > WhatsApp**
2. Ingresa el Phone Number ID
3. Ingresa el WhatsApp Business ID
4. Pega el Access Token
5. Configura el Webhook URL
6. Verifica la conexión

**Variables de entorno requeridas:**

```
WHATSAPP_ACCESS_TOKEN=tu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
WHATSAPP_BUSINESS_ID=tu_business_id
WHATSAPP_VERIFY_TOKEN=token_verificacion
```

### Instagram Business

**Requisitos:**

- Cuenta de Instagram Business o Creator
- Página de Facebook vinculada
- Permisos de API de Instagram

**Configuración:**

1. Ve a **Plataformas > Instagram**
2. Haz clic en "Conectar con Facebook"
3. Autoriza los permisos solicitados
4. Selecciona la cuenta de Instagram a vincular

### Facebook Messenger

**Configuración:**

1. Ve a **Plataformas > Facebook**
2. Conecta tu página de Facebook
3. Activa la integración de Messenger
4. Configura respuestas automáticas si lo deseas

---

## Gestión de Usuarios

### Crear Nuevo Usuario

1. Ve a **Configuración > Usuarios**
2. Haz clic en "Nuevo Usuario"
3. Completa los datos:
   - Nombre de usuario
   - Correo electrónico
   - Rol asignado
   - Contraseña temporal
4. Envía las credenciales al usuario

### Modificar Permisos

1. Busca el usuario en la lista
2. Haz clic en "Editar"
3. Cambia el rol o permisos específicos
4. Guarda los cambios

### Desactivar Usuario

1. Localiza el usuario
2. Cambia el estado a "Inactivo"
3. El usuario no podrá acceder pero se conserva su historial

---

## Configuración de Voz y Twilio

### Integración Twilio

**Requisitos:**

- Cuenta de Twilio activa
- Número de teléfono comprado
- SID y Auth Token

**Configuración:**

1. Ve a **Voz & Retell > Configurar APIs**
2. Ingresa:
   - Account SID
   - Auth Token
   - Número de teléfono
3. Prueba la conexión

### Agentes IA con Retell

1. Ve a **Voz & Retell > Agentes IA**
2. Haz clic en "Nuevo Agente"
3. Configura:
   - Nombre del agente
   - Voz preferida
   - Instrucciones de comportamiento
   - Respuestas predefinidas
4. Activa el agente

---

## Funnels de Ventas

### Crear Funnel

1. Ve a **Funnels > Nuevo Funnel**
2. Selecciona el tipo:
   - Ventas
   - Leads
   - Webinar
   - Producto
3. Define las etapas
4. Configura acciones automáticas
5. Activa el funnel

### Etapas Predefinidas

| Etapa       | Descripción      |
| ----------- | ---------------- |
| Visitante   | Primer contacto  |
| Lead        | Mostró interés   |
| Cualificado | Cumple criterios |
| Oportunidad | En negociación   |
| Cliente     | Venta cerrada    |

---

## Órdenes de Compra

### Flujo de Estados

```
Pendiente → Aprobada → En Proceso → Completada
     ↓
  Cancelada
```

### Configuración de Notificaciones

1. Ve a **Configuración > Notificaciones**
2. Activa alertas para:
   - Nueva orden recibida
   - Orden en proceso
   - Orden completada
   - Pagos recibidos

---

## Bot de Ventas IA

### Configuración del Bot

1. Ve a **Voz & Retell > Agentes IA**
2. Selecciona el canal (WhatsApp, Web, etc.)
3. Define:
   - Mensaje de bienvenida
   - Preguntas de cualificación
   - Respuestas a FAQs
   - Criterios de transferencia a humano

### Entrenamiento del Bot

1. Revisa las conversaciones del bot
2. Identifica respuestas incorrectas
3. Agrega nuevas respuestas sugeridas
4. El bot aprende de las correcciones

---

## Reportes y Analíticas

### Reportes Disponibles

- **Ventas**: Ingresos por período, vendedor, producto
- **Conversaciones**: Volumen, tiempos de respuesta, satisfacción
- **Funnels**: Tasas de conversión por etapa
- **Bot IA**: Respuestas automáticas, transferencias

### Exportar Datos

1. Ve al reporte deseado
2. Selecciona el rango de fechas
3. Haz clic en "Exportar"
4. Elige formato (CSV, Excel, PDF)

---

## Seguridad

### Mejores Prácticas

1. **Contraseñas**: Exige contraseñas fuertes
2. **Tokens**: Rota los tokens de API regularmente
3. **Acceso**: Revisa usuarios inactivos mensualmente
4. **Logs**: Monitorea actividad sospechosa
5. **Backup**: Los datos se respaldan automáticamente

### Auditoría

- Todas las acciones quedan registradas
- Revisa el log en **Configuración > Auditoría**
- Filtra por usuario, acción o fecha

---

## Mantenimiento

### Tareas Semanales

- [ ] Revisar usuarios activos
- [ ] Verificar conexiones de plataformas
- [ ] Analizar rendimiento del bot
- [ ] Limpiar datos obsoletos

### Tareas Mensuales

- [ ] Revisar métricas de uso
- [ ] Actualizar plantillas de mensajes
- [ ] Capacitar nuevos usuarios
- [ ] Revisar feedback del equipo

---

## Solución de Problemas

### WhatsApp no envía mensajes

1. Verifica el token de acceso
2. Revisa los límites de la API
3. Confirma que el número esté verificado

### Bot no responde

1. Verifica que el agente esté activo
2. Revisa la configuración del canal
3. Comprueba la conexión con la API de IA

### Órdenes no se actualizan

1. Revisa la conexión a la base de datos
2. Verifica permisos del usuario
3. Limpia la caché del navegador

---

## Contacto de Soporte

**Soporte Técnico SoftganHub**

- Email: soporte@softgan.com
- Documentación: docs.softgan.com

---

_SoftganHub v11.0 | softgan.com | Tecnología que impulsa tu crecimiento_
