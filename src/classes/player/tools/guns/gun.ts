import P5 from "p5";
import { UIManager } from "../../../game/uiManager";
import { MovingObject } from "../../../movingObject";
import { IMaterialObject } from "../../../utils";
import { Player } from "../../player";
import { PlayerManager } from "../../playerManager";
import { Tool } from "../tool";
import { ETool } from "../toolManager";
import { BulletManager, EBullet } from "./bullets/bulletManager";

export class Gun extends Tool {
    private distToPlayerOffset: number;
    constructor(
        private image: P5.Image,
        private size: number,
        private distToPlayer: number,
        private recoil: number,
        reload: number,
        public bullet: EBullet,
        private bulletSpawnOffset: number,
        name: string,
        index: ETool,
        public unlockPrice?: IMaterialObject,
    ) {
        super(reload, name, index, unlockPrice);
        this.distToPlayerOffset = 0;
    }
    get stats() {
        const bullet = BulletManager.getBullet({x:0, y:0}, 0, this.bullet, UIManager.p5);
        return {
            "damage to enemies": bullet.damage.toString(),
            "bullet speed": bullet.speed.toString()+"pixels/frame",
            "max range": bullet.maxRange.toString()+"pixels",
            "bullet size": bullet.size.toString()+"pixels",
            reload: this.reload.toString()+"ms",
        }
    }
    fire(pos: P5.Vector, p5: P5) {
        const angle = PlayerManager.player.angle;
        BulletManager.spawnBullet(
            pos,
            angle,
            this.bullet,
            p5
        );
    }
    hitEffect() {
        const p5 = this.p5 as P5;
        const player = PlayerManager.player;
        const img = this.image;
        const height = (this.size * img.height) / img.width;
        const dist =
            this.distToPlayer +
            player.size +
            this.size / 2 +
            this.distToPlayerOffset;
        const gunPos = p5.createVector(
            player.pos.x + Math.cos(player.angle) * (dist + this.size/2),
            player.pos.y + Math.sin(player.angle) * (dist + this.size/2) 
        );
        this.fire(gunPos, p5);
    }
    animateHit() {
        this.distToPlayerOffset = -this.recoil;
    }
    show() {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject; 
        const isPlayer = holder === PlayerManager.player;
        const angleOffset = +(isPlayer && (holder as Player).damageAnimation.angleOffset)
        this.distToPlayerOffset = p5.min(0, this.distToPlayerOffset + 0.5);
        const img = this.image;
        const height = (this.size * img.height) / img.width;
        const dist =
            this.distToPlayer +
            holder.size +
            this.size / 2 +
            this.distToPlayerOffset;
        const gunPos = p5.createVector(
            holder.pos.x + Math.cos(holder.angle + angleOffset) * dist,
            holder.pos.y + Math.sin(holder.angle + angleOffset) * dist
        );
        const gunOffset = p5.createVector(
            -(p5.cos(holder.angle - p5.PI / 2) * height) / this.bulletSpawnOffset,
            -(p5.sin(holder.angle - p5.PI / 2) * height) / this.bulletSpawnOffset
        );
        this.shouldRotate(gunPos) && gunOffset.mult(-1);
        p5.push();
        p5.translate(P5.Vector.add(gunPos, gunOffset));
        p5.rotate(holder.angle + angleOffset);
        if (this.shouldRotate(gunPos)) {
            p5.scale(1, -1);
        }
        p5.image(img, 0, 0, this.size, height);

        p5.pop();
    }
}
