import P5 from "p5";
import { SpriteManager } from "../../game/spriteManager";
import { ETool } from "../../player/tools/toolManager";
import { Enemie } from "../enemie";
import { EEnemie } from "../enemieManager";

export class MediumZombie extends Enemie {
    static health = 60;
    static size = 25;
    static speed = 1.5;
    static distToPlayer = 20;

    constructor(x: number, y: number, p5: P5, health?: number) {
        super(
            x,
            y,
            health || MediumZombie.health,
            MediumZombie.health,
            SpriteManager.sprites.enemies.zombies.normalZombie,
            EEnemie.MEDIUM_ZOMBIE,
            MediumZombie.size,
            MediumZombie.speed,
            ETool.ZOMBIE_HAND,
            4,
            p5,
            MediumZombie.distToPlayer
        );
    }

}
