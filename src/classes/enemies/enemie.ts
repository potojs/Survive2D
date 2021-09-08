import P5 from "p5";
import { MapManager } from "../game/mapManager";
import { ESellingMenu, UIManager } from "../game/uiManager";
import { GameObject } from "../gameObjects/gameObject";
import { MovingObject } from "../movingObject";
import { ParticuleManager } from "../particules/particuleManager";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { Bullet } from "../player/tools/guns/bullets/bullet";
import { MalayTool } from "../player/tools/malayTool";
import { Tool } from "../player/tools/tool";
import { ETool, ToolManager } from "../player/tools/toolManager";
import { EEnemie, IEnemieData } from "./enemieManager";

export class Enemie extends MovingObject {
    private distToPlayer: number;
    constructor(
        x: number,
        y: number,
        public health: number,
        public fullHealth: number,
        private img: P5.Image,
        private enemieType: EEnemie,
        size: number,
        speed: number,
        public weapon: ETool,
        public healingToPlayer: number,
        p5: P5,
        distToPlayer: number,
        private startHittingDist: number = 5
    ) {
        super(x, y, 0, size, speed, p5);
        ToolManager.createTool(weapon, this);
        this.distToPlayer = distToPlayer + PlayerManager.playerSize + size;
    }
    show() {
        const p5 = this.p5;
        p5.push();
        p5.translate(this.pos);
        p5.rotate(this.angle);
        p5.image(this.img, 0, 0, this.size * 2, this.size * 2);
        p5.pop();
        if (this.health < this.fullHealth) {
            this.showHealth();
        }
    }
    showHealth() {
        const p5 = this.p5;
        const scale = 2;
        p5.push();
        p5.translate(this.pos.x, this.pos.y - this.size * 1.5);
        p5.noStroke();
        p5.fill(80);
        p5.rect(0, 0, this.fullHealth / scale, 13);
        p5.fill(200, 50, 30);
        p5.rect(
            -(this.fullHealth / scale - this.health / scale) / 2,
            0,
            this.health / scale,
            13
        );

        p5.pop();
    }
    update(dt: number) {
        const p5 = this.p5;
        const player = PlayerManager.player;

        this.angle = p5.atan2(
            player.pos.y - this.pos.y,
            player.pos.x - this.pos.x
        );

        this.pos.x += this.vel.x;
        this.quadtreeUser.updateBy(this.vel.x);

        const collidingWithX = this.quadtreeUser
            .getCollision()
            .filter((o) => !(o instanceof Bullet));
        for (let i = 0; i < collidingWithX.length; i++) {
            this.collide(collidingWithX[i], {
                x: this.p5.abs(this.vel.x) / this.vel.x,
                y: 0,
            }, dt);
        }
        this.quadtreeUser.item.x = this.pos.x + MapManager.mapDimensions.w / 2;
        this.pos.y += this.vel.y;
        this.quadtreeUser.updateBy(0, this.vel.y);

        const collidingWithY = this.quadtreeUser
            .getCollision()
            .filter((o) => !(o instanceof Bullet));
        for (let i = 0; i < collidingWithY.length; i++) {
            this.collide(collidingWithY[i], {
                x: 0,
                y: this.p5.abs(this.vel.y) / this.vel.y,
            }, dt);
        }
        this.quadtreeUser.item.y = this.pos.y + MapManager.mapDimensions.h / 2;
        this.boundries();
        this.quadtreeUser.update(this.pos.x, this.pos.y);
        const weapon = ToolManager.getWeapon(this) as Tool;
        if (
            collidingWithX.filter((o) => !(o instanceof Enemie)).length > 0 ||
            collidingWithY.filter((o) => !(o instanceof Enemie)).length > 0
        ) {
            weapon.hit();
        }
    }
    takeDamage(attacker: Tool | Bullet) {
        let damage: number;
        if (attacker instanceof Tool) {
            const toolMalay = attacker as MalayTool;
            damage = toolMalay.damage.damage;
        } else {
            damage = attacker.damage;
        }
        ParticuleManager.showDamageEffect(this, Math.min(damage, this.health));
        this.health -= damage;
        if (this.health <= 0) {
            this.destroyed = true;
            const player = PlayerManager.player;
            const amountHealed = Math.min(this.healingToPlayer, 100 - player.health);
            if(amountHealed > 0) {
                ParticuleManager.createTextEffect(
                    `healed ${amountHealed}hp`,
                    player.pos.x - Math.cos(player.angle) * 60,
                    player.pos.y - Math.sin(player.angle) * 60 - 20,
                    this.p5
                );
                player.health += amountHealed;
            }
            this.quadtreeUser.remove();
        }
    }
    follow(player: Player, dt: number) {
        const p5 = this.p5;
        const dist = P5.Vector.dist(this.pos, player.pos);
        const distToStop = dist - this.distToPlayer;
        this.vel = p5.createVector(
            Math.cos(this.angle) * distToStop,
            Math.sin(this.angle) * distToStop
        );
        this.vel.setMag(p5.min(this.speed * dt, p5.abs(distToStop)));
        if (dist < this.distToPlayer + this.startHittingDist) {
            const weapon = ToolManager.getWeapon(this) as Tool;
            weapon.hit();
        }
    }
    getEnemieData(): IEnemieData {
        return {
            x: this.pos.x,
            y: this.pos.y,
            health: this.health,
            type: this.enemieType,
        };
    }
}
