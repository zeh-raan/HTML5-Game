import Enemy from "./enemy.js";
import mangoArgs from "./items/mango.js";
import bulletArgs from "./items/bullet.js";
import savatteArgs from "./items/savatte.js";
import savattePickupArgs from "./items/savattePickup.js";
import Player from "./player.js";
import Spawner from "./spawner.js";
import SpriteLoader from "./spriteloader.js";

class Game extends EventTarget {
    constructor(ctx, width, height) {
        super();

        this.ctx = ctx;
        this.width = width;
        this.height = height;        

        this.state = "menu";

        // Creating player and enemy
        this.player = new Player(this.ctx);
        this.playerHP = 5;

        this.enemy = new Enemy(this.ctx, this.width * 0.85, this.height / 2, 400, 400, this.player);
        this.enemyHP = 5;

        // Creates a spawner for weapons
        savattePickupArgs.ctx = ctx;
        savattePickupArgs.target = this.player;
        savattePickupArgs.spriteLoader = new SpriteLoader(savattePickupArgs.spriteSrc, 1, 1);
        this.savatteSpawner = new Spawner(ctx, 120, savattePickupArgs);

        // Creating a spawner for health pickups
        mangoArgs.ctx = ctx;
        mangoArgs.target = this.player;
        mangoArgs.spriteLoader = new SpriteLoader(mangoArgs.spriteSrc, 1, 1);
        this.mangoSpawner = new Spawner(ctx, 300, mangoArgs);
        
        // Game logic
        this.frameTimer = -1;
        this.objects = [this.player, this.enemy]; // Player and collectibles

        this.score = 0;
        this.savatteCollected = false;

        // Handle player input
        this.keys = {};
        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);

        // Adding handlers

        // Pick up savatte
        this.addEventListener(savattePickupArgs.event, (e) => {

            // Doesn't collect savatte if already has one
            const src = e.detail.src;
            if (this.savatteCollected) {
                src.dead = false;
                return;
            };
            
            this.savatteCollected = true;
            console.log("Collected Savatte!");
        });
        
        // Hitting the poacher
        this.addEventListener(savatteArgs.event, (e) => {
            this.enemyHP--;
            this.enemy.takeDamage();

            console.log("Poacher hit!", e.detail, "\nHP left:", this.enemyHP);

            // Enemy dies
            if (this.enemyHP <= 0) {
                setTimeout(() => {
                    this.state = "victory";
                    this.enemy.dead = true;
                }, 750);
            }
        })
        
        // Player gets hit
        this.addEventListener(bulletArgs.event, (e) => {
            this.playerHP--;
            this.savatteCollected = false;
            this.player.takeDamage();

            console.log("Player hit!", e.detail, "\nHP left:", this.playerHP);

            // Player dies
            if (this.playerHP <= 0) {
                setTimeout(() => {
                    this.state = "gameover";
                    this.player.dead = true;
                }, 750);
            }
        });

        // Player heals
        this.addEventListener(mangoArgs.event, (e) => {

            // Doesn't pickup if health is full
            const src = e.detail.src;
            if (this.playerHP >= 5) {
                src.dead = false;
                return;
            };
            
            this.playerHP++;
            console.log("Player heals!", e.detail, "\nHP left:", this.playerHP);
        });
    }

    // Runs every animation frame
    nextFrame = () => {
        this.frameTimer += 1;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Display menu
        if (this.state == "menu") {
            this.drawMenu();
            
            // Press "Enter to start"
            if (this.keys["Enter"]) {
                this.keys["Enter"] = false;
                this.state = "playing";
            }

            requestAnimationFrame(this.nextFrame);
            return;
        }

        // Show game over screen
        if (this.state === "gameover") {
            this.drawGameOver();

            if (this.keys["Enter"]) {
                location.reload(); // Restarts
            }

            requestAnimationFrame(this.nextFrame);
            return;
        }

        // Show victory screen
        if (this.state === "victory") {
            this.drawVictory();

            if (this.keys["Enter"]) {
                location.reload(); // Restarts
            }

            requestAnimationFrame(this.nextFrame);
            return;
        }

        // ------------
        //   Gameloop
        // ------------

        // Update systems
        this.savatteSpawner.update(this);
        this.mangoSpawner.update(this);

        // Update and draw every object in the game
        this.objects.forEach(obj => {
            obj.update(this);
            obj.draw();
        });

        // Removes used sprites (i.e. collectables)
        this.objects = this.objects.filter(o => !o.dead);
        requestAnimationFrame(this.nextFrame);
    }

    // Starts the game
    start() {
        this.nextFrame();
    }

    // Shows menu
    drawMenu() {
        const ctx = this.ctx;

        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        ctx.font = "72px Arial";
        ctx.fillText("PARAKEET VS POACHER", this.width / 2, this.height * 0.35);

        ctx.font = "32px Arial";
        ctx.fillText("Press ENTER to Start", this.width / 2, this.height * 0.5);

        ctx.font = "20px Arial";
        ctx.fillText("SPACE = Fly", this.width / 2, this.height * 0.6);
        ctx.fillText("F = Throw Savatte", this.width / 2, this.height * 0.65);
    }

    // Shows game over
    drawGameOver() {
        const ctx = this.ctx;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = "center";

        ctx.fillStyle = "red";
        ctx.font = "72px Arial";
        ctx.fillText("GAME OVER", this.width / 2, this.height * 0.4);

        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText("Press ENTER to Restart", this.width / 2, this.height * 0.55);
    }

    // Show victory screen
    drawVictory() {
        const ctx = this.ctx;

        // Background
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = "center";

        // Title
        ctx.fillStyle = "#4CAF50";
        ctx.font = "72px Arial";
        ctx.fillText("VICTORY!", this.width / 2, this.height * 0.35);

        // Subtitle
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText("The poacher has been defeated!", this.width / 2, this.height * 0.5);

        // Score display
        ctx.font = "28px Arial";
        ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height * 0.6);

        // Restart instruction
        ctx.font = "24px Arial";

        // blinking text
        if (Math.floor(this.frameTimer / 30) % 2 === 0) {
            ctx.fillText("Press ENTER to play again", this.width / 2, this.height * 0.75);
        }
    }
}

export default Game;