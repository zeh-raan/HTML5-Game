import Game from "./game.js";

// Retrieve canvas and drawing tool
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Make canvas match browser size
function resizeWindow() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

// Adapt to browser resize
window.addEventListener("resize", resizeWindow);
resizeWindow(); // Initial resize

// Create objects
const game = new Game(ctx, canvas.width, canvas.height);
game.start();