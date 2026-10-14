import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkStory } from "@/lib/work-stories";
import { siteConfig } from "@/lib/data";
import { shareImage } from "@/lib/seo";

export const runtime = "nodejs";
const pages: Record<string, { heading: string; label: string }> = {
  work: { heading: "The work behind the interface.", label: "ENGINEERING STORIES" },
  notes: { heading: "Notes from the build.", label: "FIELD NOTES" },
  ai: { heading: "AI tools. Human judgment.", label: "APPLIED AI / FIELD NOTES" },
  journey: { heading: "How I got into software.", label: "THE LONG WAY INTO SOFTWARE" },
};

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("post");
  if (!slug) return Response.redirect(new URL(shareImage, siteConfig.url), 307);
  const story = getWorkStory(slug);
  const page = pages[slug] ?? (story ? { heading: story.heading, label: `${story.name.toUpperCase()} / ENGINEERING STORY` } : undefined);
  if (!page) return new Response("Not found", { status: 404 });
  const room = await readFile(join(process.cwd(), "public/game/sprites/v2/00.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3f0e8", color: "#171918", fontFamily: "sans-serif", position: "relative" }}>
      {/* Native img is required by the image renderer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${room.toString("base64")}`} alt="" width={100} height={140} style={{ position: "absolute", right: 64, bottom: 95, objectFit: "contain" }}/>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"58px 64px",width:"100%",position:"relative"}}>
        <div style={{display:"flex",fontSize:19,letterSpacing:3,color:"#386757"}}>{page.label}</div>
        <div style={{display:"flex",flexDirection:"column",maxWidth:820}}><div style={{fontSize:72,fontWeight:700,letterSpacing:-3,lineHeight:1.08}}>{page.heading}</div><div style={{fontSize:25,color:"#62665e",marginTop:28}}>Lucky Solanki · Backend & AI engineer</div></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:19,borderTop:"1px solid #d4d4c9",paddingTop:22}}><span>luckysolanki.com</span><span style={{color:"#386757"}}>The backend behind a better product.</span></div>
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
