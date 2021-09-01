import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Sword } from "./sword";

export class WoodSword extends Sword {
    constructor() {
        super(
            {
                wood: 0.5,
                stone: 0,
                iron: 0,
                damage: 20,
            },
            SpriteManager.sprites.player.tools.woodSword,
            300,
            "Wood Sword",
            ETool.WOOD_SWORD,
            {
                wood: 50,
                stone: 0,
                iron: 0,
            },
            ETool.STONE_SWORD
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
