import type { BlogPost } from "@/lib/blog";

export const blitzit3PlatformRewrite: BlogPost = {
  slug: "blitzit-3-platform-rewrite",
  title: "Inside the Blitzit 3.0 backend rewrite",
  subtitle:
    "The 3.0 backend became the place where AI tools, MCP, integrations, queues, workers, realtime sync, and ordinary task APIs could share the same rules.",
  excerpt:
    "Blitzit 3.0 was the rewrite where routes turned into a runtime: Fastify, MongoDB, Redis, BullMQ, integration plugins, MCP, AI tools, and tests around the risky parts.",
  project: "Blitzit",
  date: "2026-07-08",
  readTime: "12 min",
  tags: ["Backend", "Architecture"],
  featured: true,
  sections: [
    {
      heading: "The moment the old shape stopped fitting",
      paragraphs: [
        "The 2.0 backend had grown around integrations. OAuth redirects, provider flows, task APIs, useful pieces everywhere. Then the product started asking for a different kind of backend. Blitzy needed to change real task data. MCP clients needed a tool surface. Integrations needed background sync. Webhooks needed retries. Realtime updates needed to come from the same mutation flow as normal API calls.",
        "I remember looking at the 3.0 requirements and feeling that one more folder of routes would make the next six months worse. The product needed a platform layer. Boring words. The work itself was very concrete: shared validation, shared ownership checks, shared operations, shared queues, shared history.",
      ],
    },
    {
      heading: "What the server became",
      paragraphs: [
        "The 3.0 server starts like a product runtime. Fastify boots with Zod validation, raw body preservation for webhook signatures, security, CORS, metrics, MongoDB, Redis, auth, rate limits, API docs, routes, integration plugins, queues, workers, schedulers, notification workers, and shutdown hooks.",
        "That startup order says a lot. A request might create a task. The same task can emit events, enter a sync queue, notify another client, get recorded in history, and later move through a worker. The backend has to know about all of that before the first user action lands.",
      ],
      diagram: {
        title: "The 3.0 runtime",
        code: `flowchart LR
  App[Web / desktop] --> API[Fastify API]
  Agent[MCP / AI tools] --> API
  API --> Auth[Auth + scopes]
  Auth --> Ops[Task/list operations]
  Ops --> Mongo[(MongoDB)]
  Ops --> Journal[Change journal]
  Ops --> Events[Domain events]
  Events --> Queues[BullMQ queues]
  Queues --> Workers[Workers]
  Workers --> Providers[External providers]
  Workers --> Webhooks[Customer webhooks]`,
      },
    },
    {
      heading: "The payoff",
      paragraphs: [
        "Once the operations layer existed, every caller could use it. The web app, Blitzy, MCP, integration sync, and API clients were no longer inventing their own versions of task mutation. That made undo possible across sources. It made AI changes safer. It made sync less scattered. It gave tests a real surface to target.",
        "The rewrite was big because Blitzit had become a product with many actors touching the same state. The work was to make those actors behave like they were inside one system.",
      ],
    },
    {
      heading: "The 2.0 smell",
      paragraphs: [
        "The 2.0 API described itself as an integration OAuth redirection codebase. That description was honest. The code had useful integration work, and it carried the product to that point. The problem was the product had outgrown that center.",
        "When a backend's center is OAuth redirection, every feature that is not OAuth starts looking like an attachment. AI actions become special. Sync becomes special. Webhooks become special. MCP becomes special. Special paths are fine until there are enough of them to become the architecture.",
      ],
    },
    {
      heading: "The 3.0 runtime in practice",
      paragraphs: [
        "The 3.0 backend had to host normal app traffic, direct AI writes, MCP traffic, provider webhooks, queue workers, notification delivery, billing callbacks, and internal schedulers. I wanted one place where the boring rules lived. Who owns this task? Is this payload valid? Should this mutation emit an event? Does this need a queue? Should this be undoable?",
        "That is why the server startup became staged. Validation and serialization come early. Raw body preservation comes before webhook routes. Mongo and Redis come before modules that need them. Integration plugins register before event wiring. Workers start after queues are ready. Shutdown hooks close the whole system intentionally.",
      ],
    },
    {
      heading: "The request path",
      paragraphs: [
        "A normal task mutation flows through auth, Zod parsing, a route handler, the operations layer, MongoDB, the change journal, domain events, and then queues if any side effects need to run. The response can return quickly while workers handle provider sync or webhook delivery later.",
        "That shape made it easier to reason about failures. If a provider is slow, the user still sees their task move. If a webhook fails, a worker retries it. If an AI tool calls the same operation as the UI, it gets the same ownership checks and history behavior.",
      ],
      diagram: {
        title: "One mutation path",
        code: `flowchart LR
  Req[Request or tool call] --> Auth[Auth + ownership]
  Auth --> Parse[Zod parse]
  Parse --> Ops[Operation]
  Ops --> DB[(MongoDB)]
  Ops --> History[History commit]
  Ops --> Event[Domain event]
  Event --> Queue[Queue side effects]
  Queue --> Worker[Worker retries]`,
      },
    },
    {
      heading: "Tests followed the danger",
      paragraphs: [
        "The 3.0 test surface grew because the risky behavior moved beyond route handlers. There were tests for operation scopes, AI tool execution, tool selection, undo and redo, MCP contracts, sync behavior, queue paths, and stress cases.",
        "The useful question for tests became: where could trust break? Scope leaks, invalid MCP payloads, duplicate sync writes, broken undo semantics, queue failures, stale tool results. Those are the bugs that make an app feel unsafe even when the happy path works.",
      ],
    },
  ],
};
