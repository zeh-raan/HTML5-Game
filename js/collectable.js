class Collectable {
    constructor(
        {ctx, x, y, width, height, movementVector, target, event, 
        objToPassOnCollide, spriteLoader}
    ) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Regarding game logic
        this.dead = false;
        this.movementVector = movementVector;

        // Regarding collision
        this.target = target;
        this.event = event;
        this.objToPassOnCollide = objToPassOnCollide;

        // Animation logic
        this.spriteLoader = spriteLoader
        this.frameRate = 4;
        this.frameCounter = 0;
    }

    // Will usually move in a certain direction
    update(game) {

        // Hardcoded for things that go from right to left
        if (this.x < 0 && !this.dead) {
            this.dead = true;
        }

        this.x += this.movementVector; // y usually unchanged
        this.onCollide(game);
    }

    // Draws the collectible
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

    // Fires custom event when colliding with player or another sprite
    onCollide(game) {
        const e = new CustomEvent(this.event, {
            detail: {
                value: this.objToPassOnCollide,
                src: this,
            },
        });

        // Collision detection
        const collided = 
            this.target.x - this.target.width/2 < this.x + this.width/2 &&
            this.target.x + this.target.width/2 > this.x - this.width/2 &&
            this.target.y - this.target.height/2 < this.y + this.height/2 &&
            this.target.y + this.target.height/2 > this.y - this.height/2;
            
        if (collided && !this.dead) {
            this.dead = true;
            game.dispatchEvent(e); // NOTE: Event is dispatched by game
        }
    }
}

export default Collectable;