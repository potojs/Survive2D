import P5 from "p5";
import { UIManager } from "../../../game/uiManager";
import { IMaterialObject } from "../../../utils";
import { PlayerManager } from "../../playerManager";
import { BulletManager, EBullet } from "./bullets/bulletManager";
import { Gun } from "./gun";

export class Shotgun extends Gun {
    constructor(
        img: P5.Image,
        size: number,
        public numShots: number,
        public shotsRangeAngle: number,
        distToPlayer: number,
        recoil: number,
        reload: number,
        bullet: EBullet,
        bulletSpawnOffset: number,
        name: string,
        index: number,
        unlockPrice?: IMaterialObject,
    ) {
        super(
            img,
            size,
            distToPlayer,
            recoil,
            reload,
            bullet,
            bulletSpawnOffset,
            name,
            index,
            unlockPrice
        );
    }
    get stats() {
        const bullet = BulletManager.getBullet({x:0, y:0}, 0, this.bullet, UIManager.p5);
        return {
            "bullet number": this.numShots.toString(),
            "damage to enemies": bullet.damage.toString(),
            "bullet speed": bullet.speed.toString()+"pixels/frame",
            "max range": bullet.maxRange.toString()+"pixels",
            "bullet size": bullet.size.toString()+"pixels",
            reload: this.reload.toString()+"ms",
        }
    }
    fire(pos: P5.Vector, p5: P5) {
        for (let i = 0; i < this.numShots; i++) {
            const angleOffset = p5.map(
                i,
                0,
                this.numShots,
                -this.shotsRangeAngle / 2,
                this.shotsRangeAngle / 2
            );
            BulletManager.spawnBullet(
                pos,
                PlayerManager.player.angle + angleOffset,
                this.bullet,
                p5
            );
        }
    }
}
