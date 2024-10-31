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
    this.lastShotTime = 0; // Tiempo del último disparo
    this.shootCooldown = 250; // 1000 ms = 1 segundo
    this.shoots = [];
    this.invulnerable = false;
    this.invulnerableTimeout = 500;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/gradius.png";
    this.enemies = [new Enemy(ctx)];
  }

  addScore() {
    this.score += 10;
  }

  reduceLives() {
    this.lives--;
  }
  
  restart() {
    this.lives = 3;
    this.score = 0;
  }
 
  addShoot() {
    const currentTime = Date.now(); // Obtiene el tiempo actual en milisegundos
    if (currentTime - this.lastShotTime >= this.shootCooldown) {
      // Solo dispara si ha pasado el tiempo de cooldown
      this.shoots.push(
        new Shoot(this.ctx, this.x + this.width, this.y + this.height / 2)
      );
      this.lastShotTime = currentTime; // Actualiza el tiempo del último disparo
    }
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

  activateInvulnerability() {
    this.invulnerable = true;
    setTimeout(() => {
      this.invulnerable = false; // Finaliza la invulnerabilidad después del tiempo definido
    }, this.invulnerableTimeout);
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

  displayScoreAndLives() {
    this.ctx.font = "10px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 120, 20);
  }

  checkCollision(game) {
    if (this.invulnerable) return; 
    this.enemies.forEach((enemy) => {
      if (
        this.x < enemy.x + enemy.w &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
        // Almacena la posición de la explosión y actívala
        game.explosion.x = this.x + this.width;
        game.explosion.y = this.y - this.height + 5;
        game.explosion.explosionVisible = true;
        setTimeout(() => {
          game.explosion.explosionVisible = false; // Oculta la explosión después del tiempo definido
        }, game.explosion.explosionDuration);
        this.reduceLives(); // Pierde una vida al colisionar
        if (this.lives <= 0) {
          game.gameOver();
        }
        this.activateInvulnerability();
      }
    });
  }

}
