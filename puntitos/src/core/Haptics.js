// Módulo de respuesta háptica para dispositivos táctiles
export class Haptics {
  static isSupported() {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  static tap() {
    if (this.isSupported()) {
      try { navigator.vibrate(18); } catch (_) {}
    }
  }

  static success() {
    if (this.isSupported()) {
      try { navigator.vibrate([25, 30, 45]); } catch (_) {}
    }
  }

  static error() {
    if (this.isSupported()) {
      try { navigator.vibrate([40, 40, 40]); } catch (_) {}
    }
  }

  static win() {
    if (this.isSupported()) {
      try { navigator.vibrate([60, 40, 80, 40, 150]); } catch (_) {}
    }
  }
}
