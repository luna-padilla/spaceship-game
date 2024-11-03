class Enemy {
  constructor(ctx) {
    this.ctx = ctx;
    this.w = 64;
    this.height = 32;
    this.x = this.ctx.canvas.width - this.w - 20; // Posición inicial en el eje X
    const margin = 50; // Ajusta este valor según tus necesidades

    this.y =
      Math.floor(
        Math.random() * (this.ctx.canvas.height - this.height - 2 * margin)
      ) + margin;
    this.vx = Math.floor(Math.random() * 3) - 5;

    this.img = new Image();

    this.enemyImages = [
      // "/assets/images/small-A.png",
      // "/assets/images/small-B.png", // Otra imagen de ejemplo
      "/assets/images/naves-enemigas.png",
    ];
    this.img.src =
      this.enemyImages[Math.floor(Math.random() * this.enemyImages.length)]; // Selecciona una imagen aleatoria del arreglo
    this.lastShotTime = 0; // Tiempo del último disparo
    this.shootCooldown = 1600; // 1000 ms = 1 segundo
    this.shoots = [];
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      150,
      90,
      62,
      30,
      this.x,
      this.y,
      this.w,
      this.height
    );
  }

  move() {
    // Actualizar la posición X con la velocidad
    this.x += this.vx;

    if (this.y < 0) {
      this.y = 0;
    }

    if (this.y + this.height > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.height;
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
          shoot.x < enemie.x + enemie.w &&
          shoot.x + shoot.width > enemie.x &&
          shoot.y < enemie.y + enemie.height &&
          shoot.y + shoot.height > enemie.y
        ) {
          ship.addCounter();
          if (ship.counterKilledEnemy % 5 == 0) {
            game.powerUp.x = enemie.x;
            game.powerUp.y = enemie.y;
            
          }
          // Puedes reducir la vida del enemigo o dar puntos al jugador aquí
          // ship.addScore();
          game.explosion.x = enemie.x;
          game.explosion.y = enemie.y;
          game.explosion.explosionVisible = true;

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
        shoot.x < game.ship.x + game.ship.width &&
        shoot.x + shoot.width > game.ship.x &&
        shoot.y < game.ship.y + game.ship.height &&
        shoot.y + shoot.height > game.ship.y
      ) {
        game.ship.activateInvulnerability();

        game.ship.reduceLives(); // Reduce la puntuación
        if (this.lives <= 0) {
          game.gameOver();
        }
        // Explosión en la posición del enemigo
        game.explosion.x = game.ship.x + 45;
        game.explosion.y = game.ship.y;
        game.explosion.explosionVisible = true;

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
    const currentTime = Date.now(); // Obtiene el tiempo actual en milisegundos
    if (currentTime - this.lastShotTime >= this.shootCooldown) {
      // Solo dispara si ha pasado el tiempo de cooldown

      this.shoots.push(
        new Shoot(
          this.ctx,
          this.x - 46,
          this.y + this.height / 2,
          -10,
          "/assets/images/laser-enemigo.png"
        )
      );
      this.lastShotTime = currentTime; // Actualiza el tiempo del último disparo
    }
  }
}
