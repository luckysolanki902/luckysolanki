export const columns = [
  {
    name: "Backend",
    color: "#62d0fa",
    icon: "▤",
    items: [
      {
        title: "A new foundation",
        text: "Designed and built the Blitzit 3.0 backend in TypeScript and Fastify, with domain modules, validation, authentication, and a typed event bus.",
      },
      {
        title: "Work that keeps running",
        text: "Separated API and worker runtimes. Background queues, recurring tasks, reminders, and retries can run independently of an open desktop app.",
      },
      {
        title: "A careful migration",
        text: "Built resumable, per-user migration from 2.0 to 3.0, accounting for existing lists, recurring tasks, and edits made in the new product.",
      },
    ],
  },
  {
    name: "Integrations",
    color: "#a499ff",
    icon: "⇄",
    items: [
      {
        title: "A shared integration framework",
        text: "Built a plugin architecture for provider authentication, field mapping, and sync, instead of repeating provider logic across routes and workers.",
      },
      {
        title: "Two-way sync",
        text: "Worked on integrations including Asana, Notion, Google Calendar, and other task providers. Changes need to survive retries and partial failures.",
      },
      {
        title: "Useful failure states",
        text: "Distinguished expired access, throttling, missing resources, and provider outages so each can have an appropriate retry or recovery path.",
      },
    ],
  },
  {
    name: "AI tools",
    color: "#7edbc0",
    icon: "✧",
    items: [
      {
        title: "One set of product tools",
        text: "Built shared tool definitions and execution for the in-app agent and external MCP clients, with the same validation and permission model.",
      },
      {
        title: "Reversible actions",
        text: "Designed a per-user change journal so product mutations can be undone without silently overwriting newer changes.",
      },
      {
        title: "Context that carries forward",
        text: "Worked on agent memory, personalization, and product context so the assistant can act on the work already in the application.",
      },
    ],
  },
  {
    name: "Voice",
    color: "#efc48b",
    icon: "≋",
    items: [
      {
        title: "Voice, connected to the product",
        text: "Built a realtime speech layer connected to the same reasoning agent and scoped tools used by typed chat.",
      },
      {
        title: "“Hey Blitzy”",
        text: "Trained a custom wake-word classifier and integrated local ONNX inference, followed by a short transcription check for candidate detections.",
      },
      {
        title: "A clear conversation state",
        text: "Worked on microphone handoff, interruption handling, and a responsive voice orb. These are engineering contributions, not claims about release availability.",
      },
    ],
  },
];
