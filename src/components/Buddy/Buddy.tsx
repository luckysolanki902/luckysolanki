"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { projects, socials } from "@/lib/data";
import { answerGuide, type GuideAnswer, type GuideContext } from "@/lib/buddy-guide";
import { usePipBehavior } from "@/hooks/usePipBehavior";
import styles from "./Buddy.module.css";

type Message = GuideAnswer & { question: string; mode?: "ai" | "local" };
function readContext(): GuideContext {
  const article = document.querySelector("article");
  return { path: location.pathname, title: document.querySelector("h1")?.textContent || "Lucky’s portfolio", introduction: article?.querySelector("header p")?.textContent || "", sections: Array.from(document.querySelectorAll("article section[id]")).map((section) => ({ heading: section.querySelector("h2, h3")?.textContent || "", text: Array.from(section.querySelectorAll("p, li")).map((p) => p.textContent).join(" "), href: `#${section.id}` })) };
}

export function Buddy() {
  const pathname = usePathname();
  return <Companion key={pathname} path={pathname} />;
}

function Companion({ path }: { path: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [contextLabel, setContextLabel] = useState("Welcome, explorer");
  const [progress, setProgress] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const history = useRef<HTMLDivElement>(null);
  const eye = useRef<HTMLSpanElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const isArticle = path.startsWith("/work/");
  const behavior = usePipBehavior({ path, open, thinking, history: messages });
  const close = useCallback(() => { setOpen(false); launcher.current?.focus(); }, []);

  useEffect(() => {
    const hydrate = requestAnimationFrame(() => {
      try {
        setSaved(!!localStorage.getItem(`pip-place:${path}`));
        const recent = JSON.parse(sessionStorage.getItem("pip-conversation") || "[]");
        if (Array.isArray(recent)) setMessages(recent.filter((item) => typeof item?.question === "string" && typeof item?.text === "string").slice(-8));
      } catch { /* storage may be unavailable */ }
    });
    let frame = 0;
    let eyeFrame = 0;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      if (document.hidden) return;
      const reading = document.querySelector("article");
      const rect = isArticle ? reading?.getBoundingClientRect() : undefined;
      const total = rect ? rect.height - innerHeight : document.documentElement.scrollHeight - innerHeight;
      setProgress(Math.round(Math.max(0, Math.min(100, ((rect ? -rect.top : scrollY) / Math.max(1, total)) * 100))));
      const nodes = Array.from(document.querySelectorAll(isArticle ? "article section[id]" : "main > section[id]"));
      const current = nodes.filter((node) => node.getBoundingClientRect().top < innerHeight * .55).at(-1);
      const label = current?.querySelector("h2, h3")?.textContent;
      setContextLabel(label || (isArticle ? document.querySelector("h1")?.textContent || "Reading together" : path === "/work" ? "Pick your next read" : "Welcome, explorer"));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !eye.current || !launcher.current || document.hidden || motion.matches || eyeFrame) return;
      eyeFrame = requestAnimationFrame(() => {
      eyeFrame = 0;
      if (!eye.current || !launcher.current) return;
      const r = launcher.current.getBoundingClientRect();
      eye.current.style.setProperty("--look-x", `${Math.max(-3, Math.min(3, (event.clientX - r.left) / 140))}px`);
      eye.current.style.setProperty("--look-y", `${Math.max(-2, Math.min(2, (event.clientY - r.top) / 140))}px`);
      });
    };
    const visibility = () => {
      launcher.current?.parentElement?.setAttribute("data-hidden", String(document.hidden));
      schedule();
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(eyeFrame); cancelAnimationFrame(hydrate);
      requestRef.current?.abort(); requestRef.current = null;
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [path, isArticle]);

  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  useEffect(() => { if (behavior.remember && messages.length) try { sessionStorage.setItem("pip-conversation", JSON.stringify(messages.filter((message) => message.text).slice(-8))); } catch {} }, [messages, behavior.remember]);
  useEffect(() => { history.current?.scrollTo({ top: history.current.scrollHeight, behavior: "instant" }); }, [messages, thinking]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !launcher.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [open, close]);

  const ask = async (rawQuestion: string) => {
    const question = rawQuestion.trim().replace(/\s*\u2014\s*/g, ", ");
    if (!question || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 26000);
    let flush: ReturnType<typeof setTimeout> | undefined;
    let text = "";
    let finished = false;
    const previous = messages.slice(-4).map(({ question, text }) => ({ question: question.slice(0, 600), text: text.slice(0, 1200) }));
    const context = readContext();
    const visibleProject = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card], [data-work-experience]")).filter((card) => { const rect = card.getBoundingClientRect(); return rect.top < innerHeight * .65 && rect.bottom > 0; }).at(-1)?.dataset.project || (isArticle ? path.split("/")[2] : "");
    const updateLast = (answer: Partial<Message>) => setMessages((items) => items.map((item, index) => index === items.length - 1 ? { ...item, ...answer } : item));
    behavior.record("question", "chat");
    setInput(""); setNotice(""); setThinking(true);
    setMessages((items) => [...items.slice(-7), { question, text: "" }]);
    try {
      const response = await fetch("/api/buddy", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ question, path, section: contextLabel, project: visibleProject, history: previous, activity: behavior.snapshot(), memory: behavior.remember }),
      });
      if (response.headers.get("content-type")?.includes("application/json")) {
        const result = await response.json();
        if (typeof result.text !== "string") throw new Error("No reply");
        updateLast({ text: result.text, links: result.links, mode: "local" });
        setNotice(result.notice || "Here’s what I found on the site.");
        return;
      }
      if (!response.ok || !response.body) throw new Error("No reply");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const handle = (line: string) => {
        if (!line.trim()) return;
        const event = JSON.parse(line);
        if (event.type === "delta" && typeof event.text === "string") {
          text += event.text;
          if (!flush) flush = setTimeout(() => { updateLast({ text, mode: "ai" }); flush = undefined; }, 50);
        } else if (event.type === "done") {
          clearTimeout(flush); flush = undefined;
          if (!text.trim()) throw new Error("Empty reply");
          updateLast({ text, links: event.links, mode: "ai" }); finished = true;
        } else if (event.type === "fallback") {
          clearTimeout(flush); flush = undefined;
          updateLast({ text: event.text, links: event.links, mode: "local" }); setNotice(event.notice); finished = true;
        }
      };
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() || "";
        lines.forEach(handle);
      }
      buffer += decoder.decode(); if (buffer.trim()) handle(buffer);
      if (!finished) throw new Error("Interrupted reply");
    } catch {
      if (requestRef.current !== controller) return;
      clearTimeout(flush);
      const project = projects.find((item) => item.slug === visibleProject);
      const localQuestion = path === "/" && project && /\b(this|current)\b/i.test(question) ? `${project.name}: ${question}` : question;
      const answer = answerGuide(localQuestion, context, projects, socials.email);
      updateLast({ ...answer, mode: "local" });
      setNotice("I couldn’t connect to chat. Here’s what I found on the site.");
    } finally {
      clearTimeout(timeout); clearTimeout(flush);
      if (requestRef.current === controller) { requestRef.current = null; setThinking(false); }
    }
  };
  const navigate = (href: string) => {
    if (href.startsWith("#") || (path === "/" && href.startsWith("/#"))) {
      const id = href.slice(href.indexOf("#") + 1);
      const target = document.getElementById(id);
      if (target) { target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); close(); }
      else { setNotice("Switch the work filter to All to see this project."); }
    } else if (href.startsWith("/") && !href.endsWith(".pdf")) { close(); router.push(href); }
  };
  const bookmark = () => {
    try { localStorage.setItem(`pip-place:${path}`, JSON.stringify({ y: scrollY, title: contextLabel })); setSaved(true); setNotice("Place saved on this device. Come back whenever you like."); } catch { setNotice("This browser couldn’t save your place."); }
  };
  const resume = () => {
    try { const place = JSON.parse(localStorage.getItem(`pip-place:${path}`) || "null"); if (Number.isFinite(place?.y)) { window.scrollTo({ top: Math.max(0, place.y), behavior: "instant" }); close(); } } catch { setNotice("That saved position is no longer available."); }
  };


  return <div className={styles.wrapper} data-open={open} data-mood={thinking ? "thinking" : !open && behavior.nudge ? (behavior.nudge.mode === "reaction" ? behavior.nudge.mood : "talking") : behavior.mood}>
    {!open && behavior.nudge && <aside className={styles.bubble} aria-label="A suggestion from Pip" role="status">
      <button className={styles.bubbleMessage} onClick={behavior.dismiss} aria-label={`Dismiss message: ${behavior.nudge.text}`}>{behavior.nudge.text}</button>
    </aside>}
    {open && <div id="pip-guide" ref={panel} className={styles.panel} role="dialog" aria-label="Pip, portfolio guide">
      <header className={styles.panelHeader}><span className={styles.pipBadge}>P</span><div><strong>Pip</strong><small>Your little portfolio guide</small></div><button onClick={close} aria-label="Close guide">×</button></header>
      <div className={styles.context}><span aria-hidden="true">{isArticle ? "▤" : "⌁"}</span><span>{contextLabel}</span>{isArticle && <b>{progress}%</b>}</div>
      <div ref={history} className={styles.history} role="log" aria-label="Conversation" aria-live="polite">
        {!messages.length && <div className={styles.welcome}><h3>{isArticle ? "Want a hand with this article?" : "What would you like to know?"}</h3><p>{isArticle ? "Ask about a section, get a short summary, or save your place." : "Ask about Lucky’s work, experience, or how he built a project."}</p></div>}
        {messages.map((message, index) => <div className={styles.exchange} key={index}><p className={styles.question}>{message.question}</p><p className={styles.answer}>{message.text}</p>{message.mode && <small className={styles.answerSource}>{message.mode === "ai" ? "AI reply" : "From the site"}</small>}{message.links && <div className={styles.links}>{message.links.map((link) => <a key={link.href + link.label} href={link.href} onClick={(event) => { if (link.href.startsWith("#") || (link.href.startsWith("/") && !link.href.endsWith(".pdf"))) { event.preventDefault(); navigate(link.href); } }}>{link.label}<span aria-hidden="true">↗</span></a>)}</div>}</div>)}
        {thinking && !messages.at(-1)?.text && <p className={styles.thinking}>One moment <span>•••</span></p>}
      </div>
      <div className={styles.suggestions}>{(isArticle ? ["Give me the gist", "Article outline"] : path === "/work" ? ["AI integration projects", "Backend experience"] : ["I’m hiring", "Show me AI work"]).map((question) => <button key={question} onClick={() => ask(question)} disabled={thinking}>{question} ↗</button>)}{isArticle && <><button onClick={bookmark}>Save my place</button>{saved && <button onClick={resume}>Resume reading</button>}</>}</div>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); ask(input); }}><label className={styles.srOnly} htmlFor="pip-question">Ask about Lucky’s work or this article</label><input ref={field} id="pip-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder={isArticle ? "Ask about this article…" : "Ask about Lucky’s work…"} autoComplete="off" /><button disabled={!input.trim() || thinking} aria-label="Ask guide">↑</button></form>
      <footer className={styles.footer}><span>AI guide · <a href="/privacy">How memory works</a></span><div><button onClick={() => { requestRef.current?.abort(); requestRef.current = null; setThinking(false); void behavior.forget(); setMessages([]); try { sessionStorage.removeItem("pip-conversation"); } catch {} }}>Forget my visits</button></div></footer>
      {behavior.memoryStatus && <p className={styles.notice} role="status">{behavior.memoryStatus}</p>}

    </div>}
    <button ref={launcher} className={styles.launcher} aria-label={open ? "Close Pip guide" : "Open Pip, your portfolio guide"} aria-expanded={open} aria-controls="pip-guide" onPointerEnter={() => behavior.react("wave")} onClick={() => { behavior.dismiss(); behavior.record("chat_open", path); behavior.react("wave"); setOpen(!open); }}>
      <svg className={styles.progress} viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="35"/><circle cx="38" cy="38" r="35" pathLength="100" strokeDasharray={`${progress} 100`}/></svg>
      <span className={styles.robot} aria-hidden="true"><span className={styles.antenna}/><span className={styles.hand}/><span className={styles.face}><span ref={eye} className={styles.eyes}><i/><i/></span><span className={styles.cheeks}/><span className={styles.mouth}/></span><span className={styles.feet}/><span className={styles.book}/><span className={styles.motionLines}/></span>
      <span className={styles.sleep} aria-hidden="true">z z</span>
    </button>
    {!open && <span className={styles.hint}>{behavior.mood === "sleep" ? "Taking a tiny nap" : isArticle ? `${progress}% · Reading with you` : "Ask Pip"}</span>}
  </div>;
}
