import coinArgs from "./items/coin.js";
import Spawner from "./spawner.js";
import SpriteLoader from "./spriteloader.js";

class Game extends EventTarget {
    constructor(ctx, width, height, player) {
        super();

        this.ctx = ctx;
        this.width = width;
        this.height = height;        

        // Creates a coin spawner
        coinArgs.ctx = ctx;
        coinArgs.target = player;
        coinArgs.spriteLoader = new SpriteLoader("./assets/savatte_dodo.png", 1, 1);
        this.coinSpawner = new Spawner(ctx, 120, coinArgs);

        // NOTE: Attaching EXAMPLE listener
        this.addEventListener("coinCollected", this.onSavatteCollected);

        // Game logic
        this.frameTimer = -1;
        this.objects = [player]; // Player and collectibles

        this.score = 0;
        this.savatteCollected = false;

        // Handle player input
        this.keys = {};
        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);
    }

    // Coin collection handler
    onSavatteCollected = (e) => {
        const s = e.detail.src;

        // Doesn't collect savatte if already has one
        if (this.savatteCollected) {
            s.dead = false;
            return;
        };
        
        this.savatteCollected = true;
        console.log("Collected Savatte!");
    }

    // Runs every animation frame
    nextFrame = () => {
        this.frameTimer += 1;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Update systems
        this.coinSpawner.update(this);

        // Update and draw every object in the game
        this.objects.forEach(obj => {
            obj.update(this);
            obj.draw();
        });

        // Removes used sprites (i.e. collectables)
        if (this.objects[0].dead) {
            // Show game over
        }

        this.objects = this.objects.filter(o => !o.dead);
        requestAnimationFrame(this.nextFrame);
    }

    // Starts the game
    start() {
        this.nextFrame();
    }
}

export default Game;