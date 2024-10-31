class Shoot {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 483 / 5;
    this.height = 89 / 5;
    this.speed = 10;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/disparos.png";
  }

  move() {
    this.x += this.speed;
  }
  
  draw() {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const spriteX = 210; // Coordenada X en la hoja de sprites
    const spriteY = 1780; // Coordenada Y en la hoja de sprites

    this.ctx.drawImage(
      this.spriteSheet,
      spriteX,
      spriteY, // Coordenadas de la esquina superior izquierda del sprite en la hoja
      this.width,
      this.height, // Ancho y alto del sprite en la hoja
      this.x,
      this.y, // Coordenadas donde se dibujará el sprite en el canvas
      this.width,
      this.height // Ancho y alto del sprite al dibujarlo
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
