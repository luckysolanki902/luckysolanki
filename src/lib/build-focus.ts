/** Public capabilities grounded in the two work stories. */
export const buildFocus = [
  {
    kind: "ai", label: "AI engineering", title: "An assistant people can actually use.",
    description: "Voice, chat, or a shopping assistant. I connect the conversation to your product’s data and actions, with clear permissions and useful answers.",
    project: "Blitzit + MaddyCustom", proof: "Blitzy’s voice and reasoning agents share one action layer. MaddyCustom’s assistant finds products, remembers search context, and helps with orders.", href: "/work/blitzit#voice", linkLabel: "Explore the voice system", secondHref: "/work/maddycustom#assistant", secondLabel: "Meet the shopping assistant",
  },
  {
    kind: "backend", label: "Backend engineering", title: "The details that keep it working.",
    description: "A payment arrives twice. A provider disconnects. An AI changes the wrong task. I build the checks and recovery paths around the happy path.",
    project: "Blitzit + MaddyCustom", proof: "Reversible AI changes, bidirectional provider sync, payment verification, fulfillment, and background jobs that can recover.", href: "/work/blitzit#undo", linkLabel: "See reversible AI actions", secondHref: "/work/maddycustom#payments", secondLabel: "Explore payment handling",
  },
  {
    kind: "product", label: "Full-stack ownership", title: "From the first screen to daily operations.",
    description: "I can take responsibility across the interface, APIs, and internal tools, so the product works for your customers and the people running it.",
    project: "MaddyCustom", proof: "A custom storefront, AI product discovery, checkout, production tools, shipping, and funnel analytics. Built while co-founding the business.", href: "/work/maddycustom#commerce", linkLabel: "Explore the storefront", secondHref: "/work/maddycustom#operations", secondLabel: "See the operational side",
  },
] as const;
