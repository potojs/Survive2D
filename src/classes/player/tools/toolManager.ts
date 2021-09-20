import P5 from "p5";
import { BuildingManager } from "../../gameObjects/buildings/buildingManager";
import { PlayerManager } from "../playerManager";
import { Hand } from "./hands/hand";
import { IronAxe } from "./axes/ironAxe";
import { StoneAxe } from "./axes/stoneAxe";
import { Tool } from "./tool";
import { StonePickaxe } from "./axes/stonePickaxe";
import { IronPickaxe } from "./axes/ironPickaxe";
import { WoodAxe } from "./axes/woodAxe";
import { WoodPickaxe } from "./axes/woodPickaxe";
import { WoodSword } from "./swords/woodSword";
import { StoneSword } from "./swords/stoneSword";
import { IronSword } from "./swords/ironSword";
import { Pistol } from "./guns/pistol";
import { PumpShotgun } from "./guns/pumpShotgun";
import { heavySniper } from "./guns/heavySniper";
import { UIManager } from "../../game/uiManager";
import { PlayerHand } from "./hands/playerHand";
import { MovingObject } from "../../movingObject";
import { Enemie } from "../../enemies/enemie";
import { ZombieHand } from "./hands/zombieHand";
import { BloodAxe } from "./axes/bloodAxe";
import { BigZombieHand } from "./hands/bigZombieHand";
import { PapaDemonAxe } from "./axes/papaDemonAxe";
import { grenadeLauncher } from "./guns/grenadeLauncher";

export enum ETool {
    PLAYER_HAND,
    ZOMBIE_HAND,
    BIG_ZOMBIE_HAND,
    BLOOD_AXE,
    PAPA_DEMON_AXE,

    // axes
    WOOD_AXE,
    STONE_AXE,
    IRON_AXE,
    WOOD_PICKAXE,
    STONE_PICKAXE,
    IRON_PICKAXE,
    WOOD_SWORD,
    STONE_SWORD,
    IRON_SWORD,
    PISTOL,
    PUMP_SHOTGUN,
    HEAVY_SNIPER,
    GRENADE_LAUNCHER,
    //
    
    WOOD_FLOOR,
    WOOD_WALL,
    STONE_FLOOR,
    STONE_WALL,
    IRON_WALL,
}

export class ToolManager {
    static p5: P5;
    static toolToUnlock: Tool;
    static toolToUnlockElt: HTMLDivElement;
    static toolToUpgrade: Tool;

    static unlockedTools: string[] = [];
    static notVisibleTools: string[] = [];

    static playerTools: Tool[];
    static enemieWeapons: Tool[] = [];
    static getWeapon(holder: MovingObject): Tool | undefined {
        for (const tool of ToolManager.enemieWeapons) {
            if (tool.holder === holder) {
                return tool;
            }
        }
    }
    static getPlayerTool(tool: ETool): Tool {
        for (let i = 0; i < this.playerTools.length; i++) {
            if (this.playerTools[i].index === tool) {
                return this.playerTools[i];
            }
        }
        return this.playerTools[0];
    }
    static setup(p5: P5) {
        ToolManager.p5 = p5;
        ToolManager.playerTools = [
            new PlayerHand(),
            new WoodAxe(),
            new StoneAxe(),
            new IronAxe(),
            new WoodPickaxe(),
            new StonePickaxe(),
            new IronPickaxe(),
            new WoodSword(),
            new StoneSword(),
            new IronSword(),
            new Pistol(),
            new PumpShotgun(),
            new heavySniper(),
            new grenadeLauncher()
        ];
        for (const tool of ToolManager.playerTools) {
            tool.setup(p5);
            tool.attach(PlayerManager.player);
        }
        if (localStorage.length > 0) {
            const unlockedTools = JSON.parse(
                localStorage.getItem("tools") as string
            ).unlockedTools;

            const notVisibleTools = JSON.parse(
                localStorage.getItem("tools") as string
            ).notVisibleTools;

            ToolManager.unlockedTools = unlockedTools;
            ToolManager.notVisibleTools = notVisibleTools;

            for(const tool of notVisibleTools) {
                const toolBtn = (
                    document.querySelector(`.${tool}`) as HTMLDivElement
                )
                toolBtn.classList.add("not-visible");
            }
            for (const tool of unlockedTools) {
                const toolBtn = (
                    document.querySelector(`.${tool}`) as HTMLDivElement
                )
                toolBtn.classList.add("unlocked");
                toolBtn.classList.remove("upgrade", "not-visible")
            }
        }
    }
    static upgrade(tool: Tool) {
        const player = PlayerManager.player;
        const upgradeTool = ToolManager.getPlayerTool(tool.upgrade!);
        const upgradeMenu = document.querySelector(
            ".tool-upgrade-menu"
        ) as HTMLDivElement;
        upgradeMenu.classList.add("not-visible");
        UIManager.popupsOpenned--;
        const materials = upgradeTool.unlockPrice || {
            wood: 0,
            stone: 0,
            iron: 0,
        };
        if (player.hasMaterials(materials)) {
            const oldToolBtnClass = `${tool.name
                .toLowerCase()
                .replace(" ", "-")}-tool`;
            const oldToolBarBtn = document.querySelector(
                "."+oldToolBtnClass
            ) as HTMLDivElement;
            const newToolBtnClass = `${upgradeTool.name
                .toLowerCase()
                .replace(" ", "-")}-tool`;
            const newToolBarBtn = document.querySelector(
                "."+newToolBtnClass
            ) as HTMLDivElement;
            
            ToolManager.unlockedTools.push(newToolBtnClass);
            ToolManager.unlockedTools.splice(
                ToolManager.unlockedTools.indexOf(oldToolBtnClass),
                1
            );
            ToolManager.notVisibleTools.push(oldToolBtnClass);

            player.woodAmt -= materials.wood;
            player.stoneAmt -= materials.stone;
            player.ironAmt -= materials.iron;

            oldToolBarBtn.classList.add("not-visible");
            newToolBarBtn.classList.replace("not-visible", "selected");
            newToolBarBtn.classList.add("unlocked");
            player.selectedTool = tool.upgrade!;

            UIManager.alert(`${tool.name} was upgraded to ${upgradeTool.name}`);
        } else {
            UIManager.error("you don't have enough materials");
        }
    }
    static unlock(tool: Tool, element: HTMLDivElement) {
        const player = PlayerManager.player;
        const buyingToolMenu = document.querySelector(
            ".tool-buying-menu"
        ) as HTMLDivElement;
        buyingToolMenu.classList.add("not-visible");
        UIManager.popupsOpenned--;
        PlayerManager.canPlayerMove = true;
        const materials = tool.unlockPrice || { wood: 0, stone: 0, iron: 0 };
        if (player.hasMaterials(materials)) {
            player.woodAmt -= materials.wood;
            player.stoneAmt -= materials.stone;
            player.ironAmt -= materials.iron;

            element.classList.add("unlocked");
            ToolManager.unlockedTools.push(
                `${tool.name.toLowerCase().replace(" ", "-")}-tool`
            );
            UIManager.alert("you have unloked the " + tool.name);
        } else {
            UIManager.error("you don't have enough materials");
        }
    }
    static createTool(tool: ETool, enemie: Enemie) {
        let weapon;
        switch (tool) {
            case ETool.ZOMBIE_HAND:
                weapon = new ZombieHand();
                break;
            case ETool.BLOOD_AXE:
                weapon = new BloodAxe();
                break;
            case ETool.BIG_ZOMBIE_HAND:
                weapon = new BigZombieHand();
                break;
            case ETool.PAPA_DEMON_AXE:
                weapon = new PapaDemonAxe();
                break;
            default:
                weapon = new PlayerHand();
                break;
        }
        this.enemieWeapons.push(weapon);
        weapon.setup(UIManager.p5);
        weapon.attach(enemie);
    }
    static show(dt: number) {
        const index = PlayerManager.player.selectedTool;
        switch (PlayerManager.player.selectedTool) {
            case ETool.WOOD_WALL:
            case ETool.STONE_WALL:
            case ETool.IRON_WALL:
            case ETool.WOOD_FLOOR:
            case ETool.STONE_FLOOR:
                BuildingManager.showBuildInfo(index, ToolManager.p5);
                return;
        }
        ToolManager.getPlayerTool(index).show(dt);
    }
    static showEnemieWeapons(dt: number) {
        for (let i = 0; i < ToolManager.enemieWeapons.length; i++) {
            ToolManager.enemieWeapons[i].show(dt);
        }
    }
    static hit() {
        const index = PlayerManager.player.selectedTool;
        switch (PlayerManager.player.selectedTool) {
            case ETool.WOOD_WALL:
            case ETool.STONE_WALL:
            case ETool.IRON_WALL:
            case ETool.WOOD_FLOOR:
            case ETool.STONE_FLOOR:
                BuildingManager.runBuilder(index, ToolManager.p5);
                return;
        }
        ToolManager.getPlayerTool(index).hit();
    }
}
