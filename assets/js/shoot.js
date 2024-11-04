class Shoot {
  constructor(ctx, x, y, speed, src) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 126;
    this.height = 81;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/plasm.png";
  }

  move() {
    this.x += this.speed;
  }

  draw() {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const spriteX = 0; // Coordenada X en la hoja de sprites
    const spriteY = 0; // Coordenada Y en la hoja de sprites

    this.ctx.drawImage(
      this.spriteSheet,
      spriteX,
      spriteY, // Coordenadas de la esquina superior izquierda del sprite en la hoja
      this.width,
      this.height, // Ancho y alto del sprite en la hoja
      this.x,
      this.y, // Coordenadas donde se dibujará el sprite en el canvas
      this.width / 3,
      this.height / 3 // Ancho y alto del sprite al dibujarlo
    );
  }

  isOut() {
    let fuera = false;
    if (this.x + this.width < 0) {
      fuera = true;
      return fuera;
    }
    return fuera;
  }
}
