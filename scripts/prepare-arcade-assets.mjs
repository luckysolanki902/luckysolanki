import sharp from 'sharp';
import {writeFile,mkdir} from 'node:fs/promises';
const root='public/game/arcade';
await mkdir(`${root}/frames`,{recursive:true});
const manifest={cell:192,anchor:{x:96,y:184},animations:{coding:{frames:[0,1,2,3,4,5,6,7],ms:140,loop:true},fire:{frames:[8,9,10,11],ms:65,loop:false},death:{frames:[12,13,14,15,16,17],ms:150,loop:false},recover:{frames:[18,19],ms:200,loop:false},celebrate:{frames:[20,21,22,23],ms:130,loop:false}},props:{}};
let total=0;
for(const [sheet,rows] of [['coding',3],['reactions',3],['props',4]]){
 const meta=await sharp(`${root}/source/${sheet}.png`).metadata();
 const bounds=[];
 const raw=await sharp(`${root}/source/${sheet}.png`).ensureAlpha().raw().toBuffer();
 // Find transparent gutters near the nominal grid, rather than slicing a pose.
 function gutter(ideal,radius,start,end,vertical){
   let best=ideal,bestScore=Infinity;
   for(let q=Math.round(ideal-radius);q<=ideal+radius;q++){
     let count=0;
     for(let p=start;p<end;p++)if(raw[(vertical ? p*meta.width+q : q*meta.width+p)*4+3]>110)count++;
     const score=count*1000+Math.abs(q-ideal);
     if(score<bestScore){best=q;bestScore=score;}
   }
   return best;
 }
 const ys=[0,...Array.from({length:rows-1},(_,i)=>gutter((i+1)*meta.height/rows,40,0,meta.width,false)),meta.height];
 for(let i=0;i<rows*4;i++){
  const row=Math.floor(i/4),col=i%4;
  const xs=[0,...Array.from({length:3},(_,j)=>gutter((j+1)*meta.width/4,65,ys[row],ys[row+1],true)),meta.width];
  const x=xs[col],y=ys[row],w=xs[col+1]-x,h=ys[row+1]-y;
  const {data,info}=await sharp(`${root}/source/${sheet}.png`).extract({left:x,top:y,width:w,height:h}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let l=w,t=h,r=0,b=0;
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
   const at=(yy*w+xx)*4;
   if(data[at+3]<110)data[at+3]=0;else{data[at+3]=255;l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}
  }
  if(r<=l||b<=t)throw Error(`Empty ${sheet}/${i}`);
  const buffer=await sharp(data,{raw:info}).extract({left:l,top:t,width:r-l+1,height:b-t+1}).png().toBuffer();
  bounds.push({buffer,width:r-l+1,height:b-t+1});
 }
 const scale=sheet==='props'?1:Math.min(172/Math.max(...bounds.map(b=>b.width)),145/bounds[0].height);
 const propNames=['brick','brick-cracked','bonus','bonus-spent','pipe','pipe-lip','plant-bud','plant-open','plant-left','plant-right','plant-retract','debris','laptop','headphones','tokens','sparkle'];
 for(let i=0;i<bounds.length;i++){
  const b=bounds[i];const factor=sheet==='props'?Math.min(176/b.width,176/b.height):scale;
  const w=Math.round(b.width*factor),h=Math.min(184,Math.round(b.height*factor));
  const buf=await sharp(b.buffer).resize(w,h,{kernel:'nearest'}).png().toBuffer();
  const id=sheet==='props'?propNames[i]:`boy-${String(total++).padStart(2,'0')}`;
  await sharp({create:{width:192,height:192,channels:4,background:'#00000000'}}).composite([{input:buf,left:Math.round((192-w)/2),top:184-h}]).png().toFile(`${root}/frames/${id}.png`);
  if(sheet==='props')manifest.props[id]={src:`/game/arcade/frames/${id}.png`,width:w,height:h,anchor:{x:96,y:184}};
 }
}
await sharp({create:{width:192*8,height:192*3,channels:4,background:'#00000000'}}).composite(Array.from({length:24},(_,i)=>({input:`${root}/frames/boy-${String(i).padStart(2,'0')}.png`,left:i%8*192,top:Math.floor(i/8)*192}))).png().toFile(`${root}/boy.png`);
await writeFile(`${root}/manifest.json`,JSON.stringify(manifest,null,2));
console.log('Registered 24 character frames + 16 prop frames; manifest and 8×3 atlas saved.');
