import P5 from "p5";
import { PlayerManager } from "../player/playerManager";
import { EnemieManager } from "../enemies/enemieManager";
import { MapManager } from "./mapManager";
import { ToolManager } from "../player/tools/toolManager";
import { GameManager } from "./gameManager";
import { UIManager } from "./uiManager";
import { ParticuleManager } from "../particules/particuleManager";
import { BulletManager } from "../player/tools/guns/bullets/bulletManager";
import { Utils } from "../utils";

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
            100 - ((100 - time) * 100) / (100 - filterColorPhasesTiming[2]);
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
    static showEnemiesTool(dt: number) {
        ToolManager.showEnemieWeapons(dt);
    }
    static showTool(dt: number) {
        ToolManager.show(dt);
    }
    static showPlayer() {
        PlayerManager.show();
    }
    static showEnemies() {
        EnemieManager.show();
        const p5 = UIManager.p5;
        const arrowPadding = 30;
        const player = PlayerManager.player;
        const width = p5.width;
        const height = p5.height;
        const x = player.pos.x - width / 2;
        const y = player.pos.y - height / 2;
        for (const enemie of EnemieManager.enemies) {
            if (
                enemie.pos.x <= x - enemie.size ||
                enemie.pos.y <= y - enemie.size ||
                enemie.pos.x >= x + width + enemie.size ||
                enemie.pos.y >= y + height + enemie.size
            ) {
                const arrowPos = p5.createVector(
                    Utils.clamp(
                        enemie.pos.x,
                        x + arrowPadding,
                        x + width - arrowPadding
                    ),Utils.clamp(
                        enemie.pos.y,
                        y + arrowPadding,
                        y + height - arrowPadding
                    )
                );
                const arrowAngle = enemie.angle + p5.PI;
                Renderer.drawArrow(arrowPos, arrowAngle);
            }
        }
    }
    static drawArrow(pos: P5.Vector, angle: number) {
        const p5 = UIManager.p5;
        
        const arrowHeight = 60;
        const arrowWidth = 30;
        const arrowTickness = 16;

        p5.push();
        p5.translate(pos);
        p5.rotate(angle);
        p5.fill(255, 30, 30, 150);
        p5.noStroke();
        p5.beginShape();

        p5.vertex(0, 0);
        p5.vertex(-arrowWidth, -arrowHeight/2);
        p5.vertex(-arrowTickness, 0);
        p5.vertex(-arrowWidth, arrowHeight/2);

        p5.endShape();
        p5.pop();
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
