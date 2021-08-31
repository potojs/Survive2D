import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { EBullet } from "./bullets/bulletManager";
import { Gun } from "./gun";

export class Pistol extends Gun {
    constructor() {
        super(
            SpriteManager.sprites.player.tools.pistol,
            50,
            10,
            10,
            300,
            EBullet.PISTOL_BULLET,
            3,
            "Pistol",
            ETool.PISTOL,
            {
                wood: 300,
                stone: 300,
                iron: 0,
            },
        );
    }
}
