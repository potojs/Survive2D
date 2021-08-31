import P5 from "p5";
import { EGameObject } from "../../game/mapManager";
import { MalayTool } from "../../player/tools/malayTool";
import { Tool } from "../../player/tools/tool";
import { Utils } from "../../utils";
import { Building } from "./building";
import { BuildingManager } from "./buildingManager";



export class WoodWall extends Building {
    public woodLeft: number;
    constructor(
        x: number,
        y: number, 
        p5: P5
    ){
        super(x, y, {
            wood: 2,
            stone: 0, iron: 0
        }, true, "Wood Wall", EGameObject.WOOD_WALL, p5);
        this.woodLeft = 20;
    }
    show() {
        const p5 = this.p5;
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.fill(BuildingManager.woodColor)
        // added the -2 to acount for the stroke
        p5.rect(this.pos.x, this.pos.y, this.size*2 - 2, this.size*2 - 2);

    }
    getHitBy(tool: Tool, isPlayer: boolean) {
        if(!isPlayer) {
            this.woodLeft-=(tool as MalayTool).damage.wood;
            if(this.woodLeft <= 0) {
                this.destroyed = true;
            }
            this.woodLeft = Utils.format(this.woodLeft, 1);
        }
    }
}