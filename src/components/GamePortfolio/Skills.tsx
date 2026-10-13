import Link from "next/link";
import { Braces, Workflow, Sparkles, Database, PanelsTopLeft, AudioLines } from "lucide-react";
import styles from "./Skills.module.css";

const skills = [
  { name: "Backend systems", tools: "TypeScript · Node.js · Fastify", level: "End-to-end ownership", icon: Braces, proof: "Designed Blitzit’s backend, from domain modules and authentication to separate API and worker runtimes.", href: "/work/blitzit#architecture", source: "Blitzit" },
  { name: "Integrations & reliability", tools: "OAuth · Webhooks · BullMQ · Redis", level: "End-to-end ownership", icon: Workflow, proof: "Built provider integrations with two-way sync, retries, recovery and explicit failure handling.", href: "/work/blitzit#integrations", source: "Blitzit" },
  { name: "AI that takes action", tools: "MCP · Agent tools · Permissions", level: "End-to-end ownership", icon: Sparkles, proof: "Built a shared execution layer for in-app agents and external MCP clients, with scoped access and undo.", href: "/work/blitzit#shared-tools", source: "Blitzit" },
  { name: "Data & background work", tools: "MongoDB · PostgreSQL · Queues", level: "Built in real products", icon: Database, proof: "Used data models, migrations and asynchronous jobs across collaboration, commerce and image-processing products.", href: "/#projects/autoremov", source: "AutoRemov + Blitzit" },
  { name: "Product interfaces", tools: "React · Next.js · Commerce", level: "End-to-end ownership", icon: PanelsTopLeft, proof: "Built MaddyCustom’s storefront and operations tools, connecting customer purchases to fulfilment.", href: "/work/maddycustom", source: "MaddyCustom" },
  { name: "Realtime & voice", tools: "WebRTC · Socket.IO · ONNX", level: "Built in real products", icon: AudioLines, proof: "Built realtime product features and a voice backend. The complete Blitzit frontend voice experience is still in review.", href: "/work/blitzit", source: "Blitzit + Spyll" },
];

export function Skills() {
  return <div className={styles.workshop}>
    <header className={styles.intro}>
      <span className={styles.eyebrow}>THE TOOL BENCH / SKILLS</span>
      <h2>Tools I’ve put to work.</h2>
      <p>Backend is my home ground. These are the skills I use to take a product from an idea to something people can depend on.</p>
      <div className={styles.legend}><span>◇ Built in real products</span><span>◆ Owned end to end</span></div>
      <small>Proficiency shown through responsibility and real work.</small>
    </header>
    <div className={styles.rack}>
      {skills.map(({ name, tools, level, icon: Icon, proof, href, source }, index) => <article className={styles.tool} key={name} style={{ animationDelay: `${index * 65}ms` }}>
        <div className={styles.socket} aria-hidden="true"><Icon size={25} strokeWidth={1.5} /><span>0{index + 1}</span></div>
        <div className={styles.description}>
          <div className={styles.title}><h3>{name}</h3><span className={styles.level}><b aria-hidden="true">{level === "End-to-end ownership" ? "◆" : "◇"}</b>{level}</span></div>
          <p className={styles.tools}>{tools}</p>
          <p className={styles.proof}>{proof}</p>
          <Link href={href} className={styles.evidence}>See the work <span> / {source} ↗</span></Link>
        </div>
      </article>)}
    </div>
    <footer className={styles.note}>Still adding tools to the bench. Always more to learn.</footer>
  </div>;
}
