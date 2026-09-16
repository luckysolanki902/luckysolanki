import type { BlogPost } from "@/lib/blog";

export const retriesNeedASourceOfTruth: BlogPost = {
  slug: "retries-need-a-source-of-truth",
  title: "A retry is not a second try",
  subtitle:
    "What an OAuth refresh race taught me about background work: the useful question is not whether a job can retry, but who is allowed to change shared state.",
  excerpt:
    "Retries are easy to add. Making several workers retry the same thing without fighting each other is the real job.",
  project: "Blitzit",
  date: "2026-09-16",
  readTime: "6 min",
  tags: ["Backend", "Reliability"],
  featured: true,
  sections: [
    {
      heading: "The bug did not look like a retry problem",
      paragraphs: [
        "An integration token expires. A worker notices it while syncing. At almost the same moment, a webhook job and a scheduled job notice it too. Each job is doing the reasonable thing: refresh the token, save the new value, and continue.",
        "That is exactly how a small race becomes a production problem. One refresh can invalidate another. One worker can save an older value after another worker has already saved the new one. The jobs do not know they are collaborating, so they behave like rivals.",
      ],
    },
    {
      heading: "Retries need an owner",
      paragraphs: [
        "My first instinct with background work is usually to ask about backoff, retry count, and dead-letter queues. Those matter. They were not the first question here.",
        "The first question was: which worker owns the right to refresh this credential? Once that was clear, the shape became simpler. One worker acquires a short-lived lock. It refreshes and stores the credential. The others wait briefly, then read the result instead of starting another refresh.",
      ],
      diagram: {
        title: "One refresh, many jobs",
        code: `flowchart LR
  A[Sync worker] --> L{Refresh lock}
  B[Webhook worker] --> L
  C[Scheduled worker] --> L
  L -->|one owner| R[Refresh and persist]
  R --> T[Updated credential]
  L -->|other workers| T`,
      },
    },
    {
      heading: "The lock is only half the design",
      paragraphs: [
        "A lock without a timeout can turn one crashed worker into a permanent outage. A lock with no re-read path just moves the race somewhere else. And a refreshed credential should only replace the current value when the write is still valid for that connection.",
        "The practical pattern is small: bounded lock, refresh once, persist deliberately, release, and let waiters load the resulting state. If the owner fails, the next job can try after the lease ends. No worker has to guess whether another one succeeded.",
      ],
    },
    {
      heading: "Why this matters beyond OAuth",
      paragraphs: [
        "The same shape appears everywhere. A payment callback, a webhook delivery, a scheduled sync, an AI action, and a manual retry can all try to update the same record. Retrying the HTTP request is the easy part. Deciding whether the state transition is still safe is the engineering work.",
        "That is why I like queues, locks, idempotency keys, and version checks together. None of them is a magic reliability feature. They are ways to make the system answer one question clearly: who gets to make this change now?",
      ],
    },
    {
      heading: "The lesson I kept",
      paragraphs: [
        "A retry is not a second try. It is another actor arriving later, with partial knowledge of what happened before. Treat it that way and the design gets calmer: make ownership explicit, make state transitions conditional, and give failed work a safe path back in.",
      ],
    },
  ],
};
