import { permanentRedirect } from "next/navigation";
const blitzit = new Set(["blitzy-voice-shared-agent","training-hey-blitzy","designing-blitzy-orb","one-tool-layer-two-agents","blitzit-3-platform-rewrite","blitzit-integration-plugin-system","blitzit-undo-redo-change-journal","not-every-failure-is-an-outage","retries-need-a-source-of-truth"]);
export default async function LegacyPost({params}:{params:Promise<{slug:string}>}){const {slug}=await params;permanentRedirect(blitzit.has(slug)?"/work/blitzit":slug==="maddycustom-admin-ops"?"/work/maddycustom":"/work");}
