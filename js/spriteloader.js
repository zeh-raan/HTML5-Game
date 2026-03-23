class SpriteLoader {
    constructor(src, rows, cols) {
        this.image = new Image();
        this.image.src = src;

        this.rows = rows;
        this.cols = cols;
        this.totalFrames = rows * cols;

        this.frameWidth = 0;
        this.frameHeight = 0;

        this.currentFrame = 0;

        // Wait until image loads to calculate frame size
        this.image.onload = () => {
            this.frameWidth = this.image.width / this.cols;
            this.frameHeight = this.image.height / this.rows;
        };
    }

    // Returns next frame
    next() {
        if (!this.frameWidth || !this.frameHeight) {
            return null; // Image not loaded yet
        }

        const col = this.currentFrame % this.cols;
        const row = Math.floor(this.currentFrame / this.cols);

        const frame = {
            sx: col * this.frameWidth,
            sy: row * this.frameHeight,
            sw: this.frameWidth,
            sh: this.frameHeight,
        };

        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;

        return frame;
    }

    reset() {
        this.currentFrame = 0;
    }
}

export default SpriteLoader;