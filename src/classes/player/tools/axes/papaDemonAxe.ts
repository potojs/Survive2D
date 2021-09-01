import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Axe } from "./axe";



export class PapaDemonAxe extends Axe {
    constructor() {
        super(
            {
                damage: 50,
                wood: 30,
                stone: 15,
                iron: 10
            },
            1000,
            SpriteManager.sprites.enemies.weapons.papaDemonAxe,
            65,
            "Papa Demon Axe",
            ETool.PAPA_DEMON_AXE
        )
    }
}