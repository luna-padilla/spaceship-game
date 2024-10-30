class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.ship = new Ship(ctx);
    this.background = new Background(ctx);
    this.explosion = new Explosion(ctx);
    this.shoots = [];
    this.score = 0; // Puntuación inicial
    this.lives = 3;
    this.invulnerable = false;
    this.invulnerableTimeout = 1000;

    this.explosionVisible = false; // Indica si la explosión es visible
    this.explosionX = 0;
    this.explosionY = 0;

    this.explosionDuration = 500; // Duración en ms
    this.enemy = [new Enemy(ctx)];

    this.audio = new Audio("/assets/audio/Space Heroes.ogg");
    this.audio.volume = 0.05;
    this.controlar();
    this.started = false;
    this.interval = null;
  }

  start() {
    this.audio.play();
    this.started = true;
    this.score = 0;
    this.lives = 3;
    this.invulnerable = false;
    let tick = 0;
    this.interval = setInterval(() => {
      this.clear();

      this.move();

      this.checkCollision();

      this.checkEnemigoDisparo();
      this.draw();
      this.displayScoreAndLives();

      tick++;
      if (tick >= 50) {
        tick = 0;

        this.addEnemy();
      }
    }, 1000 / 60);
  }

  pause() {
    this.audio.pause();
    this.started = false;
    clearInterval(this.interval);
  }

  addEnemy() {
    this.enemy.push(new Enemy(this.ctx));
  }

  addShoot() {
    const x = this.ship.x + this.ship.width + 30; // Ajusta la posición inicial del disparo
    const y = this.ship.y + this.ship.height + 5;
    this.shoots.push(new Shoot(this.ctx, x, y));
  }

  checkCollision() {
    if (this.invulnerable) return; // Si la nave es invulnerable, no revisa colisiones
    this.enemy.forEach((enemy) => {
      if (
        this.ship.x < enemy.x + enemy.w &&
        this.ship.x + this.ship.width > enemy.x &&
        this.ship.y < enemy.y + enemy.height &&
        this.ship.y + this.ship.height > enemy.y
      ) {
        // Almacena la posición de la explosión y actívala
        this.explosionX = this.ship.x + this.ship.width;
        this.explosionY = this.ship.y - this.ship.height + 5;
        this.explosionVisible = true;
        setTimeout(() => {
          this.explosionVisible = false; // Oculta la explosión después del tiempo definido
        }, this.explosionDuration);
        this.lives--; // Pierde una vida al colisionar
        if (this.lives <= 0) {
          this.pause(); // Pausa el juego si se queda sin vidas
        }
        this.activateInvulnerability();
      }
    });
  }

  checkEnemigoDisparo() {
    for (let i = this.shoots.length - 1; i >= 0; i--) {
      for (let j = this.enemy.length - 1; j >= 0; j--) {
        const shoot = this.shoots[i];
        const enemy = this.enemy[j];

        // Verifica la colisión entre el disparo y el enemigo
        if (
          shoot.x < enemy.x + enemy.w &&
          shoot.x + shoot.width > enemy.x &&
          shoot.y < enemy.y + enemy.height &&
          shoot.y + shoot.height > enemy.y
        ) {
          this.score += 10; // Aumenta la puntuación
          this.explosionX = this.enemy.x + this.enemy.w;
          this.explosionY = this.enemy.y - this.enemy.height + 5;
          this.explosionVisible = true;
          setTimeout(() => {
            this.explosionVisible = false; // Oculta la explosión después del tiempo definido
          }, this.explosionDuration);
          // Desvanece el disparo y el enemigo antes de eliminarlos
          const fadeInterval = setInterval(() => {
            shoot.opacity -= 0.1;
            enemy.opacity -= 0.1;

            // Elimina el disparo y el enemigo si su opacidad llega a cero
            if (shoot.opacity <= 0 && enemy.opacity <= 0) {
              this.enemy.splice(j, 1);
              this.shoots.splice(i, 1);
              clearInterval(fadeInterval); // Detiene el desvanecimiento
            }
          }, 600); // Ajusta la velocidad del desvanecimiento

          break; // Sale del bucle de enemigos para evitar errores
        }
      }
    }
  }

  activateInvulnerability() {
    this.invulnerable = true;
    setTimeout(() => {
      this.invulnerable = false; // Finaliza la invulnerabilidad después del tiempo definido
    }, this.invulnerableTimeout);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw() {
    this.background.draw();
    this.ship.draw();
    // Dibuja la explosión solo si es visible
    if (this.explosionVisible) {
      this.explosion.draw(this.explosionX, this.explosionY);
    }
    this.shoots.forEach((shoot) => shoot.draw());
    this.enemy.forEach((enemy) => {
      enemy.draw();
    });
  }

  move() {
    this.background.move();
    this.ship.move();

    this.shoots = this.shoots.filter((shoot) => {
      shoot.move();
      return !shoot.isOut();
    });

    this.enemy = this.enemy.filter((enemy) => {
      if (enemy.isOut()) {
        return false;
      }
      enemy.move();
      return true;
    });
  }

  displayScoreAndLives() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 50);
  }

  controlar() {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === KEY_SPACE) {
        event.preventDefault();
        this.addShoot(); // Añade un disparo si se presiona la tecla Espacio
      }
      this.ship.onKeyDown(event.keyCode);
    });
    document.addEventListener("keyup", (event) => {
      this.ship.onKeyUp(event.keyCode);
    });
  }
}
