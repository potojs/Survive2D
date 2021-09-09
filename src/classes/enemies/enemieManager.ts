import { timeLastFrame } from "../../main";
import { GameManager } from "../game/gameManager";
import { UIManager } from "../game/uiManager";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { PapaDemonAxe } from "../player/tools/axes/papaDemonAxe";
import { Tool } from "../player/tools/tool";
import { ToolManager } from "../player/tools/toolManager";
import { Utils } from "../utils";
import { Demon } from "./demons/demon";
import { PapaDemon } from "./demons/papaDemon";
import { Enemie } from "./enemie";
import { FatZombie } from "./zombies/fatZombie";
import { MediumZombie } from "./zombies/mediumZombie";

export enum EEnemie {
    MEDIUM_ZOMBIE,
    FAT_ZOMBIE,
    DEMON,
    PAPA_DEMON,
}

export interface IEnemieData {
    x: number;
    y: number;
    type: EEnemie;
    health: number;
}

export class EnemieManager {
    static enemies: Enemie[] = [];
    static enemieSpawnIntervals = {
        mediumZombie: 5000,
        fatZombie: 10000,
        demon: 10000,
        papaDemon: 40000,
    };
    static enemieSpawnDayStart = {
        mediumZombie: 0,
        fatZombie: 2,
        demon: 5,
        papaDemon: 8,
    };
    static enemieSpawnAcceleration = {
        mediumZombie: 60,
        fatZombie: 50,
        demon: 50,
        papaDemon: 100,
    };
    static enemieSpawnIntervalsMin = {
        mediumZombie: 800,
        fatZombie: 800,
        demon: 800,
        papaDemon: 1000,
    };
    static numberEnemiesKilled = 0;
    static setupMediumZombiesSpawn() {
        if (
            (new Date().getTime() - timeLastFrame) < 100 &&
            GameManager.isNight &&
            GameManager.day >= EnemieManager.enemieSpawnDayStart.mediumZombie
        ) {
            // spwn
            const randomPos = Utils.getRandomSpawnPos();
            EnemieManager.spawn(
                randomPos.x,
                randomPos.y,
                EEnemie.MEDIUM_ZOMBIE
            );
            const enemieSpawnInterval = EnemieManager.enemieSpawnIntervals.mediumZombie;
            const enemieSpawnAcceleration = EnemieManager.enemieSpawnAcceleration.mediumZombie;

            EnemieManager.enemieSpawnIntervals.mediumZombie = Math.max(
                enemieSpawnInterval - enemieSpawnAcceleration,
                EnemieManager.enemieSpawnIntervalsMin.mediumZombie
            );
        }
        setTimeout(
            EnemieManager.setupMediumZombiesSpawn,
            EnemieManager.enemieSpawnIntervals.mediumZombie
        );
    }
    static setupFatZombiesSpawn() {
        if (
            (new Date().getTime() - timeLastFrame) < 100 &&
            GameManager.isNight &&
            GameManager.day >= EnemieManager.enemieSpawnDayStart.fatZombie
        ) {
            // spwn
            const randomPos = Utils.getRandomSpawnPos();
            EnemieManager.spawn(randomPos.x, randomPos.y, EEnemie.FAT_ZOMBIE);

            const enemieSpawnInterval = EnemieManager.enemieSpawnIntervals.fatZombie;
            const enemieSpawnAcceleration = EnemieManager.enemieSpawnAcceleration.fatZombie;

            EnemieManager.enemieSpawnIntervals.fatZombie = Math.max(
                enemieSpawnInterval - enemieSpawnAcceleration,
                EnemieManager.enemieSpawnIntervalsMin.fatZombie
            );
        }
        setTimeout(
            EnemieManager.setupFatZombiesSpawn,
            EnemieManager.enemieSpawnIntervals.fatZombie
        );
    }
    static setupDemonSpawn() {
        if (
            (new Date().getTime() - timeLastFrame) < 100 &&
            GameManager.isNight &&
            GameManager.day >= EnemieManager.enemieSpawnDayStart.demon
        ) {
            // spwn
            const randomPos = Utils.getRandomSpawnPos();
            EnemieManager.spawn(randomPos.x, randomPos.y, EEnemie.DEMON);
            
            const enemieSpawnInterval = EnemieManager.enemieSpawnIntervals.demon;
            const enemieSpawnAcceleration = EnemieManager.enemieSpawnAcceleration.demon;

            EnemieManager.enemieSpawnIntervals.demon = Math.max(
                enemieSpawnInterval - enemieSpawnAcceleration,
                EnemieManager.enemieSpawnIntervalsMin.demon
            );
        }
        setTimeout(
            EnemieManager.setupDemonSpawn,
            EnemieManager.enemieSpawnIntervals.demon
        );
    }
    static setupPapaDemonSpawn() {
        if (
            (new Date().getTime() - timeLastFrame) < 100 &&
            GameManager.isNight &&
            GameManager.day >= EnemieManager.enemieSpawnDayStart.papaDemon
        ) {
            // spwn
            const randomPos = Utils.getRandomSpawnPos();
            EnemieManager.spawn(randomPos.x, randomPos.y, EEnemie.PAPA_DEMON);
            
            const enemieSpawnInterval = EnemieManager.enemieSpawnIntervals.papaDemon;
            const enemieSpawnAcceleration = EnemieManager.enemieSpawnAcceleration.papaDemon;

            EnemieManager.enemieSpawnIntervals.papaDemon = Math.max(
                enemieSpawnInterval - enemieSpawnAcceleration,
                EnemieManager.enemieSpawnIntervalsMin.papaDemon
            );
        }
        setTimeout(
            EnemieManager.setupPapaDemonSpawn,
            EnemieManager.enemieSpawnIntervals.papaDemon
        );
    }
    static getEnemieData() {
        const enemiesData: IEnemieData[] = [];
        for(let i=0;i<EnemieManager.enemies.length;i++) {
            enemiesData.push(EnemieManager.enemies[i].getEnemieData());
        }
        return enemiesData;
    } 
    static setup() {
        EnemieManager.setupMediumZombiesSpawn();
        EnemieManager.setupFatZombiesSpawn();
        EnemieManager.setupDemonSpawn();
        EnemieManager.setupPapaDemonSpawn();
        if(localStorage.length > 0) {
            const enemiesData = JSON.parse(localStorage.getItem("enemies") as string);
            EnemieManager.numberEnemiesKilled = enemiesData.enemiesKilledCount;

            for(const enemie of enemiesData.enemieData) {
                EnemieManager.spawn(enemie.x, enemie.y, enemie.type, enemie.health);
            }
        }
    }

    static update(player: Player, dt: number) {
        const enemies = EnemieManager.enemies;
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].follow(player, dt);
            enemies[i].update(dt);
            if (enemies[i].destroyed) {
                ToolManager.enemieWeapons.splice(
                    ToolManager.enemieWeapons.indexOf(
                        ToolManager.getWeapon(enemies[i]) as Tool
                    ),
                    1
                );
                enemies[i].quadtreeUser.remove();
                enemies.splice(i, 1);
                EnemieManager.numberEnemiesKilled++;
            }
        }
    }

    static show() {
        const enemies = EnemieManager.enemies;
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].show();
        }
    }
    static spawn(x: number, y: number, enemie: EEnemie, health?: number) {
        switch (enemie) {
            case EEnemie.MEDIUM_ZOMBIE:
                this.enemies.push(new MediumZombie(x, y, UIManager.p5, health));
                break;
            case EEnemie.FAT_ZOMBIE:
                this.enemies.push(new FatZombie(x, y, UIManager.p5, health));
                break;
            case EEnemie.DEMON:
                this.enemies.push(new Demon(x, y, UIManager.p5, health));
                break;
            case EEnemie.PAPA_DEMON:
                this.enemies.push(new PapaDemon(x, y, UIManager.p5, health));
                break;
        }
    }
}
