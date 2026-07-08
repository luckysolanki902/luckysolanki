import type { BlogPost } from "@/lib/blog";

export const blitzitIntegrationPluginSystem: BlogPost = {
  slug: "blitzit-integration-plugin-system",
  title: "The integration plugin system behind Blitzit",
  subtitle:
    "Provider work got cleaner when OAuth, credentials, webhooks, collection browsing, outbound sync, retries, and lifecycle had one shared SDK.",
  excerpt:
    "Every provider had its own habits. The plugin system gave Blitzit one way to host those differences.",
  project: "Blitzit",
  date: "2026-07-08",
  readTime: "10 min",
  tags: ["Backend", "Integrations"],
  sections: [
    {
      heading: "Provider code grows sideways",
      paragraphs: [
        "Asana, ClickUp, Google, Notion, Todoist, Trello. Each one arrives with a slightly different idea of OAuth, webhooks, lists, completion, deletion, pagination, rate limits, and refresh tokens. After a few providers, the backend starts collecting little private languages.",
        "I wanted each provider file to contain provider knowledge. I did not want every provider to rebuild auth storage, event routing, queue jobs, health checks, webhook renewal, and loop prevention.",
      ],
    },
    {
      heading: "The SDK shape",
      paragraphs: [
        "The plugin declares identity, capabilities, OAuth config, collection fetching, inbound webhook handling, outbound task mapping, and lifecycle hooks. The platform owns encrypted credentials, route wiring, sync queues, retries, registration, health, and shutdown.",
        "That let provider differences stay visible. A provider can implement only what it supports. The platform still knows how to host it.",
      ],
      diagram: {
        title: "Integration plugin flow",
        code: `flowchart LR
  Task[Task operation] --> Event[Domain event]
  Event --> Queue[Integration queue]
  Queue --> SDK[Integration SDK]
  SDK --> Plugin[Provider plugin]
  Plugin --> Provider[Asana / ClickUp / Google]
  Provider --> Inbound[Webhook / pull]
  Inbound --> SDK
  SDK --> Ops[Task operations]`,
      },
    },
    {
      heading: "The useful part",
      paragraphs: [
        "A new provider became a bounded piece of work. The scary parts were still there. They had places to go. Webhooks went through the inbound path. Task changes went through outbound sync. OAuth lived in the shared auth flow. Retry behavior lived in queues.",
        "That is the kind of abstraction I like. It does not hide the mess. It gives the mess a room.",
      ],
    },
    {
      heading: "What the plugin had to declare",
      paragraphs: [
        "A provider definition starts with identity and capabilities. Does it use OAuth? Can it fetch collections? Can it receive webhooks? Can Blitzit push task changes outward? Does it need subscription renewal? Those answers shape what the platform wires up.",
        "The plugin then implements the provider-specific pieces: OAuth config, token refresh, collection fetching, external-to-task mapping, task-to-external mapping, webhook verification, inbound handling, and health checks. The shared SDK handles the surrounding choreography.",
      ],
      codeBlock: {
        title: "Provider definition shape",
        language: "ts",
        code: `IntegrationPlugin {
  id
  name
  capabilities
  getOAuthConfig()
  refreshToken()
  fetchCollections()
  mapExternalToTask()
  mapTaskToExternal()
  verifyWebhookSignature()
  handleWebhook()
  subscribeWebhook()
  renewWebhookSubscriptions()
}`,
      },
    },
    {
      heading: "Outbound sync",
      paragraphs: [
        "When a task changes in Blitzit, the core task operation emits a domain event. The integration event handler decides which connected providers care about that event, then places work on the integration queue. A worker picks it up, loads credentials, refreshes tokens if needed, maps the task into the provider's shape, and calls the provider API.",
        "That queue boundary matters. A user dragging a task to Today should not wait on a provider API. Provider sync can fail, retry, and back off in the background. The user's local action stays fast.",
      ],
    },
    {
      heading: "Inbound sync",
      paragraphs: [
        "Inbound webhooks are the other half. Provider payloads arrive with their own signatures and formats. The SDK lets the provider plugin verify the signature, parse the event, map it into Blitzit task changes, and send those changes through the same operations layer as everything else.",
        "That last part is easy to skip and expensive later. If inbound sync writes directly to Mongo, it bypasses ownership rules, history, realtime, and loop prevention. In 3.0, the provider path feeds the product path.",
      ],
    },
    {
      heading: "Loop prevention",
      paragraphs: [
        "Sync systems love to echo. Blitzit updates a task, the provider sends a webhook back, Blitzit sees the provider change, and now the same update can bounce forever if no one marks where it came from.",
        "The integration layer carries sync metadata so outbound changes and inbound echoes can be recognized. It is one of those small pieces that rarely appears in the UI and saves the backend from strange duplicate behavior.",
      ],
    },
  ],
};
