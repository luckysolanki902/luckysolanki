"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Mail,
  Monitor,
  Wrench,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Music2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { projects, socials } from "@/lib/data";
import {
  cameraOffset,
  clamp,
  destinationFromHash,
  destinations,
  periodAtHour,
  WORLD,
  type Destination,
  type Period,
} from "./world";
import {
  atlasPosition,
  autoSpeed,
  newCharacter,
  releaseJump,
  requestJump,
  spriteFrame,
  stepCharacter,
  SPRITES,
  FRAMES,
} from "./character";
import styles from "./GamePortfolio.module.css";
import { Skills } from "./Skills";
import { RoomAudio } from "./audio";
import { TaskArcade } from "../TaskArcade/TaskArcade";
import { RoomAdventure } from "../TaskArcade/RoomAdventure";

type Phase = "room" | "walking" | "revealing" | "open";
const otherProjects = projects.filter(
  (p) => !["blitzit", "maddycustom"].includes(p.slug),
);
const periods: Period[] = ["dawn", "day", "sunset", "night"];
const periodNames = {
  dawn: "Early morning",
  day: "A little daylight",
  sunset: "Golden hour",
  night: "After hours",
};
const periodIcons = { dawn: Sunrise, day: Sun, sunset: Sunset, night: Moon };

export function GamePortfolio({ compact = false }: { compact?: boolean }) {
  const [period, setPeriod] = useState<Period>("day");
  const [clock, setClock] = useState("");
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("room");
  const [section, setSection] = useState<Destination>("work");
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(false);
  const [music, setMusic] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const arcadeOpenRef = useRef(false);
  const dialogueOpenRef = useRef(false);
  useEffect(()=>{const update=(e:Event)=>{dialogueOpenRef.current=Boolean((e as CustomEvent).detail);keys.current.clear();};window.addEventListener("room-dialogue",update);return()=>window.removeEventListener("room-dialogue",update);},[]);
  const [roomAudio, setRoomAudio] = useState<RoomAudio | null>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const [assetError, setAssetError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [transitionOrigin, setTransitionOrigin] = useState("70% 60%");
  const viewport = useRef<HTMLDivElement>(null);
  const worldEl = useRef<HTMLDivElement>(null);
  const actorEl = useRef<HTMLDivElement>(null);
  const spriteEl = useRef<HTMLDivElement>(null);
  const shadowEl = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const target = useRef<number | null>(null);
  const pending = useRef<Destination | null>(null);
  const motion = useRef(newCharacter());
  const getRoomCharacter = useCallback(() => motion.current, []);
  const geometry = useRef({ width: 1440, height: 810, scale: 1, offset: 0 });
  const keys = useRef(new Set<string>());
  const currentFrame = useRef(-1);
  const revealStarted = useRef(0);
  const phaseRef = useRef<Phase>("room");
  const reducedRef = useRef(false);
  const audio = useRef<RoomAudio | null>(null);
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealRef = useRef<(destination: Destination) => void>(() => {});
  const goRef = useRef<(destination: Destination, direct?: boolean) => void>(
    () => {},
  );
  const backRef = useRef<() => void>(() => {});

  const enterArcade = useCallback(() => { arcadeOpenRef.current = true; keys.current.clear(); target.current = null; pending.current = null; setArcadeOpen(true); }, []);

  const clearTransition = useCallback(() => {
    transitionTimers.current.forEach(clearTimeout);
    transitionTimers.current = [];
  }, []);
  const updatePhase = useCallback((value: Phase) => {
    phaseRef.current = value;
    setPhase(value);
  }, []);
  const playTone = useCallback(() => { audio.current?.effect("discover"); }, []);
  const toggleAudio = (kind: "sound" | "music") => {
    const engine = audio.current;
    if (!engine) return;
    engine[kind] = !engine[kind];
    setSound(engine.sound);
    setMusic(engine.music);
    try {
      localStorage.setItem("lucky-audio", JSON.stringify({ sound: engine.sound, music: engine.music }));
    } catch { /* Preferences still apply for this visit. */ }
    engine.unlock();
    engine.sync();
    if (kind === "sound" && engine.sound) engine.effect();
  };
  useEffect(() => {
    const engine = new RoomAudio();
    audio.current = engine;
    try {
      const saved = JSON.parse(localStorage.getItem("lucky-audio") || "{}");
      engine.sound = typeof saved?.sound === "boolean" ? saved.sound : false;
      engine.music = typeof saved?.music === "boolean" ? saved.music : false;
    } catch { /* Use defaults if storage is unavailable or invalid. */ }
    const initializeAudio = requestAnimationFrame(() => {
      setSound(engine.sound);
      setMusic(engine.music);
      setRoomAudio(engine);
    });
    const unlock = () => engine.unlock();
    const onScroll = () => {
      if (compact) engine.exploring = (viewport.current?.getBoundingClientRect().bottom ?? 1) < 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", engine.visibility);
    window.addEventListener("blur", engine.visibility);
    window.addEventListener("focus", engine.visibility);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", engine.visibility);
      window.removeEventListener("blur", engine.visibility);
      window.removeEventListener("focus", engine.visibility);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(initializeAudio);
      engine.dispose();
      audio.current = null;
    };
  }, [compact]);
  useEffect(() => {
    if (audio.current) audio.current.exploring = phase === "open" || phase === "revealing";
  }, [phase]);
  const openSection = useCallback(
    (destination: Destination) => {
      clearTransition();
      pending.current = null;
      target.current = null;
      keys.current.clear();
      setSection(destination);
      setStarted(true);
      updatePhase("open");
      if (window.location.hash !== `#${destination}`)
        window.history.pushState(null, "", `#${destination}`);
    },
    [clearTransition, updatePhase],
  );
  const reveal = useCallback(
    (destination: Destination) => {
      if (reducedRef.current) {
        openSection(destination);
        return;
      }
      const geo = geometry.current,
        point = destinations[destination];
      setTransitionOrigin(
        `${point.x * geo.scale + geo.offset}px ${point.y * geo.scale}px`,
      );
      setSection(destination);
      revealStarted.current = performance.now();
      updatePhase("revealing");
      playTone();
      transitionTimers.current.push(
        setTimeout(() => openSection(destination), 1050),
      );
    },
    [openSection, playTone, updatePhase],
  );
  const go = useCallback(
    (destination: Destination, direct = false) => {
      if (compact) {
        playTone();
        keys.current.clear();
        target.current = null;
        const section = document.getElementById(destination);
        section?.scrollIntoView({ behavior: reducedRef.current ? "instant" : "smooth", block: "start" });
        history.pushState(null, "", `#${destination}`);
        return;
      }
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      clearTransition();
      setStarted(true);
      setSection(destination);
      if (direct || reducedRef.current || phaseRef.current === "open") {
        openSection(destination);
        return;
      }
      target.current = destinations[destination].x;
      pending.current = destination;
      updatePhase("walking");
    },
    [clearTransition, openSection, updatePhase, compact, playTone],
  );
  const back = useCallback(() => {
    clearTransition();
    pending.current = null;
    target.current = null;
    keys.current.clear();
    updatePhase("room");
    if (window.location.hash)
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    requestAnimationFrame(() => {
      const previous = returnFocus.current;
      if (previous?.isConnected && !previous.closest("[inert]"))
        previous.focus({ preventScroll: true });
      else viewport.current?.focus({ preventScroll: true });
    });
  }, [clearTransition, updatePhase]);

  useEffect(() => {
    revealRef.current = reveal;
    goRef.current = go;
    backRef.current = back;
  }, [reveal, go, back]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const onMedia = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
    };
    const initialize = requestAnimationFrame(() => {
      onMedia();

    });
    media.addEventListener("change", onMedia);
    const onHistory = () => {
      if (compact) {
        const hash = location.hash.slice(1);
        const id = hash.startsWith("projects/") ? hash.split("/")[1] : hash === "selected-work" ? "work" : hash;
        if (id && (hash.includes("/") || hash === "selected-work")) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }));
        return;
      }
      const legacyWorkLink = [
        "#projects/maddycustom",
        "#projects/blitzit",
      ].includes(location.hash);
      const destination = legacyWorkLink
        ? "work"
        : destinationFromHash(location.hash);
      if (legacyWorkLink) history.replaceState(null, "", "#work");
      clearTransition();
      pending.current = null;
      target.current = null;
      if (destination) {
        setStarted(true);
        setSection(destination);
        const slug = location.hash.split("/")[1];
        setProjectSlug(
          destination === "projects" &&
            otherProjects.some((p) => p.slug === slug)
            ? slug
            : null,
        );
        updatePhase("open");
        document
          .getElementById("main-content")
          ?.scrollIntoView({ behavior: "instant" });
      } else updatePhase("room");
    };
    onHistory();
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHistory);
    return () => {
      cancelAnimationFrame(initialize);
      media.removeEventListener("change", onMedia);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("hashchange", onHistory);
      clearTransition();
      if (copyTimer.current) clearTimeout(copyTimer.current);

    };
  }, [clearTransition, updatePhase, compact]);
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      setPeriod(periodAtHour(date.getHours()));
      setClock(
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  useEffect(() => {
    let active = true;
    const initialPeriod = periodAtHour(new Date().getHours());
    const sources = [
      `/game/room-${initialPeriod}.webp`,
      "/game/sprites/boy-v2.png",
    ];
    // Warm other lighting variants without delaying the first playable frame.
    const deferredRooms = periods
      .filter((p) => p !== initialPeriod)
      .map((p) => {
        const image = new window.Image();
        image.src = `/game/room-${p}.webp`;
        return image;
      });
    Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              void img.decode().then(resolve, reject);
            };
            img.onerror = reject;
            img.src = src;
          }),
      ),
    )
      .then(() => {
        if (active) {
          readyRef.current = true;
          setReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setAssetError(true);
          readyRef.current = true;
          setReady(true);
        }
      });
    return () => {
      active = false;
      deferredRooms.forEach((image) => {
        image.src = "";
      });
    };
  }, []);
  useEffect(() => {
    if (phase === "open") heading.current?.focus({ preventScroll: true });
  }, [phase, section]);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resize = () => {
      const rect = element.getBoundingClientRect();
      geometry.current.width = rect.width;
      geometry.current.height = rect.height;
      geometry.current.scale = Math.max(
        rect.width / WORLD.width,
        rect.height / WORLD.height,
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    let frameId = 0;
    let previous = 0;
    let accumulator = 0;
    const STEP = 1 / 120;

    const animate = (time: number) => {
      const elapsed = Math.min((time - (previous || time)) / 1000, 0.05);
      previous = time;
      const m = motion.current;
      const geo = geometry.current;
      const active =
        phaseRef.current === "room" || phaseRef.current === "walking";
      if (readyRef.current && active && !document.hidden && !arcadeOpenRef.current && !dialogueOpenRef.current) {
        accumulator = Math.min(accumulator + elapsed, 0.05);
        while (accumulator >= STEP) {
          const direction =
            Number(keys.current.has("ArrowRight") || keys.current.has("d")) -
            Number(keys.current.has("ArrowLeft") || keys.current.has("a"));
          let move = direction;

          if (direction) {
            target.current = null;
            pending.current = null;
          } else if (target.current !== null) {
            move = autoSpeed(m, target.current);
          }

          const wasGrounded = m.grounded;
          const previousStep = Math.floor(m.stride / 150);
          stepCharacter(m, move, STEP, reducedRef.current, compact);
          if (wasGrounded && !m.grounded) audio.current?.effect("jump");
          else if (!wasGrounded && m.grounded) audio.current?.effect("land");
          else if (m.grounded && Math.floor(m.stride / 150) !== previousStep) audio.current?.effect("step");

          // Reaching a clickable destination waits until the character lands.
          if (
            target.current !== null &&
            !direction &&
            Math.abs(m.x - target.current) < 1.5 &&
            Math.abs(m.vx) < 12
          ) {
            m.x = target.current;
            m.vx = 0;
            target.current = null;
          }
          if (target.current === null && pending.current && m.grounded) {
            const destination = pending.current;
            pending.current = null;
            revealRef.current(destination);
          }
          accumulator -= STEP;
          if (phaseRef.current === "revealing" || phaseRef.current === "open") {
            accumulator = 0;
            break;
          }
        }
      } else accumulator = 0;

      geo.offset = cameraOffset(m.x, geo.scale, geo.width);
      if (worldEl.current) {
        const verticalOffset = compact ? Math.min(0, geo.height - (WORLD.floor + 25) * geo.scale) : 0;
        worldEl.current.style.transform = `translate(${geo.offset}px, ${verticalOffset}px) scale(${geo.scale})`;
      }
      if (actorEl.current) {
        actorEl.current.style.transform = `translate(${(m.x - 96).toFixed(2)}px, ${(WORLD.floor - SPRITES.baseline - m.z).toFixed(2)}px)`;
        actorEl.current.dataset.animation =
          phaseRef.current === "revealing" ? "interact" : m.animation;
      }
      if (shadowEl.current) {
        shadowEl.current.style.transform = `translate(${Math.round(m.x - 50)}px, ${WORLD.floor - 9}px) scale(${1 - Math.min(m.z / 1000, 0.45)})`;
        shadowEl.current.style.opacity = String(1 - Math.min(m.z / 620, 0.57));
      }

      const index =
        phaseRef.current === "revealing"
          ? FRAMES.interact[
              Math.min(2, Math.floor((time - revealStarted.current) / 90))
            ]
          : spriteFrame(m, reducedRef.current);
      if (spriteEl.current) {
        if (currentFrame.current !== index) {
          spriteEl.current.style.backgroundPosition = atlasPosition(index);
          currentFrame.current = index;
        }
        // Flip immediately when reversing direction, including mid-jump.
        const lean = m.grounded ? Math.max(-2, Math.min(2, m.vx / 160)) : 0;
        spriteEl.current.style.transform = `scaleX(${m.facing}) rotate(${lean}deg)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate(performance.now());

    // TEMP: remove after the reported keyboard-scroll issue is confirmed fixed.
    const inputLog: Record<string, unknown>[] = [];
    Object.assign(window, { __gameInputLog: inputLog });
    const debugInput = (type: string, details: Record<string, unknown> = {}) => {
      const active = document.activeElement as HTMLElement | null;
      const entry = { time: Math.round(performance.now()), type, scrollY: window.scrollY,
        focus: active?.getAttribute("aria-label") || active?.id || active?.tagName,
        ...details };
      inputLog.push(entry);if(inputLog.length>150)inputLog.shift();
      console.log("[game-input] " + JSON.stringify(entry));
    };
    let lastKeyAt = 0;
    let lastScrollLog = 0;
    const debugScroll = () => {
      if(performance.now()-lastScrollLog<100)return;
      lastScrollLog=performance.now();
      debugInput("scroll", {sinceKeyMs:Math.round(performance.now()-lastKeyAt),roomTop:Math.round(element.getBoundingClientRect().top)});
    };
    debugInput("diagnostics-ready", {version:"scroll-trace-2"});
    const debugKey = (event: KeyboardEvent) => {
      if (!["Space","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","KeyA","KeyD","KeyW","KeyS","KeyE","Escape","Tab"].includes(event.code)) return;
      lastKeyAt=performance.now();
      setTimeout(()=>debugInput(event.type, {key:event.key,code:event.code,repeat:event.repeat,prevented:event.defaultPrevented}),0);
    };
    window.addEventListener("keydown", debugKey, true);
    window.addEventListener("keyup", debugKey, true);
    window.addEventListener("scroll", debugScroll, {passive:true});
    let ownsKeyboard = false;
    let gameJumpHeld = false;
    let gameSpaceHeld = false;
    const focusIn = (event: FocusEvent) => {
      ownsKeyboard = element.contains(event.target as Node);
      debugInput("focus-in", {ownsKeyboard});
    };
    const pointerDown = (event: PointerEvent) => {
      ownsKeyboard = element.contains(event.target as Node);
      debugInput("pointer-down", {insideRoom:ownsKeyboard});
      if (!ownsKeyboard) clearKeys();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") { ownsKeyboard = false; clearKeys(); return; }
      if (!readyRef.current || arcadeOpenRef.current || dialogueOpenRef.current) return;
      const focused = element.contains(document.activeElement);
      const focusDropped = document.activeElement === document.body;
      const rect = element.getBoundingClientRect();
      if (compact && !focused && !(ownsKeyboard && focusDropped && (gameJumpHeld || gameSpaceHeld || keys.current.size > 0) && rect.bottom > 0 && rect.top < innerHeight)) return;
      ownsKeyboard = true;
      const el = event.target as HTMLElement;
      if (event.key === "Escape") {
        backRef.current();
        return;
      }
      if (
        el.matches("input, textarea, select") ||
        el.isContentEditable ||
        phaseRef.current === "open" ||
        phaseRef.current === "revealing"
      )
        return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(key)) {
        event.preventDefault();
        pending.current = null;
        target.current = null;
        if (phaseRef.current === "walking") {
          phaseRef.current = "room";
          setPhase("room");
        }
        keys.current.add(key);
        setStarted(true);
        // Leave the clicked Start button so Space immediately belongs to the
        // game, while preserving normal Space activation on other UI buttons.
        element.focus({ preventScroll: true });
      }
      if (["ArrowUp", "w"].includes(key)) {
        // Own the complete jump gesture if focus temporarily drops.
        // Repeats and keyup must stay with the game.
        if (el.closest("button, a") && !gameJumpHeld) return;
        gameJumpHeld = true;
        event.preventDefault();
        if (!event.repeat && !reducedRef.current) requestJump(motion.current);
        setStarted(true);
      }
      // Browser scrolling must never compete with focused game controls.
      if (["ArrowUp", "ArrowDown", " "].includes(key) && !el.closest("button, a")) {
        if (key === " ") gameSpaceHeld = true;
        event.preventDefault();
      }
      if (!compact && key === "e" && !event.repeat) {
        const nearest = (Object.keys(destinations) as Destination[])
          .filter((d) => d !== "projects")
          .sort(
            (a, b) =>
              Math.abs(destinations[a].x - motion.current.x) -
              Math.abs(destinations[b].x - motion.current.x),
          )[0];
        goRef.current(nearest);
      }
    };

    const keyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && gameSpaceHeld) { event.preventDefault(); gameSpaceHeld = false; }
      if (["ArrowUp", "KeyW"].includes(event.code) && gameJumpHeld) { event.preventDefault(); gameJumpHeld = false; }
      keys.current.delete(
        event.key.length === 1 ? event.key.toLowerCase() : event.key,
      );
      if (["ArrowUp", "KeyW"].includes(event.code)) releaseJump(motion.current);
    };
    const clearKeys = () => {
      keys.current.clear();
      releaseJump(motion.current);
    };
    const focusOut = (event: FocusEvent) => {
      debugInput("focus-out", {next:(event.relatedTarget as HTMLElement|null)?.tagName,gameJumpHeld});
      if (event.relatedTarget !== element) clearKeys();
    };
    const loseWindow = () => { gameSpaceHeld = false; gameJumpHeld = false; ownsKeyboard = false; clearKeys(); };
    document.addEventListener("focusin", focusIn, true);
    document.addEventListener("pointerdown", pointerDown, true);
    element.addEventListener("focusout", focusOut);
    window.addEventListener("keydown", keyDown, true);
    window.addEventListener("keyup", keyUp, true);
    window.addEventListener("blur", loseWindow);
    document.addEventListener("visibilitychange", clearKeys);
    return () => {
      window.removeEventListener("keydown", debugKey, true);
      window.removeEventListener("keyup", debugKey, true);
      window.removeEventListener("scroll", debugScroll);
      observer.disconnect();
      cancelAnimationFrame(frameId);
      document.removeEventListener("focusin", focusIn, true);
      document.removeEventListener("pointerdown", pointerDown, true);
      element.removeEventListener("focusout", focusOut);
      window.removeEventListener("keydown", keyDown, true);
      window.removeEventListener("keyup", keyUp, true);
      window.removeEventListener("blur", loseWindow);
      document.removeEventListener("visibilitychange", clearKeys);
    };
  }, [compact]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
      document.getElementById("contact-address")?.focus();
    }
  }
  const Icon = periodIcons[period];
  const currentProject = otherProjects.find((p) => p.slug === projectSlug);
  const open = phase === "open";
  const navigate = (destination: Destination) => {
    if (destination === "projects") setProjectSlug(null);
    playTone();
    go(destination, true);
  };

  return (
    <div
      id={compact ? "playable-room" : "main-content"}
      className={`${styles.app} ${compact ? styles.compact : ""}`}
      data-period={period}
      data-reduced={reduced}
      data-phase={phase}
      data-ready={ready}
    >
      <header className={styles.header}>
        <button
          className={styles.brand}
          onClick={back}
          aria-label="Lucky Solanki, back to room"
        >
          <span className={styles.monogram}>
            LS<span>·</span>
          </span>
          <span className={styles.brandName}>Lucky Solanki</span>
        </button>
        <nav className={styles.topNav} aria-label="Main navigation">
          <button
            id="room-work-link"
            aria-current={open && section === "work" ? "page" : undefined}
            onClick={() => navigate("work")}
          >
            Work
          </button>
          <button
            onClick={() => navigate("about")}
            aria-current={open && section === "about" ? "page" : undefined}
          >
            About
          </button>
          <button onClick={() => navigate("projects")}>Projects</button>
          <button onClick={() => navigate("skills")} aria-current={open && section === "skills" ? "page" : undefined}>Skills</button>
          <Link href="/blog">Notes</Link>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Résumé <ArrowUpRight size={13} />
          </a>
          <button onClick={() => navigate("contact")}>Contact</button>
        </nav>
        <div className={styles.timeButton} aria-label="Local time">
          <Icon size={17} />
          <span>{clock || "Your room"}</span>
        </div>
      </header>

      <div
        className={styles.viewport}
        ref={viewport}
        tabIndex={compact ? 0 : -1}
        aria-label="Interactive room"
      >
        <div
          className={styles.sceneZoom}
          style={{ transformOrigin: transitionOrigin }}
          inert={open || phase === "revealing"}
        >
          <div
            className={styles.world}
            ref={worldEl}
            onClick={(event) => {
              if (
                !readyRef.current ||
                (event.target as HTMLElement).closest("button,a") ||
                open ||
                phase === "revealing"
              )
                return;
              clearTransition();
              pending.current = null;
              updatePhase("room");
              setStarted(true);
              viewport.current?.focus({ preventScroll: true });
              const rect = viewport.current!.getBoundingClientRect();
              const x = clamp(
                (event.clientX - rect.left - geometry.current.offset) /
                  geometry.current.scale,
                WORLD.minX,
                WORLD.maxX,
              );
              if (reduced) motion.current.x = x;
              else target.current = x;
            }}
          >
            {compact && ready && <RoomAdventure getCharacter={getRoomCharacter} audio={roomAudio} onEnter={enterArcade} suspended={arcadeOpen}/>}
            {periods.map((p) => (
              <div
                key={p}
                className={`${styles.roomLayer} ${p === period ? styles.visibleLayer : ""}`}
                style={{ backgroundImage: `url('/game/room-${p}.webp')` }}
              />
            ))}
            <div className={styles.monitorScreen} aria-hidden="true" />
            <div className={styles.monitorGlow} />
            <div className={styles.dust} aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <i key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
            <div className={styles.shadow} ref={shadowEl} />
            <div
              className={styles.actor}
              style={{
                transform: `translate(${1120 - SPRITES.width / 2}px, ${WORLD.floor - SPRITES.baseline}px)`,
              }}
              ref={actorEl}
              aria-label="Lucky’s playable character"
            >
              <div
                ref={spriteEl}
                className={styles.sprite}
                aria-hidden="true"
              />
            </div>
            <button
              className={`${styles.hotspot} ${styles.workSpot}`}
              onClick={() => go("work")}
            >
              <Monitor size={18} />
              <span>
                My <strong>work experience</strong>
              </span>
              <span className={styles.hotspotArrow}>↗</span>
            </button>
            <button className={`${styles.hotspot} ${styles.skillsSpot}`} onClick={() => go("skills")}><Wrench size={18} /><span>My <strong>skills</strong></span><span className={styles.hotspotArrow}>↗</span></button>
            <button
              className={`${styles.hotspot} ${styles.aboutSpot}`}
              onClick={() => go("about")}
            >
              <BookOpen size={18} />
              <span>About</span>
            </button>
            <button
              className={`${styles.hotspot} ${styles.projectsSpot}`}
              onClick={() => {
                setProjectSlug(null);
                go("projects");
              }}
            >
              <BookOpen size={18} />
              <span>Projects</span>
            </button>
            <button
              className={`${styles.hotspot} ${styles.contactSpot}`}
              onClick={() => go("contact")}
            >
              <Mail size={18} />
              <span>Contact</span>
            </button>
          </div>
        </div>
        {!compact && !started && !open && (
          <section className={styles.intro} aria-label="Introduction">
            <div className={styles.eyebrow}>
              <span /> LUCKY SOLANKI / BACKEND & AI
            </div>
            <h1>
              I build the systems
              <br />
              behind the product<span>.</span>
            </h1>
            <p className={styles.role}>
              Backend & AI engineer. APIs, realtime infrastructure, and agents
              that can take action.
            </p>
            <p className={styles.welcome}>
              Lucky Solanki · Currently building Blitzit 3.0
            </p>
            <a className={styles.startButton} href="#selected-work">
              Explore my work <ArrowUpRight size={17} />
            </a>
            <div className={styles.heroSecondary}>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                View résumé ↗
              </a>
              <button
                disabled={!ready}
                onClick={() => {
                  setStarted(true);
                  viewport.current?.focus({ preventScroll: true });
                  playTone();
                }}
              >
                <Play size={13} />
                {ready ? "Explore the room" : "Opening the room…"}
              </button>
            </div>
            {assetError && (
              <p className={styles.assetWarning}>
                Some artwork couldn’t load. You can still explore my work using
                the links.
              </p>
            )}
          </section>
        )}
        {!open && phase === "walking" && (
          <button className={styles.skip} onClick={() => openSection(section)}>
            Skip walk <ChevronRight size={15} />
          </button>
        )}
        {phase === "revealing" && (
          <button className={styles.skip} onClick={() => openSection(section)}>
            Skip animation <ChevronRight size={15} />
          </button>
        )}
        {!open && started && phase === "room" && (
          <div className={styles.exploreHint}>
            A room to explore. A few things I’ve built.
          </div>
        )}

        {open && (
          <section
            className={`${styles.destination} ${styles.paperDestination} ${section === "skills" ? styles.skillsDestination : ""}`}
            aria-label={destinations[section].label}
          >
            <div className={styles.destinationBar}>
              <button onClick={back}>
                <ArrowLeft size={17} /> Back to room
              </button>
              <span>
                {section === "work"
                  ? "At the desk"
                  : section === "skills"
                    ? "At the tool bench"
                    : section === "about"
                    ? "On the bookshelf"
                    : section === "contact"
                      ? "A little correspondence"
                      : "Also on my desk"}
              </span>
              <button
                aria-label="Replay the reveal"
                onClick={() => {
                  updatePhase("room");
                  go(section);
                }}
              >
                <RotateCcw size={15} />
                <span>Replay</span>
              </button>
            </div>
            {(section === "work" || section === "projects") && (
              <div className={styles.fieldDesk}>
                <div className={styles.notebookTabs} aria-label="Desk pages">
                  <button
                    aria-current={section === "work" ? "page" : undefined}
                    onClick={() => {
                      setSection("work");
                      history.replaceState(null, "", "#work");
                    }}
                  >
                    Work
                  </button>
                  <button
                    aria-current={section === "projects" ? "page" : undefined}
                    onClick={() => {
                      setSection("projects");
                      setProjectSlug(null);
                      history.replaceState(null, "", "#projects");
                    }}
                  >
                    Projects
                  </button>
                  <Link href="/blog">Field notes ↗</Link>
                </div>
                <article className={styles.fieldNotebook}>
                  <div className={styles.notebookMargin} aria-hidden="true">
                    <span>LUCKY’S NOTEBOOK</span>
                    <span>✦</span>
                  </div>
                  {section === "work" ? (
                    <div className={styles.workNotes}>
                      <span className={styles.miniLabel}>01 / WORK</span>
                      <h2 ref={heading} tabIndex={-1}>
                        Things I’ve worked on.
                      </h2>
                      <p className={styles.noteIntro}>
                        I build the systems behind the product.
                      </p>
                      <section className={styles.experienceNote}>
                        <div>
                          <h3>
                            Blitzit <span>Now</span>
                          </h3>
                          <small>Nov 2025 — present</small>
                        </div>
                        <p className={styles.noteRole}>
                          Core Backend Developer & AI Engineer
                        </p>
                        <p>
                          Built the 3.0 backend from scratch. Now working on
                          integrations, realtime collaboration, and AI that can
                          act across the product.
                        </p>
                        <Link href="/work/blitzit">
                          How it works <ArrowUpRight size={15} />
                        </Link>
                      </section>
                      <section className={styles.experienceNote}>
                        <div>
                          <h3>MaddyCustom</h3>
                          <small>Dec 2022 — Feb 2026</small>
                        </div>
                        <p className={styles.noteRole}>
                          Co-founder & Lead Developer
                        </p>
                        <p>
                          Started with bike-wrap designs. Built the storefront
                          and the software behind payments, production, and
                          shipping.
                        </p>
                        <Link href="/work/maddycustom">
                          What I built <ArrowUpRight size={15} />
                        </Link>
                      </section>
                      <footer className={styles.notebookFooter}>
                        <span>Started with games. Kept building.</span>
                        <a href="/resume.pdf" target="_blank" rel="noreferrer">
                          Résumé ↗
                        </a>
                      </footer>
                    </div>
                  ) : (
                    <div className={styles.workNotes}>
                      <span className={styles.miniLabel}>
                        02 / PROJECT COLLECTION
                      </span>
                      <h2 ref={heading} tabIndex={-1}>
                        Built out of curiosity.
                      </h2>
                      <p className={styles.noteIntro}>
                        Small ideas, real products, and the things they taught
                        me.
                      </p>
                      {currentProject ? (
                        <article className={styles.projectDetail}>
                          <button
                            onClick={() => {
                              setProjectSlug(null);
                              history.replaceState(null, "", "#projects");
                            }}
                          >
                            <ArrowLeft size={15} /> All projects
                          </button>
                          <div className={styles.projectDetailGrid}>
                            <div>
                              <span className={styles.miniLabel}>
                                {currentProject.role}
                              </span>
                              <h3>{currentProject.name}</h3>
                              <p>{currentProject.description}</p>
                              <ul>
                                {currentProject.details
                                  ?.slice(0, 2)
                                  .map((d) => (
                                    <li key={d}>{d}</li>
                                  ))}
                              </ul>
                              <div className={styles.projectLinks}>
                                {currentProject.url && (
                                  <a
                                    href={currentProject.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Visit project <ArrowUpRight size={15} />
                                  </a>
                                )}
                                {currentProject.playStore && (
                                  <a
                                    href={currentProject.playStore}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Google Play <ArrowUpRight size={15} />
                                  </a>
                                )}
                              </div>
                            </div>
                            {currentProject.image && (
                              <Image
                                width={900}
                                height={600}
                                sizes="(max-width: 700px) 90vw, 40vw"
                                src={currentProject.image}
                                alt={`${currentProject.name} product preview`}
                                className={styles.projectImage}
                              />
                            )}
                          </div>
                        </article>
                      ) : (
                        <div className={styles.projectList}>
                          {otherProjects.map((p, i) => (
                            <button
                              key={p.slug}
                              onClick={() => {
                                setProjectSlug(p.slug);
                                history.replaceState(
                                  null,
                                  "",
                                  `#projects/${p.slug}`,
                                );
                              }}
                            >
                              <span className={styles.projectNumber}>
                                0{i + 1}
                              </span>
                              <span>
                                <strong>{p.name}</strong>
                                <small>{p.tagline}</small>
                              </span>
                              <span className={styles.projectRole}>
                                {p.category === "fulltime"
                                  ? "Work"
                                  : p.category === "freelance"
                                    ? "Freelance"
                                    : "Personal / founder"}
                              </span>
                              <ArrowUpRight size={19} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              </div>
            )}
            {section === "skills" && <Skills />}
            {section === "about" && (
              <div className={styles.readingDesk}>
                <article className={styles.book}>
                  <div className={styles.bookLeft}>
                    <span className={styles.bookStamp}>
                      A LITTLE BACKGROUND
                    </span>
                    <div className={styles.portraitFrame}>
                      <Image
                        width={192}
                        height={272}
                        unoptimized
                        src="/game/sprites/v2/00.png"
                        alt="Lucky’s pixel character"
                      />
                      <span>Still figuring things out.</span>
                    </div>
                    <span className={styles.bookNote}>
                      Started with games.
                      <br />
                      Stayed for the building.
                    </span>
                    <span className={styles.pageNumber}>01</span>
                  </div>
                  <div className={styles.bookRight}>
                    <div className={styles.miniLabel}>HELLO AGAIN</div>
                    <h2 ref={heading} tabIndex={-1}>
                      I’m Lucky<span>.</span>
                    </h2>
                    <p>
                      I’m a software engineer working on backend and AI systems
                      at Blitzit.
                    </p>
                    <p>
                      I studied Mechanical Engineering. Along the way, I taught
                      myself Unity and C# and shipped a small arcade game with
                      hand-drawn assets.
                    </p>
                    <p>
                      Later, a friend and I started a bike-wrap business. I
                      began with design, automated the repetitive bits, then
                      learned web development when we needed a website. That
                      grew into the software behind orders, payments,
                      production, and shipping.
                    </p>
                    <p>
                      After a brief role at Voltas, I moved into software at
                      Blitzit. Building the systems was the part I wanted to
                      keep doing.
                    </p>
                    <div className={styles.bookLinks}>
                      <a href="/resume.pdf" target="_blank" rel="noreferrer">
                        Résumé <ArrowUpRight size={16} />
                      </a>
                      <a href={socials.github} target="_blank" rel="noreferrer">
                        GitHub <ArrowUpRight size={16} />
                      </a>
                    </div>
                    <span className={styles.pageNumber}>02</span>
                  </div>
                </article>
              </div>
            )}
            {section === "contact" && (
              <div className={styles.letterDesk}>
                <div className={styles.envelopeBack} />
                <article className={styles.letter}>
                  <div className={styles.letterTop}>
                    <span>FROM YOUR CORNER OF THE INTERNET</span>
                    <Mail size={32} />
                  </div>
                  <h2 ref={heading} tabIndex={-1}>
                    Say hello<span>.</span>
                  </h2>
                  <p>
                    For a role, a project, or a conversation
                    <br className={styles.desktopBreak} /> about software.
                  </p>
                  <a
                    id="contact-address"
                    className={styles.email}
                    href={`mailto:${socials.email}`}
                  >
                    {socials.email}
                  </a>
                  <div className={styles.letterActions}>
                    <a href={`mailto:${socials.email}`}>
                      Open email <ArrowUpRight size={16} />
                    </a>
                    <button onClick={copyEmail}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                      {copied ? "Copied" : "Copy address"}
                    </button>
                  </div>
                  <div className={styles.letterSignoff}>
                    <span>
                      Thanks for stopping by.<strong>Lucky</strong>
                    </span>
                    <div>
                      <a href={socials.github} target="_blank" rel="noreferrer">
                        GitHub <ExternalLink size={13} />
                      </a>
                      <a
                        href={socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </article>
                <span className={styles.postmark}>
                  SENT WITH A LITTLE CURIOSITY
                </span>
              </div>
            )}
          </section>
        )}
      </div>

      <footer className={styles.footer}>
        {compact && <nav className={styles.roomLinks} aria-label="Room shortcuts"><a href="#work">Work</a><a href="#skills">Skills</a><a href="#projects">Projects</a><button onClick={() => window.dispatchEvent(new Event("arcade-guide"))}>Play arcade ↗</button></nav>}
        <div className={styles.controls}>
          <span className={styles.keyboardControls}>
            <kbd>←</kbd>
            <kbd>← → / A D</kbd> walk <kbd>↑ / W</kbd> jump <kbd>E</kbd> explore
          </span>
          <span className={styles.touchHint}>
            Tap to walk · Tap an object to explore
          </span>
        </div>
        <nav className={styles.bottomNav} aria-label="Room destinations">
          <button onClick={() => navigate("skills")} aria-current={open && section === "skills" ? "page" : undefined}><Wrench size={18} /><span>Skills</span></button>
          <button
            onClick={() => navigate("work")}
            aria-current={open && section === "work" ? "page" : undefined}
          >
            <Monitor size={18} />
            <span>Work</span>
          </button>
          <button
            onClick={() => navigate("about")}
            aria-current={open && section === "about" ? "page" : undefined}
          >
            <BookOpen size={18} />
            <span>About</span>
          </button>
          <button
            onClick={() => navigate("contact")}
            aria-current={open && section === "contact" ? "page" : undefined}
          >
            <Mail size={18} />
            <span>Contact</span>
          </button>
        </nav>
        <div className={styles.ambience}>
          <span>
            <Icon size={14} />
            {periodNames[period]}
          </span>
          <button
            onClick={() => toggleAudio("sound")}
            aria-pressed={sound}
            aria-label={
              sound
                ? "Turn interaction sounds off"
                : "Turn interaction sounds on"
            }
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>Sound {sound ? "on" : "off"}</span>
          </button>
          <button
            onClick={() => toggleAudio("music")}
            aria-pressed={music}
            aria-label={music ? "Turn background music off" : "Turn background music on"}
            title={`Background music ${music ? "on" : "off"}`}
          >
            <Music2 size={17} />
            <span>BGM {music ? "on" : "off"}</span>
          </button>
        </div>
      </footer>
      {arcadeOpen && <TaskArcade audio={roomAudio} onExit={() => { arcadeOpenRef.current = false; setArcadeOpen(false); keys.current.clear(); if (roomAudio) { setSound(roomAudio.sound); setMusic(roomAudio.music); } }}/>}
      <div className={styles.srOnly} aria-live="polite">
        {copied
          ? "Email address copied."
          : phase === "walking"
            ? `Walking to ${destinations[section].label}.`
            : phase === "open"
              ? `${destinations[section].label} opened.`
              : ""}
      </div>
    </div>
  );
}
