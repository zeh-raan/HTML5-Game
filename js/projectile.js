class Projectile {
    constructor(
        {ctx, x, y, width, height, movementVector, target, event, 
        objToPassOnCollide, spriteLoader}
    ) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Collision/Game logic
        this.movementVector = movementVector;
        this.target = target;
        this.event = event;
        this.objToPassOnCollide = objToPassOnCollide;
        this.dead = false;

        // Animation logic
        this.spriteLoader = spriteLoader
        this.frameRate = 4;
        this.frameCounter = 0;
    }

    update(game) {
        this.x += this.movementVector;
        this.onCollide(game);

        if (this.x > game.width || this.x < 0) {
            this.dead = true;
        }
    }

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

    onCollide(game) {
        if (!this.target || this.dead) return;

        const collided =
            this.target.x + this.target.width > this.x &&
            this.target.x < this.x + this.width &&
            this.target.y + this.target.height > this.y &&
            this.target.y < this.y + this.height;

        if (collided) {
            this.dead = true;
            game.dispatchEvent(new CustomEvent(this.event, { detail: this.objToPassOnCollide }));
        }
    }
}

export default Projectile;