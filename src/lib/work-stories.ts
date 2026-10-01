export interface WorkFeature {
  id: string;
  title: string;
  outcome: string;
  how: string;
  tech: string;
  article?: string;
}
export interface WorkStory {
  slug: string;
  name: string;
  role: string;
  period: string;
  heading: string;
  introduction: string;
  ownership: string;
  image: string;
  caption: string;
  proof: { value: string; label: string }[];
  features: WorkFeature[];
  status: string;
}
export const workStories: WorkStory[] = [
  {
    slug: "blitzit", name: "Blitzit", role: "Core Backend Developer & AI Engineer", period: "Nov 2025 to present",
    heading: "Blitzit 3.0, from the backend up.",
    introduction: "I designed and built Blitzit 3.0’s entire backend from scratch, then built the AI and integrations on top of it. One foundation for tasks, shared work, connected tools, and an assistant that can act.",
    ownership: "I owned the backend from the first Fastify server and database models to the modular architecture, typed event bus, API and worker roles, authentication, billing, and migration. That foundation now connects 12 providers, shared AI tools, and realtime collaboration. My latest work brings it into Blitzy’s voice experience, custom wake word, and interactive orb.",
    image: "/images/projects/blitzit/board-clean.webp",
    caption: "Blitzit 3.0, captured locally with sample tasks. Original interface, unaltered.",
    proof: [{value:"12",label:"connected providers"},{value:"70+",label:"MCP tools"},{value:"Text + voice",label:"one shared action layer"}],
    status: "Work reviewed through October 2026. Voice backend changes are merged; the complete frontend voice experience is in review. Screenshots use an isolated local demo account.",
    features: [
      {id:"architecture",title:"The whole 3.0 backend. From a blank repo.",outcome:"A shared foundation for the product: accounts, tasks, collaboration, billing, integrations, and AI, with clear boundaries as each part grows.",how:"I designed and built the backend in Fastify and TypeScript, with domain modules separating routes, validation, and business logic. MongoDB holds product state; a typed event bus connects side effects without putting every concern inside a request handler. Redis and BullMQ support queued work, while separate API and worker roles let background processing run apart from public requests.",tech:"Fastify · TypeScript · modular architecture · typed event bus · MongoDB · BullMQ"},
      {id:"voice",title:"Talk naturally. Get real work done.",outcome:"Spoken requests can use the same context and capabilities as typed chat, with the same checks before changing anything.",how:"I separated speech from execution. The realtime voice model handles conversation; the existing reasoning agent receives the final transcript, uses scoped tools, and returns a grounded outcome. I built interruption handling, fresh context per turn, and coordination so acknowledgements and results do not talk over each other.",tech:"OpenAI Realtime · shared reasoning agent · WebRTC · cancellation"},
      {id:"wake-word",title:"“Hey Blitzy.” From wake word to working companion.",outcome:"A hands-free entry point, with an orb that makes listening, thinking, and acting visible.",how:"I trained a custom wake-word classifier in Colab and integrated local ONNX inference. A short transcription check filters candidate detections before starting a conversation. I built the microphone handoff and session lifecycle, plus an orb driven by actual audio and agent state. It pauses offscreen and respects reduced motion.",tech:"Python · openWakeWord · ONNX Runtime · Web Audio · canvas"},
      {id:"integrations",title:"Your tools, working together.",outcome:"Tasks and changes can move between Blitzit and the services people already use, instead of becoming another isolated list.",how:"I built a provider plugin contract for authentication, field mapping, discovery, and sync. Shared OAuth, webhook, queue, and retry infrastructure supports Asana, ClickUp, Notion, Trello, Todoist, TickTick, Linear, GitHub, and Google and Microsoft task/calendar providers. Provider errors retain their meaning, so reconnecting an account is not treated like a temporary outage.",tech:"TypeScript · OAuth · webhooks · Redis · BullMQ"},
      {id:"shared-tools",title:"One set of rules for every AI client.",outcome:"Blitzy and external AI clients can act on the product through a consistent permission model.",how:"I built the MCP surface with OAuth 2.1 and PKCE, scopes, typed schemas, and read/write annotations. External clients and the in-app agent share tool definitions and the executor, instead of maintaining separate implementations that gradually disagree.",tech:"MCP · Streamable HTTP · OAuth 2.1 · Zod"},
      {id:"undo",title:"AI made a change? You can undo it.",outcome:"Automation becomes easier to trust when a mistaken action has a clear way back.",how:"I designed a per-user change journal. Human and AI mutations become reversible commits, with before/after state and content checks. Undo checks the current state before restoring anything, so it does not silently overwrite newer edits.",tech:"Change journal · content hashes · conflict checks"},
      {id:"collaboration",title:"Shared work that stays in sync.",outcome:"People can share lists, see activity, and work across clients with explicit access boundaries.",how:"I built shared-list invitations and granular permissions, realtime delivery, and soft edit locks. Durable writes go through the API; local-first clients receive document updates and checkpoints, with recovery paths when a connection drops. Later work separated change-stream connections and shared database cursors across listeners to reduce contention.",tech:"MongoDB · RxDB · WebSockets · SSE · Redis"},
      {id:"memory",title:"An assistant with useful memory.",outcome:"The assistant can carry relevant context forward without treating every interaction as a fresh start.",how:"I built memory and personalization machinery that separates remembered facts from derived activity signals. Extraction, deduplication, budgets, decay, and forgetting keep that context bounded. User controls matter as much as recall: remembered information needs a way to be inspected and removed.",tech:"Agent context · memory extraction · attribution · retention controls"},
      {id:"platform",title:"The platform underneath the features.",outcome:"Tasks, reminders, billing, and accounts need to keep working even when nobody is talking to an AI.",how:"My work includes the Fastify backend, authentication and sessions, task/list APIs, server-side recurrence and timezone-aware scheduling, notification queues, Stripe and RevenueCat billing, and managed-team billing. These are product systems with failure and recovery paths, not just endpoints around a model.",tech:"Fastify · MongoDB · JWT · BullMQ · Stripe · RevenueCat"},
      {id:"migration",title:"A new platform without starting users over.",outcome:"Moving to Blitzit 3.0 should preserve the work people have already put into the product.",how:"I built per-user migration from the legacy platform, with resumable imports, idempotent writes, and delta handling. Existing 3.0 edits take precedence where needed, and recurring task templates are handled separately from generated occurrences. Earlier work moved scheduling and recurrence responsibility from clients into the backend.",tech:"Legacy Firebase · MongoDB · resumable migration · idempotency"},
      {id:"reliability",title:"Failures that lead to the right next step.",outcome:"A revoked account, a rate limit, and a provider outage should not all look like the same broken feature.",how:"I worked on bounded retry decisions, integration diagnostics, notification delivery, instrumentation, and database connection pressure. I classify outcomes before retrying and keep durable state as the source of truth. The aim is to make recovery explainable as well as automatic.",tech:"Observability · error classification · backoff · database pools"},
    ],
  },
  {
    slug:"maddycustom",name:"MaddyCustom",role:"Co-founder & Lead Full-Stack Developer & AI Engineer",period:"Dec 2022 to Feb 2026",
    heading:"From a custom design to a delivered order.",
    introduction:"I co-founded MaddyCustom and built its original commerce platform from scratch in code. I wrote the storefront, backend business logic, admin tools, and AI assistant. This was a custom Next.js and MongoDB product, not a Shopify store.",
    ownership:"I wrote the application logic across the customer journey and the team’s operations: catalogue and variants, search, cart, offers, checkout, payment verification, orders, production files, inventory, shipping, analytics, and the shopping assistant. The storefront and separate admin app were built together around the way this business worked.",
    image:"/images/projects/maddycustom/storefront-original.webp",
    caption:"Original storefront components, run locally with public catalogue content.",
    proof:[{value:"100K+",label:"monthly users at the business"},{value:"~$62.4K USD",label:"annual business revenue (approx.)"},{value:"Custom-built",label:"storefront, backend, and admin"}],
    status:"Business figures are reported outcomes, not measurements from the demo. The main domain later moved to Shopify. This case study covers the original custom-built storefront and admin platform.",
    features:[
      {id:"commerce",title:"A storefront built around custom products.",outcome:"Buyers can find the right design and variant, understand their options, and carry those choices into checkout.",how:"I built the Next.js storefront around a category, specific-category, and variant hierarchy. Product search, recommendations, persisted cart state, custom offers, and partial-payment options support the needs of vehicle wraps and accessories. The backend models carry those choices through the order instead of losing them at checkout.",tech:"Next.js · React · Redux · MongoDB · Atlas Search"},
      {id:"payments",title:"Payments with a recovery plan.",outcome:"A gateway problem should have an alternative path, and a repeated callback should not mean a repeated order.",how:"I built Razorpay and PayU payment paths and health-aware provider selection. The chosen provider and decision metadata stay with the order for debugging. Server-side verification and guarded post-payment handling connect payment outcomes to stock, fulfillment, and conversion tracking. Split shipments and partial payments require totals to stay correct across the whole order.",tech:"Razorpay · PayU · webhooks · payment verification · MongoDB"},
      {id:"operations",title:"Software for the team behind every order.",outcome:"Production can get the right artwork, operations can track fulfillment, and support can see the context behind an order.",how:"I built a separate admin app for order operations, inventory, design search, production-template downloads, packaging, review moderation, offers, and department access. Shiprocket integration maps delivery events back into order state. Tax exports and shipment-aware payment totals connect the operational view to finance.",tech:"Next.js · Clerk · S3 · Shiprocket · role-based access"},
      {id:"analytics",title:"Know where customers get stuck.",outcome:"The team can follow the journey from a visit to payment, then investigate drop-offs and repeat purchases.",how:"I built first-party funnel events and sessions, event deduplication, UTM attribution, customer journey views, and admin comparisons. The dashboard includes funnel timing, drop-off analysis, and first-purchase categories that lead to repeat buyers. I also implemented Meta server-side conversion tracking, which was later disabled in the archived storefront.",tech:"Event ingestion · MongoDB aggregation · Recharts · Meta CAPI"},
      {id:"assistant",title:"An AI shopping assistant that can help you choose.",outcome:"Describe your car, your style, and your budget. The assistant can find matching products, continue the search, track an order, or help with a policy question.",how:"I built an OpenAI Agents SDK flow with classification and specialized data-query, retrieval, direct-answer, and human-handoff paths. Product and order tools use the app’s data, while policy answers use document retrieval. MongoDB-backed sessions keep the conversation together with bounded context and summarization.",tech:"OpenAI Agents SDK · tool calling · file search · MongoDB sessions"},
      {id:"ownership",title:"Engineering with the business in mind.",outcome:"The best technical decision is the one the team can operate and afford.",how:"I worked on image caching, serverless database pools, catalogue feeds, API reliability, and deployment costs as the product evolved. Owning the application code meant owning its maintenance and operating costs too. Building it taught me to balance control, maintenance, and the next stage of the business.",tech:"Vercel · AWS S3 / CloudFront · connection pooling · caching"},
    ],
  },
];
export const getWorkStory = (slug: string) => workStories.find((story) => story.slug === slug);
