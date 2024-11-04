class PowerUp {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = this.ctx.canvas.width - 50;
    this.width = 87;
    this.height = 87;
    this.vx = -1;
    const margin = 50; // Ajusta este valor según tus necesidades
    this.y = Math.floor(
      Math.random() * (this.ctx.canvas.height - this.height - 2 * margin)
    );

    this.img = new Image();
    this.img.src = "/assets/images/bonus_life.png";
    this.tick = 0;
    this.blinking = false;
    this.blinkingTimeout = 1000;
    this.timeoutId;
  }

  draw() {
    this.tick++;
    setTimeout(() => {
      this.activateBlink();
    }, 1500);
    if (this.blinking && Math.floor(this.tick / 10) % 3 === 0) {
      // En frames pares, no dibuja la nave, creando el efecto de parpadeo
      return;
    }

    this.ctx.globalAlpha = this.blinking ? 0.8 : 1;
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width / 3,
      this.height / 3
    );
    this.ctx.globalAlpha = 1; // Restaura la opacidad
  }

  move() {
    this.x += this.vx;
    if (this.y < 0) {
      this.y = 0;
    }

    if (this.y + this.height > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.height;
    }
  }

  isOut() {
    let fuera = false;
    if (this.x + this.w < 0) {
      fuera = true;
      return fuera;
    }
    return fuera;
  }

  activateBlink() {
    this.blinking = true;
    setTimeout(() => {
      this.blinking = false;
      this.x = -1000;
    }, this.blinkingTimeout);
  }

  checkCollision(ship) {
    if (
      this.x < ship.position.x + ship.width &&
      this.x + this.width > ship.position.x &&
      this.y < ship.position.y + ship.height &&
      this.y + this.height > ship.position.y
    ) {
      ship.playerStats.addLives();
      this.x = -1000;
    }
  }
}