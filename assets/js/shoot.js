class Shoot extends GameObject {
  constructor(ctx, positionComponent, velocityComponent, src) {
    super(positionComponent, velocityComponent);
    this.ctx = ctx;
    this.width = 126;
    this.height = 81;
    this.spriteSheet = new Image();
    this.spriteSheet.src = src;
  }

  move() {
    this.velocity.update(this.position);
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
      this.position.x,
      this.position.y, // Coordenadas donde se dibujará el sprite en el canvas
      this.width / 3,
      this.height / 3 // Ancho y alto del sprite al dibujarlo
    );
  }

  isOut() {
    let fuera = false;
    if (this.position.x + this.width < 0) {
      fuera = true;
      return fuera;
    }
    return fuera;
  }
}
