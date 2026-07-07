/* ============================================================
   page.tsx — the home spread: a pop-up storybook of Lucky's
   work. The Book shell (layout) provides the sky, clouds,
   ribbons, and Buddy; this fills the pages.
   ============================================================ */

import { Storybook } from "@/components/Storybook/Storybook";

export default function Home() {
  return (
    <main id="main-content">
      <Storybook />
    </main>
  );
}
