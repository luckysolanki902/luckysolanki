# Work-story screenshot provenance

Updated October 1, 2026. The published app screenshots are original captures, encoded as WebP. Borders, backgrounds and enlargement controls are CSS. No app interface is regenerated with AI.

Two earlier imagegen presentation edits were rejected because a Blitzit control was altered. Both generated covers have been removed from the portfolio assets. The original screenshots replace them.

## Blitzit

The frontend and backend run locally against isolated MongoDB and Redis instances, with sample tasks, names, time sessions and notifications. No external providers are connected. The source repositories are not modified for the screenshots.

Ten distinct app screenshots: `board-clean`, `integrations`, `notifications`, `calendar`, `memory`, `voice-preferences`, `list-context`, `reports`, `sessions`, `search` in `public/images/projects/blitzit/`.

`orb-preview.webp` is an additional screenshot of the original `BlitzyOrb` and `orb-model` implementation rendered in an isolated presentation wrapper. The state is explicitly set to listening. It is not a live call or a capture of the native floating desktop window. No microphone or model connection is involved. Temporary preview source: `/tmp/portfolio-orb-preview`.

`orb-states.webp` is the original implementation design study from the source repository. It is labelled as a design study and does not count toward the ten application screenshots.

Voice backend changes are merged. The complete frontend voice experience remains in review as of this source audit.

## MaddyCustom

Ten distinct captures in `public/images/projects/maddycustom/`:

- `storefront-original`: original storefront components, run locally with public catalogue assets.
- `plp`, `pdp`, `cart`, `track-order`, `assistant`: original repository README captures, from `maddycustom-production/public/images/githubss/`.
- `category`, `support`, `recommendations`: captured from the publicly accessible original storefront at maddycustom.vercel.app on October 1, 2026.
- `admin`: actual department access and funnel-timing components in an isolated local preview. Wrapper and numeric values are sample data. No customer records are used.

Product prices inside screenshots stay in their original currency to preserve the interface. Portfolio business revenue is approximately $62.4K USD: 6,000,000 INR divided by 96.1389 INR/USD, the October 1, 2026 ValutaFX reference rate. Business figures are reported outcomes, not independently audited.

## Projects

Spyll and Avana retain their existing image paths and files. Dailicle alone is updated to an original screenshot of https://www.dailicle.com/read/the-fear-of-dying-before-you-become-yourself, captured October 1, 2026.

The `work-media.ts` registry ties each screenshot to exactly one story section, with title, caption, provenance boundaries and dimensions.
