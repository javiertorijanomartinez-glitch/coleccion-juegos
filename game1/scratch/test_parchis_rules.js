import { TRACK_CELLS, SAFE_SQUARES, GOAL_CORRIDOR_CELLS } from '../src/games/parchis/ParchisRules.js';

console.log('Total track cells:', Object.keys(TRACK_CELLS).length);
const missing = [];
for (let i = 1; i <= 68; i++) {
  if (!TRACK_CELLS[i]) missing.push(i);
}
console.log('Missing cells:', missing);

console.log('\nSalidas and Entradas:');
console.log('Amarillo: Salida 5 at', TRACK_CELLS[5], 'MetaEntrada 68 at', TRACK_CELLS[68]);
console.log('Verde: Salida 22 at', TRACK_CELLS[22], 'MetaEntrada 17 at', TRACK_CELLS[17]);
console.log('Rojo: Salida 39 at', TRACK_CELLS[39], 'MetaEntrada 34 at', TRACK_CELLS[34]);
console.log('Azul: Salida 56 at', TRACK_CELLS[56], 'MetaEntrada 51 at', TRACK_CELLS[51]);
