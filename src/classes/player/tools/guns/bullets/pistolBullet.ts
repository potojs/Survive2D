import P5 from "p5";
import { Bullet } from "./bullet";




export class PistolBullet extends Bullet {
    constructor(
        x: number,
        y: number,
        angle: number,
        p5: P5
    ){
        super(x, y, 3, 10, angle, 500, 15, 20, p5);
    }
}