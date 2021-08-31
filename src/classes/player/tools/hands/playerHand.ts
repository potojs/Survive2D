import P5 from "p5";
import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Hand } from "./hand";




export class PlayerHand extends Hand {
    constructor(){
        super(
            SpriteManager.sprites.player.tools.playerHand as P5.Image,
            10,
            0,
            {
                damage: 10,
                wood: 1,
                stone: 0.1,
                iron: 0,
            },
            300,
            25,
            0,
            Math.PI/2,
            "Player Hand",
            ETool.PLAYER_HAND
        )
    }
    hitEffect() {
        super.hitEffect(true);
    }
}