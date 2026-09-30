# Pip chat

Pip calls the server-only `/api/buddy` route. It uses the Responses API with
`gpt-5-nano`, minimal reasoning, streamed text, and a 1,200-token output cap.
No API credentials are included in client bundles. Responses use `store: false`.
With visit memory enabled, recent redacted questions and short answers expire after 30 days.

Context contains public profile, experience, projects, skills and the blog index.
The current blog article is included in full; homepage requests include the
visible project and section, with up to two relevant articles. The most recent
four exchanges accompany each request. Page source is assembled on the server,
not accepted as trusted instructions from the browser. Replies use simple copy
and remove em dashes before display.

## Configuration

- `OPENAI_API_KEY`: Set a real key in the Vercel project's Production environment.
  Missing or placeholder credentials intentionally use the local site-answer fallback.
- `OPENAI_MODEL`: Defaults to `gpt-5-nano`. If changing model families, verify
  support for the configured minimal reasoning and low verbosity parameters.
- `MONGODB_URI` and `MONGODB_DATABASE`: Existing project database settings.
- `PIP_DAILY_LIMIT`: Shared daily request cap, default 500. Per-visitor cap is
  30 requests/hour. MongoDB atomic counters share limits across instances, use
  hashed IP identifiers, and expire after two days. Rate limiting fails closed.

After changing Vercel environment variables, redeploy for them to take effect.
The backend creates a TTL index on `buddy_rate_limits` when AI is first enabled.
Requests have a 16 KB body limit, a 600-character question limit, a 22-second
upstream deadline, and no automatic paid retries. Missing keys, provider errors,
rate limits, network errors and interrupted streams return a labelled local answer.
Changing routes cancels the browser request and upstream generation.

## Verification

Run `npm run test:buddy`, `npx tsc --noEmit`, and `npm run build`.
The API tests mock OpenAI. A valid key is needed to test real model quality and latency.

## Project deck

Project images are prebuilt 1,200px WebP assets and preloaded in the page head.
No on-demand image transformation is required for these six assets. Original
files remain available for future edits. Project and experience copy is visible
without intersection-triggered delays. Deck motion uses one scheduled animation
frame, cached groups and size checks, and transform-only updates on card surfaces.

## Proactive companion and first-party memory

Pip reacts immediately to scrolls, reading, article completion, project browsing,
resume/contact clicks and returning to a tab. A separate GPT call decides whether
to show a short contextual suggestion while chat is closed. The popup never
opens chat automatically. Suggestions are dismissed with ×, have a 45-second
client cooldown and 40-second server cooldown, and are capped at six per visit.
Focused inputs, hidden tabs, open chat and changed context suppress stale popups.
System reduced-motion preferences still apply. There is no quiet toggle or heart.

`/api/buddy/activity` receives cumulative snapshots every 20 seconds while active,
plus page/visibility changes. It never records pointer trails or form keystrokes.
Active reading time stops in hidden tabs and after 90 seconds without interaction.
A visit ends after 30 minutes of inactivity. Visits are tracked per signed browser
cookie; a keyed IP hash provides an approximate network count, not a person ID.
Shared IPs never share histories. `PIP_IDENTITY_SECRET` signs cookies and hashes IPs.
Raw IPs and visitor IDs are excluded from GPT context. Site text explains memory
at `/privacy`; DNT/GPC disable persistent memory. Forget my visits deletes the
browser's saved activity and disables future persistence. Requests already in flight
are cancelled, with a short-lived revocation marker to stop late chat writes.

MongoDB collections `pip_visits`, `pip_pages`, and `pip_conversations` expire after
30 days. Page snapshots hold cumulative durations, progress and a bounded event
trail. GPT receives up to 16 recent pages, five visit timestamps, six redacted
question/answer pairs and the current page snapshot. This is an approximate
behavioral summary, not a claim about someone's identity or intentions.

Run `node scripts/pip-funnel.mjs` locally for an aggregate funnel report. It prints
visit and returning-browser counts, engagement time, projects/details viewed,
questions, resume opens, contact clicks and accepted suggestions. Counts describe
observed actions, not completed leads. No public analytics endpoint exists.

## Immediate companion reactions

Local speech is separate from GPT suggestions. Section/project arrival, fast scrolling,
page milestones, project expansion, resume/contact/social clicks, copying, theme changes,
and tab returns can speak without a network request. Casual comments have a 12-second
spacing, direct actions 1.2 seconds, and the same line cannot repeat within 45 seconds.
Dismissing a bubble pauses local speech for 20 seconds. The six-suggestion AI budget
does not silence local reactions. New interactions invalidate pending AI popups, and
responses for a previous section or project are discarded. Copy reactions never read
the clipboard or selected text.
