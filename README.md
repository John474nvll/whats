# SocialHub V2 - Premium Social Media Management

Platform for unified management of Instagram, Facebook, and WhatsApp.

## Acceso del Sistema
Para el acceso al sistema se han configurado las siguientes credenciales predeterminadas:

### Administrador
- **Usuario:** `socialadmin`
- **Contraseña:** `SocialAdmin2026!`

### Vendedores
- **Vendedor A:** `ventas_a` / `VentasA2026!`
- **Vendedor B:** `ventas_b` / `VentasB2026!`

## Features
- Unified Dashboard with widgets
- AI Powered responses (OpenAI)
- Multi-platform publishing
- Real-time activity monitoring
- PWA support for mobile installation

## Tech Stack
- React + Vite
- Express + TypeScript
- PostgreSQL + Drizzle ORM
- Tailwind CSS (Premium V2 Theme)

## Deployment to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel`
3. Add environment variables in Vercel Dashboard:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY` (optional)
