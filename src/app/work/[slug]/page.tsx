import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { workStories, getWorkStory } from "@/lib/work-stories";
import { narratives } from "@/content/work/narratives";
import { siteConfig } from "@/lib/data";
import { JournalFrame } from "@/components/Journal/JournalFrame";

import { workMedia } from "@/lib/work-media";
import { EngineeringBrief } from "@/components/WorkStories/EngineeringBrief";
import { StoryContents } from "@/components/WorkStories/StoryContents";
import { StoryImage } from "@/components/WorkStories/StoryImage";
import styles from "../work-story.module.css";

export const dynamic = "force-static";
export function generateStaticParams() {
  return workStories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getWorkStory(slug);
  if (!story) return {};
  const title = `${story.name}: ${story.heading} | Lucky Solanki`;
  return pageMetadata({ title, description: story.introduction, path: `/work/${slug}`, card: slug, article: true });
}
export default async function WorkStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getWorkStory(slug);
  if (!story) notFound();
  const narrative = narratives[slug];
  const media = workMedia[slug];
  const imagesFor = (section: string) =>
    media
      .filter((image) => image.section === section)
      .map((image) => <StoryImage key={image.id} image={image} />);
  const words = [
    story.introduction,
    ...narrative.opening,
    ...story.features.flatMap((f) => [
      f.outcome,
      f.how,
      ...(narrative.notes[f.id] ?? []),
    ]),
    ...(narrative.chapters ?? []).flatMap((c) => c.paragraphs),
    ...narrative.closing,
  ]
    .join(" ")
    .split(/\s+/).length;
  const other = workStories.find((s) => s.slug !== slug)!;
  return (
    <JournalFrame>
      <main id="main-content" className={styles.page}>
        <article>
          <header className={styles.header}>
            <Link href="/#work" className={styles.back}>
              ← Back to work
            </Link>
            <p className={styles.eyebrow}>
              {story.name} / 1-minute brief · {Math.ceil(words / 220)}-minute deep dive
            </p>
            <h1>{story.heading}</h1>
            <p className={styles.lede}>{story.introduction}</p>
            <div className={styles.byline}>
              <span>By Lucky Solanki</span>
              <span>{story.role}</span>
              <span>{story.period}</span>
            </div>
          </header>
          <EngineeringBrief slug={slug}/>
          <div className={styles.cover}>
            <StoryImage image={media[0]} priority />
          </div>
          <div className={styles.layout}>
            <StoryContents
              name={story.name}
              minutes={Math.ceil(words / 220)}
              screenshotCount={media.length}
              chapters={[
                { id: "brief", label: "The one-minute brief" },
                { id: "starting-point", label: "The product & my role" },
                ...story.features.map((f) => ({
                  id: f.id,
                  label:
                    (
                      {
                        architecture: "The backend, built from scratch",
                        voice: "Voice & the two-agent design",
                        "wake-word": "Hey Blitzy & the orb",
                        integrations: "Connected tools & sync",
                        "shared-tools": "MCP & shared permissions",
                        undo: "Reversible AI actions",
                        collaboration: "Realtime collaboration",
                        memory: "Memory & user control",
                        platform: "Core backend & billing",
                        migration: "The move to Blitzit 3.0",
                        reliability: "Reliability & recovery",
                        commerce: "Storefront & product discovery",
                        payments: "Payments & recovery",
                        operations: "Orders, production & shipping",
                        analytics: "Funnels & customer journeys",
                        assistant: "The AI shopping assistant",
                        ownership: "Business & engineering decisions",
                      } as Record<string, string>
                    )[f.id] ?? f.title,
                })),
                ...(narrative.chapters
                  ? [
                      {
                        id: "voice-details",
                        label: "Inside the voice experience",
                      },
                    ]
                  : []),
                { id: "takeaway", label: "What I learned" },
              ]}
              details={narrative.chapters?.map((c, i) => ({
                id: `voice-detail-${i}`,
                label: c.heading,
              }))}
            />
            <div className={styles.prose}>
              <section id="starting-point">
                <p className={styles.sectionLabel}>The starting point</p>
                {narrative.opening.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <div className={styles.scope}>
                  <strong>My role</strong>
                  <p>{story.ownership}</p>
                </div>
                {imagesFor("starting-point")}
              </section>
              {story.features.map((feature, i) => {
                return (
                  <section id={feature.id} key={feature.id}>
                    <p className={styles.sectionLabel}>
                      {String(i + 1).padStart(2, "0")} / {feature.tech}
                    </p>
                    <h2>{feature.title}</h2>
                    <p className={styles.outcome}>{feature.outcome}</p>
                    <p>{feature.how}</p>
                    {(narrative.notes[feature.id] ?? []).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {imagesFor(feature.id)}
                  </section>
                );
              })}
              {narrative.chapters && (
                <section id="voice-details">
                  <p className={styles.sectionLabel}>A closer look</p>
                  <h2>Inside Blitzy’s voice experience.</h2>
                  <p>
                    The shared backend is what makes voice useful. The next
                    challenge is keeping the conversation accurate, responsive,
                    and understandable while that work happens.
                  </p>
                  <figure>
                    <Image
                      src="/images/projects/blitzit/orb-states.webp"
                      alt="Blitzy orb design study showing listening, speaking, thinking, acting and muted states"
                      width={1520}
                      height={1240}
                      sizes="(max-width:767px) 92vw, 820px"
                    />
                    <figcaption>
                      Original orb design study from the implementation
                      repository. These are interface states, not a recording of
                      a live call.
                    </figcaption>
                  </figure>
                  {narrative.chapters.map((chapter, i) => (
                    <section
                      className={styles.subchapter}
                      key={chapter.heading}
                      id={`voice-detail-${i}`}
                    >
                      <h3>{chapter.heading}</h3>
                      {chapter.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                      {chapter.bullets && (
                        <ul>
                          {chapter.bullets.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </section>
              )}
              <section id="takeaway">
                <h2>What I take from it.</h2>
                {narrative.closing.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className={styles.status}>{story.status}</p>
                {slug === "maddycustom" && (
                  <p className={styles.status}>
                    Revenue shown in USD using the October 1, 2026 reference
                    rate.{" "}
                    <a
                      href="https://www.valutafx.com/convert/usd-inr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Conversion source ↗
                    </a>
                  </p>
                )}
              </section>
              <div className={styles.next}>
                <span>Keep exploring</span>
                <Link href={`/work/${other.slug}`}>
                  {other.name}: {other.heading} ↗
                </Link>
                <Link href="/#contact">
                  Have a problem like this? Let’s talk ↗
                </Link>
              </div>
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: story.heading,
                description: story.introduction,
                author: {
                  "@type": "Person",
                  name: "Lucky Solanki",
                  url: siteConfig.url,
                },
                image: `${siteConfig.url}${story.image}`,
                mainEntityOfPage: `${siteConfig.url}/work/${slug}`,
              }).replace(/</g, "\\u003c"),
            }}
          />
        </article>
      </main>
    </JournalFrame>
  );
}
