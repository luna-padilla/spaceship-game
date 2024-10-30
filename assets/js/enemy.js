class Enemy {
    constructor(ctx) {
      this.ctx = ctx;
      this.w = 30;
      this.height = 75;
      this.x = this.ctx.canvas.width - this.w - 20; // Posición inicial en el eje X
      const margin = 50; // Ajusta este valor según tus necesidades
      this.opacity = 1; // Propiedad de opacidad
      this.y =
        Math.floor(
          Math.random() * (this.ctx.canvas.height - this.height - 2 * margin)
        ) + margin;
      this.vx = -5; // Velocidad en X (se mueve. hacia la izquierda)
      this.img = new Image();
      this.img.src = "/assets/images/gradius.png"; // Imagen del enemigo
    }
  
    draw() {
      this.ctx.globalAlpha = this.opacity; // Ajusta la opacidad al dibujar
      this.ctx.drawImage(this.img, 79, 64, 15, 15, this.x, this.y, this.w, this.height);
      this.ctx.globalAlpha = 1; // Restaura la opacidad
    }
    move() {
      // Actualizar la posición X con la velocidad
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
  }
  