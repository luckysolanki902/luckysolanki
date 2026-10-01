# MaddyCustom: evidence and scope

Reviewed October 1, 2026. This is an editorial source map for the portfolio, not public article copy.

## Sources

- `luckysolanki902/maddycustom-production`, local HEAD `71ddc3a`, including authored history through March 2026.
- `luckysolanki902/admin-maddy-custom`, local HEAD `bc4d4f5`, including authored history through March 2026.
- Repository documentation, current implementation, and changes around checkout, provider selection, funnel analytics, production templates, and the shopping assistant.
- GitHub PR queries returned no PRs for these repositories. Commit history and code were the primary evidence.

The original repositories were read only. There are other contributors, so the story describes engineering ownership without claiming sole authorship of every file. The reported business figures, 100K+ monthly users and around ₹60L annual revenue, come from the existing project materials. They were not independently audited.

## Implementation evidence

| Area | Evidence inspected | Editorial conclusion |
| --- | --- | --- |
| Storefront | Category/specific-category/variant models, product search, cart and offers | Explain how customer choices carry into orders and production |
| Payments | `src/lib/payments/providers/index.js`, Razorpay and PayU routes, guarded post-payment processing | Health-aware selection and recovery paths; no claim of guaranteed payment availability |
| Operations | Department access, order management, production templates, design search, shipment and tax exports | A separate operational product behind the storefront |
| Analytics | Validated funnel ingestion, event deduplication, timing and customer-journey views, repeat-buyer category reports | First-party product analytics with explicit event semantics |
| Assistant | Agent v2 classifier and data-query/retrieval/direct-answer/handoff paths, MongoDB sessions | Grounded shopping and order support using application tools |
| Maintenance | Image caching, database pools, catalogue feeds, deployment history | Practical responsibility for operating the product |

Important distinctions: database transactions do not make external shipping or messaging calls atomic. Meta CAPI was implemented but later disabled in the archived storefront. The main domain later moved to Shopify. The story covers the original custom platform, not Shopify's implementation. A reverted checkout experiment is not described as a current feature.

## Screenshot provenance

The storefront and admin were exported to isolated temporary directories and run locally. The storefront uses actual components with publicly served catalogue assets. The admin preview uses actual department and funnel-chart components with a small preview wrapper and synthetic chart data. No customer database, production login, or payment submission was used. Captions disclose the preview and sample data.

The storefront cover is an AI presentation edit of its actual local screenshot. The unedited screenshot also appears in the story. See `work-story-image-provenance.md` for the exact edit prompt.
