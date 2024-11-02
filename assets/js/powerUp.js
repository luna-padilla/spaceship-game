class PowerUp {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = this.ctx.canvas.width -50;
    this.width = 87;
    this.height = 87;
    this.vx = -5;
    const margin = 50; // Ajusta este valor según tus necesidades
    this.y = 
      Math.floor(
        Math.random() * (this.ctx.canvas.height - this.height - 2 * margin)
      ) ;
    
    this.img = new Image();
    this.img.src = "/assets/images/bonus_life.png";
  }

  draw() {
    console.log("entro en dibujar powerup")
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width/3,
      this.height/3
    );
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
}
