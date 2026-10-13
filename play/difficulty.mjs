// Gradual campaign pacing; bots react only to flames already visible on the floor.
const movement=[1.35,1.22,1.10,.98,.87,.77,.68,.60,.53,.50];
const hesitation=[.60,.55,.50,.45,.40,.35,.30,.25,.20,.20];
const flameAvoidance=[.05,.08,.12,.16,.20,.24,.28,.32,.36,.36];
export function botDifficulty(level){const i=Math.max(0,Math.min(9,Math.floor(level)-1));return {moveSeconds:movement[i],thinkSeconds:hesitation[i],flameAvoidance:flameAvoidance[i],startDelay:i===0?2:Math.max(.5,1.5-i*.12)};}
