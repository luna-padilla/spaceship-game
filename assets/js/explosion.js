class Explosion {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.aceleracionX = 0;
    this.aceleracionY = 0;

    this.width = 0;
    this.height = 87;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/gradius.png";
  }

//   move() {
//     this.x += this.aceleracionX;
//     this.y += this.aceleracionY;
//     this.x += this.vx;
//     this.y += this.vy;
//     if (this.x < 0) {
//       this.x = 0;
//     }
//     if (this.x + this.width * 3 > this.ctx.canvas.width) {
//       this.x = this.ctx.canvas.width - this.width * 3;
//     }
//     if (this.y < 0) {
//       this.y = 0;
//     }

//     if (this.y + this.height * 3 > this.ctx.canvas.height) {
//       this.y = this.ctx.canvas.height - this.height * 3;
//     }
//   }
  draw() {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const spriteX = 0; // Coordenada X en la hoja de sprites
    const spriteY = 87; // Coordenada Y en la hoja de sprites

    this.ctx.drawImage(
      this.spriteSheet,
      spriteX,
      spriteY, // Coordenadas de la esquina superior izquierda del sprite en la hoja
      this.width,
      this.height, // Ancho y alto del sprite en la hoja
      this.x,
      this.y, // Coordenadas donde se dibujará el sprite en el canvas
      this.width * 3,
      this.height * 3 // Ancho y alto del sprite al dibujarlo
    );
  }
}
