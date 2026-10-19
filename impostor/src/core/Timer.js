/* ==========================================================================
   IMPOSTOR - Precision Game Timer
   ========================================================================== */

export class Timer {
  constructor({ duration = 90, onTick = null, onUrgent = null, onComplete = null } = {}) {
    this.totalDuration = duration;
    this.remainingSeconds = duration;
    this.isRunning = false;
    this.intervalId = null;
    this.onTick = onTick;
    this.onUrgent = onUrgent;
    this.onComplete = onComplete;
  }

  start(duration = null) {
    if (duration !== null) {
      this.totalDuration = duration;
      this.remainingSeconds = duration;
    }
    this.pause();

    if (this.totalDuration === 0) {
      // Manual / unlimited mode
      this.isRunning = true;
      if (this.onTick) this.onTick(0, 0);
      return;
    }

    this.isRunning = true;
    if (this.onTick) this.onTick(this.remainingSeconds, this.totalDuration);

    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;

      this.remainingSeconds--;

      if (this.onTick) {
        this.onTick(this.remainingSeconds, this.totalDuration);
      }

      if (this.remainingSeconds <= 15 && this.remainingSeconds > 0) {
        if (this.onUrgent) this.onUrgent(this.remainingSeconds);
      }

      if (this.remainingSeconds <= 0) {
        this.pause();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume() {
    if (!this.isRunning && this.remainingSeconds > 0) {
      this.isRunning = true;
      this.start();
    }
  }

  addTime(seconds = 30) {
    this.remainingSeconds += seconds;
    this.totalDuration = Math.max(this.totalDuration, this.remainingSeconds);
    if (this.onTick) {
      this.onTick(this.remainingSeconds, this.totalDuration);
    }
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalDuration;
  }
}
