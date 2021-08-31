import P5 from "p5";
import { SpriteManager } from "../../game/spriteManager";
import { ETool } from "../../player/tools/toolManager";
import { Enemie } from "../enemie";
import { EEnemie } from "../enemieManager";

export class PapaDemon extends Enemie {
    static health = 350;
    static size = 50;
    static speed = 3;
    static distToPlayer = 40;

    constructor(x: number, y: number, p5: P5, health?: number) {
        super(
            x,
            y,
            health || PapaDemon.health,
            PapaDemon.health,
            SpriteManager.sprites.enemies.demons.papaDemon,
            EEnemie.PAPA_DEMON,
            PapaDemon.size,
            PapaDemon.speed,
            ETool.PAPA_DEMON_AXE,
            p5,
            PapaDemon.distToPlayer,
        );
    }

}
