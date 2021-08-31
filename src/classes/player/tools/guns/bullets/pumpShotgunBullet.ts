import P5 from "p5";
import { Bullet } from "./bullet";



export class PumpShotgunBullet extends Bullet {
    constructor(
        x: number,
        y: number,
        angle: number,
        p5: P5
    ){
        super(x, y, 4, 10, angle, 300, 5, 10, p5);
    }
}