import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class WoodPickaxe extends Axe {
    constructor() {
        super(
            {
                wood: 0.5,
                stone: 3,
                iron: 2,
                damage: 5,
            },
            650,
            SpriteManager.sprites.player.tools.woodPickaxe,
            45,
            "Wood Pickaxe",
            ETool.WOOD_PICKAXE,
            {
                wood: 30,
                stone: 0,
                iron: 0,
            },
            ETool.STONE_PICKAXE
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
