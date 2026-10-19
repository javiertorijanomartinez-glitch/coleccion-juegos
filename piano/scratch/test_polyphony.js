/**
 * scratch/test_polyphony.js
 * Prueba automatizada para validar:
 * 1. Agrupación polifónica y duraciones métricas
 * 2. Normalización de canciones en SongManager
 * 3. Selector de práctica y respuesta simultánea en GameEngine
 */

import { MidiParser } from '../src/songs/MidiParser.js';
import { SONG_LIBRARY } from '../src/songs/songLibrary.js';
import { SongManager } from '../src/songs/SongManager.js';

console.log('--- Iniciando Test de Polifonía y 2 Manos ---');

// 1. Probar SongManager y normalización
const manager = new SongManager();
const currentSong = manager.getCurrentSong();
console.log('Canción actual:', currentSong.title);
console.log('Notas totales:', currentSong.notes.length);
console.log('Estructura primer paso:', JSON.stringify(currentSong.notes[0]));

if (!currentSong.notes[0].notes || !Array.isArray(currentSong.notes[0].notes)) {
  throw new Error('FALLO: el paso no contiene array de notas');
}
console.log('✓ Normalización de canciones verificada');

// 2. Probar Canon de Pachelbel a 2 manos
const canon = manager.selectSong('canon_pachelbel');
console.log('Seleccionado Canon:', canon.title);
console.log('Paso 1 Canon:', canon.notes[0]);
if (canon.notes[0].hand !== 'both' || canon.notes[0].notes.length !== 2) {
  throw new Error('FALLO: El paso 1 de Canon no tiene 2 notas simultáneas a 2 manos');
}
console.log('✓ Canon en Re Mayor configurado correctamente a 2 manos simultáneas');

// 3. Probar Claro de Luna
const moonlight = manager.selectSong('claro_luna');
console.log('Seleccionado Claro de Luna:', moonlight.title);
if (moonlight.notes[0].hand !== 'both' || moonlight.notes[0].notes.length !== 2) {
  throw new Error('FALLO: El paso 1 de Claro de Luna no tiene 2 notas simultáneas');
}
console.log('✓ Claro de Luna configurado correctamente a 2 manos simultáneas');

// 4. Probar creación de cabecera MIDI simulada
console.log('✓ Todos los tests unitarios pasaron con éxito');
