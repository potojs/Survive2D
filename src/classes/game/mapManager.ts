import P5 from "p5";
import { BuildingManager } from "../gameObjects/buildings/buildingManager";
import { GameObject } from "../gameObjects/gameObject";
import { Iron } from "../gameObjects/iron";
import { Tree } from "../gameObjects/tree";
import { Rock } from "../gameObjects/rock";
import { GameManager } from "./gameManager";
import { WoodFloor } from "../gameObjects/buildings/woodFloor";
import { WoodWall } from "../gameObjects/buildings/woodWall";
import { StoneFloor } from "../gameObjects/buildings/stoneFloor";
import { StoneWall } from "../gameObjects/buildings/stoneWall";
import { IronWall } from "../gameObjects/buildings/ironWall";

export enum EGameObject {
    WOOD_FLOOR,
    WOOD_WALL,
    STONE_FLOOR,
    STONE_WALL,
    IRON_WALL,
    TREE,
    ROCK,
    IRON,
    MOVING_OBJECT,
}

export interface IGameObject {
    x: number;
    y: number;
    type: EGameObject;
    woodLeft?: number;
    stoneLeft?: number;
    ironLeft?: number;
}

export class MapManager {
    static gameObjects: GameObject[] = [];
    static p5: P5;
    static objectDensity = {
        tree: {
            boxSize: 200,
            boxPadding: 50,
            percentage: 0.5,
            max: 100,
            count: 0,
        },
        rock: {
            boxSize: 300,
            limit: 100,
            max: 50,
            count: 0,
        },
        iron: {
            boxSize: 300,
            min: 5,
            max: 20,
            count: 0,
        },
    };
    static mapDimensions = {
        w: 10000,
        h: 10000,
    };

    static showMap() {
        const mapWidth = MapManager.mapDimensions.w;
        const mapHeight = MapManager.mapDimensions.h;

        const p5 = MapManager.p5;
        p5.fill(115, 160, 55);
        p5.noStroke();
        p5.rect(0, 0, mapWidth, mapHeight);
        const tileSize = BuildingManager.buildingSize;
        p5.stroke(50, 100, 35, 100);
        p5.strokeWeight(2);
        for (let i = tileSize; i < mapWidth / 2; i += tileSize * 2) {
            p5.line(i, mapHeight / 2, i, -mapHeight / 2);
            p5.line(-i, mapHeight / 2, -i, -mapHeight / 2);
        }
        for (let i = tileSize; i < mapHeight / 2; i += tileSize * 2) {
            p5.line(mapWidth / 2, i, -mapWidth / 2, i);
            p5.line(mapWidth / 2, -i, -mapWidth / 2, -i);
        }
    }
    static getGameObjectData(): IGameObject[] {
        const data: IGameObject[] = [];
        for (let i = 0; i < MapManager.gameObjects.length; i++) {
            data.push(MapManager.gameObjects[i].getData());
        }
        return data;
    }
    static showGameObjects() {
        const gameObjects = MapManager.gameObjects;
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].show();
            if (gameObjects[i].destroyed) {
                gameObjects[i].quadtreeUser.remove();
                gameObjects.splice(i, 1);
                i--;
            }
        }
    }

    static genMap(p5: P5) {
        MapManager.p5 = p5;
        if (localStorage.length > 0) {
            const gameObjectsData = JSON.parse(
                localStorage.getItem("game-objects") as string
            ) as IGameObject[];
            for (const gameObject of gameObjectsData) {
                const x = gameObject.x;
                const y = gameObject.y;
                switch (gameObject.type) {
                    case EGameObject.TREE:
                        const tree = new Tree(x, y, p5);
                        tree.woodLeft = gameObject.woodLeft!;
                        MapManager.gameObjects.push(tree);
                        break;
                    case EGameObject.ROCK:
                        const rock = new Rock(x, y, p5);
                        rock.stoneLeft = gameObject.stoneLeft!;
                        MapManager.gameObjects.push(rock);
                        break;
                    case EGameObject.IRON:
                        const iron = new Iron(x, y, p5);
                        iron.ironLeft = gameObject.ironLeft!;
                        MapManager.gameObjects.push(iron);
                        break;
                    case EGameObject.WOOD_FLOOR:
                        MapManager.gameObjects.push(new WoodFloor(x, y, p5));
                        break;
                    case EGameObject.WOOD_WALL: {
                            const wall = new WoodWall(x, y, p5);
                            wall.woodLeft = gameObject.woodLeft!;
                            MapManager.gameObjects.push(wall);
                        }
                        break;
                    case EGameObject.STONE_FLOOR:
                        MapManager.gameObjects.push(new StoneFloor(x, y, p5));
                        break;
                    case EGameObject.STONE_WALL: {
                            const wall = new StoneWall(x, y, p5);
                            wall.stoneLeft = gameObject.stoneLeft!;
                            MapManager.gameObjects.push(wall);
                        }
                        break;
                    case EGameObject.IRON_WALL: {
                            const wall = new IronWall(x, y, p5);
                            wall.ironLeft = gameObject.ironLeft!;
                            MapManager.gameObjects.push(wall);
                        }
                        break;
                }
            }
        } else {
            MapManager.genIron(p5);
            MapManager.genRocks(p5);
            MapManager.genTrees(p5);
        }
        const mapWidth = MapManager.mapDimensions.w;
        const mapHeight = MapManager.mapDimensions.h;
        setInterval(() => {
            if (
                !GameManager.gameEnded &&
                MapManager.objectDensity.tree.count <
                    MapManager.objectDensity.tree.max
            ) {
                const x = p5.random(-mapWidth / 2, mapWidth / 2);
                const y = p5.random(-mapHeight / 2, mapHeight / 2);
                MapManager.gameObjects.push(new Tree(x, y, p5));
                MapManager.objectDensity.tree.count++;
            }
        }, 1000);
        setInterval(() => {
            if (
                !GameManager.gameEnded &&
                MapManager.objectDensity.rock.count <
                    MapManager.objectDensity.rock.max
            ) {
                const x = p5.random(-mapWidth / 2, mapWidth / 2);
                const y = p5.random(-mapHeight / 2, mapHeight / 2);
                MapManager.gameObjects.push(new Rock(x, y, p5));
                MapManager.objectDensity.rock.count++;
            }
        }, 1500);
        setInterval(() => {
            if (
                !GameManager.gameEnded &&
                MapManager.objectDensity.iron.count <
                    MapManager.objectDensity.iron.max
            ) {
                const x = p5.random(-mapWidth / 2, mapWidth / 2);
                const y = p5.random(-mapHeight / 2, mapHeight / 2);
                MapManager.gameObjects.push(new Iron(x, y, p5));
                MapManager.objectDensity.iron.count++;
            }
        }, 4000);
    }
    static genIron(p5: P5) {
        const boxSize = MapManager.objectDensity.iron.boxSize;
        const minIron = MapManager.objectDensity.iron.min;
        const mapWidth = MapManager.mapDimensions.w;
        const mapHeight = MapManager.mapDimensions.h;
        const cols = p5.round(mapWidth / boxSize);
        const rows = p5.round(mapHeight / boxSize);
        let ironAmt = 0;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (p5.noise(i / 2, j / 2) > 0.7) {
                    ironAmt++;
                    const x = p5.random(
                        i * boxSize - mapWidth / 2,
                        (i + 1) * boxSize - mapWidth / 2
                    );
                    const y = p5.random(
                        j * boxSize - mapHeight / 2,
                        (j + 1) * boxSize - mapHeight / 2
                    );
                    MapManager.gameObjects.push(new Iron(x, y, p5));
                    MapManager.objectDensity.iron.count++;
                }
            }
        }
        for (let i = 0; i < minIron - ironAmt; i++) {
            const x = p5.random(-mapWidth / 2, mapWidth / 2);
            const y = p5.random(-mapHeight / 2, mapHeight / 2);
            MapManager.gameObjects.push(new Iron(x, y, p5));
            MapManager.objectDensity.iron.count++;
        }
    }
    static genRocks(p5: P5) {
        const boxSize = MapManager.objectDensity.rock.boxSize;
        const mapWidth = MapManager.mapDimensions.w;
        const mapHeight = MapManager.mapDimensions.h;
        const cols = p5.round(mapWidth / boxSize);
        const rows = p5.round(mapHeight / boxSize);
        let rockAmt = 0;

        outerLoop: for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (p5.noise(i / 2, j / 2) > 0.6) {
                    rockAmt++;
                    const x = p5.random(
                        i * boxSize - mapWidth / 2,
                        (i + 1) * boxSize - mapWidth / 2
                    );
                    const y = p5.random(
                        j * boxSize - mapHeight / 2,
                        (j + 1) * boxSize - mapHeight / 2
                    );
                    MapManager.gameObjects.push(new Rock(x, y, p5));
                    MapManager.objectDensity.rock.count++;
                }
                if (rockAmt >= MapManager.objectDensity.rock.limit) {
                    break outerLoop;
                }
            }
        }
    }
    static genTrees(p5: P5) {
        const treesDensity = MapManager.objectDensity.tree;
        const boxFullSize = treesDensity.boxSize + treesDensity.boxPadding * 2;
        const percentage = treesDensity.percentage;
        const mapWidth = MapManager.mapDimensions.w;
        const mapHeight = MapManager.mapDimensions.h;
        const cols = p5.round(mapWidth / boxFullSize);
        const rows = p5.round(mapHeight / boxFullSize);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (p5.random() < percentage) {
                    const x =
                        p5.random(
                            j * boxFullSize - mapWidth / 2,
                            j * boxFullSize -
                                mapWidth / 2 +
                                treesDensity.boxSize
                        ) +
                        (+!!(i % 2 === 0) * boxFullSize) / 2;
                    const y = p5.random(
                        i * boxFullSize - mapHeight / 2,
                        i * boxFullSize - mapHeight / 2 + treesDensity.boxSize
                    );
                    MapManager.gameObjects.push(new Tree(x, y, p5));
                    MapManager.objectDensity.tree.count++;
                }
            }
        }
    }
}
