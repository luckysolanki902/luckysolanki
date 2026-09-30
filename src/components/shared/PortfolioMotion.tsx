"use client";

import { useEffect } from "react";
import { deckPinTop, deckProgress } from "@/lib/project-deck";
import { weatherState } from "@/lib/weatherState";

/** One observer and one scroll-driven frame for the homepage. No React scroll state. */
export function PortfolioMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.querySelector("main");
    if (!main) return;
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contact");
    let raf = 0;
    let scenes: HTMLElement[] = [];
    let groups: { stack: HTMLElement; scenes: HTMLElement[]; cards: HTMLElement[]; stacked: boolean; tops: number[] }[] = [];
    let needsMeasure = true;
    let previousHero = "";
    const observed = new Set<HTMLElement>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    function discover() {
      scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-project-scene]"));
      groups = Array.from(new Set(scenes.map((scene) => scene.parentElement!))).map((stack) => {
        const members = scenes.filter((scene) => scene.parentElement === stack);
        return { stack, scenes: members, cards: members.map((scene) => scene.querySelector<HTMLElement>("[data-project-card]")!), stacked: false, tops: [] };
      });
      needsMeasure = true;
      main!.querySelectorAll<HTMLElement>("section:not(#hero) h2, [data-reveal], #about p, #about [class*='card'], #tools [class*='column'], #blog a, #contact [class*='email']").forEach((el) => {
        if (observed.has(el) || el.closest("#work, #about")) return;
        observed.add(el);
        // Content already in view never disappears during hydration or filtering.
        if (preference.matches || el.getBoundingClientRect().top < innerHeight) el.dataset.visible = "true";
        el.dataset.motion = "reveal";
        observer.observe(el);
      });
      schedule();
    }
    function frame() {
      raf = 0;
      const height = innerHeight;
      const heroRect = hero?.getBoundingClientRect();
      const contactRect = contact?.getBoundingClientRect();
      const topProgress = heroRect ? Math.min(1, Math.max(0, -heroRect.top / heroRect.height)) : 1;
      weatherState.atmosphere = topProgress < 0.8 || (contactRect && contactRect.top < height * 0.8) ? 1 : 0.18;
      if (needsMeasure) {
        groups.forEach((group) => {
          group.stacked = !preference.matches && !group.stack.querySelector("[aria-expanded='true'], :focus-visible");
          group.tops = group.scenes.map((scene, index) => deckPinTop(height, scene.offsetHeight, index));
        });
        needsMeasure = false;
      }
      const measurements = groups.map((group) => ({ group, rects: group.scenes.map((scene) => scene.getBoundingClientRect()) }));
      // Read first, then write, to avoid forcing a layout for every panel.
      const drift = `${preference.matches ? 0 : Math.round(topProgress * -110)}px`;
      if (drift !== previousHero) {
      previousHero = drift;
      hero?.style.setProperty("--hero-drift", drift);
      hero?.style.setProperty("--portrait-drift", `${preference.matches ? 0 : topProgress * -35}px`);
      hero?.style.setProperty("--name-travel", drift);
      }
      measurements.forEach(({ group, rects }) => {
        const { stack, cards, stacked } = group;
        const deck = stacked ? "on" : "off";
        if (stack.dataset.deck !== deck) stack.dataset.deck = deck;
        cards.forEach((card, i) => {
          const next = rects[i + 1];
          const pinTop = `${group.tops[i]}px`;
          if (group.scenes[i].style.getPropertyValue("--deck-top") !== pinTop) group.scenes[i].style.setProperty("--deck-top", pinTop);
          card.style.transformOrigin = group.tops[i] < 0 ? "center bottom" : "center top";
          const progress = stacked && next ? deckProgress(height, next.top, group.tops[i + 1]) : 0;
          const transform = progress > 0 ? `translate3d(0, ${(-progress * 8).toFixed(2)}px, 0) scale(${(1 - progress * .035).toFixed(4)})` : "none";
          if (card.style.transform !== transform) card.style.transform = transform;
          const visible = stacked && rects[i].top < height * 1.3 && rects[i].bottom > 0;
          const willChange = visible ? "transform" : "auto";
          if (card.style.willChange !== willChange) card.style.willChange = willChange;
        });
      });
    }
    function schedule() {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    }
    const measure = () => { needsMeasure = true; schedule(); };
    const resize = new ResizeObserver(measure);
    resize.observe(main);
    const mutations = new MutationObserver(discover);
    mutations.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });
    discover();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    main.addEventListener("focusin", measure);
    main.addEventListener("focusout", measure);
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      main?.removeEventListener("focusin", measure);
      main?.removeEventListener("focusout", measure);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", measure);
      hero?.style.removeProperty("--hero-drift");
      hero?.style.removeProperty("--portrait-drift");
      hero?.style.removeProperty("--name-travel");
      observed.forEach((el) => { delete el.dataset.motion; delete el.dataset.visible; });
      weatherState.atmosphere = 1;
    };
  }, []);
  return null;
}
