import sharp from 'sharp';
const src='public/game/arcade/source/manager.png';
const {width,height}=await sharp(src).metadata();
const parts=[];
for(let i=0;i<8;i++){
 const left=Math.round(i%4*width/4),top=Math.round(Math.floor(i/4)*height/2);
 const cell=await sharp(src).extract({left,top,width:Math.round((i%4+1)*width/4)-left,height:Math.round((Math.floor(i/4)+1)*height/2)-top}).resize(128,128,{fit:'contain',kernel:'nearest',background:'#00000000'}).png().toBuffer();
 parts.push({input:cell,left:i%4*128,top:Math.floor(i/4)*128});
}
await sharp({create:{width:512,height:256,channels:4,background:'#00000000'}}).composite(parts).png().toFile('public/game/arcade/manager.png');
