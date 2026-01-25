# SocialHub PWA - Unified Communications & AI CRM

**SocialHub PWA** is a next-generation, mobile-first Progressive Web App designed to centralize all your customer communications. It integrates with major social platforms like WhatsApp, Instagram, and Facebook, offering a unified inbox and a powerful AI-powered CRM to manage your business interactions seamlessly.

This project is built with a modern tech stack, featuring a React/Vite frontend and a Node.js/Express backend, and is ready for deployment on Vercel.

---

## ✨ Key Features

- **Unified Inbox**: Manage conversations from WhatsApp, Instagram, and Facebook Messenger in a single, intuitive interface.
- **AI Content Generation**: Create engaging social media posts, replies, and campaigns using the integrated GPT-4o-mini model.
- **AI Image Generation**: Generate stunning visuals for your content with DALL-E 3 integration.
- **Platform Hub**: Easily connect and manage your business accounts for Meta (Facebook, Instagram) and WhatsApp via Twilio.
- **CRM Functionality**: A built-in CRM to manage customer data, track interactions, and organize sales pipelines.
- **PWA & Mobile-First**: Installable as a PWA on any device, offering a native-like experience with offline capabilities.
- **Extensible & Scalable**: The architecture is designed for easy integration with additional platforms and services (like external CRMs).
- **Real-time Analytics**: (Future) Dashboards to monitor engagement, response times, and campaign performance.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm / pnpm / yarn
- A Vercel account
- A PostgreSQL database (e.g., from Vercel Postgres, Supabase, or Railway)
- API keys for:
  - OpenAI
  - Meta for Developers (for Instagram/Facebook)
  - Twilio (for WhatsApp)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd socialhub-pwa
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory. For production, these will be set in your hosting provider's dashboard (e.g., Vercel).
    ```
    # .env
    DATABASE_URL="postgresql://user:password@host:port/database" # From your Postgres provider
    META_VERIFY_TOKEN="your_meta_webhook_verification_token"
    OPENAI_API_KEY="your_openai_api_key"
    TWILIO_ACCOUNT_SID="your_twilio_account_sid"
    TWILIO_AUTH_TOKEN="your_twilio_auth_token"
    GPT4FREE_BASE_URL="http://localhost:8080/v1" # Replace with your gpt4free instance URL
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

---

## 🚀 Deploying to Vercel

This project is optimized for deployment on Vercel.

### 1. Database Setup

For production, you need a live PostgreSQL database. The in-memory storage and Drizzle-Kit used for local development are not suitable for a production environment.

-   **Create a Postgres Database**: You can use services like **Vercel Postgres**, **Supabase**, or **Railway** to create a free or paid PostgreSQL database.
-   **Get the Connection URL**: Once created, you will get a `DATABASE_URL`. This is a critical secret that you will use in the Vercel environment variables.

### 2. Configure Vercel Project

1.  **Import Project**: In your Vercel dashboard, click "Add New... > Project" and import your Git repository.
2.  **Framework Preset**: Vercel should automatically detect `Vite` as the framework.
3.  **Build and Output Settings**:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
    -   **Install Command**: `npm install`
4.  **Environment Variables**: This is the most important step. Go to your project's "Settings" > "Environment Variables" and add the following:
    -   `DATABASE_URL`: The connection string for your live PostgreSQL database.
    -   `META_VERIFY_TOKEN`: Your verification token for the Meta webhook.
    -   `OPENAI_API_KEY`: Your API key for OpenAI.
    -   `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
    -   `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
    -   `GPT4FREE_BASE_URL`: The URL of your deployed `gpt4free` instance.

### 3. Deploy!

Once configured, trigger a new deployment. Vercel will use the `vercel.json` file to correctly build the frontend, deploy the Express API as a serverless function, and set up the rewrites.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: Drizzle ORM, PostgreSQL
- **Real-time**: TanStack Query for data synchronization
- **AI**: OpenAI (GPT-4o-mini, DALL-E 3), gpt4free
- **Integrations**: Twilio API, Meta Graph API
- **Deployment**: Vercel

---

## 📋 Project Structure

```
/client/        # Frontend PWA (React + Vite)
/server/        # Backend API (Node.js + Express)
  /routes/      # API route definitions
  /services/    # Business logic for external services (AI, Twilio, etc.)
/shared/        # Code shared between client and server (types, schemas)
/public/        # Static assets and PWA manifest
drizzle.config.ts # Database ORM configuration
vercel.json       # Vercel deployment configuration
```

---

## 🔮 Future Roadmap

- **Full CRM Integration**: Connect to a production-ready CRM like SuiteCRM or HubSpot.
- **Real-time WebSocket**: Implement a WebSocket layer for instant message updates.
- **Advanced Analytics**: Build out the analytics dashboard with detailed metrics.
- **Team Collaboration**: Introduce multi-agent support and conversation assignments.
- **Automated Workflows**: Create rules and triggers for automated messaging and lead nurturing.
