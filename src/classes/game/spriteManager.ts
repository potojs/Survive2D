import P5 from "p5";

interface ISpriteStringMap {
    [key:string]: ISpriteStringMap|string
}
interface ISpriteImageMap {
    [key: string]: any;
}
export class SpriteManager {
    static sprites: ISpriteImageMap = {}
    static spritesString: ISpriteStringMap = {
        UI: {
            clockBG: "clockBG",
            clockHand: "clockHand",
            heart: "heart"
        },
        enemies: {
            zombies: {
                normalZombie: "normalZombie",
                bigZombie: "bigZombie",
            },
            demons: {
                demon: "demon",
                papaDemon: "papaDemon",
            },
            weapons: {
                zombieHand: "zombieHand",
                bloodAxe: "bloodAxe",
                papaDemonAxe: "papaDemonAxe"
            }
        },
        environment: {
            tree: "tree",
            rock: "rock",
            iron: "iron"
        },
        player: {
            player: "player",
            tools: {
                playerHand: "playerHand",
                woodAxe: "woodAxe",
                stoneAxe: "stoneAxe",
                ironAxe: "ironAxe",
                woodPickaxe: "woodPickaxe",
                stonePickaxe: "stonePickaxe",
                ironPickaxe: "ironPickaxe",
                woodSword: "woodSword",
                stoneSword: "stoneSword",
                ironSword: "ironSword",
                pistol: "pistol",
                pumpShotgun: "pumpShotgun",
                heavySniper: "heavySniper",
                grenadeLauncher: "grenadeLauncher"
            }
        }
    }

    static loadSprites(p5: P5) {
        SpriteManager.loadBranch(SpriteManager.spritesString, "sprites", p5);
        SpriteManager.sprites = SpriteManager.sprites.sprites;
    }
    static loadBranch(branch: ISpriteStringMap | string, path: string, p5: P5) {
        if(typeof branch === "string"){
            SpriteManager.setImageObject(SpriteManager.sprites, path, path, p5);
        }else{
            for(const key in branch) {
                SpriteManager.loadBranch(branch[key], path+"/"+key, p5);
            }
        }
    }
    static setImageObject(branch: ISpriteImageMap, path: string, fullPath: string, p5: P5) {
        if(path!=="") {
            const nestedObjectKeys = path.split("/");
            if(nestedObjectKeys.length === 1){
                branch[nestedObjectKeys[0]] = p5.loadImage(fullPath + ".png");
            }else{
                branch[nestedObjectKeys[0]] ||= {};
                SpriteManager.setImageObject(
                    branch[nestedObjectKeys[0]] as ISpriteImageMap, 
                    nestedObjectKeys.slice(1, nestedObjectKeys.length).join("/"),
                    fullPath,
                    p5
                );
            }
        }
    }
}