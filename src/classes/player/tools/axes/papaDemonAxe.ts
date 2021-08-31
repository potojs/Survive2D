import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Axe } from "./axe";



export class PapaDemonAxe extends Axe {
    constructor() {
        super(
            {
                damage: 30,
                wood: 20,
                stone: 8,
                iron: 5
            },
            1000,
            SpriteManager.sprites.enemies.weapons.papaDemonAxe,
            60,
            "Papa Demon Axe",
            ETool.PAPA_DEMON_AXE
        )
    }
}