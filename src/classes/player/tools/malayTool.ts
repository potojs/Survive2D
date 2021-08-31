import P5 from "p5";
import { MapManager } from "../../game/mapManager";
import { ECollider, GameObject } from "../../gameObjects/gameObject";
import { ParticuleManager } from "../../particules/particuleManager";
import { ETool } from "./toolManager";
import { IToolsDamage, Tool } from "./tool";
import { IMaterialObject, Utils } from "../../utils";
import { MovingObject } from "../../movingObject";
import { PlayerManager } from "../playerManager";
import { Enemie } from "../../enemies/enemie";
import { EnemieManager } from "../../enemies/enemieManager";



export class MalayTool extends Tool {
    protected p5: P5 | undefined;
    constructor(
        public damage: IToolsDamage,
        reload: number,
        public hitRangeOffset: number,
        name: string,
        index: ETool,
        unlockPrice?: IMaterialObject,
        upgrade?: ETool
    ){
        super(reload, name, index, unlockPrice, upgrade);
    }
    get stats() {
        return this.damage;
    }
    collide(gameObject: GameObject): boolean {
        const p5 = this.p5 as P5;
        const holder = this.holder as MovingObject;

        const effetAreaPos = p5.createVector(
            holder.pos.x + p5.cos(holder.angle) * (holder.size + this.hitRangeOffset),
            holder.pos.y + p5.sin(holder.angle) * (holder.size + this.hitRangeOffset)
        );
        if(gameObject.colliderShape === ECollider.CIRCLE) {
            return P5.Vector.dist(effetAreaPos, gameObject.pos) < gameObject.size + holder.size
        }else if(gameObject.colliderShape === ECollider.SQUARE){
            return Utils.collideSquareCircle(
                gameObject, {
                    pos: effetAreaPos,
                    size: holder.size
                }
            );
        }
        return false;
    }
    hitEffect(isPlayer: boolean) {
        const p5 = this.p5 as P5;
        const gameObjects = MapManager.gameObjects;
        const materialCollected: IMaterialObject = {
            wood: 0,
            stone: 0,
            iron: 0,
        }
        for(let i=0,len=gameObjects.length;i<len;i++) {
            if(this.collide(gameObjects[i])) {
                gameObjects[i].getHitBy(this, isPlayer, materialCollected);                
            }
        }
        if(isPlayer) {
            ParticuleManager.showCollectedMaterial(materialCollected, p5);
            for(let i=0;i<EnemieManager.enemies.length;i++) {
                if(this.collide(EnemieManager.enemies[i])) {
                    EnemieManager.enemies[i].takeDamage(this);
                }
            }
        }else{
            const player = PlayerManager.player;
            if(this.collide(player)) {
                player.takeDamage(Math.min(this.damage.damage, player.health));
            }
        }
    }
}