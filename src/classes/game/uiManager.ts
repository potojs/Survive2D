import P5 from "p5";
import { BuildingManager } from "../gameObjects/buildings/buildingManager";
import { ParticuleManager } from "../particules/particuleManager";
import { Player } from "../player/player";
import { PlayerManager } from "../player/playerManager";
import { MalayTool } from "../player/tools/malayTool";
import { Tool } from "../player/tools/tool";
import { ETool, ToolManager } from "../player/tools/toolManager";
import { IMaterialObject, Utils } from "../utils";
import { GameManager } from "./gameManager";
import { MapManager } from "./mapManager";
import { SpriteManager } from "./spriteManager";

export enum ESellingMenu {
    HIDDEN,
    MOUSE_IN_SELLNG_MENU,
    MOUSE_IN_TRIGGER,
    MOUSE_OUT,
}

export class UIManager {
    static p5: P5;
    static sellingMenuState = ESellingMenu.HIDDEN;
    static pauseMenuOpened = false;
    static clock = {
        x: 20,
        y: 20,
        size: 120,
        handHeight: 50,
    };
    static popupsOpenned = 0;
    static selectToolAt(index: number) {
        const toolsBtns = Array.from<HTMLDivElement>(
            document.querySelectorAll(".tool")!
        );
        toolsBtns.filter(
            (e: HTMLDivElement) => !e.classList.contains("not-visible")
        )[index].click();
    }
    static closePauseMenu() {
        const pauseMenu = document.querySelector(
            ".pause-menu"
        ) as HTMLDivElement;
        const blackBlur = document.querySelector(
            ".popup-blur"
        ) as HTMLDivElement;
        pauseMenu.classList.add("not-visible");
        blackBlur.classList.add("not-visible");
        UIManager.popupsOpenned--;
        UIManager.pauseMenuOpened = false;
    }
    static openPauseMenu() {
        const pauseMenu = document.querySelector(
            ".pause-menu"
        ) as HTMLDivElement;
        const blackBlur = document.querySelector(
            ".popup-blur"
        ) as HTMLDivElement;
        pauseMenu.classList.remove("not-visible");
        blackBlur.classList.remove("not-visible");
        UIManager.popupsOpenned++;
        UIManager.pauseMenuOpened = true;
    }
    static setupPauseMenu() {
        const pauseBtn = document.querySelector(
            ".pause-btn"
        ) as HTMLButtonElement;
        const pauseMenu = document.querySelector(
            ".pause-menu"
        ) as HTMLDivElement;
        const blackBlur = document.querySelector(
            ".popup-blur"
        ) as HTMLDivElement;
        const closePauseMenuBtn = document.querySelector(
            ".close-pause-menu"
        ) as HTMLButtonElement;
        const menuBtnContinue = document.querySelector(
            ".menu-btn-continue"
        ) as HTMLButtonElement;
        const menuBtnGoHome = document.querySelector(
            ".menu-btn-go-home"
        ) as HTMLButtonElement;
        const menuBtnDeleteSave = document.querySelector(
            ".menu-btn-delete-save"
        ) as HTMLButtonElement;
        menuBtnContinue.addEventListener("click", UIManager.closePauseMenu);
        closePauseMenuBtn.addEventListener("click", UIManager.closePauseMenu);
        menuBtnGoHome.addEventListener("click", () => location.reload());
        menuBtnDeleteSave.addEventListener("click", () => {
            if (confirm("r u sure about that?")) {
                localStorage.clear();
                location.reload();
            }
        });
        pauseBtn.addEventListener("click", UIManager.openPauseMenu);
    }
    static setup(p5: P5) {
        UIManager.p5 = p5;
        UIManager.setupToolBar();
        UIManager.setupBuildingMenu();
        UIManager.setupSellingMenu();
        UIManager.setupPauseMenu();
        const player = PlayerManager.player;
        document.querySelector(".building-menu")!.classList.remove("closed");
        switch (player.selectedTool) {
            case ETool.WOOD_WALL:
                document.querySelector(".wood-wall")!.classList.add("selected");
                break;
            case ETool.STONE_WALL:
                document
                    .querySelector(".stone-wall")!
                    .classList.add("selected");
                break;
            case ETool.IRON_WALL:
                document.querySelector(".iron-wall")!.classList.add("selected");
                break;
            case ETool.WOOD_FLOOR:
                document
                    .querySelector(".wood-floor")!
                    .classList.add("selected");
                break;
            case ETool.STONE_FLOOR:
                document
                    .querySelector(".stone-floor")!
                    .classList.add("selected");
                break;
            default:
                document.querySelector(".wood-wall")!.classList.add("selected");
                document
                    .querySelector(".building-menu")!
                    .classList.add("closed");
                const eltClass = `.${ToolManager.getPlayerTool(
                    player.selectedTool
                )
                    .name.toLowerCase()
                    .replace(" ", "-")}-tool`;
                (
                    document.querySelector(eltClass) as HTMLDivElement
                ).classList.add("selected");
        }
    }
    static showPlayerHealth() {
        const p5 = UIManager.p5;
        const player = PlayerManager.player;
        const health = player.health;
        const heartImg = SpriteManager.sprites.UI.heart;
        const imgSize = 35;
        const paddingRight = 30;
        const paddingTop = 20;
        const healthBarWidth = 120;
        const healthBarHeight = 15;
        const healthBarPos = p5.createVector(
            p5.width - healthBarWidth - paddingRight,
            paddingTop + imgSize
        );
        p5.stroke(0);
        p5.fill(0);
        p5.strokeWeight(5);
        p5.rect(
            healthBarPos.x + healthBarWidth / 2 - p5.width / 2 + player.pos.x,
            healthBarPos.y - p5.height / 2 + player.pos.y,
            healthBarWidth,
            healthBarHeight,
            5
        );
        p5.noStroke();
        p5.fill(236, 28, 36);
        const width = p5.map(health, 0, 100, 0, healthBarWidth);
        p5.rect(
            healthBarPos.x + width / 2 - p5.width / 2 + player.pos.x,
            healthBarPos.y - p5.height / 2 + player.pos.y,
            width,
            healthBarHeight,
            5
        );
        p5.image(
            heartImg,
            healthBarPos.x - p5.width / 2 + player.pos.x,
            healthBarPos.y - p5.height / 2 + player.pos.y,
            imgSize,
            imgSize
        );
    }
    static showNewDayEffect(day: number) {
        const newDayEffectElt = document.querySelector(
            ".new-day-effect"
        ) as HTMLParagraphElement;
        newDayEffectElt.classList.add("visible");
        newDayEffectElt.innerText = "Day " + day;
        setTimeout(() => {
            newDayEffectElt.classList.remove("visible");
        }, 2000);
    }
    static setupSellingMenu() {
        const sellingMenu = document.querySelector(
            ".selling-building-menu"
        ) as HTMLDListElement;
        const trigger = document.querySelector(
            ".selling-building-menu-trigger"
        ) as HTMLDListElement;
        const sellBtn = document.querySelector(
            ".sell-btn"
        ) as HTMLButtonElement;
        sellBtn.addEventListener("click", () => {
            const p5 = UIManager.p5;
            const selledBuilding = BuildingManager.currentSelledBuilding;
            const gameObjects = MapManager.gameObjects;
            const player = PlayerManager.player;
            UIManager.sellingMenuState = ESellingMenu.MOUSE_OUT;
            ParticuleManager.showCollectedMaterial(
                selledBuilding.sellingPrice,
                p5
            );
            for (const material in selledBuilding.sellingPrice) {
                if (selledBuilding.sellingPrice[material] > 0) {
                    switch (material) {
                        case "wood":
                            player.woodAmt +=
                                selledBuilding.sellingPrice[material];
                            player.allWoodCollected +=
                                selledBuilding.sellingPrice[material];
                            break;
                        case "stone":
                            player.stoneAmt +=
                                selledBuilding.sellingPrice[material];
                            player.allStoneCollected +=
                                selledBuilding.sellingPrice[material];
                            break;
                        case "iron":
                            player.ironAmt +=
                                selledBuilding.sellingPrice[material];
                            player.allIronCollected +=
                                selledBuilding.sellingPrice[material];
                            break;
                    }
                }
            }
            for (const building of gameObjects) {
                if (building === selledBuilding) {
                    building.quadtreeUser.remove();
                    gameObjects.splice(gameObjects.indexOf(building), 1);
                    return;
                }
            }
        });
        sellingMenu.addEventListener("mouseout", () => {
            if (
                UIManager.sellingMenuState === ESellingMenu.MOUSE_IN_SELLNG_MENU
            ) {
                UIManager.sellingMenuState = ESellingMenu.MOUSE_OUT;
            }
        });
        trigger.addEventListener("mouseout", () => {
            if (UIManager.sellingMenuState === ESellingMenu.MOUSE_IN_TRIGGER) {
                UIManager.sellingMenuState = ESellingMenu.MOUSE_OUT;
            }
        });
        sellingMenu.addEventListener("mouseover", () => {
            if (
                UIManager.sellingMenuState === ESellingMenu.MOUSE_IN_TRIGGER ||
                UIManager.sellingMenuState === ESellingMenu.MOUSE_OUT
            ) {
                UIManager.sellingMenuState = ESellingMenu.MOUSE_IN_SELLNG_MENU;
            }
        });
        trigger.addEventListener("mouseover", () => {
            sellingMenu.classList.remove("not-visible");
            if (UIManager.sellingMenuState === ESellingMenu.HIDDEN) {
                UIManager.sellingMenuState = ESellingMenu.MOUSE_IN_TRIGGER;
            }
        });
    }
    static fillStats(elt: HTMLDivElement, tool: Tool) {
        const toolNameElt = elt.querySelector(
            ".tool-name"
        ) as HTMLParagraphElement;
        toolNameElt.innerText = tool.name;

        const toolStats = tool.stats;
        const toolStatsUL = elt.querySelector(
            ".tool-stats ul"
        ) as HTMLUListElement;
        toolStatsUL.innerHTML = "";
        for (const stat in toolStats) {
            const statElt = document.createElement("li");
            statElt.innerText = `${stat}: ${toolStats[stat]}`;
            toolStatsUL.appendChild(statElt);
        }
    }
    static showEndScreen() {
        const redFilter = document.querySelector(
            ".game-ended-red-filter"
        ) as HTMLDivElement;
        redFilter.classList.remove("not-visible");
        const endScreen = document.querySelector(
            ".game-ended-screen"
        ) as HTMLDivElement;
        endScreen.classList.remove("not-visible");
        UIManager.popupsOpenned++;
        const player = PlayerManager.player;
        player.allWoodCollected = Utils.format(player.allWoodCollected, 1);
        player.allStoneCollected = Utils.format(player.allStoneCollected, 1);
        player.allIronCollected = Utils.format(player.allIronCollected, 1);
        (
            document.querySelector(".wood-collected") as HTMLSpanElement
        ).innerText = player.allWoodCollected.toString();
        (
            document.querySelector(".stone-collected") as HTMLSpanElement
        ).innerText = player.allStoneCollected.toString();
        (
            document.querySelector(".iron-collected") as HTMLSpanElement
        ).innerText = player.allIronCollected.toString();
    }
    static setPrice(elt: HTMLParagraphElement, price: IMaterialObject) {
        let toolPriceStr = "price: ";
        let i = 0;
        for (const material in price) {
            if (price[material] > 0) {
                i > 0 && (toolPriceStr += " + ");
                toolPriceStr += `${price[material]} ${material}`;
            }
            i++;
        }
        elt.innerText = toolPriceStr;
    }
    static toolClicked(toolIndex: ETool, e: Event) {
        const toolElt = e.target as HTMLDivElement;
        const upgradeMenu = document.querySelector(
            ".tool-upgrade-menu"
        ) as HTMLDivElement;
        const buyingToolMenu = document.querySelector(
            ".tool-buying-menu"
        ) as HTMLDivElement;
        if (
            toolElt.classList.contains("unlocked") &&
            toolElt.classList.contains("selected")
        ) {
            // open the upgrade menu
            // PlayerManager.canPlayerMove = false;
            const tool = ToolManager.getPlayerTool(toolIndex);
            if (tool.upgrade && upgradeMenu.classList.contains("not-visible")) {
                buyingToolMenu.classList.add("not-visible");
                upgradeMenu.classList.remove("not-visible");
                UIManager.popupsOpenned++;
                const upgrade = ToolManager.getPlayerTool(tool.upgrade);
                const oldToolCol = document.querySelector(
                    ".column.old-tool"
                ) as HTMLDivElement;
                const newToolCol = document.querySelector(
                    ".column.new-tool"
                ) as HTMLDivElement;
                UIManager.fillStats(oldToolCol, tool);
                UIManager.fillStats(newToolCol, upgrade);
                UIManager.setPrice(
                    upgradeMenu.querySelector(
                        ".upgrade-price p"
                    ) as HTMLParagraphElement,
                    upgrade.unlockPrice as IMaterialObject
                );
                ToolManager.toolToUpgrade = tool;
            }
        } else if (toolElt.classList.contains("unlocked")) {
            PlayerManager.player.selectedTool = toolIndex;
        } else if(buyingToolMenu.classList.contains("not-visible")) {
            // open the unlock menu
            PlayerManager.canPlayerMove = false;
            const tool = ToolManager.getPlayerTool(toolIndex);
            ToolManager.toolToUnlock = tool;
            ToolManager.toolToUnlockElt = e.target as HTMLDivElement;

            upgradeMenu.classList.add("not-visible");
            buyingToolMenu.classList.remove("not-visible");
            UIManager.popupsOpenned++;

            UIManager.fillStats(buyingToolMenu, tool);
            const toolPriceElt = buyingToolMenu.querySelector(
                ".tool-price p"
            ) as HTMLParagraphElement;
            UIManager.setPrice(
                toolPriceElt,
                tool.unlockPrice as IMaterialObject
            );
        }
    }
    static showAlertMsg(msg: string) {
        const alertPopup = document.querySelector(
            ".alert-popup-msg"
        ) as HTMLDivElement;
        alertPopup.classList.remove("not-visible");
        UIManager.popupsOpenned++;
        const alertPopupMsgElt = alertPopup.querySelector(
            "p"
        ) as HTMLParagraphElement;
        alertPopupMsgElt.innerHTML = msg;
    }
    static alert(msg: string) {
        const alertPopup = document.querySelector(
            ".alert-popup-msg"
        ) as HTMLDivElement;
        UIManager.showAlertMsg(msg);
        alertPopup.classList.remove("error-msg");
    }
    static error(msg: string) {
        const alertPopup = document.querySelector(
            ".alert-popup-msg"
        ) as HTMLDivElement;
        UIManager.showAlertMsg(msg);
        alertPopup.classList.add("error-msg");
    }
    static setupToolBar() {
        const toolUpgradeBtn = document.querySelector(
            ".tool-upgrade-btn"
        ) as HTMLButtonElement;
        toolUpgradeBtn.addEventListener("click", (e: Event) => {
            ToolManager.upgrade(ToolManager.toolToUpgrade);
        });
        (
            document.querySelector(
                ".alert-popup-msg button"
            ) as HTMLButtonElement
        ).addEventListener("click", () => {
            const alertPopup = document.querySelector(
                ".alert-popup-msg"
            ) as HTMLDivElement;
            alertPopup.classList.add("not-visible");
            UIManager.popupsOpenned--;
        });
        const toolBuyingBtn = document.querySelector(
            ".tool-buy-btn"
        ) as HTMLButtonElement;
        toolBuyingBtn.addEventListener("click", () => {
            ToolManager.unlock(
                ToolManager.toolToUnlock,
                ToolManager.toolToUnlockElt
            );
        });
        const closeUpgradePopup = document.querySelector(
            ".close-tool-upgrade-menu"
        ) as HTMLButtonElement;
        closeUpgradePopup.addEventListener("click", () => {
            const upgradeToolMenu = document.querySelector(
                ".tool-upgrade-menu"
            ) as HTMLDivElement;
            upgradeToolMenu.classList.add("not-visible");
            UIManager.popupsOpenned--;
            PlayerManager.canPlayerMove = true;
        });
        const closeBuyingPopup = document.querySelector(
            ".close-tool-buying-menu"
        ) as HTMLButtonElement;
        closeBuyingPopup.addEventListener("click", () => {
            const buyingToolMenu = document.querySelector(
                ".tool-buying-menu"
            ) as HTMLDivElement;
            buyingToolMenu.classList.add("not-visible");
            UIManager.popupsOpenned--;
            PlayerManager.canPlayerMove = true;
        });
        document
            .querySelector(".player-hand-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.PLAYER_HAND, e);
            });

        document
            .querySelector(".wood-axe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.WOOD_AXE, e);
            });
        document
            .querySelector(".stone-axe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.STONE_AXE, e);
            });
        document
            .querySelector(".iron-axe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.IRON_AXE, e);
            });
        document
            .querySelector(".wood-pickaxe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.WOOD_PICKAXE, e);
            });
        document
            .querySelector(".stone-pickaxe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.STONE_PICKAXE, e);
            });
        document
            .querySelector(".iron-pickaxe-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.IRON_PICKAXE, e);
            });
        document
            .querySelector(".wood-sword-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.WOOD_SWORD, e);
            });
        document
            .querySelector(".stone-sword-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.STONE_SWORD, e);
            });
        document
            .querySelector(".iron-sword-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.IRON_SWORD, e);
            });
        document
            .querySelector(".pistol-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.PISTOL, e);
            });
        document
            .querySelector(".pump-shotgun-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.PUMP_SHOTGUN, e);
            });
        document
            .querySelector(".heavy-sniper-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.HEAVY_SNIPER, e);
            });
        document
            .querySelector(".grenade-launcher-tool")!
            .addEventListener("click", (e: Event) => {
                UIManager.toolClicked(ETool.GRENADE_LAUNCHER, e);
            });

        const tools = document.querySelectorAll(".tool");
        for (let i = 0; i < tools.length; i++) {
            tools[i].addEventListener("click", () => {
                if (tools[i].classList.contains("unlocked")) {
                    tools.forEach((elt) => elt.classList.remove("selected"));
                    tools[i].classList.add("selected");
                    document
                        .querySelector(".building-menu")!
                        .classList.add("closed");
                }
            });
        }
    }
    static setupBuildingMenu() {
        const buildingOptions = document.querySelectorAll(".building-option");
        const tools = document.querySelectorAll(".tool");
        for (let i = 0; i < buildingOptions.length; i++) {
            buildingOptions[i].addEventListener("click", () => {
                document
                    .querySelector(".building-menu")!
                    .classList.remove("closed");
                buildingOptions.forEach((elt: Element) => {
                    elt.classList.remove("selected");
                });
                tools.forEach((elt) => elt.classList.remove("selected"));
                buildingOptions[i].classList.add("selected");
            });
            buildingOptions[i].addEventListener("mouseover", () => {
                const descEltClass = buildingOptions[i].getAttribute("desc");
                const descElt = document.querySelector(
                    "." + descEltClass
                ) as HTMLDListElement;
                descElt.classList.remove("not-visible");
            });
            buildingOptions[i].addEventListener("mouseout", () => {
                const descEltClass = buildingOptions[i].getAttribute("desc");
                const descElt = document.querySelector(
                    "." + descEltClass
                ) as HTMLDListElement;
                descElt.classList.add("not-visible");
            });
        }
        document.querySelector(".wood-wall")!.addEventListener("click", () => {
            PlayerManager.player.selectedTool = ETool.WOOD_WALL;
        });
        document.querySelector(".stone-wall")!.addEventListener("click", () => {
            PlayerManager.player.selectedTool = ETool.STONE_WALL;
        });
        document.querySelector(".wood-floor")!.addEventListener("click", () => {
            PlayerManager.player.selectedTool = ETool.WOOD_FLOOR;
        });
        document
            .querySelector(".stone-floor")!
            .addEventListener("click", () => {
                PlayerManager.player.selectedTool = ETool.STONE_FLOOR;
            });
        document.querySelector(".iron-wall")!.addEventListener("click", () => {
            PlayerManager.player.selectedTool = ETool.IRON_WALL;
        });
    }
    static showUI(p5: P5) {
        const sellingMenu = document.querySelector(
            ".selling-building-menu"
        ) as HTMLDListElement;
        if (UIManager.sellingMenuState === ESellingMenu.MOUSE_OUT) {
            UIManager.sellingMenuState = ESellingMenu.HIDDEN;
            sellingMenu.classList.add("not-visible");
        }
        UIManager.showClock();
        UIManager.showMatrialCount();
        UIManager.showPlayerHealth();
    }
    static showMatrialCount() {
        const p5 = UIManager.p5;
        const player = PlayerManager.player;
        const woodCounter = p5.select(".wood-counter") as P5.Element;
        const stoneCounter = p5.select(".stone-counter") as P5.Element;
        const ironCounter = p5.select(".iron-counter") as P5.Element;
        player.woodAmt = Utils.format(player.woodAmt, 1);
        player.stoneAmt = Utils.format(player.stoneAmt, 1);
        player.ironAmt = Utils.format(player.ironAmt, 1);
        woodCounter.html(`wood x ${player.woodAmt}`);
        stoneCounter.html(`stone x ${player.stoneAmt}`);
        ironCounter.html(`iron x ${player.ironAmt}`);
    }
    static showClock() {
        const p5 = UIManager.p5;
        const clockBG = SpriteManager.sprites.UI.clockBG;
        const clockHand = SpriteManager.sprites.UI.clockHand;
        const player = PlayerManager.player;
        const clock = UIManager.clock;

        p5.push();
        p5.translate(
            player.pos.x + clock.x + clock.size / 2 - p5.width / 2,
            player.pos.y + clock.y + clock.size / 2 - p5.height / 2
        );
        p5.push();
        p5.rotate(p5.map(GameManager.time, 0, 100, 0, -p5.PI * 2));
        p5.image(clockBG, 0, 0, clock.size, clock.size);
        p5.pop();
        p5.image(
            clockHand,
            0,
            0,
            (clock.handHeight * 2 * clockHand.width) / clockHand.height,
            clock.handHeight * 2
        );
        p5.pop();
    }
}
