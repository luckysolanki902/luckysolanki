import type { BlogPost } from "@/lib/blog";

export const spyllAnonymousCollegeNetwork: BlogPost = {
  slug: "spyll-anonymous-college-network",
  title: "Building trust into an anonymous college network",
  subtitle:
    "Spyll combined verified student access with anonymous posts, confessions, polls, realtime chat, random connect, moderation, notifications, and admin tools.",
  excerpt:
    "Anonymous college products live on a thin line. Students need freedom, and the system still has to stay safe enough to use tomorrow.",
  project: "Spyll",
  date: "2026-07-08",
  readTime: "9 min",
  tags: ["Social", "Operations"],
  sections: [
    {
      heading: "Anonymity creates its own backend requirements",
      paragraphs: [
        "Spyll was for college students who wanted to say things they would not put under their real name. Crushes, doubts, confessions, questions, awkward honesty. The product only works if people feel protected. It also falls apart if the system cannot handle abuse.",
        "That pushed a lot of responsibility into the backend: verified colleges, student onboarding, feed ranking, confessions, reports, warnings, bans, realtime group chat, random connect, push notifications, billing limits, and admin moderation.",
      ],
    },
    {
      heading: "The trust loop",
      diagram: {
        title: "Spyll trust loop",
        code: `flowchart LR
  Student[Verified student] --> Action[Post / poll / chat]
  Action --> Feed[Campus feed]
  Feed --> Signal[Reports + reactions]
  Signal --> Mod[Moderation tools]
  Mod --> Limits[Warnings / bans / controls]
  Limits --> Feed`,
      },
    },
    {
      heading: "Where the hard parts met",
      paragraphs: [
        "Realtime features and safety features touched the same data. A random-connect room needed matching, heartbeats, billing rules, block safety, and push reactivation. A feed needed ranking and moderation. Notifications needed to bring people back without training them to ignore the app.",
        "That is what made Spyll interesting to build. The social surface looked simple. The system underneath had to keep the room usable.",
      ],
    },
    {
      heading: "Verification was the first trust layer",
      paragraphs: [
        "The product promised college anonymity, so the account layer had to know the user belonged to a real student community. Verification photos, college records, manual review, and admin approval became part of the product's safety model.",
        "That separation is important. The public identity can stay hidden while the platform still knows the account is accountable.",
      ],
    },
    {
      heading: "Random connect needed more than matching",
      paragraphs: [
        "Random connect sounds like a simple queue: put users in, pair two users, open a room. The real version needed Redis queue state, locks around pairing, room finalization, heartbeats, billing or usage limits, block checks, push reactivation, and cleanup when users disappeared.",
        "A matching feature feels broken if it pairs badly, charges wrong, leaves dead rooms around, or lets blocked users collide again. The backend had to own all of that.",
      ],
    },
    {
      heading: "Notifications were growth and product quality",
      paragraphs: [
        "Spyll had FCM workers, broadcast queues, smart notification logic, and acquisition tracking. Push can bring people back. It can also make them mute the app. The system had to decide what was worth sending and keep enough analytics to learn from it.",
      ],
    },
  ],
};
