import P5 from "p5";
import { UIManager } from "./game/uiManager";
import { ECollider } from "./gameObjects/gameObject";
import { PlayerManager } from "./player/playerManager";
import { IQuadtreeItem } from "./quadtreeUser";

export interface IMaterialObject {
    wood: number;
    stone: number;
    iron: number;
    [key: string]: any;
}

export interface ICollidableObject<T extends { x: number; y: number }> {
    pos: T;
    size: number;
}

export interface IVector {
    x: number;
    y: number;
}

export class Utils {
    static getRandomSpawnPos(): P5.Vector {
        const thickness = 30;
        const p5 = UIManager.p5;
        const player = PlayerManager.player;
        const topSecArea = thickness * (p5.width + thickness * 2);
        const bottomSecArea = topSecArea;
        const leftSecArea = thickness * (p5.height - thickness * 2);
        const rightSecArea = leftSecArea;
        const areaSum = topSecArea + leftSecArea + rightSecArea + bottomSecArea;
        const topSecProb = topSecArea / areaSum;
        const bottomSecProb = bottomSecArea / areaSum;
        const leftSecProb = leftSecArea / areaSum;
        const randomNum = p5.random();

        if (randomNum > 0 && randomNum < topSecProb) {
            // spwn at the top
            return P5.Vector.add(
                player.pos,
                p5.createVector(
                    p5.random(
                        -p5.width / 2 - thickness,
                        p5.width / 2 + thickness
                    ),
                    p5.random(-p5.height / 2 + thickness, -p5.height / 2)
                )
            );
        } else if (randomNum > topSecProb && randomNum < bottomSecProb * 2) {
            // spwn at the bottom
            return P5.Vector.add(
                player.pos,
                p5.createVector(
                    p5.random(
                        -p5.width / 2 - thickness,
                        p5.width / 2 + thickness
                    ),
                    p5.random(p5.height / 2 + thickness, p5.height / 2)
                )
            );
        } else if (
            randomNum > bottomSecProb &&
            randomNum < leftSecProb + bottomSecProb * 2
        ) {
            // spwn in the left
            return P5.Vector.add(
                player.pos,
                p5.createVector(
                    p5.random(-p5.width / 2 - thickness, -p5.width / 2),
                    p5.random(-p5.height / 2, p5.height / 2)
                )
            );
        } else {
            // spwn in the right
            return P5.Vector.add(
                player.pos,
                p5.createVector(
                    p5.random(p5.width / 2 + thickness, p5.width / 2),
                    p5.random(-p5.height / 2, p5.height / 2)
                )
            );
        }
    }
    static clamp(val: number, min: number, max: number) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        }
        return val;
    }
    static format(val: number, presi: number) {
        return Math.round(val * 10 ** presi) / 10 ** presi;
    }
    static collision(item1: IQuadtreeItem, item2: IQuadtreeItem): boolean {
        if (
            item1.collider === ECollider.NONE_SQUARE ||
            item2.collider === ECollider.NONE_SQUARE
        )
            return false;

        if (
            item1.collider === ECollider.CIRCLE &&
            item2.collider === ECollider.CIRCLE
        ) {
            return (
                Utils.dist(
                    item1.x + item1.size,
                    item1.y + item1.size,
                    item2.x + item2.size,
                    item2.y + item2.size
                ) <
                item1.size + item2.size
            );
        }
        if (
            item1.collider === ECollider.SQUARE &&
            item2.collider === ECollider.CIRCLE
        ) {
            return Utils.collideSquareCircle(
                Utils.toCollidableObject(item1),
                Utils.toCollidableObject(item2)
            );
        }
        if (
            item2.collider === ECollider.SQUARE &&
            item1.collider === ECollider.CIRCLE
        ) {
            return Utils.collideSquareCircle(
                Utils.toCollidableObject(item2),
                Utils.toCollidableObject(item1)
            );
        }

        return false;
    }
    static toCollidableObject(item: IQuadtreeItem): ICollidableObject<IVector> {
        return {
            pos: {
                x: item.x + item.size,
                y: item.y + item.size,
            },
            size: item.size,
        };
    }
    static dist(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
    static collideSquareCircle<
        TVector1 extends IVector,
        TVector2 extends IVector,
        T extends ICollidableObject<TVector1>,
        H extends ICollidableObject<TVector2>
    >(object1: T, object2: H): boolean {
        const posX = object1.pos.x;
        const posY = object1.pos.y;
        const closestPoint = {
            x:
                Utils.clamp(object2.pos.x - posX, -object1.size, object1.size) +
                posX,
            y:
                Utils.clamp(object2.pos.y - posY, -object1.size, object1.size) +
                posY,
        };
        const dist = Math.sqrt(
            (closestPoint.x - object2.pos.x) ** 2 +
                (closestPoint.y - object2.pos.y) ** 2
        );
        return object2.size > dist;
    }
    static collideSquareSquare<
        T extends ICollidableObject<P5.Vector>,
        H extends ICollidableObject<P5.Vector>
    >(object1: T, object2: H): boolean {
        const rect1 = {
            x: object1.pos.x - object1.size,
            y: object1.pos.y - object1.size,
            w: object1.size * 2,
            h: object1.size * 2,
        };
        const rect2 = {
            x: object2.pos.x - object2.size,
            y: object2.pos.y - object2.size,
            w: object2.size * 2,
            h: object2.size * 2,
        };
        return (
            rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.y + rect1.h > rect2.y
        );
    }
}
