import P5 from "p5";
import { PlayerManager } from "./classes/player/playerManager";
import { SpriteManager } from "./classes/game/spriteManager";
import { GameManager } from "./classes/game/gameManager";
import Quadtree from "quadtree-lib";
import { MapManager } from "./classes/game/mapManager";
import { IQuadtreeItem } from "./classes/quadtreeUser";

export let timeLastFrame = new Date().getTime();
export const fps = 60;
export const quadtree = new Quadtree<IQuadtreeItem>({
    width: MapManager.mapDimensions.w,
    height: MapManager.mapDimensions.h,
});

const sketch = (p5: P5) => {
    let canvas: P5.Renderer;
    p5.preload = () => {
        SpriteManager.loadSprites(p5);
    };
    p5.setup = () => {
        GameManager.setup(p5);
        canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.mouseOver(() => {
            GameManager.updateMousePos = true;
        });
        canvas.mouseOut(() => {
            GameManager.updateMousePos = false;
        });
        p5.rectMode(p5.CENTER);
        p5.imageMode(p5.CENTER);
        const canvasElt = canvas.elt as HTMLCanvasElement;
        canvasElt.addEventListener("mousedown", (e) => {
            GameManager.mousePressed = true;
        });
        document.addEventListener("mouseup", () => {
            GameManager.mousePressed = false;
        });
    };
    p5.draw = () => {
        const dt = p5.min(p5.deltaTime, 100) / (1000/fps);
        GameManager.update(dt);
        GameManager.show(dt);
        timeLastFrame = new Date().getTime();
    };
    p5.keyPressed = () => {
        if (p5.keyCode === 32) {
            PlayerManager.hit();
        }
    };
};
function startGame() {
    (document.querySelector(".game") as HTMLDivElement).classList.remove(
        "not-visible"
    );
    new P5(sketch);
}
const startMenu = document.querySelector(".start-menu-cont") as HTMLDivElement;
const startNewGameBtn = document.querySelector(
    ".start-new-game-btn"
) as HTMLButtonElement;
const continueGameBtn = document.querySelector(
    ".continue-btn"
) as HTMLButtonElement;
if (localStorage.length === 0) {
    continueGameBtn.classList.add("disabled");
}
startNewGameBtn.addEventListener("click", () => {
    if (
        localStorage.length === 0 ||
        confirm(
            "if you continue your other save will be deleted, and your progress will be lost"
        )
    ) {
        localStorage.clear();
        startMenu.classList.add("not-visible");
        startGame();
    }
});
continueGameBtn.addEventListener("click", () => {
    startMenu.classList.add("not-visible");
    startGame();
});
