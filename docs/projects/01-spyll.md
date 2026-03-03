# Spyll — India's Anonymous College Network

> **Role**: Founder & Lead Developer
> **Timeline**: Dec 2023 → Present (actively maintained)
> **Status**: Live

---

## Links

| Type | URL |
|------|-----|
| **Website** | [spyll.in](https://spyll.in) |
| **Google Play Store** | [Play Store listing](https://play.google.com/store/apps/details?id=in.spyll.app) |
| **Android APK (Direct)** | [GitHub Releases — v2.0.5](https://github.com/Luckysolanki902/spyll-web/releases/latest) |
| **GitHub (Private)** | [spyll-web](https://github.com/Luckysolanki902/spyll-web) (556 commits), [spyll-server](https://github.com/Luckysolanki902/spyll-server) (106 commits) |
| **iOS** | Coming soon |

---

## One-Liner

A full-stack anonymous social platform for verified college students across India — real-time chat, voice calls (WebRTC), encrypted confessions, and a post feed — live across 1,300+ colleges.

---

## The Problem

College students in India face a paradox: surrounded by hundreds of people daily, yet unable to speak honestly. Senior interactions risk ragging, cross-gender conversations spawn gossip, and vulnerable moments become permanent social labels. Existing platforms (Instagram, Telegram confession pages, WhatsApp groups) all fail because identity is either visible or discoverable.

Previous anonymous platforms (Omegle, Yik Yak) failed because unverified anonymity enables abuse. Omegle shut down in 2023.

**Spyll's insight**: Anonymity needs a trust layer. College email verification provides accountability without sacrificing privacy.

---

## What It Does

### 5 Core Features

| Feature | Description | Anonymity Level |
|---------|-------------|-----------------|
| **Explore** | Post feed (text, images, polls) — trending + chronological, "My College" toggle | Pseudonymous (username visible) |
| **Confessions** | Fully anonymous posts — AES-256 encrypted author identity, gender-based gradient feed | Fully anonymous (no username shown) |
| **Random Connect** | Match with random verified student — text chat + simultaneous voice call | Anonymous (gender only) → can friend request |
| **Friends** | Persistent encrypted DM system — read receipts, typing indicators, reply threads | Username-based |
| **Profile** | Auto-generated avatar + username + college — post history, friend requests | Pseudonymous |

### Key Sub-Features

- **Polls**: First-class in-feed voting with animated results, atomic vote counters, demographic tracking
- **Anonymous Replies**: Private DM to confession authors without revealing either identity
- **Call Notes**: In-call note-taking with smart parsing (auto-links Instagram handles, WhatsApp numbers)
- **Push Notifications**: Firebase Cloud Messaging, milestone alerts (like counts at 1/5/10/25/50/100+)
- **Blocking System**: Universal across all features, tied to backend anonymous IDs
- **Guided Onboarding Tours**: Step-by-step walkthroughs (Driver.js) for first-time users
- **Campus-Only Mode**: Posts, confessions, and polls can be restricted to author's college only

---

## Tech Stack

### Frontend — `spyll-web` (556 commits)

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (Pages Router) |
| **UI** | React 18, MUI (Material-UI) 5, Framer Motion |
| **State** | Redux Toolkit + Redux Persist |
| **Auth** | NextAuth.js (custom college email OTP flow) |
| **Real-time** | Socket.IO client, PeerJS (WebRTC) |
| **Mobile** | Capacitor 6 (Android/iOS — single codebase) |
| **Native Mobile APIs** | Push notifications, camera, haptics, filesystem, share sheet, splash screen, status bar |
| **Encryption** | CryptoJS (AES-256 client-side) |
| **Charts** | Recharts (analytics) |
| **Data** | Axios, MongoDB driver (API routes), ioredis |
| **Storage** | AWS S3 (presigned uploads via @aws-sdk/client-s3) |

### Backend — `spyll-server` (106 commits)

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js + Express |
| **WebSocket** | Socket.IO with Redis Adapter (horizontal scaling) |
| **WebRTC Signaling** | PeerJS server |
| **Database** | MongoDB (Mongoose 8) |
| **Cache** | Redis (ioredis) — 2-tier: local Map (0ms) → Redis (1-5ms) → MongoDB |
| **Job Queue** | BullMQ (background push notifications, cleanup, email) |
| **Push Notifications** | Firebase Admin SDK |
| **Logging** | Pino + Pino-pretty |
| **Testing** | Mocha + Chai + Supertest |
| **Load Testing** | k6 |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting (spyll.in) |
| **Render** | Server hosting (Socket.IO + PeerJS) |
| **MongoDB Atlas** | Database (M10 cluster, 1500 conn pool) |
| **Upstash** | Redis (Socket.IO adapter + caching) |
| **AWS S3** | Media storage (presigned URLs) |
| **Firebase** | Push notifications (FCM), analytics |
| **Google Play Console** | Android app distribution |

---

## Complex Engineering

### 1. Encryption Architecture
- **Confessions**: Author MID encrypted with AES-256 before storage — cryptographically untraceable even with full DB access
- **Friend Messages**: AES-256-CBC encrypted at rest, decrypted on read
- **Random Chat**: Messages exist only in browser memory — zero server persistence
- **Voice Calls**: WebRTC peer-to-peer — audio never touches any server, never recorded

### 2. Real-Time Matching System
- Custom pairing queue with O(1) lookups via index map (was O(n) scan every 500ms)
- Progressive filter relaxation: same college + preferred gender → any college + preferred gender → same college + any → any + any
- Live queue position + estimated wait time display
- Stale connection cleanup via BullMQ scheduled job (every 2 min)

### 3. Scaling Architecture (scale10k branch)
- **Redis Adapter**: Socket.IO horizontal scaling across multiple instances
- **2-Tier Cache**: Local Map → Redis → MongoDB (eliminates DB query per identify event)
- **BullMQ Jobs**: Offloaded push notification broadcasts, email, cleanup from event loop
- **Optimized Disconnect**: O(1) partner lookup via userRooms map (was O(n) full iteration)
- **Graceful Shutdown**: Ordered teardown of Redis → BullMQ → MongoDB → Socket.IO on deploy
- Estimated capacity: 500–1,500 concurrent users (text) on $7/mo → 5,000–10,000 on 2GB VPS

### 4. Atomic Like System
- Confession likes: `findOneAndDelete` + `$inc` — single atomic operation (no read-then-write race)
- Explore likes: create + catch-E11000 pattern (eliminates duplicate like race)
- Self-healing: dedup script + counters synced from actual `Like` document count
- Frontend: `useRef` in-flight lock (React useState batches caused double-fire)

### 5. College Verification System
- Database of 1,300+ Indian colleges with whitelisted email domains (IITs, NITs, BITS, IIITs, central/state/private universities)
- OTP-based verification via college email
- User can recommend unlisted colleges for manual review

### 6. Cross-Platform from One Codebase
- Next.js web app → Capacitor wraps into native Android shell
- Native API access: push notifications, camera, haptics, share sheet, splash screen, status bar, filesystem
- Build pipeline: `next build` → `cap sync android` → Gradle APK/AAB
- Custom version bump script for Android releases

### 7. Feed Algorithm
- Trending sort: engagement score (likes × weight + unique commenters × weight + freshness boost)
- "My College" toggle: server-side filter by author's college
- Optimistic UI: likes update instantly, server syncs in background
- Redis feed caching layer with graceful degradation (works without Redis)

---

## Design System

- **Gender-based theming**: Entire UI adapts with cyan/blue (male) and pink (female) tones — avatars, card tints, navigation, confession feed background gradients
- **Dynamic confession feed**: Background gradient shifts live as user scrolls between male/female confessions
- **Glassmorphism cards**: Consistent across posts, confessions, polls
- **Milestone notifications**: Dopamine-calibrated intervals (1, 5, 10, 25, 50, 100+)

---

## Metrics

| Metric | Value |
|--------|-------|
| Total commits | 662 (556 web + 106 server) |
| Colleges covered | 1,300+ |
| Organic signups | 250+ (zero marketing spend) |
| Play Store downloads | 50+ |
| Current version | v2.0.5 |
| TAM | 40M+ college students in India |

---

## Team

| Name | Role |
|------|------|
| **Lucky Solanki** | Founder & Lead Developer |
| **Chaman Singh Narwar** | Co-founder |
| **Vaibhav Solanki** | Co-founder |

---

## Portfolio Positioning

**Founder story**: Built a full product from zero — idea → architecture → frontend → backend → mobile app → deployment → Play Store listing → user onboarding. Not a tutorial project. Not a clone. A real social platform solving a real problem for real users.

**Technical depth**: WebRTC voice calling, AES-256 encryption, real-time Socket.IO at scale, Redis caching, atomic operations, cross-platform mobile via Capacitor, progressive matching algorithm.

**Product thinking**: College verification as trust layer, progressive anonymity levels (posts vs confessions vs random connect), gender-aware design system, milestone notifications for engagement.
