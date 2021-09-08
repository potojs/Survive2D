import P5 from "p5";
import { SpriteManager } from "../../game/spriteManager";
import { ETool } from "../../player/tools/toolManager";
import { Enemie } from "../enemie";
import { EEnemie } from "../enemieManager";

export class FatZombie extends Enemie {
    static health = 200;
    static size = 50;
    static speed = 1;
    static distToPlayer = 20;

    constructor(x: number, y: number, p5: P5, health?: number) {
        super(
            x,
            y,
            health || FatZombie.health,
            FatZombie.health,
            SpriteManager.sprites.enemies.zombies.bigZombie,
            EEnemie.FAT_ZOMBIE,
            FatZombie.size,
            FatZombie.speed,
            ETool.BIG_ZOMBIE_HAND,
            6,
            p5,
            FatZombie.distToPlayer,
        );
    }

}
