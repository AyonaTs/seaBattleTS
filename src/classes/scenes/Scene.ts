import Game from "../Game.ts";


class Scene {
    name: string;
    game: Game;

    constructor(name: string, game: Game) {
        this.name = name
        this.game = game
    }

     init() {}
     start(){}
     stop(){}
     update() {}
}

export default Scene