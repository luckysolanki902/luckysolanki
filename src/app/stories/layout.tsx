import { JournalFrame } from "@/components/Journal/JournalFrame";
export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JournalFrame>
      <main id="main-content">{children}</main>
    </JournalFrame>
  );
}
