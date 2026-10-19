(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const S=[{id:"all",name:"Todas las categorías",icon:"✨"},{id:"lugares",name:"Lugares",icon:"🏖️"},{id:"comida",name:"Comida & Bebida",icon:"🍕"},{id:"objetos",name:"Objetos",icon:"🎒"},{id:"animales",name:"Animales",icon:"🦁"},{id:"ocio",name:"Cine, Deportes & Ocio",icon:"🎬"},{id:"custom",name:"Personalizadas",icon:"✍️"}],f=[{civil:"Playa",impostor:"Piscina",category:"lugares"},{civil:"Aeropuerto",impostor:"Estación de tren",category:"lugares"},{civil:"Hospital",impostor:"Centro de salud",category:"lugares"},{civil:"Cine",impostor:"Teatro",category:"lugares"},{civil:"Hotel",impostor:"Hostal",category:"lugares"},{civil:"Gimnasio",impostor:"Spa",category:"lugares"},{civil:"Museo",impostor:"Biblioteca",category:"lugares"},{civil:"Selva",impostor:"Bosque",category:"lugares"},{civil:"Restaurante",impostor:"Cafetería",category:"lugares"},{civil:"Castillo",impostor:"Palacio",category:"lugares"},{civil:"Parque de atracciones",impostor:"Circo",category:"lugares"},{civil:"Desierto",impostor:"Playa",category:"lugares"},{civil:"Pizza",impostor:"Hamburguesa",category:"comida"},{civil:"Café",impostor:"Té",category:"comida"},{civil:"Manzana",impostor:"Pera",category:"comida"},{civil:"Helado",impostor:"Yogur helado",category:"comida"},{civil:"Tacos",impostor:"Burritos",category:"comida"},{civil:"Paella",impostor:"Risotto",category:"comida"},{civil:"Chocolate",impostor:"Turrón",category:"comida"},{civil:"Cerveza",impostor:"Vino",category:"comida"},{civil:"Sushi",impostor:"Sashimi",category:"comida"},{civil:"Naranja",impostor:"Mandarina",category:"comida"},{civil:"Queso",impostor:"Mantequilla",category:"comida"},{civil:"Galleta",impostor:"Bizcocho",category:"comida"},{civil:"Tortilla de patatas",impostor:"Revuelto",category:"comida"},{civil:"Teléfono móvil",impostor:"Tablet",category:"objetos"},{civil:"Reloj",impostor:"Pulsera",category:"objetos"},{civil:"Gafas de sol",impostor:"Lentillas",category:"objetos"},{civil:"Coche",impostor:"Moto",category:"objetos"},{civil:"Guitarra",impostor:"Ukelele",category:"objetos"},{civil:"Mochila",impostor:"Maleta",category:"objetos"},{civil:"Cuchillo",impostor:"Tijeras",category:"objetos"},{civil:"Libro",impostor:"Revista",category:"objetos"},{civil:"Auriculares",impostor:"Altavoz",category:"objetos"},{civil:"Lápiz",impostor:"Bolígrafo",category:"objetos"},{civil:"Paraguas",impostor:"Chubasquero",category:"objetos"},{civil:"Zapatillas",impostor:"Botas",category:"objetos"},{civil:"Silla",impostor:"Sillón",category:"objetos"},{civil:"Perro",impostor:"Lobo",category:"animales"},{civil:"León",impostor:"Tigre",category:"animales"},{civil:"Delfín",impostor:"Ballena",category:"animales"},{civil:"Gato",impostor:"Pantera",category:"animales"},{civil:"Caballo",impostor:"Cebra",category:"animales"},{civil:"Águila",impostor:"Halcón",category:"animales"},{civil:"Serpiente",impostor:"Lagarto",category:"animales"},{civil:"Pingüino",impostor:"Pato",category:"animales"},{civil:"Oso polar",impostor:"Oso pardo",category:"animales"},{civil:"Mono",impostor:"Chimpancé",category:"animales"},{civil:"Ratón",impostor:"Hámster",category:"animales"},{civil:"Elefante",impostor:"Rinoceronte",category:"animales"},{civil:"Película",impostor:"Serie",category:"ocio"},{civil:"Fútbol",impostor:"Baloncesto",category:"ocio"},{civil:"Tenis",impostor:"Pádel",category:"ocio"},{civil:"Ajedrez",impostor:"Damas",category:"ocio"},{civil:"Pintura",impostor:"Fotografía",category:"ocio"},{civil:"Concierto",impostor:"Festival",category:"ocio"},{civil:"Detective",impostor:"Policía",category:"ocio"},{civil:"Actor",impostor:"Presentador",category:"ocio"},{civil:"Avión",impostor:"Helicóptero",category:"ocio"},{civil:"Barco",impostor:"Submarino",category:"ocio"}],b="impostor_custom_words";class y{static getAll(){try{const e=localStorage.getItem(b);return e?JSON.parse(e):[]}catch(e){return console.warn("Could not read custom words from localStorage:",e),[]}}static save(e){try{localStorage.setItem(b,JSON.stringify(e))}catch(t){console.warn("Could not save custom words to localStorage:",t)}}static addWord(e,t){if(!e||!t)return!1;const i=this.getAll(),s={id:"custom_"+Date.now()+"_"+Math.random().toString(36).substring(2,6),civil:e.trim(),impostor:t.trim(),category:"custom"};return i.unshift(s),this.save(i),s}static removeWord(e){let t=this.getAll();return t=t.filter(i=>i.id!==e),this.save(t),t}static getPlayableWords(e="all"){const t=this.getAll();return e==="custom"?t:e==="all"?[...f,...t]:f.filter(i=>i.category===e)}}const p={LOBBY:"LOBBY",REVEAL:"REVEAL",CLUES:"CLUES",DEBATE:"DEBATE",VOTING:"VOTING",RESOLUTION:"RESOLUTION",GUESS:"GUESS",GAME_OVER:"GAME_OVER"},x=["#ff2d55","#00f2fe","#8a2be2","#00e676","#ffb703","#ff007f","#00b4d8","#70e000","#f72585","#4cc9f0","#fb8500","#9d4edd"];class w{constructor(){this.state=p.LOBBY,this.playerCount=5,this.impostorCount=1,this.mode="classic",this.categoryId="all",this.debateDuration=90,this.totalClueRounds=1,this.customPlayerNames={},this.players=[],this.currentPair=null,this.revealIndex=0,this.speakerOrder=[],this.currentSpeakerIndex=0,this.currentRound=1,this.votes={},this.selectedSuspectId=null,this.eliminatedPlayer=null,this.winner=null,this.winReason="",this.guessAttempt="",this.stateChangeListeners=[]}onStateChange(e){this.stateChangeListeners.push(e)}setState(e){this.state=e,this.stateChangeListeners.forEach(t=>t(this.state,this))}setPlayerCount(e){this.playerCount=Math.max(3,Math.min(12,e));const t=Math.min(3,Math.floor((this.playerCount-1)/2));this.impostorCount>t&&(this.impostorCount=t)}setImpostorCount(e){const t=Math.min(3,Math.floor((this.playerCount-1)/2));this.impostorCount=Math.max(1,Math.min(t,e))}setMode(e){this.mode=e==="trap"?"trap":"classic"}setCategory(e){this.categoryId=e}setDebateDuration(e){this.debateDuration=e}setClueRounds(e){this.totalClueRounds=e}setPlayerName(e,t){t&&t.trim()?this.customPlayerNames[e]=t.trim():delete this.customPlayerNames[e]}getPlayerName(e){return this.customPlayerNames[e]||`Jugador ${e+1}`}startGame(){const e=y.getPlayableWords(this.categoryId);if(!e||e.length===0)throw new Error("No hay palabras disponibles en esta categoría.");const t=Math.floor(Math.random()*e.length);this.currentPair=e[t],this.players=[];for(let a=0;a<this.playerCount;a++)this.players.push({id:a+1,index:a,name:this.getPlayerName(a),color:x[a%x.length],isImpostor:!1,role:"CIVIL",word:this.currentPair.civil,isEliminated:!1,hasRevealed:!1});const i=Array.from({length:this.playerCount},(a,n)=>n);for(let a=i.length-1;a>0;a--){const n=Math.floor(Math.random()*(a+1));[i[a],i[n]]=[i[n],i[a]]}i.slice(0,this.impostorCount).forEach(a=>{const n=this.players[a];n.isImpostor=!0,n.role="IMPOSTOR",this.mode==="classic"?n.word=null:n.word=this.currentPair.impostor}),this.revealIndex=0,this.setState(p.REVEAL)}getCurrentRevealPlayer(){return this.players[this.revealIndex]||null}markPlayerRevealed(e){const t=this.players.find(i=>i.id===e);t&&(t.hasRevealed=!0)}nextRevealPlayer(){this.revealIndex<this.players.length-1?(this.revealIndex++,this.setState(p.REVEAL)):this.startCluesPhase()}startCluesPhase(){const e=this.players.filter(t=>!t.isEliminated).map(t=>t.id);for(let t=e.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}this.speakerOrder=e,this.currentSpeakerIndex=0,this.currentRound=1,this.setState(p.CLUES)}getCurrentSpeaker(){const e=this.speakerOrder[this.currentSpeakerIndex];return this.players.find(t=>t.id===e)||null}getNextSpeaker(){const e=(this.currentSpeakerIndex+1)%this.speakerOrder.length,t=this.speakerOrder[e];return this.players.find(i=>i.id===t)||null}advanceSpeaker(){this.currentSpeakerIndex<this.speakerOrder.length-1?(this.currentSpeakerIndex++,this.setState(p.CLUES)):this.currentRound<this.totalClueRounds?(this.currentRound++,this.currentSpeakerIndex=0,this.setState(p.CLUES)):this.startDebatePhase()}startDebatePhase(){this.setState(p.DEBATE)}startVotingPhase(){this.votes={},this.selectedSuspectId=null,this.setState(p.VOTING)}getActivePlayers(){return this.players.filter(e=>!e.isEliminated)}selectSuspect(e){this.selectedSuspectId=e}confirmElimination(e=null){const t=e||this.selectedSuspectId;t&&(this.eliminatedPlayer=this.players.find(i=>i.id===t),this.eliminatedPlayer&&(this.eliminatedPlayer.isEliminated=!0,this.setState(p.RESOLUTION)))}triggerImpostorGuess(){this.setState(p.GUESS)}evaluateGuess(e){this.guessAttempt=e.trim();const t=this.normalizeWord(this.guessAttempt),i=this.normalizeWord(this.currentPair.civil);return t.length>0&&t===i?(this.winner="IMPOSTOR",this.winReason=`¡El Impostor acertó la palabra secreta ("${this.currentPair.civil}") en su última oportunidad!`,this.setState(p.GAME_OVER),!0):(this.checkAfterImpostorEliminated(),!1)}impostorGivesUp(){this.guessAttempt="",this.checkAfterImpostorEliminated()}checkAfterImpostorEliminated(){this.players.filter(t=>t.isImpostor&&!t.isEliminated).length===0?(this.winner="CIVIL",this.winReason="¡Los Civiles ganan! Todos los impostores han sido descubiertos y no pudieron adivinar la palabra secreta.",this.setState(p.GAME_OVER)):this.startCluesPhase()}continueAfterCivilianEliminated(){const e=this.players.filter(i=>!i.isImpostor&&!i.isEliminated);this.players.filter(i=>i.isImpostor&&!i.isEliminated).length>=e.length?(this.winner="IMPOSTOR",this.winReason="¡Los Impostores ganan! Han logrado camuflarse y superar en número a los civiles supervivientes.",this.setState(p.GAME_OVER)):this.startCluesPhase()}endGameWithImpostorVictory(e=null){this.winner="IMPOSTOR",this.winReason=e||"¡Victoria del Impostor! Los civiles eliminaron a un inocente.",this.setState(p.GAME_OVER)}normalizeWord(e){return e?e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"").trim():""}restartGame(){this.startGame()}resetToLobby(){this.state=p.LOBBY,this.players=[],this.currentPair=null,this.winner=null,this.winReason="",this.eliminatedPlayer=null,this.selectedSuspectId=null,this.setState(p.LOBBY)}}class C{constructor(){this.ctx=null,this.enabled=localStorage.getItem("impostor_sound_enabled")!=="false",this.holdOscillator=null,this.holdGain=null,this.holdFilter=null}initContext(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}toggleSound(){return this.enabled=!this.enabled,localStorage.setItem("impostor_sound_enabled",this.enabled?"true":"false"),this.enabled&&(this.initContext(),this.playTap()),this.enabled}isSoundEnabled(){return this.enabled}vibrate(e=30){if("vibrate"in navigator)try{navigator.vibrate(e)}catch{}}playTap(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine";const i=this.ctx.currentTime;e.frequency.setValueAtTime(480,i),e.frequency.exponentialRampToValueAtTime(240,i+.06),t.gain.setValueAtTime(.2,i),t.gain.exponentialRampToValueAtTime(.01,i+.06),e.connect(t),t.connect(this.ctx.destination),e.start(i),e.stop(i+.06),this.vibrate(15)}startHoldTension(){if(!this.enabled||(this.initContext(),!this.ctx))return;this.stopHoldTension();const e=this.ctx.currentTime;this.holdOscillator=this.ctx.createOscillator(),this.holdFilter=this.ctx.createBiquadFilter(),this.holdGain=this.ctx.createGain(),this.holdOscillator.type="sawtooth",this.holdOscillator.frequency.setValueAtTime(75,e),this.holdOscillator.frequency.linearRampToValueAtTime(140,e+2.5),this.holdFilter.type="lowpass",this.holdFilter.frequency.setValueAtTime(180,e),this.holdFilter.frequency.linearRampToValueAtTime(450,e+2.5),this.holdGain.gain.setValueAtTime(.01,e),this.holdGain.gain.linearRampToValueAtTime(.18,e+.5),this.holdOscillator.connect(this.holdFilter),this.holdFilter.connect(this.holdGain),this.holdGain.connect(this.ctx.destination),this.holdOscillator.start(e),this.vibrate([20,80,20])}stopHoldTension(){if(this.holdGain&&this.ctx){const e=this.ctx.currentTime;try{this.holdGain.gain.linearRampToValueAtTime(.001,e+.1),this.holdOscillator&&this.holdOscillator.stop(e+.1)}catch{}}this.holdOscillator=null,this.holdGain=null,this.holdFilter=null}playReveal(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=[329.63,440,554.37,659.25],t=this.ctx.currentTime;e.forEach((i,s)=>{const a=this.ctx.createOscillator(),n=this.ctx.createGain(),o=t+s*.06;a.type="triangle",a.frequency.setValueAtTime(i,o),n.gain.setValueAtTime(.2,o),n.gain.exponentialRampToValueAtTime(.001,o+.4),a.connect(n),n.connect(this.ctx.destination),a.start(o),a.stop(o+.45)}),this.vibrate([40,40,60])}playTurn(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain(),i=this.ctx.currentTime;e.type="sine",e.frequency.setValueAtTime(300,i),e.frequency.exponentialRampToValueAtTime(600,i+.12),t.gain.setValueAtTime(.15,i),t.gain.exponentialRampToValueAtTime(.01,i+.12),e.connect(t),t.connect(this.ctx.destination),e.start(i),e.stop(i+.12),this.vibrate(20)}playTick(e=!1){if(!this.enabled||(this.initContext(),!this.ctx))return;const t=this.ctx.createOscillator(),i=this.ctx.createGain(),s=this.ctx.currentTime;t.type=e?"sawtooth":"sine";const a=e?880:520;t.frequency.setValueAtTime(a,s);const n=e?.3:.12;i.gain.setValueAtTime(n,s),i.gain.exponentialRampToValueAtTime(.001,s+(e?.1:.05)),t.connect(i),i.connect(this.ctx.destination),t.start(s),t.stop(s+.1),e&&this.vibrate(30)}playGong(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(90,e),t.frequency.exponentialRampToValueAtTime(45,e+1.2),i.gain.setValueAtTime(.4,e),i.gain.exponentialRampToValueAtTime(.001,e+1.2),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+1.2);const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(220,e),a.gain.setValueAtTime(.25,e),a.gain.exponentialRampToValueAtTime(.001,e+1.5),s.connect(a),a.connect(this.ctx.destination),s.start(e),s.stop(e+1.5),this.vibrate([80,50,150])}playVictory(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=[{f:392,d:.15},{f:523.25,d:.15},{f:659.25,d:.18},{f:783.99,d:.45}];let t=this.ctx.currentTime;e.forEach(i=>{const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(i.f,t),a.gain.setValueAtTime(.28,t),a.gain.exponentialRampToValueAtTime(.001,t+i.d),s.connect(a),a.connect(this.ctx.destination),s.start(t),s.stop(t+i.d),t+=i.d*.85}),this.vibrate([60,40,60,40,150])}playDefeat(){if(!this.enabled||(this.initContext(),!this.ctx))return;const e=[{f:440,d:.25},{f:415.3,d:.25},{f:392,d:.3},{f:349.23,d:.6}];let t=this.ctx.currentTime;e.forEach(i=>{const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="sawtooth",s.frequency.setValueAtTime(i.f,t),a.gain.setValueAtTime(.2,t),a.gain.exponentialRampToValueAtTime(.001,t+i.d),s.connect(a),a.connect(this.ctx.destination),s.start(t),s.stop(t+i.d),t+=i.d*.9}),this.vibrate([100,60,200])}}const l=new C;class T{static render(){const e=document.getElementById("rules-modal");e&&e.remove();const t=document.createElement("div");t.id="rules-modal",t.className="modal-backdrop",t.innerHTML=`
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
    `,document.body.appendChild(t);const i=()=>{l.playTap(),t.remove()};t.querySelector("#close-rules-btn").addEventListener("click",i),t.querySelector("#understood-btn").addEventListener("click",i),t.addEventListener("click",s=>{s.target===t&&i()})}}class E{static render(e=null){const t=document.getElementById("custom-words-modal");t&&t.remove();const i=document.createElement("div");i.id="custom-words-modal",i.className="modal-backdrop",i.innerHTML=`
      <div class="modal-card anim-card-flip">
        <div class="modal-header">
          <h2 class="modal-title font-heading">Palabras Personalizadas</h2>
          <button id="close-custom-modal-btn" class="icon-btn" aria-label="Cerrar">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Añade tus propias parejas de palabras para jugar con tus amigos. La palabra civil es la secreta de la mayoría y la palabra trampa es la que recibirá el impostor en modo trampa.
        </p>

        <!-- New word form -->
        <form id="add-word-form" style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
          <div class="input-group">
            <label class="input-label">Palabra Civil (Secreta):</label>
            <input type="text" id="custom-civil-input" class="text-input" placeholder="Ej. Hamburguesa" required />
          </div>

          <div class="input-group">
            <label class="input-label">Palabra Trampa (Impostor):</label>
            <input type="text" id="custom-impostor-input" class="text-input" placeholder="Ej. Perrito caliente" required />
          </div>

          <button type="submit" class="btn btn-cyan btn-sm" style="margin-top: 4px;">
            + Añadir Pareja
          </button>
        </form>

        <!-- List of existing custom words -->
        <div style="margin-top: 6px;">
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">Tus Palabras Guardadas:</h4>
          <div id="custom-words-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <button id="close-custom-done-btn" class="btn btn-secondary">
          Listo
        </button>
      </div>
    `,document.body.appendChild(i);const s=i.querySelector("#custom-words-list"),a=i.querySelector("#add-word-form"),n=i.querySelector("#custom-civil-input"),o=i.querySelector("#custom-impostor-input"),r=()=>{const m=y.getAll();if(m.length===0){s.innerHTML=`
          <div style="text-align: center; color: var(--text-subtle); padding: 12px; font-size: 0.85rem;">
            No has añadido palabras personalizadas todavía.
          </div>
        `;return}s.innerHTML=m.map(d=>`
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 8px 12px;">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 700; color: #fff; font-size: 0.92rem;">${d.civil}</span>
            <span style="font-size: 0.76rem; color: var(--text-muted);">Trampa: ${d.impostor}</span>
          </div>
          <button data-delete-id="${d.id}" class="icon-btn" style="width: 28px; height: 28px; color: var(--crimson); border-color: rgba(255, 45, 85, 0.3);" title="Eliminar">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `).join(""),s.querySelectorAll("[data-delete-id]").forEach(d=>{d.addEventListener("click",()=>{l.playTap();const c=d.getAttribute("data-delete-id");y.removeWord(c),r(),e&&e()})})};a.addEventListener("submit",m=>{m.preventDefault();const d=n.value,c=o.value;d&&c&&(l.playTap(),y.addWord(d,c),n.value="",o.value="",n.focus(),r(),e&&e())});const u=()=>{l.playTap(),i.remove()};i.querySelector("#close-custom-modal-btn").addEventListener("click",u),i.querySelector("#close-custom-done-btn").addEventListener("click",u),i.addEventListener("click",m=>{m.target===i&&u()}),r()}}class L{constructor(e){this.engine=e,this.showPlayerNames=!1}render(e){e.innerHTML=`
      <div class="view-container anim-fade-in-up">
        <!-- Header -->
        <header class="app-header">
          <div class="header-brand">
            <div class="header-logo">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.82.62-3.49 1.64-4.83 1.43 1.83 3.61 3.01 6.09 3.06-.8 1.1-1.33 2.4-1.55 3.82-.41-.12-.84-.2-1.29-.2-2.21 0-4 1.79-4 4 0 .39.06.77.16 1.12C6.88 19.46 9.3 20 12 20zm5.84-2.88c-.61-.98-1.52-1.74-2.61-2.17.2-.67.32-1.38.32-2.11 0-1.82-.62-3.49-1.64-4.83 2.48-.05 4.66-1.23 6.09-3.06C21.38 6.51 22 8.18 22 10c0 3.28-1.82 6.13-4.16 7.12z"/></svg>
            </div>
            <h1 class="app-title">Impostor</h1>
          </div>
          <div class="header-actions">
            <button id="custom-words-btn" class="icon-btn" title="Palabras Personalizadas" aria-label="Palabras Personalizadas">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button id="rules-btn" class="icon-btn" title="Reglas del juego" aria-label="Reglas">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
            </button>
            <button id="sound-btn" class="icon-btn" title="Activar/Silenciar sonido" aria-label="Sonido">
              <svg id="sound-icon" viewBox="0 0 24 24"><path d="${l.isSoundEnabled()?"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z":"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"}"/></svg>
            </button>
          </div>
        </header>

        <!-- Main Configuration Card -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
          
          <!-- Players & Impostors Steppers -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="glass-card" style="padding: 14px;">
              <span class="stepper-label">Jugadores</span>
              <div class="stepper-control" style="margin-top: 8px;">
                <button id="dec-players" class="stepper-btn" ${this.engine.playerCount<=3?"disabled":""}>-</button>
                <div class="stepper-value">
                  <span id="players-val" class="stepper-number">${this.engine.playerCount}</span>
                </div>
                <button id="inc-players" class="stepper-btn" ${this.engine.playerCount>=12?"disabled":""}>+</button>
              </div>
            </div>

            <div class="glass-card" style="padding: 14px;">
              <span class="stepper-label" style="color: var(--crimson);">Impostores</span>
              <div class="stepper-control" style="margin-top: 8px; border-color: rgba(255, 45, 85, 0.3);">
                <button id="dec-impostors" class="stepper-btn" ${this.engine.impostorCount<=1?"disabled":""}>-</button>
                <div class="stepper-value">
                  <span id="impostors-val" class="stepper-number" style="color: var(--crimson);">${this.engine.impostorCount}</span>
                </div>
                <button id="inc-impostors" class="stepper-btn" ${this.engine.impostorCount>=Math.min(3,Math.floor((this.engine.playerCount-1)/2))?"disabled":""}>+</button>
              </div>
            </div>
          </div>

          <!-- Game Mode Selector -->
          <div class="glass-card" style="padding: 14px;">
            <span class="stepper-label">Modo de Juego para el Impostor</span>
            <div class="segmented-control" style="margin-top: 8px;">
              <button id="mode-classic" class="segmented-btn ${this.engine.mode==="classic"?"active":""}">
                <span>Modo Clásico</span>
                <span class="sub-text">"Eres el Impostor" (Sin palabra)</span>
              </button>
              <button id="mode-trap" class="segmented-btn ${this.engine.mode==="trap"?"active":""}">
                <span>Palabra Trampa</span>
                <span class="sub-text">Palabra similar señuelo</span>
              </button>
            </div>
          </div>

          <!-- Category Selector -->
          <div class="glass-card" style="padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span class="stepper-label">Categoría de Palabras</span>
              <button id="manage-custom-words-link" style="background: none; border: none; color: var(--cyan); font-size: 0.76rem; font-weight: 700; cursor: pointer;">
                + Añadir propias
              </button>
            </div>
            <div class="categories-grid" id="categories-container">
              ${S.map(t=>`
                <button class="category-chip ${this.engine.categoryId===t.id?"active":""}" data-cat-id="${t.id}">
                  <span class="chip-icon">${t.icon}</span>
                  <span>${t.name}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Debate Timer & Clue Rounds Settings -->
          <div class="glass-card" style="padding: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <span class="stepper-label">Tiempo de Debate</span>
                <select id="timer-select" class="text-input" style="margin-top: 6px; padding: 8px; font-weight: 700;">
                  <option value="30" ${this.engine.debateDuration===30?"selected":""}>30 seg</option>
                  <option value="60" ${this.engine.debateDuration===60?"selected":""}>60 seg</option>
                  <option value="90" ${this.engine.debateDuration===90?"selected":""}>90 seg (Recomendado)</option>
                  <option value="120" ${this.engine.debateDuration===120?"selected":""}>120 seg</option>
                  <option value="0" ${this.engine.debateDuration===0?"selected":""}>Sin límite</option>
                </select>
              </div>

              <div>
                <span class="stepper-label">Rondas de Pistas</span>
                <select id="rounds-select" class="text-input" style="margin-top: 6px; padding: 8px; font-weight: 700;">
                  <option value="1" ${this.engine.totalClueRounds===1?"selected":""}>1 Ronda</option>
                  <option value="2" ${this.engine.totalClueRounds===2?"selected":""}>2 Rondas</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Player Names Customization (Collapsible) -->
          <div class="glass-card" style="padding: 14px;">
            <button id="toggle-player-names-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: var(--text-main); font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; cursor: pointer;">
              <span>Personalizar nombres (${this.engine.playerCount} jugadores)</span>
              <span id="player-names-chevron">${this.showPlayerNames?"▲":"▼"}</span>
            </button>
            <div id="player-names-list" class="player-list" style="margin-top: 10px; display: ${this.showPlayerNames?"flex":"none"};">
              ${Array.from({length:this.engine.playerCount},(t,i)=>{var s;return`
                <div class="player-item">
                  <div class="player-avatar" style="background: ${((s=this.engine.players[i])==null?void 0:s.color)||"#ff2d55"};">
                    ${i+1}
                  </div>
                  <input type="text" class="player-name-input" data-player-idx="${i}" value="${this.engine.getPlayerName(i)}" placeholder="Jugador ${i+1}" maxlength="20" />
                </div>
              `}).join("")}
            </div>
          </div>

        </div>

        <!-- Start Game CTA Button -->
        <button id="start-game-btn" class="btn btn-primary anim-pulse-glow" style="margin-top: auto; font-size: 1.15rem;">
          <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
          ¡Comenzar Partida!
        </button>
      </div>
    `,this.bindEvents(e)}bindEvents(e){const t=e.querySelector("#sound-btn"),i=e.querySelector("#sound-icon");t.addEventListener("click",()=>{const c=l.toggleSound();i.querySelector("path").setAttribute("d",c?"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z":"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z")}),e.querySelector("#rules-btn").addEventListener("click",()=>{l.playTap(),T.render()});const s=()=>{l.playTap(),E.render(()=>{})};e.querySelector("#custom-words-btn").addEventListener("click",s),e.querySelector("#manage-custom-words-link").addEventListener("click",s);const a=e.querySelector("#dec-players"),n=e.querySelector("#inc-players");e.querySelector("#players-val");const o=e.querySelector("#dec-impostors"),r=e.querySelector("#inc-impostors");e.querySelector("#impostors-val"),a.addEventListener("click",()=>{l.playTap(),this.engine.setPlayerCount(this.engine.playerCount-1),this.render(e)}),n.addEventListener("click",()=>{l.playTap(),this.engine.setPlayerCount(this.engine.playerCount+1),this.render(e)}),o.addEventListener("click",()=>{l.playTap(),this.engine.setImpostorCount(this.engine.impostorCount-1),this.render(e)}),r.addEventListener("click",()=>{l.playTap(),this.engine.setImpostorCount(this.engine.impostorCount+1),this.render(e)});const u=e.querySelector("#mode-classic"),m=e.querySelector("#mode-trap");u.addEventListener("click",()=>{l.playTap(),this.engine.setMode("classic"),u.classList.add("active"),m.classList.remove("active")}),m.addEventListener("click",()=>{l.playTap(),this.engine.setMode("trap"),m.classList.add("active"),u.classList.remove("active")}),e.querySelectorAll(".category-chip").forEach(c=>{c.addEventListener("click",()=>{l.playTap();const h=c.getAttribute("data-cat-id");this.engine.setCategory(h),e.querySelectorAll(".category-chip").forEach(v=>v.classList.remove("active")),c.classList.add("active")})}),e.querySelector("#timer-select").addEventListener("change",c=>{this.engine.setDebateDuration(parseInt(c.target.value,10))}),e.querySelector("#rounds-select").addEventListener("change",c=>{this.engine.setClueRounds(parseInt(c.target.value,10))}),e.querySelector("#toggle-player-names-btn").addEventListener("click",()=>{l.playTap(),this.showPlayerNames=!this.showPlayerNames;const c=e.querySelector("#player-names-list"),h=e.querySelector("#player-names-chevron");c.style.display=this.showPlayerNames?"flex":"none",h.textContent=this.showPlayerNames?"▲":"▼"}),e.querySelectorAll(".player-name-input").forEach(c=>{c.addEventListener("change",h=>{const v=parseInt(h.target.getAttribute("data-player-idx"),10);this.engine.setPlayerName(v,h.target.value)})}),e.querySelector("#start-game-btn").addEventListener("click",()=>{l.playTap();try{this.engine.startGame()}catch(c){alert(c.message||"Error al iniciar la partida")}})}}class P{constructor(e){this.engine=e,this.isPressing=!1,this.hasRevealedCurrent=!1}render(e){const t=this.engine.getCurrentRevealPlayer(),i=this.engine.revealIndex>=this.engine.players.length-1,s=S.find(m=>{var d;return m.id===((d=this.engine.currentPair)==null?void 0:d.category)})||{name:"General",icon:"✨"};let a="",n="Tu Palabra Secreta:",o="",r="",u=!1;t.isImpostor?this.engine.mode==="classic"?(a='<span class="role-badge impostor">🎭 Eres el Impostor</span>',n="Tu Misión:",o="¡NO TIENES PALABRA!",r="Escucha con atención las pistas de los demás e intenta deducir de qué están hablando sin ser descubierto."):(a='<span class="role-badge" style="background: rgba(138, 43, 226, 0.2); border: 1px solid var(--violet); color: #c084fc;">Palabra Asignada</span>',n="Tu Palabra Secreta:",o=t.word,r="Di una pista sobre tu palabra sin ser demasiado evidente. ¡Cuidado con el impostor!"):(u=!0,a='<span class="role-badge civilian">🛡️ Eres Civil</span>',n="Tu Palabra Secreta:",o=t.word,r="Los demás civiles tienen tu misma palabra. Da pistas sutiles para identificar al impostor."),e.innerHTML=`
      <div class="view-container anim-fade-in-up">
        <!-- Turn Header -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--bg-surface-glass); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); margin-bottom: 10px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              Pase de Turno • ${this.engine.revealIndex+1} de ${this.engine.players.length}
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; color: #fff;">
            Pasa el dispositivo a <span style="color: ${t.color};">${t.name}</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Asegúrate de que nadie más esté mirando la pantalla
          </p>
        </div>

        <!-- Reveal Card -->
        <div class="reveal-wrapper">
          <div id="reveal-card" class="reveal-card ${u?"civilian":""}">
            
            <!-- Cover / Concealed State -->
            <div class="cover-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;">
              <div style="width: 70px; height: 70px; border-radius: var(--radius-full); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass-strong);">
                <svg viewBox="0 0 24 24" style="width: 36px; height: 36px; fill: var(--text-muted);"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>
              <h3 style="color: #fff; font-size: 1.25rem;">Palabra Oculta</h3>
              <p style="color: var(--text-muted); font-size: 0.86rem; max-width: 240px; line-height: 1.4;">
                Mantén presionado el botón inferior para revelar tu secreto.
              </p>
            </div>

            <!-- Secret Revealed State -->
            <div class="secret-content">
              ${a}
              <span class="category-tag" style="margin-bottom: 12px;">
                ${s.icon} Categoría: <strong>${s.name}</strong>
              </span>
              <span class="secret-word-title">${n}</span>
              <div class="secret-word" style="color: ${t.isImpostor&&this.engine.mode==="classic"?"var(--crimson)":"var(--cyan)"};">
                ${o}
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 280px; margin-top: 6px; line-height: 1.4;">
                ${r}
              </p>
              <div style="margin-top: 14px; font-size: 0.75rem; color: var(--crimson); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                ⚠️ Suelta para ocultar inmediatamente
              </div>
            </div>

          </div>

          <!-- Hold to Reveal Button -->
          <div class="hold-zone">
            <div id="hold-trigger-btn" class="hold-button" role="button" aria-label="Mantener pulsado para ver">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </div>
            <span class="hold-text" id="hold-instruction-text">
              Mantén pulsado para ver tu palabra
            </span>
          </div>
        </div>

        <!-- Next Player Navigation -->
        <button id="next-player-btn" class="btn btn-secondary" style="margin-top: 20px;" ${this.hasRevealedCurrent?"":"disabled"}>
          <span>${i?"¡Todos listos! Comenzar Pistas":"Siguiente Jugador →"}</span>
        </button>
      </div>
    `,this.bindEvents(e)}bindEvents(e){const t=e.querySelector("#reveal-card"),i=e.querySelector("#hold-trigger-btn"),s=e.querySelector("#next-player-btn"),a=e.querySelector("#hold-instruction-text"),n=this.engine.getCurrentRevealPlayer(),o=u=>{u.preventDefault(),!this.isPressing&&(this.isPressing=!0,i.classList.add("pressing"),t.classList.add("is-revealed"),a.textContent="¡Soltando se ocultará de inmediato!",a.style.color="var(--crimson)",l.startHoldTension(),l.playReveal(),this.hasRevealedCurrent=!0,this.engine.markPlayerRevealed(n.id),s.removeAttribute("disabled"),s.classList.remove("btn-secondary"),s.classList.add("btn-primary"))},r=u=>{this.isPressing&&(this.isPressing=!1,i.classList.remove("pressing"),t.classList.remove("is-revealed"),a.textContent="Mantén pulsado para volver a mirar",a.style.color="var(--text-muted)",l.stopHoldTension())};i.addEventListener("pointerdown",o),window.addEventListener("pointerup",r),window.addEventListener("pointercancel",r),s.addEventListener("click",()=>{l.playTap(),l.stopHoldTension(),this.hasRevealedCurrent=!1,this.engine.nextRevealPlayer()})}}class I{constructor(e){this.engine=e}render(e){const t=this.engine.getCurrentSpeaker(),i=this.engine.getNextSpeaker(),s=this.engine.currentSpeakerIndex>=this.engine.speakerOrder.length-1,a=this.engine.currentRound>=this.engine.totalClueRounds;e.innerHTML=`
      <div class="view-container anim-fade-in-up">
        <!-- Top Status -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-glass); padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-glass);">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">
              Ronda ${this.engine.currentRound} de ${this.engine.totalClueRounds}
            </span>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            Turno ${this.engine.currentSpeakerIndex+1} de ${this.engine.speakerOrder.length}
          </span>
        </div>

        <!-- Speaker Spotlight Card -->
        <div class="glass-card anim-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 36px 20px; text-align: center; margin: auto 0; border: 2px solid ${t.color}; box-shadow: 0 0 30px ${t.color}33;">
          <span style="font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
            🎙️ Turno de hablar en voz alta
          </span>

          <div style="width: 90px; height: 90px; border-radius: var(--radius-full); background: ${t.color}; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: #fff; margin-bottom: 16px; box-shadow: 0 4px 20px ${t.color}66;">
            ${t.name.charAt(0).toUpperCase()}
          </div>

          <h2 class="font-heading" style="font-size: 2.2rem; color: #fff; line-height: 1.1; margin-bottom: 12px;">
            ${t.name}
          </h2>

          <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 290px; line-height: 1.5;">
            Di una sola palabra o pista sutil relacionada con tu palabra secreta.
          </p>

          ${i&&i.id!==t.id?`
            <div style="margin-top: 24px; padding: 8px 16px; background: var(--bg-surface); border-radius: var(--radius-full); border: 1px solid var(--border-glass); font-size: 0.82rem; color: var(--text-subtle);">
              Siguiente turno: <strong style="color: #fff;">${i.name}</strong>
            </div>
          `:""}
        </div>

        <!-- Actions -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
          <button id="next-speaker-btn" class="btn btn-primary" style="font-size: 1.1rem;">
            ${s&&a?"¡Finalizar Pistas e Ir a Debate!":"Siguiente Pista →"}
          </button>
          
          <button id="skip-to-debate-btn" class="btn btn-ghost btn-sm">
            Ir a Debate ahora
          </button>
        </div>
      </div>
    `,this.bindEvents(e)}bindEvents(e){const t=e.querySelector("#next-speaker-btn"),i=e.querySelector("#skip-to-debate-btn");t.addEventListener("click",()=>{l.playTurn(),this.engine.advanceSpeaker()}),i.addEventListener("click",()=>{l.playTap(),this.engine.startDebatePhase()})}}class z{constructor({duration:e=90,onTick:t=null,onUrgent:i=null,onComplete:s=null}={}){this.totalDuration=e,this.remainingSeconds=e,this.isRunning=!1,this.intervalId=null,this.onTick=t,this.onUrgent=i,this.onComplete=s}start(e=null){if(e!==null&&(this.totalDuration=e,this.remainingSeconds=e),this.pause(),this.totalDuration===0){this.isRunning=!0,this.onTick&&this.onTick(0,0);return}this.isRunning=!0,this.onTick&&this.onTick(this.remainingSeconds,this.totalDuration),this.intervalId=setInterval(()=>{this.isRunning&&(this.remainingSeconds--,this.onTick&&this.onTick(this.remainingSeconds,this.totalDuration),this.remainingSeconds<=15&&this.remainingSeconds>0&&this.onUrgent&&this.onUrgent(this.remainingSeconds),this.remainingSeconds<=0&&(this.pause(),this.onComplete&&this.onComplete()))},1e3)}pause(){this.isRunning=!1,this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}resume(){!this.isRunning&&this.remainingSeconds>0&&(this.isRunning=!0,this.start())}addTime(e=30){this.remainingSeconds+=e,this.totalDuration=Math.max(this.totalDuration,this.remainingSeconds),this.onTick&&this.onTick(this.remainingSeconds,this.totalDuration)}reset(){this.pause(),this.remainingSeconds=this.totalDuration}}class k{constructor(e){this.engine=e,this.timer=null}render(e){const t=this.engine.debateDuration===0,i=this.engine.getActivePlayers();e.innerHTML=`
      <div class="view-container anim-fade-in-up">
        <!-- Title & Info -->
        <div style="text-align: center; margin-bottom: 10px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 45, 85, 0.15); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--crimson); margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: var(--crimson); text-transform: uppercase; letter-spacing: 0.06em;">
              🗣️ Fase de Debate
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.7rem; color: #fff;">
            ¿Quién es el Impostor?
          </h2>
          <p style="font-size: 0.86rem; color: var(--text-muted); max-width: 320px; margin: 4px auto 0;">
            Analizad las pistas que ha dicho cada jugador y contrastad sospechas.
          </p>
        </div>

        <!-- Timer Circle Container -->
        <div class="timer-container">
          ${t?`
            <div style="width: 180px; height: 180px; border-radius: var(--radius-full); background: var(--bg-surface-glass); border: 2px dashed var(--border-glass-strong); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
              <span style="font-size: 2rem;">⏳</span>
              <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 6px;">Tiempo Libre</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Debatid sin prisas</span>
            </div>
          `:`
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle class="timer-circle-bg" cx="50" cy="50" r="42" />
              <circle id="timer-progress" class="timer-circle-progress" cx="50" cy="50" r="42" stroke-dasharray="264" stroke-dashoffset="0" />
            </svg>
            <div class="timer-inner-content">
              <span id="timer-number" class="timer-digits">${this.engine.debateDuration}</span>
              <span class="timer-label">segundos</span>
            </div>
          `}
        </div>

        <!-- Timer Controls (if not manual) -->
        ${t?"":`
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;">
            <button id="toggle-pause-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
              <span id="pause-icon">⏸️</span>
              <span id="pause-text">Pausar</span>
            </button>
            <button id="add-time-btn" class="btn btn-secondary btn-sm">
              +30 seg
            </button>
          </div>
        `}

        <!-- Active Suspects Chips -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 20px;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 8px;">
            Jugadores en juego (${i.length}):
          </span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${i.map(s=>`
              <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.84rem;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${s.color};"></span>
                <span style="font-weight: 600; color: #fff;">${s.name}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- CTA Vote Button -->
        <button id="start-voting-btn" class="btn btn-primary anim-pulse-glow" style="margin-top: auto; font-size: 1.15rem;">
          <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: currentColor;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          Iniciar Votación en Pantalla
        </button>
      </div>
    `,this.bindEvents(e,t)}bindEvents(e,t){const i=e.querySelector("#start-voting-btn"),s=()=>{l.playTap(),this.timer&&this.timer.pause(),this.engine.startVotingPhase()};if(i.addEventListener("click",s),t)return;const a=e.querySelector("#timer-number"),n=e.querySelector("#timer-progress"),o=e.querySelector("#toggle-pause-btn"),r=e.querySelector("#pause-icon"),u=e.querySelector("#pause-text"),m=e.querySelector("#add-time-btn"),d=2*Math.PI*42;this.timer=new z({duration:this.engine.debateDuration,onTick:(c,h)=>{a.textContent=c;const v=d-c/h*d;n.style.strokeDashoffset=v,c<=15?(n.classList.add("urgent"),l.playTick(!0)):(n.classList.remove("urgent"),l.playTick(!1))},onUrgent:c=>{},onComplete:()=>{l.playGong(),this.engine.startVotingPhase()}}),this.timer.start(),o.addEventListener("click",()=>{l.playTap(),this.timer.isRunning?(this.timer.pause(),r.textContent="▶️",u.textContent="Reanudar"):(this.timer.resume(),r.textContent="⏸️",u.textContent="Pausar")}),m.addEventListener("click",()=>{l.playTap(),this.timer.addTime(30)})}}class A{constructor(e){this.engine=e,this.selectedId=null,this.voteCounts={}}render(e){var i;const t=this.engine.getActivePlayers();t.forEach(s=>{s.id in this.voteCounts||(this.voteCounts[s.id]=0)}),e.innerHTML=`
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
          ${t.map(s=>`
            <div class="suspect-card ${this.selectedId===s.id?"selected":""}" data-player-id="${s.id}">
              <div class="suspect-avatar" style="background: ${s.color};">
                ${s.name.charAt(0).toUpperCase()}
              </div>
              <span class="suspect-name">${s.name}</span>
              
              <!-- Quick Vote Tally Pill -->
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
                <button class="icon-btn vote-add-btn" data-vote-id="${s.id}" style="width: 28px; height: 28px; font-size: 0.8rem; font-weight: 800;" title="Añadir voto">
                  +1
                </button>
                <span class="vote-count-label" data-label-id="${s.id}" style="font-size: 0.82rem; font-weight: 700; color: ${this.voteCounts[s.id]>0?"var(--crimson)":"var(--text-subtle)"};">
                  ${this.voteCounts[s.id]} votos
                </span>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Action Section -->
        <div style="margin-top: auto; padding-top: 16px; display: flex; flex-direction: column; gap: 10px;">
          <button id="eliminate-btn" class="btn btn-primary" ${this.selectedId?"":"disabled"} style="font-size: 1.1rem;">
            ${this.selectedId?`Expulsar a ${(i=t.find(s=>s.id===this.selectedId))==null?void 0:i.name}`:"Selecciona un sospechoso"}
          </button>
        </div>
      </div>
    `,this.bindEvents(e)}bindEvents(e){const t=this.engine.getActivePlayers(),i=e.querySelector("#eliminate-btn");e.querySelectorAll(".suspect-card").forEach(s=>{s.addEventListener("click",a=>{if(a.target.closest(".vote-add-btn"))return;l.playTap();const n=parseInt(s.getAttribute("data-player-id"),10);this.selectedId=n,this.engine.selectSuspect(n),e.querySelectorAll(".suspect-card").forEach(r=>r.classList.remove("selected")),s.classList.add("selected");const o=t.find(r=>r.id===n);i.removeAttribute("disabled"),i.textContent=`Expulsar a ${o==null?void 0:o.name}`})}),e.querySelectorAll(".vote-add-btn").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation(),l.playTap();const n=parseInt(s.getAttribute("data-vote-id"),10);this.voteCounts[n]=(this.voteCounts[n]||0)+1;let o=0,r=null;if(Object.entries(this.voteCounts).forEach(([m,d])=>{d>o&&(o=d,r=parseInt(m,10))}),r){this.selectedId=r,this.engine.selectSuspect(r),e.querySelectorAll(".suspect-card").forEach(d=>{d.classList.toggle("selected",parseInt(d.getAttribute("data-player-id"),10)===r)});const m=t.find(d=>d.id===r);i.removeAttribute("disabled"),i.textContent=`Expulsar a ${m==null?void 0:m.name} (${o} votos)`}const u=e.querySelector(`[data-label-id="${n}"]`);u&&(u.textContent=`${this.voteCounts[n]} votos`,u.style.color="var(--crimson)")})}),i.addEventListener("click",()=>{this.selectedId&&(l.playGong(),this.engine.confirmElimination(this.selectedId))})}}class R{constructor(e){this.engine=e}render(e){const t=this.engine.eliminatedPlayer,i=t==null?void 0:t.isImpostor,s=this.engine.players.filter(o=>!o.isImpostor&&!o.isEliminated),a=this.engine.players.filter(o=>o.isImpostor&&!o.isEliminated),n=!i&&s.length>a.length;e.innerHTML=`
      <div class="view-container anim-fade-in-up" style="justify-content: center; text-align: center;">
        
        <!-- Dramatic Reveal Card -->
        <div class="glass-card anim-card-flip" style="padding: 36px 20px; border: 2px solid ${i?"var(--crimson)":"var(--cyan)"}; box-shadow: 0 0 35px ${i?"var(--crimson-glow)":"var(--cyan-glow)"};">
          
          <div style="width: 80px; height: 80px; border-radius: var(--radius-full); background: ${t.color}; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900; color: #fff;">
            ${t.name.charAt(0).toUpperCase()}
          </div>

          <h3 style="color: var(--text-muted); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em;">
            El grupo ha expulsado a:
          </h3>
          <h2 class="font-heading" style="font-size: 2.2rem; color: #fff; margin: 4px 0 16px;">
            ${t.name}
          </h2>

          <!-- Reveal Identity -->
          ${i?`
            <div style="background: rgba(255, 45, 85, 0.2); border: 1.5px solid var(--crimson); border-radius: var(--radius-md); padding: 18px; margin-top: 12px;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 6px;">🎭</span>
              <h3 class="font-heading" style="font-size: 1.8rem; color: #ff3366;">
                ¡ERA EL IMPOSTOR!
              </h3>
              <p style="font-size: 0.9rem; color: #fff; margin-top: 6px; line-height: 1.4;">
                ¡Buen trabajo! Habéis desenmascarado al impostor. Pero las reglas le conceden una <strong>última oportunidad</strong> para adivinar la palabra secreta de los civiles...
              </p>
            </div>
          `:`
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
          ${i?`
            <button id="impostor-guess-btn" class="btn btn-primary anim-pulse-glow" style="font-size: 1.1rem;">
              🎯 Última Oportunidad del Impostor
            </button>
          `:n?`
            <button id="continue-round-btn" class="btn btn-primary">
              Continuar Partida (Siguiente Ronda de Pistas)
            </button>
            <button id="end-impostor-win-btn" class="btn btn-ghost btn-sm">
              Declarar Victoria del Impostor
            </button>
          `:`
            <button id="end-game-btn" class="btn btn-primary">
              Ver Resultados Finales
            </button>
          `}
        </div>

      </div>
    `,this.bindEvents(e,i,n)}bindEvents(e,t,i){var s,a,n,o;t?(s=e.querySelector("#impostor-guess-btn"))==null||s.addEventListener("click",()=>{l.playTap(),this.engine.triggerImpostorGuess()}):i?((a=e.querySelector("#continue-round-btn"))==null||a.addEventListener("click",()=>{l.playTap(),this.engine.continueAfterCivilianEliminated()}),(n=e.querySelector("#end-impostor-win-btn"))==null||n.addEventListener("click",()=>{l.playDefeat(),this.engine.endGameWithImpostorVictory("Los civiles eliminaron a un inocente y acordaron finalizar la partida.")})):(o=e.querySelector("#end-game-btn"))==null||o.addEventListener("click",()=>{l.playDefeat(),this.engine.continueAfterCivilianEliminated()})}}class ${constructor(e){this.engine=e,this.hasFailed=!1}render(e){const t=this.engine.eliminatedPlayer;e.innerHTML=`
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
            <strong style="color: ${t.color};">${t.name}</strong>, si adivinas la palabra exacta de los civiles tras escuchar sus pistas, <strong>¡ganas la partida!</strong>
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

          <div id="guess-feedback" style="display: ${this.hasFailed?"block":"none"}; text-align: center; color: var(--crimson); font-size: 0.9rem; font-weight: 700;">
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
    `,this.bindEvents(e)}bindEvents(e){const t=e.querySelector("#guess-input"),i=e.querySelector("#submit-guess-btn"),s=e.querySelector("#give-up-btn"),a=e.querySelector("#guess-feedback"),n=()=>{const o=t.value.trim();if(!o){t.focus();return}this.engine.evaluateGuess(o)?l.playVictory():(l.playDefeat(),this.hasFailed=!0,a.style.display="block",setTimeout(()=>{},800))};i.addEventListener("click",()=>{l.playTap(),n()}),t.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),n())}),s.addEventListener("click",()=>{l.playDefeat(),this.engine.impostorGivesUp()})}}class M{constructor(e){this.engine=e,this.confettiInterval=null}render(e){const t=this.engine.winner==="CIVIL",i=this.engine.currentPair;e.innerHTML=`
      <div class="view-container anim-fade-in-up">
        <canvas id="confetti-canvas" class="confetti-canvas"></canvas>

        <!-- Winner Banner -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: ${t?"rgba(0, 242, 254, 0.2)":"rgba(255, 45, 85, 0.2)"}; border: 2px solid ${t?"var(--cyan)":"var(--crimson)"}; display: flex; align-items: center; justify-content: center; font-size: 2.4rem; margin: 0 auto 12px; box-shadow: 0 0 25px ${t?"var(--cyan-glow)":"var(--crimson-glow)"};">
            ${t?"🏆":"🎭"}
          </div>

          <h2 class="font-heading" style="font-size: 2rem; color: #fff; line-height: 1.2;">
            ${t?"¡Victoria de los Civiles!":"¡Victoria del Impostor!"}
          </h2>

          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 320px; margin: 6px auto 0; line-height: 1.4;">
            ${this.engine.winReason}
          </p>
        </div>

        <!-- Words Summary Box -->
        <div class="glass-card" style="padding: 16px; margin-bottom: 16px; border-color: var(--border-glass-strong);">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 10px;">
            Palabras Jugadas:
          </span>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
              <span style="font-size: 0.85rem; color: var(--cyan); font-weight: 700;">🛡️ Palabra Civil:</span>
              <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-heading);">${(i==null?void 0:i.civil)||"---"}</strong>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
              <span style="font-size: 0.85rem; color: var(--crimson); font-weight: 700;">🎭 Palabra Impostor:</span>
              <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-heading);">
                ${this.engine.mode==="trap"?i==null?void 0:i.impostor:"(Ninguna / Modo Clásico)"}
              </strong>
            </div>
          </div>
        </div>

        <!-- Players Breakdown List -->
        <div class="glass-card" style="padding: 16px; margin-bottom: 20px; flex: 1; display: flex; flex-direction: column;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 10px;">
            Identidad de todos los jugadores:
          </span>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; padding-right: 4px;">
            ${this.engine.players.map(s=>`
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid ${s.isImpostor?"rgba(255, 45, 85, 0.4)":"rgba(0, 242, 254, 0.2)"}; padding: 8px 12px; border-radius: var(--radius-sm);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="width: 28px; height: 28px; border-radius: 50%; background: ${s.color}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #fff;">
                    ${s.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">
                      ${s.name}
                      ${s.isEliminated?'<span style="font-size: 0.72rem; color: var(--crimson); margin-left: 4px;">(Expulsado)</span>':""}
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  ${s.isImpostor?`
                    <span class="role-badge impostor" style="padding: 2px 8px; font-size: 0.72rem; margin: 0;">Impostor</span>
                  `:`
                    <span class="role-badge civilian" style="padding: 2px 8px; font-size: 0.72rem; margin: 0;">Civil</span>
                  `}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
          <button id="restart-game-btn" class="btn btn-primary anim-pulse-glow" style="font-size: 1.1rem;">
            🔄 Jugar otra partida (Mismos ajustes)
          </button>
          <button id="back-lobby-btn" class="btn btn-secondary">
            ⚙️ Cambiar ajustes / Menú Principal
          </button>
        </div>
      </div>
    `,this.startConfetti(e),this.bindEvents(e)}startConfetti(e){const t=e.querySelector("#confetti-canvas");if(!t)return;const i=t.getContext("2d");t.width=window.innerWidth,t.height=window.innerHeight;const s=["#ff2d55","#00f2fe","#8a2be2","#ffb703","#00e676"],a=Array.from({length:60},()=>({x:Math.random()*t.width,y:Math.random()*-t.height,size:Math.random()*8+4,color:s[Math.floor(Math.random()*s.length)],speedY:Math.random()*3+2,speedX:Math.random()*2-1,rotation:Math.random()*360,rotSpeed:Math.random()*4-2}));let n;const o=()=>{i.clearRect(0,0,t.width,t.height),a.forEach(r=>{r.y+=r.speedY,r.x+=r.speedX,r.rotation+=r.rotSpeed,i.save(),i.translate(r.x,r.y),i.rotate(r.rotation*Math.PI/180),i.fillStyle=r.color,i.fillRect(-r.size/2,-r.size/2,r.size,r.size),i.restore(),r.y>t.height&&(r.y=-10,r.x=Math.random()*t.width)}),n=requestAnimationFrame(o)};o(),setTimeout(()=>{cancelAnimationFrame(n),i.clearRect(0,0,t.width,t.height)},8e3)}bindEvents(e){var t,i;(t=e.querySelector("#restart-game-btn"))==null||t.addEventListener("click",()=>{l.playTap(),this.engine.restartGame()}),(i=e.querySelector("#back-lobby-btn"))==null||i.addEventListener("click",()=>{l.playTap(),this.engine.resetToLobby()})}}class q{constructor(){this.appRoot=document.getElementById("app"),this.engine=new w,this.views={[p.LOBBY]:new L(this.engine),[p.REVEAL]:new P(this.engine),[p.CLUES]:new I(this.engine),[p.DEBATE]:new k(this.engine),[p.VOTING]:new A(this.engine),[p.RESOLUTION]:new R(this.engine),[p.GUESS]:new $(this.engine),[p.GAME_OVER]:new M(this.engine)},this.init()}init(){const e=()=>{l.initContext(),window.removeEventListener("pointerdown",e),window.removeEventListener("keydown",e)};window.addEventListener("pointerdown",e,{once:!0}),window.addEventListener("keydown",e,{once:!0}),this.engine.onStateChange(t=>{this.renderState(t)}),this.renderState(this.engine.state)}renderState(e){const t=this.views[e];t&&typeof t.render=="function"?(window.scrollTo(0,0),t.render(this.appRoot)):console.error(`No view found for state: ${e}`)}}document.addEventListener("DOMContentLoaded",()=>{new q});
