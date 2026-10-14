import { pageMetadata } from "@/lib/seo";
import { NotesIndex } from "@/components/Journal/JournalFrame";
export const metadata = pageMetadata({ title: "Engineering work | Lucky Solanki", description: "Inside Blitzit’s backend and MaddyCustom’s commerce platform: ownership, architecture, recovery paths and engineering tradeoffs.", path: "/work", card: "work" });
export default function WorkStoriesPage() {
  return <NotesIndex />;
}
