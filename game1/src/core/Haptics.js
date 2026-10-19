// Módulo de respuesta háptica / vibración para teléfonos móviles
class Haptics {
  static isSupported() {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  static tap() {
    if (this.isSupported()) {
      try { navigator.vibrate(15); } catch (_) {}
    }
  }

  static bump() {
    if (this.isSupported()) {
      try { navigator.vibrate(35); } catch (_) {}
    }
  }

  static trap() {
    if (this.isSupported()) {
      try { navigator.vibrate([60, 40, 60]); } catch (_) {}
    }
  }

  static win() {
    if (this.isSupported()) {
      try { navigator.vibrate([60, 50, 80, 50, 160]); } catch (_) {}
    }
  }
}

export { Haptics };
