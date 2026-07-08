import type { BlogPost } from "@/lib/blog";

export const avanaInvestmentResearchAssistant: BlogPost = {
  slug: "avana-investment-research-assistant",
  title: "Building Avana like a research desk",
  subtitle:
    "A Bali real-estate assistant needed user context, documents, land data, subscriptions, news, admin tools, and a way to answer investor questions with grounded context.",
  excerpt:
    "Avana had to help investors ask better questions before they reached a broker, lawyer, or developer.",
  project: "Avana",
  date: "2026-07-08",
  readTime: "10 min",
  tags: ["AI", "Research"],
  sections: [
    {
      heading: "Investor questions carried layers",
      paragraphs: [
        "A Bali property question usually carries five other questions inside it. Leasehold terms, ownership structures, zoning, taxes, permit risk, rental assumptions, location demand, nearby projects. If the assistant answered from a thin prompt, it would feel thin.",
        "Avana needed the shape of a research desk. User goals from onboarding. Conversation history. Documents in vector search. Land and project data. News. Subscription rules. Admin workflows for keeping the knowledge base useful.",
      ],
    },
    {
      heading: "How the assistant was held together",
      paragraphs: [
        "The chat route did more than pass messages to a model. It checked Clerk auth, found or created the user, enforced onboarding, checked trial and subscription access, loaded user context, applied prompt limits, streamed the answer, and preserved conversation state. The admin side handled documents, vector store operations, news approval, users, pricing, and subscription controls.",
      ],
      diagram: {
        title: "Avana answer path",
        code: `flowchart TD
  User[Investor question] --> Auth[Auth + access check]
  Auth --> Context[Onboarding + user memory]
  Context --> Agent[Assistant]
  Agent --> Docs[Vector documents]
  Agent --> Land[Land/project data]
  Agent --> News[News context]
  Admin[Admin knowledge ops] --> Docs
  Admin --> News
  Billing[Plans + trial] --> Auth`,
      },
    },
    {
      heading: "The part that matters",
      paragraphs: [
        "The useful work was around the assistant. A model can produce fluent real-estate language easily. The product needed access rules, better context, clean documents, admin control, and answers that understood what kind of investor was asking. That is where the system became real.",
      ],
    },
    {
      heading: "The gate before the answer",
      paragraphs: [
        "The chat route had to decide whether the user should even reach the assistant. It checked Clerk auth, then the application user record, then onboarding, then trial and subscription state. The route returned specific codes like CARD_VERIFICATION_REQUIRED, TRIAL_EXPIRED, SUBSCRIPTION_INACTIVE, or NO_SUBSCRIPTION so the UI could send the user to the right place.",
        "That matters in a paid AI product. A vague 403 turns into support noise. A specific gate turns into product flow.",
      ],
    },
    {
      heading: "The admin app carried the knowledge base",
      paragraphs: [
        "Avana had an admin side for documents, vector-store operations, news scraping and approval, users, subscriptions, pricing plans, onboarding questions, and knowledge controls. The assistant could only answer well if the material behind it stayed clean.",
        "This is the part people skip in demos. They show a chat box. The real work is deciding who can upload documents, which files are active, what news gets published, how stale knowledge is handled, and how admins recover when a bad source gets in.",
      ],
    },
    {
      heading: "Why Bali real estate needed tools",
      paragraphs: [
        "A lot of investor questions need local context. Ownership structures, HGB, PMA, nominee risk, zoning, permits, tax, flood or tsunami exposure, area demand. Some of that can live in documents. Some of it belongs in structured land/project data and tool calls.",
        "That is why the assistant had to be more than conversation history. It needed retrieval, user context, and live data surfaces around the model.",
      ],
    },
  ],
};
