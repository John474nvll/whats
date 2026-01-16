# SocialHub v3.1 - Plataforma PWA AI-Powered de Gestión CRM & Redes Sociales

## 📋 Descripción General
SocialHub v3.1 es una **plataforma integral renovada** que ahora incluye un potente **CRM con gestión de leads** e integración de **llamadas por IA con Retell**. Sigue siendo una PWA completamente funcional para gestionar redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional.

## 🚀 Cómo Ejecutar
1. **Iniciar la Aplicación:**
   ```bash
   npm run dev
   ```
2. **Acceder a la Aplicación:**
   La aplicación estará disponible en el puerto **5000**.

## ✨ Características Principales (v3.1)

- **AI CRM & Lead Management**: Control de estados de leads (New, Contacting, Qualified, Won, Lost).
- **Retell AI Integration**: Iniciación de llamadas de voz automatizadas con agentes de IA.
- **PWA v3.1**: Manifest actualizado y mejoras en la experiencia de instalación.
- **Autenticación Segura**: Login/registro con JWT.
- **Gestión de Redes Sociales**: Publicación unificada y gestión de bandejas de entrada.
- **Generador de Contenido con IA**: Integración con OpenAI.

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + Shadcn UI |
| **Backend** | Express.js + TypeScript |
| **Base de Datos** | SQLite con Drizzle ORM |
| **AI** | OpenAI + Retell AI |
| **PWA** | Vite PWA Plugin |

## 📂 Estructura del Proyecto
- `client/`: Frontend (React).
- `server/`: Backend (Express, API).
- `shared/`: Esquemas de datos y tipos.
