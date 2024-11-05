class PlayerStats {
  constructor(ctx,initialLives, initialScore = 0) {
    this.ctx=ctx;
    this.lives = initialLives;
    this.score = initialScore;
  }

  reduceLives() {
    this.lives--;
  }
  
  addLives() {
    this.lives++;
  }

  addScore(points) {
    this.score += points;
  }

  restart() {
    this.lives = 3;
    this.score = 0;
  }

  isGameOver() {
    return this.lives <= 0;
  }

  displayStats() {
    this.ctx.font = "10px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 50, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 150, 20);
  }
}