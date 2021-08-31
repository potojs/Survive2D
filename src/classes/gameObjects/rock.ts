import P5 from "p5";
import { EGameObject } from "../game/mapManager";
import { SpriteManager } from "../game/spriteManager";
import { PlayerManager } from "../player/playerManager";
import { MalayTool } from "../player/tools/malayTool";
import { Tool } from "../player/tools/tool";
import { Utils } from "../utils";
import { ECollider, GameObject } from "./gameObject";


export class Rock extends GameObject {
    static size = 60;
    static stoneAmtPerRock = 10;
    
    public stoneLeft: number;
    private apperanceInfo: {
        additionalImgSize: number
    }
    constructor(
        x: number,
        y: number,
        public p5: P5
    ){
        super(x, y, ECollider.CIRCLE, Rock.size, EGameObject.ROCK, p5);
        this.apperanceInfo = {
            additionalImgSize: 5
        }
        this.stoneLeft = Rock.stoneAmtPerRock;
    }
    getHitBy(tool: Tool, isPlayer: boolean, materialCollected: { wood: number, stone: number, iron: number }) {
        const player = PlayerManager.player;

        materialCollected.stone += Math.min((tool as MalayTool).damage.stone, this.stoneLeft);
        this.stoneLeft -= (tool as MalayTool).damage.stone;
        
        if(this.stoneLeft <= 0) {
            this.destroyed = true;
        }
        
        materialCollected.stone = Utils.format(materialCollected.stone, 1);
        this.stoneLeft = Utils.format(this.stoneLeft, 1);

        if(isPlayer) {
            player.stoneAmt += (tool as MalayTool).damage.stone;
            player.allStoneCollected+=(tool as MalayTool).damage.stone;
            player.stoneAmt = Utils.format(player.stoneAmt, 1);
        }


    }
    show() {
        const p5 = this.p5;
        const stoneImg = SpriteManager.sprites.environment.rock;
        const size = (this.size + this.apperanceInfo.additionalImgSize) * 2;
        p5.image(stoneImg, this.pos.x, this.pos.y, size, size);
    }
}