/* ==========================================================================
   IMPOSTOR - Guess View (Impostor's Last Chance to Deduce Secret Word)
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class GuessView {
  constructor(engine) {
    this.engine = engine;
    this.hasFailed = false;
  }

  render(container) {
    const impostor = this.engine.eliminatedPlayer;

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 45, 85, 0.2); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--crimson); margin-bottom: 10px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: #ff5277; text-transform: uppercase;">
              🎯 Última Oportunidad
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.8rem; color: #fff;">
            ¿Cuál era la palabra secreta?
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 320px; margin: 6px auto 0; line-height: 1.4;">
            <strong style="color: ${impostor.color};">${impostor.name}</strong>, si adivinas la palabra exacta de los civiles tras escuchar sus pistas, <strong>¡ganas la partida!</strong>
          </p>
        </div>

        <!-- Input Card -->
        <div class="glass-card" style="padding: 24px 18px; margin: auto 0; display: flex; flex-direction: column; gap: 16px;">
          <div class="input-group">
            <label class="input-label" style="font-size: 0.9rem;">
              Escribe la palabra secreta de los civiles:
            </label>
            <input type="text" id="guess-input" class="text-input" placeholder="Ej. Playa..." style="font-size: 1.2rem; font-weight: 700; text-align: center; padding: 14px;" autocomplete="off" autofocus />
          </div>

          <div id="guess-feedback" style="display: ${this.hasFailed ? 'block' : 'none'}; text-align: center; color: var(--crimson); font-size: 0.9rem; font-weight: 700;">
            ❌ Palabra incorrecta. ¡No era esa!
          </div>

          <button id="submit-guess-btn" class="btn btn-primary" style="font-size: 1.1rem;">
            Comprobar Palabra
          </button>
        </div>

        <!-- Secondary Option: Give Up -->
        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
          <button id="give-up-btn" class="btn btn-ghost">
            No la sé / Rendirme
          </button>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const input = container.querySelector('#guess-input');
    const submitBtn = container.querySelector('#submit-guess-btn');
    const giveUpBtn = container.querySelector('#give-up-btn');
    const feedback = container.querySelector('#guess-feedback');

    const handleGuess = () => {
      const val = input.value.trim();
      if (!val) {
        input.focus();
        return;
      }

      const isCorrect = this.engine.evaluateGuess(val);
      if (isCorrect) {
        sound.playVictory();
      } else {
        sound.playDefeat();
        this.hasFailed = true;
        feedback.style.display = 'block';
        setTimeout(() => {
          // If word was incorrect, engine already checked remaining impostors or civilian victory
        }, 800);
      }
    };

    submitBtn.addEventListener('click', () => {
      sound.playTap();
      handleGuess();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleGuess();
      }
    });

    giveUpBtn.addEventListener('click', () => {
      sound.playDefeat();
      this.engine.impostorGivesUp();
    });
  }
}
