import { SpriteManager } from "../../../game/spriteManager";
import { UIManager } from "../../../game/uiManager";
import { ETool } from "../toolManager";
import { BulletManager, EBullet } from "./bullets/bulletManager";
import { Grenade } from "./bullets/grenade";
import { Gun } from "./gun";



export class grenadeLauncher extends Gun {
    constructor() {
        super(
            SpriteManager.sprites.player.tools.grenadeLauncher,
            75,
            12,
            10,
            1500,
            EBullet.GRENADE,
            12,
            "Grenade Launcher",
            ETool.GRENADE_LAUNCHER,
            {
                wood: 2000,
                stone: 2000,
                iron: 1000,
            },
        );
    }
    get stats() {
        const bullet = BulletManager.getBullet({x:0, y:0}, 0, this.bullet, UIManager.p5) as Grenade;
        return { 
            "explosion range": bullet.explosionRange.toString(),
            "damage to enemies": bullet.explosionDamage.toString(),
            "bullet speed": bullet.speed.toString()+"pixels/frame",
            "max range": bullet.maxRange.toString()+"pixels",
            "bullet size": bullet.size.toString()+"pixels",
            reload: this.reload.toString()+"ms",
        }
    }
}