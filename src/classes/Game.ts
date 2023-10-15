import Mouse from "./Mouse.ts";
import BattlefieldView from "./battlefield/BattlefieldView.ts";
import Scene from "./scenes/Scene.ts";

import ComputerScene from "./scenes/ComputerScene.ts";
import PreparationScene from "./scenes/PreparationScene.ts";

export enum ScenesType {
  COMPUTER='computer',
  PREPARATION = 'preparation'
}
export interface Scenes {
  preparation: PreparationScene;
  computer: ComputerScene;
}

class Game {
  mouse: Mouse;

  player: BattlefieldView | null = null;
  opponent: BattlefieldView | null = null;

  scenes: Record<ScenesType, Scene>
  activeScene: Scene | undefined;

  constructor() {


    const preparation = new  PreparationScene('preparation', this);
    const computer = new ComputerScene('computer', this);


    this.scenes = {
      [ScenesType.COMPUTER]: computer,
      [ScenesType.PREPARATION]: preparation,
    }

    preparation.init()
    computer.init()

    this.mouse = new Mouse(document.body);
    this.player = new BattlefieldView(true);
    this.opponent = new BattlefieldView(false);

    document.querySelector('[data-side = "player"]')?.append(this.player.root);
    document.querySelector('[data-side = "opponent"]')?.append(this.opponent.root);

  }



  start(sceneName: ScenesType) {

    if (this.activeScene && this.activeScene.name === sceneName)  {
      return false;
    }

    if (!this.scenes.hasOwnProperty(sceneName)) {
      return false;
    }

    if (this.activeScene) {
      this.activeScene.stop();
    }

    const scene = this.scenes[sceneName];
    this.activeScene = scene;
    this.activeScene?.start();
    return true;
  }
}

export default Game

