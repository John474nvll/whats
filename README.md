# SocialHub v3.0 - Plataforma PWA Completa de Gestión de Redes Sociales

## 📋 Descripción General
SocialHub v3.0 es una **plataforma integral, renovada y completamente funcional como PWA** para gestionar múltiples redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional con autenticación JWT, vinculación de cuentas, publicación de contenido, gestión avanzada de clientes, campañas multicanal, y generación de contenido con IA. Totalmente instalable como aplicación nativa en móviles y con soporte offline.

## 🚀 Cómo Ejecutar (Entorno de Desarrollo Actual)

Debido a la configuración de este entorno, el método estándar `npm run dev` no funcionará. Siga estos pasos para iniciar la aplicación correctamente:

1.  **Iniciar los Emuladores de Firebase:**
    Este comando iniciará el servidor de hosting y el backend simulado.
    ```bash
    firebase emulators:start
    ```

2.  **Acceder a la Aplicación:**
    Una vez que los emuladores estén en ejecución, la aplicación estará disponible en el puerto **5000**. Utilice la URL proporcionada por el entorno para ese puerto.

## 🔐 Credenciales de Acceso Rápido

El sistema está configurado con las siguientes cuentas para acceso y demostración inmediata desde la pantalla de login:

- **Administrador:**
  - **Usuario:** `socialadmin`
  - **Contraseña:** `SocialAdmin2026!`

- **Ventas:**
  - **Usuario:** `ventas_a` / `VentasA2026!`
  - **Usuario:** `ventas_b` / `VentasB2026!`

- **Soporte:**
  - **Usuario:** `soporte_a` / `SoporteA2026!`

- **Marketing:**
  - **Usuario:** `marketing_a` / `MarketingA2026!`

- **Análisis:**
  - **Usuario:** `analista_a` / `AnalistaA2026!`

## ✨ Características Principales

- **PWA Completa:** Instalable en móviles, soporte offline, notificaciones push.
- **Autenticación Segura:** Login/registro con JWT y hash de contraseñas (bcrypt).
- **Diseño Renovado v3.0:** Interfaz moderna con colores neon, glassmorphism y animaciones.
- **Gestión de Clientes (CRM):** Base de datos completa de clientes con búsqueda y filtrado.
- **Campañas Multicanal:** Creación, programación y seguimiento de campañas con ayuda de IA.
- **Generador de Contenido con IA:** Integración con OpenAI para generar texto e imágenes.
- **Integración Total de Redes Sociales:** Vinculación y gestión de múltiples cuentas.
- **12+ Módulos Funcionales:** Dashboard, CRM, Campañas, Inbox, Analíticas, IA, y más.

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + Shadcn UI |
| **Backend** | Express.js + TypeScript |
| **Base de Datos (Configuración Original)** | PostgreSQL con Drizzle ORM |
| **Base de Datos (Entorno Actual)** | Emulador de Firebase Firestore |
| **Autenticación** | JWT + bcrypt |
| **Estado y Caché** | TanStack React Query v5 |
| **Routing** | Wouter |
| **Animaciones** | Framer Motion |

## 📂 Estructura del Proyecto

El proyecto está organizado en tres directorios principales:

- `client/`: Contiene todo el código fuente del frontend (React, Vite, páginas, componentes).
- `server/`: Contiene el código fuente del backend (Express, rutas de la API, lógica de negocio).
- `shared/`: Contiene esquemas de datos y tipos compartidos entre el frontend y el backend.

```
SocialHub/
├── client/         # Código del Frontend
├── server/         # Código del Backend
├── shared/         # Código Compartido (Tipos, Esquemas)
├── firebase.json   # Configuración de Firebase
├── drizzle.config.ts # Configuración de la BD (PostgreSQL)
└── package.json
```
