class Ship {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 40;
    this.y = this.ctx.canvas.height / 2;
    this.vy = 0;
    this.vx = 0;
    this.width = 27;
    this.height = 17;
    this.lives = 3;
    this.score = 0;
    this.shoots = [];
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/gradius.png";
  }

  addScore() {
    this.score += 10;
  }

  reduceLives() {
    this.lives--;
  }

  addShoot() {
    const x = this.x + this.width + 30; // Ajusta la posición inicial del disparo
    const y = this.y + this.height + 5;
    this.shoots.push(new Shoot(this.ctx, x, y));
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width * 3 > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.width * 3;
    }
    if (this.y < 0) {
      this.y = 0;
    }

    if (this.y + this.height * 3 > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.height * 3;
    }
  }

  draw() {
    const spriteX = 0; // Coordenada X en la hoja de sprites
    const spriteY = 63; // Coordenada Y en la hoja de sprites

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
  
  onKeyDown(code) {
    switch (code) {
      case KEY_RIGHT:
        this.vx = 5;
        break;
      case KEY_UP:
        this.vy = -5;
        break;
      case KEY_LEFT:
        this.vx = -5;
        break;
      case KEY_DOWN:
        this.vy = 5;
        break;
    }
  }

  onKeyUp(code) {
    switch (code) {
      case KEY_RIGHT:
      case KEY_LEFT:
        this.vx = 0;
        break;
      case KEY_UP:
      case KEY_DOWN:
        this.vy = 0;
        break;
    }
  }
  
  handleShipControls() {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === KEY_SPACE) {
        event.preventDefault();
        this.addShoot(); // Añade un disparo si se presiona la tecla Espacio
      }
      this.onKeyDown(event.keyCode);
    });
    document.addEventListener("keyup", (event) => {
      this.onKeyUp(event.keyCode);
    });
  }

}