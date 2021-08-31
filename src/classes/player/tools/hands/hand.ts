import P5 from "p5";
import { ETool } from "../toolManager";
import { MalayTool } from "../malayTool";
import { IToolsDamage } from "../tool";
import { MovingObject } from "../../../movingObject";
import { PlayerManager } from "../../playerManager";
import { Player } from "../../player";

export class Hand extends MalayTool {
    public animationState: {
        translation: number;
        nextHandToPunch: "right" | "left";
        punchRange: number;
    };

    constructor(
        public img: P5.Image,
        private size: number,
        private defaultTranslation: number,
        damage: IToolsDamage,
        reload: number,
        punchRange: number,
        hitRangeOffset: number,
        private betweenHandsAngle: number,
        name: string,
        index: ETool
    ) {
        super(damage, reload, hitRangeOffset, name, index);
        this.animationState = {
            translation: 0,
            nextHandToPunch: "right",
            punchRange,
        };
    }
    animateHit() {
        this.animationState.translation = this.animationState.punchRange;
        this.animationState.nextHandToPunch =
            this.animationState.nextHandToPunch === "left" ? "right" : "left";
    }
    showHand(offset: P5.Vector, angle: number) {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject;
        const handImg = this.img;
        const isPlayer = holder === PlayerManager.player;
        const angleOffset = +(isPlayer && (holder as Player).damageAnimation.angleOffset)
        p5.push();
        p5.translate(
            holder.pos.x +
                p5.cos(angle+angleOffset) * (holder.size + this.defaultTranslation) +
                offset.x,
            holder.pos.y +
                p5.sin(angle+angleOffset) * (holder.size + this.defaultTranslation) +
                offset.y
        );
        p5.rotate(holder.angle + angleOffset);
        p5.image(
            handImg,
            0,
            0,
            this.size * 2,
            (this.size * 2 * handImg.height) / handImg.width
        );
        p5.pop();
    }
    show() {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject;

        this.animationState.translation = p5.max(
            0,
            this.animationState.translation - 1
        );
        const rightHandOffset = P5.Vector.fromAngle(
            holder.angle,
            this.animationState.translation
        );
        const leftHandOffset = P5.Vector.fromAngle(
            holder.angle,
            this.animationState.translation
        );
        if (this.animationState.nextHandToPunch === "left") {
            rightHandOffset.mult(0);
        } else {
            leftHandOffset.mult(0);
        }
        this.showHand(
            leftHandOffset,
            holder.angle - this.betweenHandsAngle / 2
        );
        this.showHand(
            rightHandOffset,
            holder.angle + this.betweenHandsAngle / 2
        );
    }

}
