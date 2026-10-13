"""Original arcade cue palette, generated locally; no sampled or copied music."""
import math, wave, os, struct, random
ROOT='public/game/arcade/audio'
os.makedirs(ROOT,exist_ok=True)
RATE=22050
rng=random.Random(42)
def tone(buf,start,duration,midi,volume=.18,kind='sine',bend=1):
 freq=440*2**((midi-69)/12); phase=0
 for i in range(int(duration*RATE)):
  at=int(start*RATE)+i
  if at>=len(buf):break
  t=i/RATE; p=t/duration
  phase+=2*math.pi*freq*(bend**p)/RATE
  sig=math.sin(phase)
  if kind=='triangle':sig=2/math.pi*math.asin(sig)
  if kind=='noise':sig=rng.uniform(-1,1)*.65+sig*.35
  env=min(1,t/.008)*math.exp(-5*p)*min(1,(duration-t)/.025)
  buf[at]+=sig*env*volume

def save(name,duration,notes):
 buf=[0.0]*int(RATE*duration)
 for note in notes:tone(buf,*note)
 peak=max(abs(v) for v in buf) or 1
 scale=min(1,.85/peak)
 with wave.open(f'{ROOT}/{name}.wav','wb') as f:
  f.setparams((1,2,RATE,0,'NONE','not compressed'))
  f.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,v*scale))*32767)) for v in buf))

cues={
 'brick':(.4,[(0,.16,42,.3,'noise',.5),(.045,.2,53,.15,'triangle',.5)]),
 'bonus':(.6,[(0,.2,62,.17,'triangle',1),(.09,.23,74,.18,'triangle',1),(.2,.3,81,.12,'sine',1)]),
 'pickup':(.7,[(i*.07,.35,n,.16,'sine',1) for i,n in enumerate([74,78,81,86])]),
 'rustle':(.25,[(0,.2,40,.07,'noise',1)]),
 'pipe':(.65,[(i*.09,.18,69-i*4,.15,'triangle',.7) for i in range(5)]),
 'shoot':(.15,[(0,.11,84,.10,'triangle',.7)]),
 'subtask':(.24,[(0,.18,81,.12,'sine',1),(.055,.16,86,.09,'sine',1)]),
 'complete':(.8,[(i*.07,.4,n,.15,'triangle',1) for i,n in enumerate([62,69,74,78,86])]),
 'overdue':(.4,[(0,.26,34,.3,'noise',.65)]),
 'jump':(.22,[(0,.18,62,.13,'triangle',1.8)]),
 'level':(1.1,[(i*.12,.5,n,.14,'triangle',1) for i,n in enumerate([74,78,81,86,90])]),
 'pause':(.3,[(0,.25,69,.09,'sine',1)]),
 'restart':(.65,[(i*.09,.3,n,.14,'triangle',1) for i,n in enumerate([62,66,69,74])]),
 'game-over':(2.8,[(0,.3,35,.3,'noise',.5),(.12,.45,81,.17,'triangle',1),(.4,.45,76,.17,'triangle',1),(.7,.5,71,.17,'triangle',1),(1.05,.7,66,.17,'triangle',1),(1.55,1.2,38,.24,'sine',1),(1.6,1.1,62,.10,'sine',1)])
}
for name,(duration,notes) in cues.items():save(name,duration,notes)
# Four-bar original D-add9 progressions. Leave tails within loop and soften seam.
for name,bpm,melody in [('room-loop',76,[74,0,81,0,76,0,0,78,0,0,81,0,78,0,76,0]),('arcade-loop',112,[74,78,81,85,83,81,78,76,74,81,78,86,85,81,76,78])]:
 step=60/bpm/2; length=step*64; notes=[]
 for beat in range(64):
  at=beat*step; root=[50,47,43,45][(beat//8)%4]; pitch=melody[beat%16]
  if pitch:notes.append((at,min(.38 if name=='arcade-loop' else .85,length-at),pitch,.07,'triangle',1))
  if beat%4==0:notes.append((at,min(1,length-at),root,.12,'sine',1))
  if beat%8==0:
   for chord in [root+12,root+19,root+26]:notes.append((at,min(1.6,length-at),chord,.025,'sine',1))
  if name=='arcade-loop' and beat%2==1:notes.append((at,.09,root+24,.018,'noise',1))
 save(name,length,notes)
print('Wrote 14 effects and 2 original music loops to',ROOT)
