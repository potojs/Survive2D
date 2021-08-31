import P5 from "p5";
import { Bullet } from "./bullet";




export class heavySniperBullet extends Bullet {
    constructor(
        x: number,
        y: number,
        angle: number,
        p5: P5
    ){
        super(x, y, 5, 20, angle, 1500, 20, 100, p5);
    }
}