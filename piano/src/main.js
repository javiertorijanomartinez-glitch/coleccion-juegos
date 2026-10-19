/**
 * main.js
 * Punto de entrada principal de la aplicación Piano Móvil Horizontal.
 * Vincula el motor de audio, metrónomo, pentagrama, teclado, canciones e interfaz de usuario.
 */

import { AudioEngine } from './audio/AudioEngine.js';
import { Metronome } from './audio/Metronome.js';
import { StaffVisualizer } from './components/StaffVisualizer.js';
import { PianoKeyboard } from './components/PianoKeyboard.js';
import { SongManager } from './songs/SongManager.js';
import { GameEngine } from './core/GameEngine.js';
import { MidiInputManager } from './audio/MidiInputManager.js';
import { OnlineSongService } from './songs/OnlineSongService.js';
import { LessonManager } from './lessons/LessonManager.js';
import { LessonValidator } from './lessons/LessonValidator.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Instanciar módulos
  const audioEngine = new AudioEngine();
  const metronome = new Metronome(audioEngine.ctx);
  const songManager = new SongManager();
  const midiManager = new MidiInputManager();
  const onlineSongService = new OnlineSongService();
  const lessonManager = new LessonManager();
  const lessonValidator = new LessonValidator();

  const staffContainer = document.getElementById('staffContainer');
  const staffVisualizer = new StaffVisualizer(staffContainer);

  const pianoContainer = document.getElementById('pianoContainer');
  let pianoKeyboard = null;

  // Interacción de audio segura en móviles (desbloqueo inmediato en cualquier interacción)
  const unlockAudio = () => {
    audioEngine.init();
    if (audioEngine.ctx) {
      if (audioEngine.ctx.state === 'suspended') {
        audioEngine.ctx.resume();
      }
      metronome.setAudioContext(audioEngine.ctx);
    }
  };
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('touchend', unlockAudio, { passive: true });
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('mousedown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

  // 2. Inicializar teclado de piano con callbacks hacia el Game Engine
  let gameEngine = null;

  const handleNoteDown = (noteName) => {
    unlockAudio();
    if (gameEngine) {
      gameEngine.handleNoteDown(noteName);
    }
    if (typeof updateRecordHudUI === 'function' && songManager.isRecording) {
      updateRecordHudUI();
    }
  };

  const handleNoteUp = (noteName) => {
    if (gameEngine) {
      gameEngine.handleNoteUp(noteName);
    }
  };

  pianoKeyboard = new PianoKeyboard(pianoContainer, handleNoteDown, handleNoteUp);
  pianoKeyboard.onRangeChange = () => {
    if (typeof updateOctaveUI === 'function') updateOctaveUI();
  };

  // 3. Inicializar Game Engine
  gameEngine = new GameEngine({
    audioEngine,
    metronome,
    staffVisualizer,
    pianoKeyboard,
    songManager,
    lessonManager,
    lessonValidator
  });

  // 4. Elementos del DOM
  const currentSongTitleEl = document.getElementById('currentSongTitle');
  const songProgressBar = document.getElementById('songProgressBar');
  const gameStatsOverlay = document.getElementById('gameStatsOverlay');
  const statScore = document.getElementById('statScore');
  const statStreak = document.getElementById('statStreak');

  const btnModeFree = document.getElementById('btnModeFree');
  const btnModeLearn = document.getElementById('btnModeLearn');
  const btnModeDemo = document.getElementById('btnModeDemo');
  const btnModeLesson = document.getElementById('btnModeLesson');
  const btnRewind = document.getElementById('btnRewind');

  const lessonHudBar = document.getElementById('lessonHudBar');
  const lessonHudBadge = document.getElementById('lessonHudBadge');
  const lessonHudTitle = document.getElementById('lessonHudTitle');
  const lessonHudTip = document.getElementById('lessonHudTip');
  const lessonHudStepCounter = document.getElementById('lessonHudStepCounter');
  const btnLessonPrevStep = document.getElementById('btnLessonPrevStep');
  const btnLessonNextStep = document.getElementById('btnLessonNextStep');
  const btnOpenLessonsModal = document.getElementById('btnOpenLessonsModal');

  const lessonsModal = document.getElementById('lessonsModal');
  const moduleTabsContainer = document.getElementById('moduleTabsContainer');
  const lessonsListContainer = document.getElementById('lessonsListContainer');

  const lessonCompleteModal = document.getElementById('lessonCompleteModal');
  const completedLessonTitle = document.getElementById('completedLessonTitle');
  const lessonCompleteStars = document.getElementById('lessonCompleteStars');
  const lessonFinalScore = document.getElementById('lessonFinalScore');
  const lessonFinalMistakes = document.getElementById('lessonFinalMistakes');
  const btnReplayLesson = document.getElementById('btnReplayLesson');
  const btnNextLesson = document.getElementById('btnNextLesson');

  const btnSelectSong = document.getElementById('btnSelectSong');
  const btnSongManager = document.getElementById('btnSongManager');
  const songModal = document.getElementById('songModal');
  const songListContainer = document.getElementById('songListContainer');

  const btnMetronome = document.getElementById('btnMetronome');
  const metronomeBpmLabel = document.getElementById('metronomeBpmLabel');
  const metronomeModal = document.getElementById('metronomeModal');
  const modalBpmValue = document.getElementById('modalBpmValue');
  const bpmSlider = document.getElementById('bpmSlider');
  const btnBpmMinus = document.getElementById('btnBpmMinus');
  const btnBpmPlus = document.getElementById('btnBpmPlus');
  const btnTapTempo = document.getElementById('btnTapTempo');
  const btnToggleMetronomePlay = document.getElementById('btnToggleMetronomePlay');
  const beatDotsContainer = document.getElementById('beatDotsContainer');

  const btnSustain = document.getElementById('btnSustain');
  const btnOctDown = document.getElementById('btnOctDown');
  const btnOctUp = document.getElementById('btnOctUp');
  const currentOctLabel = document.getElementById('currentOctLabel');

  // Elementos MIDI
  const btnMidi = document.getElementById('btnMidi');
  const midiStatusDot = document.getElementById('midiStatusDot');
  const midiButtonLabel = document.getElementById('midiButtonLabel');
  const midiModal = document.getElementById('midiModal');
  const modalMidiStatusDot = document.getElementById('modalMidiStatusDot');
  const modalMidiStatusTitle = document.getElementById('modalMidiStatusTitle');
  const modalMidiStatusSubtitle = document.getElementById('modalMidiStatusSubtitle');
  const btnMidiReconnect = document.getElementById('btnMidiReconnect');
  const midiDeviceSelectRow = document.getElementById('midiDeviceSelectRow');
  const midiDeviceSelect = document.getElementById('midiDeviceSelect');
  const midiActivityIndicator = document.getElementById('midiActivityIndicator');
  const midiLastNote = document.getElementById('midiLastNote');
  const midiLastVelocity = document.getElementById('midiLastVelocity');
  const midiSustainStatus = document.getElementById('midiSustainStatus');
  const midiChannel = document.getElementById('midiChannel');
  const checkMidiVelocity = document.getElementById('checkMidiVelocity');

  const btnNotation = document.getElementById('btnNotation');
  const notationLabel = document.getElementById('notationLabel');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnDismissRotate = document.getElementById('btnDismissRotate');
  const rotateDeviceOverlay = document.getElementById('rotateDeviceOverlay');

  const celebrationModal = document.getElementById('celebrationModal');
  const completedSongTitle = document.getElementById('completedSongTitle');
  const finalScore = document.getElementById('finalScore');
  const btnReplaySong = document.getElementById('btnReplaySong');
  const btnNextSong = document.getElementById('btnNextSong');

  // 5. Conectar Metrónomo con la UI (Flash de beats)
  const updateBeatDots = (beatsCount) => {
    beatDotsContainer.innerHTML = '';
    for (let i = 0; i < beatsCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'beat-dot';
      dot.dataset.beat = i;
      beatDotsContainer.appendChild(dot);
    }
  };
  updateBeatDots(metronome.beatsPerBar);

  metronome.onTick = (beatIndex, isAccent) => {
    const dots = beatDotsContainer.querySelectorAll('.beat-dot');
    dots.forEach((d, idx) => {
      if (idx === beatIndex) {
        d.classList.add(isAccent ? 'accent-flash' : 'flash');
        setTimeout(() => d.classList.remove('accent-flash', 'flash'), 120);
      }
    });

    // Pequeño pulso en el botón de la cabecera
    btnMetronome.classList.add('pulse');
    setTimeout(() => btnMetronome.classList.remove('pulse'), 100);
  };

  // 6. Listener del Game Engine para cambios de estado (UI Reactiva)
  gameEngine.onStateChange = ({ mode, practiceHand, currentSong, noteIndex, totalNotes, score, streak, isPlayingDemo, isFinished, currentLesson, lessonStep, lessonStepIndex, lessonTotalSteps }) => {
    if (currentSong && mode !== 'lesson') {
      currentSongTitleEl.textContent = currentSong.title;
    }

    if (practiceHand) {
      document.querySelectorAll('.hand-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.hand === practiceHand);
      });
    }

    // Progreso de la canción (solo en modo canción)
    if (mode !== 'lesson') {
      if (totalNotes > 0) {
        const pct = Math.min(100, (noteIndex / totalNotes) * 100);
        songProgressBar.style.width = `${pct}%`;
      } else {
        songProgressBar.style.width = '0%';
      }
    } else {
      if (lessonTotalSteps > 0) {
        const pct = Math.min(100, ((lessonStepIndex + 1) / lessonTotalSteps) * 100);
        songProgressBar.style.width = `${pct}%`;
      } else {
        songProgressBar.style.width = '0%';
      }
    }

    // Modo Guiado: marcador
    if (mode === 'learn') {
      gameStatsOverlay.classList.remove('hidden');
      statScore.textContent = score;
      statStreak.textContent = streak;
    } else {
      gameStatsOverlay.classList.add('hidden');
    }

    // Sincronizar estado de los botones de modo
    btnModeFree.classList.toggle('active', mode === 'free');
    btnModeLearn.classList.toggle('active', mode === 'learn');
    btnModeDemo.classList.toggle('active', mode === 'demo');
    if (btnModeLesson) btnModeLesson.classList.toggle('active', mode === 'lesson');

    // Modo Demo: indicador en botón (Pausa / Reanudar / Escuchar)
    if (mode === 'demo') {
      btnModeDemo.textContent = isPlayingDemo ? '⏸ Pausa' : '▶ Reanudar';
      btnModeDemo.classList.toggle('is-paused', !isPlayingDemo);
    } else {
      btnModeDemo.textContent = 'Escuchar';
      btnModeDemo.classList.remove('is-paused');
    }

    // Modo Lección Didáctica (HUD reactivo)
    if (mode === 'lesson') {
      if (lessonHudBar) lessonHudBar.classList.remove('hidden');
      if (currentLesson) {
        currentSongTitleEl.textContent = `🎓 L${currentLesson.lessonNumber}: ${currentLesson.title}`;
        if (lessonHudBadge) lessonHudBadge.textContent = `Módulo ${currentLesson.module}`;
        if (lessonHudTitle) lessonHudTitle.textContent = `L${currentLesson.lessonNumber}: ${currentLesson.title}`;
        if (lessonStep && lessonHudTip) {
          lessonHudTip.textContent = lessonStep.hint || lessonStep.instruction || 'Toca la tecla indicada con el dedo asignado';
        }
        if (lessonHudStepCounter) {
          lessonHudStepCounter.textContent = `Paso ${lessonStepIndex + 1}/${lessonTotalSteps}`;
        }
      }
    } else {
      if (lessonHudBar) lessonHudBar.classList.add('hidden');
    }

    // Fin de canción
    if (isFinished && mode === 'learn') {
      completedSongTitle.textContent = currentSong ? currentSong.title : '';
      finalScore.textContent = score;
      celebrationModal.classList.add('active');
    }
  };

  // 6b. Actualizaciones reactivas de la UI (Tempo, Octavas y Compás)
  const updateBpmUI = (bpm) => {
    if (metronomeBpmLabel) metronomeBpmLabel.textContent = `${bpm} BPM`;
    if (modalBpmValue) modalBpmValue.textContent = bpm;
    if (bpmSlider) bpmSlider.value = bpm;
  };

  const updateOctaveUI = () => {
    if (currentOctLabel && pianoKeyboard) {
      currentOctLabel.textContent = pianoKeyboard.getRangeDescription();
    }
  };

  const applySongToUI = (song) => {
    if (!song) return;
    updateBpmUI(song.bpm || 100);
    updateOctaveUI();

    // Actualizar compás dinámico en metrónomo y pentagrama
    const sig = song.timeSignature || 4;
    const denom = song.timeSignatureDenom || 4;

    document.querySelectorAll('.time-sig-btn').forEach(btn => {
      const bSig = parseInt(btn.dataset.sig);
      const bDenom = parseInt(btn.dataset.denom) || 4;
      btn.classList.toggle('active', bSig === sig && bDenom === denom);
    });

    updateBeatDots(sig);

    if (staffVisualizer && staffVisualizer.setTimeSignature) {
      staffVisualizer.setTimeSignature(sig, denom);
    }
  };

  // Sincronizar canción inicial
  gameEngine.setSong(songManager.currentSongId);
  applySongToUI(songManager.getCurrentSong());

  // 7. Modos de Juego (Libre, Guiado, Demo, Lecciones)
  const modeButtons = [
    { btn: btnModeFree, mode: 'free' },
    { btn: btnModeLearn, mode: 'learn' },
    { btn: btnModeDemo, mode: 'demo' },
    { btn: btnModeLesson, mode: 'lesson' }
  ];

  modeButtons.forEach(({ btn, mode }) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      unlockAudio();
      if (mode === 'demo' && gameEngine.mode === 'demo') {
        gameEngine.toggleDemoPause();
        return;
      }
      if (mode === 'lesson') {
        openLessonsModal();
        return;
      }
      modeButtons.forEach(b => b.btn && b.btn.classList.remove('active'));
      btn.classList.add('active');
      gameEngine.setMode(mode);
    });
  });

  // --- LÓGICA DEL CURRÍCULO DE LECCIONES ---
  let activeModuleFilter = 0; // 0 = todos los módulos

  const renderLessonsModal = () => {
    if (!moduleTabsContainer || !lessonsListContainer) return;
    const modules = lessonManager.getModules();

    // 1. Pestañas de módulos
    let tabsHtml = `<button class="module-tab-btn ${activeModuleFilter === 0 ? 'active' : ''}" data-mod="0">Todos los Módulos (15)</button>`;
    modules.forEach(m => {
      tabsHtml += `<button class="module-tab-btn ${activeModuleFilter === m.id ? 'active' : ''}" data-mod="${m.id}">Módulo ${m.id}</button>`;
    });
    moduleTabsContainer.innerHTML = tabsHtml;

    moduleTabsContainer.querySelectorAll('.module-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeModuleFilter = parseInt(btn.dataset.mod);
        renderLessonsModal();
      });
    });

    // 2. Tarjetas de lecciones por módulo
    let listHtml = '';
    const filteredModules = activeModuleFilter === 0
      ? modules
      : modules.filter(m => m.id === activeModuleFilter);

    filteredModules.forEach(mod => {
      listHtml += `
        <div class="module-section">
          <div class="module-section-header">
            <span>📖 ${mod.title}</span>
          </div>
          <div class="lessons-grid">
      `;

      mod.lessons.forEach(l => {
        const isCurrent = lessonManager.currentLessonId === l.id && gameEngine.mode === 'lesson';
        const starsStr = l.progress.completed ? '⭐'.repeat(l.progress.stars || 1) : (l.isUnlocked ? '☆☆☆' : '🔒 Bloqueada');
        const badgeNum = l.lessonNumber < 10 ? `0${l.lessonNumber}` : l.lessonNumber;

        listHtml += `
          <div class="lesson-card ${isCurrent ? 'is-active' : ''} ${!l.isUnlocked ? 'is-locked' : ''}">
            <div class="lesson-card-top">
              <span class="lesson-num-badge">Lección ${badgeNum}</span>
              <span class="lesson-stars">${starsStr}</span>
            </div>
            <div class="lesson-card-title">${l.title}</div>
            <div class="lesson-card-subtitle">${l.subtitle}</div>
            <div class="lesson-card-bottom">
              <span style="font-size: 0.72rem; color: var(--accent-cyan);">⏱️ ${l.tempo} BPM</span>
              ${l.isUnlocked ? `
                <button class="btn-start-lesson" data-lesson-id="${l.id}">
                  ${l.progress.completed ? 'Repasar' : 'Comenzar'} ➔
                </button>
              ` : `
                <span style="font-size: 0.75rem; color: var(--text-muted);">🔒 Requiere anterior</span>
              `}
            </div>
          </div>
        `;
      });

      listHtml += `
          </div>
        </div>
      `;
    });

    lessonsListContainer.innerHTML = listHtml;

    lessonsListContainer.querySelectorAll('.btn-start-lesson').forEach(btn => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.lessonId;
        startLessonById(lid);
        lessonsModal.classList.remove('active');
      });
    });
  };

  const openLessonsModal = () => {
    renderLessonsModal();
    lessonsModal.classList.add('active');
  };

  const startLessonById = (lessonId) => {
    unlockAudio();
    modeButtons.forEach(b => b.btn && b.btn.classList.remove('active'));
    if (btnModeLesson) btnModeLesson.classList.add('active');
    gameEngine.setMode('lesson');
    gameEngine.setLesson(lessonId);
  };

  // Fin de Lección (Evaluador pedagógico)
  lessonValidator.onLessonCompleted = ({ lessonId, title, stars, score, mistakes }) => {
    lessonManager.saveLessonCompletion(lessonId, stars, score);
    if (completedLessonTitle) completedLessonTitle.textContent = title;
    if (lessonCompleteStars) lessonCompleteStars.textContent = '⭐'.repeat(stars);
    if (lessonFinalScore) lessonFinalScore.textContent = score;
    if (lessonFinalMistakes) lessonFinalMistakes.textContent = mistakes;
    if (lessonCompleteModal) lessonCompleteModal.classList.add('active');
  };

  if (btnReplayLesson) {
    btnReplayLesson.addEventListener('click', () => {
      lessonCompleteModal.classList.remove('active');
      const cur = lessonManager.getCurrentLesson();
      if (cur) startLessonById(cur.id);
    });
  }

  if (btnNextLesson) {
    btnNextLesson.addEventListener('click', () => {
      lessonCompleteModal.classList.remove('active');
      const cur = lessonManager.getCurrentLesson();
      if (cur) {
        const nextId = lessonManager.getNextLessonId(cur.id);
        if (nextId) {
          startLessonById(nextId);
        } else {
          openLessonsModal();
        }
      }
    });
  }

  if (btnOpenLessonsModal) {
    btnOpenLessonsModal.addEventListener('click', () => {
      openLessonsModal();
    });
  }

  if (btnLessonPrevStep) {
    btnLessonPrevStep.addEventListener('click', () => {
      lessonValidator.rewindStep();
      gameEngine._notifyState();
    });
  }

  if (btnLessonNextStep) {
    btnLessonNextStep.addEventListener('click', () => {
      lessonValidator.skipStep();
      gameEngine._notifyState();
    });
  }

  // Botón Rebobinar (⏮️ Retroceder 4 pasos / 1 compás)
  if (btnRewind) {
    btnRewind.addEventListener('click', () => {
      unlockAudio();
      gameEngine.rewind(4);
      btnRewind.classList.add('pulse');
      setTimeout(() => btnRewind.classList.remove('pulse'), 150);
    });
  }

  // 7b. Selector de Manos Pedagógico (Ambas 🤚✋, Solo Derecha 🤚, Solo Izquierda ✋)
  const handButtons = document.querySelectorAll('.hand-btn');
  handButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      unlockAudio();
      handButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const hand = btn.dataset.hand;
      gameEngine.setPracticeHand(hand);
    });
  });

  // 8. Control del Metrónomo

  btnMetronome.addEventListener('click', () => {
    metronomeModal.classList.add('active');
  });

  btnToggleMetronomePlay.addEventListener('click', () => {
    unlockAudio();
    const playing = metronome.toggle();
    btnToggleMetronomePlay.textContent = playing ? '⏸ Detener' : '▶ Iniciar';
    btnToggleMetronomePlay.style.background = playing ? 'var(--accent-rose)' : 'var(--accent-gold)';
    btnMetronome.classList.toggle('active', playing);
  });

  bpmSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    metronome.setBpm(val);
    updateBpmUI(val);
  });

  btnBpmMinus.addEventListener('click', () => {
    metronome.setBpm(metronome.bpm - 2);
    updateBpmUI(metronome.bpm);
  });

  btnBpmPlus.addEventListener('click', () => {
    metronome.setBpm(metronome.bpm + 2);
    updateBpmUI(metronome.bpm);
  });

  btnTapTempo.addEventListener('click', () => {
    unlockAudio();
    const newBpm = metronome.tap();
    if (newBpm) updateBpmUI(newBpm);
  });

  document.querySelectorAll('.time-sig-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-sig-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sig = parseInt(btn.dataset.sig);
      const denom = parseInt(btn.dataset.denom) || 4;
      metronome.setTimeSignature(sig);
      updateBeatDots(sig);
      if (staffVisualizer && staffVisualizer.setTimeSignature) {
        staffVisualizer.setTimeSignature(sig, denom);
      }
    });
  });

  // 9. Pedal de Sustain
  let isSustainOn = false;
  btnSustain.addEventListener('click', () => {
    isSustainOn = !isSustainOn;
    audioEngine.setSustain(isSustainOn);
    btnSustain.classList.toggle('active', isSustainOn);
  });

  // 9b. Integración de Entrada MIDI Externa
  const midiWarningBox = document.getElementById('midiWarningBox');
  const modalMidiErrorText = document.getElementById('modalMidiErrorText');
  const btnToggleDiag = document.getElementById('btnToggleDiag');
  const midiDiagContent = document.getElementById('midiDiagContent');
  const diagArrow = document.getElementById('diagArrow');
  const diagProtocol = document.getElementById('diagProtocol');
  const diagSecure = document.getElementById('diagSecure');
  const diagApi = document.getElementById('diagApi');
  const diagDevices = document.getElementById('diagDevices');
  const diagLastErrorRow = document.getElementById('diagLastErrorRow');
  const diagLastError = document.getElementById('diagLastError');

  const updateMidiDiagnosticsUI = () => {
    const diag = midiManager.getDiagnostics();
    if (diagProtocol) diagProtocol.textContent = diag.protocol;
    if (diagSecure) {
      diagSecure.textContent = diag.isSecureContext ? '✅ Sí (Permitido)' : '❌ Inseguro (file://)';
      diagSecure.style.color = diag.isSecureContext ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    }
    if (diagApi) {
      diagApi.textContent = diag.isSupported ? '✅ Disponible' : '❌ No disponible';
      diagApi.style.color = diag.isSupported ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    }
    if (diagDevices) {
      diagDevices.textContent = diag.devicesCount > 0 ? `${diag.devicesCount} dispositivo(s)` : '0 dispositivos';
      diagDevices.style.color = diag.devicesCount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)';
    }
    if (diagLastError && diagLastErrorRow) {
      if (diag.lastError) {
        diagLastErrorRow.style.display = 'flex';
        diagLastError.textContent = diag.lastError;
      } else {
        diagLastErrorRow.style.display = 'none';
      }
    }

    if (midiWarningBox) {
      if (diag.isFileProtocol) {
        midiWarningBox.classList.remove('hidden');
        const isContent = diag.protocol === 'content:';
        midiWarningBox.innerHTML = `
          <strong>⚠️ ${isContent ? 'Abierto desde WhatsApp o visor (' + diag.protocol + ')' : 'Abierto como archivo local (' + diag.protocol + ')'}</strong><br>
          ${isContent 
            ? 'Por seguridad, Android no permite que visores de WhatsApp accedan al hardware USB/MIDI.' 
            : 'Los navegadores bloquean el acceso al teclado USB/MIDI en archivos locales.'}<br><br>
          👉 <strong>Solución para conectar tu piano en móvil:</strong><br>
          Abre este enlace HTTPS seguro en Google Chrome:<br>
          <a href="https://deep-paths-count.loca.lt" target="_blank" style="color:var(--accent-cyan); font-weight:700; text-decoration:underline;">https://deep-paths-count.loca.lt</a><br>
          <span style="font-size:0.75rem; color:var(--accent-gold);">(Clave Tunnel: <code>185.239.161.119</code>)</span>
        `;
      } else {
        midiWarningBox.classList.add('hidden');
      }
    }

    if (modalMidiErrorText) {
      if (diag.lastError && !diag.devicesCount) {
        modalMidiErrorText.classList.remove('hidden');
        modalMidiErrorText.textContent = diag.lastError;
      } else {
        modalMidiErrorText.classList.add('hidden');
      }
    }
  };

  midiManager.onNoteDown = (noteName, velocity) => {
    unlockAudio();
    gameEngine.handleNoteDown(noteName, velocity);
    pianoKeyboard.pressVisualKey(noteName);
    if (typeof updateRecordHudUI === 'function' && songManager.isRecording) {
      updateRecordHudUI();
    }
  };

  midiManager.onNoteUp = (noteName) => {
    gameEngine.handleNoteUp(noteName);
    pianoKeyboard.releaseVisualKey(noteName);
  };

  midiManager.onSustain = (isPressed) => {
    isSustainOn = isPressed;
    audioEngine.setSustain(isPressed);
    btnSustain.classList.toggle('active', isPressed);
    if (midiSustainStatus) {
      midiSustainStatus.textContent = isPressed ? 'Presionado (ON)' : 'Liberado (OFF)';
      midiSustainStatus.style.color = isPressed ? 'var(--accent-emerald)' : 'var(--accent-cyan)';
    }
  };

  midiManager.onDeviceChange = (devices, hasConnected, error) => {
    updateMidiDiagnosticsUI();

    if (!midiManager.isSupported) {
      if (midiStatusDot) midiStatusDot.className = 'midi-status-dot error';
      if (modalMidiStatusDot) modalMidiStatusDot.className = 'midi-status-dot large error';
      if (midiButtonLabel) midiButtonLabel.textContent = 'MIDI N/D';
      if (modalMidiStatusTitle) modalMidiStatusTitle.textContent = 'Web MIDI no disponible';
      if (modalMidiStatusSubtitle) modalMidiStatusSubtitle.textContent = 'Usa Google Chrome, Edge u Opera en PC o Android';
      if (btnMidi) btnMidi.classList.remove('connected');
      if (midiDeviceSelectRow) midiDeviceSelectRow.classList.add('hidden');
      return;
    }

    if (hasConnected && devices.length > 0) {
      if (btnMidi) btnMidi.classList.add('connected');
      if (midiStatusDot) midiStatusDot.className = 'midi-status-dot connected';
      if (modalMidiStatusDot) modalMidiStatusDot.className = 'midi-status-dot large connected';
      if (midiButtonLabel) midiButtonLabel.textContent = devices.length === 1 ? 'MIDI OK' : `MIDI (${devices.length})`;
      if (modalMidiStatusTitle) {
        modalMidiStatusTitle.textContent = devices.length === 1
          ? `Conectado: ${devices[0].name}`
          : `${devices.length} teclados conectados`;
      }
      if (modalMidiStatusSubtitle) {
        modalMidiStatusSubtitle.textContent = 'Listo para tocar directamente en modo libre o guiado';
      }

      if (midiDeviceSelect) {
        midiDeviceSelect.innerHTML = '<option value="all">Todos los teclados conectados</option>' +
          devices.map(d => `<option value="${d.id}">${d.name} (${d.manufacturer})</option>`).join('');
      }
      if (midiDeviceSelectRow) midiDeviceSelectRow.classList.remove('hidden');
    } else {
      if (btnMidi) btnMidi.classList.remove('connected');
      if (midiStatusDot) midiStatusDot.className = 'midi-status-dot searching';
      if (modalMidiStatusDot) modalMidiStatusDot.className = 'midi-status-dot large searching';
      if (midiButtonLabel) midiButtonLabel.textContent = 'MIDI';
      if (modalMidiStatusTitle) {
        modalMidiStatusTitle.textContent = error ? 'No se detecta teclado MIDI' : 'Buscando teclado MIDI...';
      }
      if (modalMidiStatusSubtitle) {
        modalMidiStatusSubtitle.textContent = 'Conecta el cable USB del piano. Si usas Yousician o DAWs en Windows, ciérralos.';
      }
      if (midiDeviceSelectRow) midiDeviceSelectRow.classList.add('hidden');
    }
  };

  midiManager.onActivity = (data) => {
    if (btnMidi) {
      btnMidi.classList.add('receiving');
      setTimeout(() => btnMidi.classList.remove('receiving'), 120);
    }

    if (midiModal && midiModal.classList.contains('active')) {
      if (data.noteName && midiLastNote) midiLastNote.textContent = data.noteName;
      if (data.velocity !== undefined && midiLastVelocity) midiLastVelocity.textContent = `${data.velocity}%`;
      if (data.channel && midiChannel) midiChannel.textContent = `Canal ${data.channel}`;
      if (midiActivityIndicator) {
        midiActivityIndicator.classList.add('active');
        midiActivityIndicator.textContent = data.type === 'note-on' ? 'NOTA EN VIVO' : 'RECIBIENDO';
        setTimeout(() => {
          midiActivityIndicator.classList.remove('active');
          midiActivityIndicator.textContent = 'EN ESPERA';
        }, 250);
      }
    }
  };

  // Botón MIDI en cabecera: abrir modal y pedir acceso
  if (btnMidi) {
    btnMidi.addEventListener('click', () => {
      unlockAudio();
      midiModal.classList.add('active');
      updateMidiDiagnosticsUI();
      midiManager.requestAccess(true);
    });
  }

  if (btnMidiReconnect) {
    btnMidiReconnect.addEventListener('click', () => {
      unlockAudio();
      updateMidiDiagnosticsUI();
      midiManager.requestAccess(true);
    });
  }

  if (btnToggleDiag && midiDiagContent) {
    btnToggleDiag.addEventListener('click', () => {
      const isHidden = window.getComputedStyle(midiDiagContent).display === 'none';
      midiDiagContent.style.display = isHidden ? 'flex' : 'none';
      if (diagArrow) diagArrow.textContent = isHidden ? '▾' : '▸';
    });
  }

  if (midiDeviceSelect) {
    midiDeviceSelect.addEventListener('change', (e) => {
      midiManager.selectDevice(e.target.value);
    });
  }

  if (checkMidiVelocity) {
    checkMidiVelocity.addEventListener('change', (e) => {
      midiManager.setVelocitySensitivity(e.target.checked);
    });
  }

  // Intentar inicializar Web MIDI automáticamente al cargar
  midiManager.requestAccess().catch(() => {});
  updateMidiDiagnosticsUI();

  // 10. Desplazamiento de Octavas y Modo 88 Teclas
  btnOctDown.addEventListener('click', () => {
    pianoKeyboard.shiftOctave(-1);
    updateOctaveUI();
  });

  btnOctUp.addEventListener('click', () => {
    pianoKeyboard.shiftOctave(1);
    updateOctaveUI();
  });

  // Botón alternador de 88 Teclas / Modo Adaptable
  const btn88Keys = document.getElementById('btn88Keys');
  const keys88Label = document.getElementById('keys88Label');

  if (btn88Keys) {
    btn88Keys.addEventListener('click', () => {
      unlockAudio();
      const newMode = !pianoKeyboard.is88KeysMode;
      pianoKeyboard.set88KeysMode(newMode);
      btn88Keys.classList.toggle('active', newMode);
      if (keys88Label) {
        keys88Label.textContent = newMode ? 'Adaptable' : '88 Teclas';
      }
      updateOctaveUI();
    });
  }

  // 11. Notación (Do-Re-Mi / C-D-E / Sin notas)
  const notationModes = [
    { type: 'solfege', label: 'Do Re Mi' },
    { type: 'anglo', label: 'C D E' },
    { type: 'none', label: 'Sin notas' }
  ];
  let notationIndex = 0;

  btnNotation.addEventListener('click', () => {
    notationIndex = (notationIndex + 1) % notationModes.length;
    const mode = notationModes[notationIndex];
    notationLabel.textContent = mode.label;
    pianoKeyboard.setNotation(mode.type);
    staffVisualizer.setNotation(mode.type === 'none' ? 'solfege' : mode.type);
  });

  // 12. Modal de Canciones y Gestión
  const renderSongList = () => {
    const all = songManager.getAllSongs();
    songListContainer.innerHTML = all.map(song => {
      const isCurrent = song.id === songManager.currentSongId;
      const isCustom = song.id.startsWith('custom');
      return `
        <div class="song-item${isCurrent ? ' active' : ''}" data-song-id="${song.id}">
          <div class="song-item-info">
            <div class="song-item-title">${song.title} ${isCurrent ? '✓' : ''}</div>
            <div class="song-item-meta">
              <span style="color:var(--accent-cyan); font-weight:600;">${song.category || 'Personalizada'}</span> • ${song.notes.length} notas • ${song.bpm} BPM • ${song.difficulty}
            </div>
          </div>
          <div style="display:flex; gap:6px;">
            ${isCustom ? `<button class="btn-icon btn-delete-song" data-del-id="${song.id}" style="width:28px; height:28px;" title="Eliminar">🗑️</button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Selección de canción
    songListContainer.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-song')) return;
        const songId = item.dataset.songId;
        gameEngine.setSong(songId);
        applySongToUI(songManager.getCurrentSong());
        songModal.classList.remove('active');
      });
    });

    // Eliminar canción personalizada
    songListContainer.querySelectorAll('.btn-delete-song').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.delId;
        if (confirm('¿Eliminar esta canción?')) {
          songManager.deleteCustomSong(id);
          renderSongList();
        }
      });
    });
  };

  const openSongModal = () => {
    renderSongList();
    songModal.classList.add('active');
  };

  btnSelectSong.addEventListener('click', openSongModal);
  btnSongManager.addEventListener('click', openSongModal);

  // Pestañas del modal de canciones
  document.querySelectorAll('.import-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.import-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.remove('hidden');
    });
  });

  // Importar archivos (.mid / .midi / .json)
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let importedSong = null;
      if (file.name.endsWith('.json')) {
        importedSong = await songManager.loadFromJsonFile(file);
      } else if (file.name.endsWith('.mid') || file.name.endsWith('.midi')) {
        importedSong = await songManager.loadFromMidiFile(file);
      } else {
        alert('Formato no soportado. Selecciona un archivo .mid, .midi o .json');
        return;
      }

      gameEngine.setSong(importedSong.id);
      applySongToUI(importedSong);
      songModal.classList.remove('active');
      const timeSigInfo = importedSong.timeSignatureFromMidi
        ? `Compás detectado del MIDI: ${importedSong.timeSignature}/${importedSong.timeSignatureDenom}`
        : `Compás: ${importedSong.timeSignature}/${importedSong.timeSignatureDenom}`;
      alert(`¡Canción "${importedSong.title}" cargada con éxito! (${importedSong.notes.length} notas). ${timeSigInfo}`);
    } catch (err) {
      alert('Error al procesar el archivo: ' + err.message);
    }
  });

  // Importar desde texto
  const btnImportText = document.getElementById('btnImportText');
  const textSongTitle = document.getElementById('textSongTitle');
  const textSongNotes = document.getElementById('textSongNotes');

  btnImportText.addEventListener('click', () => {
    try {
      const title = textSongTitle.value.trim() || 'Melodía Escrita';
      const notesStr = textSongNotes.value.trim();
      const newSong = songManager.importFromText(title, notesStr);
      gameEngine.setSong(newSong.id);
      applySongToUI(newSong);
      songModal.classList.remove('active');
      textSongTitle.value = '';
      textSongNotes.value = '';
      alert(`¡Canción "${newSong.title}" creada con éxito!`);
    } catch (err) {
      alert(err.message);
    }
  });

  // 12c. Explorador Online de 113.000 Melodías (BitMidi)
  const onlineSearchInput = document.getElementById('onlineSearchInput');
  const btnOnlineSearch = document.getElementById('btnOnlineSearch');
  const onlineSearchStatus = document.getElementById('onlineSearchStatus');
  const onlineResultsContainer = document.getElementById('onlineResultsContainer');
  const onlinePaginationRow = document.getElementById('onlinePaginationRow');
  const btnOnlinePrevPage = document.getElementById('btnOnlinePrevPage');
  const btnOnlineNextPage = document.getElementById('btnOnlineNextPage');
  const onlinePageIndicator = document.getElementById('onlinePageIndicator');

  let currentOnlineQuery = '';
  let currentOnlinePage = 0;
  let totalOnlinePages = 0;
  let searchDebounceTimer = null;

  const performOnlineSearch = async (query, page = 0) => {
    const q = (query || '').trim();
    if (!q) {
      onlineSearchStatus.textContent = 'Escribe el nombre de una canción o pulsa una sugerencia.';
      onlineResultsContainer.innerHTML = '';
      onlinePaginationRow.classList.add('hidden');
      return;
    }

    currentOnlineQuery = q;
    currentOnlinePage = page;
    onlineSearchStatus.innerHTML = `<span style="color:var(--accent-cyan);">⏳ Buscando "${q}" entre 113.000 melodías...</span>`;
    onlineResultsContainer.innerHTML = '';
    onlinePaginationRow.classList.add('hidden');

    try {
      const data = await onlineSongService.search(q, page, 15);
      totalOnlinePages = data.pageTotal || 1;

      if (!data.results || data.results.length === 0) {
        onlineSearchStatus.textContent = `No se encontraron canciones para "${q}". Prueba con otro término.`;
        return;
      }

      onlineSearchStatus.textContent = `Se encontraron ${data.total} melodías para "${q}":`;

      onlineResultsContainer.innerHTML = data.results.map(item => `
        <div class="online-song-item" data-id="${item.id}">
          <div class="online-song-info">
            <div class="online-song-title" title="${item.rawTitle}">${item.title}</div>
            <div class="online-song-meta">
              <span>MIDI</span>
              ${item.plays ? `<span>• ${item.plays.toLocaleString()} descargas</span>` : ''}
            </div>
          </div>
          <button class="btn-download-song" data-url="${item.downloadUrl}" data-title="${item.title}">
            📥 Tocar
          </button>
        </div>
      `).join('');

      // Conectar botones de descarga directa
      onlineResultsContainer.querySelectorAll('.btn-download-song').forEach(btn => {
        btn.addEventListener('click', async () => {
          const downloadUrl = btn.dataset.url;
          const title = btn.dataset.title;

          const originalText = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '⏳ Descargando...';

          try {
            unlockAudio();
            const buffer = await onlineSongService.downloadMidi(downloadUrl);
            const loadedSong = songManager.loadFromOnlineBuffer(buffer, title);

            gameEngine.setSong(loadedSong.id);
            applySongToUI(loadedSong);

            // Cerrar modal automáticamente y cargar la canción en modo guiado
            songModal.classList.remove('active');
            modeButtons.forEach(b => b.btn.classList.remove('active'));
            btnModeLearn.classList.add('active');
            gameEngine.setMode('learn');

            const timeSigInfo = loadedSong.timeSignatureFromMidi
              ? `Compás detectado del MIDI: ${loadedSong.timeSignature}/${loadedSong.timeSignatureDenom}`
              : `Compás: ${loadedSong.timeSignature}/${loadedSong.timeSignatureDenom}`;

            alert(`🎉 ¡Canción "${loadedSong.title}" (${loadedSong.notes.length} notas) descargada con éxito! ${timeSigInfo}. Ya puedes tocarla en el piano.`);
          } catch (err) {
            alert(`Error al descargar o procesar la canción: ${err.message}`);
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
        });
      });

      // Paginación
      if (totalOnlinePages > 1) {
        onlinePaginationRow.classList.remove('hidden');
        onlinePageIndicator.textContent = `Página ${page + 1} de ${totalOnlinePages}`;
        btnOnlinePrevPage.disabled = page <= 0;
        btnOnlineNextPage.disabled = page >= totalOnlinePages - 1;
      } else {
        onlinePaginationRow.classList.add('hidden');
      }

    } catch (err) {
      onlineSearchStatus.innerHTML = `<span style="color:var(--accent-rose);">❌ ${err.message}</span>`;
    }
  };

  if (btnOnlineSearch && onlineSearchInput) {
    btnOnlineSearch.addEventListener('click', () => {
      performOnlineSearch(onlineSearchInput.value, 0);
    });

    onlineSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performOnlineSearch(onlineSearchInput.value, 0);
      }
    });

    onlineSearchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      const val = e.target.value.trim();
      if (val.length >= 3) {
        searchDebounceTimer = setTimeout(() => {
          performOnlineSearch(val, 0);
        }, 450);
      }
    });
  }

  // Chips de búsqueda rápida sugerida
  document.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (onlineSearchInput) onlineSearchInput.value = q;
      performOnlineSearch(q, 0);
    });
  });

  if (btnOnlinePrevPage) {
    btnOnlinePrevPage.addEventListener('click', () => {
      if (currentOnlinePage > 0) {
        performOnlineSearch(currentOnlineQuery, currentOnlinePage - 1);
      }
    });
  }

  if (btnOnlineNextPage) {
    btnOnlineNextPage.addEventListener('click', () => {
      if (currentOnlinePage < totalOnlinePages - 1) {
        performOnlineSearch(currentOnlineQuery, currentOnlinePage + 1);
      }
    });
  }

  // 12b. Grabadora en Vivo con HUD Flotante sobre el Piano
  const btnStartRecord = document.getElementById('btnStartRecord');
  const btnStopRecord = document.getElementById('btnStopRecord');
  const recordStatusIndicator = document.getElementById('recordStatusIndicator');

  const recordingHudBar = document.getElementById('recordingHudBar');
  const recordingHudInfo = document.getElementById('recordingHudInfo');
  const recordingTimer = document.getElementById('recordingTimer');
  const btnStopRecordHud = document.getElementById('btnStopRecordHud');
  const btnCancelRecordHud = document.getElementById('btnCancelRecordHud');
  const btnQuickRecord = document.getElementById('btnQuickRecord');

  let recordTimerInterval = null;
  let recordSeconds = 0;

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const updateRecordHudUI = () => {
    if (!recordingHudInfo) return;
    const count = songManager.getRecordedCount();
    recordingHudInfo.textContent = `${count} nota${count === 1 ? '' : 's'}`;
  };

  const startLiveRecording = () => {
    unlockAudio();
    songManager.startRecording();

    // 1. Salir automáticamente al piano para que el usuario pueda tocar inmediatamente sin diálogos
    songModal.classList.remove('active');

    // 2. Mostrar la barra flotante de grabación
    if (recordingHudBar) recordingHudBar.classList.remove('hidden');
    if (gameStatsOverlay) gameStatsOverlay.classList.add('hidden');

    recordSeconds = 0;
    if (recordingTimer) recordingTimer.textContent = '00:00';
    updateRecordHudUI();

    if (recordTimerInterval) clearInterval(recordTimerInterval);
    recordTimerInterval = setInterval(() => {
      recordSeconds++;
      if (recordingTimer) recordingTimer.textContent = formatTimer(recordSeconds);
    }, 1000);

    if (btnStartRecord) btnStartRecord.disabled = true;
    if (btnStopRecord) btnStopRecord.disabled = false;
    if (recordStatusIndicator) {
      recordStatusIndicator.textContent = '🔴 Grabando en vivo en el piano...';
      recordStatusIndicator.style.color = 'var(--accent-rose)';
    }
  };

  const stopAndSaveRecording = () => {
    if (recordTimerInterval) {
      clearInterval(recordTimerInterval);
      recordTimerInterval = null;
    }
    if (recordingHudBar) recordingHudBar.classList.add('hidden');

    const count = songManager.getRecordedCount();
    if (count === 0) {
      songManager.cancelRecording();
      alert('No se tocó ninguna nota durante la grabación.');
      if (btnStartRecord) btnStartRecord.disabled = false;
      if (btnStopRecord) btnStopRecord.disabled = true;
      return;
    }

    const title = prompt(`¡Has tocado ${count} notas! Nombre para tu canción:`, `Mi Melodía ${songManager.customSongs.length + 1}`);
    const recordedSong = songManager.stopRecording(title || 'Mi Melodía');

    if (btnStartRecord) btnStartRecord.disabled = false;
    if (btnStopRecord) btnStopRecord.disabled = true;
    if (recordStatusIndicator) {
      recordStatusIndicator.textContent = 'Grabación finalizada y guardada.';
      recordStatusIndicator.style.color = 'var(--accent-emerald)';
    }

    if (recordedSong) {
      gameEngine.setSong(recordedSong.id);
      modeButtons.forEach(b => b.btn.classList.remove('active'));
      btnModeLearn.classList.add('active');
      gameEngine.setMode('learn');
      alert(`🎉 ¡Canción "${recordedSong.title}" (${recordedSong.notes.length} notas) guardada con éxito! Ya puedes tocarla en Modo Guiado.`);
    }
  };

  const cancelRecording = () => {
    if (recordTimerInterval) {
      clearInterval(recordTimerInterval);
      recordTimerInterval = null;
    }
    if (recordingHudBar) recordingHudBar.classList.add('hidden');
    songManager.cancelRecording();

    if (btnStartRecord) btnStartRecord.disabled = false;
    if (btnStopRecord) btnStopRecord.disabled = true;
    if (recordStatusIndicator) {
      recordStatusIndicator.textContent = 'Grabación descartada.';
      recordStatusIndicator.style.color = 'var(--text-muted)';
    }
  };

  if (btnQuickRecord) btnQuickRecord.addEventListener('click', startLiveRecording);
  if (btnStartRecord) btnStartRecord.addEventListener('click', startLiveRecording);
  if (btnStopRecordHud) btnStopRecordHud.addEventListener('click', stopAndSaveRecording);
  if (btnStopRecord) btnStopRecord.addEventListener('click', stopAndSaveRecording);
  if (btnCancelRecordHud) btnCancelRecordHud.addEventListener('click', cancelRecording);

  // 13. Modal de Celebración
  btnReplaySong.addEventListener('click', () => {
    celebrationModal.classList.remove('active');
    gameEngine.restart();
  });

  btnNextSong.addEventListener('click', () => {
    celebrationModal.classList.remove('active');
    const all = songManager.getAllSongs();
    const currentIndex = all.findIndex(s => s.id === songManager.currentSongId);
    const nextIndex = (currentIndex + 1) % all.length;
    gameEngine.setSong(all[nextIndex].id);
    gameEngine.setMode('learn');
  });

  // Cierre genérico de modales al pulsar 'X' o fuera
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // 14. Pantalla Completa & Rotación
  btnFullscreen.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          try { await screen.orientation.lock('landscape'); } catch (e) {}
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Pantalla completa no disponible:', e);
    }
  });

  btnDismissRotate.addEventListener('click', () => {
    rotateDeviceOverlay.style.display = 'none';
  });
});
