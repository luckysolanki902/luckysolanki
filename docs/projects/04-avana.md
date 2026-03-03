# Avana — AI-Powered Bali Land Investment Platform

> **Role**: Freelance Developer (full-stack, sole developer)
> **Timeline**: 2025 → Present
> **Status**: Active — [avana-avana.vercel.app](https://avana-avana.vercel.app) + [avana-admin.vercel.app](https://avana-admin.vercel.app)

---

## Links

| Type | URL |
|------|-----|
| **User App** | [avana-avana.vercel.app](https://avana-avana.vercel.app) |
| **Admin Panel** | [avana-admin.vercel.app](https://avana-admin.vercel.app) |
| **GitHub (Private)** | avanaapp-hq/avana-main (153 commits), avanaapp-hq/avana-admin (96 commits) |
| **Organization** | [github.com/avanaapp-hq](https://github.com/avanaapp-hq) |

---

## One-Liner

A full-stack AI-powered investment research platform for Bali land — with multi-agent AI chat (OpenAI Agents SDK), realtime voice conversations (OpenAI Realtime API via WebRTC), Xendit payment integration (1,431-line webhook handler), news aggregation with admin scraping, subscription management, and a complete admin panel.

---

## The Product

Avana helps investors research Bali land purchases with verified data instead of hype. Users can:

- **Chat with AI agents**: Ask questions about specific land parcels — zoning regulations, risk assessment, market data, investment scoring
- **Voice conversations**: Talk to the AI in realtime using OpenAI's WebRTC Realtime API
- **Discover news**: Browse curated property/land news articles scraped and managed by the admin
- **Subscribe**: Pay via Xendit (Indonesian payment gateway) for premium access to AI features

---

## Tech Stack

### User App (`avana-web`)

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16.0 (App Router) |
| **React** | React 19.2 |
| **Auth** | Clerk (@clerk/nextjs 6.36) |
| **Database** | MongoDB 7.0 (native driver) |
| **Vector Store** | Supabase (@supabase/supabase-js 2.86) |
| **AI** | OpenAI SDK 6.9, @openai/agents 0.3 |
| **Payments** | Xendit (custom integration) |
| **State** | Redux Toolkit 2.11 + Redux Persist |
| **UI** | Radix UI primitives, Tailwind CSS 4, Framer Motion 12 |
| **Markdown** | react-markdown + rehype-raw + remark-gfm |
| **Logging** | Pino + pino-pretty |

### Admin Panel (`avana-admin`)

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16.0 (App Router) |
| **Auth** | Clerk (@clerk/nextjs 6.35) |
| **Database** | MongoDB 7.0 |
| **AI** | OpenAI SDK 6.10, @openai/agents 0.3 |
| **Scraping** | Cheerio 1.1 |
| **File Upload** | react-dropzone 14.3 |
| **DnD** | @dnd-kit/core 6.3 + @dnd-kit/sortable 10.0 |
| **Validation** | Zod 3.25 |
| **UI** | Radix UI primitives, Tailwind CSS 4, Framer Motion 12, Sonner (toasts) |

---

## Complex Engineering — Multi-Agent AI System

> **~1,402 lines** across 3 files in `lib/ai/`

### Architecture

Built with the **OpenAI Agents SDK** (`@openai/agents`) — not just raw API calls. Uses a multi-agent architecture with orchestration:

- **Main orchestrator agent**: Routes user queries to the right specialist
- **Land data agent**: Fetches comprehensive land data by coordinates or UUID — zoning, risk, market data, registration
- **File search agent**: Searches the vector store (Supabase) for relevant documents and regulations
- **Handoff system**: Agents can delegate to each other via `handoff()` for complex queries that span multiple domains

### Custom Tools

Each agent has access to purpose-built tools defined with Zod schemas:

- `save_user_info` — Stores user preferences, goals, budget, timeline with confidence scoring
- `getComprehensiveLandDataByCoordinates` — Fetches full land parcel data from coordinates
- `getComprehensiveLandDataByUUID` — Fetches land data from parcel ID
- `searchLandParcel` — Search land parcels by criteria
- `getZoningData` — Zoning regulations for a specific area
- `getRiskData` — Risk assessment (flood, seismic, etc.)
- `getMarketData` — Market pricing and trends
- `getRegistrationData` — Legal registration data
- `getLocationData` — Location context and nearby amenities

### Memory System

The AI remembers users across conversations — preferences, background, goals stored in MongoDB with:
- Category classification (preference, background, goal, context)
- Confidence scoring (0-1)
- Source tracking (`ai_inferred`)
- Active/inactive status management

---

## Complex Engineering — OpenAI Realtime Voice API

### WebRTC Voice Conversations

Users can talk to the AI about land investments using voice. Implementation:

- **Ephemeral token generation**: `POST /api/realtime/token` generates short-lived WebRTC tokens via OpenAI's Realtime API
- **Subscription gating**: Voice access requires active subscription (trial or paid) — checked via `checkSubscriptionAccess()`
- **Conversation history**: `GET /api/realtime/history` stores and retrieves voice conversation transcripts
- **Search**: `GET /api/realtime/search` enables searching through past voice conversations

This is the **OpenAI Realtime API** — WebRTC-based, low-latency, bidirectional audio streaming. Not text-to-speech. The AI hears the user and responds in real-time voice.

---

## Complex Engineering — Xendit Payment System

> **Webhook handler alone: 1,431 lines** — the most complex single file in the project.

### Full Subscription Lifecycle

| Endpoint | Lines | Purpose |
|----------|-------|---------|
| `webhooks/xendit/route.js` | 1,431 | Master webhook handler for all Xendit events |
| `subscription/manage/route.js` | 703 | Subscription management (upgrade/downgrade/cancel) |
| `subscription/verify-card/route.js` | 455 | Card verification flow |
| `subscription/create-checkout/route.js` | 271 | Checkout session creation |
| `subscription/confirm-payment/route.js` | 195 | Payment confirmation |
| `subscription/verify-callback/route.js` | 133 | Verification callbacks |
| `subscription/route.js` | 181 | Base subscription status |
| `subscriptions/cancel/` | — | Cancellation flow |
| `cron/process-billing/route.js` | 334 | Cron job for billing cycle processing |
| `cron/trial-conversion/route.js` | 184 | Cron job for trial-to-paid conversion |
| **Total** | **~3,887** | |

### Webhook Complexity

The 1,431-line webhook handler processes 3 different Xendit webhook formats:
1. **Payment Requests**: `{ event: 'payment.succeeded', data: {...} }`
2. **Invoices (direct)**: `{ status: 'PAID', external_id: '...', ... }`
3. **Recurring**: `{ event: 'recurring.cycle.succeeded', data: {...} }`

Includes:
- Signature verification for webhook authenticity
- Full webhook logging to database for debugging
- Payment metadata extraction and validation
- Subscription activation/renewal logic
- Refund processing via `createRefund()`
- Recurring plan creation via `createRecurringPlan()`

### Xendit Utility Layer (`lib/xendit.js` — 444 lines)

Abstracts Xendit API calls: signature verification, refund creation, recurring plan management, payment request fetching.

---

## Complex Engineering — News Aggregation System

### User-Facing
- `GET /api/news` — Paginated news feed with filtering (116 lines)
- `GET /api/news/[slug]` — Individual article view (113 lines)

### Admin Scraping & Management
- `GET/POST /api/news/articles` — Article CRUD with Cheerio-based scraping (207 lines)
- `GET/PUT/DELETE /api/news/articles/[articleId]` — Individual article management (179 lines)
- `GET/POST /api/news/sources` — News source management
- `GET/PUT/DELETE /api/news/sources/[sourceId]` — Source CRUD (167 lines)
- `GET /api/news/stats` — News analytics
- `cron/news/route.js` — Automated news scraping cron job (203 lines)
- `cron/images/route.js` — Image processing cron job (212 lines)

### Data Models

7 MongoDB collections with indexes: users, subscriptions, onboarding, surveys, news, pricing, analytics, memories.

---

## Complex Engineering — Admin Panel

The admin panel (`avana-admin`) is a complete management interface:

| Section | Features |
|---------|----------|
| **Dashboard** | Overview metrics and KPIs |
| **Users** | User management and details |
| **Subscriptions** | Subscription management, status, history |
| **Conversations** | View user AI conversations |
| **News** | Article and source management with scraping |
| **Documents** | Document management for vector store |
| **Analytics** | Usage analytics and trends |
| **Settings** | Pricing configuration, team management |
| **AI/Vector Stores** | OpenAI vector store management (file upload, indexing) |

---

## Code Metrics

| Category | Lines of Code |
|----------|---------------|
| User App API routes | 6,441 |
| Admin App API routes | 3,141 |
| AI Agent system | 1,402 |
| Xendit utility layer | 444 |
| **Total server-side** | **~11,428** |

---

## What Makes This Impressive

1. **Multi-agent AI with OpenAI Agents SDK**: Not just a ChatGPT wrapper — a multi-agent system with handoffs, custom tools (Zod-validated), vector store search, and persistent user memory across conversations.

2. **OpenAI Realtime Voice API**: WebRTC-based realtime voice — users literally talk to the AI about land investments. Subscription-gated, with conversation history and search.

3. **1,431-line Xendit webhook handler**: Handles 3 different webhook formats from Xendit, the dominant Indonesian payment gateway. Full subscription lifecycle: checkout → payment → verification → renewal → cancellation → refund.

4. **Complete admin panel**: Not an afterthought — full content management, subscription admin, conversation monitoring, vector store management, news scraping with Cheerio, and analytics.

5. **Sole developer on production system**: Built entirely by Lucky as a freelancer — both the user-facing app and the admin panel, from database schema to deployment.

---

*Deep-dive completed from local codebase at `/Users/luckysolanki/Desktop/portfolio/avana/`, plus GitHub commit history via `gh api`.*
