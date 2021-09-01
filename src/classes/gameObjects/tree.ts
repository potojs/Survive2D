import P5 from "p5";
import { EGameObject, IGameObject } from "../game/mapManager";
import { SpriteManager } from "../game/spriteManager";
import { PlayerManager } from "../player/playerManager";
import { MalayTool } from "../player/tools/malayTool";
import { Tool } from "../player/tools/tool";
import { Utils } from "../utils";
import { ECollider, GameObject } from "./gameObject";


export class Tree extends GameObject {
    static size = 80;
    static woodAmtPerTree = 20;
    
    public woodLeft: number;
    private apperanceInfo: {
        angle: number,
        additionalImgSize: number
    }
    constructor(
        x: number,
        y: number,
        public p5: P5
    ){
        super(x, y, ECollider.CIRCLE, Tree.size, EGameObject.TREE, p5);
        this.apperanceInfo = {
            angle: Math.random()*Math.PI*2,
            additionalImgSize: 5
        }
        this.woodLeft = Tree.woodAmtPerTree;
    }
    getData(): IGameObject {
        return {
            ...super.getData(),
            woodLeft: this.woodLeft
        }
    }
    getHitBy(tool: Tool, isPlayer: boolean, materialCollected: { wood: number, stone: number, iron: number }) {
        materialCollected.wood+=Math.min((tool as MalayTool).damage.wood, this.woodLeft);
        this.woodLeft-=(tool as MalayTool).damage.wood;
        
        if(this.woodLeft <= 0) {
            this.destroyed = true;
            this.quadtreeUser.remove();
        }
        
        materialCollected.wood = Utils.format(materialCollected.wood, 1);
        this.woodLeft = Utils.format(this.woodLeft, 1);
        
        if(isPlayer) {
            const player = PlayerManager.player;
            player.woodAmt+=(tool as MalayTool).damage.wood;
            player.allWoodCollected+=(tool as MalayTool).damage.wood;
            player.stoneAmt = Utils.format(player.stoneAmt, 1);
        }
    }
    show() {
        const p5 = this.p5;
        const treeImg = SpriteManager.sprites.environment.tree;
        const size = (this.size + this.apperanceInfo.additionalImgSize) * 2;
        p5.push();
        p5.translate(this.pos);
        p5.rotate(this.apperanceInfo.angle);
        p5.image(treeImg, 0, 0, size, size);
        p5.pop();
    }
}