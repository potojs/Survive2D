import P5 from "p5";
import { EGameObject } from "../../game/mapManager";
import { Building } from "./building";
import { BuildingManager } from "./buildingManager";



export class WoodFloor extends Building {
    constructor(
        x: number,
        y: number, 
        p5: P5
    ){
        super(x, y, {
            wood: 1,
            stone: 0, iron: 0
        }, false, "Wood Floor", 0.6, EGameObject.WOOD_FLOOR, p5);
    }
    show() {
        const p5 = this.p5;
        p5.strokeWeight(0.5);
        p5.stroke(BuildingManager.woodColor);
        p5.fill(BuildingManager.woodColor);
        p5.rect(this.pos.x, this.pos.y, this.size*2, this.size*2);

    }
}