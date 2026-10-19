// Efecto de confeti y fuegos artificiales ligero para canvas HTML5
export class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = [
      '#FF5964', '#35A7FF', '#FFE74C', '#38B000', '#FF9E00', 
      '#9D4EDD', '#FF70A6', '#70D6FF', '#E9FF70'
    ];
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  burst(x, y, count = 70) {
    if (!this.canvas || !this.ctx) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      this.particles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        size: 5 + Math.random() * 7,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 1,
        decay: 0.016 + Math.random() * 0.02,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) {
      this.animationFrame = null;
      return;
    }

    // Limpiar fotograma anterior para no dejar rastro ni tapar el dibujo
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.particles.length === 0) {
      this.animationFrame = null;
      return;
    }

    this.ctx.save();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.24; // gravedad
      p.vx *= 0.97; // fricción aire
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    this.ctx.restore();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  clear() {
    this.particles = [];
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
