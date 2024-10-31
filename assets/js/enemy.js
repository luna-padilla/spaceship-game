class Enemy {
  constructor(ctx) {
    this.ctx = ctx;
    this.w = 30;
    this.height = 75;
    this.x = this.ctx.canvas.width - this.w - 20; // Posición inicial en el eje X
    const margin = 50; // Ajusta este valor según tus necesidades

    this.y =
      Math.floor(
        Math.random() * (this.ctx.canvas.height - this.height - 2 * margin)
      ) + margin;
    this.vx = Math.floor(Math.random() * 10) - 20;

    this.img = new Image();
    this.img.src = "/assets/images/gradius.png"; // Imagen del enemigo
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      79,
      64,
      15,
      15,
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

  checkShootEnemy(game) {
    for (let i = game.ship.shoots.length - 1; i >= 0; i--) {
      const shoot = game.ship.shoots[i];
      for (let j = game.ship.enemies.length - 1; j >= 0; j--) {
        const enemy = game.ship.enemies[j];

        // Verifica la colisión entre el disparo y el enemigo
        if (
          shoot.x < enemy.x + enemy.w &&
          shoot.x + shoot.width > enemy.x &&
          shoot.y < enemy.y + enemy.height &&
          shoot.y + shoot.height > enemy.y
        ) {
          game.ship.addScore(); // Aumenta la puntuación
          // Explosión en la posición del enemigo
          game.explosion.x = enemy.x;
          game.explosion.y = enemy.y;
          game.explosion.explosionVisible = true;

          setTimeout(() => {
            game.explosion.explosionVisible = false; // Oculta la explosión después de explosionDuration
          }, game.explosion.explosionDuration);

          // Elimina el disparo y el enemigo que colisionan
          game.ship.enemies.splice(j, 1);
          game.ship.shoots.splice(i, 1);

          // Salir del bucle de enemigos una vez procesado
          break;
        }
      }
    }
  }













}
