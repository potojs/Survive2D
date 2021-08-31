import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class WoodAxe extends Axe {
    constructor() {
        super(
            {
                wood: 3,
                stone: 0.5,
                iron: 0,
                damage: 10,
            },
            650,
            SpriteManager.sprites.player.tools.woodAxe,
            25,
            "Wood Axe",
            ETool.WOOD_AXE,
            {
                wood: 30,
                stone: 0,
                iron: 0,
            },
            ETool.STONE_AXE
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
