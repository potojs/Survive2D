import P5 from "p5";
import { EGameObject } from "../../game/mapManager";
import { Building } from "./building";
import { BuildingManager } from "./buildingManager";



export class StoneFloor extends Building {
    constructor(
        x: number,
        y: number, 
        p5: P5
    ){
        super(x, y, {
            stone: 1,
            wood: 0, iron: 0
        }, false, "Stone Floor", EGameObject.STONE_FLOOR, p5);
    }
    show() {
        const p5 = this.p5;
        p5.strokeWeight(0.5);
        p5.stroke(BuildingManager.stoneColor);
        p5.fill(BuildingManager.stoneColor);
        p5.rect(this.pos.x, this.pos.y, this.size*2, this.size*2);

    }
}