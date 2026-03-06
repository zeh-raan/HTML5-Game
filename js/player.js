class Player {

    constructor(ctx) {

        this.ctx = ctx;
        // Starting position
        this.x = 100;
        this.y = 250;
        // Size of sprite
        this.width  = 200;
        this.height = 200;
        // Vertical speed
        this.spdY = 0;
        // Gravity constantly pulls down (+ve)
        this.gravity = 0.5;
        // Flapping force pushes upwards (-ve)
        this.flapPower = -8;
        // Animation state
        this.frameIndex = 0;
        this.frameTimer  = 0;
        // Spritesheet frame size
        this.spriteWidth = 768;
        this.spriteHeight = 768;
        // Load spritesheet image
        this.sprite = new Image();
        this.sprite.src = "./assets/parakeet.png";
    }

    // Update player
    update(game) {

        // Apply gravity and vertical speed
        this.spdY += this.gravity;
        this.y += this.spdY;

        // Set boundaries
        this.y = Math.min(
            Math.max(this.height / 2, this.y), // Top limit
            game.height - this.height / 2             // Bottom limit
        );

        // Flaps when [SPACE] is pressed
        if (game.keys["Space"]) {
            //Apply upward force
            this.spdY = this.flapPower;
        }

        // Handle animation timing
        this.frameTimer++;

        // Change frame every 10 updates
        if (this.frameTimer % 10 === 0) {
            // Toggle between frame 0 and 1
            this.frameIndex = (this.frameIndex + 1) % 2;
        }
    }

    // Draw player
    draw() {
        // Horizontal frame
        const sx = this.frameIndex * this.spriteWidth;

        // Vertical frame
        const sy = 0;

        this.ctx.drawImage(
            this.sprite,
            sx, sy,
            this.spriteWidth, this.spriteHeight,
            this.x - this.width / 2, this.y - this.height / 2,
            this.width, this.height
        );
    }
}

export default Player;