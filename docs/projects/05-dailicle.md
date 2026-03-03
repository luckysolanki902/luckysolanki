# Dailicle — AI-Powered Daily Essay Platform

> **Role**: Founder (Solo)
> **Timeline**: December 2025 → Present
> **Status**: Active — [dailicle.com](https://dailicle.com) (dailicle-web.vercel.app)

---

## Links

| Type | URL |
|------|-----|
| **Live Site** | [dailicle.com](https://dailicle.com) / [dailicle-web.vercel.app](https://dailicle-web.vercel.app) |
| **GitHub** | Luckysolanki902/dailicle-web (24 commits), Luckysolanki902/dailcle-server (18 commits) |

---

## One-Liner

A daily essay platform that publishes one deeply researched, AI-generated longform essay every morning — with a Python article generation pipeline (GPT-5.1 + web search), text-to-speech narration (OpenAI TTS → S3 → CloudFront), dynamic OG image generation, IST-aware cache invalidation, and full SEO with dynamic sitemaps.

---

## The Philosophy

> "The internet was supposed to be a library. Instead, it became a casino."

Dailicle is a rebellion against doomscrolling. One essay per day — not ten, not a feed. Topics span psychology, philosophy, startup wisdom, design thinking, cognitive biases, and personal growth. Written in the style of Paul Graham meets Wait But Why meets Morgan Housel.

The constraint is the product: scarcity creates value. When there's only one thing to read, you stop skimming and start reading.

**Manifesto**: No recommendation algorithms. No engagement loops. Read, think, and leave. Go for a walk. Build something.

---

## How It Works

```
5:30 AM IST — Render Cron Job triggers daily

run_daily_article.py
    │
    ├── topic_history_service.py  →  MongoDB (fetch ALL past topics to avoid repeats)
    │
    ├── llm_service.py            →  GPT-5.1 with web search (Responses API)
    │                                 4,000–7,000 word longform essay
    │                                 Regex extraction: metadata, YouTube, resources
    │
    ├── storage_service.py        →  Save to MongoDB (articles + topic_history)
    │
    ├── audio_service.py          →  OpenAI TTS → S3 → CloudFront (optional)
    │
    ├── notion_service.py         →  Create Notion page with full article
    │
    └── email_service.py          →  Send to inbox via Gmail SMTP

Next.js frontend (revalidate: 360s) picks up the new article automatically.
Cache invalidates at 9 AM IST (when the article goes "live" to readers).
```

---

## Tech Stack

### Frontend (`dailicle-web` — Next.js)

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16.0 (App Router, TypeScript) |
| **React** | React 19.2 |
| **Database** | MongoDB 7.0 (native driver) |
| **Rendering** | react-markdown with @tailwindcss/typography for article rendering |
| **Animation** | Framer Motion 12 |
| **Analytics** | Vercel Analytics |
| **Email** | Nodemailer 7.0 (feedback form) |
| **SEO** | Dynamic sitemap, robots.txt, JSON-LD structured data, dynamic OG images |
| **Styling** | Tailwind CSS 4 |

### Backend (`dailcle-server` — Python)

| Layer | Tech |
|-------|------|
| **Framework** | FastAPI + Uvicorn |
| **AI** | OpenAI GPT-5.1 (Responses API with web search) |
| **Audio** | OpenAI TTS → AWS S3 → CloudFront |
| **Database** | MongoDB via Motor (async) + PyMongo |
| **Notion** | Notion API (notion-client 2.2) |
| **Email** | Gmail SMTP |
| **Validation** | Pydantic 2.9 |
| **Scheduling** | Render Cron Job (daily at 5:30 AM IST) |
| **Cloud** | AWS (S3 + CloudFront) |

---

## Complex Engineering — Article Generation Pipeline

> **~2,105 lines** across 7 services in the Python server

### The Prompt Engineering

Not a simple "write me an article" prompt. The system prompt and user prompt together form a detailed instruction set that produces essays in a specific style:

- **Style**: Paul Graham meets Wait But Why meets Morgan Housel — narrative, research-backed, with wit
- **Structure**: No numbered sections, no "5 tips", no "Introduction/Conclusion" headers. Pure flowing prose.
- **Research**: GPT-5.1's web search finds real studies, papers, YouTube videos — cited naturally inline
- **Output**: 5,000–7,000 words + metadata (title, category, tags, summary) + 3-5 YouTube videos + 5-10 resources with real URLs
- **Extraction**: Regex-based parsing extracts metadata, YouTube links, and resources from the generated text

### Topic Diversity Engine

The `topic_history_service.py` (209 lines) ensures no topic repetition:
- Fetches ALL past topic titles, categories, and tags from MongoDB
- Builds an exclusion prompt that the LLM uses to pick a genuinely new angle
- Categories: psychology, decision-making, productivity, communication, relationships, creativity, learning, systems-thinking

### Orchestrator Pattern

The `orchestrator.py` (201 lines) coordinates the entire pipeline with proper error handling:
1. Fetch topic history → build exclusion prompt
2. Generate article with retry logic
3. Save to MongoDB (both `articles` and `topic_history` collections)
4. Optionally generate TTS audio
5. Send email notification
6. Return comprehensive result with timing metrics

---

## Complex Engineering — Text-to-Speech Narration

> **audio_service.py** — 500 lines

Articles can be listened to, not just read:

- **OpenAI TTS API**: Converts the full 5,000+ word article to speech
- **AWS S3 storage**: Audio files stored in S3 bucket
- **CloudFront CDN**: Served via CloudFront for global low-latency playback
- **Lazy initialization**: S3 and Mongo clients initialized on first use (optional feature, doesn't break the pipeline if AWS isn't configured)
- **Article schema supports audio**: `audio_url`, `audio_s3_key`, `audio_voice`, `audio_duration_seconds`, `audio_generated_at`

---

## Complex Engineering — Smart Caching & Time-Awareness

### IST-Aware Cache Invalidation

Articles are generated at 5:30 AM but published at 9 AM IST. The cache system (`cache.ts`) calculates seconds until next 9 AM IST and uses `min(1 hour, time_until_9AM)` for revalidation — ensuring:
- Articles don't appear before 9 AM (even though they're in the DB)
- Cache refreshes exactly when the new article should go live
- Between 9 AM publishes, cache stays fresh for up to 1 hour

### Two-Article Display Logic

The frontend fetches the latest 2 articles. Client-side JavaScript determines which to show based on the user's local 9 AM threshold — handles the overnight generation gracefully.

---

## Complex Engineering — SEO & Distribution

### Dynamic OG Images

`/api/og/route.tsx` — Server-rendered Open Graph images for social media sharing. Each article gets a unique OG image with its title.

### Dynamic Sitemap

`sitemap.ts` — Fetches ALL articles from MongoDB and generates a full sitemap with:
- Homepage: priority 1.0, daily changeFrequency
- Archive: priority 0.9, daily
- Manifesto: priority 0.7, yearly
- Each article: priority 0.8, monthly

### JSON-LD Structured Data

Full Schema.org structured data on every page — WebSite, Article, Organization — for rich search results.

---

## User-Facing Features

| Feature | Description |
|---------|-------------|
| **Homepage** | Today's essay with teaser, reading time, animated hero |
| **Reader** | Full article view with markdown rendering, typography, sources |
| **Archive** | Browse all past essays with search and pagination |
| **Manifesto** | The philosophy behind Dailicle |
| **Feedback** | User feedback form (Nodemailer) |
| **Dark/Light mode** | Theme switcher with smooth transitions |
| **Vercel Analytics** | Built-in usage tracking |

---

## Server Service Metrics

| Service | Lines | Purpose |
|---------|-------|---------|
| audio_service.py | 500 | TTS generation + S3/CloudFront |
| notion_service.py | 391 | Notion page creation |
| llm_service.py | 372 | GPT-5.1 article generation with web search |
| email_service.py | 268 | Gmail SMTP delivery |
| topic_history_service.py | 209 | Topic diversity management |
| orchestrator.py | 201 | Pipeline coordination |
| storage_service.py | 164 | MongoDB article storage |
| **Total** | **~2,105** | |

---

## What Makes This Impressive

1. **Full content pipeline, not a wrapper**: Not "here's a ChatGPT clone." It's a complete content generation, storage, distribution, and presentation system. GPT-5.1 with web search → MongoDB → Notion → Email → S3 → CloudFront → Next.js — all orchestrated by a Python backend.

2. **The prompt is the product**: The carefully crafted prompt produces essays that feel hand-written — flowing narrative, real research with inline citations, no listicles. The topic diversity engine ensures 365 genuinely different essays.

3. **Text-to-speech with CDN delivery**: Full audio narration pipeline — OpenAI TTS → S3 → CloudFront. Not just a "read aloud" button, but pre-generated audio served from a CDN.

4. **Time-aware architecture**: IST-aware cache invalidation, 9 AM publish gates, two-article display logic, overnight generation — the system respects the user's timezone and the "one essay per day" constraint at every level.

5. **Production SEO**: Dynamic sitemaps, OG image generation, JSON-LD structured data, Vercel Analytics — built to be discovered, not just used.

---

*Deep-dive completed from GitHub repos via `gh api` — Luckysolanki902/dailicle-web and Luckysolanki902/dailcle-server.*
