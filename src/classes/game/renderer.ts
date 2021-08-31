import P5 from "p5";
import { PlayerManager } from "../player/playerManager";
import { EnemieManager } from "../enemies/enemieManager";
import { MapManager } from "./mapManager";
import { ToolManager } from "../player/tools/toolManager";
import { GameManager } from "./gameManager";
import { UIManager } from "./uiManager";
import { ParticuleManager } from "../particules/particuleManager";
import { BulletManager } from "../player/tools/guns/bullets/bulletManager";

export class Renderer {
    static lightingFilter: P5.Graphics;
    static showUI(p5: P5) {
        UIManager.showUI(p5);
    }
    static showLighting(p5: P5) {
        if (!Renderer.lightingFilter) {
            Renderer.lightingFilter = p5.createGraphics(100, 100);
        }
        const player = PlayerManager.player;
        const filter = Renderer.lightingFilter;
        filter.clear();
        const time = GameManager.time;
        filter.background(Renderer.getLightingColor(time));
        p5.image(filter, player.pos.x, player.pos.y, p5.width, p5.height);
    }
    static getLightingColor(time: number): number[] {
        const filterColorPhasesTiming = [0, 56, 66, 90];
        const filterColorPhases = [
            [0, 0, 0, 0],
            [0, 0, 0, 100],
        ];
        GameManager.isNight = true;
        GameManager.nightTimePassed =
            100 - ((100 - time) * 100) /
            (100 - filterColorPhasesTiming[2]);
        if (
            time >= filterColorPhasesTiming[0] &&
            time <= filterColorPhasesTiming[1]
        ) {
            GameManager.isNight = false;
            return filterColorPhases[0];
        } else if (
            time >= filterColorPhasesTiming[1] &&
            time <= filterColorPhasesTiming[2]
        ) {
            GameManager.isNight = false;
            return Renderer.lerp(
                filterColorPhases[1],
                filterColorPhases[0],
                (filterColorPhasesTiming[2] - time) /
                    (filterColorPhasesTiming[2] - filterColorPhasesTiming[1])
            );
        } else if (
            time >= filterColorPhasesTiming[2] &&
            time <= filterColorPhasesTiming[3]
        ) {
            return filterColorPhases[1];
        } else if (time >= filterColorPhasesTiming[3] && time <= 100) {
            return Renderer.lerp(
                filterColorPhases[0],
                filterColorPhases[1],
                (100 - time) / (100 - filterColorPhasesTiming[3])
            );
        }
        return [];
    }
    static lerp(c1: number[], c2: number[], amt: number) {
        return [
            c1[0] + (c2[0] - c1[0]) * amt,
            c1[1] + (c2[1] - c1[1]) * amt,
            c1[2] + (c2[2] - c1[2]) * amt,
            c1[3] + (c2[3] - c1[3]) * amt,
        ];
    }
    static darken(color: number[], amt: number, p5: P5): number[] {
        // const newBrightness = (color[0]+color[1]+color[2])/3 - amt;
        return [
            color[0] - color[0] / amt,
            color[1] - color[1] / amt,
            color[2] - color[2] / amt,
        ];
    }
    static showParticules() {
        ParticuleManager.show();
    }
    static showEnemiesTool() {
        ToolManager.showEnemieWepaons();
    }
    static showTool() {
        ToolManager.show();
    }
    static showPlayer() {
        PlayerManager.show();
    }
    static showEnemies() {
        EnemieManager.show();
    }
    static showBullets() {
        BulletManager.show();
    }
    static showMap() {
        MapManager.showMap();
    }
    static showGameObjects() {
        MapManager.showGameObjects();
    }
}
