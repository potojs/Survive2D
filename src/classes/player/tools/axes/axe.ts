import P5 from "p5";
import { SpriteManager } from "../../../game/spriteManager";
import { PlayerManager } from "../../playerManager";
import { ETool } from "../toolManager";
import { MalayTool } from "../malayTool";
import { IToolsDamage } from "../tool";
import { IMaterialObject } from "../../../utils";
import { Player } from "../../player";
import { MovingObject } from "../../../movingObject";

export class Axe extends MalayTool {
    private animationState: {
        axeRotation: number;
    };
    constructor(
        damage: IToolsDamage,
        reload: number,
        private image: P5.Image,
        public size: number,
        name: string,
        index: ETool,
        unlockPrice?: IMaterialObject,
        upgrade?: ETool 
        ) {
            super(damage, reload, 30, name, index, unlockPrice, upgrade);
            this.animationState = {
            axeRotation: 0,
        };
    }
    animateHit() {
        this.animationState = {
            axeRotation: Math.PI / 4,
        };
    }
    show(dt: number) {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject;
        const isPlayer = holder === PlayerManager.player;
        const angleOffset = +(isPlayer && (holder as Player).damageAnimation.angleOffset);
        const axePos = p5.createVector(
            holder.pos.x + p5.cos(holder.angle + angleOffset) * (holder.size + this.size / 2),
            holder.pos.y + p5.sin(holder.angle + angleOffset) * (holder.size + this.size / 2)
        );
        this.animationState.axeRotation = p5.max(
            this.animationState.axeRotation - Math.PI * dt / 100,
            0
        );
        const shouldRotate = this.shouldRotate(axePos);
        p5.push();
        p5.translate(axePos);
        p5.rotate(holder.angle + angleOffset);
        p5.translate(
            0,
            ((shouldRotate ? -1 : 1) * this.size * this.image.height) /
                this.image.width /
                2
        );
        p5.rotate((shouldRotate ? -1 : 1) * this.animationState.axeRotation);
        p5.translate(
            0,
            ((shouldRotate ? -1 : 1) * -this.size * this.image.height) /
                this.image.width /
                2
        );
        if (shouldRotate) {
            p5.scale(1, -1);
        }
        p5.image(
            this.image,
            0,
            0,
            this.size,
            (this.size * this.image.height) / this.image.width
        );
        p5.pop();
    }
}
