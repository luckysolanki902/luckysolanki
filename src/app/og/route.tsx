import { ImageResponse } from "next/og";
import { getWorkStory } from "@/lib/work-stories";
import { getExperienceYears } from "@/lib/experience";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("post");
  const post = slug ? getWorkStory(slug) : undefined;
  if (slug && !post) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px 64px", color: "#f5f1e6", background: "linear-gradient(125deg, #293c52 0%, #52677e 65%, #8996a6 100%)", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3 }}><span>{post ? "WORK STORIES" : "BACKEND & AI ENGINEER"}</span><span style={{ color: "#dce3e9", letterSpacing: 0 }}>luckysolanki.com</span></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: post ? 70 : 116, fontWeight: 700, lineHeight: 1.04, letterSpacing: post ? -3 : -6, maxWidth: 1060 }}>{post ? post.heading : "LUCKY SOLANKI"}</div>
        <div style={{ fontSize: 30, lineHeight: 1.4, marginTop: 26, color: "#e2e8ee", maxWidth: 820 }}>{post ? "Engineering decisions, tradeoffs, and lessons from real products." : "Building products, systems, and the connections between them."}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ffffff40", paddingTop: 24, fontSize: 23 }}><span>{post ? "Lucky Solanki" : `${getExperienceYears()}+ years · Full-stack products · AI infrastructure`}</span><span>Explore the {post ? "article" : "work"} ↗</span></div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
