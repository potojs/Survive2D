import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class IronPickaxe extends Axe {
    constructor() {
        super(
            {
                wood: 2,
                stone: 8,
                iron: 8,
                damage: 15,
            },
            600,
            SpriteManager.sprites.player.tools.ironPickaxe,
            45,
            "Iron Pickaxe",
            ETool.IRON_PICKAXE,
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
