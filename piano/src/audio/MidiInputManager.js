/**
 * MidiInputManager.js
 * Gestor robusto de entrada MIDI externa mediante la Web MIDI API.
 * Soporta conexión de teclados USB (vía cable o adaptador USB OTG en Android),
 * teclados Bluetooth MIDI e interfaces MIDI hardware en Windows, Mac y Android.
 * Incluye diagnóstico de protocolo (file:// vs http/https), soporte para sysex fallback,
 * y reconexión en caliente.
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class MidiInputManager {
  constructor() {
    this.midiAccess = null;
    this.devices = [];
    this.selectedDeviceId = 'all'; // 'all' o ID específico
    this.isSupported = typeof navigator !== 'undefined' && !!navigator.requestMIDIAccess;
    this.isInitializing = false;
    this.isEnabled = false;
    this.lastError = null;
    this.boundInputs = new Set();
    this.lastProcessedEvent = { time: 0, signature: '' };

    // Callbacks hacia el exterior
    this.onNoteDown = null;      // (noteName, velocity, midiNumber, channel) => {}
    this.onNoteUp = null;        // (noteName, midiNumber, channel) => {}
    this.onSustain = null;       // (isPressed) => {}
    this.onDeviceChange = null;  // (devices, hasConnected, error) => {}
    this.onActivity = null;      // ({ type, noteName, velocity, channel, description, raw }) => {}

    // Configuración
    this.velocitySensitivity = true;
  }

  /**
   * Diagnóstico de entorno y compatibilidad.
   */
  getDiagnostics() {
    const isFile = typeof window !== 'undefined' && (window.location.protocol === 'file:' || window.location.protocol === 'content:');
    const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    return {
      isSupported: this.isSupported,
      isFileProtocol: isFile,
      isSecureContext: isSecure,
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : '',
      devicesCount: this.devices.length,
      devices: this.devices,
      lastError: this.lastError,
      hasAccess: !!this.midiAccess
    };
  }

  /**
   * Solicita acceso a la Web MIDI API con auto-detección y fallbacks.
   */
  async requestAccess(forceRefresh = false) {
    if (!this.isSupported) {
      this.lastError = 'Web MIDI API no está soportada en este navegador. Utiliza Google Chrome, Microsoft Edge, Opera o Brave.';
      if (this.onDeviceChange) this.onDeviceChange([], false, this.lastError);
      return false;
    }

    const isFile = typeof window !== 'undefined' && (window.location.protocol === 'file:' || window.location.protocol === 'content:');
    if (isFile) {
      this.lastError = 'Navegador en modo archivo o visor local (' + window.location.protocol + '). Android y Chrome bloquean el acceso al hardware USB/MIDI en archivos abiertos directamente desde WhatsApp o almacenamiento local. Abre el enlace HTTPS en Google Chrome.';
    }

    // Si ya tenemos acceso concedido, refrescar dispositivos
    if (this.midiAccess && !forceRefresh) {
      this._updateDevices();
      if (this.onDeviceChange) {
        this.onDeviceChange(this.devices, this.devices.length > 0, this.lastError);
      }
      return true;
    }

    this.isInitializing = true;
    try {
      // 1. Intento estándar (sin sysex)
      try {
        this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      } catch (err1) {
        // En algunos entornos se requiere sin opciones
        this.midiAccess = await navigator.requestMIDIAccess();
      }

      this.isEnabled = true;
      this.lastError = null;

      // 2. Escuchar cambios de estado (conexión / desconexión en caliente)
      this.midiAccess.onstatechange = (e) => {
        this._updateDevices();
        if (this.onDeviceChange) {
          this.onDeviceChange(this.devices, this.devices.length > 0, this.lastError);
        }
      };

      this._updateDevices();

      // 3. Si no detectó dispositivos, intentar con sysex: true (necesario para algunos drivers de Yamaha / Roland en Windows)
      if (this.devices.length === 0) {
        try {
          const sysexAccess = await navigator.requestMIDIAccess({ sysex: true });
          if (sysexAccess && sysexAccess.inputs && sysexAccess.inputs.size > 0) {
            this.midiAccess = sysexAccess;
            this.midiAccess.onstatechange = (e) => {
              this._updateDevices();
              if (this.onDeviceChange) {
                this.onDeviceChange(this.devices, this.devices.length > 0, this.lastError);
              }
            };
            this._updateDevices();
          }
        } catch (e) {
          // Ignorar si el usuario o navegador rechaza sysex
        }
      }

      this.isInitializing = false;

      if (this.onDeviceChange) {
        this.onDeviceChange(this.devices, this.devices.length > 0, this.lastError);
      }
      return true;
    } catch (err) {
      this.isInitializing = false;
      this.isEnabled = false;
      
      const errStr = String(err && (err.message || err.name || err));
      if (errStr.includes('SecurityError') || errStr.includes('disallowed') || isFile) {
        this.lastError = 'Acceso MIDI bloqueado por seguridad del navegador. Abre la aplicación desde el servidor local (http://localhost:5173) en vez de abrir el archivo directamente.';
      } else if (errStr.includes('NotAllowedError') || errStr.includes('Permission denied')) {
        this.lastError = 'Permiso denegado por el usuario. Haz clic en el candado de la barra de direcciones del navegador y permite el acceso a dispositivos MIDI.';
      } else {
        this.lastError = `Error de Web MIDI: ${err.message || err}`;
      }

      console.warn('Error al solicitar Web MIDI Access:', err);
      if (this.onDeviceChange) {
        this.onDeviceChange([], false, this.lastError);
      }
      return false;
    }
  }

  /**
   * Actualiza la lista de dispositivos de entrada MIDI y enlaza sus eventos.
   */
  _updateDevices() {
    if (!this.midiAccess || !this.midiAccess.inputs) return;

    this.devices = [];
    const boundNow = new Set();

    const processInput = (input) => {
      if (!input) return;

      this.devices.push({
        id: input.id,
        name: input.name || `Teclado MIDI (${input.id})`,
        manufacturer: input.manufacturer || 'Genérico',
        state: input.state,
        connection: input.connection
      });

      boundNow.add(input.id);

      // Handler con filtro de dispositivo y prevención de eventos duplicados
      const handler = (event) => {
        if (this.selectedDeviceId === 'all' || this.selectedDeviceId === input.id) {
          this._handleMidiMessage(event, input);
        }
      };

      // Registrar handler estándar
      input.onmidimessage = handler;

      // Registrar addEventListener para máxima compatibilidad si no estaba ya
      if (!this.boundInputs.has(input.id)) {
        try {
          input.addEventListener('midimessage', handler);
        } catch (e) {}
      }
    };

    if (typeof this.midiAccess.inputs.forEach === 'function') {
      this.midiAccess.inputs.forEach(processInput);
    } else if (this.midiAccess.inputs.values) {
      for (const input of this.midiAccess.inputs.values()) {
        processInput(input);
      }
    }

    this.boundInputs = boundNow;
  }

  /**
   * Procesa los mensajes MIDI entrantes.
   */
  _handleMidiMessage(event, input) {
    const data = event.data;
    if (!data || data.length < 1) return;

    // Descartar mensajes duplicados que lleguen por doble suscripción en < 2ms
    const signature = `${data[0]}-${data[1]}-${data[2]}`;
    const now = performance.now();
    if (this.lastProcessedEvent.signature === signature && (now - this.lastProcessedEvent.time) < 2) {
      return;
    }
    this.lastProcessedEvent = { time: now, signature };

    const status = data[0];
    const command = status >> 4;
    const channel = (status & 0x0F) + 1;
    const data1 = data.length > 1 ? data[1] : 0;
    const data2 = data.length > 2 ? data[2] : 0;

    // 1. NOTE ON (Comando 0x9 / 9)
    if (command === 9) {
      if (data2 > 0) {
        // Nota pulsada con velocidad > 0
        const midiNumber = data1;
        const noteName = this.midiNumberToNote(midiNumber);
        const velocity = this.velocitySensitivity ? Math.max(0.1, Math.min(1.0, data2 / 127)) : 0.9;

        if (this.onNoteDown) {
          this.onNoteDown(noteName, velocity, midiNumber, channel);
        }

        if (this.onActivity) {
          this.onActivity({
            type: 'note-on',
            noteName,
            midiNumber,
            velocity: Math.round(velocity * 100),
            channel,
            description: `Nota: ${noteName} (Vel: ${data2}/127, Ch: ${channel})`
          });
        }
      } else {
        // En estándar MIDI, Note On con velocity 0 equivale a Note Off
        this._handleNoteOff(data1, channel);
      }
    }
    // 2. NOTE OFF (Comando 0x8 / 8)
    else if (command === 8) {
      this._handleNoteOff(data1, channel);
    }
    // 3. CONTROL CHANGE (Comando 0xB / 11)
    else if (command === 11) {
      const ccNumber = data1;
      const ccValue = data2;

      // CC 64: Pedal de Sustain (Damper Pedal)
      if (ccNumber === 64) {
        const isSustainDown = ccValue >= 64;
        if (this.onSustain) {
          this.onSustain(isSustainDown);
        }

        if (this.onActivity) {
          this.onActivity({
            type: 'sustain',
            value: ccValue,
            isDown: isSustainDown,
            description: `Pedal Sustain: ${isSustainDown ? 'Presionado (ON)' : 'Liberado (OFF)'}`
          });
        }
      }
      // CC 120 / 123: All Notes Off / Reset
      else if (ccNumber === 120 || ccNumber === 123) {
        if (this.onActivity) {
          this.onActivity({
            type: 'reset',
            description: 'Comando All Notes Off recibido'
          });
        }
      }
    }
  }

  _handleNoteOff(midiNumber, channel) {
    const noteName = this.midiNumberToNote(midiNumber);
    if (this.onNoteUp) {
      this.onNoteUp(noteName, midiNumber, channel);
    }

    if (this.onActivity) {
      this.onActivity({
        type: 'note-off',
        noteName,
        midiNumber,
        channel,
        description: `Liberada: ${noteName} (Ch: ${channel})`
      });
    }
  }

  /**
   * Convierte un número de nota MIDI (0-127) a nomenclatura estándar (ej. 60 -> C4).
   */
  midiNumberToNote(midiNumber) {
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteIndex = midiNumber % 12;
    return `${NOTE_NAMES[noteIndex]}${octave}`;
  }

  /**
   * Convierte una nota estándar (ej. "C4", "F#5") a número MIDI (0-127).
   */
  noteToMidiNumber(noteName) {
    const regex = /^([A-G]#?)(-?\d+)$/;
    const match = noteName.match(regex);
    if (!match) return 60;
    const base = match[1];
    const oct = parseInt(match[2], 10);
    const index = NOTE_NAMES.indexOf(base);
    if (index === -1) return 60;
    return (oct + 1) * 12 + index;
  }

  selectDevice(deviceId) {
    this.selectedDeviceId = deviceId;
  }

  setVelocitySensitivity(enabled) {
    this.velocitySensitivity = !!enabled;
  }

  hasDevices() {
    return this.devices.length > 0;
  }
}
