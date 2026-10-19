/**
 * SongManager.js
 * Gestión integral de canciones: biblioteca predefinida, canciones importadas
 * (JSON o MIDI), almacenamiento local y grabadora de interpretaciones.
 */

import { SONG_LIBRARY } from './songLibrary.js';
import { MidiParser } from './MidiParser.js';

const STORAGE_KEY = 'piano_movil_custom_songs';

export class SongManager {
  constructor() {
    this.library = [...SONG_LIBRARY];
    this.customSongs = this._loadCustomSongs();
    this.currentSongId = this.library[0].id;

    // Estado del grabador
    this.isRecording = false;
    this.recordedEvents = [];
    this.recordStartTime = 0;
  }

  _normalizeSong(song) {
    if (!song) return song;
    if (song._normalized) return song;

    if (Array.isArray(song.notes)) {
      song.notes = song.notes.map(item => {
        if (typeof item === 'string') {
          return {
            note: item,
            hand: 'right',
            duration: 1,
            notes: [{ note: item, hand: 'right', duration: 1 }]
          };
        }
        if (Array.isArray(item.notes) && item.notes.length > 0) {
          const hasLeft = item.notes.some(n => n.hand === 'left');
          const hasRight = item.notes.some(n => n.hand === 'right');
          const hand = item.hand || ((hasLeft && hasRight) ? 'both' : (hasLeft ? 'left' : 'right'));
          const primaryNote = item.note || item.notes[item.notes.length - 1].note;
          return {
            ...item,
            note: primaryNote,
            hand: hand,
            duration: item.duration || 1,
            notes: item.notes.map(n => ({
              note: n.note,
              hand: n.hand || (n.note && parseInt(n.note.slice(-1)) < 4 ? 'left' : 'right'),
              duration: n.duration || item.duration || 1
            }))
          };
        }
        const hand = item.hand || (item.note && parseInt(item.note.slice(-1)) < 4 ? 'left' : 'right');
        return {
          ...item,
          note: item.note,
          hand: hand,
          duration: item.duration || 1,
          notes: [{ note: item.note, hand: hand, duration: item.duration || 1 }]
        };
      });
    }
    song._normalized = true;
    return song;
  }

  getAllSongs() {
    return [...this.library, ...this.customSongs];
  }

  getCurrentSong() {
    const all = this.getAllSongs();
    const song = all.find(s => s.id === this.currentSongId) || all[0];
    return this._normalizeSong(song);
  }

  selectSong(id) {
    const song = this.getAllSongs().find(s => s.id === id);
    if (song) {
      this.currentSongId = id;
      return this._normalizeSong(song);
    }
    return null;
  }

  _loadCustomSongs() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error leyendo canciones locales:', e);
      return [];
    }
  }

  _saveCustomSongs() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customSongs));
    } catch (e) {
      console.warn('Error guardando canciones locales:', e);
    }
  }

  /**
   * Importa una canción desde archivo JSON.
   */
  async loadFromJsonFile(file) {
    const text = await file.text();
    const songData = JSON.parse(text);

    if (!songData.title || !Array.isArray(songData.notes) || songData.notes.length === 0) {
      throw new Error('Formato JSON inválido. Debe contener "title" y lista de "notes".');
    }

    const newSong = {
      id: 'custom_' + Date.now(),
      title: songData.title,
      bpm: songData.bpm || 100,
      timeSignature: songData.timeSignature || 4,
      timeSignatureDenom: songData.timeSignatureDenom || 4,
      difficulty: songData.difficulty || 'Personalizada',
      notes: songData.notes
    };

    this.customSongs.push(newSong);
    this._saveCustomSongs();
    this.currentSongId = newSong.id;
    return newSong;
  }

  /**
   * Importa una canción desde archivo MIDI (.mid).
   */
  async loadFromMidiFile(file) {
    const buffer = await file.arrayBuffer();
    const newSong = MidiParser.parse(buffer, file.name);

    this.customSongs.push(newSong);
    this._saveCustomSongs();
    this.currentSongId = newSong.id;
    return newSong;
  }

  /**
   * Carga una canción desde un buffer MIDI descargado de internet.
   */
  loadFromOnlineBuffer(buffer, songTitle) {
    const parsedSong = MidiParser.parse(buffer, songTitle || 'Canción Online');
    parsedSong.category = 'Online (BitMidi)';

    const existingIndex = this.customSongs.findIndex(s => s.title === parsedSong.title);
    if (existingIndex !== -1) {
      this.customSongs[existingIndex] = parsedSong;
    } else {
      this.customSongs.push(parsedSong);
    }

    this._saveCustomSongs();
    this.currentSongId = parsedSong.id;
    return parsedSong;
  }

  /**
   * Importa desde texto con secuencia de notas (ej: "C4 D4 E4 C4 | E4 F4 G4")
   */
  importFromText(title, textNoteString, bpm = 100) {
    const rawTokens = textNoteString.replace(/\|/g, ' ').trim().split(/\s+/);
    const validNotes = [];

    const noteRegex = /^[A-Ga-g][#b]?[2-6]$/;

    for (const token of rawTokens) {
      const upper = token.toUpperCase();
      if (noteRegex.test(upper)) {
        validNotes.push({ note: upper, duration: 1 });
      }
    }

    if (validNotes.length === 0) {
      throw new Error('No se detectaron notas válidas en el texto. Usa formato ej: C4 D4 E4 G4');
    }

    const newSong = {
      id: 'custom_' + Date.now(),
      title: title || 'Melodía Escrita',
      bpm: bpm || 100,
      timeSignature: 4,
      difficulty: 'Personalizada',
      notes: validNotes
    };

    this.customSongs.push(newSong);
    this._saveCustomSongs();
    this.currentSongId = newSong.id;
    return newSong;
  }

  deleteCustomSong(id) {
    this.customSongs = this.customSongs.filter(s => s.id !== id);
    this._saveCustomSongs();
    if (this.currentSongId === id) {
      this.currentSongId = this.library[0].id;
    }
  }

  // --- MÓDULO DE GRABACIÓN ---

  startRecording() {
    this.isRecording = true;
    this.recordedEvents = [];
    this.recordStartTime = performance.now();
  }

  cancelRecording() {
    this.isRecording = false;
    this.recordedEvents = [];
  }

  getRecordedCount() {
    return this.recordedEvents ? this.recordedEvents.length : 0;
  }

  recordNoteEvent(noteName) {
    if (!this.isRecording) return;
    const time = performance.now() - this.recordStartTime;
    this.recordedEvents.push({ note: noteName, time });
  }

  stopRecording(songTitle = 'Mi Grabación') {
    if (!this.isRecording) return null;
    this.isRecording = false;

    if (this.recordedEvents.length === 0) return null;

    // Calcular duraciones aproximadas en beats asumiendo 100 BPM (600ms por beat)
    const msPerBeat = 600;
    const formattedNotes = [];

    for (let i = 0; i < this.recordedEvents.length; i++) {
      const current = this.recordedEvents[i];
      const nextTime = i < this.recordedEvents.length - 1
        ? this.recordedEvents[i + 1].time
        : current.time + 600;

      const durationMs = Math.max(200, nextTime - current.time);
      let durationBeats = Math.round((durationMs / msPerBeat) * 2) / 2;
      durationBeats = Math.max(0.5, Math.min(4, durationBeats));

      formattedNotes.push({
        note: current.note,
        duration: durationBeats
      });
    }

    const newSong = {
      id: 'custom_rec_' + Date.now(),
      title: songTitle,
      bpm: 100,
      timeSignature: 4,
      difficulty: 'Grabada',
      notes: formattedNotes
    };

    this.customSongs.push(newSong);
    this._saveCustomSongs();
    this.currentSongId = newSong.id;
    return newSong;
  }

  /**
   * Exporta la canción activa a un archivo descargable .json
   */
  exportCurrentSong() {
    const song = this.getCurrentSong();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(song, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${song.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}
