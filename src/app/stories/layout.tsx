/* ============================================================
   /stories layout — Wraps story pages with Nav + Footer.
   Keeps the reading column centred and calm.
   ============================================================ */

import { Nav } from "@/components/Nav/Nav";
import { Footer } from "@/components/Footer/Footer";

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
