import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class StonePickaxe extends Axe {
    constructor() {
        super(
            {
                wood: 1,
                stone: 5,
                iron: 5,
                damage: 10,
            },
            600,
            SpriteManager.sprites.player.tools.stonePickaxe,
            45,
            "Stone Pickaxe",
            ETool.STONE_PICKAXE,
            {
                wood: 60,
                stone: 100,
                iron: 0,
            },
            ETool.IRON_PICKAXE
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
