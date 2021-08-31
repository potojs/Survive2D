import P5 from "p5";
import { SpriteManager } from "../../game/spriteManager";
import { ETool } from "../../player/tools/toolManager";
import { Enemie } from "../enemie";
import { EEnemie } from "../enemieManager";

export class Demon extends Enemie {
    static health = 80;
    static size = 30;
    static speed = 4.5;
    static distToPlayer = 10;

    constructor(x: number, y: number, p5: P5, health?: number) {
        super(
            x,
            y,
            health || Demon.health,
            Demon.health,
            SpriteManager.sprites.enemies.demons.demon,
            EEnemie.DEMON,
            Demon.size,
            Demon.speed,
            ETool.BLOOD_AXE,
            p5,
            Demon.distToPlayer,
        );
    }

}
