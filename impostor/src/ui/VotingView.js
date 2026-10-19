/* ==========================================================================
   IMPOSTOR - Voting View (On-Screen Suspect Selection & Elimination)
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class VotingView {
  constructor(engine) {
    this.engine = engine;
    this.selectedId = null;
    this.voteCounts = {};
  }

  render(container) {
    const activePlayers = this.engine.getActivePlayers();
    
    // Initialize votes map
    activePlayers.forEach(p => {
      if (!(p.id in this.voteCounts)) {
        this.voteCounts[p.id] = 0;
      }
    });

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 45, 85, 0.15); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--crimson); margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: var(--crimson); text-transform: uppercase;">
              🗳️ Votación Grupal
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.7rem; color: #fff;">
            ¿A quién queréis expulsar?
          </h2>
          <p style="font-size: 0.86rem; color: var(--text-muted); margin-top: 4px;">
            Tocad sobre el jugador sospechoso para seleccionarlo
          </p>
        </div>

        <!-- Suspects Grid -->
        <div class="suspects-grid" id="suspects-grid">
          ${activePlayers.map(p => `
            <div class="suspect-card ${this.selectedId === p.id ? 'selected' : ''}" data-player-id="${p.id}">
              <div class="suspect-avatar" style="background: ${p.color};">
                ${p.name.charAt(0).toUpperCase()}
              </div>
              <span class="suspect-name">${p.name}</span>
              
              <!-- Quick Vote Tally Pill -->
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
                <button class="icon-btn vote-add-btn" data-vote-id="${p.id}" style="width: 28px; height: 28px; font-size: 0.8rem; font-weight: 800;" title="Añadir voto">
                  +1
                </button>
                <span class="vote-count-label" data-label-id="${p.id}" style="font-size: 0.82rem; font-weight: 700; color: ${this.voteCounts[p.id] > 0 ? 'var(--crimson)' : 'var(--text-subtle)'};">
                  ${this.voteCounts[p.id]} votos
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Action Section -->
        <div style="margin-top: auto; padding-top: 16px; display: flex; flex-direction: column; gap: 10px;">
          <button id="eliminate-btn" class="btn btn-primary" ${!this.selectedId ? 'disabled' : ''} style="font-size: 1.1rem;">
            ${this.selectedId ? `Expulsar a ${activePlayers.find(p => p.id === this.selectedId)?.name}` : 'Selecciona un sospechoso'}
          </button>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const activePlayers = this.engine.getActivePlayers();
    const eliminateBtn = container.querySelector('#eliminate-btn');

    // Suspect card selection
    container.querySelectorAll('.suspect-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking +1 vote button, ignore card selection
        if (e.target.closest('.vote-add-btn')) return;

        sound.playTap();
        const playerId = parseInt(card.getAttribute('data-player-id'), 10);
        this.selectedId = playerId;
        this.engine.selectSuspect(playerId);

        container.querySelectorAll('.suspect-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const chosen = activePlayers.find(p => p.id === playerId);
        eliminateBtn.removeAttribute('disabled');
        eliminateBtn.textContent = `Expulsar a ${chosen?.name}`;
      });
    });

    // Vote +1 buttons
    container.querySelectorAll('.vote-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playTap();
        const id = parseInt(btn.getAttribute('data-vote-id'), 10);
        this.voteCounts[id] = (this.voteCounts[id] || 0) + 1;
        
        // Auto select player with most votes
        let maxVotes = 0;
        let topSuspectId = null;
        Object.entries(this.voteCounts).forEach(([pId, v]) => {
          if (v > maxVotes) {
            maxVotes = v;
            topSuspectId = parseInt(pId, 10);
          }
        });

        if (topSuspectId) {
          this.selectedId = topSuspectId;
          this.engine.selectSuspect(topSuspectId);
          container.querySelectorAll('.suspect-card').forEach(c => {
            c.classList.toggle('selected', parseInt(c.getAttribute('data-player-id'), 10) === topSuspectId);
          });
          const chosen = activePlayers.find(p => p.id === topSuspectId);
          eliminateBtn.removeAttribute('disabled');
          eliminateBtn.textContent = `Expulsar a ${chosen?.name} (${maxVotes} votos)`;
        }

        // Update vote label
        const label = container.querySelector(`[data-label-id="${id}"]`);
        if (label) {
          label.textContent = `${this.voteCounts[id]} votos`;
          label.style.color = 'var(--crimson)';
        }
      });
    });

    // Eliminate confirmation
    eliminateBtn.addEventListener('click', () => {
      if (!this.selectedId) return;
      sound.playGong();
      this.engine.confirmElimination(this.selectedId);
    });
  }
}
