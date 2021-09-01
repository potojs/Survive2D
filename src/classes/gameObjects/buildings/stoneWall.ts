import P5 from "p5";
import { EGameObject, IGameObject } from "../../game/mapManager";
import { MalayTool } from "../../player/tools/malayTool";
import { Tool } from "../../player/tools/tool";
import { Utils } from "../../utils";
import { Building } from "./building";
import { BuildingManager } from "./buildingManager";



export class StoneWall extends Building {
    public stoneLeft: number;

    constructor(
        x: number,
        y: number, 
        p5: P5
    ){
        super(x, y, {
            stone: 2,
            wood: 0, iron: 0
        }, true, "Stone Wall", EGameObject.STONE_WALL, p5);
        this.stoneLeft = 30;
    }
    getData(): IGameObject {
        return {
            ...super.getData(),
            stoneLeft: this.stoneLeft
        }
    }
    show() {
        const p5 = this.p5;
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(BuildingManager.stoneColor)
        // added the -2 to account for the stroke
        p5.rect(this.pos.x, this.pos.y, this.size*2 - 2, this.size*2 - 2);

    }
    getHitBy(tool: Tool, isPlayer: boolean) {
        if(!isPlayer) {
            this.stoneLeft -= (tool as MalayTool).damage.stone;
            if(this.stoneLeft <= 0) {
                this.destroyed = true;
            }
            this.stoneLeft = Utils.format(this.stoneLeft, 1);
        }


    }
}