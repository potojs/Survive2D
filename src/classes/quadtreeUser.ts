import { quadtree } from "../main";
import { ECollider } from "./gameObjects/gameObject";

export class QuadtreeUser {
    constructor(
        public x: number,
        public y: number,
        public size: number,
        public collider: ECollider
    ) {
        quadtree.push({
            x,
            y,
            size,
            collider,
        });
    }
}
