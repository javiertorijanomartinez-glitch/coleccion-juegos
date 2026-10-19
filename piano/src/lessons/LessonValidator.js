/**
 * LessonValidator.js
 * Motor pedagógico de validación para las 15 lecciones del currículo de piano.
 * Evalúa en tiempo real eventos de notas (teclado virtual y MIDI) según el tipo de ejercicio:
 * notas individuales, secuencias, alternancia bimanual, acordes simultáneos, progresiones,
 * dinámicas de presión (Piano/Forte) y melodía polifónica con armonía.
 */

export class LessonValidator {
  constructor() {
    this.currentLesson = null;
    this.currentStepIndex = 0;
    this.activeChordBuffer = new Set();
    this.chordWindowTimer = null;
    this.polyphonicPending = null;
    this.mistakesInStep = 0;
    this.totalMistakes = 0;

    // Callbacks a la UI y GameEngine
    this.onSuccess = null;         // ({ status, message, playedNote, finger }) => void
    this.onStepAdvanced = null;    // (nextStep, progressPercent, currentStepIndex, totalSteps) => void
    this.onMistake = null;         // ({ expected, played, message, currentVelocity }) => void
    this.onLessonCompleted = null; // ({ lessonId, title, stars, score, mistakes }) => void
    this.onTargetUpdate = null;    // (step) => void
  }

  loadLesson(lessonData) {
    this.currentLesson = lessonData;
    this.currentStepIndex = 0;
    this.activeChordBuffer.clear();
    if (this.chordWindowTimer) {
      clearTimeout(this.chordWindowTimer);
      this.chordWindowTimer = null;
    }
    this.polyphonicPending = null;
    this.mistakesInStep = 0;
    this.totalMistakes = 0;

    const step = this.getCurrentStep();
    if (step && this.onTargetUpdate) {
      this.onTargetUpdate(step);
    }
  }

  getCurrentStep() {
    if (!this.currentLesson || !Array.isArray(this.currentLesson.steps)) return null;
    return this.currentLesson.steps[this.currentStepIndex] || null;
  }

  /**
   * Evaluador principal activado al pulsar una nota (Pantalla o MIDI externo)
   * @param {string} noteName - Ej: 'C4', 'G3'
   * @param {number} velocity - Valor normalizado entre 0.0 y 1.0 (o 0-127)
   */
  handleNoteOn(noteName, velocity = 0.8) {
    const step = this.getCurrentStep();
    if (!step || !this.currentLesson) return;

    // Normalizar velocity si viene en rango MIDI 0-127
    const normVel = velocity > 1.0 ? velocity / 127 : velocity;
    const validationType = this.currentLesson.validationType;

    switch (validationType) {
      case 'single_note':
      case 'sequence':
      case 'hands_alternating':
      case 'sight_reading':
        this._validateSequenceStep(noteName, step);
        break;

      case 'simultaneous_chord':
      case 'chord_progression':
        this._validateChordStep(noteName, step);
        break;

      case 'velocity_dynamic':
        this._validateVelocityStep(noteName, normVel, step);
        break;

      case 'melody_plus_harmony':
      case 'full_piece_performance':
        this._validatePolyphonicStep(noteName, step);
        break;

      case 'rhythm_timing':
        this._validateRhythmAttack(noteName, step);
        break;

      default:
        this._validateSequenceStep(noteName, step);
    }
  }

  handleNoteOff(noteName) {
    // Si la nota levantada estaba en el buffer de acorde, podemos gestionarlo si se desea
  }

  /**
   * Validación de notas simples o secuencias melódicas
   */
  _validateSequenceStep(playedNote, step) {
    const expectedNote = step.note || (step.targetNotes && step.targetNotes[0]);

    if (playedNote === expectedNote) {
      this._advanceStep({
        status: 'correct',
        message: '¡Muy bien!',
        playedNote,
        finger: step.finger,
        hand: step.hand
      });
    } else {
      this.mistakesInStep++;
      this.totalMistakes++;
      if (this.onMistake) {
        this.onMistake({
          expected: expectedNote,
          played: playedNote,
          message: `Nota incorrecta: tocaste ${playedNote}, buscamos ${expectedNote}.`
        });
      }
    }
  }

  /**
   * Validación de acordes simultáneos con ventana elástica (140 ms)
   * Permite que dedos humanos no tengan que tocar exactamente en el mismo microsegundo.
   */
  _validateChordStep(playedNote, step) {
    const expectedNotes = new Set(step.targetNotes || [step.note]);
    const windowMs = (this.currentLesson.tolerance && this.currentLesson.tolerance.simultaneousWindowMs) || 140;

    // Si la nota no pertenece al acorde objetivo
    if (!expectedNotes.has(playedNote)) {
      this.mistakesInStep++;
      this.totalMistakes++;
      if (this.onMistake) {
        this.onMistake({
          expected: Array.from(expectedNotes),
          played: playedNote,
          message: `La nota ${playedNote} no pertenece al acorde de ${step.chordName || 'tríada'}.`
        });
      }
      return;
    }

    // Agregar nota al conjunto del acorde activo
    this.activeChordBuffer.add(playedNote);

    if (this.chordWindowTimer) {
      clearTimeout(this.chordWindowTimer);
    }

    // ¿Se han pulsado ya todas las notas requeridas del acorde?
    let allHit = true;
    for (const req of expectedNotes) {
      if (!this.activeChordBuffer.has(req)) {
        allHit = false;
        break;
      }
    }

    if (allHit) {
      this.activeChordBuffer.clear();
      this._advanceStep({
        status: 'correct',
        message: `¡Acorde de ${step.chordName || 'tríada'} completo!`,
        chordNotes: Array.from(expectedNotes)
      });
      return;
    }

    // Temporizador de ventana de sincronía
    this.chordWindowTimer = setTimeout(() => {
      if (this.activeChordBuffer.size > 0 && this.activeChordBuffer.size < expectedNotes.size) {
        const missing = Array.from(expectedNotes).filter(n => !this.activeChordBuffer.has(n));
        this.mistakesInStep++;
        this.totalMistakes++;
        if (this.onMistake) {
          this.onMistake({
            message: `Toca las notas juntas. Faltaron: ${missing.join(', ')}`,
            missingNotes: missing
          });
        }
        this.activeChordBuffer.clear();
      }
    }, windowMs);
  }

  /**
   * Validación de dinámicas y presión (Piano vs Forte)
   */
  _validateVelocityStep(playedNote, normVel, step) {
    if (playedNote !== step.note) {
      this.mistakesInStep++;
      this.totalMistakes++;
      if (this.onMistake) {
        this.onMistake({
          expected: step.note,
          played: playedNote,
          message: `Nota equivocada. Toca primero la tecla correcta (${step.note}).`
        });
      }
      return;
    }

    const { minVelocity = 0, maxVelocity = 1.0, expectedDynamic } = step;
    const dynamicName = (expectedDynamic || 'dinámica').toUpperCase();

    if (normVel >= minVelocity && normVel <= maxVelocity) {
      this._advanceStep({
        status: 'correct',
        message: `¡Excelente! Dinámica ${dynamicName} lograda con precisión.`,
        currentVelocity: normVel
      });
    } else if (normVel < minVelocity) {
      this.mistakesInStep++;
      if (this.onMistake) {
        this.onMistake({
          message: `Demasiado suave para ${dynamicName} (intensidad ${Math.round(normVel * 100)}%). Pulsa con más peso y energía.`,
          currentVelocity: normVel
        });
      }
    } else {
      this.mistakesInStep++;
      if (this.onMistake) {
        this.onMistake({
          message: `Demasiado fuerte para ${dynamicName} (intensidad ${Math.round(normVel * 100)}%). Toca con mayor delicadeza.`,
          currentVelocity: normVel
        });
      }
    }
  }

  /**
   * Validación polifónica para acompañamiento bimanual
   */
  _validatePolyphonicStep(playedNote, step) {
    let rawList = [];
    if (Array.isArray(step.notes)) {
      rawList = step.notes;
    } else if (step.targetNotes) {
      rawList = step.targetNotes.map(n => (typeof n === 'string' ? { note: n } : n));
    } else if (step.note) {
      rawList = [{ note: step.note }];
    }

    const expectedSet = new Set(rawList.map(n => n.note));

    if (!this.polyphonicPending) {
      this.polyphonicPending = new Set(expectedSet);
    }

    if (this.polyphonicPending.has(playedNote)) {
      this.polyphonicPending.delete(playedNote);

      if (this.polyphonicPending.size === 0) {
        this.polyphonicPending = null;
        this._advanceStep({
          status: 'correct',
          message: '¡Pulso bimanual sincronizado!',
          playedNote
        });
      }
    } else {
      this.mistakesInStep++;
      this.totalMistakes++;
      if (this.onMistake) {
        this.onMistake({
          message: `Nota fuera de lugar: ${playedNote}. Revisa la partitura y la digitación.`,
          played: playedNote
        });
      }
    }
  }

  /**
   * Validación rítmica
   */
  _validateRhythmAttack(playedNote, step) {
    if (playedNote === step.note) {
      this._advanceStep({
        status: 'correct',
        message: `¡${step.figure ? step.figure.toUpperCase() : 'Pulso'} acertado!`,
        playedNote
      });
    } else {
      this.mistakesInStep++;
      this.totalMistakes++;
      if (this.onMistake) {
        this.onMistake({
          expected: step.note,
          played: playedNote,
          message: `Mantén la atención en ${step.note}.`
        });
      }
    }
  }

  _advanceStep(feedback) {
    if (this.onSuccess) {
      this.onSuccess(feedback);
    }

    this.currentStepIndex++;
    const totalSteps = this.currentLesson.steps.length;
    const progress = Math.round((this.currentStepIndex / totalSteps) * 100);

    if (this.currentStepIndex >= totalSteps) {
      // Calcular estrellas según precisión
      let stars = 3;
      if (this.totalMistakes > 4) stars = 1;
      else if (this.totalMistakes > 1) stars = 2;

      const score = Math.max(100, 1000 - this.totalMistakes * 100);

      if (this.onLessonCompleted) {
        this.onLessonCompleted({
          lessonId: this.currentLesson.id,
          title: this.currentLesson.title,
          stars,
          score,
          mistakes: this.totalMistakes
        });
      }
    } else {
      const nextStep = this.getCurrentStep();
      if (this.onTargetUpdate && nextStep) {
        this.onTargetUpdate(nextStep);
      }
      if (this.onStepAdvanced) {
        this.onStepAdvanced(nextStep, progress, this.currentStepIndex, totalSteps);
      }
    }
  }

  rewindStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.activeChordBuffer.clear();
      this.polyphonicPending = null;
      const step = this.getCurrentStep();
      if (this.onTargetUpdate && step) {
        this.onTargetUpdate(step);
      }
      if (this.onStepAdvanced) {
        const totalSteps = this.currentLesson.steps.length;
        const progress = Math.round((this.currentStepIndex / totalSteps) * 100);
        this.onStepAdvanced(step, progress, this.currentStepIndex, totalSteps);
      }
    }
  }

  skipStep() {
    const totalSteps = this.currentLesson.steps.length;
    if (this.currentStepIndex < totalSteps - 1) {
      this.currentStepIndex++;
      this.activeChordBuffer.clear();
      this.polyphonicPending = null;
      const step = this.getCurrentStep();
      if (this.onTargetUpdate && step) {
        this.onTargetUpdate(step);
      }
      if (this.onStepAdvanced) {
        const progress = Math.round((this.currentStepIndex / totalSteps) * 100);
        this.onStepAdvanced(step, progress, this.currentStepIndex, totalSteps);
      }
    }
  }
}
