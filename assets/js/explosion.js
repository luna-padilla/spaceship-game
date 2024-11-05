class Explosion {
  constructor(ctx) {
    this.ctx = ctx;
    this.explosionVisible = false; // Indica si la explosión es visible
    this.x = 0;
    this.y = 0;
    this.explosionDuration = 375; // Duración en ms
    this.width = 15;
    this.height = 18;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "assets/images/gradius.png";

    this.explosionSound = new Audio(
      "assets/audio/Retro Explosion Short 15.wav"
    );
    this.explosionSound.volume = 0.15;
  }

  soundExplosion(){
     // Reproduce el sonido de disparo
     this.explosionSound.currentTime = 0; // Reinicia el sonido para permitir disparos rápidos
     this.explosionSound.play();
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
      this.width * 3,
      this.height * 3 // Ancho y alto del sprite al dibujarlo
    );
  }
}
