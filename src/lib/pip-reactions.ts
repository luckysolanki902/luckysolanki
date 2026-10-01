import type { PipMood, PipNudge } from "./pip-behavior";

const lines: Record<string, [string, PipMood]> = {
  welcome: ["Hey! Take a look around. I’m here if you need anything.", "wave"],
  systems: ["AI features, backend work, or a whole product. This is where Lucky can help.", "curious"],
  work: ["Two work stories, then the projects. Pick whichever interests you.", "celebrate"],
  about: ["A little more about the person behind the projects.", "curious"],
  tools: ["The toolkit. Picked for the job, not just the logo.", "curious"],
  "work-stories": ["Notes from the build. Including the bits that went sideways.", "reading"],
  testimonials: ["I’ll let the people he’s worked with do the talking.", "wave"],
  contact: ["Made it to the hello corner. No fancy introduction needed.", "wave"],
  blitzit: ["Blitzit has a lot behind it. Voice, shared tools, sync, and a way to undo AI changes.", "curious"],
  maddycustom: ["MaddyCustom connects the storefront, a shopping assistant, and the team fulfilling each order.", "celebrate"],
  spyll: ["Spyll. A campus network where students can speak anonymously.", "curious"],
  avana: ["Avana. Turning real estate research into a conversation.", "curious"],
  autoremov: ["AutoRemov. Remove the background, keep the job running reliably.", "curious"],
  dailicle: ["Dailicle. A little less scrolling, a little more reading.", "reading"],
  fast: ["Wheee. I’m keeping up, just about.", "scrolling"],
  top: ["Back to the beginning. Round two?", "wave"],
  bottom: ["That’s the end of the page. I’m still here if you have a question.", "celebrate"],
  details: ["Opening the hood. Here’s how the pieces fit together.", "curious"],
  resume: ["The short version, neatly packed into a PDF.", "celebrate"],
  email: ["I’ll leave you two to it. Say hello from me.", "wave"],
  github: ["Off to the code. Mind the rabbit holes.", "curious"],
  linkedin: ["Taking the conversation over to LinkedIn. See you here after.", "wave"],
  copy: ["A little something to take with you.", "celebrate"],
  return: ["Oh, hey. You’re back!", "wave"],
  idle: ["Take your time. I’m just hanging out here.", "idle"],
  dark: ["Snow weather. I brought my tiny earmuffs.", "wave"],
  light: ["A little sunshine. That’s nice.", "celebrate"],
  reading: ["I’ll read along. Ask me if a bit needs unpacking.", "reading"],
  "story:blitzit:voice": ["The voice model talks. A separate reasoning agent handles the work. That split matters here.", "curious"],
  "story:blitzit:wake-word": ["The wake word was trained in Colab. The orb you see is rendered from the actual component.", "curious"],
  "story:blitzit:undo": ["Stopping speech and undoing a saved change are different jobs. This section explains the second one.", "reading"],
  "story:blitzit:memory": ["Memory needs an edit and delete button too. You can see those controls in the screenshot.", "reading"],
  "story:maddycustom:assistant": ["The product cards come from the catalogue. The assistant carries the search context into follow-ups.", "curious"],
  "story:maddycustom:payments": ["Here’s what happens around a payment, including retries and verification.", "reading"],
  "story:maddycustom:operations": ["This is the part customers rarely see: getting the right design made and shipped.", "reading"],
  halfway: ["Halfway down. I’m keeping your place.", "reading"],
};
export function reactionFor(key: string): PipNudge | null {
  const line = lines[key];
  return line ? { text: line[0], mood: line[1], mode: "reaction", prompt: "", label: "" } : null;
}

/** Local speech has its own clock. It never consumes or waits for an AI quota. */
export function createReactionGate() {
  const seen = new Map<string, number>();
  let last = -Infinity, mutedUntil = 0;
  return {
    dismiss(now: number) { mutedUntil = now + 20000; },
    allow(key: string, now: number, action = false) {
      if (now < mutedUntil || now - last < (action ? 1200 : 12000) || now - (seen.get(key) ?? -Infinity) < 45000) return false;
      seen.set(key, now); last = now; return true;
    },
  };
}
