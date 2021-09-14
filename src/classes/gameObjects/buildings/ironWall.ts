import P5 from "p5";
import { EGameObject, IGameObject } from "../../game/mapManager";
import { MalayTool } from "../../player/tools/malayTool";
import { Tool } from "../../player/tools/tool";
import { Utils } from "../../utils";
import { Building } from "./building";
import { BuildingManager } from "./buildingManager";



export class IronWall extends Building {
    public ironLeft: number;
    constructor(
        x: number,
        y: number, 
        p5: P5
    ){
        super(x, y, {
            iron: 2,
            wood: 0, stone: 0
        }, true, "Iron Wall", 0, EGameObject.IRON_WALL, p5);
        this.ironLeft = 30;
    }
    getData(): IGameObject {
        return {
            ...super.getData(),
            ironLeft: this.ironLeft
        }
    }
    show() {
        const p5 = this.p5;
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(BuildingManager.ironColor)
        // added the -2 to acount for the stroke
        p5.rect(this.pos.x, this.pos.y, this.size*2 - 2, this.size*2 - 2);

    }
    getHitBy(tool: Tool, isPlayer: boolean) {
        if(!isPlayer) {
            this.ironLeft -= (tool as MalayTool).damage.iron;
            if(this.ironLeft <= 0) {
                this.destroyed = true;
            }
            this.ironLeft = Utils.format(this.ironLeft, 1);
        }
            
    }
}