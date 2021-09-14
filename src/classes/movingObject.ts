import P5 from "p5";
import { quadtree } from "../main";
import { EGameObject, MapManager } from "./game/mapManager";
import { ECollider, GameObject } from "./gameObjects/gameObject";
import { QuadtreeUser } from "./quadtreeUser";
import { ICollidableObject, Utils } from "./utils";

export class MovingObject extends GameObject {
    public pos: P5.Vector;
    public vel: P5.Vector;
    
    constructor(
        x: number, 
        y: number,
        public angle: number,
        public size: number,
        public speed: number,
        public p5: P5
    ) {
        super(x, y, ECollider.CIRCLE, size, EGameObject.MOVING_OBJECT, p5);
        this.pos = p5.createVector(x, y);
        this.vel = p5.createVector();

    }
    boundries() {
        const width = MapManager.mapDimensions.w;
        const height = MapManager.mapDimensions.h;
        if(this.pos.x < -width/2+this.size) {
            this.pos.x =  -width/2+this.size
        }
        if(this.pos.x > width/2-this.size) {
            this.pos.x =  width/2-this.size
        }
        if(this.pos.y < -height/2+this.size) {
            this.pos.y =  -height/2+this.size
        }
        if(this.pos.y > height/2-this.size) {
            this.pos.y =  height/2-this.size
        }
    }
    isCollidingCircle(object: ICollidableObject<P5.Vector>): boolean {
        return (
            P5.Vector.dist(object.pos, this.pos) < this.size + object.size
        );
    }
    isCollidingSquare(object: ICollidableObject<P5.Vector>) {
        return (
            Utils.collideSquareCircle(object, this)
        )
    }

    collide(object: GameObject, normVec: { x: number, y: number }, speed: number, dt: number): GameObject[] {
        const gameObjectsCollidedWith = [];
        switch (object.colliderShape) {
            case ECollider.CIRCLE:
                if(this.isCollidingCircle(object)) {
                    gameObjectsCollidedWith.push(object);
                    const normVec = P5.Vector.fromAngle(
                        this.p5.atan2(
                            this.pos.y - object.pos.y,
                            this.pos.x - object.pos.x
                        )
                    );
                    for(let i=0;i<speed*dt+1;i++) {
                        if(this.isCollidingCircle(object)) {
                            this.pos.add(normVec);
                        }else{
                            return gameObjectsCollidedWith;
                        }
                    }
                }
                break;
            case ECollider.SQUARE:
                for(let i=0;i<speed * dt;i++){
                    if(this.isCollidingSquare(object)){
                        gameObjectsCollidedWith.push(object);
                        this.pos.x -= normVec.x / Math.abs(normVec.x) || 0;
                        this.pos.y -= normVec.y / Math.abs(normVec.y) || 0;
                    }else{
                        return gameObjectsCollidedWith;
                    }
                }
                break;
        }
        return gameObjectsCollidedWith;
    }
    update(dt: number) {
        this.pos.add(P5.Vector.mult(this.vel, dt));

    }
}