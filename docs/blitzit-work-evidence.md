# Blitzit portfolio content: evidence and scope

Reviewed October 1, 2026. This is an editorial source map, not public article copy. Source repositories were read only. No credentials, customer data, proprietary implementation listings, or production database queries are included.

## What was reviewed

Lucky Solanki's recent authored commit history, PR metadata and bodies, and current frontend/backend implementation under `3_0`. The review covers major work from October 2025 through September 2026 across the 2.0 API/Electron and 3.0 backend/frontend repositories. It is a review of major changes, not a line-by-line audit of every commit. PR descriptions establish intended scope; current code and regression tests establish the architecture described in the new articles. Source tests were inspected, not rerun. No independent Colab execution logs or live acoustic evaluation were available beyond the committed scripts and notes.

## Major work across the period

| Period | Contribution | Source PRs |
| --- | --- | --- |
| October to December 2025 | Asana sync and frontend integration work, AI chat action handling, Notion API updates, reporting fixes | Authored history in `2_0/api` and `2_0/electron-app`; legacy API PRs 86, 108, 117 |
| January to February 2026 | Server-owned recurrence, timezone scheduling, reminder queues and FCM | Legacy API and Electron authored history |
| March to May 2026 | Fastify/TypeScript backend, authentication, task/list APIs, local-first sync, provider architecture, OAuth/MCP, Stripe and RevenueCat | Initial backend history and subsequent PRs; frontend was not wholly authored by Lucky |
| June | Shared-list access and collaboration, WebSocket-first delivery and edit locks, managed-team billing, SLO instrumentation | backend [19](https://github.com/blitzit-hq/newbackend/pull/19), [21](https://github.com/blitzit-hq/newbackend/pull/21), [27](https://github.com/blitzit-hq/newbackend/pull/27), [30](https://github.com/blitzit-hq/newbackend/pull/30) |
| July | Universal change journal, direct AI actions, resumable per-user migration from 2.0 to 3.0, frontend virtualization | backend [44](https://github.com/blitzit-hq/newbackend/pull/44), [47](https://github.com/blitzit-hq/newbackend/pull/47); frontend [71](https://github.com/blitzit-hq/newfrontend/pull/71) |
| August | Integration SDK, outbound task creation and reconnect, app/MCP/Blitzy parity, memory and personalization | backend [79](https://github.com/blitzit-hq/newbackend/pull/79), [91](https://github.com/blitzit-hq/newbackend/pull/91), [103](https://github.com/blitzit-hq/newbackend/pull/103) |
| September | Shared presence and activity attribution, pooled/multiplexed MongoDB change streams, notifications and Blitzy Moments, realtime voice | frontend [289](https://github.com/blitzit-hq/newfrontend/pull/289); backend [192](https://github.com/blitzit-hq/newbackend/pull/192), [222](https://github.com/blitzit-hq/newbackend/pull/222), [225](https://github.com/blitzit-hq/newbackend/pull/225), [226](https://github.com/blitzit-hq/newbackend/pull/226) |

These PRs are merged. The complete frontend voice PR [411](https://github.com/blitzit-hq/newfrontend/pull/411) was OPEN at review time. Describing voice as built or current engineering work is supported; claiming general availability is not established.

## Article 1: voice and the shared agent

Sources in backend: `src/modules/ai/voice/{thinker,controller,openai-realtime,speech-coordinator,spoken-summary,unified-agent.test}.ts` and `src/modules/ai/service.ts`. Latest inspected backend commit: `6297e68`.

- The latest talker session has no tools and disabled tool choice. The older `talker-tools.ts` exists but does not describe the current execution boundary.
- The voice adapter invokes the normal `chat()` service with literal final speech, fresh client context, voice modality, cancellation, and a change-journal commit session.
- The shared agent filters read-only tools and rejects writes again at execution time.
- Final transcription IDs are deduplicated; raw VAD and partial transcripts do not execute work.
- Spoken outcomes are separate from display text. Speech ownership persists through actual playback completion.
- Accuracy benefits are architectural intent, not a measured model-accuracy improvement. No production latency benchmark is claimed.

## Article 2: Hey Blitzy

Sources in frontend: `apps/desktop-renderer/src/features/voice-agent/wake-word/`, including `models/README.md`, `training/{configs.py,train_wrap.py,evaluate.ts}`, `pipeline.ts`, `detector.ts`, and `verify.ts`. Relevant commits: `cd1ea03`, `8dfb0f5`, `6e508d2`.

- Custom keyword classifier trained with openWakeWord tooling in Colab; ONNX feature/classifier inference runs locally via WASM.
- Packaged model is v3. Latest config prepares v4, which the notes explicitly say was not trained due to GPU quota.
- Evaluation is synthetic macOS speech, 29 voices at two speeds. Do not turn a clean synthetic result or configured false-positive target into production accuracy.
- The README's opening privacy sentence is stale. Actual verification sends a short candidate clip for transcription before opening the call. Do not claim end-to-end offline processing.
- Verification currently accepts on timeout/error. This is an availability tradeoff, not a safety guarantee. It opens the interface, not permission to execute a command.
- Pronunciation dictionary additions and positive/negative label consistency are documented in the wrapper.

## Article 3: the orb

Sources in frontend: `apps/desktop-renderer/src/features/voice-agent/orb/orb-model.ts` and `blitzy-orb.tsx`, voice machine and companion lifecycle; PR 411. Latest inspected frontend commit: `aaf1bc0`.

- Fibonacci sphere; stable viewer-facing eyes; separate scan/work intents.
- Audio levels gated by recognized conversation states.
- Glyph/300-dot/900-dot tiers, elapsed-time blending, visibility pause, reduced-motion redraws.
- Request generations and session ownership protect asynchronous opening/closing and mic handoff.
- No universal frame-rate, battery, or latency claim is made.

## Editorial decisions

- Only Blitzit and MaddyCustom have featured work stories. Spyll is a project, not an employment entry.
- The previous blog collection is removed. Legacy relevant URLs redirect to these work stories.
- One long Blitzit story combines platform breadth and the deeper voice, wake-word, and orb explanations. It does not reproduce private source listings.
- Screenshots come from an isolated local backend/frontend with sample tasks and notifications. No production account or database was used.
- Published screenshots preserve the original app pixels, with presentation framing supplied by CSS. The orb preview renders the original canvas component locally; the separate orb design study is explicitly labeled. See work-story-image-provenance.md for sources and demo-data limitations.
- Product-specific metrics stay in the work section. Hero experience is calculated from December 2022.
- Backend voice is merged; frontend PR 411 was still in review on October 1, 2026. No general-availability or measured accuracy claim is made.

## Backend ownership and architecture, verified October 1, 2026

The backend history starts with Lucky Solanki's `c5e0380` (March 11, 2026): Fastify 5, TypeScript, MongoDB, Redis, and event bus. Followed by models `cd7e77a`, auth `9d12d67`, core CRUD `0a4eb9d`, RxDB sync `3fb68fe`, recurrence `a9fd217`, and integration SDK `f07cc70`. These support the explicit claim that Lucky designed and built the entire 3.0 backend from scratch. They do not imply sole authorship of all frontend work or every subsequent contribution.

- `src/server.ts`: composition root for domain routes, infrastructure plugins, integration registry, and lifecycle wiring.
- `src/modules/`: domain-oriented routes, schemas, services. MongoDB models are separate.
- `src/plugins/event-bus.ts`: typed in-process EventEmitter, task attribution, listener error reporting, lifecycle cleanup. Not durable messaging or an event-sourced database.
- `src/modules/tasks/service.ts`: task creation saves state and records journal/activity before emitting `task.created`.
- `src/integrations/sdk/event-handler.ts`: checks provider capability and connection usability; skips integration-origin changes to avoid sync loops.
- `src/lib/process-role.ts`, `src/lifecycle/background-work.ts`: producers and local listeners in every role, consumers/schedulers role-scoped. BullMQ and Socket.IO's Redis adapter carry cross-process work; domain events are not independently fanned out across processes.
- Initial authorship verified with Git. Architecture read from the current checkout without modifying source files. No exactly-once, automatic crash replay, latency, or throughput claim is made.
