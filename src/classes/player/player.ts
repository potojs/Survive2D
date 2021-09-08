import P5 from "p5";
import { MapManager } from "../game/mapManager";
import { ETool, ToolManager } from "./tools/toolManager";
import { ECollider, GameObject } from "../gameObjects/gameObject";
import { MovingObject } from "../movingObject";
import { SpriteManager } from "../game/spriteManager";
import { IMaterialObject, Utils } from "../utils";
import { ESellingMenu, UIManager } from "../game/uiManager";
import { PlayerManager } from "./playerManager";
import { ParticuleManager } from "../particules/particuleManager";
import { GameManager } from "../game/gameManager";
import { EnemieManager } from "../enemies/enemieManager";
import { quadtree } from "../../main";

export class Player extends MovingObject {
    public selectedTool: ETool;
    private wasDamagedAt: number;
    public damageAnimation: {
        duration: number;
        angleOffset: number;
        deltaAngle: number;
    };
    public allWoodCollected: number = 0;
    public allStoneCollected: number = 0;
    public allIronCollected: number = 0;

    constructor(
        x: number,
        y: number,
        public woodAmt: number,
        public stoneAmt: number,
        public ironAmt: number,
        public health: number,
        size: number,
        speed: number,
        public p5: P5
    ) {
        super(x, y, 0, size, speed, p5);
        this.selectedTool = ETool.PLAYER_HAND;
        this.wasDamagedAt = 0;
        this.damageAnimation = {
            duration: 150,
            angleOffset: 0,
            deltaAngle: p5.PI/6
        };

    }
    takeDamage(damage: number) {
        ParticuleManager.showDamageEffect(this, Math.min(damage, this.health));
        this.health -= damage;
        this.wasDamagedAt = performance.now();
        if(this.health <= 0) {
            GameManager.endGame();
        }
    }
    update(dt: number) {
        if(!GameManager.isNight && EnemieManager.enemies.length === 0) {
            this.health = Math.min(this.health + 0.5, 100);
        }
        this.pos.x += this.vel.x * dt;
        this.quadtreeUser.updateBy(this.vel.x * dt);
        
        const collidingWithX = this.quadtreeUser.getCollision();
        for (let i = 0; i < collidingWithX.length; i++) {
            this.collide(collidingWithX[i], {
                x: this.p5.abs(this.vel.x) / this.vel.x,
                y: 0,
            }, dt);
        }
        this.quadtreeUser.update(this.pos.x, this.pos.y);
        this.pos.y += this.vel.y * dt;
        this.quadtreeUser.updateBy(0, this.vel.y * dt);

        const collidingWithY = this.quadtreeUser.getCollision();
        for (let i = 0; i < collidingWithY.length; i++) {
            this.collide(collidingWithY[i], {
                x: 0,
                y: this.p5.abs(this.vel.y) / this.vel.y,
            }, dt);
        }
        this.quadtreeUser.item.y = this.pos.y + MapManager.mapDimensions.h/2;
        this.boundries();
        this.quadtreeUser.update(this.pos.x, this.pos.y);
        if (Math.abs(this.vel.mag() - 0) > 0.1) {
            UIManager.sellingMenuState = ESellingMenu.MOUSE_OUT;
        }
        const timeDiff = performance.now() - this.wasDamagedAt;
        const animationDur = this.damageAnimation.duration;
        if (timeDiff < animationDur) {
            this.damageAnimation.angleOffset =
                timeDiff <= animationDur / 2
                    ? this.p5.map(
                          timeDiff,
                          0,
                          animationDur / 2,
                          0, 
                          this.damageAnimation.deltaAngle
                      )
                    : this.p5.map(
                        timeDiff,
                        animationDur / 2,
                        animationDur,
                        this.damageAnimation.deltaAngle,
                        0, 
                    );
        }else{
            this.damageAnimation.angleOffset = 0
        }
    }
    hit() {
        if(!GameManager.gameEnded) {
            ToolManager.hit();
        }
    }
    userInput() {
        const p5 = this.p5;
        const leftVec = p5.createVector(-1, 0);
        const rightVec = p5.createVector(1, 0);
        const upVec = p5.createVector(0, -1);
        const downVec = p5.createVector(0, 1);
        const movementVec = p5.createVector();

        if (PlayerManager.canPlayerMove) {
            if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(65)) {
                movementVec.add(leftVec);
            }
            if (p5.keyIsDown(p5.UP_ARROW) || p5.keyIsDown(87)) {
                movementVec.add(upVec);
            }
            if (p5.keyIsDown(p5.DOWN_ARROW) || p5.keyIsDown(83)) {
                movementVec.add(downVec);
            }
            if (p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown(68)) {
                movementVec.add(rightVec);
            }
        }
        this.vel = movementVec.setMag(this.speed);
        this.angle = p5.atan2(
            p5.mouseY - p5.height / 2,
            p5.mouseX - p5.width / 2
        );
    }
    show() {
        const p5 = this.p5;
        const img = SpriteManager.sprites.player.player as P5.Image;
        p5.push();
        if(!GameManager.gameEnded){
            this.angle += this.damageAnimation.angleOffset;
        }
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.angle);
        p5.image(img, 0, 0, this.size * 2, this.size * 2);
        p5.pop();
    }
    hasMaterials(materials: IMaterialObject) {
        return (
            this.woodAmt >= materials.wood &&
            this.stoneAmt >= materials.stone &&
            this.ironAmt >= materials.iron
        );
    }
}
