class Shoot {
    constructor(ctx) {
      this.ctx = ctx;
  
      this.width = 15;
      this.height = 18;
      this.spriteSheet = new Image();
      this.spriteSheet.src = "/assets/images/gradius.png";
    }
  
    draw(x,y) {
      // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const spriteX = 0; // Coordenada X en la hoja de sprites
      const spriteY = 80; // Coordenada Y en la hoja de sprites
  
      this.ctx.drawImage(
        this.spriteSheet,
        spriteX,
        spriteY, // Coordenadas de la esquina superior izquierda del sprite en la hoja
        this.width,
        this.height, // Ancho y alto del sprite en la hoja
        x,
        y, // Coordenadas donde se dibujará el sprite en el canvas
        this.width * 5,
        this.height * 5// Ancho y alto del sprite al dibujarlo
      );
    }
  }
  