import { clamp, WORLD } from "./world";

/**
 * 39 separately generated drawings in an 8 x 5 lossless atlas.
 * Each cell is 192 x 272 with the feet aligned to y=262.
 */
export const SPRITES = {
  columns: 8,
  rows: 5,
  count: 39,
  width: 192,
  height: 272,
  baseline: 262,
} as const;

export const FRAMES = {
  idle: [0, 1, 2, 3, 4],
  walk: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  takeoff: [17, 18],
  rise: [19, 20, 21, 22],
  apex: [23, 24],
  fall: [25, 26, 27, 28],
  land: [29, 30, 31, 32],
  turn: [33, 34, 35],
  interact: [36, 37, 38],
} as const;

export type Animation =
  "idle" | "walk" | "takeoff" | "rise" | "apex" | "fall" | "land" | "turn";

export interface Character {
  x: number;
  z: number;
  vx: number;
  vy: number;
  facing: -1 | 1;
  grounded: boolean;
  animation: Animation;
  animationTime: number;
  stride: number;
  jumpBuffer: number;
  jumpHeld: boolean;
  landTime: number;
  turnTime: number;
  jumpAge: number;
}

// One full two-step cycle covers 300 world pixels: ~0.97s at cruising speed.
export const ROOM_PIPE={left:1570,right:1690,height:123};

export const WALK_FRAME_DISTANCE = 25;

const ACCEL_GROUND = 2600;
const DECEL_GROUND = 3000;
const ACCEL_AIR = 1850;
const AIR_DRAG = 420;
const LAND_DURATION = 0.14;
const JUMP_BUFFER = 0.14;
const TURN_DURATION = 0.085;

export function newCharacter(x = 1120): Character {
  return {
    x,
    z: 0,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: true,
    animation: "idle",
    animationTime: 0,
    stride: 0,
    jumpBuffer: 0,
    jumpHeld: false,
    landTime: 0,
    turnTime: 0,
    jumpAge: 0,
  };
}

export function requestJump(character: Character): void {
  character.jumpBuffer = JUMP_BUFFER;
  character.jumpHeld = true;
}

export function releaseJump(character: Character): void {
  character.jumpHeld = false;
}

function approach(value: number, target: number, amount: number): number {
  return value < target
    ? Math.min(value + amount, target)
    : Math.max(value - amount, target);
}

function setAnimation(m: Character, next: Animation, dt: number) {
  if (m.animation !== next) {
    m.animation = next;
    m.animationTime = 0;
  } else m.animationTime += dt;
}

/**
 * Fixed-step physics. Keep drawing independent from physics so frame drops
 * don't create unpredictable changes to jumping and frame progression.
 * move: -1..1, or fractional speed for an automatically selected destination.
 */
export function stepCharacter(
  m: Character,
  move: number,
  dt: number,
  reduced = false,
  solidPipe = false,
): void {
  dt = clamp(dt, 0, 1 / 60);
  if (dt === 0) return;
  if (reduced) {
    m.vx = 0;
    m.vy = 0;
    m.z = 0;
    m.grounded = true;
    m.jumpBuffer = 0;
    m.landTime = 0;
    setAnimation(m, "idle", dt);
    return;
  }

  const intent = clamp(move, -1, 1);
  const desired = intent * WORLD.speed;
  const acceleration = m.grounded
    ? Math.abs(desired) > Math.abs(m.vx)
      ? ACCEL_GROUND
      : DECEL_GROUND
    : intent !== 0
      ? ACCEL_AIR
      : AIR_DRAG;
  if (
    intent !== 0 &&
    Math.sign(intent) !== Math.sign(m.vx) &&
    Math.abs(m.vx) > WORLD.speed * 0.28 &&
    m.grounded
  ) {
    m.turnTime = TURN_DURATION;
  }
  m.vx = approach(m.vx, desired, acceleration * dt);
  if (intent !== 0) m.facing = intent < 0 ? -1 : 1;
  const previousX = m.x;
  const previousZ = m.z;
  m.x = clamp(m.x + m.vx * dt, WORLD.minX, WORLD.maxX);
  if (m.x === previousX && (m.x === WORLD.minX || m.x === WORLD.maxX)) m.vx = 0;
  if (m.grounded) m.stride += Math.abs(m.x - previousX);

  m.jumpBuffer = Math.max(0, m.jumpBuffer - dt);
  m.landTime = Math.max(0, m.landTime - dt);
  m.turnTime = Math.max(0, m.turnTime - dt);

  let jumped = false;
  let landed = false;
  if (m.grounded && m.jumpBuffer > 0) {
    m.vy = WORLD.jumpSpeed;
    m.grounded = false;
    m.landTime = 0;
    m.jumpBuffer = 0;
    m.jumpAge = 0;
    jumped = true;
  }

  if (!m.grounded) {
    m.jumpAge += dt;
    // Early key release makes a shorter hop; holding the jump key gives full height.
    const gravity = WORLD.gravity * (m.vy > 0 && !m.jumpHeld ? 1.65 : 1);
    m.z += m.vy * dt - 0.5 * gravity * dt * dt;
    m.vy -= gravity * dt;
    if (m.z <= 0) {
      m.z = 0;
      m.vy = 0;
      m.grounded = true;
      m.landTime = LAND_DURATION;
      // Recover through a planted/pass pose rather than an arbitrary wide stride.
      m.stride = 2 * WALK_FRAME_DISTANCE;
      landed = true;
    }
  }

  if(solidPipe){
    const over=m.x+24>ROOM_PIPE.left&&m.x-24<ROOM_PIPE.right;
    if(over&&previousZ>=ROOM_PIPE.height-1&&m.z<=ROOM_PIPE.height&&m.vy<=0){m.z=ROOM_PIPE.height;m.vy=0;m.grounded=true;}
    else if(over&&m.z<ROOM_PIPE.height&&previousZ<ROOM_PIPE.height-1){m.x=previousX<1630?ROOM_PIPE.left-24:ROOM_PIPE.right+24;m.vx=0;}
    if(m.grounded&&m.z>0&&!over){m.grounded=false;m.vy=0;}
  }

  if (jumped) setAnimation(m, "takeoff", dt);
  else if (landed) setAnimation(m, "land", dt);
  else if (!m.grounded) {
    if (m.jumpAge < 0.034) setAnimation(m, "takeoff", dt);
    else if (m.vy > 105) setAnimation(m, "rise", dt);
    else if (m.vy > -135) setAnimation(m, "apex", dt);
    else setAnimation(m, "fall", dt);
  } else if (m.landTime > 0) setAnimation(m, "land", dt);
  else if (m.turnTime > 0) setAnimation(m, "turn", dt);
  else if (Math.abs(m.vx) >= 18) setAnimation(m, "walk", dt);
  else setAnimation(m, "idle", dt);
}

export function spriteFrame(m: Character, reduced = false): number {
  if (reduced) return 0;
  switch (m.animation) {
    case "idle": { // Breathing can loop; a blink should be brief, not shut eyes for a second.
      const t = m.animationTime % 4.6;
      if (t > 4.25)
        return FRAMES.idle[Math.min(4, 2 + Math.floor((t - 4.25) / 0.09))];
      return FRAMES.idle[Math.floor(t / 0.85) % 2];
    }
    case "walk":
      // Distance-driven cadence slows naturally while accelerating and braking.
      return FRAMES.walk[
        Math.floor(m.stride / WALK_FRAME_DISTANCE) % FRAMES.walk.length
      ];
    case "takeoff":
      return FRAMES.takeoff[Math.min(1, Math.floor(m.jumpAge / 0.017))];
    case "rise":
      return FRAMES.rise[
        Math.floor(
          clamp((WORLD.jumpSpeed - m.vy) / (WORLD.jumpSpeed - 105), 0, 0.999) *
            FRAMES.rise.length,
        )
      ];
    case "apex":
      return FRAMES.apex[m.vy > 0 ? 0 : 1];
    case "fall":
      return FRAMES.fall[
        Math.floor(clamp((-m.vy - 135) / 555, 0, 0.999) * FRAMES.fall.length)
      ];
    case "land":
      return FRAMES.land[
        Math.min(3, Math.floor(m.animationTime / (LAND_DURATION / 4)))
      ];
    case "turn":
      return FRAMES.turn[
        Math.min(2, Math.floor(m.animationTime / (TURN_DURATION / 3)))
      ];
  }
}

export function atlasPosition(frame: number): string {
  const column = frame % SPRITES.columns;
  const row = Math.floor(frame / SPRITES.columns);
  return `${(column / (SPRITES.columns - 1)) * 100}% ${(row / (SPRITES.rows - 1)) * 100}%`;
}

export function autoSpeed(m: Character, destination: number): number {
  const distance = destination - m.x;
  if (Math.abs(distance) < 1.5 && Math.abs(m.vx) < 12) return 0;
  const stoppingSpeed = Math.sqrt(2 * DECEL_GROUND * Math.abs(distance));
  return (
    (Math.sign(distance) * Math.min(WORLD.speed, stoppingSpeed)) / WORLD.speed
  );
}
