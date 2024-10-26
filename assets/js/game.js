class Game {
    constructor(ctx) {
      this.ctx = ctx;
      this.ship = new Ship(ctx);
      this.background = new Background(ctx);
      this.explosion = new Explosion(ctx);
  
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
    checkCollision() {
      this.enemy.forEach((enemy) => {
        if (
          this.ship.x < enemy.x + enemy.w &&
          this.ship.x + this.ship.width > enemy.x &&
          this.ship.y < enemy.y + enemy.height &&
          this.ship.y + this.ship.height > enemy.y
        ) {
         this.explosion.draw(this.ship.x + this.ship.width, this.ship.y - this.ship.height +5);
        
        }
      });
    }
  
    clear() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  
    draw() {
      this.background.draw();
      this.ship.draw();
      this.enemy.forEach((enemy) => {
        enemy.draw();
      });
    }
  
    move() {
      this.background.move();
      this.ship.move();
  
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
        this.ship.onKeyDown(event.keyCode);
      });
  
      document.addEventListener("keyup", (event) => {
        this.ship.onKeyUp(event.keyCode);
      });
    }
  }
  