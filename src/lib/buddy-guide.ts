import type { PublicTestimonial } from "./testimonials";
import type { Project } from "./data";

export type GuideLink = { label: string; href: string };
export type GuideAnswer = { text: string; links?: GuideLink[] };
export type ReadingSection = { heading: string; text: string; href: string };
export type GuideContext = { path: string; title: string; introduction: string; sections: ReadingSection[] };

const stop = new Set("a an and are can do does for from how i in is it me of on or tell the this to what which with about lucky his he please show work projects project experience skills".split(" "));
const words = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => word.length > 1 && !stop.has(word)) ?? [];
const snippet = (text: string, length = 430) => text.length <= length ? text : text.slice(0, length).replace(/\s+\S*$/, "") + "…";

/** Local, source-based retrieval. Never generates unsupported portfolio claims. */
export function answerGuide(question: string, context: GuideContext, projects: Project[], email: string, testimonials: PublicTestimonial[] = []): GuideAnswer {
  const query = question.toLowerCase();
  if (/\b(feedbacks?|testimonials?|recommendations?|reviews?)\b|what.*(?:people|clients|collaborators).*say/.test(query)) {
    const named = testimonials.filter(t => query.includes(t.name.toLowerCase()) || query.includes(t.company.toLowerCase()));
    const matches = named.length ? named : testimonials;
    return { text: matches.length ? matches.map(t => `${t.name}, ${t.role} at ${t.company}: “${t.testimonial}”`).join("\n\n") : "The recommendations section is where Lucky shares public feedback. I couldn’t load those notes just now, so I won’t guess what they say.", links: [{ label: "Read the recommendations", href: "/#testimonials" }] };
  }
  if (/\b(contact|email|hire|hiring|recruit|resume|cv|available|availability|salary|rate|price)\b/.test(query)) {
    return { text: "Lucky works across backend engineering, AI integrations, and full-stack products. For a role or project, share what needs building, your timeline, and the ownership you need. Availability and rates are best confirmed directly with him.", links: [{ label: "Get in touch", href: `mailto:${email}` }, { label: "View résumé", href: "/resume.pdf" }, { label: "See his work", href: "/#work" }] };
  }
  if (/\b(hello|hi|hey)\b/.test(query)) return { text: "Hi! What would you like to know about Lucky or this page?" };
  if (/\b(summary|summarize|gist|tldr|overview)\b/.test(query) && context.path.startsWith("/work/")) {
    return { text: snippet(context.introduction || context.sections[0]?.text || context.title), links: context.sections.slice(0, 3).map((section) => ({ label: section.heading, href: section.href })) };
  }
  if (/\b(outline|contents|sections)\b/.test(query) && context.sections.length) return { text: "Here are the sections. Pick one to jump to it.", links: context.sections.map((section) => ({ label: section.heading, href: section.href })) };
  const tokens = [...new Set(words(question))];
  const score = (text: string) => { const terms = new Set(words(text)); return tokens.reduce((total, token) => total + (terms.has(token) ? 1 : 0), 0); };
  if (context.path.startsWith("/work/")) {
    const ranked = context.sections.map((section) => ({ section, score: score(section.heading + " " + section.text) })).sort((a, b) => b.score - a.score);
    if (ranked[0]?.score > 0) return { text: `From “${ranked[0].section.heading}”:\n\n${snippet(ranked[0].section.text)}`, links: [{ label: "Read this section", href: ranked[0].section.href }] };
  }
  const ranked = projects.map((project) => ({ project, score: score([project.name, project.tagline, project.description, ...project.stack, ...(project.details ?? [])].join(" ")) + (query.includes(project.name.toLowerCase()) ? 20 : 0) })).sort((a, b) => b.score - a.score);
  if (ranked[0]?.score > 0 || /\b(project|projects|work|built|experience|skills)\b/.test(query)) {
    const chosen = ranked[0]?.score > 0 ? ranked.slice(0, 2).filter((entry) => entry.score > 0) : ranked.slice(0, 3);
    return { text: chosen.map(({ project }) => `${project.name}, ${snippet(project.description, 290)}`).join("\n\n"), links: chosen.map(({ project }) => ({ label: `Explore ${project.name}`, href: `/#project-${project.slug}` })) };
  }
  return { text: "I don’t have that detail. You can ask Lucky directly, or try a project name or a technology like MCP or payments.", links: [{ label: "Contact Lucky", href: `mailto:${email}` }, { label: "Read the work stories", href: "/work" }] };
}
