import P5 from "p5";
import { Particule } from "./particule";

export class ExplosionEffect extends Particule {
    static speed = 1.5;

    constructor(x: number, y: number, private radius: number, p5: P5) {
        super(x, y, 300, p5);
    }
    show() {
        const p5 = this.p5;
        p5.noStroke();
        p5.fill(255, 0, 0, p5.map(this.lifeTime, 0, 100, 0, 255));
        p5.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        console.log("bruh");
    }
}
