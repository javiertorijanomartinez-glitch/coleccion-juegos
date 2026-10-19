/**
 * songLibrary.js
 * Colección de canciones para aprender y tocar en el piano.
 * Incluye canciones infantiles, clásicas, bandas sonoras de cine y videojuegos.
 */

export const SONG_LIBRARY = [
  // --- INFANTILES Y TRADICIONALES ---
  {
    id: 'estrellita',
    title: 'Estrellita dónde estás',
    category: 'Infantil',
    bpm: 96,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 2 },
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 2 },
      { note: 'C4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 }
    ]
  },
  {
    id: 'cumpleanos',
    title: 'Cumpleaños Feliz',
    category: 'Infantil',
    bpm: 110,
    timeSignature: 3,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'C4', duration: 0.75 }, { note: 'C4', duration: 0.25 },
      { note: 'D4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'E4', duration: 2 },
      { note: 'C4', duration: 0.75 }, { note: 'C4', duration: 0.25 },
      { note: 'D4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'F4', duration: 2 },
      { note: 'C4', duration: 0.75 }, { note: 'C4', duration: 0.25 },
      { note: 'C5', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 2 },
      { note: 'A#4', duration: 0.75 }, { note: 'A#4', duration: 0.25 },
      { note: 'A4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'F4', duration: 2 }
    ]
  },
  {
    id: 'frere_jacques',
    title: 'Campanitas del Lugar / Martinillo',
    category: 'Infantil',
    bpm: 108,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'C4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 }, { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'E4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'G4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 0.5 }, { note: 'F4', duration: 0.5 },
      { note: 'E4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'G4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 0.5 }, { note: 'F4', duration: 0.5 },
      { note: 'E4', duration: 1 }, { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'C4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'C4', duration: 2 }
    ]
  },
  {
    id: 'jingle_bells',
    title: 'Jingle Bells (Dulce Navidad)',
    category: 'Navidad',
    bpm: 124,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 2 },
      { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 2 },
      { note: 'E4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1.5 }, { note: 'D4', duration: 0.5 },
      { note: 'E4', duration: 3 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'E4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
      { note: 'E4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D4', duration: 2 }, { note: 'G4', duration: 2 }
    ]
  },
  {
    id: 'la_cucaracha',
    title: 'La Cucaracha',
    category: 'Tradicional',
    bpm: 120,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'C4', duration: 0.5 }, { note: 'C4', duration: 0.5 }, { note: 'C4', duration: 0.5 },
      { note: 'F4', duration: 1.5 }, { note: 'A4', duration: 1 },
      { note: 'C4', duration: 0.5 }, { note: 'C4', duration: 0.5 }, { note: 'C4', duration: 0.5 },
      { note: 'F4', duration: 1.5 }, { note: 'A4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'F4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
      { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'D4', duration: 0.5 },
      { note: 'C4', duration: 2 }
    ]
  },
  {
    id: 'cielito_lindo',
    title: 'Cielito Lindo',
    category: 'Tradicional',
    bpm: 112,
    timeSignature: 3,
    timeSignatureDenom: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'C5', duration: 1.5 }, { note: 'C5', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'C5', duration: 1.5 }, { note: 'C5', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'D5', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 2 }, { note: 'G4', duration: 2 }
    ]
  },

  // --- CLÁSICA Y 2 MANOS ---
  {
    id: 'canon_pachelbel',
    title: 'Canon en Re Mayor (Pachelbel) 🤚✋',
    category: 'Clásica (2 Manos)',
    bpm: 84,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Medio',
    notes: [
      // Compás 1: D3 (izq) y F#4 (der) suenan a la vez en tiempo 1
      { duration: 1, hand: 'both', note: 'F#4', notes: [{ note: 'D3', hand: 'left' }, { note: 'F#4', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'E4', notes: [{ note: 'E4', hand: 'right' }] },
      { duration: 1, hand: 'both', note: 'D4', notes: [{ note: 'A2', hand: 'left' }, { note: 'D4', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'C#4', notes: [{ note: 'C#4', hand: 'right' }] },

      // Compás 2
      { duration: 1, hand: 'both', note: 'B3', notes: [{ note: 'B2', hand: 'left' }, { note: 'B3', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'A3', notes: [{ note: 'A3', hand: 'right' }] },
      { duration: 1, hand: 'both', note: 'B3', notes: [{ note: 'F#2', hand: 'left' }, { note: 'B3', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'C#4', notes: [{ note: 'C#4', hand: 'right' }] },

      // Compás 3
      { duration: 1, hand: 'both', note: 'D4', notes: [{ note: 'G2', hand: 'left' }, { note: 'D4', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'C#4', notes: [{ note: 'C#4', hand: 'right' }] },
      { duration: 1, hand: 'both', note: 'B3', notes: [{ note: 'D2', hand: 'left' }, { note: 'B3', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'A3', notes: [{ note: 'A3', hand: 'right' }] },

      // Compás 4
      { duration: 1, hand: 'both', note: 'G3', notes: [{ note: 'G2', hand: 'left' }, { note: 'G3', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'F#3', notes: [{ note: 'F#3', hand: 'right' }] },
      { duration: 1, hand: 'both', note: 'E3', notes: [{ note: 'A2', hand: 'left' }, { note: 'E3', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'A3', notes: [{ note: 'A3', hand: 'right' }] },

      // Cierre cadencia
      { duration: 2, hand: 'both', note: 'D4', notes: [{ note: 'D3', hand: 'left' }, { note: 'D4', hand: 'right' }] }
    ]
  },
  {
    id: 'claro_luna',
    title: 'Claro de Luna (Moonlight Sonata - Beethoven) 🤚✋',
    category: 'Clásica (2 Manos)',
    bpm: 60,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Medio',
    notes: [
      // Compás 1: Bajo C#2 y primera nota del arpegio G#4 a la vez
      { duration: 0.67, hand: 'both', note: 'G#4', notes: [{ note: 'C#2', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.67, hand: 'both', note: 'G#4', notes: [{ note: 'C#3', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },

      // Compás 2
      { duration: 0.67, hand: 'both', note: 'G#4', notes: [{ note: 'B2', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'B4', notes: [{ note: 'B4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.67, hand: 'both', note: 'G#4', notes: [{ note: 'B1', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'B4', notes: [{ note: 'B4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },

      // Compás 3
      { duration: 0.67, hand: 'both', note: 'A4', notes: [{ note: 'A2', hand: 'left' }, { note: 'A4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.67, hand: 'both', note: 'A4', notes: [{ note: 'A1', hand: 'left' }, { note: 'A4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },

      // Compás 4
      { duration: 0.67, hand: 'both', note: 'G#4', notes: [{ note: 'G#2', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 0.67, hand: 'both', note: 'F#4', notes: [{ note: 'G#1', hand: 'left' }, { note: 'F#4', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] },
      { duration: 0.67, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },

      // Resolución
      { duration: 2, hand: 'both', note: 'E5', notes: [{ note: 'C#2', hand: 'left' }, { note: 'E5', hand: 'right' }] },
      { duration: 1, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 3, hand: 'right', note: 'C#5', notes: [{ note: 'C#5', hand: 'right' }] }
    ]
  },
  {
    id: 'himno_alegria',
    title: 'Himno a la Alegría (Beethoven)',
    category: 'Clásica',
    bpm: 104,
    timeSignature: 4,
    timeSignatureDenom: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'E4', duration: 1, hand: 'right' }, { note: 'E4', duration: 1, hand: 'right' },
      { note: 'F4', duration: 1, hand: 'right' }, { note: 'G4', duration: 1, hand: 'right' },
      { note: 'G4', duration: 1, hand: 'right' }, { note: 'F4', duration: 1, hand: 'right' },
      { note: 'E4', duration: 1, hand: 'right' }, { note: 'D4', duration: 1, hand: 'right' },
      { note: 'C4', duration: 1, hand: 'right' }, { note: 'C4', duration: 1, hand: 'right' },
      { note: 'D4', duration: 1, hand: 'right' }, { note: 'E4', duration: 1, hand: 'right' },
      { note: 'E4', duration: 1.5, hand: 'right' }, { note: 'D4', duration: 0.5, hand: 'right' },
      { note: 'D4', duration: 2, hand: 'right' },
      { note: 'E4', duration: 1, hand: 'right' }, { note: 'E4', duration: 1, hand: 'right' },
      { note: 'F4', duration: 1, hand: 'right' }, { note: 'G4', duration: 1, hand: 'right' },
      { note: 'G4', duration: 1, hand: 'right' }, { note: 'F4', duration: 1, hand: 'right' },
      { note: 'E4', duration: 1, hand: 'right' }, { note: 'D4', duration: 1, hand: 'right' },
      { note: 'C4', duration: 1, hand: 'right' }, { note: 'C4', duration: 1, hand: 'right' },
      { note: 'D4', duration: 1, hand: 'right' }, { note: 'E4', duration: 1, hand: 'right' },
      { note: 'D4', duration: 1.5, hand: 'right' }, { note: 'C4', duration: 0.5, hand: 'right' },
      { note: 'C4', duration: 2, hand: 'right' }
    ]
  },
  {
    id: 'para_elisa',
    title: 'Para Elisa (Für Elise - Beethoven) 🤚✋',
    category: 'Clásica (2 Manos)',
    bpm: 116,
    timeSignature: 3,
    timeSignatureDenom: 4,
    difficulty: 'Medio',
    notes: [
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'B4', notes: [{ note: 'B4', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D5', notes: [{ note: 'D5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'C5', notes: [{ note: 'C5', hand: 'right' }] },
      // Entrada del bajo en mano izquierda junto con la melodía
      { duration: 0.5, hand: 'both', note: 'C4', notes: [{ note: 'A2', hand: 'left' }, { note: 'C4', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'E4', notes: [{ note: 'E3', hand: 'left' }, { note: 'E4', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'A4', notes: [{ note: 'A3', hand: 'left' }, { note: 'A4', hand: 'right' }] },
      { duration: 1.0, hand: 'right', note: 'B4', notes: [{ note: 'B4', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'E4', notes: [{ note: 'E2', hand: 'left' }, { note: 'E4', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'G#4', notes: [{ note: 'E3', hand: 'left' }, { note: 'G#4', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'B4', notes: [{ note: 'G#3', hand: 'left' }, { note: 'B4', hand: 'right' }] },
      { duration: 1.0, hand: 'right', note: 'C5', notes: [{ note: 'C5', hand: 'right' }] },
      { duration: 0.5, hand: 'both', note: 'E4', notes: [{ note: 'A2', hand: 'left' }, { note: 'E4', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D#5', notes: [{ note: 'D#5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'E5', notes: [{ note: 'E5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'B4', notes: [{ note: 'B4', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'D5', notes: [{ note: 'D5', hand: 'right' }] },
      { duration: 0.5, hand: 'right', note: 'C5', notes: [{ note: 'C5', hand: 'right' }] },
      { duration: 2.0, hand: 'both', note: 'A4', notes: [{ note: 'A2', hand: 'left' }, { note: 'A4', hand: 'right' }] }
    ]
  },

  // --- VIDEOJUEGOS Y CULTURA POP ---
  {
    id: 'super_mario',
    title: 'Super Mario Bros (Tema Principal)',
    category: 'Videojuegos',
    bpm: 130,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'E5', duration: 0.5 }, { note: 'E5', duration: 0.5 },
      { note: 'E5', duration: 1 },
      { note: 'C5', duration: 0.5 }, { note: 'E5', duration: 1 },
      { note: 'G5', duration: 1.5 },
      { note: 'G4', duration: 1.5 },
      { note: 'C5', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'E4', duration: 1 }, { note: 'A4', duration: 0.75 },
      { note: 'B4', duration: 0.75 }, { note: 'A#4', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'G4', duration: 0.75 },
      { note: 'E5', duration: 0.75 }, { note: 'G5', duration: 0.75 },
      { note: 'A5', duration: 1 }, { note: 'F5', duration: 0.5 },
      { note: 'G5', duration: 1 }, { note: 'E5', duration: 1 },
      { note: 'C5', duration: 0.5 }, { note: 'D5', duration: 0.5 },
      { note: 'B4', duration: 1.5 }
    ]
  },
  {
    id: 'tetris',
    title: 'Tetris (Korobeiniki)',
    category: 'Videojuegos',
    bpm: 128,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'E5', duration: 1 }, { note: 'B4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'D5', duration: 1 }, { note: 'C5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'A4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'E5', duration: 1 }, { note: 'D5', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'B4', duration: 1.5 }, { note: 'C5', duration: 0.5 },
      { note: 'D5', duration: 1 }, { note: 'E5', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'A4', duration: 2 },
      { note: 'D5', duration: 1 }, { note: 'F5', duration: 0.5 }, { note: 'A5', duration: 1 },
      { note: 'G5', duration: 0.5 }, { note: 'F5', duration: 0.5 },
      { note: 'E5', duration: 1.5 }, { note: 'C5', duration: 0.5 },
      { note: 'E5', duration: 1 }, { note: 'D5', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'B4', duration: 1.5 }, { note: 'C5', duration: 0.5 },
      { note: 'D5', duration: 1 }, { note: 'E5', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'A4', duration: 2 }
    ]
  },
  {
    id: 'bella_ciao',
    title: 'Bella Ciao',
    category: 'Popular',
    bpm: 120,
    timeSignature: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'E4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'A4', duration: 1 },
      { note: 'E4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'A4', duration: 1 },
      { note: 'E4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
      { note: 'C5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'E5', duration: 2 },
      { note: 'E5', duration: 0.75 }, { note: 'D5', duration: 0.25 },
      { note: 'E5', duration: 0.75 }, { note: 'F5', duration: 0.25 },
      { note: 'E5', duration: 1 }, { note: 'D5', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'E5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 2 }
    ]
  },

  // --- CINE Y SERIES ---
  {
    id: 'star_wars',
    title: 'Star Wars (Marcha Imperial)',
    category: 'Cine',
    bpm: 104,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'D#4', duration: 0.75 }, { note: 'A#4', duration: 0.25 },
      { note: 'G4', duration: 1 }, { note: 'D#4', duration: 0.75 }, { note: 'A#4', duration: 0.25 },
      { note: 'G4', duration: 2 },
      { note: 'D5', duration: 1 }, { note: 'D5', duration: 1 }, { note: 'D5', duration: 1 },
      { note: 'D#5', duration: 0.75 }, { note: 'A#4', duration: 0.25 },
      { note: 'F#4', duration: 1 }, { note: 'D#4', duration: 0.75 }, { note: 'A#4', duration: 0.25 },
      { note: 'G4', duration: 2 },
      { note: 'G5', duration: 1 }, { note: 'G4', duration: 0.75 }, { note: 'G4', duration: 0.25 },
      { note: 'G5', duration: 1 }, { note: 'F#5', duration: 0.75 }, { note: 'F5', duration: 0.25 },
      { note: 'E5', duration: 0.5 }, { note: 'D#5', duration: 0.5 }, { note: 'E5', duration: 1 }
    ]
  },
  {
    id: 'piratas_caribe',
    title: 'Piratas del Caribe (He\'s a Pirate)',
    category: 'Cine',
    bpm: 126,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'D4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'D4', duration: 0.5 },
      { note: 'E4', duration: 0.5 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 0.5 }, { note: 'F4', duration: 0.5 }, { note: 'F4', duration: 0.5 },
      { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 1 },
      { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.5 },
      { note: 'D4', duration: 1.5 },
      { note: 'D4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'D4', duration: 0.5 },
      { note: 'E4', duration: 0.5 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 0.5 }, { note: 'F4', duration: 0.5 }, { note: 'F4', duration: 0.5 },
      { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 1 },
      { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'C4', duration: 0.5 },
      { note: 'D4', duration: 2 }
    ]
  },
  {
    id: 'titanic',
    title: 'Titanic (My Heart Will Go On)',
    category: 'Cine',
    bpm: 98,
    timeSignature: 4,
    difficulty: 'Fácil',
    notes: [
      { note: 'F4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1.5 }, { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1.5 }, { note: 'A#4', duration: 0.5 },
      { note: 'A4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1.5 }, { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'F4', duration: 2 }
    ]
  },
  {
    id: 'harry_potter',
    title: 'Harry Potter (Tema de Hedwig)',
    category: 'Cine',
    bpm: 108,
    timeSignature: 3,
    difficulty: 'Medio',
    notes: [
      { note: 'B4', duration: 1 },
      { note: 'E5', duration: 1.5 }, { note: 'G5', duration: 0.5 },
      { note: 'F#5', duration: 1 }, { note: 'E5', duration: 2 },
      { note: 'B5', duration: 1 }, { note: 'A5', duration: 2.5 },
      { note: 'F#5', duration: 2.5 },
      { note: 'E5', duration: 1.5 }, { note: 'G5', duration: 0.5 },
      { note: 'F#5', duration: 1 }, { note: 'D#5', duration: 2 },
      { note: 'F5', duration: 1 }, { note: 'B4', duration: 3 }
    ]
  },
  {
    id: 'el_padrino',
    title: 'El Padrino (Love Theme)',
    category: 'Cine',
    bpm: 92,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'E4', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'C5', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 }, { note: 'E4', duration: 2 },
      { note: 'E4', duration: 1 }, { note: 'A4', duration: 1 },
      { note: 'C5', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'C5', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'B4', duration: 1 },
      { note: 'A4', duration: 1 }, { note: 'E4', duration: 1 },
      { note: 'D#4', duration: 1 }, { note: 'D4', duration: 2 }
    ]
  },
  {
    id: 'pantera_rosa',
    title: 'La Pantera Rosa',
    category: 'Cine',
    bpm: 110,
    timeSignature: 4,
    difficulty: 'Medio',
    notes: [
      { note: 'D#4', duration: 0.5 }, { note: 'E4', duration: 1.5 },
      { note: 'F#4', duration: 0.5 }, { note: 'G4', duration: 1.5 },
      { note: 'D#4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
      { note: 'F#4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
      { note: 'C5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
      { note: 'B4', duration: 0.5 }, { note: 'A#4', duration: 2 },
      { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
      { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 0.5 },
      { note: 'E4', duration: 2 }
    ]
  }
];
