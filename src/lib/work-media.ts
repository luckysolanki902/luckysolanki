/** Original UI captures. Never repeat a screenshot within a story. */
export type WorkMedia = { id: string; section: string; src: string; title: string; caption: string; width: number; height: number };
const blitzit = (id: string, section: string, title: string, caption: string, width = 1280, height = 720): WorkMedia => ({ id, section, src: `/images/projects/blitzit/${id}.webp`, title, caption, width, height });
const maddy = (id: string, section: string, title: string, caption: string, width = 1800, height = 1030): WorkMedia => ({ id, section, src: `/images/projects/maddycustom/${id}.webp`, title, caption, width, height });
export const workMedia: Record<string, WorkMedia[]> = {
  blitzit: [
    blitzit('board-clean', 'cover', 'The Blitzit 3.0 workspace', 'Original interface, captured locally with sample tasks and names.', 1600, 900),
    blitzit('orb-preview', 'voice', 'Blitzy’s real canvas orb', 'The original orb component rendered locally in a presentation wrapper. Listening state is set for this preview; this is not a recording of a live voice session.'),
    blitzit('voice-preferences', 'wake-word', 'A voice companion you can configure', 'Wake-word, sound and orb appearance controls in the frontend voice implementation. This experience is in review.'),
    blitzit('integrations', 'integrations', 'One home for connected providers', 'The real provider catalogue, captured locally. Demo accounts are not connected to external services.', 1600, 850),
    blitzit('list-context', 'shared-tools', 'Context belongs to the work', 'List-level AI instructions give the assistant context for a particular workspace. The sample list is shared with fictional teammates.'),
    blitzit('search', 'collaboration', 'Finding work across lists', 'Search surfaces lists, active tasks and completed work from the local sample workspace.'),
    blitzit('memory', 'memory', 'Memory the user can inspect', 'A sample preference in Blitzy’s memory screen, with controls to pin, edit and remove it.'),
    blitzit('calendar', 'platform', 'Tasks have a place in time', 'The weekly calendar and unscheduled tasks use the same underlying task records. Sample dates and tasks shown.'),
    blitzit('notifications', 'platform', 'Activity without losing your place', 'The notification inbox alongside the task board. Entries use sample content.', 1646, 1000),
    blitzit('reports', 'reliability', 'From recorded work to a useful overview', 'Productivity reporting in the local demo. These figures illustrate the interface, not product-wide usage.'),
    blitzit('sessions', 'reliability', 'The records behind the totals', 'Individual time sessions can be inspected separately from summary charts. All entries are sample data.'),
  ],
  maddycustom: [
    maddy('storefront-original', 'cover', 'The original custom storefront', 'Original storefront components, run locally with public catalogue content.', 1646, 1000),
    maddy('category', 'starting-point', 'Start with the part of the vehicle', 'Category discovery on the original public storefront, captured October 2026.', 764, 817),
    maddy('plp', 'commerce', 'A catalogue built for browsing', 'Original repository screenshot of product listings with the matching-design drawer open. Product names, prices and interface remain unaltered.'),
    maddy('pdp', 'commerce', 'The detail before the decision', 'Original product-detail screenshot showing the design and buying options.'),
    maddy('cart', 'payments', 'The cart carries the whole decision', 'Original cart screenshot, including a matching-product suggestion, offer and order total.'),
    maddy('track-order', 'operations', 'The journey continues after payment', 'Original order-tracking entry screen from the repository. No customer order information is shown.'),
    maddy('admin', 'analytics', 'An operating view for the team', 'Actual department and funnel-timing components in an isolated local preview. The wrapper and chart values are sample data, not business metrics.', 1800, 1298),
    maddy('assistant', 'assistant', 'A conversation that returns real products', 'Original repository screenshot: the shopper describes a red car and a budget, and the assistant returns catalogue cards with prices and links.'),
    maddy('support', 'assistant', 'A clear route from answers to support', 'The public FAQ and assistant entry point. Captured from the original storefront in October 2026.', 764, 817),
    maddy('recommendations', 'ownership', 'Related products, in the buying journey', 'Complementary bonnet-wrap suggestions inside the pillar-wrap catalogue, captured from the original storefront.', 764, 817),
  ],
};
