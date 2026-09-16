import type { BlogPost } from "@/lib/blog";

export const oneToolLayerTwoAgents: BlogPost = {
  slug: "one-tool-layer-two-agents",
  title: "One tool layer, two agents",
  subtitle:
    "We needed an MCP server for external AI clients and an assistant inside the product. Writing those as two tool surfaces was the obvious move, and the wrong one.",
  excerpt:
    "Two agent surfaces, one set of tools. The interesting constraint was not sharing the code — it was sharing the permission model.",
  project: "Blitzit",
  date: "2026-09-16",
  readTime: "9 min",
  tags: ["AI", "Integrations", "Architecture"],
  featured: true,
  sections: [
    {
      heading: "Two surfaces, one product",
      paragraphs: [
        "Blitzit has an assistant inside the app, and an MCP server so people can point Claude or Cursor at their own tasks. Both are agents. Both need to read a task list, create a task, reschedule something, connect an integration, undo a mistake.",
        "The natural way to build that is twice. The MCP server gets tool definitions shaped for the protocol, the in-app assistant gets whatever its provider SDK wants, and each side calls into the service layer separately. It looks clean on a diagram, and it is the version I would have shipped if we had built both at once.",
        "We did not build both at once. The MCP server came first, then the assistant, and by then there was a set of tool definitions that already encoded a lot of hard-won detail — which fields a model tends to hallucinate, which descriptions stop it proposing a delete when the user said \"clear my afternoon\", which arguments need an explicit escape hatch. Re-deriving that for a second surface was obviously wasteful. So the assistant imported the MCP tool list instead.",
      ],
    },
    {
      heading: "What sharing actually means",
      paragraphs: [
        "There are four things a tool surface has to agree on, and code reuse only covers one of them.",
        "The schema is the easy part. The MCP tools declare their inputs as Zod schemas; the assistant's provider wants JSON Schema, so there is a converter and that is the end of it. The description is less obvious but more valuable — a tool description is a prompt, and it is the thing you spend real time tuning. Having two copies means tuning one and quietly regressing the other.",
        "The implementation is where sharing stops being a convenience. Every MCP tool delegates to one shared executor. The assistant routes through the same executor for the same tools, and only handles its own additions locally. That means a scheduling guard, an ownership check or a validation fix lands once and is true for both surfaces on the same deploy.",
        "The fourth is permissions, and it is the one that made the decision for me.",
      ],
      diagram: {
        title: "One executor, two surfaces",
        code: `flowchart TD
  M[MCP clients] --> D[Shared tool definitions]
  A[In-app assistant] --> D
  A --> X[Assistant-only tools]
  D --> E[Shared executor]
  X --> E
  E --> S[Operations layer]
  S --> J[Change journal]`,
      },
    },
    {
      heading: "A tool has to say what it will do",
      paragraphs: [
        "Every tool carries its own metadata: whether it only reads, whether it destroys something, whether calling it twice is the same as calling it once, and which scope a caller needs to hold. A read tool and a delete tool are not interchangeable to anything downstream — the client renders them differently, the connector review process asks about them separately, and the assistant uses the destructive flag to decide how much ceremony a step gets.",
        "If the two surfaces declare that metadata separately, they will drift, and the drift is silent. You do not find out that the assistant considers a tool harmless while MCP considers it destructive; you find out when someone's data is gone.",
        "Deriving both from one list removes the failure mode rather than documenting it. The destructive set is computed from the tool definitions. The scope requirement lives on the tool. Neither surface gets to have its own opinion.",
      ],
    },
    {
      heading: "The bug that proved the point",
      paragraphs: [
        "Before the executor was derived from the tool list, it had a hand-maintained set of names — a switch statement listing which tools it knew how to route. Someone added two restore tools to the definitions and not to the switch.",
        "The MCP server was fine. The assistant called them and got \"unknown tool\", because the tool existed, was advertised to the model, and had no route. The model was doing exactly the right thing and the surface underneath it had a hole.",
        "That class of bug does not announce itself. Nothing fails at build time, no test covers the pairing unless you thought to write it, and the only symptom is an agent that occasionally cannot do something it was told it could. The fix was one line — derive the set from the definitions instead of re-listing it — and it made the entire category impossible.",
        "The same reasoning later pulled undo and redo out of the assistant-only branch. They had been special-cased there, which meant MCP clients could not undo. There was no reason for that except history.",
      ],
      quote:
        "A hand-maintained copy of a list is a bug with a delay on it.",
    },
    {
      heading: "What stays surface-specific",
      paragraphs: [
        "Sharing is a default, not a rule. The assistant has three tools the MCP server does not, and the asymmetry is deliberate.",
        "One writes durable memory about the user. That is not something a third-party client should be able to do on their behalf, and the gating is enforced where the tool list is built rather than left to the caller.",
        "The other two are scheduling helpers: read the ranges the user has marked unavailable, read the current schedule. They exist because the assistant is expected to pick a time on the user's behalf, so it needs to look before it places something. An MCP client has its own model with its own context and does not need to be walked through that.",
        "Error handling differs too, for a good reason. When the shared executor rejects a write because it would land on blocked time, MCP gets an error — correct, and the client decides what to do. The assistant catches that same rejection and hands the model the structured conflict instead: which blocks are in the way, what the next free slot is. Same guard, same executor, but one surface can act on the detail and the other would only have to parse prose.",
      ],
    },
    {
      heading: "What I would carry to the next one",
      paragraphs: [
        "The tools are the API. Once a model can call into your product, the tool list is a public interface with a permission model attached, and it deserves the same discipline you would give an external API — one definition, one implementation, metadata that is derived rather than restated.",
        "The question to ask early is not \"can these two surfaces share code\". It is \"what happens when they disagree\". If the answer is a silent permission mismatch, share the layer. If the answer is that one surface gets a slightly worse error message, let them differ.",
      ],
    },
  ],
};
