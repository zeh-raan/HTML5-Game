class Collision {
    constructor(x, y, size, type, ctx, speed = 3) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.type = type;
        this.ctx = ctx;
        this.speed = speed;
    }

    update(game) {
        // Move left
        this.x -= this.speed;

        // Loop back right
        if (this.x + this.width < 0) {
            this.x = game.width + Math.random() * 200;
            this.y = Math.random() * (game.height - this.height);
        }
    }

    draw() {
        this.ctx.fillStyle = this.type === "collectable" ? "green" : "red";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Collision;