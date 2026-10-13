import { ThemeControl } from "./ThemeControl";
import { GithubActivity } from "./GithubActivity";
import type { PublicTestimonial } from "@/lib/testimonials";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Mail, Plus, FileText, Linkedin } from "lucide-react";
import { GamePortfolio } from "./GamePortfolio";
import { TechStack } from "./TechStack";
import { projects, experience, socials } from "@/lib/data";
import { notes } from "@/components/Journal/JournalFrame";
import styles from "./Portfolio.module.css";

export function Portfolio({ testimonials = [] }: { testimonials?: PublicTestimonial[] }) {
  return <div className={styles.site}>
    <header className={styles.nav}>
      <a href="#home" className={styles.brand}>ls<span>·</span></a>
      <nav aria-label="Portfolio navigation">{["Work", "Skills", "Projects", "Notes", "Contact"].map(label => <a key={label} href={`#${label.toLowerCase()}`}>{label}</a>)}</nav>
      <ThemeControl/>
      <a href="/resume.pdf" className={styles.resume}>Résumé <ArrowUpRight size={13}/></a>
    </header>
    <main id="main-content" className={styles.page}>
      <section id="home" className={styles.hero}>
        <div className={styles.room}>
          <div className={styles.roomLabel}><span><i/> A LITTLE OF WHERE IT STARTED</span><span>01 — THE ROOM</span></div>
          <GamePortfolio compact/>
          <div className={styles.roomCaption}><span>Built a few games. Kept building.</span><small>Click to explore · ← → / A D move · ↑ / W jump · ↓ / S enter</small></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.hello}>
            <p className={styles.eyebrow}>HELLO, I’M</p>
            <h1>Lucky Solanki<span>.</span></h1>
            <p className={styles.lead}>Backend & <span>AI engineer.</span></p>
          </div>
          <div className={styles.heroAside}>
            <a href="#work" className={styles.currentWork}><span/> Currently at Blitzit <ArrowUpRight size={13}/></a>
            <p className={styles.introduction}>I build the parts you don’t see.<br/>APIs, realtime systems, and AI tools that turn an interface into a working product.</p>
            <div className={styles.actions}><a href="#work">Explore my work <span>↓</span></a><a href="/resume.pdf"><FileText size={15}/> Résumé</a><div className={styles.heroSocials}><a href={socials.github} aria-label="Lucky on GitHub"><Github size={18}/></a><a href={socials.linkedin} aria-label="Lucky on LinkedIn"><Linkedin size={18}/></a><a href={`mailto:${socials.email}`} aria-label="Email Lucky"><Mail size={18}/></a></div></div>
          </div>

        </div>
      </section>
      <section id="skills" className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>01 / THE TOOLKIT</span><h2>Tech I work with.</h2></div><p>Tools behind the work.</p></div>
        <TechStack/>
      </section>
      <section id="work" className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>02 / ALONG THE WAY</span><h2>Work experience.</h2></div><p></p></div>
        <div className={styles.timeline}>
          {experience.map((job, i) => <details key={job.company} className={styles.job}>
            <summary><span className={styles.timelineDot}/><span className={styles.jobLogo}><Image src={i === 0 ? "/icons/blitzit.png" : "/icons/maddycustom.ico"} width={32} height={32} alt="" unoptimized/></span><span className={styles.jobTitle}><strong>{job.company}{job.current && <em>Now</em>}</strong><span>{job.role}</span><span className={styles.jobProof}>{i === 0 ? "Backend from scratch · 12 integrations · 70+ MCP tools" : "Custom commerce platform · 100K+ monthly users at the business"}</span></span><span className={styles.date}>{i === 0 ? "Nov 2025 — Present" : "Dec 2022 — Feb 2026"}</span><Plus size={17} className={styles.expand}/></summary>
            <div className={styles.jobBody}>
              <figure className={styles.workScreenshot}><Image src={i === 0 ? "/images/projects/blitzit/board-original.webp" : "/images/projects/maddycustom/storefront-original.webp"} alt={i === 0 ? "Blitzit 3.0 task board with sample tasks" : "MaddyCustom original custom storefront"} width={1200} height={675}/><figcaption>{i === 0 ? "Blitzit 3.0 · sample task data" : "MaddyCustom · original custom-built storefront"}</figcaption></figure>
              <p className={styles.workLead}>{i === 0 ? "Building the Blitzit 3.0 backend: I designed and built the foundation from scratch, then added integrations, realtime collaboration and AI that can act on the product." : "I co-founded MaddyCustom and built its original commerce platform from scratch: the storefront, backend, admin tools and AI shopping assistant."}</p>
              <div className={styles.workEvidence}>
                {(i === 0 ? [["12", "connected providers"], ["70+", "scoped MCP tools"], ["One", "shared AI action layer"]] : [["100K+", "monthly users at the business"], ["~$62.4K", "USD annual business revenue"], ["End to end", "storefront through fulfillment"]]).map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
              </div>
              <ul className={styles.workDetails}>{(i === 0 ? [
                ["Owned the foundation", "Designed the domain modules, typed event bus and separate API/worker runtimes, covering authentication, billing, shared lists and migration from 2.0."],
                ["Made integrations recoverable", "Built a common framework for 12 providers, with bidirectional sync, OAuth handling, retries and distinct recovery paths for revoked access, throttling and outages."],
                ["Connected AI to real actions", "The in-app agent and MCP clients share an executor and permission model. A per-user change journal makes their writes reversible."],
                ["Brought the agent into voice", "Built shared text/voice reasoning, a custom wake word and a state-driven orb, with interruption and session handling."]
              ] : [
                ["Built the customer journey", "Coded catalogue and variants, search, offers, cart and checkout in Next.js and MongoDB, plus an assistant for product discovery and order questions."],
                ["Handled the messy parts", "Connected Razorpay and PayU payment fallback, verification and shipping, with recovery paths for gateway failures and repeated callbacks."],
                ["Built beyond the storefront", "Created admin workflows for production artwork, inventory, fulfillment, customer journeys and analytics, shaped by the team’s daily operations."]
              ]).map(([title,body]) => <li key={title}><strong>{title}.</strong> {body}</li>)}</ul>
              <small>{i === 0 ? "Voice backend merged; complete frontend voice experience in review." : "Traffic and approximate revenue describe the business, not impact attributed to software alone. These details cover the original custom platform."}</small>
              <Link href={`/work/${i === 0 ? "blitzit" : "maddycustom"}`}>Read the engineering story <ArrowUpRight size={14}/></Link>
            </div>
          </details>)}
        </div>
      </section>
      <section id="projects" className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>03 / SELECTED WORK</span><h2>Selected projects.</h2></div><a href={socials.github}>More on GitHub ↗</a></div>
        <div className={styles.projects}>{projects.filter(p => !["blitzit", "maddycustom"].includes(p.slug)).map((p,i) => <article key={p.slug} id={p.slug} className={styles.project}>
          {p.image && <div className={styles.projectImage}><Image src={p.image} alt={`${p.name} product interface`} width={680} height={400}/><span>0{i + 1}</span></div>}
          <div className={styles.projectHeading}><h3>{p.name}</h3><span>{p.category === "freelance" ? "Client work" : "Independent"} · {p.year}</span></div>
          <p>{p.tagline}</p><div className={styles.tags}>{p.stack.slice(0,4).map(s => <span key={s}>{s}</span>)}</div>
          <details className={styles.projectDetails}><summary>What I built <Plus size={14}/></summary><p>{p.description}</p>{p.details?.slice(0,1).map(d => <p key={d}>{d}</p>)}</details>
          {p.url && <a className={styles.visit} href={p.url} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14}/></a>}
        </article>)}</div>
      </section>
      <section id="notes" className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>04 / NOTES FROM THE DESK</span><h2>Written along the way.</h2></div><Link href="/blog">All notes ↗</Link></div>
        <div className={styles.notes}>{notes.filter(n => n.kind !== "Engineering" && n.kind !== "Building a business").map((n,i) => <Link href={n.href} key={n.href}><span className={styles.noteNumber}>0{i+1}</span><div><h3>{n.title}</h3><p>{n.text}</p></div><ArrowUpRight size={18}/></Link>)}</div>
      </section>
      <section id="about" className={`${styles.section} ${styles.about}`}>
        <div className={styles.originScene} role="img" aria-label="Animated pixel character coding on a laptop">
          <div className={styles.storyBoy}/>
        </div>
        <div className={styles.originCopy}><span className={styles.eyebrow}>A LITTLE BACKGROUND</span><h2>Games were the beginning.</h2>
          <p>I started with a Unity game, then built the software behind our bike-wrap business. That path took me from a mechanical engineering degree to backend and AI systems. Still learning by building.</p>
          <Link href="/stories/journey">The longer story <ArrowUpRight size={14}/></Link>
        </div>
      </section>
      <GithubActivity/>
      {testimonials.length > 0 && <section className={styles.section} id="reviews"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>FROM PEOPLE I’VE WORKED WITH</span><h2>In their words.</h2></div></div><div className={styles.reviews}>{testimonials.map(t=><figure key={t.id}><blockquote>{t.testimonial}</blockquote><figcaption><strong>{t.name}</strong><span>{t.role} · {t.company}</span></figcaption></figure>)}</div></section>}
      <section id="contact" className={`${styles.section} ${styles.contact}`}><div><span className={styles.eyebrow}>05 / THE NEXT CONVERSATION</span><h2>Have something in mind?</h2><p>I’d like to hear about it.</p></div><a href={`mailto:${socials.email}`}><Mail size={18}/> Say hello <ArrowUpRight size={17}/></a></section>
      <footer className={styles.footer}><span>Lucky Solanki <span className={styles.pixelStar}>·</span> From games to systems.</span><div><a href={socials.github}><Github size={14}/> GitHub</a><a href={socials.linkedin}>LinkedIn ↗</a><a href="/resume.pdf">Résumé ↗</a></div></footer>
    </main>
  </div>;
}
