import P5 from "p5";
import { SpriteManager } from "../../../game/spriteManager";
import { ETool } from "../toolManager";
import { Hand } from "./hand";


export class BigZombieHand extends Hand {
    constructor(){
        super(
            SpriteManager.sprites.enemies.weapons.zombieHand as P5.Image,
            25,
            0,
            {
                damage: 10,
                wood: 6,
                stone: 3,
                iron: 2,
            },
            2000,
            15,
            5,
            Math.PI/1.5,
            "Big Zombie Hand",
            ETool.BIG_ZOMBIE_HAND
        )
    }
    
}