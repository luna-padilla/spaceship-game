class PlayerStats {
  constructor(ctx,initialLives, initialScore = 0) {
    this.ctx=ctx;
    this.lives = initialLives;
    this.score = initialScore;
    this.killedEnemiesCount = 0; // Contador de enemigos eliminados
  }

  reduceLives() {
    this.lives--;
  }
  
  addLives() {
    this.lives++;
  }

  addScore(points) {
    const multiplier = this.getScoreMultiplier(); // Obtener el multiplicador actual
    this.score += points * multiplier;
  }

  getScoreMultiplier() {
    if (this.killedEnemiesCount >= 10) {
      return 3; // Triplica a partir de 10 enemigos
    } else if (this.killedEnemiesCount >= 3) {
      return 2; // Duplica a partir de 3 enemigos
    }
    return 1; // No se multiplica para menos de 3 enemigos
  }

  increaseKilledEnemies() {
    this.killedEnemiesCount++; // Incrementa el contador de enemigos eliminados
  }

  resetStats() {
    this.lives = 3;
    this.score = 0;
    this.killedEnemiesCount = 0; // Reinicia el contador de enemigos eliminados
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