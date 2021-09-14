import P5 from "p5";
import { Enemie } from "../../../../enemies/enemie";
import { ECollider } from "../../../../gameObjects/gameObject";
import { MovingObject } from "../../../../movingObject";

export class Bullet extends MovingObject {
    private posHistory: { x: number; y: number }[];
    public distanceTraveled: number;
    constructor(
        x: number,
        y: number,
        size: number,
        speed: number,
        angle: number,
        public maxRange: number,
        private historyLimit: number,
        public damage: number,
        p5: P5
    ) {
        super(x, y, angle, size, speed, p5);
        this.vel = P5.Vector.fromAngle(angle, speed);
        this.posHistory = [];
        this.distanceTraveled = 0;
    }
    onDeath() {}
    show() {
        const p5 = this.p5 as P5;

        p5.stroke(255, 100);
        for (let i = 0; i < this.posHistory.length - 1; i++) {
            p5.strokeWeight(
                p5.map(i, 0, this.posHistory.length - 1, 0.2, this.size)
            );
            p5.line(
                this.posHistory[i].x,
                this.posHistory[i].y,
                this.posHistory[i + 1].x,
                this.posHistory[i + 1].y
            );
        }

        p5.stroke(255, 150);
        p5.strokeWeight(2);
        p5.fill(100);
        p5.ellipse(this.pos.x, this.pos.y, this.size*2);
    }
    update(dt: number) {
        super.update(dt);
        this.quadtreeUser.update(this.pos.x, this.pos.y);
        this.distanceTraveled += this.speed;
        if (this.distanceTraveled >= this.maxRange) {
            this.destroyed = true;
            this.onDeath();
        } else {
            const colliding = this.quadtreeUser.getCollision();
            
            for (let i = 0; i < colliding.length; i++) {
                if(!(colliding[i] instanceof Bullet) && colliding[i].colliderShape !== ECollider.NONE_SQUARE){
                    this.destroyed = true;
                    this.onDeath();
                    if(colliding[i] instanceof Enemie && !colliding[i].destroyed) {
                        (colliding[i] as Enemie).takeDamage(this);
                    }
                }
            }
        }

        this.posHistory.push({
            x: this.pos.x,
            y: this.pos.y,
        });
        if (this.posHistory.length >= this.historyLimit) {
            this.posHistory.splice(0, 1);
        }
    }
}
