import P5 from "p5";
import { GameManager } from "../../game/gameManager";
import { MapManager } from "../../game/mapManager";
import { WoodWall } from "./woodWall";
import { StoneWall } from "./stoneWall";
import { IronWall } from "./ironWall";
import { WoodFloor } from "./woodFloor";
import { StoneFloor } from "./stoneFloor";
import { ETool } from "../../player/tools/toolManager";
import { PlayerManager } from "../../player/playerManager";
import { ECollider } from "../gameObject";
import { Utils } from "../../utils";
import { Building } from "./building";
import { EnemieManager } from "../../enemies/enemieManager";

// export enum EBuilding {
//     WOOD_WALL,
//     STONE_WALL,
//     IRON_WALL,
//     WOOD_FLOOR,
//     STONE_FLOOR
// }

export class BuildingManager {
    static buildingSize = 30;
    static woodColor = [132, 95, 76];
    static stoneColor = [100, 100, 100];
    static ironColor = [214, 214, 214];
    static currentSelledBuilding: Building;

    static showBuildPos(
        x: number,
        y: number,
        notEnoughMaterialMsg: string,
        hasEnoughMaterial: boolean,
        p5: P5
    ) {
        const player = PlayerManager.player;
        const gridX =
            p5.round(x / (BuildingManager.buildingSize * 2)) *
            BuildingManager.buildingSize *
            2;
        const gridY =
            p5.round(y / (BuildingManager.buildingSize * 2)) *
            BuildingManager.buildingSize *
            2;
        p5.rect(
            gridX,
            gridY,
            BuildingManager.buildingSize * 2,
            BuildingManager.buildingSize * 2
        );
        let canPlace = true;
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textSize(25);
        p5.fill(255);
        p5.noStroke();
        const building = BuildingManager.buildingAt(gridX, gridY);
        if (building && GameManager.mouseClicked) {
            const sellingMenu = document.querySelector(
                ".selling-building-menu"
            ) as HTMLDListElement;
            const trigger = document.querySelector(
                ".selling-building-menu-trigger"
            ) as HTMLDListElement;
            const priceSpan = document.querySelector(
                ".building-price-span"
            ) as HTMLSpanElement;
            const buildingNameP = document.querySelector(
                ".selling-building-name"
            ) as HTMLParagraphElement;
            buildingNameP.innerText = building.name;
            BuildingManager.currentSelledBuilding = building;
            for (const material in building.sellingPrice) {
                if (building.sellingPrice[material] > 0) {
                    priceSpan.innerText = `${building.sellingPrice[material]} ${material}`;
                }
            }
            trigger.style.width = building.size * 2 + "px";
            trigger.style.height = building.size * 2 + "px";
            const pos = p5.createVector(
                building.pos.x + p5.width / 2,
                building.pos.y + p5.height / 2 - building.size
            );
            pos.sub(player.pos);
            trigger.style.left = pos.x + "px";
            trigger.style.top = pos.y + building.size + "px";
            sellingMenu.style.left = pos.x + "px";
            sellingMenu.style.top = pos.y + "px";
            sellingMenu.classList.remove("not-visible");
        } else if (hasEnoughMaterial) {
            p5.text(
                notEnoughMaterialMsg,
                player.pos.x,
                -p5.height / 2 + player.pos.y + 20
            );
            canPlace = false;
        } else if (
            !BuildingManager.canPlaceBuildingAt(
                gridX,
                gridY,
                BuildingManager.getBuildType(PlayerManager.player.selectedTool),
                p5
            )
        ) {
            p5.text(
                "you can't place a building in an occupied tile or outside the map",
                player.pos.x,
                -p5.height / 2 + player.pos.y + 20
            );
            canPlace = false;
            canPlace = false;
        }
        if (!canPlace) {
            p5.noFill();
            p5.stroke(255, 0, 0);
            p5.strokeWeight(1);
            p5.rect(
                gridX,
                gridY,
                BuildingManager.buildingSize * 2 + 1,
                BuildingManager.buildingSize * 2 + 1
            );
        }
    }

    static buildingAt(x: number, y: number): Building | undefined {
        const gameObjects = MapManager.gameObjects;
        return gameObjects.find((gameObject) => {
            return (
                gameObject instanceof Building &&
                Math.abs(gameObject.pos.x - x) <= 5 &&
                Math.abs(gameObject.pos.y - y) <= 5
            );
        }) as Building;
    }

    static showBuildInfo(building: ETool, p5: P5) {
        const player = PlayerManager.player;
        const mouseX = GameManager.mouseX;
        const mouseY = GameManager.mouseY;
        const x = mouseX + player.pos.x - p5.width / 2;
        const y = mouseY + player.pos.y - p5.height / 2;

        const smallBuildingSize = 20;
        p5.push();
        p5.translate(
            player.pos.x +
                p5.cos(player.angle) * (player.size + smallBuildingSize),
            player.pos.y +
                p5.sin(player.angle) * (player.size + smallBuildingSize)
        );
        p5.rotate(player.angle);
        switch (building) {
            case ETool.WOOD_WALL:
                p5.stroke(0);
                p5.strokeWeight(1);
                p5.fill(BuildingManager.woodColor);
                p5.rect(0, 0, smallBuildingSize, smallBuildingSize);
                p5.pop();
                p5.strokeWeight(1);
                p5.stroke(0);
                p5.fill([...BuildingManager.woodColor, 100]);
                BuildingManager.showBuildPos(
                    x,
                    y,
                    "you need at least 3 wood to build a wooden wall",
                    player.woodAmt < 3,
                    p5
                );

                break;
            case ETool.STONE_WALL:
                p5.stroke(0);
                p5.strokeWeight(1);
                p5.fill(BuildingManager.stoneColor);
                p5.rect(0, 0, smallBuildingSize, smallBuildingSize);
                p5.pop();
                p5.strokeWeight(1);
                p5.stroke(0);
                p5.fill([...BuildingManager.stoneColor, 100]);
                BuildingManager.showBuildPos(
                    x,
                    y,
                    "you need at least 3 stone to build a stone wall",
                    player.stoneAmt < 3,
                    p5
                );
                break;
            case ETool.IRON_WALL:
                p5.stroke(0);
                p5.strokeWeight(1);
                p5.fill(BuildingManager.ironColor);
                p5.rect(0, 0, smallBuildingSize, smallBuildingSize);
                p5.pop();
                p5.strokeWeight(1);
                p5.stroke(0);
                p5.fill([...BuildingManager.ironColor, 100]);
                BuildingManager.showBuildPos(
                    x,
                    y,
                    "you need at least 3 iron to build an iron wall",
                    player.ironAmt < 3,
                    p5
                );
                break;
            case ETool.WOOD_FLOOR:
                p5.noStroke();
                p5.fill(BuildingManager.woodColor);
                p5.rect(0, 0, smallBuildingSize, smallBuildingSize);
                p5.pop();
                p5.noStroke();
                p5.fill([...BuildingManager.woodColor, 100]);
                BuildingManager.showBuildPos(
                    x,
                    y,
                    "you need at least 2 wood to build a wood floor",
                    player.woodAmt < 2,
                    p5
                );
                break;
            case ETool.STONE_FLOOR:
                p5.noStroke();
                p5.fill(BuildingManager.stoneColor);
                p5.rect(0, 0, smallBuildingSize, smallBuildingSize);
                p5.pop();
                p5.noStroke();
                p5.fill([...BuildingManager.stoneColor, 100]);
                BuildingManager.showBuildPos(
                    x,
                    y,
                    "you need at least 2 stone to build a stone floor",
                    player.stoneAmt < 2,
                    p5
                );
                break;
        }
    }
    static runBuilder(building: ETool, p5: P5) {
        const player = PlayerManager.player;
        const mouseX = GameManager.mouseX;
        const mouseY = GameManager.mouseY;
        BuildingManager.build(
            building,
            mouseX + player.pos.x - p5.width / 2,
            mouseY + player.pos.y - p5.height / 2,
            p5
        );
    }
    static canPlaceBuildingAt(
        x: number,
        y: number,
        buidlType: "wall" | "floor",
        p5: P5
    ): boolean {
        const gameObjects = MapManager.gameObjects;
        const mapDimensions = MapManager.mapDimensions;
        if (
            buidlType === "wall" &&
            PlayerManager.player.isCollidingSquare(new WoodWall(x, y, p5))
        ) {
            return false;
        }
        if (
            x <= -mapDimensions.w / 2 ||
            x >= mapDimensions.w / 2 ||
            y <= -mapDimensions.h / 2 ||
            y >= mapDimensions.h / 2
        ) {
            return false;
        }
        for (let i = 0; i < gameObjects.length; i++) {
            switch (gameObjects[i].colliderShape) {
                case ECollider.CIRCLE:
                    if (
                        Utils.collideSquareCircle(
                            new WoodWall(x, y, p5),
                            gameObjects[i]
                        )
                    ) {
                        return false;
                    }
                    break;
                case ECollider.SQUARE:
                case ECollider.NONE_SQUARE:
                    if (
                        Utils.collideSquareSquare(
                            new WoodWall(x, y, p5),
                            gameObjects[i]
                        )
                    ) {
                        return false;
                    }
                    break;
            }
        }
        for(let i=0;i<EnemieManager.enemies.length;i++){
            if(Utils.collideSquareCircle(
                new WoodWall(x, y, p5),
                EnemieManager.enemies[i]
            )) {
                return false;
            }
        }
        return true;
    }
    static getBuildType(building: ETool) {
        switch (building) {
            case ETool.IRON_WALL:
            case ETool.STONE_WALL:
            case ETool.WOOD_WALL:
                return "wall";
        }
        return "floor";
    }
    static build(building: ETool, x: number, y: number, p5: P5) {
        const player = PlayerManager.player;
        const gridX =
            p5.round(x / (BuildingManager.buildingSize * 2)) *
            BuildingManager.buildingSize *
            2;
        const gridY =
            p5.round(y / (BuildingManager.buildingSize * 2)) *
            BuildingManager.buildingSize *
            2;

        if (
            !BuildingManager.canPlaceBuildingAt(
                gridX,
                gridY,
                BuildingManager.getBuildType(building),
                p5
            )
        ) {
            return;
        }

        switch (building) {
            case ETool.WOOD_WALL:
                if (player.woodAmt >= 3) {
                    MapManager.gameObjects.push(new WoodWall(gridX, gridY, p5));
                    player.woodAmt -= 3;
                }
                break;
            case ETool.STONE_WALL:
                if (player.stoneAmt >= 3) {
                    MapManager.gameObjects.push(
                        new StoneWall(gridX, gridY, p5)
                    );
                    player.stoneAmt -= 3;
                }
                break;
            case ETool.IRON_WALL:
                if (player.ironAmt >= 3) {
                    MapManager.gameObjects.push(new IronWall(gridX, gridY, p5));
                    player.ironAmt -= 3;
                }
                break;
            case ETool.WOOD_FLOOR:
                if (player.woodAmt >= 2) {
                    MapManager.gameObjects.push(
                        new WoodFloor(gridX, gridY, p5)
                    );
                    player.woodAmt -= 2;
                }
                break;
            case ETool.STONE_FLOOR:
                if (player.stoneAmt >= 2) {
                    MapManager.gameObjects.push(
                        new StoneFloor(gridX, gridY, p5)
                    );
                    player.stoneAmt -= 2;
                }
                break;
        }
    }
}
