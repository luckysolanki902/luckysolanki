"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localNudge, type PipSnapshot, type PipMood, type PipNudge, type PipTrigger } from "@/lib/pip-behavior";

import { createReactionGate, reactionFor } from "@/lib/pip-reactions";
import { useThemeStore } from "@/store/useThemeStore";

type Options = { path: string; open: boolean; thinking: boolean; history: { question: string; text: string }[] };
const readStored = <T,>(key: string, fallback: T): T => { try { return JSON.parse(sessionStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
const store = (key: string, value: unknown) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };

export function usePipBehavior(options: Options) {
  const [mood, setMood] = useState<PipMood>("idle");
  const [nudge, setNudge] = useState<PipNudge | null>(null);
  const [remember, setRemember] = useState(true);
  const [memoryStatus, setMemoryStatus] = useState("");
  const current = useRef(options);
  const activity = useRef<PipSnapshot | null>(null);
  const recordRef = useRef<(kind: string, target?: string) => void>(() => {});
  const reactRef = useRef<(mood: PipMood) => void>(() => {});
  const requestRef = useRef<AbortController | null>(null);
  const dismissRef = useRef<() => void>(() => {});
  const memoryRef = useRef(true);
  const telemetryPending = useRef<Promise<unknown> | null>(null);
  useEffect(() => { current.current = options; }, [options]);
  const record = useCallback((kind: string, target = "") => recordRef.current(kind, target), []);
  const react = useCallback((pose: PipMood) => reactRef.current(pose), []);
  const snapshot = useCallback(() => activity.current ? { ...activity.current, events: activity.current.events.slice(-12), sections: Object.fromEntries(Object.entries(activity.current.sections).slice(-16)) } : null, []);
  const dismiss = useCallback(() => { dismissRef.current(); }, []);
  const forget = useCallback(async () => {
    memoryRef.current = false; setRemember(false); setMemoryStatus("Memory is off. Removing saved activity…");
    try { localStorage.setItem("pip-memory", "off"); } catch {}
    try {
      await telemetryPending.current?.catch(() => {});
      const response = await fetch("/api/buddy/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "forget" }) });
      if (!response.ok) throw new Error("Unavailable");
      setMemoryStatus("Saved activity removed. Pip won’t remember future visits.");
    } catch { setMemoryStatus("Memory is off, but saved activity couldn’t be removed. Try again shortly."); }
  }, []);

  useEffect(() => {
    let alive = true;
    let enabled = true;
    try { enabled = localStorage.getItem("pip-memory") !== "off" && navigator.doNotTrack !== "1" && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl; } catch {}
    memoryRef.current = enabled;
    const hydration = requestAnimationFrame(() => setRemember(enabled));
    const previous = readStored<{ id: string; last: number } | null>("pip-session", null);
    const session = previous && Date.now() - previous.last < 1800000 ? previous.id : crypto.randomUUID();
    store("pip-session", { id: session, last: Date.now() });
    const path = options.path;
    const data: PipSnapshot = { session, pageId: crypto.randomUUID(), path, startedAt: Date.now(), activeSeconds: 0, progress: 0, section: "", project: "", sections: {}, events: [] };
    activity.current = data;
    const key = `pip-moments:${session}`;
    const shown = new Set(readStored<string[]>(key, []));
    let lastNudge = readStored<number>(`pip-last:${session}`, 0);
    let lastInput = Date.now(), lastTick = performance.now(), lastScroll = scrollY;
    let sectionSince = Date.now(), projectSince = Date.now(), hiddenAt = 0;
    let frame = 0, lastMeasure = 0;
    let poseTimer: ReturnType<typeof setTimeout>;
    let bubbleTimer: ReturnType<typeof setTimeout>;
    let initialized = false;
    let busyFlush = false;
    let sessionVisitCount = 1;
    const reactions = createReactionGate();
    const visitedPlaces = new Set<string>();
    let speechVersion = 0, localUntil = 0, maxProgress = 0;
    let scrollSample = { y: scrollY, at: performance.now() };
    const recordEvent = (kind: string, target = "") => {
      data.events.push({ at: Date.now(), kind, target: target.slice(0, 100) });
      data.events = data.events.slice(-40);
    };
    recordRef.current = recordEvent;
    const pose = (value: PipMood) => {
      if (!alive) return;
      clearTimeout(poseTimer); setMood(value);
      poseTimer = setTimeout(() => { if (alive) setMood(path.startsWith("/blog/") ? "reading" : "idle"); }, value === "wave" || value === "celebrate" ? 2400 : 1000);
    };
    reactRef.current = pose;
    const say = (key: string, action = false) => {
      const line = reactionFor(key);
      if (!line || !alive || document.hidden || current.current.open || current.current.thinking || (document.activeElement?.matches("input,textarea,[contenteditable=true]") || document.activeElement?.closest("#systems"))) return false;
      if (!reactions.allow(key, Date.now(), action)) return false;
      speechVersion++; localUntil = Date.now() + 6500;
      clearTimeout(bubbleTimer); setNudge(line); pose(line.mood);
      recordEvent("nudge_shown", `reaction:${key}`);
      bubbleTimer = setTimeout(() => { if (alive) setNudge(null); }, 8000);
      return true;
    };
    const flush = async (initialize = false, leaving = false) => {
      if (!memoryRef.current || busyFlush) return;
      if (leaving && !initialized) return;
      busyFlush = true;
      try {
        const pending = fetch("/api/buddy/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activity: data, initialize }), keepalive: leaving });
        telemetryPending.current = pending;
        const response = await pending;
        const result = await response.json();
        if (response.ok && alive) { initialized = true; if (result.visitCount) sessionVisitCount = result.visitCount; }
      } catch { /* Activity must never block browsing or chat. */ }
      finally { busyFlush = false; }
    };
    const dismissBubble = () => {
      clearTimeout(bubbleTimer); requestRef.current?.abort(); requestRef.current = null;
      setNudge(null); speechVersion++; reactions.dismiss(Date.now()); recordEvent("nudge_dismissed", data.section);
      lastNudge = Date.now() + 30000; store(`pip-last:${session}`, lastNudge);
      pose("idle");
    };
    dismissRef.current = dismissBubble;
    const offer = async (trigger: PipTrigger) => {
      const signature = `${trigger}:${trigger === "project" ? data.project : trigger === "reading" ? data.section : path}`;
      if (!alive || current.current.open || current.current.thinking || document.hidden || Date.now() < localUntil || requestRef.current || shown.has(signature) || Date.now() - lastNudge < 45000 || shown.size >= 6) return;
      if ((document.activeElement?.matches("input,textarea,[contenteditable=true]") || document.activeElement?.closest("#systems"))) return;
      shown.add(signature); store(key, [...shown]); lastNudge = Date.now(); store(`pip-last:${session}`, lastNudge);
      const atSection = data.section, atProject = data.project, requestedVersion = speechVersion;
      const controller = new AbortController(); requestRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), 11000);
      pose(trigger === "reading" ? "reading" : "curious");
      let result: PipNudge & { show?: boolean } = localNudge(trigger, data.project, sessionVisitCount > 1);
      try {
        const response = await fetch("/api/buddy/nudge", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ trigger, activity: { ...data, events: data.events.slice(-12) }, memory: memoryRef.current, history: current.current.history.slice(-4).map(({ question, text }) => ({ question: question.slice(0, 400), text: text.slice(0, 600) })) }) });
        if (response.ok) result = await response.json();
      } catch { /* A small relevant local hint still works if AI is unavailable. */ }
      finally { clearTimeout(timeout); if (requestRef.current === controller) requestRef.current = null; }
      if (!alive || requestedVersion !== speechVersion || controller.signal.aborted || document.hidden || current.current.open || result.show === false) return;
      if (atProject !== data.project || atSection !== data.section) return;
      clearTimeout(bubbleTimer); setNudge(result); pose(result.mood); recordEvent("nudge_shown", `${trigger}:${result.mode || "local"}`);
      bubbleTimer = setTimeout(() => { if (alive) setNudge(null); }, 20000);
    };
    const measure = () => {
      frame = 0;
      if (document.hidden || performance.now() - lastMeasure < 100) return;
      lastMeasure = performance.now();
      const sectionNodes = Array.from(document.querySelectorAll<HTMLElement>(path.startsWith("/blog/") ? "article section[id]" : "main section[id]"));
      const section = sectionNodes.filter((node) => { const r = node.getBoundingClientRect(); return r.top < innerHeight * .55 && r.bottom > 0; }).at(-1)?.id || (path.startsWith("/blog") ? "article-intro" : "hero");
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card]"));
      const project = cards.filter((node) => { const r = node.getBoundingClientRect(); return r.top < innerHeight * .6 && r.bottom > 0; }).at(-1)?.dataset.project || "";
      if (section !== data.section) { data.section = section; sectionSince = Date.now(); recordEvent("section", section); }
      if (project !== data.project) { data.project = project; projectSince = Date.now(); if (project) recordEvent("project", project); }
      const article = path.startsWith("/blog/") ? document.querySelector("article")?.getBoundingClientRect() : undefined;
      data.progress = Math.round(Math.max(0, Math.min(100, (article ? -article.top / Math.max(1, article.height - innerHeight) : scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100)));
    };
    const wake = () => { if (Date.now() - lastInput > 45000) pose("wave"); lastInput = Date.now(); };
    const scroll = () => {
      wake();
      const now = performance.now();
      if (now - scrollSample.at > 150) {
        if (Math.abs(scrollY - scrollSample.y) / (now - scrollSample.at) > 2.4) say("fast");
        scrollSample = { y: scrollY, at: now };
      }
      if (scrollY < 30 && maxProgress > 15) say("top");
      if (Math.abs(scrollY - lastScroll) > 120) { pose("scrolling"); lastScroll = scrollY; }
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const click = (event: MouseEvent) => {
      wake();
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("a");
      const card = target?.closest<HTMLElement>("[data-project-card]");
      if (link) {
        const href = link.getAttribute("href") || "";
        if (href.includes("resume.pdf")) { recordEvent("resume", "resume"); pose("celebrate"); say("resume", true); }
        else if (href.startsWith("mailto:") || href === "#contact" || href === "/#contact") { recordEvent("contact", "contact"); pose("wave"); say(href.startsWith("mailto:") ? "email" : "contact", true); }
        else if (href.includes("github.com")) say("github", true);
        else if (href.includes("linkedin.com")) say("linkedin", true);
        else if (card) { recordEvent("project_link", card.dataset.project); pose("curious"); }
        else if (href.startsWith("/blog/")) recordEvent("blog_link", href);
      }
      if (card && target?.closest("button[aria-expanded]")) { recordEvent("project_details", card.dataset.project); pose("curious"); const button = target.closest("button"); queueMicrotask(() => { if (button?.getAttribute("aria-expanded") === "true") say("details", true); }); }
    };
    const tick = () => {
      const now = performance.now();
      const elapsed = Math.min(2, (now - lastTick) / 1000); lastTick = now;
      if (document.hidden) return;
      if (Date.now() - lastInput < 90000) {
        data.activeSeconds += elapsed;
        if (Object.keys(data.sections).length < 32 || data.section in data.sections) data.sections[data.section] = (data.sections[data.section] || 0) + elapsed;
      }
      if (Date.now() - lastInput > 45000 && !current.current.open) setMood("sleep");
      maxProgress = Math.max(maxProgress, data.progress);
      const place = data.project || data.section;
      if (place && !visitedPlaces.has(place) && Date.now() - (data.project ? projectSince : sectionSince) > 900) {
        if (say(place)) visitedPlaces.add(place);
      }
      if (path.startsWith("/blog/") && data.activeSeconds > 2 && !visitedPlaces.has("reading")) {
        if (say("reading")) visitedPlaces.add("reading");
      }
      if (data.progress >= 95 && !visitedPlaces.has("bottom")) { if (say("bottom")) visitedPlaces.add("bottom"); }
      else if (path.startsWith("/blog/") && data.progress >= 50 && !visitedPlaces.has("halfway")) { if (say("halfway")) visitedPlaces.add("halfway"); }
      if (data.section === "hero" && Date.now() - lastInput > 30000 && Date.now() - lastInput < 34000) say("idle");
      const active = data.activeSeconds;
      if (active < 8) return;
      if (!shown.size) void offer("welcome");
      else if (!shown.has(`contact:${path}`) && data.section === "contact" && Date.now() - sectionSince > 7000) void offer("contact");
      else if (!shown.has(`finished:${path}`) && path.startsWith("/blog/") && data.progress >= 90 && active > 20) void offer("finished");
      else if (!shown.has(`compare:${path}`) && new Set(data.events.filter((event) => event.kind === "project").map((event) => event.target)).size >= 3) void offer("compare");
      else if (!shown.has(`project:${data.project}`) && data.project && Date.now() - projectSince > 14000) void offer("project");
      else if (path.startsWith("/blog/") && Date.now() - sectionSince > 18000) void offer("reading");
    };
    const visibility = () => {
      if (document.hidden) { hiddenAt = Date.now(); void flush(false, true); requestRef.current?.abort(); }
      else { wake(); lastTick = performance.now(); measure(); if (hiddenAt && Date.now() - hiddenAt > 30000) { recordEvent("tab_return", path); pose("wave"); say("return", true); } }
    };
    const copy = () => { say("copy", true); };
    const unsubscribeTheme = useThemeStore.subscribe((state, previous) => { if (state.theme !== previous.theme) say(state.theme, true); });
    const hello = setTimeout(() => { say(path.startsWith("/blog/") ? "reading" : "welcome"); }, 1800);
    document.addEventListener("copy", copy);
    const leave = () => { void flush(false, true); };
    recordEvent("page", path);
    const start = setTimeout(() => { measure(); pose("wave"); void flush(true); }, 300);
    const interval = setInterval(tick, 1000);
    const heartbeat = setInterval(() => { if (!document.hidden && Date.now() - lastInput < 90000) { store("pip-session", { id: session, last: Date.now() }); void flush(); } }, 20000);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("click", click, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(hello); unsubscribeTheme(); document.removeEventListener("copy", copy);
      alive = false; void flush(false, true); requestRef.current?.abort(); requestRef.current = null;
      clearTimeout(start); clearTimeout(poseTimer); clearTimeout(bubbleTimer); clearInterval(interval); clearInterval(heartbeat); cancelAnimationFrame(frame); cancelAnimationFrame(hydration);
      window.removeEventListener("scroll", scroll); window.removeEventListener("click", click); window.removeEventListener("keydown", wake); window.removeEventListener("pagehide", leave); document.removeEventListener("visibilitychange", visibility);
    };
  }, [options.path]);

  return { mood, nudge, remember, memoryStatus, snapshot, record, react, dismiss, forget };
}
