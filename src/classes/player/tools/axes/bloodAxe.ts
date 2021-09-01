import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Axe } from "./axe";



export class BloodAxe extends Axe {
    constructor() {
        super(
            {
                damage: 20,
                wood: 10,
                stone: 5,
                iron: 2.5
            },
            500,
            SpriteManager.sprites.enemies.weapons.bloodAxe,
            30,
            "Blood Axe",
            ETool.BLOOD_AXE
        )
    }
}