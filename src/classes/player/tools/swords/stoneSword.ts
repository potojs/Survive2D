import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Sword } from "./sword";

export class StoneSword extends Sword {
    constructor() {
        super(
            {
                wood: 1,
                stone: 0.5,
                iron: 0,
                damage: 30,
            },
            SpriteManager.sprites.player.tools.stoneSword,
            300,
            "Stone Sword",
            ETool.STONE_SWORD,
            {
                wood: 50,
                stone: 100,
                iron: 0,
            },
            ETool.IRON_SWORD
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
