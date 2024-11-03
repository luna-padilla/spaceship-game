// Esperar a que la fuente esté cargada
document.fonts.load('10px "Press Start 2P"').then(() => {
  console.log('Fuente cargada, iniciando el juego');

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const game = new Game(ctx);
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    game.menu.handleClick(x, y, game);
  });

  // Dibujar el menú después de que la fuente esté cargada
  game.menu.drawMenu();
}).catch(error => {
  console.error('Error al cargar la fuente:', error);
});
