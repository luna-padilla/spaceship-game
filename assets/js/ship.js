class Ship {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 40;
    this.y = this.ctx.canvas.height / 2;
    this.vy = 0;
    this.vx = 0;
    this.width = 75;
    this.height = 26;
    this.lives = 3;
    this.score = 0;
    this.lastShotTime = 0; // Tiempo del último disparo
    this.shootCooldown = 250; // 1000 ms = 1 segundo
    this.shoots = [];
    this.invulnerable = false;
    this.invulnerableTimeout = 1000;
    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/nave-modificado-tamano.png";
    this.enemies = [new Enemy(ctx)];
    this.spriteSheet.frames = 2;
    this.spriteSheet.frameIndex = 0;
    this.tick = 0;
    this.counterKilledEnemy=0;
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
        new Shoot(
          this.ctx,
          this.x + this.width - 10,
          this.y + this.height / 2,
          10,
          "/assets/images/laser-2.png"
        )
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
    if (this.x + this.width > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.width ;
    }
    if (this.y < 0) {
      this.y = 0;
    }

    if (this.y + this.height  > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.height ;
    }
  }

  draw() {
    this.tick++;
    if (this.invulnerable && Math.floor(this.tick / 10) % 2 === 0) {
      // En frames pares, no dibuja la nave, creando el efecto de parpadeo
      return;
    }
    this.ctx.globalAlpha = this.invulnerable ? 0.8 : 1; // Baja opacidad si es invulnerable
    const spriteX = 0; // Coordenada X en la hoja de sprites
    const spriteY = 0; // Coordenada Y en la hoja de sprites

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
    this.ctx.globalAlpha = 1; // Restaura la opacidad
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
    this.ctx.fillText(`Score: ${this.score}`, 50, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 140, 20);
  }

  checkCollision(game) {
    if (this.invulnerable) return;
    this.enemies.forEach((enemy, index) => {
      if (
        this.x < enemy.x + enemy.w &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y
      ) {
        // Almacena la posición de la explosión y actívala
        game.explosion.x = this.x + this.width - 35;
        game.explosion.y = this.y - this.height + 20;
        game.explosion.explosionVisible = true;
        this.enemies.splice(index, 1);
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
  addCounter(){
    this.counterKilledEnemy++;
  } 



}
