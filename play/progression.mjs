export function nextEncounter(stages,definition){const id=definition.id??definition.level;const current=stages.findIndex(s=>(s.id??s.level)===id);if(current<0)throw Error('Unknown campaign encounter');return stages[current+1]||null;}
export function savedEncounter(stages,save){return stages.find(s=>save?.miniBoss?s.id==='armourdrillo':!s.miniBoss&&s.level===save?.level);}
