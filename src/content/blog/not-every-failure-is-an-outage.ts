import type { BlogPost } from "@/lib/blog";

export const notEveryFailureIsAnOutage: BlogPost = {
  slug: "not-every-failure-is-an-outage",
  title: "Not every failure is an outage",
  subtitle:
    "Two deleted calendars generated thousands of retries and 502s over a weekend. Nothing was down. We had just given every upstream failure the same name.",
  excerpt:
    "A provider 404 and a provider 500 are not the same event. Collapsing them into one error is how a permanent, user-fixable problem becomes an infinite retry.",
  project: "Blitzit",
  date: "2026-09-16",
  readTime: "8 min",
  tags: ["Integrations", "Reliability", "Backend"],
  featured: true,
  sections: [
    {
      heading: "The symptom",
      paragraphs: [
        "An integration sync started filling the logs. Thousands of errors, hundreds of 502s going back to clients, all from two Google Calendar connections, over a couple of days. The obvious read is a provider incident.",
        "Google was fine. The two calendars had been deleted. Every sync attempt asked for a resource that no longer existed, got a 404, and our code did what it did with every upstream failure: reported that the provider could not be reached, returned a 502, and let the job retry.",
        "A 502 says \"try again later\". A deleted calendar will never come back. So we retried it, on schedule, forever, and told the user nothing they could act on.",
      ],
    },
    {
      heading: "One error for everything is a design decision",
      paragraphs: [
        "The original handling was not careless — it was just undifferentiated. Any rejection from a provider became one internal error type with one HTTP status. That is true often enough to feel fine. It is true of a provider outage, and it is false of almost everything else.",
        "Think about what an integration can actually be told by an upstream API. The grant is dead because the user revoked it. The resource is gone because they deleted it. You are being throttled. The provider genuinely broke. Or something came back that we have no rule for.",
        "Those five things want completely different responses. Two are permanent and need a human. One is transient and wants backoff. One is transient and wants an alert. One is a bug in our own mapping code. Giving them one name means the system cannot behave differently, because it does not know they are different.",
      ],
    },
    {
      heading: "A bounded outcome set",
      paragraphs: [
        "The fix was to classify the rejection before anything else looks at it, into a small closed set of outcomes — auth expired, collection unavailable, rate limited, upstream 5xx, unexpected — carrying the provider's status alongside.",
        "Two properties of that set matter more than the specific names.",
        "It is bounded. These outcomes end up as metric labels, and every distinct label value is a stored time series. Widening the set with a vendor message string would turn one metric into thousands of them. A failure taxonomy that can absorb arbitrary upstream text is not a taxonomy, it is a cardinality bomb.",
        "And it classifies from the provider's status code, not from its message. Our HTTP client attaches the status to every upstream rejection, so classification reads the provider's own structured answer. An error with no status did not come from the provider at all — it is our bug — and it lands in the unexpected bucket rather than being quietly filed as someone else's fault.",
      ],
      codeBlock: {
        title: "Classification, top of the funnel",
        language: "typescript",
        code: `export type UpstreamOutcome =
  | 'auth_expired'            // grant revoked — user must reconnect
  | 'collection_unavailable'  // resource gone — user must reselect
  | 'rate_limited'            // transient, back off
  | 'upstream_5xx'            // transient, their fault
  | 'unexpected';             // no rule for this — treat as ours

export function classifyUpstreamError(error: unknown): ClassifiedUpstreamError {
  const status = statusOf(error);
  if (status === undefined) return { outcome: 'unexpected' };
  if (status === 401 || status === 403) return { outcome: 'auth_expired', status };
  if (status === 404) return { outcome: 'collection_unavailable', status };
  if (status === 429) return { outcome: 'rate_limited', status };
  if (status >= 500) return { outcome: 'upstream_5xx', status };
  return { outcome: 'unexpected', status };
}`,
      },
    },
    {
      heading: "Naming the thing you cannot distinguish",
      paragraphs: [
        "One of these names took longer to settle than the rest. Google returns 404 both for a calendar that no longer exists and for one this grant is no longer allowed to see. The API gives us nothing to tell those apart.",
        "The temptation is to pick the likelier one and name it that. Calling it \"deleted\" would be a guess we then show to a user who can see the calendar sitting in their sidebar.",
        "So the outcome is called collection unavailable, which deliberately claims neither. It says what we actually know — this connection cannot reach this resource, and that will stay true until a person does something — and stops there. Naming a state after what you can prove, rather than after your best guess, is worth the slightly worse name.",
      ],
      quote:
        "If the provider cannot tell you which of two things happened, do not let your type system claim it knows.",
    },
    {
      heading: "Three decisions fall out of one classification",
      paragraphs: [
        "Once the outcome is known, everything downstream stops guessing.",
        "The HTTP status becomes meaningful. A dead grant returns 409, which the client already reads as \"reconnect this account\". A gone resource returns 410 — the resource is absent and expected to stay absent, which is exactly the case. It is deliberately not 404, because that route already uses 404 for \"integration not connected\", and deliberately not 409, because reconnecting an account and reselecting a calendar are different fixes and sending the user to the wrong one wastes their time. Throttles and provider faults stay 502 and remain distinguishable through the outcome in the body.",
        "The retry decision becomes correct. Transient outcomes retry with backoff. Permanent ones stop, mark the connection, and wait for a human. That alone removed the loop that produced the original flood.",
        "And exception capture gets quiet enough to be useful. A revoked grant, a deleted calendar and a throttle are things the world does to us — capturing them buries the faults we can actually fix. Only provider faults and unclassified outcomes get captured. The noise drops, and what is left is real.",
      ],
      table: {
        headers: ["Outcome", "Status", "Retry", "Capture", "User action"],
        rows: [
          ["auth_expired", "409", "No", "No", "Reconnect the account"],
          ["collection_unavailable", "410", "No", "No", "Reselect the resource"],
          ["rate_limited", "502", "Yes, backoff", "No", "None"],
          ["upstream_5xx", "502", "Yes, backoff", "Yes", "None"],
          ["unexpected", "502", "Yes, backoff", "Yes", "None — it is our bug"],
        ],
      },
    },
    {
      heading: "The general shape",
      paragraphs: [
        "This is not really a calendar story. Any system that depends on an API it does not own will eventually have to answer the same question: is this failure mine, theirs, or the user's, and is it going to fix itself?",
        "Retry counts, backoff curves and dead-letter queues all assume you have already answered that. They are machinery for handling transient failure, and they do real damage when pointed at a permanent one — an infinite retry against a deleted resource is not resilience, it is a busy loop with logging.",
        "So the first thing I build into an integration now is the classifier, not the retry policy. Decide what the failure means, in a small set of names you chose on purpose. The retry behaviour, the status code, the alerting and the message the user sees are all downstream of that one decision, and all of them are wrong if it is missing.",
      ],
    },
  ],
};
