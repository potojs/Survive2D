import P5 from "p5";
import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Hand } from "./hand";


export class ZombieHand extends Hand {
    constructor(){
        super(
            SpriteManager.sprites.enemies.weapons.zombieHand as P5.Image,
            15,
            5,
            {
                damage: 10,
                wood: 4,
                stone: 2,
                iron: 1,
            },
            1500,
            15,
            10,
            Math.PI/2,
            "Zombie Hand",
            ETool.ZOMBIE_HAND
        )
    }
    
}