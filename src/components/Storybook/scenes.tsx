/* ============================================================
   scenes.tsx — a little paper diorama for every spread.

   Each scene composes soft paper shapes into a pop-up. Sky bits
   (sun, clouds, stars) drift gently and don't fold; ground bits
   fold up from the gutter via <Piece>. Painted with the spread's
   pastel accent so every chapter has its own mood.
   ============================================================ */

"use client";

import type { CSSProperties } from "react";
import {
  PopUpScene,
  Piece,
  Hill,
  Sun,
  Star,
  Tree,
  Cloudlet,
  House,
} from "./paper";
import styles from "./Storybook.module.css";

type SceneProps = { active: boolean; accent?: string };

const at = (left: string, bottom: string, z = 1): CSSProperties => ({
  position: "absolute",
  left,
  bottom,
  zIndex: z,
});

/** A cheerful paper stand-in of the Buddy — appears in scenes. */
function PaperPal({ size = 54 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 70" width={size} height={size * 1.15} aria-hidden>
      <rect x="6" y="10" width="48" height="52" rx="22" fill="var(--buddy-body)" />
      <circle cx="22" cy="34" r="5" fill="#fff" />
      <circle cx="38" cy="34" r="5" fill="#fff" />
      <circle cx="22" cy="35" r="2.4" fill="#2b2540" />
      <circle cx="38" cy="35" r="2.4" fill="#2b2540" />
      <ellipse cx="16" cy="45" rx="5" ry="3" fill="var(--buddy-cheek)" opacity="0.8" />
      <ellipse cx="44" cy="45" rx="5" ry="3" fill="var(--buddy-cheek)" opacity="0.8" />
      <path d="M24 47 Q30 52 36 47" stroke="#2b2540" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Sky({ children }: { children: React.ReactNode }) {
  return <div className={styles.sky}>{children}</div>;
}

/* ---------- Lighthouse · Blitzit ---------- */
function LighthouseScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Sun fill="#f8e6a6" size={78} /></span>
        <span className={styles.floatB}><Cloudlet fill="#fff" size={110} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("-4%", "0%", 1)}><Hill fill="#cdd9f7" w={460} h={140} /></Piece>
        <Piece style={at("6%", "2%", 3)} lean={-2}>
          <svg viewBox="0 0 90 200" width={90} height={200} aria-hidden>
            <path d="M28 200 L20 60 L70 60 L62 200 Z" fill="#fbf5ec" />
            <path d="M20 60 L70 60 L64 74 L26 74 Z" fill="var(--periwinkle)" />
            <path d="M25 96 L65 96 L62 112 L28 112 Z" fill="var(--periwinkle)" />
            <path d="M27 132 L63 132 L61 148 L29 148 Z" fill="var(--periwinkle)" />
            <rect x="30" y="34" width="30" height="26" rx="4" fill="#cfe0ff" />
            <path d="M26 34 L64 34 L58 20 L32 20 Z" fill="#e7a6bc" />
            <circle cx="45" cy="47" r="7" fill="#fff2b0" />
          </svg>
        </Piece>
        <Piece style={at("62%", "1%", 2)} lean={3}><Tree fill="#b6e5cd" size={80} /></Piece>
        <Piece style={at("74%", "0%", 4)}><PaperPal size={50} /></Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Island villa · Avana ---------- */
function VillaScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Sun fill="#f7d9b0" size={70} /></span>
        <span className={styles.floatB}><Cloudlet fill="#fff" size={90} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("2%", "0%", 1)}><Hill fill="#bfe1f6" w={440} h={120} /></Piece>
        <Piece style={at("18%", "3%", 3)}><House wall="#fbf5ec" roof="var(--mint)" w={150} h={150} /></Piece>
        <Piece style={at("4%", "2%", 2)} lean={-4}>
          <svg viewBox="0 0 80 140" width={70} height={120} aria-hidden>
            <rect x="35" y="60" width="9" height="74" rx="4" fill="#d8b48a" />
            <path d="M40 64 Q6 40 2 20 Q34 34 40 60Z" fill="var(--mint)" />
            <path d="M40 64 Q74 40 78 20 Q46 34 40 60Z" fill="var(--sage)" />
          </svg>
        </Piece>
        <Piece style={at("76%", "1%", 4)}><PaperPal size={48} /></Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Magic eraser · AutoRemov ---------- */
function EraserScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Star fill="#bfe1f6" size={22} /></span>
        <span className={styles.floatB}><Star fill="#cbb6ee" size={16} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("6%", "0%", 1)}><Hill fill="#d3ecfa" w={440} h={110} /></Piece>
        <Piece style={at("22%", "4%", 3)}>
          <svg viewBox="0 0 160 130" width={190} height={150} aria-hidden>
            <rect x="10" y="10" width="140" height="100" rx="10" fill="#fbf5ec" />
            <g>
              <rect x="10" y="10" width="20" height="20" fill="#e7eef7" />
              <rect x="50" y="10" width="20" height="20" fill="#e7eef7" />
              <rect x="30" y="30" width="20" height="20" fill="#e7eef7" />
              <rect x="70" y="30" width="20" height="20" fill="#e7eef7" />
            </g>
            <rect x="88" y="52" width="46" height="30" rx="6" fill="var(--sky)" transform="rotate(-18 110 66)" />
            <circle cx="150" cy="40" r="4" fill="#fff" />
            <circle cx="140" cy="26" r="3" fill="#fff" />
          </svg>
        </Piece>
        <Piece style={at("74%", "1%", 4)}><PaperPal size={48} /></Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Garage / shop · MaddyCustom ---------- */
function GarageScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Cloudlet fill="#fff" size={100} /></span>
        <span className={styles.floatB}><Sun fill="#f8e6a6" size={64} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("2%", "0%", 1)}><Hill fill="#f6d0dd" w={440} h={110} /></Piece>
        <Piece style={at("16%", "3%", 3)}>
          <svg viewBox="0 0 180 140" width={210} height={160} aria-hidden>
            <rect x="14" y="40" width="152" height="94" rx="8" fill="#fbf5ec" />
            <path d="M6 44 L90 12 L174 44 Z" fill="var(--blush)" />
            <rect x="34" y="66" width="52" height="52" rx="6" fill="var(--rose)" fillOpacity="0.5" />
            <rect x="98" y="66" width="52" height="52" rx="6" fill="var(--rose)" fillOpacity="0.5" />
            <rect x="70" y="30" width="40" height="16" rx="4" fill="#fff" />
          </svg>
        </Piece>
        <Piece style={at("70%", "1%", 4)} lean={2}>
          <svg viewBox="0 0 120 60" width={120} height={60} aria-hidden>
            <path d="M8 44 Q20 22 44 22 L84 22 Q104 22 112 44 Z" fill="var(--rose)" />
            <circle cx="34" cy="46" r="11" fill="#5b4a72" />
            <circle cx="90" cy="46" r="11" fill="#5b4a72" />
          </svg>
        </Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Neon rooftop · Spyll ---------- */
function RooftopScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Star fill="#fff" size={18} /></span>
        <span className={styles.floatB}><Star fill="#f6c3d4" size={14} /></span>
        <span className={styles.floatC}><Star fill="#fff" size={12} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("2%", "0%", 1)}>
          <svg viewBox="0 0 440 120" width={440} height={120} aria-hidden>
            <rect x="10" y="40" width="70" height="80" rx="6" fill="#b9a7e6" />
            <rect x="90" y="20" width="60" height="100" rx="6" fill="#cbb6ee" />
            <rect x="160" y="55" width="80" height="65" rx="6" fill="#b9a7e6" />
            <rect x="250" y="30" width="64" height="90" rx="6" fill="#cbb6ee" />
            <rect x="324" y="60" width="90" height="60" rx="6" fill="#b9a7e6" />
          </svg>
        </Piece>
        <Piece style={at("30%", "18%", 3)} lean={-3}>
          <svg viewBox="0 0 90 70" width={92} height={72} aria-hidden>
            <rect x="4" y="4" width="82" height="46" rx="16" fill="#fbf5ec" />
            <path d="M24 50 L24 64 L40 50 Z" fill="#fbf5ec" />
            <circle cx="30" cy="27" r="4" fill="var(--rose)" />
            <circle cx="45" cy="27" r="4" fill="var(--lilac)" />
            <circle cx="60" cy="27" r="4" fill="var(--periwinkle)" />
          </svg>
        </Piece>
        <Piece style={at("72%", "1%", 4)}><PaperPal size={46} /></Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Printing press · Dailicle ---------- */
function PressScene({ active }: SceneProps) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Sun fill="#f8e6a6" size={82} /></span>
        <span className={styles.floatB}><Cloudlet fill="#fff" size={96} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("4%", "0%", 1)}><Hill fill="#fbedb8" w={440} h={110} /></Piece>
        <Piece style={at("22%", "3%", 3)}>
          <svg viewBox="0 0 160 150" width={190} height={175} aria-hidden>
            <rect x="20" y="40" width="120" height="100" rx="8" fill="#fbf5ec" />
            <rect x="34" y="16" width="92" height="70" rx="6" fill="#fff" transform="rotate(-6 80 50)" />
            <line x1="46" y1="44" x2="112" y2="36" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
            <line x1="48" y1="58" x2="110" y2="50" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="72" x2="96" y2="66" stroke="var(--ink-faint)" strokeWidth="3" strokeLinecap="round" />
            <rect x="52" y="104" width="56" height="30" rx="5" fill="var(--butter)" />
          </svg>
        </Piece>
        <Piece style={at("72%", "1%", 4)}><PaperPal size={48} /></Piece>
      </PopUpScene>
    </div>
  );
}

/* ---------- Cover / Hello / Notes / End ---------- */
function MeadowScene({ active, pal = true }: SceneProps & { pal?: boolean }) {
  return (
    <div className={styles.scene}>
      <Sky>
        <span className={styles.floatA}><Sun fill="#f8e6a6" size={92} /></span>
        <span className={styles.floatB}><Cloudlet fill="#fff" size={120} /></span>
        <span className={styles.floatC}><Cloudlet fill="#fdf1f6" size={80} /></span>
      </Sky>
      <PopUpScene active={active} className={styles.diorama}>
        <Piece style={at("-6%", "0%", 1)}><Hill fill="#cfe3c4" w={480} h={150} /></Piece>
        <Piece style={at("55%", "0%", 2)}><Hill fill="#b6e5cd" w={360} h={120} /></Piece>
        <Piece style={at("14%", "6%", 3)} lean={2}><Tree fill="#a9dbc0" size={96} /></Piece>
        <Piece style={at("70%", "5%", 3)} lean={-3}><Tree fill="#cfe3c4" size={78} /></Piece>
        {pal && <Piece style={at("44%", "4%", 5)}><PaperPal size={62} /></Piece>}
      </PopUpScene>
    </div>
  );
}

const REGISTRY: Record<string, (p: SceneProps) => React.ReactNode> = {
  lighthouse: LighthouseScene,
  villa: VillaScene,
  eraser: EraserScene,
  garage: GarageScene,
  rooftop: RooftopScene,
  press: PressScene,
  meadow: MeadowScene,
};

export function Scene({ motif, active, accent }: { motif: string; active: boolean; accent?: string }) {
  const S = REGISTRY[motif] ?? MeadowScene;
  return <S active={active} accent={accent} />;
}
