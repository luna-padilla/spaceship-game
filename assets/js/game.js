class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.ship = new Ship(
      ctx,
      new PositionComponent(40, this.ctx.canvas.height / 2),
      new VelocityComponent(0, 0)
    );
    this.ship.handleShipControls();
    this.background = new Background(ctx);
    this.explosion = new Explosion(ctx);
    this.enemy = new Enemy(ctx);
    this.menu = new Menu(ctx);
    this.menu.handleKeypresses(this);
    this.powerUp = new PowerUp(
      ctx,
      new PositionComponent(
        -200,
       -200
      ),
      new VelocityComponent(-1, 0)
    );

    this.audio = new Audio("assets/audio/Space Heroes.ogg");
    this.audio.volume = 0.05;
    this.interval = null;
  }


  generateHorde() {
    const enemyCountPerRow = 2; // Número de enemigos por fila
    const rowSpacing = 80; // Espacio entre filas
    const columnSpacing = 60; // Espacio entre columnas
    const startY = -50; // Posición Y inicial (fuera de pantalla)
    const totalEnemies = 4; // Número total de enemigos por horda (3 por cada lado)
    const canvasMidpoint = this.ctx.canvas.width / 2; // Generar enemigos desde el lado izquierdo hacia el centro

    for (let i = 0; i < totalEnemies / 2; i++) {
      const x = Math.random() * (canvasMidpoint / 2); // Posición aleatoria en la mitad izquierda
      const y = startY - i * rowSpacing; // Espaciado vertical
      const enemy = new Enemy(this.ctx);
      enemy.x = x;
      enemy.y = y;
      this.ship.enemies.push(enemy);
    } // Generar enemigos desde el lado derecho hacia el centro

    for (let i = 0; i < totalEnemies / 2; i++) {
      const x = canvasMidpoint + Math.random() * (canvasMidpoint / 2); // Posición aleatoria en la mitad derecha
      const y = startY - i * rowSpacing; // Espaciado vertical
      const enemy = new Enemy(this.ctx);
      enemy.x = x;
      enemy.y = y;
      this.ship.enemies.push(enemy);
    }
  }

  start() {
    this.audio.play();
    this.menu.gameState = "playing";
    let tick = 0;

    this.interval = setInterval(() => {
      this.clear();
      this.draw();
      if (this.menu.gameState === "playing") {
        this.ship.enemies.forEach((enemy) => {
          enemy.addShoot();
        });
        this.ship.checkCollision(this);
        this.powerUp.checkCollision(this.ship);
        this.enemy.checkHitByShipShoot(this.ship, this);

        this.ship.enemies.forEach((enemy) => {
          enemy.checkShootEnemy(this);
        });

        this.enemy.checkShootEnemy(this);
        this.move();
        this.ship.playerStats.displayStats();

        tick++;
        if (tick >= 400) {
          tick = 0;
          this.generateHorde();
        }
      }
    }, 1000 / 60);
  }

  pause() {
    this.audio.pause();
    clearInterval(this.interval);
    this.menu.gameState = "paused";
    this.menu.drawMenu();
  }

  gameOver() {
    this.audio.pause();
    clearInterval(this.interval);
    this.menu.gameState = "gameOver";
    this.menu.drawMenu();
  }

  resume() {
    this.audio.play();
    this.start();
  }

  restart() {
    this.ship.enemies = [new Enemy(this.ctx)];
    this.menu.gameState = "playing";
    this.ship.playerStats.restart();
    this.start();
  }

  endGame() {
    this.audio.pause();
    clearInterval(this.interval);
    this.ship.playerStats.restart();
    this.ship.enemies = [new Enemy(this.ctx)];
    this.menu.gameState = "menu";
    this.menu.drawMenu();
  }

  addEnemy() {
    this.ship.enemies.push(new Enemy(this.ctx));
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
    this.ship.enemies.forEach((enemy) => {
      enemy.draw();
      if (this.explosion.explosionVisible) {
        this.explosion.draw(this.explosion.x, this.explosion.y);
      }
    });
    this.ship.enemies.forEach((enemy) =>
      enemy.shoots.forEach((shoot) => {
        shoot.draw();
      })
    );
    if (this.menu.gameState !== "playing") {
      this.menu.drawMenu(); // Dibuja el menú en los estados pausado, Al inicio y gameOver
    }

    if (this.ship.counterKilledEnemy >= 5 && this.ship.counterKilledEnemy % 5 == 0)
    this.powerUp.draw();
  }

  move() {
    this.background.move();
    this.ship.shoots = this.ship.shoots.filter((shoot) => {
      shoot.move();
      return !shoot.isOut();
    });
    this.ship.move();

    this.ship.enemies = this.ship.enemies.filter((enemy) => {
      if (enemy.isOut()) {
        return false;
      }
      enemy.move();
      return true;
    });

    this.ship.enemies.forEach((enemy) => {
      enemy.shoots = enemy.shoots.filter((shoot) => {
        shoot.move();
        return !shoot.isOut();
      });
    });
    if (this.ship.counterKilledEnemy >= 5 && this.ship.counterKilledEnemy % 5 == 0)
    this.powerUp.move();
  }
}
