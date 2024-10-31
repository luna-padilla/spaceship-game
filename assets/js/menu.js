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