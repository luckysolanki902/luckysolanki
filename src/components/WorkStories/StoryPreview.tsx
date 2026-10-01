import Image from "next/image";
import Link from "next/link";
import { workStories } from "@/lib/work-stories";
import styles from "./StoryPreview.module.css";
export function StoryPreview() {
  return <section id="work-stories" className={styles.section}>
    <div className={styles.header}><p>Work stories</p><h2>There’s more behind the screen.</h2><span>The problems, decisions, and details behind two products I helped build.</span></div>
    <div className={styles.grid}>{workStories.map(story => <Link href={`/work/${story.slug}`} key={story.slug} className={styles.card}>
      <Image src={story.image} width={1586} height={992} alt={`${story.name} product presentation`} sizes="(max-width: 767px) 90vw, 400px" />
      <div><p>{story.name} <span>↗</span></p><h3>{story.heading}</h3><span>Work experience · Read the story</span></div>
    </Link>)}</div>
  </section>;
}
