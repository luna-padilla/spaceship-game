class Ship extends GameObject {
  constructor(ctx, positionComponent, velocityComponent) {
    super(positionComponent, velocityComponent);
    this.ctx = ctx;
    this.acceleration = 10; // Tasa de incremento de velocidad
    this.maxSpeed = 10; // Velocidad máxima
    this.playerStats = new PlayerStats(ctx, 300);
    this.width = 75;
    this.height = 26;
    this.lastShotTime = 0; // Tiempo del último disparo
    this.shootCooldown = 250; // 1000 ms = 1 segundo
    this.shoots = [];

    this.invulnerable = false;
    this.invulnerableTimeout = 1000;

    this.spriteSheet = new Image();
    this.spriteSheet.src = "/assets/images/nave-modificado-tamano.png";
    this.spriteSheet.frames = 2;
    this.spriteSheet.frameIndex = 0;

    this.enemies = [new Enemy(ctx)];

    this.tick = 0;
    this.counterKilledEnemy = 0;
  }

  addShoot() {
    const currentTime = Date.now(); // Obtiene el tiempo actual en milisegundos
    if (currentTime - this.lastShotTime >= this.shootCooldown) {
      // Solo dispara si ha pasado el tiempo de cooldown
      this.shoots.push(
        new Shoot(
          this.ctx,
          new PositionComponent(
            this.position.x + this.width - 10,
            this.position.y + this.height / 2
          ),
          new VelocityComponent(10, 0),

          "/assets/images/laser-2.png"
        )
      );
      this.lastShotTime = currentTime; // Actualiza el tiempo del último disparo
    }
  }

  move() {
    this.velocity.vx *= 0.98; // Factor de fricción
    this.velocity.vy *= 0.98;
    this.velocity.update(this.position);
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.width > this.ctx.canvas.width) {
      this.position.x = this.ctx.canvas.width - this.width;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }

    if (this.position.y + this.height > this.ctx.canvas.height) {
      this.position.y = this.ctx.canvas.height - this.height;
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
      this.position.x,
      this.position.y, // Coordenadas donde se dibujará el sprite en el canvas
      this.width,
      this.height // Ancho y alto del sprite al dibujarlo
    );
    this.ctx.globalAlpha = 1; // Restaura la opacidad
  }

  onKeyDown(code) {
    switch (code) {
      case KEY_RIGHT:
        this.velocity.vx = Math.min(
          this.velocity.vx + this.acceleration,
          this.maxSpeed
        );
        break;
      case KEY_UP:
        this.velocity.vy = Math.max(
          this.velocity.vy - this.acceleration,
          -this.maxSpeed
        );
        break;
      case KEY_LEFT:
        this.velocity.vx = Math.max(
          this.velocity.vx - this.acceleration,
          -this.maxSpeed
        );
        break;
      case KEY_DOWN:
        this.velocity.vy = Math.min(
          this.velocity.vy + this.acceleration,
          this.maxSpeed
        );
        break;

      case KEY_SHIFT: // Tecla Shift para dash
        this.velocity.vx *= 2; // Duplica la velocidad en el eje X
        this.velocity.vy *= 2; // Duplica la velocidad en el eje Y
        setTimeout(() => {
          // Después de un breve momento, vuelve la velocidad a la normalidad
          this.velocity.vx /= 2;
          this.velocity.vy /= 2;
        }, 200); // Duración del dash en milisegundos
        break;
    }
  }

  onKeyUp(code) {
    switch (code) {
      case KEY_RIGHT:
      case KEY_LEFT:
        this.velocity.vx = 0;
        break;
      case KEY_UP:
      case KEY_DOWN:
        this.velocity.vy = 0;
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

  checkCollision(game) {
    if (this.invulnerable) return;
    this.enemies.forEach((enemy, index) => {
      if (
        this.position.x < enemy.x + enemy.w &&
        this.position.x + this.width > enemy.x &&
        this.position.y < enemy.y + enemy.height &&
        this.position.y + this.height > enemy.y
      ) {
        // Almacena la posición de la explosión y actívala
        game.explosion.x = this.position.x + this.width - 35;
        game.explosion.y = this.position.y - this.height + 20;
        game.explosion.explosionVisible = true;
        this.enemies.splice(index, 1);
        setTimeout(() => {
          game.explosion.explosionVisible = false; // Oculta la explosión después del tiempo definido
        }, game.explosion.explosionDuration);
        this.playerStats.reduceLives(); // Pierde una vida al colisionar
        if (this.playerStats.isGameOver()) {
          game.gameOver();
        }
        this.activateInvulnerability();
      }
    });
  }
  addCounter() {
    this.counterKilledEnemy++;
  }
}