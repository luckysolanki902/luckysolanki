"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Music, Music2, RotateCcw, HelpCircle } from 'lucide-react';
import { ARENA, createGame, stepGame, type Input, type State } from './engine';
import type { RoomAudio } from '../GamePortfolio/audio';
import styles from './TaskArcade.module.css';
// Render control hints with the movement/action keys as distinct keycaps.
const KEY_SPLIT=/(\{ \}|Space|←|→|↑|↓|◀|▶|▲|\b[ADWS]\b)/g;
const isKeyToken=(s:string)=>/^(\{ \}|Space|←|→|↑|↓|◀|▶|▲|[ADWS])$/.test(s);
const renderTip=(text:string)=>text.split(KEY_SPLIT).map((part,i)=>part===''?null:isKeyToken(part)?<kbd key={i} className={styles.key}>{part}</kbd>:<span key={i}>{part}</span>);
const names=['Backlog','This week','Today','Done'];
const tips=['← → / A D move. ↑ / W jump. ↓ / S drop faster in the air.',
 'Hold Space to send code. Clear different columns within 12 seconds for up to ×3 points.',
 'Jump with ↑ / W. Unsupported stacks shake for 0.8 seconds before falling—move away!',
 'The recurring manager favors emptier columns. Keep hitting to defeat them. Dodge the red deadline marker: it locks your position before dropping.',
 'Walk into gold coins in Done for +25 each. There is no permanently safe column.',
 'Overdue piles raise pressure across the board. Clear tasks to lower it. At 100%, the run ends.'];
const mobileTips=['Drag the slider to move. Tap ▲ to jump.',
 'Hold the { } button to send code. Clear a different column within 12 seconds for up to ×3 points.',
 'Tap ▲ to jump clear. Unsupported stacks shake for 0.8 seconds before they fall—move away!',
 'The recurring manager favors emptier columns. Keep tapping { } to defeat them. Dodge the red deadline marker: it locks your position before dropping.',
 'Walk into gold coins in Done for +25 each. There is no permanently safe column.',
 'Overdue piles raise pressure across the board. Clear tasks to lower it. At 100%, the run ends.'];
export function TaskArcade({audio,onExit}:{audio:RoomAudio|null;onExit:()=>void}) {
 const game=useRef<State>(createGame());
 const [view,setView]=useState<State>(()=>createGame(1));
 const [mode,setMode]=useState<'playing'|'paused'|'dead'>('playing');
 const modeRef=useRef(mode);
 const [tip,setTip]=useState(0),[best,setBest]=useState(0),[sound,setSound]=useState(audio?.sound??true),[music,setMusic]=useState(audio?.music??true),[showHelp,setShowHelp]=useState(false);
 const tutorial=useRef(0),nextTutorial=useRef(1);
 const acknowledge=()=>{tutorial.current=-1;setTip(-1);audio?.configure({paused:false});document.getElementById('task-arena')?.focus({preventScroll:true});};
 const learned=useRef({move:false,fire:false,jump:false});
 const input=useRef<Input>({move:0,jump:false,fire:false});
 const keys=useRef(new Set<string>()),touch=useRef(new Set<string>());
 const touchMove=useRef(0);
 const sliderRef=useRef<HTMLDivElement>(null),slidePointer=useRef<number|null>(null);
 const [moveVal,setMoveVal]=useState(0);
 const resetSlider=useCallback(()=>{slidePointer.current=null;touchMove.current=0;setMoveVal(0);},[]);
 const applySlide=(clientX:number)=>{const el=sliderRef.current;if(!el)return;const r=el.getBoundingClientRect();const usable=Math.max(1,(r.width-r.height)/2);let v=(clientX-(r.left+r.width/2))/usable;v=Math.max(-1,Math.min(1,v));setMoveVal(v);const a=Math.abs(v);touchMove.current=a>0.1?Math.sign(v)*Math.min(1,(a-0.1)/0.75):0;};
 const exitButton=useRef<HTMLButtonElement>(null);
 const setStatus=useCallback((next:typeof mode)=>{modeRef.current=next;setMode(next);input.current={move:0,jump:false,fire:false};keys.current.clear();touch.current.clear();resetSlider();if(audio){audio.configure({paused:next!=='playing'||tutorial.current>=0});}},[audio,resetSlider]);
 const begin=()=>{tutorial.current=-1;setTip(-1);nextTutorial.current=tips.length;game.current=createGame();setView({...game.current});audio?.unlock();audio?.cue('restart');setStatus('playing');};
 const toggle=(kind:'sound'|'music')=>{if(!audio)return;audio.configure({[kind]:!audio[kind]});setSound(audio.sound);setMusic(audio.music);try{localStorage.setItem('lucky-audio',JSON.stringify({sound:audio.sound,music:audio.music}));}catch{}audio.unlock();audio.sync();};
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;
  const scroll=document.body.style.overflow;document.body.style.overflow='hidden';document.getElementById('task-arena')?.focus({preventScroll:true});
  if(audio){audio.configure({arcade:true,paused:tutorial.current>=0});}
  const readBest=requestAnimationFrame(()=>{try{setBest(Number(localStorage.getItem('lucky-arcade-best'))||0);}catch{}});
  const pause=()=>{if(modeRef.current==='playing')setStatus('paused');};
  const down=(e:KeyboardEvent)=>{
   if(e.key==='Tab')return;
   if(e.key==='Escape'){e.preventDefault();pause();return;}
   const key=e.code==='Space'?'space':e.key.toLowerCase();
   if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s','space'].includes(key)){
    if(modeRef.current!=='playing'||tutorial.current>=0||(e.target as HTMLElement).closest('button'))return;
    e.preventDefault();keys.current.add(key);
   }
  };
  const up=(e:KeyboardEvent)=>{keys.current.delete(e.code==='Space'?'space':e.key.toLowerCase());};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',pause);document.addEventListener('visibilitychange',pause);
  let raf=0,previousTime=0,paintTime=0;
  const animate=(now:number)=>{
   const dt=Math.min((now-(previousTime||now))/1000,.033);previousTime=now;
   if((modeRef.current==='playing'&&tutorial.current<0)||modeRef.current==='dead'){
    const active=(...values:string[])=>values.some(k=>keys.current.has(k)||touch.current.has(k));
    const km=Number(active('arrowright','d'))-Number(active('arrowleft','a'));
    input.current={move:km!==0?km:touchMove.current,jump:active('arrowup','w','jump'),fire:active('space','fire'),drop:active('arrowdown','s')};
    stepGame(game.current,input.current,dt);
    if(input.current.move)learned.current.move=true;
    if(input.current.fire)learned.current.fire=true;
    if(input.current.jump)learned.current.jump=true;
    const stage=nextTutorial.current;
    if((stage===1&&learned.current.move&&game.current.time>2)||(stage===2&&(game.current.time>8||game.current.tasks.some(t=>t.overdue)))||(stage===3&&!!game.current.manager)||(stage===4&&(game.current.rewards.length>0||game.current.time>20))||(stage===5&&(game.current.pressure>0||game.current.time>25))){
      setView({...game.current});tutorial.current=stage;setTip(stage);nextTutorial.current++;keys.current.clear();touch.current.clear();resetSlider();audio?.configure({paused:true});
    }
    for(const event of game.current.events)audio?.cue(event);
    if(game.current.dead&&modeRef.current!=='dead'){
      setStatus('dead');const score=game.current.score;
      try{const high=Math.max(score,Number(localStorage.getItem('lucky-arcade-best'))||0);localStorage.setItem('lucky-arcade-best',String(high));setBest(high);}catch{setBest(v=>Math.max(v,score));}
    }
    if(now-paintTime>30){setView({...game.current});paintTime=now;}
   }
   raf=requestAnimationFrame(animate);
  };
  raf=requestAnimationFrame(animate);
  return()=>{cancelAnimationFrame(raf);cancelAnimationFrame(readBest);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',pause);document.removeEventListener('visibilitychange',pause);document.body.style.overflow=scroll;try{localStorage.setItem('lucky-arcade-best',String(Math.max(game.current.score,Number(localStorage.getItem('lucky-arcade-best'))||0)));}catch{}if(audio){audio.configure({arcade:false,paused:false});}previous?.focus({preventScroll:true});};
 },[audio,setStatus,resetSlider]);
 // Keep focus inside the game while it is open, and make Space belong to the arena after Start.
 const focusArena=()=>document.getElementById('task-arena')?.focus({preventScroll:true});
 const frame=view.dead?12+Math.min(5,Math.floor(view.deathTime/.15)):view.time-view.player.shotAt<.25?8+Math.min(3,Math.floor((view.time-view.player.shotAt)/.065)):view.time-view.player.celebrateAt<.52?20+Math.min(3,Math.floor((view.time-view.player.celebrateAt)/.13)):Math.floor(view.time/.14)%8;
 const manager=view.manager;
 const managerFrame=manager?manager.leaving?(manager.hp===0?6:7):manager.hit>0?5:manager.nextThrow-view.time<.25?3:manager.nextThrow-view.time<.55?2:manager.nextThrow-view.time<.9?1:Math.floor(manager.age*2)%5===4?4:0:0;
 const styleAt=(x:number,y:number)=>({left:`${x/10}%`,top:`${y/6.2}%`});
 const touchControl=(id:string,label:string,symbol:string,className='')=><button key={id} className={className} aria-label={label} onContextMenu={e=>e.preventDefault()} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);touch.current.add(id);}} onPointerUp={()=>touch.current.delete(id)} onPointerCancel={()=>touch.current.delete(id)} onLostPointerCapture={()=>touch.current.delete(id)}><span aria-hidden="true">{symbol}</span></button>;
 return createPortal(<div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Ship it task arcade" onKeyDown={e=>{if(e.key!=='Tab')return;const nodes=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]'));const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}>
  <header className={styles.header} aria-label="Arcade HUD">
   <button ref={exitButton} className={styles.exitControl} onClick={onExit} aria-label="← Portfolio"><span aria-hidden="true">↩</span><small>PORTFOLIO</small></button>
   <div className={styles.gameTitle}><span className={styles.titleMark} aria-hidden="true">{`{ }`}</span><div><strong>SHIP IT<span>!</span></strong><small>SURVIVE THE BACKLOG</small></div></div>
   <div className={styles.scores}><span><small>SCORE</small><b>{view.score.toLocaleString('en-US')}</b></span><span><small>BEST</small><b>{Math.max(best,view.score).toLocaleString('en-US')}</b></span><span><small>COINS</small><b>{view.coins}</b></span><span className={styles.levelStat}><small>LEVEL</small><b>{view.level}</b><i aria-hidden="true">{Array.from({length:10},(_,i)=><em key={i} className={i<view.level?styles.levelFilled:''}/>)}</i></span></div>
   <button className={styles.pauseControl} aria-label={mode==='paused'?'Resume':'Game menu'} onClick={()=>{setStatus(mode==='playing'?'paused':'playing');focusArena();}} disabled={mode==='dead'}><span aria-hidden="true">{mode==='paused'?'▶':'☰'}</span><small>{mode==='paused'?'RESUME':'MENU'}</small></button>
  </header>
  <div className={`${styles.gameLayout}`}>
    <div className={styles.boardShell}>
     <div className={styles.pressureHud}><label>BACKLOG PRESSURE <b>{Math.floor(view.pressure)}%</b><meter min={0} max={100} low={35} high={70} optimum={0} value={view.pressure}/></label>{view.combo>1&&<span>×{view.combo} COLUMN COMBO</span>}</div>
     <div className={styles.columns}>{names.map((name,i)=><div key={name}><span className={styles.dot} style={{background:['#e0bc91','#c9b5ed','#b6c5fb','#8fd9ad'][i]}}/>{name}<small>{i===3?view.completed:view.tasks.filter(t=>t.lane===i).length}</small></div>)}</div>
     <div id="task-arena" tabIndex={0} className={`${styles.arena} ${mode==='dead'?styles.dead:''}`} data-mode={mode} data-score={view.score} style={{aspectRatio:`${ARENA.width}/${ARENA.height}`}} aria-label="Game area. Left/right or A/D to move, up or W to jump, down or S to drop, Space to fire.">
       <div className={styles.laneLines}/>
       {view.deadline&&<div className={styles.deadlineMarker} style={{left:`${view.deadline.x/10}%`}} aria-label="Manager deadline attack: move away"><span>{view.time<view.deadline.releaseAt?'! MOVE !':'↓ DEADLINE'}</span>{view.time>=view.deadline.releaseAt&&<b style={{top:`${view.deadline.y/6.2}%`}}>!</b>}</div>}<div className={styles.floor}/>
       {view.warning&&<div className={styles.warning} style={{left:`${view.warning.lane*25}%`}}>↓ incoming task</div>}
       {view.tasks.map(t=><div key={t.id} aria-label={`${t.title}, ${t.total-t.left} of ${t.total} subtasks done${(t.settled||t.overdue) ? ", overdue" : ""}`} className={`${styles.task} ${(t.settled||t.overdue)?styles.overdue:''} ${t.flash>0?styles.hit:''} ${(t.collapseAt??0)>view.time?styles.unstable:''}`} style={{...styleAt(t.x,t.y),width:`${t.w/10}%`,height:`${t.h/6.2}%`}}><div className={styles.taskTitle}><i>{t.left===0?'·':''}</i><span>{t.title}</span></div><div className={styles.taskMeta}><span>{(t.settled||t.overdue)?'Overdue':t.left===0?'One more hit!':'In progress'}</span><span>{t.total-t.left}/{t.total}</span></div><div className={styles.subtasks}>{Array.from({length:t.total},(_,i)=><b key={i} className={i<t.total-t.left?styles.checked:''}>{i<t.total-t.left?'✓':'·'}</b>)}</div></div>)}
       {manager&&<div className={styles.manager} style={{...styleAt(manager.x,manager.y),opacity:manager.leaving?Math.max(0,1-manager.leaving/.8):1}} aria-label={`Recurring manager, ${manager.hp} hits remaining`}><span className={styles.managerSprite} style={{backgroundPosition:`${managerFrame%4/3*100}% ${Math.floor(managerFrame/4)*100}%`}}/><span className={styles.managerCaption}>{manager.leaving?(manager.hp===0?'Meeting cancelled! +100':'Back in a minute…'):manager.nextThrow-view.time<.9?'One quick task…':'Recurring manager'}<small>{'●'.repeat(manager.hp)}{'○'.repeat(manager.maxHp-manager.hp)}</small></span></div>}
       {view.shots.map(s=><span key={s.id} className={styles.shot} style={styleAt(s.x,s.y)}>{'{ }'}</span>)}
       {view.rewards.map(r=>{const t=Math.min(1,r.age/.45),x=r.fromX+(r.x-r.fromX)*t,y=r.fromY+(r.y-r.fromY)*t;return <span key={r.id} className={styles.coin} style={styleAt(x,y)} aria-label="Gold coin, collect for 25 points"/>;})}
       {view.particles.map((p,i)=><i key={i} className={styles.particle} style={{...styleAt(p.x,p.y),background:p.color,opacity:Math.min(1,p.life*2)}}/>)}
       <div className={styles.player} style={{...styleAt(view.player.x,view.player.y),transform:`translate(-50%,-95.8%) scaleX(${view.player.facing})`,backgroundPosition:`${frame%8/7*100}% ${Math.floor(frame/8)/2*100}%`}} aria-label="Lucky coding with a laptop"/>
    {mode==='playing'&&tip>=0&&<aside className={styles.tutorialDialogue} aria-label="Play tip"><div className={styles.tutorialPortrait} aria-hidden="true"/><div className={styles.tutorialWords}><span>LUCKY <small>· {tip+1} / {tips.length}</small></span><p key={tip}><span className={styles.desktopTip}>{renderTip(tips[tip])}</span><span className={styles.mobileTip}>{renderTip(mobileTips[tip])}</span></p><button onClick={()=>{acknowledge();}}>Got it ▸</button></div><button className={styles.tutorialClose} aria-label="Dismiss play tip" onClick={()=>{acknowledge();}}>×</button></aside>}
       {mode==='dead'&&view.deathTime<.8&&<div className={styles.impactWord}>STACK OVERFLOW.</div>}
     </div>
    </div>

  </div>
  <div className={styles.touchControls} aria-label="Touch controls">
   <div ref={sliderRef} className={styles.moveSlider} role="slider" tabIndex={-1} aria-label="Slide to move left or right" aria-valuemin={-1} aria-valuemax={1} aria-valuenow={Number(moveVal.toFixed(2))} onContextMenu={e=>e.preventDefault()} onPointerDown={e=>{e.preventDefault();try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}slidePointer.current=e.pointerId;applySlide(e.clientX);}} onPointerMove={e=>{if(slidePointer.current===e.pointerId)applySlide(e.clientX);}} onPointerUp={e=>{if(slidePointer.current===e.pointerId)resetSlider();}} onPointerCancel={resetSlider} onLostPointerCapture={resetSlider}>
    <span className={styles.sliderHint} data-side="l" aria-hidden="true">◀</span>
    <span className={styles.sliderHint} data-side="r" aria-hidden="true">▶</span>
    <span className={`${styles.sliderThumb} ${moveVal!==0?styles.sliderThumbActive:''}`} style={{left:`${50+moveVal*38}%`}} aria-hidden="true"><i/><i/></span>
   </div>
   <div className={styles.actionCluster}>{touchControl('fire','Send code','{ }',styles.fireBtn)}{touchControl('jump','Jump','▲',styles.jumpBtn)}</div>
  </div>

  {(mode==='paused'||(mode==='dead'&&view.deathTime>.85))&&<div className={styles.scrim}><section className={`${styles.gamePanel} ${mode==='dead'?styles.defeatPanel:''}`} aria-label={mode==='dead'?'Run complete':'Game paused'}>
   <div className={styles.panelScene} aria-hidden="true"><div className={styles.sceneFloor}/>{mode==='dead'&&<><span className={styles.fallenTask}>TASK</span><span className={styles.ghost}>✧</span></>}<div className={`${styles.sceneBoy} ${mode==='dead'?styles.sceneDefeat:styles.sceneIdle}`}/><span className={styles.sceneCaption}>{mode==='dead'?'CONNECTION LOST…':'TAKING FIVE…'}</span></div>
   <div className={styles.panelContent}><span className={styles.panelEyebrow}>{mode==='dead'?'RUN ENDED':'TAKE A BREATHER'}</span><h2>{mode==='dead'?'Too much on your plate.':'Paused.'}</h2><p>{mode==='dead'?(view.deathReason==='pressure'?'Backlog pressure reached 100%. Clear every column to keep it down.':'The backlog won this round. Ready for a rematch?'):'Even the best builds need a break.'}</p>
   <dl className={styles.runStats}><div><dt>SCORE</dt><dd>{view.score}</dd></div><div><dt>SHIPPED</dt><dd>{view.completed}</dd></div><div><dt>BEST</dt><dd>{Math.max(best,view.score)}</dd></div></dl>
   {mode==='paused'&&<div className={styles.menuSettings}>
    <div className={styles.iconControls}>
     <button type="button" className={`${styles.iconBtn} ${sound?styles.iconOn:''}`} aria-pressed={sound} onClick={()=>toggle('sound')} aria-label={sound?'Sound on':'Sound off'}>{sound?<Volume2 size={19} aria-hidden="true"/>:<VolumeX size={19} aria-hidden="true"/>}<small>Sound</small></button>
     <button type="button" className={`${styles.iconBtn} ${music?styles.iconOn:''}`} aria-pressed={music} onClick={()=>toggle('music')} aria-label={music?'Music on':'Music off'}>{music?<Music size={19} aria-hidden="true"/>:<Music2 size={19} aria-hidden="true"/>}<small>BGM</small></button>
     <button type="button" className={styles.iconBtn} onClick={()=>{nextTutorial.current=1;learned.current={move:false,fire:false,jump:false};tutorial.current=0;setTip(0);setStatus('playing');}} aria-label="Replay guide"><RotateCcw size={18} aria-hidden="true"/><small>Guide</small></button>
     <button type="button" className={`${styles.iconBtn} ${showHelp?styles.iconOn:''}`} aria-expanded={showHelp} onClick={()=>setShowHelp(v=>!v)} aria-label="Controls help"><HelpCircle size={19} aria-hidden="true"/><small>Keys</small></button>
    </div>
    {showHelp&&<div className={styles.controlsHelp}>
     <div className={styles.helpDesktop}><span>{renderTip('← →')} / {renderTip('A D')} move</span><span>{renderTip('↑')} / {renderTip('W')} jump</span><span>{renderTip('↓')} / {renderTip('S')} drop</span><span>{renderTip('Space')} code</span></div>
     <div className={styles.helpMobile}><span>drag slider — move</span><span>{renderTip('▲')} jump</span><span>hold {renderTip('{ }')} code</span></div>
    </div>}
   </div>}
   <div className={styles.panelActions}><button onClick={onExit}>Back to portfolio</button><button onClick={()=>{if(mode==='dead')begin();else setStatus('playing');focusArena();}}>{mode==='dead'?'Try again ↻':'Resume →'}</button></div><small className={styles.panelFootnote}>{mode==='dead'?'A fresh start. A smaller backlog.':'Your world is waiting.'}</small></div>
  </section></div>}

 </div>,document.body);
}
