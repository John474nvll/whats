# SocialHub - Replit Configuration

## Project Overview
SocialHub es una plataforma integral para gestionar redes sociales (Instagram, Facebook, WhatsApp) desde un único dashboard profesional.

## Technology Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL/Memory Storage
- **Styling**: Tailwind CSS + Framer Motion
- **Forms**: React Hook Form + Zod

## Project Structure
```
├── client/              # Frontend React
│   └── src/
│       ├── pages/       # Dashboard, Inbox, Contacts, Settings
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and helpers
├── server/              # Backend Express
├── shared/              # Shared types and schemas
└── dist/                # Production build output
```

## Running the Project

### Development
```bash
npm run dev
# Runs on http://localhost:5000
```

### Production Build
```bash
npm run build
npm start
```

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection (optional)
- `META_ACCESS_TOKEN`: Meta API token
- `META_VERIFY_TOKEN`: Webhook verify token
- `OPENAI_API_KEY`: OpenAI API key
- `SESSION_SECRET`: Session encryption secret

### Color Palette
- **Primary**: Bright Blue (#5EB3F6) - CTAs and highlights
- **Background**: Dark Navy (#1C2840) - Main background
- **Card**: Darker Navy (#1F2D4D) - Card backgrounds
- **Text**: Light Gray (#F9FAFB) - Primary text
- **Accent**: Cyan (#5EB3F6) - Secondary highlights

### Typography
- **Display Font**: Outfit (headings)
- **Body Font**: Inter (paragraphs and UI text)

## Key Features Implemented

✅ **Dashboard**
- Real-time metrics (Messages, Campaigns, Followers, Engagement)
- Interactive activity chart
- Recent messages and campaigns

✅ **Inbox/Messages**
- Unified messaging across platforms
- AI-powered responses
- Real-time chat interface

✅ **Contacts**
- Contact management
- Platform filtering
- Bulk import/export

✅ **Settings**
- Channel configuration
- API token management
- Webhook setup

✅ **AI Features**
- Content generation widget
- Smart responses
- Image generation
- Sentiment analysis

✅ **Admin Panel**
- Multi-account management
- User roles and permissions
- Account connectivity status

## Deployment

### Vercel Setup
1. Connect GitHub repository
2. Set environment variables in Vercel Settings
3. Configure build: `npm run build`
4. Set start command: `npm start`
5. Deploy!

### Database
- Development: Uses in-memory storage by default
- Production: Configure PostgreSQL via `DATABASE_URL`

## Development Guidelines

### Code Structure
- Keep pages in `client/src/pages/`
- Place components in `client/src/components/`
- Use hooks from `client/src/hooks/`
- Shared types in `shared/schema.ts`

### Styling
- Use Tailwind CSS first
- Shadcn components for UI
- Custom CSS in `client/src/index.css`
- No inline styles unless necessary

### Component Naming
- Files: PascalCase (e.g., `Dashboard.tsx`)
- Hooks: camelCase (e.g., `useConversations`)
- CSS Classes: kebab-case (Tailwind)

### Testing
```bash
npm run check  # Type checking
```

## Workflow Configuration
- **Name**: Start application
- **Command**: npm run dev
- **Port**: 5000
- **Type**: Full-stack web app

## Future Enhancements
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Custom automation rules
- [ ] Team collaboration features
- [ ] Third-party integrations
- [ ] Mobile app
- [ ] Video messaging
- [ ] File sharing

## Resources
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [Express.js](https://expressjs.com)
- [Vercel Docs](https://vercel.com/docs)

## Last Updated
2024-12-21
