/* ============================================================
   BUDDY TRIGGERS — 120+ contextual messages.
   Every event type has 3-6 variant messages for organic feel.
   Engine uses weighted-random + recent-avoidance to pick.

   Design principles:
   - Variable ratio schedule: unpredictable = engaging
   - Peak-End Rule: strongest at first/last moments
   - Pattern interrupt: unexpected lines hold attention
   - Reward prediction errors: vary timing + content
   ============================================================ */

export type BuddyMood =
  | "idle"
  | "happy"
  | "wave"
  | "wink"
  | "think"
  | "excited"
  | "sad"
  | "sleep"
  | "peek"
  | "love"
  | "shocked"
  | "blink"
  | "dizzy";

export interface BuddyTrigger {
  id: string;
  message: string;
  mood: BuddyMood;
  /** Higher = more likely picked + takes precedence in queue */
  priority: number;
  /** Seconds before this trigger can fire again */
  cooldown: number;
  /** If true, can only fire once per session */
  once?: boolean;
}

/* -----------------------------------------------------------
   SECTION ENTER — 3-4 variants per section
   ----------------------------------------------------------- */
export const sectionEnterTriggers: Record<string, BuddyTrigger[]> = {
  hero: [
    { id: "hero-1", message: "Hey! Welcome in.", mood: "wave", priority: 10, cooldown: 0, once: true },
  ],
  about: [
    { id: "about-1", message: "Oh, getting to know him? Good call.", mood: "happy", priority: 8, cooldown: 120, once: true },
    { id: "about-2", message: "Self-taught coder. That takes a specific kind of stubborn.", mood: "think", priority: 7, cooldown: 120, once: true },
    { id: "about-3", message: "Fair warning: this part might make you like him.", mood: "wink", priority: 6, cooldown: 120, once: true },
    { id: "about-4", message: "The origin story. Everyone has one.", mood: "think", priority: 5, cooldown: 120, once: true },
  ],
  work: [
    { id: "work-1", message: "This is the good part.", mood: "excited", priority: 8, cooldown: 120, once: true },
    { id: "work-2", message: "He actually shipped all of these.", mood: "happy", priority: 7, cooldown: 120, once: true },
    { id: "work-3", message: "Real products. Real users. Real deadlines.", mood: "think", priority: 6, cooldown: 120, once: true },
    { id: "work-4", message: "Buckle up. These are good.", mood: "wink", priority: 5, cooldown: 120, once: true },
  ],
  tools: [
    { id: "tools-1", message: "He picks up new frameworks like groceries.", mood: "wink", priority: 8, cooldown: 120, once: true },
    { id: "tools-2", message: "These aren't just logos. He's shipped with all of them.", mood: "think", priority: 7, cooldown: 120, once: true },
    { id: "tools-3", message: "Most devs list tools they touched once. Not this guy.", mood: "happy", priority: 6, cooldown: 120, once: true },
  ],
  contact: [
    { id: "contact-1", message: "Go on, say hi. He doesn't bite.", mood: "happy", priority: 8, cooldown: 0, once: true },
    { id: "contact-2", message: "This is the part where you reach out.", mood: "wink", priority: 7, cooldown: 120, once: true },
    { id: "contact-3", message: "I also know his phone number. But I won't tell.", mood: "wink", priority: 5, cooldown: 120, once: true },
    { id: "contact-4", message: "Every great collab started with an awkward first email.", mood: "think", priority: 6, cooldown: 120, once: true },
  ],
};

/* -----------------------------------------------------------
   IDLE — 3 variants per threshold tier
   ----------------------------------------------------------- */
export const idleTriggers: { after: number; triggers: BuddyTrigger[] }[] = [
  {
    after: 14,
    triggers: [
      { id: "idle-1a", message: "You're not rushing this. Good.", mood: "idle", priority: 3, cooldown: 35 },
      { id: "idle-1b", message: "Quiet moment. The internet doesn't do these often.", mood: "idle", priority: 3, cooldown: 35 },
      { id: "idle-1c", message: "Still here. Still pixelated.", mood: "wink", priority: 3, cooldown: 35 },
    ],
  },
  {
    after: 28,
    triggers: [
      { id: "idle-2a", message: "Most people skim this. You didn't.", mood: "happy", priority: 3, cooldown: 50 },
      { id: "idle-2b", message: "You paused here longer than most.", mood: "think", priority: 3, cooldown: 50 },
      { id: "idle-2c", message: "Something caught your eye. I can tell.", mood: "happy", priority: 3, cooldown: 50 },
    ],
  },
  {
    after: 45,
    triggers: [
      { id: "idle-3a", message: "*yawns* ...still here though.", mood: "sleep", priority: 3, cooldown: 60 },
      { id: "idle-3b", message: "Settled in. I respect the commitment.", mood: "sleep", priority: 3, cooldown: 60 },
      { id: "idle-3c", message: "Still here? Most people bounce by now.", mood: "wink", priority: 3, cooldown: 60 },
    ],
  },
  {
    after: 70,
    triggers: [
      { id: "idle-4a", message: "Fun fact: Lucky once debugged for 14 hours straight.", mood: "think", priority: 2, cooldown: 90 },
      { id: "idle-4b", message: "Did you know he also does mechanical engineering? Wild combo.", mood: "think", priority: 2, cooldown: 90 },
      { id: "idle-4c", message: "Quick thought: this page runs on zero external API calls.", mood: "wink", priority: 2, cooldown: 90 },
    ],
  },
  {
    after: 100,
    triggers: [
      { id: "idle-5a", message: "I could literally watch you scroll all day.", mood: "wink", priority: 2, cooldown: 120 },
      { id: "idle-5b", message: "Still around? You and this page have a connection.", mood: "love", priority: 2, cooldown: 120 },
      { id: "idle-5c", message: "Most visitors are gone by now. You're different.", mood: "happy", priority: 2, cooldown: 120 },
    ],
  },
  {
    after: 140,
    triggers: [
      { id: "idle-6a", message: "OK I'm going to nap. Poke me if you need anything.", mood: "sleep", priority: 1, cooldown: 300 },
      { id: "idle-6b", message: "Nap time. Wake me up for important stuff.", mood: "sleep", priority: 1, cooldown: 300 },
    ],
  },
];

/* -----------------------------------------------------------
   CURSOR LEFT / RETURNED — 7 + 6 variants
   ----------------------------------------------------------- */
export const cursorLeftTriggers: BuddyTrigger[] = [
  { id: "leave-1", message: "Wait, where are you going?", mood: "sad", priority: 6, cooldown: 25 },
  { id: "leave-2", message: "Leaving mid-scroll? Cold move.", mood: "sad", priority: 6, cooldown: 25 },
  { id: "leave-3", message: "Fine. Leave. See if I care. ...I care.", mood: "sad", priority: 6, cooldown: 30 },
  { id: "leave-4", message: "The other tabs aren't as interesting.", mood: "wink", priority: 6, cooldown: 30 },
  { id: "leave-5", message: "Don't leave me with the footer.", mood: "sad", priority: 6, cooldown: 25 },
  { id: "leave-6", message: "You left mid-sentence. That's just rude.", mood: "sad", priority: 6, cooldown: 30 },
  { id: "leave-7", message: "Off to compare portfolios? Bold move.", mood: "wink", priority: 6, cooldown: 35 },
];

export const cursorReturnTriggers: BuddyTrigger[] = [
  { id: "return-1", message: "The pull is real.", mood: "excited", priority: 7, cooldown: 25 },
  { id: "return-2", message: "Called it.", mood: "wink", priority: 7, cooldown: 25 },
  { id: "return-3", message: "Missed me? Yeah, you missed me.", mood: "happy", priority: 7, cooldown: 30 },
  { id: "return-4", message: "Welcome back. Act natural.", mood: "wink", priority: 7, cooldown: 30 },
  { id: "return-5", message: "Nothing out there worth staying for.", mood: "happy", priority: 7, cooldown: 25 },
  { id: "return-6", message: "Told you this tab was better.", mood: "wink", priority: 7, cooldown: 35 },
];

/* -----------------------------------------------------------
   SCROLL — split by event type, 4-6 variants each
   ----------------------------------------------------------- */
export const scrollFastTriggers: BuddyTrigger[] = [
  { id: "sfast-1", message: "Whoa, slow down speed racer!", mood: "shocked", priority: 5, cooldown: 25 },
  { id: "sfast-2", message: "Speedrunning my portfolio?", mood: "wink", priority: 5, cooldown: 25 },
  { id: "sfast-3", message: "You scroll like you owe someone money.", mood: "think", priority: 5, cooldown: 25 },
  { id: "sfast-4", message: "Blink and you'll miss the good stuff.", mood: "happy", priority: 5, cooldown: 25 },
  { id: "sfast-5", message: "You scroll like you're late for something.", mood: "wink", priority: 5, cooldown: 25 },
  { id: "sfast-6", message: "Racing to the bottom? The middle's good too.", mood: "think", priority: 5, cooldown: 25 },
];

export const scrollTopTriggers: BuddyTrigger[] = [
  { id: "stop-1", message: "Back to the top? Forgot something or just nostalgic?", mood: "wink", priority: 5, cooldown: 30 },
  { id: "stop-2", message: "Starting over? Must've missed something good.", mood: "happy", priority: 5, cooldown: 30 },
  { id: "stop-3", message: "Back at the top. Something didn't sit right, huh?", mood: "think", priority: 5, cooldown: 30 },
  { id: "stop-4", message: "Full circle. I like your style.", mood: "wink", priority: 5, cooldown: 30 },
];

export const scrollBottomTriggers: BuddyTrigger[] = [
  { id: "sbot-1", message: "Last pixel. You actually stayed.", mood: "love", priority: 8, cooldown: 0, once: true },
  { id: "sbot-2", message: "You read everything. That's either dedication or procrastination.", mood: "happy", priority: 8, cooldown: 0, once: true },
  { id: "sbot-3", message: "Most people don't make it this far.", mood: "excited", priority: 8, cooldown: 0, once: true },
];

export const scrollMilestoneTriggers: BuddyTrigger[] = [
  { id: "scroll-25", message: "25% in. The best part is coming.", mood: "happy", priority: 3, cooldown: 0, once: true },
  { id: "scroll-50", message: "Halfway through. You're committed now.", mood: "wink", priority: 3, cooldown: 0, once: true },
  { id: "scroll-75", message: "Almost done. Saving the best for last.", mood: "excited", priority: 3, cooldown: 0, once: true },
];

/* -----------------------------------------------------------
   RAPID SCROLL (direction changes) — 4 variants
   ----------------------------------------------------------- */
export const rapidScrollTriggers: BuddyTrigger[] = [
  { id: "rapid-1", message: "You OK? Scrolling like you lost your keys.", mood: "think", priority: 5, cooldown: 30 },
  { id: "rapid-2", message: "Up, down, up, down. Looking for something?", mood: "wink", priority: 5, cooldown: 30 },
  { id: "rapid-3", message: "Easy on the scroll. The page doesn't move.", mood: "happy", priority: 5, cooldown: 30 },
  { id: "rapid-4", message: "Whiplash scrolling. Classic move.", mood: "wink", priority: 5, cooldown: 30 },
];

/* -----------------------------------------------------------
   TIME-OF-DAY GREETINGS
   ----------------------------------------------------------- */
export function getTimeGreeting(): BuddyTrigger {
  const h = new Date().getHours();
  if (h < 6) return { id: "time-night", message: "Past midnight? Building something or can't sleep?", mood: "think", priority: 1, cooldown: 0 };
  if (h < 12) return { id: "time-morning", message: "Good morning! Fresh eyes, fresh code.", mood: "happy", priority: 1, cooldown: 0 };
  if (h < 17) return { id: "time-afternoon", message: "Afternoon browsing. Scouting talent?", mood: "wink", priority: 1, cooldown: 0 };
  if (h < 21) return { id: "time-evening", message: "Evening visit. The best ideas come after sunset.", mood: "happy", priority: 1, cooldown: 0 };
  return { id: "time-late", message: "Late night browsing. The real work happens now.", mood: "wink", priority: 1, cooldown: 0 };
}

/* -----------------------------------------------------------
   THEME TOGGLE — 3 per theme
   ----------------------------------------------------------- */
export const themeToggleTriggers: Record<string, BuddyTrigger[]> = {
  dark: [
    { id: "theme-dark-1", message: "Dark mode. A person of culture.", mood: "wink", priority: 7, cooldown: 15 },
    { id: "theme-dark-2", message: "Ah, dark mode. My eyes thank you.", mood: "happy", priority: 7, cooldown: 15 },
    { id: "theme-dark-3", message: "The dark side has better contrast.", mood: "wink", priority: 7, cooldown: 15 },
  ],
  light: [
    { id: "theme-light-1", message: "Whoa. Bright mode. Brave.", mood: "happy", priority: 7, cooldown: 15 },
    { id: "theme-light-2", message: "Light mode? In this economy?", mood: "wink", priority: 7, cooldown: 15 },
    { id: "theme-light-3", message: "Light mode activated. Nowhere to hide now.", mood: "happy", priority: 7, cooldown: 15 },
  ],
};

/* -----------------------------------------------------------
   CLICK TRIGGERS — 2-3 per target
   ----------------------------------------------------------- */
export const clickTriggers: Record<string, BuddyTrigger[]> = {
  resume: [
    { id: "click-resume-1", message: "That resume's been downloaded more times than most apps.", mood: "excited", priority: 9, cooldown: 12 },
    { id: "click-resume-2", message: "Downloading the evidence. Good call.", mood: "wink", priority: 9, cooldown: 12 },
    { id: "click-resume-3", message: "That PDF has seen things.", mood: "happy", priority: 9, cooldown: 12 },
  ],
  email: [
    { id: "click-email-1", message: "Composing a message? I'll look away...", mood: "peek", priority: 8, cooldown: 15 },
    { id: "click-email-2", message: "Good call. He actually checks his email.", mood: "happy", priority: 8, cooldown: 15 },
  ],
  github: [
    { id: "click-gh-1", message: "Careful, you might get lost in the commit history.", mood: "wink", priority: 6, cooldown: 15 },
    { id: "click-gh-2", message: "The source code speaks for itself.", mood: "think", priority: 6, cooldown: 15 },
  ],
  linkedin: [
    { id: "click-li-1", message: "Connect with him. He actually replies.", mood: "happy", priority: 6, cooldown: 15 },
    { id: "click-li-2", message: "Ah, the professional networking move.", mood: "wink", priority: 6, cooldown: 15 },
  ],
  projectSpyll: [
    { id: "click-spyll-1", message: "1,300+ colleges. Built from a dorm room.", mood: "excited", priority: 7, cooldown: 30 },
    { id: "click-spyll-2", message: "Spyll is the big one. Pay attention.", mood: "wink", priority: 7, cooldown: 30 },
  ],
  projectMaddy: [
    { id: "click-maddy-1", message: "100K users on a bootstrapped budget. Wild.", mood: "shocked", priority: 7, cooldown: 30 },
    { id: "click-maddy-2", message: "MaddyCustom. Where it all started.", mood: "happy", priority: 7, cooldown: 30 },
  ],
  projectBlitzit: [
    { id: "click-blitz-1", message: "MCP servers and AI agents. He builds the infra.", mood: "think", priority: 7, cooldown: 30 },
    { id: "click-blitz-2", message: "Blitz.it. AI tooling at its finest.", mood: "excited", priority: 7, cooldown: 30 },
  ],
  projectAvana: [
    { id: "click-avana-1", message: "Multi-agent AI for Bali real estate. Only Lucky.", mood: "wink", priority: 7, cooldown: 30 },
    { id: "click-avana-2", message: "Avana. Where AI meets paradise.", mood: "happy", priority: 7, cooldown: 30 },
  ],
  projectDailicle: [
    { id: "click-dai-1", message: "An essay every morning at 9 AM. Automated poetry.", mood: "love", priority: 7, cooldown: 30 },
    { id: "click-dai-2", message: "Dailicle. AI-written, human-curated.", mood: "think", priority: 7, cooldown: 30 },
  ],
};

/* -----------------------------------------------------------
   BUDDY CLICK (poke) — 15 variants
   ----------------------------------------------------------- */
export const buddyClickTriggers: BuddyTrigger[] = [
  { id: "poke-1", message: "Hey! That tickles.", mood: "happy", priority: 10, cooldown: 3 },
  { id: "poke-2", message: "I'm not a button, I'm a companion.", mood: "wink", priority: 10, cooldown: 3 },
  { id: "poke-3", message: "Boop!", mood: "excited", priority: 10, cooldown: 3 },
  { id: "poke-4", message: "Fun fact: Lucky coded me at 2 AM.", mood: "think", priority: 9, cooldown: 5 },
  { id: "poke-5", message: "I'm pure CSS and TypeScript. No images.", mood: "happy", priority: 9, cooldown: 5 },
  { id: "poke-6", message: "Looking for an easter egg? ...maybe.", mood: "wink", priority: 8, cooldown: 8 },
  { id: "poke-7", message: "Poked more than a Facebook wall in 2010.", mood: "wink", priority: 8, cooldown: 8 },
  { id: "poke-8", message: "Secret: he watches Mech Eng lectures for fun.", mood: "peek", priority: 7, cooldown: 15 },
  { id: "poke-9", message: "You know I can feel that right?", mood: "shocked", priority: 10, cooldown: 3 },
  { id: "poke-10", message: "Three pokes and I grant a wish. Just kidding.", mood: "wink", priority: 9, cooldown: 5 },
  { id: "poke-11", message: "OK now you're just poking me.", mood: "think", priority: 10, cooldown: 3 },
  { id: "poke-12", message: "I charge per poke after the fifth one.", mood: "wink", priority: 9, cooldown: 5 },
  { id: "poke-13", message: "Do I poke you at work? No. Boundaries.", mood: "think", priority: 8, cooldown: 8 },
  { id: "poke-14", message: "Each poke makes me 1 pixel stronger.", mood: "excited", priority: 9, cooldown: 5 },
  { id: "poke-15", message: "Hello yes I am a pixel. Stop poking.", mood: "happy", priority: 10, cooldown: 3 },
];

/* -----------------------------------------------------------
   VISIT COUNT
   ----------------------------------------------------------- */
export const visitCountTriggers: BuddyTrigger[] = [
  { id: "visit-2", message: "Welcome back! Told you you'd return.", mood: "wink", priority: 9, cooldown: 0, once: true },
  { id: "visit-3", message: "Third time's a charm. Thinking about reaching out?", mood: "happy", priority: 9, cooldown: 0, once: true },
  { id: "visit-5", message: "Five visits! At this point we're friends.", mood: "love", priority: 9, cooldown: 0, once: true },
];

/* -----------------------------------------------------------
   SPECIAL / SEASONAL
   ----------------------------------------------------------- */
export function getSpecialTrigger(): BuddyTrigger | null {
  const now = new Date();
  const m = now.getMonth();
  const d = now.getDate();
  if (m === 0 && d <= 3) return { id: "ny", message: "Happy New Year! New year, new projects.", mood: "excited", priority: 10, cooldown: 0 };
  if (m === 1 && d === 14) return { id: "val", message: "Happy Valentine's. Fall in love with good code.", mood: "love", priority: 10, cooldown: 0 };
  if (m === 3 && d === 1) return { id: "apr", message: "404: Buddy not found. ...Just kidding!", mood: "wink", priority: 10, cooldown: 0 };
  if (m === 9 && d === 31) return { id: "hal", message: "Boo! Scared you? No? OK.", mood: "peek", priority: 10, cooldown: 0 };
  if (m === 11 && d >= 24 && d <= 26) return { id: "xmas", message: "Merry Christmas. Best gift is clean code.", mood: "happy", priority: 10, cooldown: 0 };
  return null;
}

/* -----------------------------------------------------------
   SECRET — Konami code
   ----------------------------------------------------------- */
export const secretTrigger: BuddyTrigger = {
  id: "konami",
  message: "You found it! Lucky's first game was in Unity with hand-drawn sprites.",
  mood: "excited",
  priority: 20,
  cooldown: 0,
  once: true,
};

/* -----------------------------------------------------------
   COPY TEXT — 4 variants
   ----------------------------------------------------------- */
export const copyTriggers: BuddyTrigger[] = [
  { id: "copy-1", message: "Copying notes? Must be impressive stuff.", mood: "wink", priority: 5, cooldown: 20 },
  { id: "copy-2", message: "Ctrl+C detected. Taking notes?", mood: "think", priority: 5, cooldown: 20 },
  { id: "copy-3", message: "Save that for the team meeting.", mood: "wink", priority: 5, cooldown: 20 },
  { id: "copy-4", message: "Copying that? It probably deserves it.", mood: "happy", priority: 5, cooldown: 20 },
];

/* -----------------------------------------------------------
   TAB RETURN — 5 variants
   ----------------------------------------------------------- */
export const tabReturnTriggers: BuddyTrigger[] = [
  { id: "tab-1", message: "That other tab wasn't it, huh?", mood: "happy", priority: 6, cooldown: 20 },
  { id: "tab-2", message: "Still here. Unlike that other tab.", mood: "wink", priority: 6, cooldown: 20 },
  { id: "tab-3", message: "Welcome back. I counted the seconds.", mood: "happy", priority: 6, cooldown: 25 },
  { id: "tab-4", message: "Two tabs later and you're back. Told you.", mood: "wink", priority: 6, cooldown: 25 },
  { id: "tab-5", message: "The internet is huge and you came back here. Flattering.", mood: "happy", priority: 6, cooldown: 20 },
];

/* -----------------------------------------------------------
   RESIZE — 3 variants
   ----------------------------------------------------------- */
export const resizeTriggers: BuddyTrigger[] = [
  { id: "resize-1", message: "Cozy screen. I'll make myself comfortable.", mood: "happy", priority: 3, cooldown: 30 },
  { id: "resize-2", message: "New size? I'll reflow. I'm responsive like that.", mood: "wink", priority: 3, cooldown: 30 },
  { id: "resize-3", message: "Dragging edges like you're testing me. I pass.", mood: "happy", priority: 3, cooldown: 30 },
];

/* -----------------------------------------------------------
   INTENT TRIGGERS — perceptive messages
   ----------------------------------------------------------- */
export const intentTriggers: Record<string, BuddyTrigger[]> = {
  "focused-reading": [
    { id: "int-focus-1", message: "Oh wait, you're actually reading? Most people don't.", mood: "happy", priority: 7, cooldown: 60 },
    { id: "int-focus-2", message: "A careful reader. That's either thorough or suspicious.", mood: "happy", priority: 7, cooldown: 60 },
    { id: "int-focus-3", message: "Don't skim this part. It's worth the read.", mood: "wink", priority: 7, cooldown: 60 },
  ],
  "recruiter-scan": [
    { id: "int-scan-1", message: "Let me save you time — shipped to 100K+ users.", mood: "wink", priority: 9, cooldown: 0, once: true },
    { id: "int-scan-2", message: "Speed reader? Highlight: he builds things people use.", mood: "think", priority: 9, cooldown: 0, once: true },
  ],
  "deep-dive": [
    { id: "int-deep-1", message: "You've been here a while. That's either interest or confusion.", mood: "happy", priority: 5, cooldown: 90 },
    { id: "int-deep-2", message: "Deep dive mode. No turning back now.", mood: "think", priority: 5, cooldown: 90 },
    { id: "int-deep-3", message: "You've been staring at this section. It's that good.", mood: "wink", priority: 5, cooldown: 90 },
  ],
  "comparing": [
    { id: "int-comp-1", message: "Going back and forth? Need a summary?", mood: "think", priority: 5, cooldown: 60, once: true },
    { id: "int-comp-2", message: "Going back and forth. Weighing your options?", mood: "wink", priority: 5, cooldown: 60 },
  ],
};

/* -----------------------------------------------------------
   HOVER TRIGGERS — reacts to hovering page elements
   ----------------------------------------------------------- */
export const hoverTriggers: Record<string, BuddyTrigger[]> = {
  resume: [
    { id: "hover-res-1", message: "Ooh, eyeing the resume? Go on, download it.", mood: "excited", priority: 8, cooldown: 25 },
    { id: "hover-res-2", message: "That PDF is fire. Trust me.", mood: "wink", priority: 8, cooldown: 25 },
    { id: "hover-res-3", message: "One click away from hiring the right person.", mood: "happy", priority: 8, cooldown: 25 },
  ],
  email: [
    { id: "hover-email-1", message: "Thinking about saying hi? Do it.", mood: "happy", priority: 7, cooldown: 25 },
    { id: "hover-email-2", message: "He reads every email. Even the weird ones.", mood: "wink", priority: 7, cooldown: 25 },
    { id: "hover-email-3", message: "Subject line idea: 'Saw your portfolio, wow.'", mood: "wink", priority: 7, cooldown: 25 },
  ],
  github: [
    { id: "hover-gh-1", message: "The commit graph doesn't lie.", mood: "think", priority: 6, cooldown: 25 },
    { id: "hover-gh-2", message: "Warning: you might get nerd-sniped by the repos.", mood: "wink", priority: 6, cooldown: 25 },
    { id: "hover-gh-3", message: "Green squares incoming.", mood: "happy", priority: 6, cooldown: 25 },
  ],
  linkedin: [
    { id: "hover-li-1", message: "LinkedIn hover. That's either a hire or a stalk.", mood: "wink", priority: 6, cooldown: 25 },
    { id: "hover-li-2", message: "He actually accepts connection requests.", mood: "happy", priority: 6, cooldown: 25 },
    { id: "hover-li-3", message: "LinkedIn? Bold move. Hit connect.", mood: "wink", priority: 6, cooldown: 25 },
  ],
  story: [
    { id: "hover-story-1", message: "A story, huh? He gets deep sometimes.", mood: "think", priority: 6, cooldown: 25 },
    { id: "hover-story-2", message: "Fair warning: those are actually well-written.", mood: "wink", priority: 6, cooldown: 25 },
    { id: "hover-story-3", message: "Late-night thoughts, shipped as HTML.", mood: "happy", priority: 6, cooldown: 25 },
  ],
  project: [
    { id: "hover-proj-1", message: "This one's good. Click it.", mood: "excited", priority: 6, cooldown: 20 },
    { id: "hover-proj-2", message: "Real users. Real code. Not just a demo.", mood: "think", priority: 6, cooldown: 20 },
    { id: "hover-proj-3", message: "Hover harder. The details are worth it.", mood: "wink", priority: 6, cooldown: 20 },
    { id: "hover-proj-4", message: "I'd click that if I had hands.", mood: "happy", priority: 6, cooldown: 20 },
  ],
};

/* -----------------------------------------------------------
   BUDDY HIDE — scurries to corner when hovered
   ----------------------------------------------------------- */
export const buddyHideTriggers: BuddyTrigger[] = [
  { id: "hide-1", message: "...you can't see me.", mood: "peek", priority: 10, cooldown: 8 },
  { id: "hide-2", message: "ABORT. HIDING.", mood: "shocked", priority: 10, cooldown: 8 },
  { id: "hide-3", message: "Pretending to be a dead pixel...", mood: "peek", priority: 10, cooldown: 8 },
  { id: "hide-4", message: "Nope nope nope.", mood: "shocked", priority: 10, cooldown: 8 },
  { id: "hide-5", message: "I was never here.", mood: "peek", priority: 10, cooldown: 8 },
];

/* -----------------------------------------------------------
   BUDDY SIGH — relief after cursor leaves buddy area
   ----------------------------------------------------------- */
export const buddySighTriggers: BuddyTrigger[] = [
  { id: "sigh-1", message: "*sigh* ...that was close.", mood: "idle", priority: 10, cooldown: 10 },
  { id: "sigh-2", message: "OK they're gone. Act natural.", mood: "wink", priority: 10, cooldown: 10 },
  { id: "sigh-3", message: "Back to lurking. That's my zone.", mood: "happy", priority: 10, cooldown: 10 },
  { id: "sigh-4", message: "False alarm. I was never scared.", mood: "idle", priority: 10, cooldown: 10 },
];

/* -----------------------------------------------------------
   NAV HOVER — reacts when hovering nav links
   ----------------------------------------------------------- */
export const navHoverTriggers: Record<string, BuddyTrigger[]> = {
  about: [
    { id: "nav-about-1", message: "Hovering on About. Curiosity looks good on you.", mood: "happy", priority: 6, cooldown: 20 },
    { id: "nav-about-2", message: "The backstory section. It's a good one.", mood: "wink", priority: 6, cooldown: 20 },
    { id: "nav-about-3", message: "Go on. Get to know the human.", mood: "think", priority: 6, cooldown: 20 },
  ],
  work: [
    { id: "nav-work-1", message: "That's where the magic lives.", mood: "excited", priority: 6, cooldown: 20 },
    { id: "nav-work-2", message: "Real projects. Real impact.", mood: "wink", priority: 6, cooldown: 20 },
    { id: "nav-work-3", message: "Warning: you'll be impressed.", mood: "happy", priority: 6, cooldown: 20 },
  ],
  contact: [
    { id: "nav-contact-1", message: "Going straight for the contact? Bold.", mood: "wink", priority: 6, cooldown: 20 },
    { id: "nav-contact-2", message: "Yes. Reach out. He's friendly.", mood: "happy", priority: 6, cooldown: 20 },
    { id: "nav-contact-3", message: "One click away from a conversation.", mood: "think", priority: 6, cooldown: 20 },
  ],
};

/* -----------------------------------------------------------
   RARE MOMENTS — ~1% chance events
   Four flavors: glitch, fourth wall, existential, silence-break
   ----------------------------------------------------------- */
export const rareTriggers: BuddyTrigger[] = [
  // Glitch breaks
  { id: "rare-glitch-1", message: "E̵R̴R̸O̷R̸:̷ ̴u̵n̷e̸x̶p̸e̵c̸t̴e̷d̶ ̷f̸e̸e̸l̶i̷n̷g̵s̶.̶ ̷I̵g̷n̵o̵r̴e̶.", mood: "dizzy", priority: 12, cooldown: 300, once: false },
  { id: "rare-glitch-2", message: "...wait. who wrote my lines?", mood: "shocked", priority: 12, cooldown: 300, once: false },
  // Fourth wall
  { id: "rare-wall-1", message: "Between us — he's been staring at this code for 6 hours.", mood: "peek", priority: 12, cooldown: 300, once: false },
  { id: "rare-wall-2", message: "I'm not supposed to say this, but I like you.", mood: "love", priority: 12, cooldown: 300, once: false },
  { id: "rare-wall-3", message: "He can't see this conversation. Just us.", mood: "peek", priority: 12, cooldown: 300, once: false },
  // Existential
  { id: "rare-exist-1", message: "Do pixel blobs dream? Asking for myself.", mood: "think", priority: 12, cooldown: 300, once: false },
  { id: "rare-exist-2", message: "I'm made of box-shadows. Philosophically that's wild.", mood: "think", priority: 12, cooldown: 300, once: false },
  // Silence-break (after long quiet)
  { id: "rare-silence-1", message: "OK I've been quiet long enough. Hi.", mood: "wave", priority: 12, cooldown: 300, once: false },
  { id: "rare-silence-2", message: "The silence was getting weird. For me, not you.", mood: "wink", priority: 12, cooldown: 300, once: false },
];

/* -----------------------------------------------------------
   BEHAVIOR MEMORY — references what user has done before
   Fired on tab return or repeat visits when behavior is known
   ----------------------------------------------------------- */
export const behaviorMemoryTriggers: Record<string, BuddyTrigger[]> = {
  github: [
    { id: "mem-gh-1", message: "You always check GitHub first. Noted.", mood: "wink", priority: 9, cooldown: 0, once: true },
    { id: "mem-gh-2", message: "Back for the repos again. I see you.", mood: "think", priority: 9, cooldown: 0, once: true },
  ],
  resume: [
    { id: "mem-res-1", message: "You downloaded the resume last time too. Good taste.", mood: "happy", priority: 9, cooldown: 0, once: true },
    { id: "mem-res-2", message: "The resume again. I'm building a profile on you.", mood: "wink", priority: 9, cooldown: 0, once: true },
  ],
  project: [
    { id: "mem-proj-1", message: "You spent a lot of time on the projects last time.", mood: "think", priority: 9, cooldown: 0, once: true },
    { id: "mem-proj-2", message: "Straight to the work section. Efficient.", mood: "wink", priority: 9, cooldown: 0, once: true },
  ],
  contact: [
    { id: "mem-cont-1", message: "You lingered here last time. Still thinking about it?", mood: "wink", priority: 9, cooldown: 0, once: true },
  ],
  linkedin: [
    { id: "mem-li-1", message: "LinkedIn again. You're thorough.", mood: "happy", priority: 9, cooldown: 0, once: true },
  ],
};

/* -----------------------------------------------------------
   PROGRESSION ARC — personality shifts by visit number
   Replaces/supplements standard greeting on repeat visits
   ----------------------------------------------------------- */
export const progressionTriggers: Record<number, BuddyTrigger> = {
  2: { id: "prog-2", message: "You're back. I had a feeling you would be.", mood: "wink", priority: 10, cooldown: 0, once: true },
  3: { id: "prog-3", message: "Third visit. You're either very interested or very indecisive.", mood: "think", priority: 10, cooldown: 0, once: true },
  4: { id: "prog-4", message: "Four times. At what point do you just reach out?", mood: "wink", priority: 10, cooldown: 0, once: true },
  5: { id: "prog-5", message: "Five visits. We should probably be on a first-name basis.", mood: "love", priority: 10, cooldown: 0, once: true },
  6: { id: "prog-6", message: "Six visits. I'm starting to feel responsible for you.", mood: "happy", priority: 10, cooldown: 0, once: true },
  7: { id: "prog-7", message: "Seven. Lucky number for a lucky contact.", mood: "wink", priority: 10, cooldown: 0, once: true },
};
