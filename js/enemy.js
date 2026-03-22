import bulletArgs from "./items/bullet.js";
import Projectile from "./projectile.js";
import SpriteLoader from "./spriteloader.js";

class Enemy {
    constructor(ctx, x, y, width, height, target) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Game logic
        this.target = target; // AKA the player

        this.startY = y;
        this.speedY = 2;
        this.direction = 1;
        this.range = 150;

        this.moveInterval = 120;
        this.shootInterval = 90;
        this.lastShotFrame = 0;

        // Animation logic
        this.animations = {
            idle: new SpriteLoader("./assets/parakeet_fly.png", 5, 5),
            shoot: new SpriteLoader("./assets/parakeet_attack.png", 5, 5)
        };

        this.currentAnimation = "idle"; 
        this.frameRate = 5;
        this.frameCounter = 0;
    }

    update(game) {
        // There are 3 states the enemy can be in (concerning motion)
        // 1. Move up
        // 2. Move down
        // 3. Stay still
        
        // Chooses every 10 frames
        if (game.frameTimer % this.moveInterval == 0) {
            const decision = Math.floor(Math.random() * 3);

            // Move up
            if (decision == 0) {
                this.direction = 1;
            }

            // Move down
            else if (decision == 1) {
                this.direction = -1;
            }

            // Stay still
            else {
                this.direction = 0;  
            }
        }

        // Set the enemy's range of motion here
        this.y += this.speedY * this.direction;
        this.y = Math.min(
            Math.max(game.height * 0.2, this.y), 
            (game.height * 0.8 ) - this.height / 2
        );

        // Pew pew
        if (game.frameTimer - this.lastShotFrame >= this.shootInterval) {
            this.shoot(game);
            this.lastShotFrame = game.frameTimer;
        }
    }

    draw() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            this.currentFrame = this.animations[this.currentAnimation].next();
        }

        if (!this.currentFrame) return;

        this.ctx.drawImage(
            this.animations[this.currentAnimation].image,
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

    shoot(game) {

        // Filling in missing values
        bulletArgs.ctx = this.ctx;
        bulletArgs.x = this.x;
        bulletArgs.y = this.y;
        bulletArgs.target = game.player;

        // Animation for the bullet
        bulletArgs.spriteLoader = new SpriteLoader(bulletArgs.spriteSrc, 1, 1);
        const bullet = new Projectile(bulletArgs);

        // bullet.addEventListener("hit", e => {
        //     game.dispatchEvent(new CustomEvent("enemyHit", { detail: e.detail }));
        // });

        game.objects.push(bullet);
    }
}

export default Enemy;