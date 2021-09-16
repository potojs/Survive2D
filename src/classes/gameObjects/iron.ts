import P5 from "p5";
import { EGameObject, IGameObject } from "../game/mapManager";
import { SpriteManager } from "../game/spriteManager";
import { PlayerManager } from "../player/playerManager";
import { MalayTool } from "../player/tools/malayTool";
import { Tool } from "../player/tools/tool";
import { Utils } from "../utils";
import { ECollider, GameObject } from "./gameObject";


export class Iron extends GameObject {
    static size = 60;
    static ironAmt = 10;
    static stoneAmt = 10;
    
    public ironLeft: number;
    private apperanceInfo: {
        additionalImgSize: number
    }
    constructor(
        x: number,
        y: number,
        public p5: P5
    ){
        super(x, y, ECollider.CIRCLE, Iron.size, EGameObject.IRON, p5);
        this.apperanceInfo = {
            additionalImgSize: 5
        }
        this.ironLeft = Iron.ironAmt;
    }
    getData(): IGameObject {
        return {
            ...super.getData(),
            ironLeft: this.ironLeft
        }
    }
    getHitBy(tool: Tool, isPlayer: boolean, materialCollected: { wood: number, stone: number, iron: number }) {
        materialCollected.iron += Math.min((tool as MalayTool).damage.iron, this.ironLeft);
        this.ironLeft -= (tool as MalayTool).damage.iron;
        
        if(this.ironLeft <= 0) {
            this.destroyed = true;
            this.quadtreeUser.remove();
            if(isPlayer) {
                const player = PlayerManager.player;
                materialCollected.stone += Iron.stoneAmt;
                player.allStoneCollected += Iron.stoneAmt;
                player.stoneAmt += Iron.stoneAmt;

            }
        }
        
        materialCollected.iron = Utils.format(materialCollected.iron, 1);
        this.ironLeft = Utils.format(this.ironLeft, 1);

        if(isPlayer) {
            const player = PlayerManager.player;
            player.allIronCollected += Math.min((tool as MalayTool).damage.iron, this.ironLeft);
            player.ironAmt += Math.min((tool as MalayTool).damage.iron, this.ironLeft);
            player.ironAmt = Utils.format(player.ironAmt, 1);
        }
    }
    show() {
        const p5 = this.p5;
        const ironImg = SpriteManager.sprites.environment.iron;
        const size = (this.size + this.apperanceInfo.additionalImgSize) * 2;
        p5.image(ironImg, this.pos.x, this.pos.y, size, size);
    }
}