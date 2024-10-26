class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.ship = new Ship(ctx);
    this.background = new Background(ctx);
    this.explosion = new Explosion(ctx);
    this.shoots = [];

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
    let tick = 0;
    this.interval = setInterval(() => {
      this.clear();

      this.draw();

      this.move();

      this.checkCollision();
      tick++;
      if (tick >= 500) {
        tick = 0;
        this.addEnemy();
      }
    });
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
    this.enemy.forEach((enemy) => {
      if (
        this.ship.x < enemy.x + enemy.w &&
        this.ship.x + this.ship.width > enemy.x &&
        this.ship.y < enemy.y + enemy.height &&
        this.ship.y + this.ship.height > enemy.y
      ) {
        this.explosion.draw(
          this.ship.x + this.ship.width,
          this.ship.y - this.ship.height + 5
        );
      }
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw() {
    this.background.draw();
    this.ship.draw();
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
