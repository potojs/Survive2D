import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { EBullet } from "./bullets/bulletManager";
import { Shotgun } from "./shotgun";

export class PumpShotgun extends Shotgun {
    constructor() {
        super(
            SpriteManager.sprites.player.tools.pumpShotgun,
            90,
            8,
            Math.PI / 6,
            10,
            15,
            800,
            EBullet.PUMP_SHOTGUN_BULLET,
            3,
            "Pump Shotgun",
            ETool.PUMP_SHOTGUN,
            {
                wood: 500,
                stone: 1000,
                iron: 0
            },
        );
    }
}
