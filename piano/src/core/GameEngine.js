/**
 * GameEngine.js
 * Orquestador principal de la experiencia de juego:
 * Controla los modos (Libre, Guiado/Aprender, Escuchar/Demo),
 * el selector estricto de manos para práctica (Ambas, Solo Derecha, Solo Izquierda),
 * pausa/reanudación real, botón rebobinar, y ejecución polifónica en compás.
 */

export class GameEngine {
  constructor({ audioEngine, metronome, staffVisualizer, pianoKeyboard, songManager, lessonManager = null, lessonValidator = null }) {
    this.audio = audioEngine;
    this.metronome = metronome;
    this.staff = staffVisualizer;
    this.keyboard = pianoKeyboard;
    this.songs = songManager;
    this.lessonManager = lessonManager;
    this.lessonValidator = lessonValidator;

    this.mode = 'free'; // 'free', 'learn', 'demo', 'lesson'
    this.practiceHand = 'both'; // 'both', 'right', 'left'
    this.currentNoteIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;

    // Conjunto de notas requeridas pendientes en el pulso actual de aprendizaje
    this.pendingTargetNotes = new Set();

    // Estado de reproducción automática (Demo)
    this.isPlayingDemo = false;
    this.demoTimeoutId = null;

    // Callbacks a la interfaz de usuario
    this.onStateChange = null;

    this._setupLessonEvents();
  }

  setMode(newMode) {
    this.stopDemo();
    this.mode = newMode;
    this.currentNoteIndex = 0;
    this.streak = 0;

    if (newMode === 'free') {
      this.staff.clearTargetNote();
      this.keyboard.clearTargetKeys();
    } else if (newMode === 'learn') {
      this.score = 0;
      this._updateLearnTarget();
    } else if (newMode === 'demo') {
      this.startDemo();
    } else if (newMode === 'lesson') {
      this._startLessonMode();
    }

    this._notifyState();
  }

  setPracticeHand(hand) {
    if (['both', 'right', 'left'].includes(hand)) {
      this.practiceHand = hand;
      if (this.mode === 'learn') {
        this._updateLearnTarget();
      } else if (this.mode === 'demo') {
        if (!this.isPlayingDemo) {
          this._showDemoTarget();
        }
      }
      this._notifyState();
    }
  }

  setSong(songId) {
    this.stopDemo();
    const song = this.songs.selectSong(songId);
    if (song) {
      this.currentNoteIndex = 0;
      this.streak = 0;
      this.metronome.setBpm(song.bpm || 100);
      this.metronome.setTimeSignature(song.timeSignature || 4);

      // 1. Actualizar compás dinámico en el pentagrama
      if (this.staff && this.staff.setTimeSignature) {
        this.staff.setTimeSignature(song.timeSignature || 4, song.timeSignatureDenom || 4);
      }

      // 2. Adaptar número de octavas del teclado según todas las notas de la canción
      if (song.notes && song.notes.length > 0 && this.keyboard) {
        if (!this.keyboard.is88KeysMode && this.keyboard.setOctaveRange) {
          const octaves = [];
          song.notes.forEach(step => {
            const list = (Array.isArray(step.notes) && step.notes.length > 0) ? step.notes : [step];
            list.forEach(n => {
              const noteStr = n.note || n;
              if (typeof noteStr === 'string') {
                const m = noteStr.match(/([0-8])/);
                if (m) octaves.push(parseInt(m[1]));
              }
            });
          });

          if (octaves.length > 0) {
            const minOct = Math.min(...octaves);
            const maxOct = Math.max(...octaves);
            this.keyboard.setOctaveRange(minOct, maxOct);
          }
        } else if (this.keyboard.scrollToNote && song.notes[0]) {
          const firstNote = song.notes[0].note || (song.notes[0].notes && song.notes[0].notes[0]?.note);
          if (firstNote) this.keyboard.scrollToNote(firstNote);
        }
      }

      if (this.mode === 'learn') {
        this.score = 0;
        this._updateLearnTarget();
      } else if (this.mode === 'demo') {
        this.startDemo();
      }
    }
    this._notifyState();
  }

  _isLeftHandNote(noteName) {
    if (!noteName) return false;
    const m = noteName.match(/^([A-G]#?)([0-8])$/);
    if (!m) return false;
    return parseInt(m[2]) < 4;
  }

  _filterNotesByHand(notesList, hand) {
    if (!Array.isArray(notesList)) return [];
    if (!hand || hand === 'both') return notesList;
    if (hand === 'right') {
      return notesList.filter(n => (n.hand === 'right' || (!n.hand && n.note && !this._isLeftHandNote(n.note))));
    }
    if (hand === 'left') {
      return notesList.filter(n => (n.hand === 'left' || (!n.hand && n.note && this._isLeftHandNote(n.note))));
    }
    return notesList;
  }

  _getRequiredNotesForStep(step) {
    if (!step) return [];
    const stepNotes = (Array.isArray(step.notes) && step.notes.length > 0)
      ? step.notes
      : [{ note: step.note, hand: step.hand || (this._isLeftHandNote(step.note) ? 'left' : 'right') }];

    return this._filterNotesByHand(stepNotes, this.practiceHand);
  }

  /**
   * Manejador invocado cuando se pulsa una tecla en el piano (pantalla, teclado PC o MIDI externo).
   */
  handleNoteDown(noteName, velocity = 0.9) {
    // 1. Reproducir sonido con dinámica y mostrar en pentagrama
    this.audio.playNote(noteName, velocity);
    this.staff.noteOn(noteName);

    // 2. Registrar en grabadora si está activa
    if (this.songs.isRecording) {
      this.songs.recordNoteEvent(noteName);
    }

    // 3. Evaluar acierto en modo Lección / Tutorial
    if (this.mode === 'lesson' && this.lessonValidator) {
      this.lessonValidator.handleNoteOn(noteName, velocity);
      this._notifyState();
      return;
    }

    // 4. Evaluar acierto en modo Guiado / Aprender
    if (this.mode === 'learn') {
      const song = this.songs.getCurrentSong();
      if (!song || !song.notes || song.notes.length === 0) return;

      if (this.pendingTargetNotes.has(noteName)) {
        // Acierto de una nota requerida en este pulso
        this.pendingTargetNotes.delete(noteName);
        if (this.staff.createHitParticle) {
          this.staff.createHitParticle(noteName);
        }

        this.score += 10 + Math.min(this.streak * 2, 20);
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;

        // Si se han completado todas las notas requeridas de este pulso/acorde, avanzamos al siguiente
        if (this.pendingTargetNotes.size === 0) {
          this.currentNoteIndex++;

          if (this.currentNoteIndex >= song.notes.length) {
            this._handleSongCompleted();
          } else {
            this._updateLearnTarget();
          }
        } else {
          // Aún quedan notas del acorde: actualizar teclas resaltadas restantes
          const remainingTargets = Array.from(this.pendingTargetNotes).map(n => ({
            note: n,
            hand: this._isLeftHandNote(n) ? 'left' : 'right'
          }));
          this.keyboard.setTargetKeys(remainingTargets);
        }
      } else {
        // Verificar si la nota pertenece al pulso pero no era requerida por el filtro de mano
        const currentStep = song.notes[this.currentNoteIndex];
        const isInStep = currentStep && currentStep.notes && currentStep.notes.some(n => n.note === noteName);

        if (!isInStep) {
          // Error: nota fuera del compás
          this.streak = 0;
          this._flashErrorKey(noteName);
        }
      }
      this._notifyState();
    }
  }

  handleNoteUp(noteName) {
    this.audio.stopNote(noteName);
    this.staff.noteOff(noteName);
    if (this.mode === 'lesson' && this.lessonValidator) {
      this.lessonValidator.handleNoteOff(noteName);
    }
  }

  _updateLearnTarget() {
    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || this.currentNoteIndex >= song.notes.length) {
      this.staff.clearTargetNote();
      this.keyboard.clearTargetKeys();
      return;
    }

    const currentStep = song.notes[this.currentNoteIndex];
    const requiredNotes = this._getRequiredNotesForStep(currentStep);

    // Si este pulso no contiene notas de la mano elegida, avanzar automáticamente al siguiente
    if (requiredNotes.length === 0 && (this.practiceHand === 'right' || this.practiceHand === 'left')) {
      this.currentNoteIndex++;
      if (this.currentNoteIndex >= song.notes.length) {
        this._handleSongCompleted();
      } else {
        this._updateLearnTarget();
      }
      return;
    }

    const pastSteps = song.notes.slice(Math.max(0, this.currentNoteIndex - 3), this.currentNoteIndex);
    const upcoming = song.notes.slice(this.currentNoteIndex + 1, this.currentNoteIndex + 8);

    this.pendingTargetNotes = new Set(requiredNotes.map(n => n.note));

    // En el pentagrama mostramos la partitura deslizante con notas pasadas y filtro de mano
    this.staff.setTargetNote(currentStep, upcoming, this.practiceHand, pastSteps);

    // En el teclado resaltamos SOLO las teclas de la mano seleccionada
    this.keyboard.setTargetKeys(requiredNotes);
  }

  _flashErrorKey(noteName) {
    const el = document.querySelector(`.piano-key[data-note="${noteName}"]`);
    if (el) {
      el.classList.add('error-shake');
      setTimeout(() => el.classList.remove('error-shake'), 400);
    }
  }

  _handleSongCompleted() {
    this.staff.clearTargetNote();
    this.keyboard.clearTargetKeys();
    if (this.onStateChange) {
      this.onStateChange({
        mode: this.mode,
        practiceHand: this.practiceHand,
        currentSong: this.songs.getCurrentSong(),
        noteIndex: this.currentNoteIndex,
        totalNotes: this.songs.getCurrentSong().notes.length,
        score: this.score,
        streak: this.streak,
        isFinished: true
      });
    }
  }

  // --- MODO DEMO / ESCUCHA (REPRODUCCIÓN SIMULTÁNEA A 2 MANOS, PAUSA Y REBOBINADO) ---

  toggleDemoPause() {
    if (this.mode !== 'demo') {
      this.setMode('demo');
      return;
    }

    if (this.isPlayingDemo) {
      // Pausar reproducción conservando el pulso actual
      this.isPlayingDemo = false;
      if (this.demoTimeoutId) {
        clearTimeout(this.demoTimeoutId);
        this.demoTimeoutId = null;
      }
      this._showDemoTarget();
      this._notifyState();
    } else {
      // Reanudar desde el pulso actual
      this.resumeDemo();
    }
  }

  resumeDemo() {
    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || song.notes.length === 0) return;

    if (this.currentNoteIndex >= song.notes.length) {
      this.currentNoteIndex = 0;
    }

    this.isPlayingDemo = true;
    this._playDemoStep();
    this._notifyState();
  }

  rewind(steps = 4) {
    if (this.mode === 'lesson' && this.lessonValidator) {
      this.lessonValidator.rewindStep();
      this._notifyState();
      return;
    }

    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || song.notes.length === 0) return;

    this.currentNoteIndex = Math.max(0, this.currentNoteIndex - steps);

    if (this.mode === 'learn') {
      this._updateLearnTarget();
    } else if (this.mode === 'demo') {
      if (this.isPlayingDemo) {
        if (this.demoTimeoutId) {
          clearTimeout(this.demoTimeoutId);
          this.demoTimeoutId = null;
        }
        this._playDemoStep();
      } else {
        this._showDemoTarget();
      }
    }
    this._notifyState();
  }

  _showDemoTarget() {
    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || this.currentNoteIndex >= song.notes.length) {
      this.staff.clearTargetNote();
      this.keyboard.clearTargetKeys();
      return;
    }

    const currentStep = song.notes[this.currentNoteIndex];
    const pastSteps = song.notes.slice(Math.max(0, this.currentNoteIndex - 3), this.currentNoteIndex);
    const upcoming = song.notes.slice(this.currentNoteIndex + 1, this.currentNoteIndex + 8);

    const stepNotes = (Array.isArray(currentStep.notes) && currentStep.notes.length > 0)
      ? currentStep.notes
      : [{ note: currentStep.note, hand: currentStep.hand || (this._isLeftHandNote(currentStep.note) ? 'left' : 'right') }];

    const filteredNotes = this._filterNotesByHand(stepNotes, this.practiceHand);

    this.staff.setTargetNote(currentStep, upcoming, this.practiceHand, pastSteps);
    this.keyboard.setTargetKeys(filteredNotes);
  }

  startDemo() {
    this.stopDemo();
    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || song.notes.length === 0) return;

    this.isPlayingDemo = true;
    this.currentNoteIndex = 0;
    this._playDemoStep();
  }

  _playDemoStep() {
    if (!this.isPlayingDemo) return;

    const song = this.songs.getCurrentSong();
    if (!song || !song.notes || this.currentNoteIndex >= song.notes.length) {
      this.stopDemo();
      this._notifyState();
      return;
    }

    const currentStep = song.notes[this.currentNoteIndex];
    const pastSteps = song.notes.slice(Math.max(0, this.currentNoteIndex - 3), this.currentNoteIndex);
    const upcoming = song.notes.slice(this.currentNoteIndex + 1, this.currentNoteIndex + 8);

    const stepNotes = (Array.isArray(currentStep.notes) && currentStep.notes.length > 0)
      ? currentStep.notes
      : [{ note: currentStep.note, hand: currentStep.hand || (this._isLeftHandNote(currentStep.note) ? 'left' : 'right'), duration: currentStep.duration || 1 }];

    // Filtro estricto de notas por mano
    const filteredNotes = this._filterNotesByHand(stepNotes, this.practiceHand);

    // 1. Mostrar en pentagrama (notas pasadas deslizándose a la izquierda, actual y próximas)
    this.staff.setTargetNote(currentStep, upcoming, this.practiceHand, pastSteps);

    // 2. Resaltar en el teclado SOLO las teclas de la mano seleccionada
    this.keyboard.setTargetKeys(filteredNotes);

    // 3. Reproducir audio y presionar visualmente SOLO las notas de la mano seleccionada
    filteredNotes.forEach(n => {
      this.audio.playNote(n.note, 0.85);
      this.keyboard.pressVisualKey(n.note);
      if (this.staff.createHitParticle) {
        this.staff.createHitParticle(n.note);
      }
    });

    const msPerBeat = 60000 / (song.bpm || 100);
    const stepDurationMs = Math.max(160, (currentStep.duration || 1) * msPerBeat);
    const releaseTimeMs = Math.min(stepDurationMs * 0.85, stepDurationMs - 35);

    // Liberar teclas visuales y audio antes del siguiente pulso
    setTimeout(() => {
      filteredNotes.forEach(n => {
        this.audio.stopNote(n.note);
        this.keyboard.releaseVisualKey(n.note);
      });
    }, releaseTimeMs);

    this.currentNoteIndex++;
    this._notifyState();

    this.demoTimeoutId = setTimeout(() => {
      this._playDemoStep();
    }, stepDurationMs);
  }

  stopDemo() {
    if (this.isPlayingDemo) {
      this.isPlayingDemo = false;
      if (this.demoTimeoutId) {
        clearTimeout(this.demoTimeoutId);
        this.demoTimeoutId = null;
      }
      this.staff.clearTargetNote();
      this.keyboard.clearTargetKeys();
    }
  }

  restart() {
    this.currentNoteIndex = 0;
    this.score = 0;
    this.streak = 0;
    if (this.mode === 'learn') {
      this._updateLearnTarget();
    } else if (this.mode === 'demo') {
      this.startDemo();
    }
    this._notifyState();
  }

  // --- MODO LECCIONES / TUTORIAL DIDÁCTICO ---

  _setupLessonEvents() {
    if (!this.lessonValidator) return;

    this.lessonValidator.onTargetUpdate = (step) => {
      if (this.mode === 'lesson') {
        this._updateLessonTarget(step);
      }
    };

    this.lessonValidator.onSuccess = (feedback) => {
      if (feedback && feedback.playedNote && this.staff.createHitParticle) {
        this.staff.createHitParticle(feedback.playedNote);
      }
    };

    this.lessonValidator.onMistake = (err) => {
      if (err && err.played) {
        this._flashErrorKey(err.played);
      }
    };
  }

  setLesson(lessonId) {
    if (this.lessonManager) {
      const lesson = this.lessonManager.selectLesson(lessonId);
      if (lesson && this.lessonValidator) {
        this.lessonValidator.loadLesson(lesson);
        if (this.mode === 'lesson') {
          this._startLessonMode();
        }
      }
    }
  }

  _startLessonMode() {
    this.stopDemo();
    const lesson = this.lessonManager ? this.lessonManager.getCurrentLesson() : null;
    if (!lesson || !this.lessonValidator) return;

    this.lessonValidator.loadLesson(lesson);
    if (this.metronome) {
      this.metronome.setBpm(lesson.tempo || 70);
      const num = lesson.timeSignature ? lesson.timeSignature.num : 4;
      this.metronome.setTimeSignature(num);
    }
    if (this.staff && this.staff.setTimeSignature) {
      const num = lesson.timeSignature ? lesson.timeSignature.num : 4;
      const denom = lesson.timeSignature ? lesson.timeSignature.denom : 4;
      this.staff.setTimeSignature(num, denom);
    }

    const initialStep = this.lessonValidator.getCurrentStep();
    this._updateLessonTarget(initialStep);
    this._notifyState();
  }

  _updateLessonTarget(step) {
    if (!step) {
      this.staff.clearTargetNote();
      this.keyboard.clearTargetKeys();
      return;
    }

    const lesson = this.lessonManager ? this.lessonManager.getCurrentLesson() : null;
    const stepIdx = this.lessonValidator ? this.lessonValidator.currentStepIndex : 0;
    const allSteps = (lesson && lesson.steps) ? lesson.steps : [];

    // 1. Teclado: construir teclas diana con indicador de dedo (1 al 5)
    let keyTargets = [];
    if (Array.isArray(step.targetNotes)) {
      const fingers = step.fingers || [];
      keyTargets = step.targetNotes.map((n, idx) => ({
        note: n,
        hand: step.hand || (this._isLeftHandNote(n) ? 'left' : 'right'),
        finger: fingers[idx] || step.finger || null
      }));
    } else if (Array.isArray(step.notes)) {
      keyTargets = step.notes.map(n => ({
        note: n.note,
        hand: n.hand || (this._isLeftHandNote(n.note) ? 'left' : 'right'),
        finger: n.finger || step.finger || null
      }));
    } else if (step.note) {
      keyTargets = [{
        note: step.note,
        hand: step.hand || (this._isLeftHandNote(step.note) ? 'left' : 'right'),
        finger: step.finger || null
      }];
    }

    this.keyboard.setTargetKeys(keyTargets);

    // 2. Pentagrama: notas pasadas, actual y próximas
    const pastSteps = allSteps.slice(Math.max(0, stepIdx - 3), stepIdx).map(s => {
      if (s.notes) return s.notes;
      if (s.targetNotes) return s.targetNotes.map(n => ({ note: n, hand: s.hand }));
      return [{ note: s.note, hand: s.hand }];
    });

    const upcomingSteps = allSteps.slice(stepIdx + 1, stepIdx + 8).map(s => {
      if (s.notes) return s.notes;
      if (s.targetNotes) return s.targetNotes.map(n => ({ note: n, hand: s.hand }));
      return [{ note: s.note, hand: s.hand }];
    });

    const currentStaffStep = {
      note: keyTargets[0]?.note,
      hand: step.hand || 'both',
      notes: keyTargets
    };

    this.staff.setTargetNote(currentStaffStep, upcomingSteps, step.hand || 'both', pastSteps);
  }

  _notifyState() {
    if (this.onStateChange) {
      const song = this.songs.getCurrentSong();
      const lesson = this.lessonManager ? this.lessonManager.getCurrentLesson() : null;
      const step = this.lessonValidator ? this.lessonValidator.getCurrentStep() : null;
      const stepIdx = this.lessonValidator ? this.lessonValidator.currentStepIndex : 0;
      const totalSteps = (lesson && lesson.steps) ? lesson.steps.length : 0;

      this.onStateChange({
        mode: this.mode,
        practiceHand: this.practiceHand,
        currentSong: song,
        noteIndex: this.currentNoteIndex,
        totalNotes: song && song.notes ? song.notes.length : 0,
        score: this.score,
        streak: this.streak,
        isPlayingDemo: this.isPlayingDemo,
        isFinished: song && song.notes && this.currentNoteIndex >= song.notes.length,
        // Datos de lección pedagógica
        currentLesson: lesson,
        lessonStep: step,
        lessonStepIndex: stepIdx,
        lessonTotalSteps: totalSteps
      });
    }
  }
}
