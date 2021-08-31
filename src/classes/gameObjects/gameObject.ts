import P5 from "p5";
import { EGameObject, IGameObject } from "../game/mapManager";
import { Tool } from "../player/tools/tool";

export enum ECollider {
    SQUARE,
    CIRCLE,
    NONE_SQUARE
}

export class GameObject {
    pos: P5.Vector;
    public destroyed: boolean

    constructor(
        x: number,
        y: number,
        public colliderShape: ECollider,
        public size: number,
        public type: EGameObject,
        public p5: P5
    ){
        this.pos = p5.createVector(x, y);
        this.destroyed = false;
    }
    getData(): IGameObject {
        return {
            x: this.pos.x,
            y: this.pos.y,
            type: this.type
        }
    }
    update(){}
    show(){}
    getHitBy(tool: Tool, isPlayer: boolean, materialCollected: { wood: number, stone: number, iron: number }){}
}