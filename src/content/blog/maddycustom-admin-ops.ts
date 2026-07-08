import type { BlogPost } from "@/lib/blog";

export const maddycustomAdminOps: BlogPost = {
  slug: "maddycustom-admin-ops",
  title: "The admin dashboard that ran MaddyCustom",
  subtitle:
    "Orders, designs, production templates, repeat buyers, funnel events, RTO, inventory, tax exports, access control, and the ordinary work of keeping a custom-commerce business moving.",
  excerpt:
    "The storefront took orders. The admin dashboard helped the team understand what needed to happen after that.",
  project: "MaddyCustom",
  date: "2026-07-08",
  readTime: "10 min",
  tags: ["Commerce", "Operations"],
  sections: [
    {
      heading: "The order is only the start",
      paragraphs: [
        "MaddyCustom sold custom vehicle stickers and wraps. A customer could choose a product, customize it, pay, and leave. The team still had to produce the right file, track the order, handle inventory, ship it, watch returns, answer support, and understand where buyers were dropping off.",
        "That is why the admin app mattered so much. It became the place where marketing, production, support, and operations saw the same business from different angles.",
      ],
    },
    {
      heading: "The operating surface",
      paragraphs: [
        "The admin app had analytics dashboards, customer journey views, abandoned cart users, repeat buyer analytics, order lists, production template downloads, design group management, product and coupon controls, inventory orders, packaging boxes, RTO analytics, tax CSV exports, and access management.",
        "A dashboard like that is full of small decisions. Load heavy charts only when needed. Keep stale responses from winning. Show skeletons while sections load. Make downloads match production reality. Give support enough customer context to answer quickly.",
      ],
      diagram: {
        title: "MaddyCustom operations loop",
        code: `flowchart LR
  Storefront[Storefront order] --> Admin[Admin dashboard]
  Admin --> Designs[Design/template files]
  Admin --> Analytics[Funnel + repeat buyers]
  Admin --> Inventory[Inventory + packaging]
  Admin --> Shipping[Shipping + RTO]
  Admin --> Support[Customer support]
  Analytics --> Storefront`,
      },
    },
    {
      heading: "What I learned",
      paragraphs: [
        "Custom commerce needs software after checkout. The buyer sees a simple product page. The team needs a control plane that knows what was sold, what has to be made, what is stuck, and what the next customer will probably do. That is the part I ended up caring about most.",
      ],
    },
    {
      heading: "Analytics had to be operational",
      paragraphs: [
        "The analytics dashboard was not built for vanity charts. The team needed to understand source quality, carts, repeat orders, time to purchase, revisit timing, abandoned users, coupon behavior, and which products were doing real work. Those answers changed what the team promoted and what they fixed.",
        "Heavy dashboard pages can become sluggish quickly. I used lazy sections, request sequence guards, abort controllers, debounced filters, no-cache fetch helpers, skeleton loading, and chart error boundaries. That sounds like frontend plumbing until the owner is switching date ranges during a sale and needs the numbers to stop lying.",
      ],
    },
    {
      heading: "Production templates were its own product",
      paragraphs: [
        "The template downloader mattered because custom orders are physical work. A wrong file can waste material and time. The system had to pull order data, customer choices, design groups, product variants, and production-ready assets into downloads that the team could actually use.",
        "That kind of feature sits between software and the shop floor. It is easy to underestimate until one missing field makes a production person open three tabs and message someone for clarification.",
      ],
    },
    {
      heading: "Access control kept the system usable",
      paragraphs: [
        "The admin app had pages for roles, path access, departments, productivity, support, RTO, analytics, and downloads. Different people needed different surfaces. A support person does not need every product-management control. A production person does not need analytics experiments in their way.",
        "The access model made the dashboard feel like a tool for the team. Nobody had to work inside one giant owner-only panel.",
      ],
    },
  ],
};
