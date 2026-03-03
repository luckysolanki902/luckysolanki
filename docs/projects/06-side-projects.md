# Side Projects

> Smaller projects that showcase technical range and personality.

---

## Help Me Cheat a Quiz

> **What it is**: A Python desktop tool that screenshots your screen, extracts text via OCR, sends it simultaneously to both GPT-4o and Gemini for answering, then sends the answers to your phone via WhatsApp — all triggered by a single hotkey.

| Detail | Info |
|--------|------|
| **Role** | Solo |
| **Commits** | 4 |
| **Tech** | Python, PyAutoGUI, PyPerClip, OpenAI GPT-4o, Google Gemini, Twilio (WhatsApp), OCR |
| **GitHub** | Luckysolanki902/help-me-cheat-a-quiz |

### How it works

1. Press **Ctrl+I** during a quiz
2. Tool takes a screenshot of the screen
3. OCR extracts text from the screenshot
4. **Simultaneously** sends to GPT-4o (text) and Gemini (image) for processing
5. Both responses parsed with regex to extract answer format: `*Q<number>* (<option>) <answer>`
6. Answers sent to your phone via WhatsApp (Twilio)
7. Screenshot auto-deleted for cleanup

### Why it's interesting

- Dual-LLM architecture: sends to both GPT and Gemini concurrently with `asyncio.gather()` — cross-validates answers
- Image + text dual path: OCR text goes to GPT, raw screenshot goes to Gemini
- WhatsApp delivery: answers show up on your phone, not on the quiz screen
- The newer private version also includes a LeetCode solver

---

## LifeOS — Gamified Life Dashboard

> **What it is**: A comprehensive personal life management system that gamifies daily routines and habits. The core metric is "You are X% better version of yourself" — every 150 points = 1% better.

| Detail | Info |
|--------|------|
| **Role** | Solo |
| **Commits** | 112+ |
| **Tech** | Next.js 16, React 19, TypeScript, MongoDB (Mongoose 9), Capacitor 8 (Android), @modelcontextprotocol/sdk 1.25, OpenAI, Redux Toolkit, Recharts, DnD Kit, Framer Motion, Electron |
| **GitHub** | Private (Luckysolanki902/life-os) |

### The Concept

A personal operating system that tracks every dimension of life with gamification:

| Module | What It Tracks |
|--------|----------------|
| **Home Dashboard** | Overall "Better %" metric, streak counter, incomplete tasks, weight quick-log, domain overview |
| **Routine** | Daily habit management with time-of-day grouping (morning/afternoon/evening/night), drag-and-drop ordering, recurrence patterns (daily/weekdays/weekends/custom), swipe gestures |
| **Health** | Weight tracking with BMI, weight delta vs 30 days ago, workout logging, muscle map visualization, mood tracking |
| **Books** | Reading list with domains, progress tracking, check-ins |
| **Learning** | Skill development tracking with areas, skills, practice mediums |
| **Reports** | Comprehensive analytics with heatmaps, charts (Recharts), historical data |
| **Domains** | Multi-domain tracking: Health, Career, Learning, Social, Discipline, Personality, Startups |

### Technical Highlights

- **20 Mongoose models**: Task, User, DailyLog, DailyStreakRecord, HealthLog, WeightLog, MoodLog, ExerciseLog, ExerciseDefinition, Book, BookDomain, BookLog, LearningArea, LearningCategory, LearningSkill, LearningLog, SimpleLearningLog, SyncState, HealthPage, PracticeMedium
- **MCP integration**: Has @modelcontextprotocol/sdk — likely to control the app via AI assistants
- **Cross-platform**: Next.js web + Android app (Capacitor 8) + Electron desktop — all from same codebase
- **Real-time sync**: Multi-device synchronization system (dedicated `SYNC.md` + `CROSS_PAGE_SYNC.md` + `SYNC_IMPLEMENTATION.md` docs)
- **Gamification engine**: Points system where routine tasks earn 1-10 points based on difficulty, streak multipliers
- **MuscleMap component**: Visual muscle map for tracking workout coverage
- **9 detailed README docs**: HOME, ROUTINE, HEALTH, BOOKS, LEARNING, REPORTS, SYNC, ARCHITECTURE, MOBILE

### Why it's interesting

Not a todo app — it's a personal OS with a gamification philosophy. The "Better %" metric, the streak system, the multi-domain tracking (health + career + learning + social + discipline + personality + startups), and the cross-platform delivery (web + Android + desktop from one codebase) show how Lucky thinks about building products that serve a real need. Built this entirely for personal use, not for others.

---

*Researched via `gh api` — both repos.*
