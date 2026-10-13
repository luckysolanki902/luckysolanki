"use client";
import { useState } from "react";
import Image from "next/image";
import { Bot, ScanSearch, ListChecks, type LucideIcon } from "lucide-react";
const toolIcons: Record<string, { icon: LucideIcon; color: string }> = {
 agents: { icon: Bot, color: "#c5b4e8" },
 rag: { icon: ScanSearch, color: "#86bdd1" },
 evals: { icon: ListChecks, color: "#c4cf96" },
};
import styles from "./Portfolio.module.css";
const stack = [
  ["TypeScript", "typescript", "Core toolkit", "Typed APIs, domain modules and shared product tools at Blitzit."],
  ["Node.js", "nodedotjs", "Core toolkit", "API services and independent background workers."],
  ["Fastify", "fastify", "Core toolkit", "Backend foundations for Blitzit, Spyll and AutoRemov."],
  ["MongoDB", "mongodb", "Core toolkit", "Product data models for collaboration, commerce and publishing."],
  ["Redis", "redis", "Applied in products", "Background queues and worker coordination."],
  ["PostgreSQL", "postgresql", "Applied in products", "AutoRemov’s data layer and durable job pipeline."],
  ["React", "react", "Core toolkit", "Product interfaces and internal operations tools."],
  ["Next.js", "nextdotjs", "Core toolkit", "Storefronts, AI products and the Dailicle reading experience."],
  ["Python", "python", "Applied in products", "Voice experiments and custom wake-word training."],
  ["Socket.IO", "socketdotio", "Applied in products", "Realtime chat and presence for Spyll."],
  ["Docker", "docker", "Supporting tool", "Containerized development and service environments."],
  ["Git", "git", "Supporting tool", "Version control throughout the work."],
  ["OpenAI", "openai", "Applied in products", "LLM-powered research and document-backed answers in Avana."],
  ["LLM agents", "agents", "Applied in products", "Multi-step tool use, model routing, memory and provider fallback."],
  ["MCP", "mcp", "Applied in products", "Scoped product tools shared by Blitzit’s in-app agent and external AI clients."],
  ["RAG", "rag", "Applied in products", "Vector search and retrieval for answers grounded in source documents."],
  ["AI evals", "evals", "Applied in products", "Golden datasets, LLM-as-judge and tool-selection checks."],
  ["Drizzle", "drizzle", "Toolkit", "Type-safe SQL queries, schemas and database migrations."],
  ["AWS S3", "s3", "Applied in products", "Asset storage for image processing and publishing workflows."],
  ["Cloudflare", "cloudflare", "Supporting tool", "Infrastructure and deployment tooling."],
];
export function TechStack() {
 const [selected,setSelected]=useState(0);
 return <div className={styles.stack}>
  <div className={styles.stackGrid} aria-label="Technology skills">{stack.map(([name,icon],i)=>{
    const tool = toolIcons[icon];
    const Icon = tool?.icon;
    return <button key={name} onClick={()=>setSelected(i)} aria-pressed={selected===i} aria-controls="skill-description">
      {Icon ? <Icon size={27} strokeWidth={1.7} color={tool.color} aria-hidden="true"/> : <Image src={`/icons/stack/${icon}.svg`} width={27} height={27} alt=""/>}
      <span>{name}</span>
    </button>;
  })}</div>
  <div id="skill-description" className={styles.skillDescription} aria-live="polite"><span className={styles.skillLevel}>◆ {stack[selected][2]}</span><strong>{stack[selected][0]}</strong><span>{stack[selected][3]}</span></div>
 </div>;
}
