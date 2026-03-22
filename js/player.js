import savatteArgs from "./items/savatte.js";
import Projectile from "./projectile.js";
import SpriteLoader from "./spriteloader.js";

class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 100;
        this.y = 250;
        this.width  = 200;
        this.height = 200;
        this.dead = false;

        this.spdY = 0;
        this.gravity = 0.5;
        this.flapPower = -8;

        // Animation logic
        this.spriteLoader = new SpriteLoader("./assets/parakeet_fly.png", 5, 5);
        this.frameRate = 4;
        this.frameCounter = 0;
    }

    // Update player
    update(game) {
        this.spdY += this.gravity;
        this.y += this.spdY;

        // Set boundaries
        this.y = Math.min(
            Math.max(this.height / 2, this.y), // Top limit
            game.height - this.height / 2      // Bottom limit
        );

        // Jump
        if (game.keys["Space"]) {
            this.spdY = this.flapPower;
        }

        // Avoy savatte
        if (game.keys["KeyF"] && game.savatteCollected) {
            game.keys["KeyF"] = false;
            game.savatteCollected = false;

            this.shoot(game);
        }
    }

    // Draw player
    draw() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            this.currentFrame = this.spriteLoader.next();
        }

        if (!this.currentFrame) return;

        this.ctx.drawImage(
            this.spriteLoader.image,
            this.currentFrame.sx,
            this.currentFrame.sy,
            this.currentFrame.sw,
            this.currentFrame.sh,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    // Shoots a savatte dodo after obtaining the collectable first
    shoot(game) {

        // Filling in missing values
        savatteArgs.ctx = this.ctx;
        savatteArgs.x = this.x;
        savatteArgs.y = this.y;
        savatteArgs.target = game.enemy;

        // Animation for the savatte
        savatteArgs.spriteLoader = new SpriteLoader(savatteArgs.spriteSrc, 3, 3);
        const savatte = new Projectile(savatteArgs);

        // Optional: handle hits directly on the game
        // bullet.addEventListener("hit", e => {
        //     game.dispatchEvent(new CustomEvent("enemyHit", { detail: e.detail }));
        // });

        game.objects.push(savatte);
    }
}

export default Player;