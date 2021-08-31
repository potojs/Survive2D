import P5 from "p5";
import { EnemieManager } from "../../../../enemies/enemieManager";
import { MapManager } from "../../../../game/mapManager";
import { UIManager } from "../../../../game/uiManager";
import { ECollider } from "../../../../gameObjects/gameObject";
import { MovingObject } from "../../../../movingObject";
import { Utils } from "../../../../utils";
import { PlayerManager } from "../../../playerManager";

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
        const player = PlayerManager.player;
        this.vel = P5.Vector.fromAngle(angle, speed);
        this.posHistory = [];
        this.distanceTraveled = 0;
    }
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
    update() {
        super.update();
        this.distanceTraveled += this.speed;
        if (this.distanceTraveled >= this.maxRange) {
            this.destroyed = true;
        } else {
            const gameObjects = MapManager.gameObjects;
            for (let i = 0; i < gameObjects.length; i++) {
                switch (gameObjects[i].colliderShape) {
                    case ECollider.CIRCLE:
                        if (
                            P5.Vector.dist(gameObjects[i].pos, this.pos) <=
                            this.size + gameObjects[i].size
                        ) {
                            this.destroyed = true;
                            return;
                        }
                        break;
                    case ECollider.SQUARE:
                        if(Utils.collideSquareCircle(gameObjects[i], this)) {
                            this.destroyed = true;
                            return;
                        }
                        break;
                }
            }
            for(const enemie of EnemieManager.enemies) {
                if(!enemie.destroyed && P5.Vector.dist(this.pos, enemie.pos) < this.size + enemie.size) {
                    enemie.takeDamage(this);
                    this.destroyed = true;
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
