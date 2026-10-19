/* ==========================================================================
   IMPOSTOR - Rules & How to Play Modal
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class RulesModal {
  static render() {
    const existing = document.getElementById('rules-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'rules-modal';
    modal.className = 'modal-backdrop';

    modal.innerHTML = `
      <div class="modal-card anim-card-flip">
        <div class="modal-header">
          <h2 class="modal-title font-heading">¿Cómo jugar a Impostor?</h2>
          <button id="close-rules-btn" class="icon-btn" aria-label="Cerrar">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">
          <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--crimson);">
            <strong style="color: #fff;">🎭 Dinámica y Roles:</strong>
            <p style="margin-top: 4px;">• <strong style="color: var(--cyan);">Civiles:</strong> Reciben la misma palabra secreta (ej. <em>Playa</em>).</p>
            <p style="margin-top: 4px;">• <strong style="color: var(--crimson);">Impostor (Modo Clásico):</strong> No recibe palabra. Solo sabe que es el impostor y debe camuflarse.</p>
            <p style="margin-top: 4px;">• <strong style="color: var(--amber);">Impostor (Modo Trampa):</strong> Recibe una palabra similar (ej. <em>Piscina</em>) sin saber si es el impostor o un civil.</p>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--cyan);">
            <strong style="color: #fff;">🔄 Fases de la Partida:</strong>
            <p style="margin-top: 6px;"><strong>1. Revelación Secreta:</strong> Pasa el dispositivo. Mantén pulsado el botón para ver tu palabra y suelta para ocultarla antes de pasar al siguiente.</p>
            <p style="margin-top: 6px;"><strong>2. Rondas de Pistas:</strong> La app indica el orden de turnos. Cada jugador dice una palabra o frase corta relacionada. ¡No seas demasiado obvio!</p>
            <p style="margin-top: 6px;"><strong>3. Debate y Votación:</strong> Discutid con el temporizador quién parece sospechoso y votad en pantalla para expulsarlo.</p>
            <p style="margin-top: 6px;"><strong>4. Última Oportunidad:</strong> Si el impostor es descubierto, tiene un último intento para adivinar la palabra de los civiles. ¡Si acierta, gana él!</p>
          </div>
        </div>

        <button id="understood-btn" class="btn btn-primary" style="margin-top: 6px;">
          ¡Entendido, a jugar!
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      sound.playTap();
      modal.remove();
    };

    modal.querySelector('#close-rules-btn').addEventListener('click', closeModal);
    modal.querySelector('#understood-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}
