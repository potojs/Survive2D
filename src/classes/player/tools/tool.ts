import P5 from "p5";
import { MovingObject } from "../../movingObject";
import { IMaterialObject } from "../../utils";
import { ETool } from "./toolManager";
export interface IToolsDamage {
    damage: number,
    wood: number,
    stone: number,
    iron: number,
    [key: string]: any
}


export class Tool {
    protected p5: P5 | undefined;
    public canHit: boolean;
    public holder?: MovingObject;
    constructor(
        public reload: number,
        public name: string,
        public index: ETool,
        public unlockPrice?: IMaterialObject,
        public upgrade?: ETool
    ){
        this.canHit = true;
    }
    get stats(): {[key: string]: string} {
        return {};
    }
    attach(movingObject: MovingObject) {
        this.holder = movingObject;
    }
    setup(p5: P5) {
        this.p5 = p5;
    }
    animateHit(){};
    hitEffect(a: boolean){};
    hit() {
        if(this.canHit) {
            this.animateHit();
            this.hitEffect(false);
            this.canHit = false;
            setTimeout(()=>{
                this.canHit = true;
            }, this.reload);
        };
    }
    show() {}
    shouldRotate(pos: P5.Vector): boolean {
        // if you don't know what the dot product is...
        // idk go study some linear algebra or something it's not my problem
        const holder = this.holder as MovingObject;
        const dotProduct = P5.Vector.sub(pos, holder.pos).dot(1, 0);
        return dotProduct <= 0;
    }
}

