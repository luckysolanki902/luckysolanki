import type { Metadata } from "next";
import { Nav } from "@/components/Nav/Nav";
import { StoryPreview } from "@/components/WorkStories/StoryPreview";
export const metadata: Metadata = {title:"Work stories | Lucky Solanki",description:"Inside Blitzit and MaddyCustom: the product problems, backend systems, AI, and engineering decisions behind my work.",alternates:{canonical:"https://www.luckysolanki.com/work"}};
export default function WorkStoriesPage(){return <><Nav/><main id="main-content" style={{paddingTop:90}}><StoryPreview/></main></>}
