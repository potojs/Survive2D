import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Sword } from "./sword";

export class IronSword extends Sword {
    constructor() {
        super(
            {
                wood: 2,
                stone: 1,
                iron: 0.5,
                damage: 40,
            },
            SpriteManager.sprites.player.tools.ironSword,
            300,
            "Iron Sword",
            ETool.IRON_SWORD,
            {
                wood: 0,
                stone: 50,
                iron: 50,
            },
        );
    }
    hitEffect() {
        super.hitEffect(true);
    }
}
