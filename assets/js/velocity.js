class VelocityComponent {
    constructor(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    update(position) {
        position.x += this.vx;
        position.y += this.vy;
    }
}