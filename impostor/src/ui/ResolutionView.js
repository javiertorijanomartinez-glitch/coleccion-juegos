/* ==========================================================================
   IMPOSTOR - Resolution View (Dramatic Identity Reveal)
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class ResolutionView {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    const eliminated = this.engine.eliminatedPlayer;
    const isImpostor = eliminated?.isImpostor;

    const remainingCivilians = this.engine.players.filter(p => !p.isImpostor && !p.isEliminated);
    const remainingImpostors = this.engine.players.filter(p => p.isImpostor && !p.isEliminated);
    const canContinueGame = !isImpostor && remainingCivilians.length > remainingImpostors.length;

    container.innerHTML = `
      <div class="view-container anim-fade-in-up" style="justify-content: center; text-align: center;">
        
        <!-- Dramatic Reveal Card -->
        <div class="glass-card anim-card-flip" style="padding: 36px 20px; border: 2px solid ${isImpostor ? 'var(--crimson)' : 'var(--cyan)'}; box-shadow: 0 0 35px ${isImpostor ? 'var(--crimson-glow)' : 'var(--cyan-glow)'};">
          
          <div style="width: 80px; height: 80px; border-radius: var(--radius-full); background: ${eliminated.color}; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900; color: #fff;">
            ${eliminated.name.charAt(0).toUpperCase()}
          </div>

          <h3 style="color: var(--text-muted); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em;">
            El grupo ha expulsado a:
          </h3>
          <h2 class="font-heading" style="font-size: 2.2rem; color: #fff; margin: 4px 0 16px;">
            ${eliminated.name}
          </h2>

          <!-- Reveal Identity -->
          ${isImpostor ? `
            <div style="background: rgba(255, 45, 85, 0.2); border: 1.5px solid var(--crimson); border-radius: var(--radius-md); padding: 18px; margin-top: 12px;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 6px;">🎭</span>
              <h3 class="font-heading" style="font-size: 1.8rem; color: #ff3366;">
                ¡ERA EL IMPOSTOR!
              </h3>
              <p style="font-size: 0.9rem; color: #fff; margin-top: 6px; line-height: 1.4;">
                ¡Buen trabajo! Habéis desenmascarado al impostor. Pero las reglas le conceden una <strong>última oportunidad</strong> para adivinar la palabra secreta de los civiles...
              </p>
            </div>
          ` : `
            <div style="background: rgba(0, 242, 254, 0.15); border: 1.5px solid var(--cyan); border-radius: var(--radius-md); padding: 18px; margin-top: 12px;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 6px;">🛡️</span>
              <h3 class="font-heading" style="font-size: 1.8rem; color: var(--cyan);">
                ¡ERA UN INOCENTE CIVIL!
              </h3>
              <p style="font-size: 0.9rem; color: #fff; margin-top: 6px; line-height: 1.4;">
                ¡El grupo se ha equivocado! El verdadero impostor sigue libre entre vosotros.
              </p>
            </div>
          `}
        </div>

        <!-- Next Actions -->
        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
          ${isImpostor ? `
            <button id="impostor-guess-btn" class="btn btn-primary anim-pulse-glow" style="font-size: 1.1rem;">
              🎯 Última Oportunidad del Impostor
            </button>
          ` : canContinueGame ? `
            <button id="continue-round-btn" class="btn btn-primary">
              Continuar Partida (Siguiente Ronda de Pistas)
            </button>
            <button id="end-impostor-win-btn" class="btn btn-ghost btn-sm">
              Declarar Victoria del Impostor
            </button>
          ` : `
            <button id="end-game-btn" class="btn btn-primary">
              Ver Resultados Finales
            </button>
          `}
        </div>

      </div>
    `;

    this.bindEvents(container, isImpostor, canContinueGame);
  }

  bindEvents(container, isImpostor, canContinueGame) {
    if (isImpostor) {
      container.querySelector('#impostor-guess-btn')?.addEventListener('click', () => {
        sound.playTap();
        this.engine.triggerImpostorGuess();
      });
    } else if (canContinueGame) {
      container.querySelector('#continue-round-btn')?.addEventListener('click', () => {
        sound.playTap();
        this.engine.continueAfterCivilianEliminated();
      });
      container.querySelector('#end-impostor-win-btn')?.addEventListener('click', () => {
        sound.playDefeat();
        this.engine.endGameWithImpostorVictory('Los civiles eliminaron a un inocente y acordaron finalizar la partida.');
      });
    } else {
      container.querySelector('#end-game-btn')?.addEventListener('click', () => {
        sound.playDefeat();
        this.engine.continueAfterCivilianEliminated();
      });
    }
  }
}
