import styles from './EngineeringBrief.module.css';

/** Public summaries of implementation decisions; no proprietary source or customer data. */
export function EngineeringBrief({ slug }: { slug: string }) {
  const blitzit = slug === 'blitzit';
  const decisions = blitzit ? [
    ['Separate speech from action', 'Realtime presents speech. The same agent used by typed chat reasons, checks permissions and executes tools. This avoids maintaining a second business-action path inside the voice model.', '#voice'],
    ['Give providers a shared contract', 'The 2.0 code used provider-specific sync services. In 3.0, plugins share initialization, lifecycle and data-access boundaries, while keeping each provider’s mapping and recovery behavior explicit.', '#integrations'],
    ['Make writes explainable and reversible', 'AI writes enter a change journal. Undo checks for intervening changes; stopping a response does not pretend to roll back a completed action.', '#undo'],
  ] : [
    ['Own the complete purchase flow', 'Connected catalogue, cart, payment verification and order workflows, then built the tools the team needed after checkout.', '#commerce'],
    ['Design for payment failure', 'Integrated Razorpay and PayU with verification and recovery paths for repeated callbacks and gateway failures.', '#payments'],
    ['Treat hosting cost as a design input', 'Adjusted caching and deployment configuration, then disabled on-demand image transformations to avoid that hosting charge. The tradeoff shifts image sizing and delivery responsibility upstream.', '#ownership'],
  ];
  return <section className={styles.brief} aria-labelledby="brief-title" id="brief">
    <div className={styles.heading}><span>THE ONE-MINUTE BRIEF</span><a href="#starting-point">Read the full story ↓</a></div>
    <h2 id="brief-title">{blitzit ? 'One backend. Several ways to use it.' : 'From a storefront to a working business.'}</h2>
    <p className={styles.intro}>{blitzit ? 'I built the Blitzit 3.0 backend foundation and connected integrations, collaboration and AI actions to it. The challenge was keeping permissions, recovery and product behavior consistent across clients.' : 'As co-founder and developer, I built the original custom commerce platform and internal tools, taking responsibility for the customer journey and the operational work behind each order.'}</p>
    <div className={styles.decisions}>{decisions.map(([title, text, href], i) => <a href={href} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p><small>Inspect the decision ↗</small></a>)}</div>
    {blitzit && <figure className={styles.flow}>
      <figcaption>Simplified voice action path · implementation overview</figcaption>
      <ol><li><strong>Speech → transcript</strong><span>Literal request</span></li><li><strong>Shared chat agent</strong><span>Reasoning & tools</span></li><li><strong>Permission checks</strong><span>Scoped execution</span></li><li><strong>Result → speech</strong><span>Presentation only</span></li></ol>
      <p>Committed writes are journaled. Realtime has no business tools of its own.</p>
    </figure>}
    <details className={styles.evidence}><summary>{blitzit ? 'Failure cases & AI verification' : 'Implementation evidence & business context'} <span>+</span></summary>
      {blitzit ? <>
        <p>Local verification · 14 October 2026: 75 focused voice-controller and routing unit tests passed. This checks orchestration behavior; it is not an end-to-end voice benchmark or production success rate.</p>
        <dl><div><dt>A transcript arrives before its commit event</dt><dd>The controller tests check that the accepted request executes once, after commitment.</dd></div><div><dt>The speech model tries to become an action agent</dt><dd>The session contract exposes no business tools. A regression check asserts an empty tool list and disabled tool selection.</dd></div><div><dt>A calendar sync token expires</dt><dd>The integration harness drives the real plugin through a stateful vendor fake to exercise HTTP 410 recovery and deduplication. Database race guarantees belong to the separate integration-test tier.</dd></div></dl>
        <a href="#voice">Voice architecture ↗</a> · <a href="#integrations">Integration recovery ↗</a>
      </> : <><p>The original platform connected customer-facing commerce to production and fulfillment tools. The business reached 100K+ monthly users and approximately $62.4K USD annual revenue; these describe business scale, not a causal uplift attributed to my code.</p><p>Repository history records image-transformation and hosting configuration changes. A measured before/after hosting bill is not published, so no savings percentage is claimed.</p><a href="#operations">See the operational workflows ↗</a></>}
    </details>
    <div className={styles.status}><strong>{blitzit ? 'Delivery & measurement' : 'Scope & handoff'}</strong><p>{blitzit ? 'Voice backend merged; the complete frontend voice experience is in review. The split-model architecture is intended to control cost, but no measured cost reduction or latency benchmark is claimed here.' : 'This story covers the original custom platform. The business later moved to Shopify; the screenshots document the platform I built.'}</p></div>
  </section>;
}
