# SocialHub v9.0 - CRM & Redes Sociales

## Overview
SocialHub is a comprehensive CRM and social media management platform designed to streamline sales, marketing, and customer engagement. It features a visually driven sales pipeline, robust lead management, and multi-channel campaign capabilities powered by AI. The platform aims to provide a modern, high-performance experience with PWA support, enabling users to manage their social presence and customer interactions efficiently across various platforms. The project's vision is to become the most complete and modern platform for social media management from any device, enhancing user productivity and market reach.

## User Preferences
I prefer iterative development with a focus on delivering functional components incrementally. I like clear, concise explanations and prefer to be asked before major architectural changes or significant modifications to existing features. Ensure code is well-documented and follows modern best practices.

## Recent Changes (January 24, 2026)

### Navigation Improvements
- Enhanced sidebar with organized menu groups: Principal, CRM & Ventas, Proyectos, Marketing, IA & Automatizacion, Soporte & Sistema
- Added quick access buttons in header (DASH, PLAT, AI)
- Connected accounts display with disconnect functionality

### AI Generator v3.2
- Rebuilt with full functionality using Replit AI Integrations (GPT-4o)
- Content types: Post, Caption, Message, Story, Ad, Image
- Platform selection: Multi-platform, Instagram, Facebook, WhatsApp
- Generation history tracking
- Template library for quick starts
- Hashtag suggestion feature
- Image generation with DALL-E

### New/Improved Pages
- **Projects**: Full project management with progress tracking, filters, grid/list views, and creation dialog
- **Tasks**: Kanban-style task board with status columns (Pending, In Progress, Completed), checkboxes, and priority labels
- **Sales Groups**: Team management with performance metrics, monthly targets, and progress visualization
- **Platforms Hub**: Unified platform management for WhatsApp, Instagram, Facebook with connection interface

### API Improvements
- `/api/ai/generate-smart-content` - Multi-type content generation
- `/api/ai/generate-campaign` - Campaign content generation
- `/api/ai/suggest-hashtags` - Hashtag suggestions
- `/api/ai/generate-image` - Image generation with gpt-image-1

## System Architecture

### UI/UX Decisions
The user interface features a Glassmorphism design with a vibrant neon color palette, including Kiwi Green (primary), Cyan Neon (secondary), Intense Raspberry (accent), and Neon Pineapple (complementary). It uses an ultra-rounded border radius (3rem), neon effects, animated gradients, and backgrounds. The design is fully responsive for both mobile and desktop, leveraging Shadcn UI components for a modern look and feel.

### Technical Implementations
The application is built with a full-stack architecture:
-   **Frontend:** React 18 with Vite, Tailwind CSS, Shadcn UI, React Hook Form for forms, Zod for validation, TanStack React Query v5 for state management, Wouter for routing, and Framer Motion for animations.
-   **Backend:** Express.js with TypeScript.
-   **Database:** PostgreSQL with Drizzle ORM, optimized with WAL mode for performance.
-   **Authentication:** JWT and bcrypt for secure password hashing and token-based authentication.
-   **PWA:** Implemented with a Service Worker using `networkFirst` for API requests and `staleWhileRevalidate` for assets, including push notifications, a smart PWA installation banner, offline mode detection, and automatic app updates via a manifest.json.
-   **AI:** Replit AI Integrations with GPT-4o for content generation and gpt-image-1 for image generation.

### Feature Specifications
-   **CRM & Lead Management:** Visual sales pipeline, lead status tracking (New, Contacting, Qualified, Won, Lost), customer database with CRUD operations, tags, metadata, and status management.
-   **AI Integration:** Content generation (text and images) via Replit AI Integrations (GPT-4o), interactive AI chat, automatic suggestions, and hashtag generation.
-   **Multi-channel Campaigns:** AI-powered campaign creation, multi-platform support, scheduling, metrics tracking, and content preview.
-   **Social Media Integration:** Secure account linking, management of multiple social accounts, and direct dashboard connection.
-   **Unified Inbox:** Centralized messaging across platforms.
-   **Analytics:** Real-time metrics and data analysis.
-   **Project Management:** Projects, Tasks, and Sales Groups with full CRUD operations.
-   **Module Management:** Comprehensive pages for Login, Dashboard, Customers, Contacts, Campaigns, Inbox, Analytics, AI Generator, Platforms Hub, Settings, Funnel Builder, Projects, Tasks, Sales Groups, Billing, and Voice Manager.
-   **User Management:** Login/registration with JWT, bearer token authentication, bcrypt password hashing, and role-based access (admin/manager).

### System Design Choices
-   **Monorepo Structure:** Divided into `client/`, `server/`, and `shared/` directories for clear separation of concerns.
-   **API Endpoints:** A comprehensive set of RESTful API endpoints for authentication, customer management, campaigns, social accounts, publishing, messaging, contacts, AI services, projects, tasks, and sales groups.
-   **Database Schema:** Detailed schemas for `Users`, `Customers`, `Campaigns`, `Social_Accounts`, `Contacts`, `Conversations`, `Messages`, `Widgets`, `SalesFunnels`, `ChannelConfigs`, `ArtistProfiles`, and `MusicContent`.
-   **PWA First:** Prioritization of PWA features for enhanced offline capabilities, installability, and performance.

## Replit Environment Setup (January 26, 2026)
- **Node.js:** nodejs-20 module installed
- **Database:** PostgreSQL database configured via Replit (DATABASE_URL environment variable)
- **Session:** SESSION_SECRET configured via Replit Secrets
- **Development:** `npm run dev` - runs tsx server/index.ts with Vite middleware
- **Production:** `npm run build` then `npm run start`
- **Port:** Application serves on port 5000 (both frontend and API)
- **Deployment:** Configured for autoscale deployment

## External Dependencies
-   **Replit AI Integrations:** (GPT-4o for chat, gpt-image-1 for images)
-   **Retell AI:** (Mock integration)
-   **Twilio:** (Via Replit Secrets)
-   **PostgreSQL:** (Database)
-   **JWT:** (Authentication)
-   **Bcrypt:** (Password hashing)
-   **Vite:** (Frontend build tool)
-   **Tailwind CSS:** (Styling framework)
-   **Shadcn UI:** (UI component library)
-   **React Hook Form:** (Form management)
-   **Zod:** (Schema validation)
-   **TanStack React Query v5:** (Server state management)
-   **Wouter:** (Client-side routing)
-   **Framer Motion:** (Animations)

## Routes
- `/` - Dashboard
- `/ai-generator` - AI Content Generator
- `/platforms` - Platforms Hub (social media connections)
- `/campaigns` - Marketing Studio
- `/projects` - Project Management
- `/tasks` - Task Board
- `/sales-groups` - Sales Team Management
- `/inbox` - Unified Inbox
- `/contacts` - Contact Management
- `/customers` - Customer Database
- `/analytics` - Analytics Dashboard
- `/funnels` - Funnel Builder
- `/settings` - Application Settings
- `/billing` - Billing & Invoicing
- `/voice` - Voice & Retell Manager
