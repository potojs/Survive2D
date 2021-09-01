import { quadtree } from "../main";
import { MapManager } from "./game/mapManager";
import { ECollider, GameObject } from "./gameObjects/gameObject";
import { Utils } from "./utils";

export interface IQuadtreeItem {
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
    collider: ECollider;
    userData: GameObject;
}

export class QuadtreeUser {
    public item: IQuadtreeItem

    constructor(
        public x: number,
        public y: number,
        public size: number,
        public collider: ECollider,
        public userData: GameObject
    ) {
        this.item = {
            x: x + MapManager.mapDimensions.w/2 - size,
            y: y + MapManager.mapDimensions.h/2 - size,
            width: size * 2,
            height: size * 2,
            size,
            collider,
            userData
        }
        quadtree.push(this.item, true);
    }

    getCollision(): GameObject[] {
        const collision = quadtree.colliding(this.item, Utils.collision);
        return collision.map(elt=>elt.userData);
    }

    updateBy(dx: number, dy: number = 0) {
        this.item.x += dx;
        this.item.y += dy;
    }
    update(x: number, y: number) {
        this.item.x = x + MapManager.mapDimensions.w/2 - this.item.size;
        this.item.y = y + MapManager.mapDimensions.h/2 - this.item.size;
    }

    remove() {
        quadtree.remove(this.item);
    }
}
