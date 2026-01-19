# Life OS 🚀

Your Personal AI-Powered Command Center — a Progressive Web App that manages tasks, finances, travel, email, and more with Claude AI at its core.

![Life OS Dashboard](./docs/dashboard-preview.png)

## Features

- **🧠 AI Assistant** — Claude-powered chat for task management, email triage, and life planning
- **✅ Task Management** — Priority-based tasks with categories, due dates, and progress tracking
- **💰 Financial Dashboard** — Budget tracking, bill reminders, savings goals, and account overview
- **✈️ Travel Planner** — Flight tracking, trip planning, and itinerary management
- **📧 Email Hub** — Unified inbox (Gmail + Outlook) with AI-powered triage and daily summaries
- **📅 Calendar Integration** — Google Calendar + Outlook Calendar sync
- **📁 Cloud Storage** — Google Drive + OneDrive integration
- **📝 Notes** — Notion integration for organized note-taking
- **📱 PWA** — Works on desktop and mobile, with offline support
- **🌙 Dark Purple Theme** — Sophisticated, premium UI designed for focus

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm
- An Anthropic API key ([Get one here](https://console.anthropic.com))

### Installation

```bash
# Clone or download the project
cd life-os

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Anthropic API key to .env.local
ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your Life OS is running!

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## Project Structure

```
life-os/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/          # Claude AI endpoint
│   │   ├── offline/           # PWA offline fallback
│   │   ├── globals.css        # Theme & utilities
│   │   ├── layout.tsx         # Root layout with PWA config
│   │   └── page.tsx           # Main dashboard
│   ├── store/
│   │   └── useLifeOSStore.ts  # Zustand state management
│   └── sw.ts                  # Service worker
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons
├── .env.example               # Environment template
└── package.json
```

## Configuration

### Required: Claude AI
Add your Anthropic API key to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Integrations

#### Google (Gmail, Calendar, Drive)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable APIs: Gmail API, Google Calendar API, Google Drive API
4. Create OAuth 2.0 credentials
5. Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

#### Microsoft (Outlook, Calendar, OneDrive)
1. Go to [Azure Portal](https://portal.azure.com)
2. Register a new application in Azure AD
3. Add API permissions: Mail.ReadWrite, Calendars.ReadWrite, Files.ReadWrite
4. Create a client secret
5. Add to `.env.local`:
```env
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
```

#### Financial (SimpleFIN)
- **SimpleFIN**: $15/year at [simplefin.org](https://simplefin.org) — connects to 25+ banks including credit unions

#### Notes (Notion)
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Share your workspace with the integration
4. Add to `.env.local`:
```env
NOTION_API_KEY=your_integration_token
```

See `.env.example` for all configuration options.

## Development Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Next.js 15 PWA setup
- [x] Dark purple UI theme
- [x] Dashboard layout
- [x] Task management
- [x] Claude AI chat integration
- [x] Zustand state management
- [x] Offline support

### 🔄 Phase 2: Google & Microsoft Integrations (Weeks 2-4)
- [ ] Gmail API integration with AI triage
- [ ] Outlook/Microsoft Graph API for email
- [ ] Google Calendar sync
- [ ] Outlook Calendar sync
- [ ] SimpleFIN bank connections
- [ ] Notion API for notes

### 📋 Phase 3: Advanced Features (Weeks 5-8)
- [ ] Convex real-time database
- [ ] Push notifications
- [ ] Bill tracking & reminders
- [ ] Travel planning features
- [ ] Google Drive / OneDrive file access
- [ ] n8n automation workflows

### 🎯 Phase 4: Polish (Weeks 9-12)
- [ ] Financial dashboards & charts
- [ ] Daily AI briefings
- [ ] Goal tracking system
- [ ] Photography work module
- [ ] Performance optimization

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, Lucide Icons |
| State | Zustand with persistence |
| AI | Claude API via Vercel AI SDK |
| PWA | Serwist (service worker) |
| Database | Convex (coming Phase 3) |
| Auth | NextAuth.js (coming Phase 2) |
| Email | Gmail API, Microsoft Graph API |
| Calendar | Google Calendar API, Outlook Calendar |
| Storage | Google Drive API, OneDrive API |
| Notes | Notion API |

## Customization

### Theming
Edit `tailwind.config.ts` to adjust the color palette:

```typescript
colors: {
  violet: {
    500: '#8b5cf6', // Primary accent
    // ... adjust as needed
  }
}
```

### AI Personality
Modify the system prompt in `src/app/api/chat/route.ts`:

```typescript
const systemPrompt = `You are the AI assistant for Life OS...`;
```

## Install as App

### Desktop (Chrome/Edge)
1. Visit your Life OS URL
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (Chrome on Android)
1. Open Life OS in Chrome
2. Tap "Add to Home Screen" banner (or Menu → Install)

## Contributing

This is a personal project, but ideas and suggestions are welcome! Open an issue to discuss.

## License

MIT — Built with 💜 for personal productivity

---

**Need help?** Open an issue or ask Claude in your Life OS chat!
