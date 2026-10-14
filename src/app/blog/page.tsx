import { pageMetadata } from "@/lib/seo";
import { NotesIndex } from "@/components/Journal/JournalFrame";
export const metadata = pageMetadata({ title: "Field notes | Lucky Solanki", description: "Engineering decisions, product lessons and notes on backend systems, applied AI and learning by building.", path: "/blog", card: "notes" });
export default function BlogPage() {
  return <NotesIndex />;
}
