import P5 from "p5";
import { Particule } from "./particule";



export class TextEffect extends Particule {
    static speed = 1.5;

    constructor(
        public text: string,
        x: number,
        y: number,
        private isDamageEffect: boolean,
        p5: P5
    ) {
        super(x, y, 500, p5);
        this.vel.set(0, -TextEffect.speed);
    }
    show() {
        const p5 = this.p5;
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.noStroke();
        p5.fill(255, 255*+!this.isDamageEffect, 255*+!this.isDamageEffect, p5.map(this.lifeTime, 0, 100, 0, 255));
        p5.textSize(20);
        p5.text(this.text, this.pos.x, this.pos.y);
    }

}