const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = new Game(ctx);
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  game.handleClick(x, y);
});
game.drawMenu();