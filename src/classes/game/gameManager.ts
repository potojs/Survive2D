import P5 from "p5";
import { Enemie } from "../enemies/enemie";
import { EEnemie, EnemieManager } from "../enemies/enemieManager";
import { ParticuleManager } from "../particules/particuleManager";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { BulletManager } from "../player/tools/guns/bullets/bulletManager";
import { Tool } from "../player/tools/tool";
import { ETool, ToolManager } from "../player/tools/toolManager";
import { MapManager } from "./mapManager";
import { Renderer } from "./renderer";
import { UIManager } from "./uiManager";
import { fps } from "../../main";

export class GameManager {
    static time = 0;
    static day = 0;
    static timeSinceGameStart = 0;
    static dayLength = 1000 * 60 * 2;
    static isNight = false;
    static nightTimePassed = 0;
    static mousePressed = false;
    static p5: P5;
    static mouseX: number;
    static mouseY: number;
    static updateMousePos = true;
    static mouseClicked = false;
    static mouseWasPressed = false;
    static gameEnded = false;
    static setup(p5: P5) {
        PlayerManager.createPlayer(p5);
        if (localStorage.length > 0) {
            const timeData = JSON.parse(localStorage.getItem("time") as string);
            if(timeData.finish) {
                GameManager.timeSinceGameStart = 
                    timeData.finish - timeData.start;
            }else{
                GameManager.timeSinceGameStart = +timeData.timeSinceStart;
            }
            // GameManager.gameStart =
            //     new Date().getTime() - (timeData.finish - timeData.start);
        }
        GameManager.p5 = p5;
        GameManager.time = 0;
        MapManager.genMap(p5);
        ToolManager.setup(p5);
        UIManager.setup(p5);
        EnemieManager.setup();
    }
    static saveGameData() {
        const player = PlayerManager.player;
        localStorage.setItem(
            "player",
            JSON.stringify({
                x: player.pos.x,
                y: player.pos.y,
                angle: player.angle,
                selectedTool: player.selectedTool,
                health: player.health,
                materials: {
                    wood: player.woodAmt,
                    stone: player.stoneAmt,
                    iron: player.ironAmt,
                },
                allMaterialCollected: {
                    wood: player.allWoodCollected,
                    stone: player.allStoneCollected,
                    iron: player.allIronCollected,
                },
            })
        );
        localStorage.setItem(
            "enemies",
            JSON.stringify({
                enemiesKilledCount: EnemieManager.numberEnemiesKilled,
                enemieData: EnemieManager.getEnemieData(),
            })
        );
        localStorage.setItem(
            "tools",
            JSON.stringify({
                unlockedTools: ToolManager.unlockedTools,
                notVisibleTools: ToolManager.notVisibleTools,
            })
        );
        localStorage.setItem(
            "time",
            JSON.stringify({
                timeSinceStart: GameManager.timeSinceGameStart.toString(),
            })
        );
        localStorage.setItem(
            "game-objects",
            JSON.stringify(MapManager.getGameObjectData())
        );
    }
    static endGame() {
        localStorage.clear();
        UIManager.showEndScreen();
        GameManager.gameEnded = true;
        (
            document.querySelector(".number-days-survived") as HTMLSpanElement
        ).innerText = GameManager.day.toString();
        (
            document.querySelector(".number-enemies-killed") as HTMLSpanElement
        ).innerText = EnemieManager.numberEnemiesKilled.toString();
    }
    static update(dt: number) {
        if (!GameManager.gameEnded) {
            const p5 = GameManager.p5;
            const player = PlayerManager.player;
            GameManager.mouseClicked =
                !GameManager.mouseWasPressed && GameManager.mousePressed;
            if (GameManager.updateMousePos) {
                GameManager.mouseX = p5.mouseX;
                GameManager.mouseY = p5.mouseY;
            }
            GameManager.timeSinceGameStart += dt * 1000 / fps;
            GameManager.time = p5.map(
                GameManager.timeSinceGameStart % GameManager.dayLength,
                0,
                GameManager.dayLength,
                0,
                100
            );
            const newDayVal = p5.ceil(
                GameManager.timeSinceGameStart /
                    GameManager.dayLength
            );
            if (GameManager.day !== newDayVal) {
                GameManager.day = newDayVal;
                UIManager.showNewDayEffect(GameManager.day);
            }
            BulletManager.update(dt);
            PlayerManager.update(dt);
            EnemieManager.update(player, dt);

            GameManager.mouseWasPressed = GameManager.mousePressed;
            if (!GameManager.gameEnded) {
                GameManager.saveGameData();
            }
        }
        ParticuleManager.update();
    }
    static show(dt: number) {
        const p5 = GameManager.p5;
        const player = PlayerManager.player;
        p5.background(10);
        p5.translate(
            -player.pos.x + p5.width / 2,
            -player.pos.y + p5.height / 2
        );
        Renderer.showMap();
        Renderer.showGameObjects();
        Renderer.showBullets();
        // enemie layer
        Renderer.showEnemiesTool(dt);
        Renderer.showEnemies();
        // player layer
        Renderer.showTool(dt);
        Renderer.showPlayer();

        Renderer.showParticules();
        Renderer.showLighting(p5);
        Renderer.showUI(p5);
        if (GameManager.mousePressed) {
            PlayerManager.hit();
        }
    }
}
