import { NextResponse } from 'next/server';
export async function GET(){
 try{
  const response=await fetch('https://github.com/users/luckysolanki902/contributions',{next:{revalidate:3600},signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('GitHub unavailable');
  const html=await response.text();
  const days=Array.from(html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)).map(m=>({date:m[1],level:Number(m[0].match(/data-level="([0-4])"/)?.[1]??0),id:m[0].match(/\bid="([^"]+)"/)?.[1]}));
  const counts=new Map(Array.from(html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)).map(m=>[m[1],Number(m[2].trim().match(/^([\d,]+)/)?.[1].replaceAll(',','')??0)]));
  if(days.length<300)throw new Error('Calendar unavailable');
  const contributions=days.map(d=>({date:d.date,level:d.level,count:counts.get(d.id??'')??0})).sort((a,b)=>a.date.localeCompare(b.date));
  return NextResponse.json({days:contributions,total:contributions.reduce((n,d)=>n+d.count,0),updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'}});
 }catch{return NextResponse.json({days:[],unavailable:true},{status:503});}
}
