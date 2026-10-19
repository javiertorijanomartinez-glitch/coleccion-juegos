/**
 * MidiParser.js
 * Analizador nativo ligero de archivos Standard MIDI (.mid / .midi) en JavaScript puro.
 * Permite cargar canciones MIDI estándar y convertirlas en melodías estructuradas.
 */

export class MidiParser {
  static midiNumberToNoteName(midiNum) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNum / 12) - 1;
    const note = notes[midiNum % 12];
    return `${note}${octave}`;
  }

  /**
   * Analiza un ArrayBuffer de un archivo .mid
   */
  static parse(arrayBuffer, fileName = 'Canción importada') {
    const view = new DataView(arrayBuffer);
    let offset = 0;

    // 1. Validar Header 'MThd'
    const headerId = String.fromCharCode(
      view.getUint8(offset++), view.getUint8(offset++),
      view.getUint8(offset++), view.getUint8(offset++)
    );
    if (headerId !== 'MThd') {
      throw new Error('El archivo no es un formato MIDI estándar válido (falta cabecera MThd)');
    }

    const headerLength = view.getUint32(offset); offset += 4;
    const format = view.getUint16(offset); offset += 2;
    const numTracks = view.getUint16(offset); offset += 2;
    const division = view.getUint16(offset); offset += 2; // Ticks por negra (PPQ)

    const ppq = (division & 0x8000) === 0 ? division : 120;
    let detectedBpm = 120;
    const rawEvents = [];

    let detectedTimeSignature = null;

    // 2. Procesar cada pista (MTrk)
    for (let t = 0; t < numTracks; t++) {
      if (offset >= view.byteLength) break;

      const trackId = String.fromCharCode(
        view.getUint8(offset++), view.getUint8(offset++),
        view.getUint8(offset++), view.getUint8(offset++)
      );
      const trackLength = view.getUint32(offset); offset += 4;
      const trackEnd = offset + trackLength;

      if (trackId !== 'MTrk') {
        offset = trackEnd;
        continue;
      }

      let currentTick = 0;
      let runningStatus = 0;

      while (offset < trackEnd && offset < view.byteLength) {
        // Delta time (variable length)
        let delta = 0;
        let byte = 0;
        do {
          byte = view.getUint8(offset++);
          delta = (delta << 7) | (byte & 0x7F);
        } while ((byte & 0x80) !== 0 && offset < trackEnd);

        currentTick += delta;

        let status = view.getUint8(offset++);
        if (status < 0x80) {
          // Running status
          status = runningStatus;
          offset--; // Reutilizar byte
        } else {
          runningStatus = status;
        }

        const messageType = status >> 4;
        const channel = status & 0x0F;

        if (status === 0xFF) {
          // Meta Event
          const metaType = view.getUint8(offset++);
          let metaLength = 0;
          let mByte = 0;
          do {
            mByte = view.getUint8(offset++);
            metaLength = (metaLength << 7) | (mByte & 0x7F);
          } while ((mByte & 0x80) !== 0 && offset < trackEnd);

          if (metaType === 0x51 && metaLength === 3) {
            // Tempo: microsegundos por negra
            const mpqn = (view.getUint8(offset) << 16) | (view.getUint8(offset + 1) << 8) | view.getUint8(offset + 2);
            detectedBpm = Math.round(60000000 / mpqn);
          } else if (metaType === 0x58 && metaLength >= 2) {
            // Compás (Time Signature): [nn, dd, cc, bb]
            // En estándar MIDI: nn = numerador, dd = potencia de 2 (2^dd = denominador: 2^2=4, 2^3=8)
            const nn = view.getUint8(offset);
            const dd = view.getUint8(offset + 1);
            const denominator = Math.pow(2, dd);
            if (nn > 0 && denominator > 0) {
              if (!detectedTimeSignature || currentTick === 0) {
                detectedTimeSignature = {
                  numerator: nn,
                  denominator: denominator,
                  foundInMidi: true
                };
                console.log(`[MidiParser] Compás recuperado del MIDI: ${nn}/${denominator} en tick ${currentTick}`);
              }
            }
          }
          offset += metaLength;
        } else if (status === 0xF0 || status === 0xF7) {
          // SysEx event
          let sysLength = 0;
          let sByte = 0;
          do {
            sByte = view.getUint8(offset++);
            sysLength = (sysLength << 7) | (sByte & 0x7F);
          } while ((sByte & 0x80) !== 0 && offset < trackEnd);
          offset += sysLength;
        } else if (messageType === 0x9) {
          // Note On
          const note = view.getUint8(offset++);
          const velocity = view.getUint8(offset++);
          // Ignorar canal de percusión/batería (Canal 10 en MIDI estándar = 9 en 0-indexed)
          if (channel !== 9) {
            rawEvents.push({
              type: velocity > 0 ? 'noteOn' : 'noteOff',
              tick: currentTick,
              note,
              velocity,
              track: t,
              channel
            });
          }
        } else if (messageType === 0x8) {
          // Note Off
          const note = view.getUint8(offset++);
          const velocity = view.getUint8(offset++);
          if (channel !== 9) {
            rawEvents.push({
              type: 'noteOff',
              tick: currentTick,
              note,
              track: t,
              channel
            });
          }
        } else if (messageType === 0xC || messageType === 0xD) {
          offset += 1; // Program change / Channel pressure
        } else {
          offset += 2; // Control change, Pitch bend, Poly pressure
        }
      }
    }

    // 3. Emparejar NoteOn con NoteOff para obtener duraciones
    rawEvents.sort((a, b) => a.tick - b.tick);

    const activeNotes = new Map();
    const parsedNotes = [];

    for (const evt of rawEvents) {
      if (evt.type === 'noteOn') {
        activeNotes.set(evt.note, { tick: evt.tick, track: evt.track, channel: evt.channel });
      } else if (evt.type === 'noteOff' && activeNotes.has(evt.note)) {
        const startData = activeNotes.get(evt.note);
        activeNotes.delete(evt.note);
        const durationTicks = Math.max(ppq / 4, evt.tick - startData.tick);
        const durationBeats = parseFloat((durationTicks / ppq).toFixed(2));
        const noteName = this.midiNumberToNoteName(evt.note);
        // Regla pedagógica de división de manos:
        // Do central (C4 / MIDI 60) como split point: notas < 60 = Mano Izquierda ('left'), >= 60 = Mano Derecha ('right')
        const hand = evt.note < 60 ? 'left' : 'right';

        parsedNotes.push({
          note: noteName,
          midiNumber: evt.note,
          startTick: startData.tick,
          duration: Math.max(0.25, Math.min(4, durationBeats)),
          hand,
          track: startData.track
        });
      }
    }

    // 4. Agrupar notas simultáneas por pulso temporal (polifonía y 2 manos en el mismo compás)
    parsedNotes.sort((a, b) => a.startTick - b.startTick);

    const toleranceTicks = Math.max(12, Math.round(ppq / 8)); // ~30-40ms de tolerancia para pulsación humana
    const polyphonicSteps = [];
    let currentStep = null;

    for (const item of parsedNotes) {
      if (!currentStep) {
        currentStep = {
          startTick: item.startTick,
          duration: item.duration,
          notes: [{
            note: item.note,
            midiNumber: item.midiNumber,
            hand: item.hand,
            duration: item.duration
          }]
        };
      } else if (Math.abs(item.startTick - currentStep.startTick) <= toleranceTicks) {
        // Misma ventana temporal -> notas que se tocan simultáneamente en este pulso
        if (!currentStep.notes.some(n => n.midiNumber === item.midiNumber)) {
          currentStep.notes.push({
            note: item.note,
            midiNumber: item.midiNumber,
            hand: item.hand,
            duration: item.duration
          });
          currentStep.duration = Math.max(currentStep.duration, item.duration);
        }
      } else {
        // Siguiente pulso o tiempo del compás
        currentStep.notes.sort((a, b) => a.midiNumber - b.midiNumber);
        const hasLeft = currentStep.notes.some(n => n.hand === 'left');
        const hasRight = currentStep.notes.some(n => n.hand === 'right');
        currentStep.hand = (hasLeft && hasRight) ? 'both' : (hasLeft ? 'left' : 'right');
        // Propiedad de nota principal (la más aguda o relevante para retrocompatibilidad)
        currentStep.note = currentStep.notes[currentStep.notes.length - 1].note;
        currentStep.midiNumber = currentStep.notes[currentStep.notes.length - 1].midiNumber;

        polyphonicSteps.push(currentStep);

        currentStep = {
          startTick: item.startTick,
          duration: item.duration,
          notes: [{
            note: item.note,
            midiNumber: item.midiNumber,
            hand: item.hand,
            duration: item.duration
          }]
        };
      }
    }

    if (currentStep) {
      currentStep.notes.sort((a, b) => a.midiNumber - b.midiNumber);
      const hasLeft = currentStep.notes.some(n => n.hand === 'left');
      const hasRight = currentStep.notes.some(n => n.hand === 'right');
      currentStep.hand = (hasLeft && hasRight) ? 'both' : (hasLeft ? 'left' : 'right');
      currentStep.note = currentStep.notes[currentStep.notes.length - 1].note;
      currentStep.midiNumber = currentStep.notes[currentStep.notes.length - 1].midiNumber;
      polyphonicSteps.push(currentStep);
    }

    if (polyphonicSteps.length === 0) {
      throw new Error('No se encontraron notas válidas en el archivo MIDI');
    }

    // 5. Ajustar duración rítmica exacta de cada paso en el compás según la distancia al siguiente paso
    for (let i = 0; i < polyphonicSteps.length - 1; i++) {
      const step = polyphonicSteps[i];
      const nextStep = polyphonicSteps[i + 1];
      const deltaTicks = nextStep.startTick - step.startTick;
      if (deltaTicks > 0) {
        const deltaBeats = parseFloat((deltaTicks / ppq).toFixed(2));
        step.duration = Math.max(0.25, Math.min(8, deltaBeats));
      }
    }

    const finalTimeSig = detectedTimeSignature || { numerator: 4, denominator: 4, foundInMidi: false };

    return {
      id: 'custom_' + Date.now(),
      title: fileName.replace(/\.[^/.]+$/, ''),
      bpm: detectedBpm || 110,
      timeSignature: finalTimeSig.numerator,
      timeSignatureDenom: finalTimeSig.denominator,
      timeSignatureFromMidi: !!finalTimeSig.foundInMidi,
      difficulty: 'Personalizado',
      notes: polyphonicSteps.slice(0, 180) // Pasos musicales polifónicos
    };
  }
}
