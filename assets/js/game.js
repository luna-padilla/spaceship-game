class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.ship = new Ship(ctx);
    this.ship.handleShipControls();
    this.ship.invulnerable = false;
    this.background = new Background(ctx);
    this.explosion = new Explosion(ctx);
    this.enemy = [new Enemy(ctx)];
    this.audio = new Audio("/assets/audio/Space Heroes.ogg");
    this.audio.volume = 0.05;
    this.started = false;
    this.interval = null;
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (this.gameState === "playing") {
          this.pause();
        } else if (this.gameState === "paused") {
          this.resume();
        }
      }
    });
    this.gameState = "menu"; // Estados posibles: "menu", "playing", "paused", "gameOver"
    this.buttons = {}; // Para almacenar las áreas de los botones
  }

  start() {
    this.audio.play();
    this.started = true;
    this.gameState = "playing";
    let tick = 0;
    this.interval = setInterval(() => {
      this.clear();
      this.draw();
      if (this.gameState === "playing") {
        this.checkCollision();
        this.checkEnemyHit();
        this.move();
        this.displayScoreAndLives();

        tick++;
        if (tick >= 20) {
          tick = 0;
          this.addEnemy();
        }
      }
    }, 1000 / 60);
  }

  pause() {
    this.audio.pause();
    clearInterval(this.interval);
    this.gameState = "paused";
    this.drawMenu();
  }
  gameOver() {
    this.audio.pause();
    clearInterval(this.interval);
    this.gameState = "gameOver";
    this.drawMenu();
  }
  resume() {
    alert("resume");
    this.audio.play();
    this.start();
  }
  restart() {
    alert("restart");
    // this.ship.reset(); // Supongamos que existe un método reset() en Ship
    this.enemy = [new Enemy(this.ctx)];
    this.gameState = "playing";
    this.start();
  }

  endGame() {
    this.audio.pause();
    clearInterval(this.interval);
    this.gameState = "menu";
    this.drawMenu();
  }

  drawMenu() {
    this.clear();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "white";
    const fontSize = 30;
    this.ctx.font = `${fontSize}px 'Press Start 2P'`;
    ///////////////////////////////////////////////
    if (this.gameState === "menu") {
      this.ctx.fillText(
        "Start Game",
        this.ctx.canvas.width / 2 - 150,
        this.ctx.canvas.height / 2 + 15
      );

      this.buttons.start = {
        x: this.ctx.canvas.width / 2 - 150,
        y: this.ctx.canvas.height / 2 + 15 - fontSize,
        width: fontSize * "Start Game".length,
        height: fontSize,
      };
      ///////////////////////////////////////
    } else if (this.gameState === "paused") {
      const centerWordX = this.ctx.canvas.width / 2 - 90;

      this.ctx.fillText("Resume", centerWordX, this.ctx.canvas.height / 2 - 40);

      this.ctx.fillText(
        "Restart",
        centerWordX,
        this.ctx.canvas.height / 2 + 20
      );

      this.ctx.fillText("Quit", centerWordX, this.ctx.canvas.height / 2 + 80);

      this.buttons.resume = {
        x: centerWordX,
        y: this.ctx.canvas.height / 2 - 40 - fontSize,
        width: fontSize * "Resume".length,
        height: fontSize,
      };

      this.buttons.restart = {
        x: centerWordX,
        y: this.ctx.canvas.height / 2 + 20 - fontSize,
        width: fontSize * "Restart".length,
        height: fontSize,
      };

      this.buttons.quit = {
        x: centerWordX,
        y: this.ctx.canvas.height / 2 + 80 - fontSize,
        width: fontSize * "Quit".length,
        height: fontSize,
      };
    }
    /////////////////////////////
    else if (this.gameState === "gameOver") {
      const centerWordX = this.ctx.canvas.width / 2 - 160;
      this.ctx.fillText(
        "Game Over!",
        centerWordX,
        this.ctx.canvas.height / 2 - 80
      );
      this.ctx.fillText("Restart", centerWordX, this.ctx.canvas.height / 2);
      this.ctx.fillText("Quit", centerWordX, this.ctx.canvas.height / 2 + 60);
      this.buttons.restart = {
        x: centerWordX,
        y: this.ctx.canvas.height / 2 - fontSize,
        width: fontSize * "Restart".length,
        height: fontSize,
      };
      this.buttons.quit = {
        x: centerWordX,
        y: this.ctx.canvas.height / 2 + 60 - fontSize,
        width: fontSize * "Quit".length,
        height: fontSize,
      };
    }
  }

  handleClick(x, y) {
    if (this.gameState === "menu" && this.isInside(x, y, this.buttons.start)) {
      this.start();
    } else if (this.gameState === "paused") {
      if (this.isInside(x, y, this.buttons.resume)) this.resume();
      else if (this.isInside(x, y, this.buttons.restart)) this.restart();
      else if (this.isInside(x, y, this.buttons.quit)) this.endGame();
    } else if (this.gameState === "gameOver") {
      if (this.isInside(x, y, this.buttons.restart)) this.restart();
      else if (this.isInside(x, y, this.buttons.quit)) this.endGame();
    }
  }

  isInside(x, y, button) {
    return (
      x > button.x &&
      x < button.x + button.width &&
      y > button.y &&
      y < button.y + button.height
    );
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
        this.explosion.x = this.ship.x + this.ship.width;
        this.explosion.y = this.ship.y - this.ship.height + 5;
        this.explosion.explosionVisible = true;
        setTimeout(() => {
          this.explosion.explosionVisible = false; // Oculta la explosión después del tiempo definido
        }, this.explosion.explosionDuration);
        this.ship.reduceLives(); // Pierde una vida al colisionar
        if (this.ship.lives <= 0) {
          this.gameOver();
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
          this.explosion.y = enemy.y;
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

    if (this.gameState !== "playing") {
      this.drawMenu(); // Dibuja el menú en los estados pausado y gameOver
    }
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
    this.ctx.font = "10px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.ship.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.ship.lives}`, 120, 20);
  }
}
