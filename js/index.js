import Game from "./game.js";

// Canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeWindow() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeWindow);
resizeWindow();

// Create objects
const game = new Game(ctx, canvas.width, canvas.height);
game.start();