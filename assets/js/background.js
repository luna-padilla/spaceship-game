class Background {
    constructor(ctx) {
      this.ctx = ctx;
      this.x = 0;
      this.y = 0;
      this.vx = -3;
  
      this.w = this.ctx.canvas.width;
      this.h = this.ctx.canvas.height;
      this.image = new Image();
      this.image.src = "/assets/images/Cielo_estrellado.jpg";
    }
  
    draw() {
      this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  
      this.ctx.drawImage(this.image, this.x + this.w, this.y, this.w, this.h);
    }
    move() {
      //move background
      this.x += this.vx;
  
      //restart position if out of canvas
      if (this.x + this.w <= 0) {
        this.x = 0;
      }
    }
  }
  