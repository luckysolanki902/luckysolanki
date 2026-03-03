# Blitzit — AI-Powered Task Management Platform

> **Role**: Software Engineer
> **Timeline**: June 2024 → Present
> **Status**: Active product — desktop app (Electron) + web app (Vue.js) + API (Fastify)

---

## Links

| Type | URL |
|------|-----|
| **Web App** | [blitzit-web.vercel.app](https://blitzit-web.vercel.app) |
| **GitHub (Private)** | blitzit-hq/api, blitzit-hq/electron-app, blitzit-hq/vue-web-app |
| **Organization** | [github.com/blitzit-hq](https://github.com/blitzit-hq) |

---

## One-Liner

A full-stack AI-powered task management platform — with an MCP server (OAuth 2.1, PKCE, JSON-RPC 2.0), deep Asana/ClickUp/Google Calendar bidirectional sync, BullMQ-based push notification scheduling, timezone-aware cron architecture, and an Electron desktop app with native FCM push notifications.

---

## Lucky's Contributions

> Only Lucky's commits counted — vue-web-app (2,843), blitzit-hq/api (141), electron-app (79).
> Total: **3,063 commits**

Lucky was responsible for the most complex engineering work in the product: the MCP server, all third-party integrations (Asana, ClickUp, Google Calendar, Zapier), the push notification infrastructure, timezone scheduling system, and Electron desktop app enhancements.

---

## Tech Stack

### API (`blitzit-hq/api`)

| Layer | Tech |
|-------|------|
| **Runtime** | Node.js 22 |
| **Framework** | Fastify 5.6 |
| **Database** | Firebase/Firestore (Admin SDK 13.5) |
| **Queue** | BullMQ 5.34 + ioredis 5.9 |
| **AI** | @langchain/openai 0.6, @langchain/core 0.3, OpenAI SDK 6.0 |
| **MCP** | @modelcontextprotocol/sdk 1.25 |
| **Auth** | OAuth 2.1 + PKCE, Firebase Custom Tokens, Passport.js (Google, Notion, ClickUp, Trello) |
| **Calendar** | @googleapis/calendar 12.0 |
| **Scheduling** | rrule 2.8, dayjs |
| **Validation** | Zod 4.3 |
| **Notifications** | FCM (Firebase Cloud Messaging) |
| **Error Tracking** | Bugsnag (core + Express plugin) |
| **Email** | Postmark 4.0 |
| **Messaging** | Slack Web API 7.13 |
| **File Upload** | @fastify/multipart + jimp |

### Electron Desktop App (`blitzit-hq/electron-app`)

| Layer | Tech |
|-------|------|
| **Framework** | Electron + Vue 3 (vue-cli-service) |
| **Version** | v2.6.43 |
| **Push Notifications** | @eneris/push-receiver 4.3 (native FCM in Electron) |
| **UI** | Headless UI, TipTap rich text editor, TanStack Virtual |
| **Utilities** | VueUse, Floating UI |

---

## Complex Engineering — MCP Server

> **~4,629 lines** across 5 files — the crown jewel of Lucky's Blitzit work.

### What It Is

A full Model Context Protocol server that lets AI assistants (Claude, OpenAI, etc.) interact with Blitzit task management through natural language. Users can create, list, update, and schedule tasks directly from AI conversations.

### Architecture

- **Protocol**: JSON-RPC 2.0 over Streamable HTTP
- **Auth**: OAuth 2.1 with PKCE (RFC 7636) + dual verification (Magic Link OR 6-digit OTP)
- **Discovery**: RFC 8414 (OAuth Authorization Server Metadata) + RFC 9728 (Protected Resource Metadata)
- **Registration**: RFC 7591 (Dynamic Client Registration)
- **Token Storage**: SHA-256 hashed — raw tokens never stored in database

### MCP Tools (13 total)

| Category | Tools |
|----------|-------|
| **Task CRUD** | `create_task`, `create_multiple_tasks`, `get_task`, `update_task`, `delete_task` |
| **Task Actions** | `list_tasks`, `move_task_to_board`, `complete_task` |
| **Lists** | `list_lists`, `create_list` |
| **Utility** | `get_todays_tasks`, `get_current_time`, `get_user_timezone` |

### OAuth 2.1 Flow

```
Claude discovers OAuth → Dynamic Client Registration → Authorization page loads →
User enters email → Server sends Magic Link + OTP simultaneously →
User verifies via OTP (fast) or Magic Link (traditional) →
Firebase Custom Token → ID Token → Authorization Code → Token Exchange →
Access Token (1h) + Refresh Token (90d) with rotation
```

### Token Management

| Token Type | Format | Expiration |
|------------|--------|------------|
| Access Token | `blitzit_mcp_access_<32hex>` | 1 hour |
| Refresh Token | `blitzit_mcp_refresh_<32hex>` | 90 days |
| MCP API Token | `blitzit_mcp_<64hex>` | 1 year (configurable) |

### Type Coercion Problem

MCP SDK stringifies all parameters (`10` → `"10"`, `true` → `"true"`). Lucky built a Zod coercion layer + a `coerceParameterTypes()` preprocessor that introspects the Zod schema tree to automatically convert strings back to their intended types — handles numbers, booleans, arrays (JSON strings), and nested objects.

### Works With

- Claude.ai (Web) — OAuth flow via Settings > Integrations > MCP
- Claude Desktop — `claude_desktop_config.json` with `streamable-http` transport
- Any MCP-compatible client — via API tokens or OAuth

---

## Complex Engineering — Third-Party Integrations

### Asana Integration (~3,023 lines: routes 1,609 + services 2,227)

Full bidirectional sync between Blitzit and Asana:

- **OAuth connection** with secure token storage
- **Two-way sync**: Create/update/complete/delete tasks in either platform — changes propagate automatically
- **Webhook processing**: Real-time Asana webhooks with signature verification (X-Hook-Secret HMAC)
- **Conflict resolution**: Handles simultaneous edits in both platforms
- **Background sync service** (1,414 lines): BullMQ-powered async sync that handles rate limits, retries, and error recovery
- **Webhook service** (765 lines): Processes Asana webhook events (task created/updated/deleted/completed) and maps them to Blitzit operations
- **Schema mapping** (409 lines): Translates between Asana's data model (projects, sections, assignees, custom fields) and Blitzit's model (lists, boards, schedules)

### Google Calendar Integration (~789 lines)

- **OAuth 2.0** with Google Calendar API v3
- **Bidirectional event sync**: Blitzit tasks ↔ Google Calendar events
- **Webhook watchers**: Google push notifications for real-time calendar changes
- **Watcher management**: Auto-refresh expired channel watchers (watchers expire after ~7 days)
- **Error handling**: Graceful OAuth callback error handling with user-friendly error pages

### ClickUp Integration (~962 lines)

- **OAuth connection** via @passport-ng/clickup
- **Bidirectional sync**: Tasks ↔ ClickUp tasks
- **Webhook processing**: Real-time ClickUp webhooks for task changes
- **Schema mapping** (262 lines): Maps ClickUp's hierarchical model (spaces > folders > lists > tasks) to Blitzit's flat model

### Zapier Integration

- Custom Zapier app routes with OAuth authentication
- Enables Blitzit to connect with 5,000+ other apps via Zapier

---

## Complex Engineering — Push Notification System

> **notification-queue.service.mjs** — 1,919 lines

A production-grade BullMQ-based push notification scheduling system:

- **Architecture**: Tasks within 24 hours get precise-delay BullMQ jobs; tasks beyond 24 hours are handled by cron re-queuing
- **FCM delivery**: Firebase Cloud Messaging for cross-platform push
- **Electron FCM**: Uses `@eneris/push-receiver` to receive FCM push notifications natively in the Electron desktop app without a browser — a non-trivial integration
- **Duplicate detection**: Job IDs prevent double-scheduling
- **Retry strategy**: Exponential backoff (high priority: 5 attempts, normal: 3 attempts)
- **Dead letter queue**: Failed notifications captured for debugging
- **Queue statistics**: Real-time monitoring of pending/active/completed/failed jobs
- **Graceful shutdown**: Clean worker termination on process exit
- **Scale-ready**: Configured for millions of tasks (10k completed job retention, stalled job detection)

---

## Complex Engineering — Timezone Scheduler

> **timezone-scheduler.service.mjs** — 556 lines

Handles the "midnight problem" — running board management and recurring task generation at midnight in *every user's timezone*:

- **Cron-to-BullMQ architecture**: Single cron job runs every 12 hours, calculates midnight for each active timezone, queues precise-delay BullMQ jobs
- **13-hour lookahead window**: Ensures no timezone midnight is missed between cron runs
- **Board manager**: Automatically moves tasks between boards (today/this-week/backlog) based on schedule dates
- **Recurring manager**: Generates next instances of recurring tasks (runs on Mondays)
- **357 tests across 21 timezones**: Comprehensive test suite covering DST transitions, edge cases, and timezone boundary conditions

---

## File Metrics

| Module | Lines of Code |
|--------|---------------|
| MCP Server | 4,629 |
| Asana Integration (routes + services) | 3,788 |
| Notification Queue Service | 1,919 |
| ClickUp Integration | 962 |
| Google Calendar Integration | 789 |
| Timezone Scheduler | 556 |
| **Total key modules** | **~12,643** |

---

## What Makes This Impressive

1. **MCP Server with full OAuth 2.1**: Not a toy implementation — follows RFC 7636 (PKCE), RFC 8414 (Discovery), RFC 7591 (Dynamic Registration), RFC 9728 (Protected Resource). Dual auth (Magic Link + OTP) bridging to Firebase Custom Tokens. SHA-256 token hashing with rotation.

2. **Bidirectional sync across 3 platforms**: Asana, Google Calendar, and ClickUp all have full two-way sync with webhook processing, conflict resolution, and background job handling — each with different API models, auth flows, and webhook patterns.

3. **Production push notification infrastructure**: Not just "send a notification" — a full BullMQ queue system with precise scheduling, retry strategies, dead letter queues, and FCM support in Electron (which normally doesn't support push notifications at all).

4. **Timezone-aware scheduling at scale**: A deceptively hard problem. The cron-to-BullMQ architecture with 13-hour lookahead windows handles DST transitions and arbitrary timezone support for a global user base.

5. **Type coercion layer for MCP**: Solved a real protocol-level incompatibility where the MCP SDK stringifies all parameters — built a Zod schema introspection system that automatically converts types back.

---

*Deep-dive completed from local codebase at `/Users/luckysolanki/Desktop/portfolio/blitzit-api/` and `/Users/luckysolanki/Desktop/portfolio/blitzit-electron-app/`, plus Lucky's GitHub commit history via `gh api`.*
