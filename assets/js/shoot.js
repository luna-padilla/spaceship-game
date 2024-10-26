class Shoot {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.width = 483;
    this.height = 89;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/disparos.png";
  }

  draw(x, y) {
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
      this.width/5,
      this.height/5 // Ancho y alto del sprite al dibujarlo
    );
  }
}
