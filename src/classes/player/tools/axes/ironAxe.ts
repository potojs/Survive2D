import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class IronAxe extends Axe {
    constructor() {
        super(
            {
                wood: 8,
                stone: 3,
                iron: 0.5,
                damage: 30
            },
            550,
            SpriteManager.sprites.player.tools.ironAxe,
            25,
            "Iron Axe",
            ETool.IRON_AXE,
            {
                wood: 250,
                stone: 0,
                iron: 150,
            },
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
