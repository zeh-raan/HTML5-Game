class Game {

    constructor(ctx, player) {

        this.ctx = ctx;
        // Array stores players, enemies, collectables...
        this.objects = [player];
        // Track keyboard inputs (ENTER, SPACE)
        this.keys = {};
        // Key is pressed
        window.addEventListener("keydown", e => this.keys[e.code] = true);
        // Key is released
        window.addEventListener("keyup", e => this.keys[e.code] = false);
    }

    // Runs every animation frame
    nextFrame = () => {
        // Clear canvas before drawing next frame
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Update and draw every object in the game
        this.objects.forEach(obj => {
            // Read input, size, gravity...
            obj.update(this);
            // Draw object
            obj.draw();
        });
        // Run on next screen refresh again
        requestAnimationFrame(this.nextFrame);
    }

    // Starts the game
    start() {
        this.nextFrame();
    }
}

export default Game;