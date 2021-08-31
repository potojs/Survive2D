import P5 from "p5";


export class Particule {
    public pos: P5.Vector;
    public vel: P5.Vector;
    public lifeTime: number;
    public done: boolean;
    protected timeCreated: number;

    constructor(
        x: number, 
        y: number,
        public maxAge: number,
        protected p5: P5
    ){
        this.lifeTime = 100;
        this.pos = p5.createVector(x, y);
        this.vel = p5.createVector();
        this.done = false;
        this.timeCreated = new Date().getTime();
    }
    show() {}
    update() {
        this.lifeTime = this.p5.map(
            new Date().getTime() - this.timeCreated,
            0, this.maxAge,
            100, 0
        );
        this.pos.add(this.vel);
        if(this.lifeTime < 0) {
            this.done = true;
        }
    }
}