class Menu {
  constructor(ctx) {
    this.ctx = ctx;
    this.gameState = "menu"; // Estados posibles: "menu", "playing", "paused", "gameOver"
    this.buttons = {}; // Para almacenar las áreas de los botones
  }

  handleKeypresses(game) {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (this.gameState === "playing") {
          game.pause();
        } else if (this.gameState === "paused") {
          game.resume();
        }
      }
    });
  }

  drawMenu() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "white";
    const fontSize = 25;
    this.ctx.font = `${fontSize}px 'Press Start 2P'`;
    this.ctx.textAlign = "center";

    const middlePointInX = this.ctx.canvas.width / 2;
    const middlePointInY = this.ctx.canvas.height / 2;

    const startGametext = "Start Game";
    const startGametextWidth = fontSize * startGametext.length;

    const restartText = "Restart";
    const restartTextWidth = fontSize * restartText.length;

    const quitText = "Quit";
    const quitTextWidth = fontSize * quitText.length;

    const gameOverText = "Game Over!";
    const gameOverTextWidth = fontSize * gameOverText.length;

    const resumeText = "Resume";
    const resumeTextWidth = fontSize * resumeText.length;

    if (this.gameState === "menu") {
      this.ctx.fillText(startGametext, middlePointInX, middlePointInY + 15);
      this.buttons.start = {
        x: middlePointInX - startGametextWidth / 2,
        y: middlePointInY + 15 - fontSize,
        width: startGametextWidth,
        height: fontSize,
      };
    } else if (this.gameState === "paused") {
      this.ctx.fillText(resumeText, middlePointInX, middlePointInY - 40);

      this.ctx.fillText(restartText, middlePointInX, middlePointInY + 20);

      this.ctx.fillText(quitText, middlePointInX, middlePointInY + 80);

      this.buttons.resume = {
        x: middlePointInX - resumeTextWidth / 2,
        y: middlePointInY - 40 - fontSize,
        width: resumeTextWidth,
        height: fontSize,
      };

      this.buttons.restart = {
        x: middlePointInX - restartTextWidth / 2,
        y: middlePointInY + 20 - fontSize,
        width: restartTextWidth,
        height: fontSize,
      };

      this.buttons.quit = {
        x: middlePointInX - quitTextWidth / 2,
        y: middlePointInY + 80 - fontSize,
        width: quitTextWidth,
        height: fontSize,
      };

    } else if (this.gameState === "gameOver") {
      
      this.ctx.fillText(gameOverText, middlePointInX, middlePointInY - 80);
      this.ctx.fillText(restartText, middlePointInX, middlePointInY);
      this.ctx.fillText(quitText, middlePointInX, middlePointInY + 60);

      this.buttons.restart = {
        x: middlePointInX - restartTextWidth / 2,
        y: middlePointInY - fontSize,
        width: restartTextWidth,
        height: fontSize,
      };

      this.buttons.quit = {
        x: middlePointInX - quitTextWidth / 2,
        y: middlePointInY + 60 - fontSize,
        width: quitTextWidth,
        height: fontSize,
      };
    }
  }

  handleClick(x, y, game) {
    if (this.gameState === "menu" && this.isInside(x, y, this.buttons.start)) {
      game.start();
    } else if (this.gameState === "paused") {
      if (this.isInside(x, y, this.buttons.resume)) game.resume();
      else if (this.isInside(x, y, this.buttons.restart)) game.restart();
      else if (this.isInside(x, y, this.buttons.quit)) game.endGame();
    } else if (this.gameState === "gameOver") {
      if (this.isInside(x, y, this.buttons.restart)) game.restart();
      else if (this.isInside(x, y, this.buttons.quit)) game.endGame();
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
}
