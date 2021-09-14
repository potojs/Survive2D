import P5 from "p5";
import { Player } from "./player";
import { ToolManager } from "./tools/toolManager";

export class PlayerManager {
    static playerSize = 25;
    static playerSpeed = 6;
    static player: Player;
    static canPlayerMove = true;

    static show() {
        PlayerManager.player.show();
    }
    static hit() {
        PlayerManager.player.hit();
    }
    static createPlayer(p5: P5): Player {
        if (localStorage.length > 0) {
            const playerData = JSON.parse(
                localStorage.getItem("player") as string
            );
            const player = (PlayerManager.player = new Player(
                playerData.x,
                playerData.y,
                playerData.materials.wood,
                playerData.materials.stone,
                playerData.materials.iron,
                playerData.health,
                PlayerManager.playerSize,
                PlayerManager.playerSpeed,
                p5
            ));
            player.allWoodCollected = playerData.allMaterialCollected.wood;
            player.allStoneCollected = playerData.allMaterialCollected.stone;
            player.allIronCollected = playerData.allMaterialCollected.iron;
            player.selectedTool = playerData.selectedTool;
            return player;
        }
        return (PlayerManager.player = new Player(
            0,
            0,
            100000,
            100000,
            100000,
            100,
            PlayerManager.playerSize,
            PlayerManager.playerSpeed,
            p5
        ));
    }
    static update(dt: number) {
        PlayerManager.player.userInput();
        PlayerManager.player.update(dt);
    }
}
