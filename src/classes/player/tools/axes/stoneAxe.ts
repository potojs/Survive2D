import { SpriteManager } from "../../../game/spriteManager";
import { Axe } from "./axe";
import { ETool } from "../toolManager";

export class StoneAxe extends Axe {
    constructor() {
        super(
            {
                wood: 5,
                stone: 1.5,
                iron: 0,
                damage: 20,
            },
            600,
            SpriteManager.sprites.player.tools.stoneAxe,
            25,
            "Stone Axe",
            ETool.STONE_AXE,
            {
                wood: 60,
                stone: 100,
                iron: 0,
            },
            ETool.IRON_AXE
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
