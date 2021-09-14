import P5 from "p5";
import { MovingObject } from "../movingObject";
import { PlayerManager } from "../player/playerManager";
import { IMaterialObject } from "../utils";
import { ExplosionEffect } from "./explosionEffect";
import { Particule } from "./particule";
import { TextEffect } from "./text";

export class ParticuleManager {
    static particules: Particule[] = [];
    static lastObjectTakenDamage: MovingObject;
    static lastTakenDamageWasAt: number;
    static lastTakenDamage: number;
    static lastTextEffect: TextEffect;
    static combo = 1;

    static showExplosionEffect(x: number, y: number, radius: number, p5: P5) {
        ParticuleManager.particules.push(new ExplosionEffect(x, y, radius, p5));
    }

    static showCollectedMaterial(materialCollected: IMaterialObject, p5: P5) {
        const player = PlayerManager.player;
        let i = 0;
        for (const material in materialCollected) {
            if (materialCollected[material] !== 0) {
                ParticuleManager.createTextEffect(
                    `+${materialCollected[material]} ${material}`,
                    player.pos.x - p5.cos(player.angle) * 60,
                    player.pos.y - p5.sin(player.angle) * 60 - 20 * i,
                    p5
                );
                i++;
            }
        }
    }
    static showDamageEffect(object: MovingObject, damage: number) {
        const p5 = object.p5;
        const x = object.pos.x + p5.cos(object.angle + p5.PI) * 60;
        const y = object.pos.y + p5.sin(object.angle + p5.PI) * 60;
        const lastTextEffect = ParticuleManager.lastTextEffect;
        const combo = ParticuleManager.combo;

        if (damage === 0) return;

        if (
            lastTextEffect &&
            ParticuleManager.combo >= 1 &&
            ParticuleManager.lastTakenDamage === damage &&
            ParticuleManager.lastObjectTakenDamage === object &&
            performance.now() - ParticuleManager.lastTakenDamageWasAt <= 50
        ) {
            ParticuleManager.combo++;
            lastTextEffect.text = `-${combo} x ${damage}`;
        } else if (
            ParticuleManager.lastTakenDamage !== damage &&
            performance.now() - ParticuleManager.lastTakenDamageWasAt <= 50
        ) {
            ParticuleManager.combo = 0;
        } else {
            ParticuleManager.combo = 1;
            ParticuleManager.lastObjectTakenDamage = object;
            ParticuleManager.lastTakenDamageWasAt = performance.now();
            ParticuleManager.lastTakenDamage = damage;
            ParticuleManager.lastTextEffect = new TextEffect(
                `-${damage}`,
                x,
                y,
                true,
                p5
            );
            ParticuleManager.particules.push(ParticuleManager.lastTextEffect);
        }
    }
    static createTextEffect(text: string, x: number, y: number, p5: P5) {
        ParticuleManager.particules.push(new TextEffect(text, x, y, false, p5));
    }
    static show() {
        for (let i = 0; i < ParticuleManager.particules.length; i++) {
            ParticuleManager.particules[i].show();
        }
    }
    static update() {
        const particules = ParticuleManager.particules;
        for (let i = 0; i < particules.length; i++) {
            particules[i].update();
            if (particules[i].done) {
                particules.splice(i, 1);
            }
        }
    }
}
