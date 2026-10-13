import type { Metadata } from "next";
import { NotesIndex } from "@/components/Journal/JournalFrame";
export const metadata: Metadata = {
  title: "Field notes | Lucky Solanki",
  description:
    "Notes on building products, backend systems, and finding my way into software.",
};
export default function BlogPage() {
  return <NotesIndex />;
}
