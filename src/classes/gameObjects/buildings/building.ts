import P5 from "p5";
import { EGameObject } from "../../game/mapManager";
import { ECollider, GameObject } from "../gameObject";
import { BuildingManager } from "./buildingManager";



export class Building extends GameObject {
    constructor(
        x: number,
        y: number,
        public sellingPrice: {
            wood: number,
            stone: number,
            iron: number,
            [key: string]: any
        },
        public doesCollide: boolean,
        public name: string,
        public playerSpeedUp: number,
        public type: EGameObject,
        p5: P5,
    ) {
        super(x, y, doesCollide?ECollider.SQUARE:ECollider.NONE_SQUARE, BuildingManager.buildingSize, type, p5);
    }
}