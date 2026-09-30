# Portfolio polish plan

Goal: make a founder or recruiter quickly understand Lucky's backend and AI work, enjoy exploring it, and easily reach the evidence or start a conversation.

## Design decisions

- Retain the large name, portrait, winter atmosphere, alternating project layouts, and testimonial carousel.
- Put specific engineering work before generic personality copy. Add an early resume link.
- Introduce a compact interactive system walkthrough after the first three projects. Show permission checks, execution, and reversible writes, based on the existing Blitzit case study. Clearly label the flow as an illustrative model, not a live production trace.
- Keep project summaries short, with visible ownership and outcomes. Preserve long-form technical detail behind accessible disclosure controls.
- Keep the two decks of three, but reserve enough scroll space to read each card. On small screens, let tall cards scroll fully before pinning their bottom. Disable stacking when a card contains keyboard focus or expanded notes.
- Replace the long stack inventory with three concise capability groups and a short supporting stack line.
- Give local companion comments a longer gap, keep explicit action feedback prompt, and avoid idle comments during reading.
- No fabricated performance numbers, customer quotes, availability claims, or technical behavior beyond the existing case studies.

## Acceptance checks

- Home identifies role, experience, work, and resume without needing the bot.
- System walkthrough has working success, denied-permission, and undo states, supports keyboard input, and respects reduced motion.
- Card controls remain reachable on desktop and mobile; expanded content is never hidden beneath another card.
- Images remain eager and text remains visible while scrolling.
- No horizontal overflow at 390px; both palettes stay legible.
- Build and relevant behavior tests pass. No commits or production deployment for this review iteration.

## Completed verification

- Production build passed; targeted ESLint and whitespace checks passed.
- All 12 tests passed, including blocked writes, successful writes, undo, and companion cooldowns.
- Browser verified the allowed, denied, and undo paths.
- Checked the new panel in both themes and at a 390px mobile viewport with no horizontal overflow.
- Verified that expanded details span the card and disable stacking; keyboard focus also disables stacking.
- Reduced-motion handling remains enabled for the deck, hero, and new walkthrough. The walkthrough skips its artificial stage delays for that preference.
- Work remains local and uncommitted. Production has not been redeployed for this iteration.

## Readability follow-up

Moved the walkthrough between the two project decks so the hero leads directly to work. Removed its outer section padding and reduced the heading size. Increased project summaries and technical notes to 15–16px, supporting metadata to 12–14px, and walkthrough labels and controls to 12–15px. Enlarged the hero supporting text and core-stack copy. Responsive pin positions let tall cards scroll through before stacking, without shrinking their type.

### Responsive decks

Enabled both three-card decks on mobile and tablet. Sticky offsets adapt to each card height so all text and controls can be reached before the next card overlaps. The depth effect uses one shared scroll frame and transform-only writes. Reduced motion, keyboard focus, and expanded notes keep normal document flow. Added geometry regression coverage for desktop, tablet, and tall mobile cards.
