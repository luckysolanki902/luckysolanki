/** Public capabilities grounded in the two work stories. */
export const buildFocus = [
  {
    kind: "ai", label: "AI engineering", title: "An assistant people can actually use.",
    description: "Voice, chat, or a shopping assistant. I connect the conversation to your product’s data and actions, with clear permissions and useful answers.",
    project: "Blitzit + MaddyCustom", proof: "Blitzy’s voice and reasoning agents share one action layer. MaddyCustom’s assistant finds products, remembers search context, and helps with orders.", href: "/work/blitzit#voice", linkLabel: "Explore the voice system", secondHref: "/work/maddycustom#assistant", secondLabel: "Meet the shopping assistant",
  },
  {
    kind: "backend", label: "Backend engineering", title: "A backend your product can grow on.",
    description: "From the first API to the jobs running behind it. I design clear modules, connect the data and events, and build recovery paths for payments, integrations, and AI actions.",
    project: "Blitzit + MaddyCustom", proof: "Blitzit 3.0’s entire backend, built from scratch with domain modules, a typed event bus, and API/worker roles. Payment and order operations at MaddyCustom.", href: "/work/blitzit#architecture", linkLabel: "Explore the backend architecture", secondHref: "/work/maddycustom#payments", secondLabel: "Explore payment handling",
  },
  {
    kind: "product", label: "Full-stack ownership", title: "From the first screen to daily operations.",
    description: "I can take responsibility across the interface, APIs, and internal tools, so the product works for your customers and the people running it.",
    project: "MaddyCustom", proof: "MaddyCustom’s original platform was built from scratch in code: storefront, backend logic, admin tools, and an AI assistant. Product choices connected all the way through to production and delivery.", href: "/work/maddycustom#commerce", linkLabel: "Explore the storefront", secondHref: "/work/maddycustom#operations", secondLabel: "See the operational side",
  },
] as const;
