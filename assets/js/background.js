class Background {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 1; // velocidad de desplazamiento hacia abajo

    this.w = this.ctx.canvas.width;
    this.h = this.ctx.canvas.height;
    this.image = new Image();
    this.image.src = "assets/images/fondo-estrellas-azulado.png";
  }

  draw() {
    // Dibuja la imagen principal
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    // Dibuja una copia de la imagen en la parte superior o inferior, según la dirección del movimiento
    this.ctx.drawImage(this.image, this.x, this.y - this.h, this.w, this.h);
  }

  move() {
    // Mueve el fondo hacia abajo
    this.y += this.vy;

    // Reinicia la posición cuando la imagen principal ha salido completamente de la pantalla
    if (this.y >= this.h) {
      this.y = 0;
    }
  }
}
