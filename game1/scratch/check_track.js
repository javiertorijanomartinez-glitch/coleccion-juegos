import { TRACK_CELLS } from '../src/games/parchis/ParchisRules.js';

// Check all 68 cells
for (let i = 1; i <= 68; i++) {
  const c = TRACK_CELLS[i];
  if (!c) {
    console.log(`Cell ${i} is MISSING!`);
  }
}

// Check duplicates or overlaps
const cells = Object.entries(TRACK_CELLS);
let overlaps = 0;
for (let i = 0; i < cells.length; i++) {
  for (let j = i + 1; j < cells.length; j++) {
    const [numA, a] = cells[i];
    const [numB, b] = cells[j];
    const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
    if (dist < 5) {
      console.log(`OVERLAP between ${numA} and ${numB}! dist=${dist}`);
      overlaps++;
    }
  }
}
if (overlaps === 0) {
  console.log('No overlaps found! All 68 cells have unique positions.');
}

// Check positions of all 4 Salidas relative to their houses
console.log('\nSalida details:');
[5, 22, 39, 56].forEach(s => {
  console.log(`Salida ${s}: x=${TRACK_CELLS[s].x.toFixed(1)}, y=${TRACK_CELLS[s].y.toFixed(1)}, w=${TRACK_CELLS[s].w.toFixed(1)}, h=${TRACK_CELLS[s].h.toFixed(1)}`);
});
