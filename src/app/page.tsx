/* ============================================================
   page.tsx — Single page: assembles all sections.
   Order follows the scroll: Nav → Hero → About → Work →
   Tools → Contact → Footer
   ============================================================ */

import { Nav } from "@/components/Nav/Nav";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { Work } from "@/components/Work/Work";
import { Tools } from "@/components/Tools/Tools";
import { Stories } from "@/components/Stories/Stories";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <Work />
        <Tools />
        <Stories />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
