# Lucky Solanki — 2026 Portfolio Design Specification

> *"A portfolio is not a page. It's a signal."*
>
> This document is the single source of truth for every design decision.
> Nothing is arbitrary. Every pixel earns its place.
> If something exists here without a reason, it has already failed.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Visual Identity & Mood](#2-visual-identity--mood)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Motion & Animation](#6-motion--animation)
7. [Shape, Texture & Surface](#7-shape-texture--surface)
8. [Navigation](#8-navigation)
9. [Hero Section](#9-hero-section)
10. [About Section](#10-about-section)
11. [Work Section](#11-work-section)
12. [What I Build With Section](#12-what-i-build-with-section)
13. [Contact Section](#13-contact-section)
14. [Footer](#14-footer)
15. [Responsive Strategy](#15-responsive-strategy)
16. [Performance & SEO](#16-performance--seo)
17. [Accessibility](#17-accessibility)
18. [Technical Architecture](#18-technical-architecture)

---

## 1. Design Philosophy

> *"Simplicity is about subtracting the obvious and adding the meaningful."* — John Maeda

### This Is Not a Portfolio. It's a Product.

The site should feel like opening a well-crafted tool — not reading a resume, not browsing a template. The visitor should experience the same intentionality that goes into the software Lucky ships. Every decision — color, word, pixel of whitespace — is a product decision.

> *"Design is the silent ambassador of your brand."* — Paul Rand

### The Signal

Within five seconds of landing, the visitor must receive three clear signals:

| Signal | How it's communicated |
|---|---|
| **This person builds real things.** | Shipped products with live links and real metrics. Not technology lists. Not tutorial clones. |
| **This person thinks clearly.** | Whitespace, hierarchy, restraint. The absence of noise is itself a statement. |
| **I want to work with them.** | Warmth in tone. Confidence without arrogance. A sense of taste that's felt, not explained. |

If any element on the page doesn't serve at least one of these signals, it gets removed.

> *"Remove until it hurts. Then remove one more thing."*

### Core Principles

| # | Principle | What it means | Research basis |
|---|---|---|---|
| 1 | **Intentional Minimalism** | Every element has a reason to exist. Nothing is decoration. Not emptiness — *precision*. | Hick's Law: fewer choices = faster decisions. Cognitive Load Theory: working memory holds ~4 items. |
| 2 | **Show, Don't List** | Show shipped products, live URLs, real impact. Never list 30 technologies in a grid. | Von Restorff Effect: if everything stands out, nothing does. The work IS the evidence. |
| 3 | **Warm Precision** | Technical rigor with human warmth. Not cold-corporate, not casual-sloppy. Like a well-written email from someone you trust. | "Warmth in design is clarity with empathy." |
| 4 | **Earned Density** | The surface is calm. The depth is rich. Information density increases as the user scrolls deeper. | Progressive Disclosure: reveal complexity gradually. Surface: simple. Depth: detailed. |
| 5 | **Quiet Confidence** | Let the work speak. No exclamation marks. No "passionate problem solver." No screaming. Just evidence. | "Good design shows. Great design proves." |

### The Subtraction Test

Before adding ANY element to the page, it must pass this filter:

1. What happens if this doesn't exist?
2. Does it increase clarity?
3. Does it build trust?
4. Does it serve one of the three signals?

If the answer to all four is uncertain — remove it.

> *"Design until it feels obvious."*

### What This Portfolio Is NOT

| Anti-pattern | Why it fails |
|---|---|
| A resume with animations | Resumes list. Products show. |
| A "passionate developer" page | Claiming passion ≠ demonstrating craft. |
| A technology showcase | Nobody hires a React logo. They hire someone who shipped something with React. |
| A template with content swapped in | Templates feel generic because they ARE generic. |
| An exhaustive biography | The portfolio is a trailer, not the movie. |

### Reference DNA

Not to copy — to absorb the *quality of thinking* behind these:

| Reference | What to internalize |
|---|---|
| **Linear.app** | One typeface, multiple weights = effortless hierarchy. Restraint as confidence. |
| **Stripe.com** | Grid discipline. Complex ideas made simple through layout alone. |
| **Apple.com** | Whitespace courage. Willingness to let one thing breathe. |
| **rauno.me** | Personal portfolio done right. Minimal but warm. Real personality, zero noise. |
| **paco.me** | The gold standard. Effortless, fast, honest. |
| **Vercel.com** | Developer confidence. Features presented as inevitable, not impressive. |

---

## 2. Visual Identity & Mood

> *"Styles come and go. Good design is a language, not a style."* — Massimo Vignelli

### Mood

```
Calm · Precise · Warm · Spacious · Confident · Crafted · Breathable · Intentional · Quiet · Honest
```

### Anti-Mood

```
Loud · Chaotic · Corporate · Desperate · Cluttered · Decorative · Try-hard · Template · Generic · Dark-for-dark's-sake
```

### Visual Metaphor

A **high-end Japanese stationery store**: every item thoughtfully made, generously spaced, nothing screaming for attention because everything is excellent. You walk in and immediately feel: these people care about craft.

Or: a **well-typeset architecture monograph**. Large photographs, precise type, generous margins, content that breathes. You don't notice the design. You notice the work.

> *"A great UI disappears. A bad one demands attention."*

### The Feeling

When someone opens this portfolio, they should feel like they've walked into a quiet room where everything is in the right place. Not impressed — *calm*. Not overwhelmed — *oriented*. Not entertained — *convinced*.

> *"People don't remember layouts. They remember how it felt."*

---

## 3. Color System

> *"Whitespace is not empty. It is intention."*

### Philosophy

Color is atmospheric, not decorative. The palette is restrained — creating **mood**, **hierarchy**, and **warmth**. Not noise. The work itself (project screenshots, product imagery) provides the only bursts of visual interest. The system stays neutral so the work can breathe.

> *"If everything stands out, nothing stands out."*

### Light Mode (Default — Primary Experience)

Light mode is default because it communicates openness, clarity, and approachability. It feels like quality paper.

```
Background:
  --bg-primary:        #FAFAF9       /* Warm off-white. Not sterile #FFF. Feels like good paper. */
  --bg-secondary:      #F5F4F0       /* Subtle warm stone. Card surfaces. */
  --bg-elevated:       #FFFFFF       /* Pure white only for elevated cards needing lift */
  --bg-subtle:         #EDECE8       /* Section alternation. Gentle depth cue. */

Text:
  --text-primary:      #1A1A19       /* Near-black, warm. Never pure #000 — aggressive on screens. */
  --text-secondary:    #5C5C58       /* Descriptions, body text. Comfortable reading contrast. */
  --text-tertiary:     #8A8A85       /* Labels, metadata, captions. Quiet. */
  --text-inverse:      #FAFAF9       /* Text on dark surfaces */

Interactive:
  --accent:            #2E2E2C       /* Charcoal. Primary interactive color. Buttons, links. */
  --accent-hover:      #1A1A19       /* Deepened on hover */
  --accent-subtle:     #E8E7E3       /* Backgrounds for tags, pills */

Border:
  --border-primary:    #E3E2DE       /* Visible but gentle */
  --border-subtle:     #EEEDE9       /* Very light. Dividers between content blocks. */
  --border-strong:     #D1D0CC       /* Emphasized separators */

Shadows:
  --shadow-sm:         0 1px 2px rgba(26, 26, 25, 0.04)
  --shadow-md:         0 4px 12px rgba(26, 26, 25, 0.06)
  --shadow-lg:         0 12px 40px rgba(26, 26, 25, 0.08)
```

### Dark Mode

Exists for user preference and night reading. Not the primary experience. Equally refined — not an afterthought.

```
Background:
  --bg-primary:        #111110       /* Warm dark. Not pure #000 — too void-like. */
  --bg-secondary:      #191918       /* Elevated surfaces */
  --bg-elevated:       #1F1F1E       /* Cards, modals */
  --bg-subtle:         #141413       /* Section alternation */

Text:
  --text-primary:      #EDEDEC       /* Warm off-white. Not pure #FFF — too harsh on dark. */
  --text-secondary:    #A0A09B       /* Descriptions */
  --text-tertiary:     #6B6B66       /* Metadata, captions */
  --text-inverse:      #111110

Interactive:
  --accent:            #EDEDEC       /* Light text as interactive element */
  --accent-hover:      #FFFFFF
  --accent-subtle:     #1F1F1E

Border:
  --border-primary:    #2A2A28
  --border-subtle:     #1F1F1E
  --border-strong:     #3A3A37

Shadows:
  --shadow-sm:         0 1px 2px rgba(0, 0, 0, 0.2)
  --shadow-md:         0 4px 12px rgba(0, 0, 0, 0.3)
  --shadow-lg:         0 12px 40px rgba(0, 0, 0, 0.4)
```

### Why These Specific Colors

| Decision | Reason |
|---|---|
| `#FAFAF9` not `#FFFFFF` | Pure white is clinical. Off-white feels like quality paper. The 3-point warmth shift is subtle but critical. |
| `#1A1A19` not `#000000` | Pure black on white is high-contrast but visually aggressive. This warmth reduces eye strain and feels crafted. |
| No bright accent color | Von Restorff Effect: the work IS the color. Project screenshots provide visual interest. The UI stays neutral to let the work breathe. |
| Warm neutrals over cool grays | Warm tones feel human. Cool grays feel corporate. This is a person's portfolio, not a SaaS dashboard. |

### Color Usage Discipline

> *"Restraint is the mark of maturity in design."*

1. **No more than 3 text colors on any screen.** Primary, secondary, tertiary. That's it.
2. **Accent color is reserved for interactive elements only.** Links, buttons, hover states. Nothing else.
3. **Never use color alone to communicate meaning.** Always pair with typography, spacing, or iconography. (Accessibility principle.)
4. **Project images are the ONLY colorful elements.** The system stays monochromatic so the work pops.
5. **All color variables transition over 300ms** when switching themes — pure CSS, no re-renders, no flash.

### Theme Toggle: Why We Keep It

The principles document asks: *"Does a theme toggle increase conversion? If not, remove it."*

We keep it because:
1. This portfolio targets **developers and tech people** — they expect and appreciate the option.
2. It demonstrates engineering attention (theme transition is smooth, no FOUC, persisted in localStorage).
3. The dark mode is genuinely well-crafted — not an afterthought.
4. Minimal implementation cost (Zustand + CSS custom properties — zero JS re-renders).

But: **light mode is the default, the primary experience, and the one that gets perfected first.** Dark mode is adapted from it, not designed separately.

---

## 4. Typography

> *"Hierarchy is how design speaks without words."*

### Philosophy

On a minimal site, type does 90% of the work. The typography system must create **effortless hierarchy** — where the eye flows naturally from heading to body to detail without conscious effort. If a visitor has to "figure out" what to read next, the hierarchy has failed.

> *"Good UI tells you where to look next."*

### Two Fonts. That's It.

**Reducing from three fonts to two.** Stronger system. Faster loading. Cleaner visual identity. A constrained palette forces better hierarchy through weight and size alone.

> *"Simple is not basic. Simple is refined."*

#### Display — **Quicksand** (Google Fonts via next/font)

```
Weights: 500, 600, 700
```

- **Why**: Geometric sans-serif with rounded terminals. Modern, friendly, readable at all sizes. The rounded letterforms convey approachability without being childish. It's the typographic equivalent of warm precision.
- **Where**: Headings, subheadings, navigation logo, buttons. All display-level text.
- **Rule**: Never use for paragraphs longer than 2 lines.

#### Body — **Inter** (Google Fonts via next/font)

```
Weights: 400, 500
```

- **Why**: The best screen-optimized sans-serif. Designed specifically for computer displays with optical sizing, clear letterforms at small sizes, and excellent number rendering.
- **Where**: Body text, descriptions, paragraphs, labels, metadata, section tags, inline code, tech stacks, dates, captions — everything that isn't a heading.
- **Rule**: The default. When in doubt, use Inter.

#### Why No Monospace Font

The previous version used JetBrains Mono for code-styled labels and dates. Removed because:
1. Three fonts = visual fragmentation. Two fonts = cohesion.
2. The site isn't a code editor. Developer identity is shown through *what was built*, not through monospace styling.
3. Inter handles small labels, metadata, and dates beautifully — it was literally designed for this.
4. One fewer font to load = faster page.

> *"If you can design one thing, you can design everything."* — Massimo Vignelli

### Type Scale

Built on a **1.25 ratio** (Major Third) from a 16px base. Each step feels natural, not arbitrary.

```
--text-xs:     0.75rem    / 12px   — Fine print, micro-labels
--text-sm:     0.875rem   / 14px   — Labels, metadata, tags, tech stacks, dates
--text-base:   1rem       / 16px   — Body text baseline
--text-md:     1.125rem   / 18px   — Lead paragraphs, important descriptions
--text-lg:     1.25rem    / 20px   — Section intros, emphasized body
--text-xl:     1.5rem     / 24px   — Subheadings
--text-2xl:    2rem       / 32px   — Section titles
--text-3xl:    2.5rem     / 40px   — Major headings  
--text-4xl:    3.25rem    / 52px   — Hero heading (desktop only)
```

### Line Heights

```
--leading-tight:    1.15   — Large headings (tight, controlled)
--leading-snug:     1.35   — Subheadings, medium display text
--leading-normal:   1.6    — Body text, paragraphs (optimal readability)
--leading-relaxed:  1.75   — Long-form if ever needed
```

### Letter Spacing

```
--tracking-tight:   -0.025em  — Hero heading, large display text (tighten at scale)
--tracking-normal:  0          — Body text (Inter's default tracking is already optimized)
--tracking-wide:    0.05em     — All-caps section labels only
```

### Typography Discipline

> *"Users follow contrast."*

1. **Quicksand for display. Inter for everything else.** No exceptions. No "sometimes JetBrains for variety."
2. **Max 2 font sizes per visual group.** One heading, one body. A third smaller size only for metadata/labels.
3. **Weight creates sub-hierarchy.** Don't jump to a bigger size — use 500 weight instead of 400. Size is for major shifts; weight is for subtle ones.
4. **All-caps only for micro-labels**: section tags like "ABOUT", "WORK". Set in Inter 500 at 12px with `--tracking-wide`. Rare. Intentional.
5. **Underlines are for links only.** Emphasis = weight 500. Never underline for emphasis.
6. **Max line width: 65ch for body text.** The optimal reading line length. Beyond this, the eye loses its place returning to the next line.
7. **One heading level per section visible at a time.** Don't show `h2` and `h3` in the same viewport. The eye shouldn't choose between two heading levels.

---

## 5. Spacing & Layout

> *"Whitespace is not empty. It is intention."*

### Philosophy

Spacing is the most powerful and most underrated design element. It creates hierarchy, communicates relationships, and makes content breathable. This site uses **generous spacing** — more than feels necessary at first. That's the test: if it feels like "too much space," it's probably right.

> *"White space increases perceived value."*

Whitespace signals confidence. It says: "We don't need to cram everything in. The content is strong enough to stand alone." Cramped layouts signal desperation — as if afraid the user will leave before seeing everything.

### Spacing Scale (Base: 4px)

Every spacing value derives from this scale. No arbitrary values. No `margin: 13px`. The system enforces rhythm.

```
--space-1:     0.25rem  /   4px   — Micro: icon-to-label gaps
--space-2:     0.5rem   /   8px   — Related inline elements
--space-3:     0.75rem  /  12px   — Compact component padding
--space-4:     1rem     /  16px   — Base element spacing
--space-5:     1.25rem  /  20px   — Comfortable breathing room
--space-6:     1.5rem   /  24px   — Standard gaps
--space-8:     2rem     /  32px   — Content group spacing
--space-10:    2.5rem   /  40px   — Between content blocks
--space-12:    3rem     /  48px   — Major content separation
--space-16:    4rem     /  64px   — Section padding (mobile)
--space-20:    5rem     /  80px   — Section padding (tablet)
--space-24:    6rem     /  96px   — Section padding (desktop)
--space-32:    8rem     / 128px   — Between major sections (desktop)
--space-40:   10rem     / 160px   — Hero vertical breathing room
```

### Layout Constraints

```
--max-page:       1200px     Content never stretches beyond this
--max-content:     680px     Text-heavy sections (About, descriptions) — ~65ch
--max-wide:       1000px     Project cards, wider layouts
```

### Horizontal Padding

```
Mobile:      20px each side   (total 40px removed from viewport)
Tablet:      40px each side
Desktop:     Auto — centered within --max-page
```

### Section Spacing Rhythm

> *"Related items are close. Unrelated items are far."* — Gestalt: Proximity

```
Between major sections:
  Mobile:      64px   (--space-16)
  Tablet:      96px   (--space-24)
  Desktop:     128px  (--space-32)

Section heading → content:
  Mobile:      32px   (--space-8)
  Tablet:      40px   (--space-10)
  Desktop:     48px   (--space-12)

Between content blocks within a section:
  Mobile:      24px   (--space-6)
  Tablet:      32px   (--space-8)
  Desktop:     40px   (--space-10)
```

### Layout Rules

> *"Spacing communicates relationships."*

1. **When in doubt, add 20% more space.** You'll almost never regret more whitespace.
2. **Proximity = relationship.** Items that are close together are perceived as related. Use this religiously (Gestalt principle).
3. **Vertical rhythm is sacred.** Every value comes from the scale. No `margin-top: 37px`.
4. **Padding over margin.** Use padding on containers, not margin on children. More predictable, fewer collapse bugs.
5. **Section alternation.** Alternate `--bg-primary` and `--bg-subtle` to create visual separation between sections without heavy borders or dividers.
6. **No full-bleed sections.** Content is always constrained. Even "wide" sections respect `--max-wide`. The gutters at the edges give the page its shape.

---

## 6. Motion & Animation

> *"Motion must communicate. If it doesn't clarify, remove it."*

### Philosophy

Animation answers questions. Every motion on this site answers one of:
- **Where did this come from?** (origin/context)
- **What changed?** (state feedback)
- **What should I look at?** (attention direction)

If an animation doesn't answer any of these three, it's decoration. Remove it.

> *"Confusion is not a feature."*

### Principles

| Principle | Rule |
|---|---|
| **Purposeful** | Every animation serves communication, not entertainment. |
| **Invisible** | If someone notices the animation itself, it's too much. They should notice the *content* the animation reveals. |
| **Fast** | UI transitions: 200–300ms. Content reveals: 400–600ms. Nothing exceeds 800ms. |
| **Physically grounded** | Custom easing curves that mimic natural deceleration. Never linear. Never bouncy. |

### Easing Curves

```css
--ease-standard:   cubic-bezier(0.25, 0.1, 0.25, 1.0);    /* General UI transitions */
--ease-out:        cubic-bezier(0.0, 0.0, 0.2, 1.0);       /* Elements entering view */
--ease-in:         cubic-bezier(0.4, 0.0, 1.0, 1.0);       /* Elements exiting */
--ease-reveal:     cubic-bezier(0.16, 1, 0.3, 1);          /* Scroll reveals — smooth deceleration */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);      /* Micro-interactions only */
```

### Animation Catalog

Every animation on the site, named and specified. No improvisation during development.

---

#### 1. Scroll Reveal — *"The Soft Rise"*

The primary animation. Used on every content block entering the viewport.

```
Trigger:     IntersectionObserver — element 15% visible
Transform:   opacity 0→1, translateY 20px→0
Duration:    500ms
Easing:      --ease-reveal
Stagger:     80ms between siblings (project cards, experience cards, etc.)
Fires:       Once. Never re-triggers on scroll back up. (Framer Motion: whileInView, once: true)
```

Why 20px and not 40px: Larger translate distances feel slippery and cartoon-like. 20px is barely perceptible as movement — it reads as "appearing" rather than "sliding in."

---

#### 2. Hero Text — *"The Measured Arrival"*

The hero heading reveals line by line. One thought at a time. Calm pacing.

```
Technique:   Heading split into lines (NOT characters — character animation feels gimmicky)
             Each line: opacity 0→1, translateY 24px→0
Duration:    600ms per line
Stagger:     150ms between lines
Easing:      --ease-reveal
Delay:       300ms after page load (let the browser settle)
```

Why lines, not words or characters: Word-by-word animation creates reading anxiety — the brain tries to read while motion is still happening. Line-by-line feels like *one complete thought arriving*, then the next.

---

#### 3. Photo — *"The Gentle Uncover"*

The portrait reveals with a clip-path wipe. Subtle but polished.

```
Technique:   clip-path: inset(100% 0 0 0) → inset(0% 0 0 0)
             Simultaneous: scale 1.04 → 1.0
Duration:    700ms
Easing:      --ease-reveal
Delay:       Begins after the last hero text line finishes
```

---

#### 4. Nav — *"The Quiet Settle"*

Nav transitions from invisible to a frosted bar as the user scrolls past the hero.

```
Trigger:     scrollY > (hero height - 100px)
Transform:   background: transparent → var(--bg-primary) at 88% opacity
             backdrop-filter: none → blur(12px)
             border-bottom: transparent → var(--border-subtle)
Duration:    200ms
Easing:      --ease-standard
```

---

#### 5. Project Image Hover — *"The Lift"*

On hover, the project screenshot lifts slightly and its shadow deepens. Like picking up a printed photograph.

```
Transform:   translateY 0→-4px
             box-shadow: --shadow-sm → --shadow-md
Duration:    250ms
Easing:      --ease-standard
Mobile:      No hover state. Tap triggers the link directly.
```

---

#### 6. Link Hover — *"The Underline Draw"*

Links don't change color. An underline draws from left to right.

```
Technique:   ::after pseudo-element
             width: 0% → 100%, height: 1px
             background: var(--text-primary)
Duration:    250ms
Easing:      --ease-standard
Direction:   Left→right on hover-in. Right→left on hover-out.
```

Why not color change: Color change is a *state* indication (active, visited). Underline draw is a *gesture* indication (I'm here, I'm interactive). More elegant, more specific.

---

#### 7. Section Label — *"The Slide"*

Section tags ("ABOUT", "WORK") slide in from the left.

```
Transform:   opacity 0→1, translateX -10px→0
Duration:    400ms
Easing:      --ease-out
```

---

#### 8. Theme Toggle — *"The Turn"*

```
Transform:   rotate 0→180deg (icon crossfade simultaneous)
Duration:    400ms
Easing:      --ease-spring
Page colors: All CSS custom properties transition over 300ms --ease-standard
```

---

### Animation Rules (Non-Negotiable)

> *"Every interaction should reduce doubt."*

1. **Only animate `transform` and `opacity`.** These are GPU-composited. Never animate `width`, `height`, `top`, `left`, `margin`, `padding` — they trigger layout recalculation.
2. **Respect `prefers-reduced-motion`.** If the user has this system setting, all decorative motion is disabled. Only essential state changes remain.
3. **No parallax.** Ever. It causes motion sickness for many users and adds zero informational value to a portfolio.
4. **No bounce/wobble/elastic.** This isn't a children's app. The `ease-spring` curve is used only for the theme toggle — nowhere else.
5. **Stagger > synchronize.** Multiple items appearing together get staggered by 60–100ms. Synchronized motion feels robotic; staggered feels natural.
6. **Animate entrance only.** Elements don't animate out when scrolled past. Simpler. Faster. Less disorienting.
7. **No scroll-jacking.** The user controls their scroll speed. We never override native scroll behavior.

---

## 7. Shape, Texture & Surface

> *"The details are not the details. They make the design."* — Charles Eames

### Border Radius Scale

```
--radius-sm:     6px     — Tags, inline pills
--radius-md:     10px    — Cards, buttons, inputs
--radius-lg:     16px    — Large cards, images
--radius-xl:     24px    — Hero photo, feature cards
--radius-full:   9999px  — Circular: avatar, pill buttons
```

Rounded corners are scientifically demonstrated to be easier for the eye to process — the eye follows smooth contours more naturally than sharp angles (Barrow & Tenenbaum, 1981). They also communicate modernity and approachability. Every major product uses them: iOS, macOS, Linear, Notion.

### Shadow Philosophy

> *"Polish is invisible — until it's missing."*

No hard drop shadows. All shadows are multi-layered and diffused — they simulate real light, not a Photoshop filter.

```css
/* The standard layered shadow — cards, elevated elements */
box-shadow:
  0 1px 2px rgba(26, 26, 25, 0.02),
  0 4px 8px rgba(26, 26, 25, 0.03),
  0 12px 32px rgba(26, 26, 25, 0.05);
```

Three layers because real-world shadows have ambient occlusion (tight, dark), penumbra (medium, softer), and atmosphere (wide, barely visible). One-layer shadows look fake.

### Surface Rules

1. **Dividers over borders.** Thin horizontal lines (`1px solid var(--border-subtle)`) between content blocks. Not bordered cards everywhere — that's boxy and old-fashioned.
2. **No gradients on UI elements.** No gradient buttons, no gradient cards. Gradients only appear as extremely subtle background washes (if at all).
3. **No decorative patterns.** No dot grids, no grid overlays, no geometric background shapes. The content IS the visual texture.
4. **Subtle grain on hero (optional).** A faint noise texture at 2–3% opacity on the hero background, applied via CSS. Gives a paper-like warmth. If it doesn't feel right during implementation, remove it.

---

## 8. Navigation

> *"Clarity accelerates action."*

### Why Only Three Links

**Hick's Law**: More choices = slower decisions. Three navigation items means the visitor doesn't have to think. "About", "Work", "Contact" — immediately scannable, immediately understood.

> *"Limit choices until clarity increases without removing personality."*

### Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Lucky Solanki                     About  Work  Contact  ◐   │
└──────────────────────────────────────────────────────────────┘
```

### Desktop Specifications

```
Position:        Fixed at top
Height:          60px
Max-width:       --max-page (1200px), centered
Z-index:         100

Initial state:   Fully transparent (blends with hero)
Scrolled state:  var(--bg-primary) at 88% opacity + backdrop-filter: blur(12px)
                 + 1px bottom border: var(--border-subtle)
Transition:      200ms --ease-standard

Left:  "Lucky Solanki"
       Font: Quicksand 600, --text-sm
       Color: --text-primary
       Letter-spacing: --tracking-wide
       Click: Smooth scroll to top

Right: "About"  "Work"  "Contact"  [theme toggle]
       Font: Inter 400, --text-sm
       Gap: var(--space-6)
       Active: Inter 500, --text-primary
       Inactive: --text-secondary
       Hover: Underline draw animation (animation #6)

Theme toggle:
       Icon: 18×18px. Sun (light) / Moon (dark)
       Click: Rotation animation (animation #8)
       No label — universally understood
       ARIA: aria-label="Toggle theme"
```

### Mobile Navigation

```
Breakpoint:    < 768px

Closed:        Logo left, hamburger icon right (three lines, 24×24px touch target padded to 44×44px)
Open:          Full-screen overlay
               Background: var(--bg-primary) at 98% opacity + blur(20px)
               Links: Centered vertically, stacked
               Font: Quicksand 600, --text-2xl
               Stagger: 80ms fade-in between items
               Theme toggle: Below links
               Close: × icon top-right (44×44px touch target)
```

### Behavior

- **Smooth scroll** to sections on link click.
- **Active section detection** via IntersectionObserver — current section highlighted in nav.
- **Hide on scroll down, show on scroll up** (mobile only) — reclaims screen space. (Fitts's Law: keep controls reachable when needed.)
- **Clicking logo** scrolls to top smoothly.

---

## 9. Hero Section

> *"Trust is built in milliseconds."*

### This Section Carries Everything

The hero is 80% of the first impression. It needs to be **perfect** — and "perfect" here means invisible. The visitor shouldn't think "nice hero section." They should think "I understand who this person is."

> *"The best interface feels inevitable."*

### Peak-End Rule

Research shows users remember two things: **the first impression** and **the final moment** (Kahneman, 1999). This hero IS the first impression. It must be unambiguous, calm, and confident. No noise. One clear thought.

### Scanning Pattern

The hero uses a **Z-pattern** layout — natural for landing sections:
1. Eye starts top-left → reads name
2. Sweeps right → sees photo
3. Drops down-left → reads heading
4. Moves right → reads subtext → reaches CTA

### Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│                           [NAV - transparent]                    │
│                                                                  │
│                                                                  │
│                                                                  │
│   Lucky Solanki                          ┌────────────────┐      │
│                                          │                │      │
│   I build products                       │   [PHOTO]      │      │
│   people actually use.                   │                │      │
│                                          │                │      │
│   Built products used by 50K+            └────────────────┘      │
│   monthly users. Co-founder of Spyll.                            │
│   Engineer at Blitzit.                                           │
│                                                                  │
│   View my work →     Get in touch                                │
│                                                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Layout (Mobile)

```
┌──────────────────────────┐
│        [NAV]             │
│                          │
│                          │
│    ┌────────────────┐    │
│    │    [PHOTO]     │    │
│    └────────────────┘    │
│                          │
│    Lucky Solanki         │
│                          │
│    I build products      │
│    people actually       │
│    use.                  │
│                          │
│    Built products used   │
│    by 50K+ monthly       │
│    users. Co-founder     │
│    of Spyll. Engineer    │
│    at Blitzit.           │
│                          │
│    View my work →        │
│    Get in touch          │
│                          │
└──────────────────────────┘
```

### Hero Content — Precise Specifications

#### Name Badge
```
Text:            "Lucky Solanki"
Font:            Quicksand 500
Size:            --text-md (18px)
Color:           --text-secondary
Letter-spacing:  --tracking-wide
Margin-bottom:   var(--space-4)
Animation:       Fade in first, before heading (200ms after load)
```

#### Heading

> *"Design is subtraction with purpose."*

```
Text:            "I build products
                  people actually use."

Font:            Quicksand 700
Size:            --text-4xl (52px) desktop / --text-3xl (40px) tablet / --text-2xl (32px) mobile
Color:           --text-primary
Line-height:     --leading-tight (1.15)
Letter-spacing:  --tracking-tight (-0.025em)
Max-width:       540px
Animation:       "The Measured Arrival" — line-by-line, 150ms stagger
```

**Why "people actually use" — not "that people actually use":**
Tighter. More assertive. Reads faster. "That" is a filler word. Removing it makes the claim sharper.

**Why this heading over alternatives:**

| Considered | Rejected because |
|---|---|
| "Full-Stack Developer" | Generic. Every developer says this. Zero differentiation. |
| "I turn ideas into reality" | Cliché. Empty. Says nothing specific. |
| "Passionate about code" | Self-proclaimed passion is meaningless. Show, don't tell. |
| "Building software that ships" | Better, but slightly cold. Lacks the human "people" element. |
| "Engineer. Founder. Builder." | Resume-like. Three nouns in a row is a LinkedIn headline, not a product opener. |

"I build products people actually use" works because it makes a *specific, falsifiable claim*. The rest of the portfolio proves it.

#### Subtext

```
Text:            "Built products used by 50K+ monthly users.
                  Co-founder of Spyll. Engineer at Blitzit."

Font:            Inter 400
Size:            --text-md (18px)
Color:           --text-secondary
Line-height:     --leading-normal (1.6)
Max-width:       460px
Margin-top:      var(--space-5)
Animation:       Fade in, 300ms after heading completes
```

**Why lead with a metric (50K+):**
Specificity builds credibility. "Building things since 2021" is vague and unimpressive. "50K+ monthly users" is concrete, verifiable, and immediately establishes scale.

"Spyll" and "Blitzit" are NOT hyperlinks here. No inline links in the hero — it would break the reading flow and create competing tap targets (Fitts's Law violation).

#### CTAs

> *"Every screen must answer: what is the one thing the user should do here?"*

The primary action is: **look at the work**.

```
Primary:   "View my work →"
           Style: Text link with arrow (not a filled button — too heavy for this layout)
           Font: Inter 500, --text-base
           Color: --text-primary
           Arrow (→) translates right 4px on hover
           Underline draw on hover
           → Smooth scrolls to Work section

Secondary: "Get in touch"
           Style: Pill outline
           Font: Inter 500, --text-base
           Border: 1px solid var(--border-primary)
           Padding: var(--space-2) var(--space-5)
           Border-radius: --radius-full
           Hover: background fills to var(--accent), text → --text-inverse
           → Smooth scrolls to Contact section

Layout:    Inline, gap var(--space-4)
Margin-top: var(--space-8)
```

The primary CTA is a text link, not a button — because a filled button would visually dominate the hero and break the calm. The "text link with an arrow" pattern says "there's more below" without screaming.

#### Photo

```
Image:          lucky.jpg
Size:           280×340px desktop / 240×290px tablet / 200×240px mobile
Border-radius:  --radius-xl (24px)
Object-fit:     cover
Object-position: center 20% (frame the face, not the shirt)
Shadow:         --shadow-md
Dark mode:      filter: brightness(0.9) — slight dim to match dark bg
Animation:      "The Gentle Uncover" (animation #3)

Placement:
  Desktop:      Right side. Grid: ~55% text / ~45% photo.
  Mobile:       Centered above text. Smaller.
```

#### Hero Spacing

```
Top padding:     var(--space-40) (160px) — generous clearance below nav
Bottom padding:  var(--space-32) (128px)
Target:          ~85–92vh on desktop. NOT explicitly 100vh.
                 (100vh heroes create awkward scroll positions and feel forced.)
```

### What the Hero Does NOT Have

> *"Before adding an element, ask: what happens if this doesn't exist?"*

- ❌ **No animated background** — particles, gradients, waves, blobs. All noise. Zero information.
- ❌ **No typing effect** — Every developer portfolio does this. It's the "Hello World" of portfolio clichés.
- ❌ **No terminal animation** — Same problem. Overdone. Also visually heavy for a minimalist hero.
- ❌ **No tech stack icons** — The hero is about WHAT was built, not WHAT tools were used. Tools are mentioned later.
- ❌ **No "scroll down" arrow** — If the content below is good, they'll scroll. A "scroll down" arrow signals insecurity: "please don't leave!"
- ❌ **No social media links** — Social links in the hero compete with the primary CTA. They belong in Contact.
- ❌ **No "Available for hire" badge** — It makes the portfolio feel transactional before establishing value.
- ❌ **No role subtitle** — "Full-Stack Developer" under the name is resume-thinking. The heading already communicates more.

---

## 10. About Section

> *"The best products don't focus on features, they focus on clarity."* — Don Norman

### Purpose

Expand on who Lucky is — but only enough to convert interest into trust. The About section is a **trailer**, not the movie. Three paragraphs, three experience cards. Done.

### Cognitive Load Consideration

Working memory holds ~4 chunks. This section presents exactly three pieces of information:
1. A positioning statement (who Lucky is)
2. A brief narrative (what Lucky has done)
3. Visual proof (three experience cards)

### Section Label
```
"ABOUT"
Font: Inter 500, --text-xs (12px), uppercase
Letter-spacing: --tracking-wide
Color: --text-tertiary
Animation: "The Slide" (animation #7)
```

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ABOUT                                                           │
│                                                                  │
│  I'm a self-taught engineer who builds                           │
│  products from first line to first user.                         │
│                                                                  │
│  ─────────────────────────────────────                           │
│                                                                  │
│  Currently engineering integrations at Blitzit —                 │
│  connecting tools like Asana, Trello, and Notion                 │
│  into one product. Before that, co-founded and built             │
│  MaddyCustom from scratch into a platform serving                │
│  50K+ monthly users. Now building Spyll.                         │
│                                                                  │
│  Mechanical Engineering degree from HBTU. Everything             │
│  I know about software, I taught myself. 7000+ hours             │
│  of building, breaking, and shipping.                            │
│                                                                  │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Blitzit       │  │ Spyll         │  │ MaddyCustom   │        │
│  │ Full-Stack    │  │ Co-Founder    │  │ Co-Founder    │        │
│  │ Engineer      │  │               │  │               │        │
│  │ 2025 — Now    │  │ 2024 — Now    │  │ 2022 — 2026   │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Heading

```
Text:           "I'm a self-taught engineer who builds
                 products from first line to first user."
Font:           Quicksand 600
Size:           --text-2xl (32px)
Color:          --text-primary
Line-height:    --leading-snug (1.35)
Max-width:      --max-content (680px)
```

### Body

```
Font:           Inter 400
Size:           --text-md (18px)
Color:          --text-secondary
Line-height:    --leading-normal (1.6)
Max-width:      --max-content (680px)
Paragraph gap:  var(--space-6)
```

### Experience Cards

Three cards. Present roles. Clean.

```
Layout:     3 columns desktop / stack on mobile
Gap:        var(--space-4)

Each card:
  Background:    var(--bg-secondary)
  Padding:       var(--space-5)
  Border:        1px solid var(--border-subtle)
  Border-radius: --radius-md (10px)

  Company:       Quicksand 600, --text-base, --text-primary
  Role:          Inter 400, --text-sm, --text-secondary
  Period:        Inter 400, --text-xs, --text-tertiary

  Hover:         border-color → --border-primary
                 box-shadow → --shadow-sm
                 Duration: 200ms
```

### Copy Rules for About

> *"Ship clarity, not complexity."*

1. **No "passion" or "love" language.** "Passionate about technology" is a null statement. EVERYONE claims passion. Instead: show what was built.
2. **Specific > generic.** "50K+ monthly users" > "scalable systems." "7000+ hours" > "extensive experience."
3. **Present tense leads.** Start with what Lucky is doing NOW. Current work → past proof → origin story.
4. **No more than 3 short paragraphs.** If the About section requires scrolling on desktop, it's too long.
5. **No "passionate problem solver" energy.** No "I thrive on challenges." No "Detail-oriented." These are LinkedIn noise. The portfolio speaks through work, not adjectives.

---

## 11. Work Section

> *"Good design shows. Great design proves."*

### Purpose

**The core of the entire portfolio.** This section converts the hero's claim into evidence. Every project shown must be real, shipped, with actual users. This is where "I build products people actually use" gets proven.

### Information Architecture

> *"Users scan headlines → scan images → scan bold text → scan bullets."*

Users in this section will:
1. See the screenshot (visual pattern recognition — "what is this?")
2. Read the project name
3. Scan the one-line description
4. Look for a link to try it
5. Maybe glance at the tech stack

Design for this exact scan order. Don't fight it.

### Section Header

```
Label:    "WORK" — standard section label style (Inter 500, 12px, uppercase, --text-tertiary)
Heading:  "Selected Work"
          Font: Quicksand 600, --text-2xl (32px), --text-primary
Subtext:  "Products I've built, scaled, and shipped."
          Font: Inter 400, --text-md, --text-secondary
          Margin-top: var(--space-3)
```

### Project Selection

> *"Products don't need more features. They need fewer decisions."*

**3–4 projects maximum.** Quality over quantity. Hick's Law: more options = more cognitive load = less action. Each project must be:
- Actually shipped and live (or clearly shipped and concluded)
- Has real users or measurable impact
- Visually demonstrable

**Recommended order:**

| # | Project | Why this position |
|---|---|---|
| 1 | **Spyll** (spyll.in) | The current thing. Shows where Lucky's energy is NOW. Forward-looking. |
| 2 | **MaddyCustom** (maddycustom.com) | The biggest accomplishment. 50K+ users. Real revenue. Undeniable proof. |
| 3 | **Blitzit — MCP Integration** | Shows high-level engineering within a team. Not just solo projects. |
| 4 | **Dailicle** | Optional. Shows product thinking, writing, philosophy. Adds dimension beyond "just code." |

### Project Card Design

Each project gets a **full-width, editorial-style card**. Not a thumbnail grid — that minimizes the work. Each project deserves space to breathe and be understood.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │              [PROJECT SCREENSHOT]                         │    │
│  │              Full-width, ~16:10 ratio                     │    │
│  │              Border-radius: --radius-lg                   │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Spyll                                       spyll.in →          │
│                                                                  │
│  A social platform built for [specific description].             │
│  [What's notable about the engineering.]                         │
│  [Impact metric if applicable.]                                  │
│                                                                  │
│  Next.js · Socket.IO · MongoDB                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Card Specifications

```
Container:
  Background:      var(--bg-primary) — no card background. Separated by whitespace.
  Margin-bottom:   var(--space-24) (96px) — generous between projects
  Max-width:       --max-wide (1000px), centered

Screenshot:
  Width:           100%
  Aspect-ratio:    16 / 10 (or 3 / 2, choose per project)
  Border-radius:   --radius-lg (16px)
  Border:          1px solid var(--border-subtle)
  Object-fit:      cover
  Hover:           scale 1.0→1.015 over 400ms (barely perceptible. Signals interactivity.)

Project name:
  Font:            Quicksand 600, --text-xl (24px)
  Color:           --text-primary
  Margin-top:      var(--space-6)

Link:
  Aligned right of name (same line)
  Text:            "spyll.in →" or "maddycustom.com →"
  Font:            Inter 400, --text-sm
  Color:           --text-tertiary
  Hover:           --text-primary + underline draw

Description:
  Font:            Inter 400, --text-base (16px)
  Color:           --text-secondary
  Line-height:     --leading-normal
  Max-width:       600px
  Margin-top:      var(--space-3)

Tech stack:
  Inline text, separated by " · " (middle dot)
  Font:            Inter 400, --text-sm
  Color:           --text-tertiary
  Margin-top:      var(--space-4)
  NOT pills, NOT tags, NOT logos — just clean text
```

### Writing Guide for Descriptions

> *"Confusion is not a feature."*

Each description: **2–3 sentences max.** Structure:

1. **What it is.** One line. The reader should immediately understand the product.
2. **What's notable.** What makes it interesting as engineering or as a product.
3. **Impact.** Users, revenue, scale — if applicable.

**✅ Good:**
> An eCommerce platform for vehicle personalization serving 50K+ monthly users. Built the entire stack from storefront to admin dashboard to payment pipeline. Ranked top 5 on Google for core product keywords.

**❌ Bad:**
> A full-scale custom eCommerce site with modular admin dashboard, inventory management, role-based access control, advanced offer engine, Razorpay integration, Shiprocket logistics, SEO optimization...

The good version tells a story with outcomes. The bad version is a feature dump that nobody will finish reading.

### Mobile Cards

Same structure, stacked vertically:
- Screenshot: full width (minus horizontal padding)
- Text: standard mobile padding
- Spacing between projects: var(--space-16) (64px)

---

## 12. What I Build With Section

> *"No tool is impressive on its own — only what it's used to create."*

### Why "What I Build With" — Not "Skills" or "Capabilities"

"Skills" = résumé energy. "Capabilities" = corporate energy. "What I build with" = maker energy. It frames tools as *means to an end*, not achievements in themselves.

> *"Design is how intention becomes action."*

### Design

A plain text grid. No icons. No logos. No progress bars. No percentages. No self-ratings. The projects already demonstrate proficiency — this section just confirms the toolkit for people who want to scan it quickly.

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  TOOLS                                                           │
│                                                                  │
│  What I build with                                               │
│                                                                  │
│  ─────────────────────────────────                               │
│                                                                  │
│  Frontend              Backend              Infrastructure       │
│  React, Next.js        Node.js, Express     AWS, Vercel          │
│  Framer Motion         MongoDB, MySQL       CI/CD                │
│  CSS Modules           REST, WebSocket      Cloudflare, S3       │
│                                                                  │
│  Also: Python, Firebase, Razorpay, Socket.IO, WebRTC, OpenAI    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Specifications

```
Section label:    "TOOLS" — standard label style
Heading:          "What I build with"
                  Font: Quicksand 600, --text-xl (24px), --text-primary

Grid:             3 columns on desktop / 2 on tablet / 1 on mobile
Column gap:       var(--space-8)
Row gap:          var(--space-2)

Column heading:   Inter 500, --text-sm, --text-primary
Column items:     Inter 400, --text-sm, --text-tertiary
                  Each item on a new line within its column

"Also" line:      Inter 400, --text-sm, --text-tertiary
                  Margin-top: var(--space-6)
                  Single line for overflow tools
```

### What This Section Does NOT Have

> *"If everything stands out, nothing stands out."*

- ❌ No skill percentages ("React: 95%") — What does 95% even mean? Unmeasurable.
- ❌ No technology logos — Visual clutter. Von Restorff: neutral UI, work is the color.
- ❌ No progress bars — Decoration masquerading as data.
- ❌ No "years of experience" per tool — Irrelevant. Years ≠ proficiency.
- ❌ No elaborate descriptions per skill — The projects already contextualize every tool.

Just a clean, scannable index. 10 seconds to read. That's the goal.

---

## 13. Contact Section

> *"Every interaction should reduce doubt."*

### Purpose

Reduce friction to zero. One clear CTA. Direct contact methods. No unnecessary form fields. The visitor has scrolled through the entire portfolio — they're interested. Don't make them jump through hoops.

### Peak-End Rule — The Second Memory Anchor

Kahneman's research: people remember the **peak** and the **end** of an experience. The hero is the peak. The contact section is the end. End strong.

> *"Good UX removes friction. Great UX removes hesitation."*

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  CONTACT                                                         │
│                                                                  │
│  Let's build something together.                                 │
│                                                                  │
│  Have a project, a role, or just a question?                     │
│  I'd like to hear from you.                                      │
│                                                                  │
│  luckysolanki902@gmail.com →                                     │
│                                                                  │
│  ─────────────────────────────────                               │
│                                                                  │
│  GitHub     LinkedIn                                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Specifications

```
Section label:   "CONTACT" — standard style

Heading:
  Text:          "Let's build something together."
  Font:          Quicksand 600, --text-2xl (32px)
  Color:         --text-primary

Body:
  Text:          "Have a project, a role, or just a question? I'd like to hear from you."
  Font:          Inter 400, --text-md (18px)
  Color:         --text-secondary
  Max-width:     460px
  Margin-top:    var(--space-4)

Email:
  Text:          "luckysolanki902@gmail.com →"
  Font:          Inter 500, --text-md
  Color:         --text-primary
  Margin-top:    var(--space-6)
  Link:          mailto:luckysolanki902@gmail.com
  Hover:         Underline draw

Divider:         1px solid var(--border-subtle), margin: var(--space-8) 0

Social links:
  Layout:        Inline, gap var(--space-6)
  Font:          Inter 400, --text-sm
  Color:         --text-tertiary
  Hover:         --text-primary + underline draw
  Links:         "GitHub"  "LinkedIn"
  No icons — text links only.
```

### Why "Let's build something together" over "Let's work together"

"Work together" is transactional. "Build something together" is collaborative. It aligns with the hero's "I build products" framing. Consistent language throughout.

### Why No Contact Form

> *"A button is a promise."*

1. **Higher intent signal.** A mailto: link opens the user's actual email client. If they email, they mean it. Forms have lower committed response rates.
2. **Less complexity.** No backend API, no spam filtering, no validation. Fewer things to break.
3. **More personal.** A direct email feels like writing to a person. A form feels like submitting a ticket.
4. **Aligned with minimalism.** One link achieves what a 3-field form does, with less UI.

If a form is desired later: Name, Email, Message only. No phone number. No "How did you hear about me?" No dropdown menus.

---

## 14. Footer

> *"Make it intentional."*

### Design

The quietest part of the page. Doesn't repeat the nav. Doesn't add information. Just a respectful sign-off.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  © 2026 Lucky Solanki                    Built with Next.js      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Specifications

```
Background:     var(--bg-subtle)
Padding:        var(--space-6) 0
Border-top:     1px solid var(--border-subtle)

Left:           "© 2026 Lucky Solanki"
Right:          "Built with Next.js"
Font:           Inter 400, --text-sm
Color:          --text-tertiary
Layout:         flex, space-between (desktop) / centered stack (mobile)
```

---

## 15. Responsive Strategy

> *"Usability is physical, not just visual."* — Fitts's Law

### Breakpoints

```
Mobile:     < 768px
Tablet:     768px – 1024px
Desktop:    > 1024px
Wide:       > 1400px (content caps at --max-page)
```

### Mobile-First

All CSS is **mobile-first**. Base styles = mobile. Progressively enhance with `@media (min-width: 768px)` and `@media (min-width: 1024px)`.

### Responsive Behavior Map

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Nav | Logo + hamburger | Logo + inline links | Logo + inline links |
| Hero layout | Photo centered above text | Photo centered above text | Side-by-side: text left, photo right |
| Hero heading | 32px (--text-2xl) | 40px (--text-3xl) | 52px (--text-4xl) |
| Photo | 200×240, centered | 240×290, centered | 280×340, right-aligned |
| Section spacing | 64px | 96px | 128px |
| Project cards | Stacked, full width | Stacked, full width | Stacked, editorial, --max-wide |
| Tools grid | 1 column | 2 columns | 3 columns |
| Experience cards | Stacked | 3 columns | 3 columns |
| Contact links | Stacked | Inline | Inline |
| Body max-width | 100% (with padding) | 600px | 680px |

### Touch Optimization

> *"Bigger + closer targets are easier to click."* — Fitts's Law

- **All interactive elements: minimum 44×44px touch target.** Even if the visual element is smaller (like a nav link), the tappable area extends via padding.
- **No hover-dependent interactions.** Everything that has a hover state also works with a single tap.
- **Bottom-reachable actions on mobile.** Primary CTAs are comfortably in thumb zone.
- **Hamburger menu is generous.** The icon may be 24px wide, but the tap target is 44×44px.

---

## 16. Performance & SEO

> *"Speed is a design feature."*
>
> *"Latency is a tax on trust."*

### Performance IS UX

A slow portfolio communicates: "This person doesn't care about performance." A fast one communicates competence without saying a word.

### Targets

```
Lighthouse:              95+ on all 4 metrics
First Contentful Paint:  < 1.0s
Largest Contentful Paint: < 1.8s
Total Blocking Time:     < 80ms
Cumulative Layout Shift: < 0.05
```

### Implementation Strategy

1. **`next/font`** for Quicksand and Inter. Loaded from Google Fonts at build time, self-hosted, `display: swap`. Zero FOIT.
2. **`next/image`** for all images. Automatic WebP/AVIF conversion. Proper `sizes` attribute. `priority` on hero photo.
3. **CSS Modules** — compiled at build time. Zero runtime CSS cost. No CSS-in-JS overhead.
4. **Framer Motion** as the ONLY JS animation dependency. Tree-shaken. No GSAP, no Three.js, no particles.
5. **Code splitting** — each section as a separate component. Below-fold content dynamically imported where appropriate.
6. **Preload** hero image and critical font weights.
7. **No client-side fetching on load.** All content is static data imported from `lib/data.ts`. No API calls. No loading spinners.

### SEO

```html
<title>Lucky Solanki — Engineer & Founder</title>
<meta name="description" content="I build products people actually use. Engineer at Blitzit, co-founder of Spyll. Full-stack development, from first line to first user." />

<!-- Open Graph -->
<meta property="og:title" content="Lucky Solanki — Engineer & Founder" />
<meta property="og:description" content="I build products people actually use." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://luckysolanki.dev" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Lucky Solanki — Engineer & Founder" />
<meta name="twitter:description" content="I build products people actually use." />
<meta name="twitter:image" content="/og-image.png" />

<!-- Structured Data (JSON-LD) -->
Person schema: name, jobTitle, url, sameAs (GitHub, LinkedIn)
```

### OG Image

Custom 1200×630px image. Matches the site's aesthetic:
- Background: `--bg-primary` (warm off-white)
- "Lucky Solanki" — Quicksand 700, large
- "Engineer & Founder" — Inter 400, below
- Clean, minimal. No photo (looks awkward at small sizes).

---

## 17. Accessibility

> *"Inclusive design is good design."*

### Not Optional. Foundational.

Accessibility isn't a checkbox. It's a design principle. A portfolio that excludes people is a portfolio that says "I only build for some users." That contradicts everything this site stands for.

### Standards: WCAG 2.1 AA

```
Color contrast:        4.5:1 for body text, 3:1 for large text
Keyboard navigation:   All interactive elements focusable and operable via keyboard
Focus indicators:      2px outline, var(--accent), 2px offset. Visible and consistent.
Semantic HTML:         h1 → h2 → h3 in proper order. <main>, <nav>, <section>, <footer>.
Image alt text:        Meaningful descriptions. Not "image" or "photo.jpg".
Reduced motion:        prefers-reduced-motion: all decorative animations disabled
Color scheme:          prefers-color-scheme: initial theme respects system preference
                       (overrideable via toggle, saved in localStorage)
Skip link:             "Skip to content" — visually hidden, visible on Tab focus
ARIA:                  aria-label on icon-only buttons (theme toggle, hamburger)
```

### Focus Order

Tab order follows the visual reading order: Nav links → Hero CTA → About → Work → Contact. Never jumps or skips.

---

## 18. Technical Architecture

> *"Consistency creates calm."*

### Stack

```
Framework:       Next.js 15 (App Router)
Styling:         CSS Modules (no Tailwind, no styled-components, no CSS-in-JS)
Animation:       Framer Motion 11+
State:           Zustand (theme toggle only — localStorage persistence)
Database:        MongoDB (for future contact form or analytics. Not needed for v1.)
Deployment:      Vercel
Fonts:           next/font (Quicksand, Inter)
Language:        TypeScript (strict mode)
Linting:         ESLint + Prettier
```

### Project Structure

```
lucky-2026-portfolio/
├── public/
│   ├── images/
│   │   ├── lucky.jpg
│   │   ├── og-image.png
│   │   └── projects/
│   │       ├── spyll.png
│   │       ├── maddycustom.png
│   │       ├── blitzit.png
│   │       └── dailicle.png
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout: fonts, metadata, theme provider
│   │   ├── page.tsx              # Single page: assembles all sections
│   │   └── globals.css           # CSS variables, reset, base styles, theme definitions
│   │
│   ├── components/
│   │   ├── Nav/
│   │   │   ├── Nav.tsx
│   │   │   └── Nav.module.css
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.css
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── About.module.css
│   │   ├── Work/
│   │   │   ├── Work.tsx
│   │   │   ├── Work.module.css
│   │   │   └── ProjectCard.tsx
│   │   ├── Tools/
│   │   │   ├── Tools.tsx
│   │   │   └── Tools.module.css
│   │   ├── Contact/
│   │   │   ├── Contact.tsx
│   │   │   └── Contact.module.css
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.module.css
│   │   └── shared/
│   │       ├── FadeIn.tsx         # Reusable scroll-reveal wrapper (Framer Motion)
│   │       ├── SectionLabel.tsx   # "ABOUT", "WORK", etc.
│   │       └── ThemeToggle.tsx    # Sun/Moon toggle component
│   │
│   ├── store/
│   │   └── useThemeStore.ts      # Zustand: theme state + localStorage persistence
│   │
│   ├── lib/
│   │   ├── data.ts               # All content: projects, experience, socials, meta
│   │   └── constants.ts          # Site constants: breakpoints, section IDs
│   │
│   └── hooks/
│       ├── useActiveSection.ts   # IntersectionObserver for nav highlighting
│       └── useScrollDirection.ts # Scroll direction for mobile nav hide/show
│
├── .env.example
├── next.config.ts
├── tsconfig.json
├── package.json
└── DESIGN.md                     # This file
```

### Theme: Zustand + CSS Custom Properties

```typescript
// store/useThemeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'portfolio-theme' }
  )
)
```

Applied via `data-theme="light|dark"` on `<html>`. Colors defined in `[data-theme="light"]` and `[data-theme="dark"]` in `globals.css`. All color transitions are pure CSS (300ms). Zero re-renders on theme change.

Initial theme: Check `prefers-color-scheme` first → check localStorage → default to light.

### Data Layer

```typescript
// lib/data.ts
export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  url?: string
  github?: string
  image: string
  stack: string[]
  year: string
  status: 'active' | 'shipped' | 'archived'
}

export const projects: Project[] = [
  {
    slug: 'spyll',
    name: 'Spyll',
    tagline: 'Social platform',
    description: '...',
    url: 'https://spyll.in',
    image: '/images/projects/spyll.png',
    stack: ['Next.js', 'Socket.IO', 'MongoDB', 'WebRTC'],
    year: '2024',
    status: 'active',
  },
  // ...
]

export const experience = [
  { company: 'Blitzit', role: 'Full-Stack Engineer', period: '2025 — Now', current: true },
  { company: 'Spyll', role: 'Co-Founder', period: '2024 — Now', current: true },
  { company: 'MaddyCustom', role: 'Co-Founder', period: '2022 — 2026', current: false },
]

export const socials = {
  github: 'https://github.com/Luckysolanki902',
  linkedin: 'https://linkedin.com/in/luckysolanki902',
  email: 'luckysolanki902@gmail.com',
}

export const siteConfig = {
  name: 'Lucky Solanki',
  title: 'Lucky Solanki — Engineer & Founder',
  description: 'I build products people actually use.',
  url: 'https://luckysolanki.dev',
}
```

---

## Summary

> *"Less noise. More signal."*

This portfolio is a **signal**. It says: this person builds real things, ships them, and presents them with the same care they put into the code.

The surface is calm. The depth is rich. The typography is warm but precise. The spacing is generous and deliberate. The colors are quiet — because the work provides the color. It loads instantly. It looks right on every screen. It respects the user's time, preferences, and ability.

No filler sections. No generic clichés. No technology logo grids. No skill bars. No "passionate problem solver" energy. No noise.

Just work — presented with conviction.

> *"When a product feels obvious, intuitive, and calm — that's not simplicity by accident. That's design done right."*

---

*This is the blueprint. Every decision has been made. Now we build.*
