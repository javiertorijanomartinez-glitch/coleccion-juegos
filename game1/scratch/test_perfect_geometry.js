// Test full 68-cell board geometry
const TRACK_CELLS = {};
const GOAL_CORRIDOR_CELLS = { yellow: [], green: [], red: [], blue: [] };

const armW = 240; // 180 to 420
const laneW = 80; // 240 / 3
const armL = 205; // 15 to 220
const stepL = armL / 8; // 25.625

// 1. NORTH ARM (Amarillo / Azul)
// Left lane (x: 180..260, y: 15..220) -> Casillas 1 to 8
for (let i = 0; i < 8; i++) {
  const num = 1 + i;
  const x = 180;
  const y = 15 + i * stepL;
  TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
}

// Center lane outermost cell -> Casilla 68 (Yellow Entrada)
TRACK_CELLS[68] = {
  x: 180 + laneW,
  y: 15,
  w: laneW,
  h: stepL,
  cx: 180 + 1.5 * laneW,
  cy: 15 + stepL / 2
};

// Center lane steps 1..7 -> Yellow goal corridor
for (let i = 0; i < 7; i++) {
  const x = 180 + laneW;
  const y = 15 + (i + 1) * stepL;
  GOAL_CORRIDOR_CELLS.yellow.push({ x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 });
}

// Right lane (x: 340..420, y: 220..15) -> Casillas 60 to 67
for (let i = 0; i < 8; i++) {
  const num = 60 + i;
  const x = 180 + 2 * laneW;
  const y = 220 - (i + 1) * stepL;
  TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
}

// 2. WEST ARM (Amarillo / Verde)
// Top lane (x: 220..15, y: 180..260) -> Casillas 9 to 16
for (let i = 0; i < 8; i++) {
  const num = 9 + i;
  const x = 220 - (i + 1) * stepL;
  const y = 180;
  TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
}

// Center lane outermost cell -> Casilla 17 (Green Entrada)
TRACK_CELLS[17] = {
  x: 15,
  y: 180 + laneW,
  w: stepL,
  h: laneW,
  cx: 15 + stepL / 2,
  cy: 180 + 1.5 * laneW
};

// Center lane steps 1..7 -> Green goal corridor
for (let i = 0; i < 7; i++) {
  const x = 15 + (i + 1) * stepL;
  const y = 180 + laneW;
  GOAL_CORRIDOR_CELLS.green.push({ x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 });
}

// Bottom lane (x: 15..220, y: 340..420) -> Casillas 18 to 25
for (let i = 0; i < 8; i++) {
  const num = 18 + i;
  const x = 15 + i * stepL;
  const y = 180 + 2 * laneW;
  TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
}

// 3. SOUTH ARM (Verde / Rojo)
// Left lane (x: 180..260, y: 380..585) -> Casillas 26 to 33
for (let i = 0; i < 8; i++) {
  const num = 26 + i;
  const x = 180;
  const y = 380 + i * stepL;
  TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
}

// Center lane outermost cell -> Casilla 34 (Red Entrada)
TRACK_CELLS[34] = {
  x: 180 + laneW,
  y: 585 - stepL,
  w: laneW,
  h: stepL,
  cx: 180 + 1.5 * laneW,
  cy: 585 - stepL / 2
};

// Center lane steps 1..7 -> Red goal corridor
for (let i = 0; i < 7; i++) {
  const x = 180 + laneW;
  const y = 585 - (i + 2) * stepL;
  GOAL_CORRIDOR_CELLS.red.push({ x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 });
}

// Right lane (x: 340..420, y: 585..380) -> Casillas 35 to 42
for (let i = 0; i < 8; i++) {
  const num = 35 + i;
  const x = 180 + 2 * laneW;
  const y = 585 - (i + 1) * stepL;
  TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
}

// 4. EAST ARM (Rojo / Azul)
// Bottom lane (x: 380..585, y: 340..420) -> Casillas 43 to 50
for (let i = 0; i < 8; i++) {
  const num = 43 + i;
  const x = 380 + i * stepL;
  const y = 180 + 2 * laneW;
  TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
}

// Center lane outermost cell -> Casilla 51 (Blue Entrada)
TRACK_CELLS[51] = {
  x: 585 - stepL,
  y: 180 + laneW,
  w: stepL,
  h: laneW,
  cx: 585 - stepL / 2,
  cy: 180 + 1.5 * laneW
};

// Center lane steps 1..7 -> Blue goal corridor
for (let i = 0; i < 7; i++) {
  const x = 585 - (i + 2) * stepL;
  const y = 180 + laneW;
  GOAL_CORRIDOR_CELLS.blue.push({ x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 });
}

// Top lane (x: 585..380, y: 180..260) -> Casillas 52 to 59
for (let i = 0; i < 8; i++) {
  const num = 52 + i;
  const x = 585 - (i + 1) * stepL;
  const y = 180;
  TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
}

// Validation
console.log('Total track cells:', Object.keys(TRACK_CELLS).length);
let missing = [];
for (let i = 1; i <= 68; i++) {
  if (!TRACK_CELLS[i]) missing.push(i);
}
console.log('Missing cells:', missing);

// Check overlaps
const entries = Object.entries(TRACK_CELLS);
let overlaps = 0;
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const [numA, a] = entries[i];
    const [numB, b] = entries[j];
    const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
    if (dist < 5) {
      console.log(`Overlap ${numA} and ${numB}: dist=${dist}`);
      overlaps++;
    }
  }
}
console.log('Overlaps:', overlaps);

console.log('\nSalidas:');
[5, 22, 39, 56].forEach(s => {
  const c = TRACK_CELLS[s];
  console.log(`Salida ${s}: at (${c.cx.toFixed(1)}, ${c.cy.toFixed(1)})`);
});
