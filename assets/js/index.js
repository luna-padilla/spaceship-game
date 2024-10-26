const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game1 = new Game(ctx);
const button = document.getElementById('start');
button.addEventListener("click", () => {
  if (game1.started === false) {
    game1.start();
    button.textContent = "||";
  } else {
    game1.pause();
    button.textContent = "START";
  }
});