import P5 from "p5";
import { Bullet } from "./bullet";
import { Grenade } from "./grenade";
import { heavySniperBullet } from "./heavySniperBullet";
import { PistolBullet } from "./pistolBullet";
import { PumpShotgunBullet } from "./pumpShotgunBullet";

export enum EBullet {
    PISTOL_BULLET,
    PUMP_SHOTGUN_BULLET,
    HEAVY_SNIPER_BULLET,
    GRENADE,
}

export class BulletManager {
    static bullets: Bullet[] = [];
    static getBullet<T extends { x: number; y: number }>(
        pos: T,
        angle: number,
        bulletType: EBullet,
        p5: P5
    ) {
        switch (bulletType) {
            case EBullet.PISTOL_BULLET:
                return new PistolBullet(pos.x, pos.y, angle, p5);
            case EBullet.PUMP_SHOTGUN_BULLET:
                return new PumpShotgunBullet(pos.x, pos.y, angle, p5);
            case EBullet.HEAVY_SNIPER_BULLET:
                return new heavySniperBullet(pos.x, pos.y, angle, p5);
            case EBullet.GRENADE:
                return new Grenade(pos.x, pos.y, angle, p5);
        }
    }
    static spawnBullet(
        pos: P5.Vector,
        angle: number,
        bulletType: EBullet,
        p5: P5
    ) {
        BulletManager.bullets.push(
            BulletManager.getBullet(pos, angle, bulletType, p5)
        );
    }
    static show() {
        for (const bullet of BulletManager.bullets) {
            bullet.show();
        }
    }
    static update(dt: number) {
        for (let i = 0; i < BulletManager.bullets.length; i++) {
            BulletManager.bullets[i].update(dt);
            if (BulletManager.bullets[i].destroyed) {
                BulletManager.bullets[i].quadtreeUser.remove();
                BulletManager.bullets.splice(i, 1);
                i--;
            }
        }
    }
}
