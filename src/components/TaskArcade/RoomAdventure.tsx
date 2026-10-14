"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { createPortal } from 'react-dom';
import type { Character } from '../GamePortfolio/character';
import type { RoomAudio } from '../GamePortfolio/audio';
import { requestJump } from '../GamePortfolio/character';
import styles from './RoomAdventure.module.css';
const BLOCK_X=[970,1034,1098],BLOCK_Y=540,PIPE_X=1630;
const guide=[
 ['A little detour?','There are three blocks above the boy. Tap a brick to break it.'],
 ['Two bricks. One surprise.','Break the two terracotta bricks. The golden block releases a laptop. Walk into the laptop to pick it up.'],
 ['A shortcut to the arcade.','The green pipe on the right is always open. Tap the pipe to drop into the arcade.'],
 ['One more room.','The pipe leads to Ship it: a task-fighting coding arcade. You can return to the portfolio at any time.'],
];
export function RoomAdventure({getCharacter,audio,onEnter,suspended}:{getCharacter:()=>Character;audio:RoomAudio|null;onEnter:()=>void;suspended:boolean}){
 const [guideHost,setGuideHost]=useState<HTMLElement|null>(null);
 useEffect(()=>{const id=requestAnimationFrame(()=>setGuideHost(document.querySelector<HTMLElement>('[aria-label="Interactive room"]')));return()=>cancelAnimationFrame(id);},[]);
 const [blocks,setBlocks]=useState([false,false,false]);const broken=useRef([false,false,false]);
 const [laptop,setLaptop]=useState<'hidden'|'emerging'|'collected'>('hidden');const laptopState=useRef(laptop);
 const entryTime=useRef(-1);
 const [step,setStep]=useState(-1);const [notice,setNotice]=useState('');const [burst,setBurst]=useState(-1);
 const elapsed=useRef(0),spawnAt=useRef(0),previousHead=useRef(643);
 const guideRef=useRef(step);useEffect(()=>{guideRef.current=step;},[step]);
 useEffect(()=>{window.dispatchEvent(new CustomEvent('room-dialogue',{detail:step>=0||!!notice}));return()=>{window.dispatchEvent(new CustomEvent('room-dialogue',{detail:false}));};},[step,notice]);
 const enter=useCallback(()=>{
  if(suspended||entryTime.current>=0)return;
  getCharacter().x=PIPE_X;getCharacter().z=0;getCharacter().vx=0;
  entryTime.current=elapsed.current;setStep(-1);setNotice('');audio?.cue('pipe');
 },[audio,getCharacter,suspended]);
 useEffect(()=>{
  const tutorial=()=>enter();
  const down=(e:KeyboardEvent)=>{
   if(!['ArrowDown','s','S','Enter'].includes(e.key)||suspended)return;
   if(!(document.activeElement as HTMLElement)?.closest('#playable-room'))return;
   if(Math.abs(getCharacter().x-PIPE_X)<55&&getCharacter().grounded&&getCharacter().z>=122){e.preventDefault();enter();}
  };
  window.addEventListener('arcade-guide',tutorial);window.addEventListener('keydown',down);
  let raf=0,last=0,hitAt=-2;
  const animate=(time:number)=>{
   const dt=Math.min((time-(last||time))/1000,.05);last=time;
   if(!suspended&&!document.hidden&&(guideRef.current<0||entryTime.current>=0)){
    elapsed.current+=dt;const m=getCharacter();
    const head=873-m.z-230;
    for(let i=0;i<3;i++)if(!broken.current[i]&&m.vy>0&&head<=BLOCK_Y+64&&previousHead.current>=BLOCK_Y+54&&Math.abs(m.x-(BLOCK_X[i]+32))<48&&elapsed.current-hitAt>.2){
      broken.current[i]=true;setBlocks([...broken.current]);m.vy=-65;hitAt=elapsed.current;
      if(i===2){laptopState.current='emerging';setLaptop('emerging');spawnAt.current=elapsed.current;audio?.cue('bonus');}
      else{setBurst(i);audio?.cue('brick');}
    }
    previousHead.current=head;
    if(laptopState.current==='emerging'&&elapsed.current-spawnAt.current>1.2&&Math.abs(m.x-1130)<95){laptopState.current='collected';setLaptop('collected');audio?.cue('pickup');setNotice('Laptop collected. The green pipe is on your right.');if(guideRef.current>=0)setStep(2);}
    if(entryTime.current>=0){
     const actor=document.querySelector<HTMLElement>('[aria-label="Lucky’s playable character"]');
     const progress=Math.min(1,(elapsed.current-entryTime.current)/.8);
     const descent=progress*272;
     // Clip at the fixed mouth plane, not the bottom of the room or pipe.
     if(actor){actor.style.translate=`0 ${descent}px`;actor.style.clipPath=`inset(0 0 ${Math.max(0,Math.min(272,10+descent))}px 0)`;}
     m.x=PIPE_X;m.z=123;m.vx=0;m.vy=0;m.grounded=true;
     if(progress>=1){entryTime.current=-1;onEnter();}
    }
   }
   raf=requestAnimationFrame(animate);
  };raf=requestAnimationFrame(animate);
  return()=>{const actor=document.querySelector<HTMLElement>('[aria-label="Lucky’s playable character"]');if(actor){actor.style.translate='';actor.style.clipPath='';}cancelAnimationFrame(raf);window.removeEventListener('arcade-guide',tutorial);window.removeEventListener('keydown',down);};
 },[audio,getCharacter,enter,onEnter,suspended]);
 const tapBrick=(i:number)=>{if(broken.current[i])return;const m=getCharacter();m.x=BLOCK_X[i]+32;m.z=0;m.vy=0;m.grounded=true;requestJump(m);document.querySelector<HTMLElement>('[aria-label="Interactive room"]')?.focus({preventScroll:true});if(step<0){try{if(localStorage.getItem("lucky-room-guide")!=="seen")setStep(1);}catch{setStep(1);}}};
 return <>
  <div className={styles.bricks} style={{left:BLOCK_X[0],top:BLOCK_Y}}>{blocks.map((b,i)=><button key={i} onClick={()=>tapBrick(i)} aria-label={i===2?'Jump to hit the laptop bonus block':`Jump to break brick ${i+1}`} disabled={b} style={{visibility:b&&i<2?'hidden':'visible'}}><span aria-hidden="true" className={i===2?(b?styles.spentTile:styles.bonusTile):styles.brickTile}>{i===2?(b?'·':'?'):''}</span></button>)}</div>
  {burst>=0&&<Image unoptimized width={192} height={192} key={burst} className={styles.fragments} style={{left:BLOCK_X[burst]-20,top:BLOCK_Y}} src="/game/arcade/frames/debris.png" alt=""/>}
  {laptop==='emerging'&&<Image unoptimized width={192} height={192} className={styles.laptop} style={{left:1088,top:580}} src="/game/arcade/frames/laptop.png" alt="Laptop power-up"/>}
  <button className={styles.pipe} onClick={enter} aria-label="Enter green pipe arcade" style={{left:PIPE_X-72,top:703}}><Image unoptimized width={192} height={192} className={styles.shaft} src="/game/arcade/frames/pipe.png" alt=""/><span>↓ Enter</span></button>
  {!suspended&&guideHost&&(step>=0||notice)&&createPortal(<aside className={styles.guide} aria-label="Room game guide" onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}><div className={styles.portrait} aria-hidden="true"/><div className={styles.dialogue}><span>LUCKY</span><p key={notice||step}>{notice||guide[step][1]}</p><button onClick={()=>{if(notice){setNotice('');setStep(-1);guideHost.focus({preventScroll:true});}else if(step<3)setStep(step+1);else{setStep(-1);enter();}}}>{notice?'Got it ▸':step===3?'Enter pipe ▸':'Continue ▸'}</button></div><button className={styles.close} aria-label="Dismiss room guide" onClick={()=>{setStep(-1);setNotice('');guideHost.focus({preventScroll:true});try{localStorage.setItem('lucky-room-guide','seen');}catch{}}}>×</button></aside>,guideHost)}
 </>;
}
