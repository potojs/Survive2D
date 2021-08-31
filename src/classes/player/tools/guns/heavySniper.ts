import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { EBullet } from "./bullets/bulletManager";
import { Gun } from "./gun";

export class heavySniper extends Gun {
    constructor() {
        super(
            SpriteManager.sprites.player.tools.heavySniper,
            100,
            15,
            20,
            1500,
            EBullet.HEAVY_SNIPER_BULLET,
            15,
            "Heavey Sniper",
            ETool.HEAVY_SNIPER,
            {
                wood: 250,
                stone: 500,
                iron: 250,
            },
        );
    }
}
