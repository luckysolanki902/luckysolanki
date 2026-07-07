/* ============================================================
   page.tsx — the home page. A calm, scrollable pastel portfolio.
   Nav → Hero → About → Work → Notes → Contact → Footer.
   ============================================================ */

import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Work } from "@/components/site/Work";
import { Notes } from "@/components/site/Notes";
import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main-content">
        <Hero />
        <About />
        <Work />
        <Notes />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
