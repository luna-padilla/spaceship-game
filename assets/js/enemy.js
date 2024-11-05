class Enemy {
  constructor(ctx) {
    this.ctx = ctx;
    this.w = 52;
    this.height = 46;
    this.x = Math.random() * (this.ctx.canvas.width - this.w); // Posición aleatoria en el eje X
    this.y = -this.height; // Aparece justo fuera de la parte superior del canvas
    this.vx = 0; // No se mueve horizontalmente
    this.vy = 2; // Velocidad hacia abajo para que se desplace hacia el jugador

    this.img = new Image();
    this.enemyImages = [
      "assets/images/insect-1.png",
      "assets/images/insect-2.png",
    ];

    this.img.src =
      this.enemyImages[Math.floor(Math.random() * this.enemyImages.length)];
    this.lastShotTime = 0;
    this.shootCooldown = 2000;
    this.shoots = [];
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.w,
      this.height,
      this.x,
      this.y,
      this.w,
      this.height
    );
  }

  move() {
    // Actualizar la posición Y para que el enemigo baje
    this.y += this.vy;

    if (this.y > this.ctx.canvas.height) {
      // Si el enemigo sale de la pantalla, podrías reiniciarlo o eliminarlo
      this.y = -this.height; // Reinicia en la parte superior
      this.x = Math.random() * (this.ctx.canvas.width - this.w); // Nueva posición X aleatoria
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

  checkHitByShipShoot(ship, game) {
    // Recorre cada disparo de la nave
    for (let i = ship.shoots.length - 1; i >= 0; i--) {
      const shoot = ship.shoots[i];
      for (let j = 0; j < ship.enemies.length; j++) {
        const enemie = ship.enemies[j];
        // Verifica si el disparo ha colisionado con el enemigo
        if (
          shoot.position.x < enemie.x + enemie.w &&
          shoot.position.x + shoot.width > enemie.x &&
          shoot.position.y < enemie.y + enemie.height &&
          shoot.position.y + shoot.height > enemie.y
        ) {
          ship.addCounter();
          ship.playerStats.increaseKilledEnemies(); // Incrementa el contador de enemigos
          ship.playerStats.addScore(10);
          
          
          if (ship.counterKilledEnemy >= 5 && ship.counterKilledEnemy % 5 == 0) {
            game.powerUp.position.x = enemie.x;
            game.powerUp.position.y = enemie.y;
          }
          // Puedes reducir la vida del enemigo o dar puntos al jugador aquí
          ship.playerStats.addScore(10);

          game.explosion.x = enemie.x;
          game.explosion.y = enemie.y;
          game.explosion.explosionVisible = true;
          game.explosion.soundExplosion();
          setTimeout(() => {
            game.explosion.explosionVisible = false; // Oculta la explosión después de explosionDuration
          }, game.explosion.explosionDuration);
          // Elimina el disparo de la nave
          ship.shoots.splice(i, 1);
          ship.enemies.splice(j, 1);

          // Detén la iteración si solo queremos detectar un disparo por enemigo
          break;
        }
      }
    }
  }

  checkShootEnemy(game) {
    if (game.ship.invulnerable) return;
    for (let i = this.shoots.length - 1; i >= 0; i--) {
      const shoot = this.shoots[i];

      // Verifica la colisión entre el disparo del enemigo y la nave del jugador
      if (
        shoot.position.x < game.ship.position.x + game.ship.width &&
        shoot.position.x + shoot.width > game.ship.position.x &&
        shoot.position.y < game.ship.position.y + game.ship.height &&
        shoot.position.y + shoot.height > game.ship.position.y
      ) {
        game.ship.activateInvulnerability();

        game.ship.playerStats.reduceLives(); // Reduce la puntuación
        if (game.ship.playerStats.isGameOver()) {
          game.gameOver();
        }
        // Explosión en la posición del enemigo
        game.explosion.x = game.ship.position.x;
        game.explosion.y = game.ship.position.y;
        game.explosion.explosionVisible = true;
        game.explosion.soundExplosion();
        setTimeout(() => {
          game.explosion.explosionVisible = false; // Oculta la explosión después de explosionDuration
        }, game.explosion.explosionDuration);

        // Elimina el disparo

        this.shoots.splice(i, 1);

        // Salir del bucle
        break;
      }
    }
  }

  addShoot() {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime >= this.shootCooldown) {
      this.shoots.push(
        new Shoot(
          this.ctx,
          new PositionComponent(
            this.x + this.w / 2 - 5,
            this.y + this.height / 2
          ), // Posición en la parte inferior del enemigo
          new VelocityComponent(0, 5), // Velocidad hacia abajo
          "../images/bullet-2.png"
        )
      );
      this.lastShotTime = currentTime;
    }
  }
}
