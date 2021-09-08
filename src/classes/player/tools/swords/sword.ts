import P5 from "p5";
import { ECollider, GameObject } from "../../../gameObjects/gameObject";
import { MovingObject } from "../../../movingObject";
import { IMaterialObject } from "../../../utils";
import { Player } from "../../player";
import { PlayerManager } from "../../playerManager";
import { MalayTool } from "../malayTool";
import { IToolsDamage } from "../tool";
import { ETool } from "../toolManager";

export class Sword extends MalayTool {
    public size: number;
    public paddingToPlayer: number;
    private animationState: {
        angle: number,
        angularSpeed: number,
        angularAcc: number,
        angularSpeedLimit: number
    }
    constructor(
        damage: IToolsDamage,
        public image: P5.Image,
        reload: number,
        name: string,
        index: ETool,
        unlockPrice?: IMaterialObject,
        upgrade?: ETool
    ) {
        super(damage, reload, 0, name, index, unlockPrice, upgrade);
        this.size = 25;
        this.paddingToPlayer = 10;
        this.animationState = {
            angle: 0,
            angularSpeed: 0,
            angularAcc: 0,
            angularSpeedLimit: Math.PI/15
        }
    }
    collide(gameObject: GameObject): boolean {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject;
        const toolHeight = (this.size * this.image.height) / this.image.width;
        const hittingRange = 20;

        const effetAreaPos = p5.createVector(
            holder.pos.x +
                p5.cos(holder.angle) *
                    (holder.size + toolHeight / 2 + hittingRange),
            holder.pos.y +
                p5.sin(holder.angle) *
                    (holder.size + toolHeight / 2 + hittingRange)
        );
        if (gameObject.colliderShape === ECollider.CIRCLE) {
            return (
                P5.Vector.dist(effetAreaPos, gameObject.pos) <
                gameObject.size + holder.size
            );
        } else if (gameObject.colliderShape === ECollider.SQUARE) {
        }
        return false;
    }
    animateHit() {
        this.animationState.angularSpeed = -Math.PI/25;
    }
    animate(dt: number) {
        this.animationState.angularSpeed += this.animationState.angularAcc * dt;
        this.animationState.angle += this.animationState.angularSpeed * dt;
        if(this.animationState.angle <= -Math.PI/3) {
            this.animationState.angularSpeed = 0;
            this.animationState.angularAcc = Math.PI/40
        }
        if(this.animationState.angle >= Math.PI/3) {
            this.animationState.angle = 0;
            this.animationState.angularSpeed = 0;
            this.animationState.angularAcc = 0;
        }
        this.animationState.angularSpeed = 
            Math.min(this.animationState.angularSpeed, this.animationState.angularSpeedLimit);
        
    }
    show(dt: number) {
        this.animate(dt);
        const holder = this.holder as MovingObject;
        const p5 = this.p5 as P5;
        const isPlayer = holder === PlayerManager.player;
        const angleOffset = +(isPlayer && (holder as Player).damageAnimation.angleOffset);
        const toolPadding = this.paddingToPlayer;
        const toolHeight = (this.size * this.image.height) / this.image.width;
        const pos = p5.createVector(
            holder.pos.x +
                p5.cos(holder.angle + angleOffset) *
                    (holder.size + toolHeight / 2 + toolPadding),
            holder.pos.y +
                p5.sin(holder.angle + angleOffset) *
                    (holder.size + toolHeight / 2 + toolPadding)
        )
        const animationAngle = 
            this.animationState.angle * (this.shouldRotate(pos)?-1:1);
        p5.push();
        p5.translate(pos);
        p5.rotate(holder.angle + p5.PI / 2 + angleOffset);
        p5.translate(0, toolHeight/2);
        p5.rotate(animationAngle);
        p5.translate(0, -toolHeight/2);
        p5.image(this.image, 0, 0, this.size, toolHeight);

        p5.pop();
        p5.fill(255, 0, 0);
        p5.noStroke();
    }
}
