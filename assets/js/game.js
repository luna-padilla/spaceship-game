class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.ship = new Ship(ctx);
    this.background = new Background(ctx);
    this.explosion = new Explosion(ctx);
    // this.invulnerable = false;
    // this.invulnerableTimeout = 1000; 
    this.enemy = [new Enemy(ctx)];
    this.audio = new Audio("/assets/audio/Space Heroes.ogg");
    this.audio.volume = 0.05;
    this.ship.handleShipControls();
    this.started = false;
    this.interval = null;
  }

  start() {
    this.audio.play();
    this.started = true;

    this.ship.invulnerable = false;
    let tick = 0;
    this.interval = setInterval(() => {
      this.clear();
      this.draw();
     
      this.checkCollision(); 
     
      this.checkEnemyHit();

      this.move();

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

  checkCollision() {
    if (this.ship.invulnerable) return; // Si la nave es invulnerable, no revisa colisiones
    this.enemy.forEach((enemy) => {
      if (
        this.ship.x < enemy.x + enemy.w &&
        this.ship.x + this.ship.width > enemy.x &&
        this.ship.y < enemy.y + enemy.height &&
        this.ship.y + this.ship.height > enemy.y
      ) {
        // Almacena la posición de la explosión y actívala
        this.explosion.x= this.ship.x + this.ship.width;
        this.explosion.y = this.ship.y - this.ship.height + 5;
        this.explosion.explosionVisible = true;
        setTimeout(() => {
          this.explosion.explosionVisible = false; // Oculta la explosión después del tiempo definido
        }, this.explosion.explosionDuration);
        this.ship.reduceLives(); // Pierde una vida al colisionar
        if (this.ship.lives <= 0) {
          this.pause(); // Pausa el juego si se queda sin vidas
        }
        this.ship.activateInvulnerability();
      }
    });
  }

 

  checkEnemyHit() {
    for (let i = this.ship.shoots.length - 1; i >= 0; i--) {
      const shoot = this.ship.shoots[i];
      for (let j = this.enemy.length - 1; j >= 0; j--) {
        const enemy = this.enemy[j];

        // Verifica la colisión entre el disparo y el enemigo
        if (
          shoot.x < enemy.x + enemy.w &&
          shoot.x + shoot.width > enemy.x &&
          shoot.y < enemy.y + enemy.height &&
          shoot.y + shoot.height > enemy.y
        ) {
          this.ship.addScore(); // Aumenta la puntuación

          // Explosión en la posición del enemigo
          this.explosion.x = enemy.x;
          this.explosion.y= enemy.y;
          this.explosion.explosionVisible = true;

          setTimeout(() => {
            this.explosion.explosionVisible = false; // Oculta la explosión después de explosionDuration
          }, this.explosion.explosionDuration);

          // Elimina el disparo y el enemigo que colisionan
          this.enemy.splice(j, 1);
          this.ship.shoots.splice(i, 1);

          // Salir del bucle de enemigos una vez procesado
          break;
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
    if (this.explosion.explosionVisible) {
      this.explosion.draw(this.explosion.x, this.explosion.y);
    }
    this.ship.shoots.forEach((shoot) => shoot.draw());
    this.enemy.forEach((enemy) => {
      enemy.draw();
    });
  }

  move() {
    this.background.move();
    this.ship.shoots = this.ship.shoots.filter((shoot) => {
      shoot.move();
      return !shoot.isOut();
    });
    this.ship.move();

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
    this.ctx.fillText(`Score: ${this.ship.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.ship.lives}`, 10, 50);
  }
}
