import Scene from "./Scene.ts";
import {addListener, isUnderPoint} from "../../utils/game-utils.ts";
import ShipView from "../ships/ShipView.ts";

const shipDatas = [
    {size: 4, direction: "row", startX: 10, startY: 345},
    {size: 3, direction: "row", startX: 10, startY: 390},
    {size: 3, direction: "row", startX: 120, startY: 390},
    {size: 2, direction: "row", startX: 10, startY: 435},
    {size: 2, direction: "row", startX: 88, startY: 435},
    {size: 2, direction: "row", startX: 167, startY: 435},
    {size: 1, direction: "row", startX: 10, startY: 480},
    {size: 1, direction: "row", startX: 55, startY: 480},
    {size: 1, direction: "row", startX: 100, startY: 480},
    {size: 1, direction: "row", startX: 145, startY: 480},
];

class PreparationScene extends Scene {
    draggedShip: ShipView | null = null;
    draggedOffsetX = 0;
    draggedOffsetY = 0;

    removeEventListeners = [] as Array<() => void>;

    init() {
        this.manually();
    }

    start() {
        const {player, opponent} = this.game;

        opponent?.clear();
        player?.removeAllShots();
        player?.ships.forEach((ship) => (ship.killed = false));

        this.removeEventListeners = [];

        document
            .querySelectorAll(".app-actions")
            .forEach((element) => element.classList.add("hidden"));

        document
            .querySelector('[data-scene="preparation"]')
            ?.classList.remove("hidden");

        const manuallyButton = document.querySelector('[data-action="manually"]') as Element;
        const randomizeButton = document.querySelector('[data-action="randomize"]') as Element;
        const simpleButton = document.querySelector('[data-computer="simple"]') as Element;
        const middleButton = document.querySelector('[data-computer="middle"]') as Element;
        const hardButton = document.querySelector('[data-computer="hard"]') as Element;

        this.removeEventListeners.push(addListener(manuallyButton, () => this.manually()));

        this.removeEventListeners.push(addListener(randomizeButton,() => this.randomize()));

        this.removeEventListeners.push(addListener(simpleButton, () => this.startComputer()));

        this.removeEventListeners.push(addListener(middleButton,  () => this.startComputer()));

        this.removeEventListeners.push(addListener(hardButton,  () => this.startComputer()));
    }

    stop() {
        for (const removeEventListener of this.removeEventListeners) {
            removeEventListener();
        }

        this.removeEventListeners = [];
    }

    update() {
        const {mouse, player} = this.game;

        // Потенциально хотим начать тянуть корабль
        if (!this.draggedShip && mouse.left && !mouse.pLeft) {
            const ship = player?.ships.find((ship) => ship.isUnder(mouse));

            if (ship) {
                const shipRect = ship.div.getBoundingClientRect();

                this.draggedShip = ship as ShipView;
                this.draggedOffsetX = mouse.x - shipRect.left;
                this.draggedOffsetY = mouse.y - shipRect.top;

                ship.x = null;
                ship.y = null;
            }
        }

        // Перетаскивание
        if (mouse.left && this.draggedShip) {
            const {left, top} = player!.root.getBoundingClientRect();
            const x = mouse.x - left - this.draggedOffsetX;
            const y = mouse.y - top - this.draggedOffsetY;

            this.draggedShip.div.style.left = `${x}px`;
            this.draggedShip.div.style.top = `${y}px`;
        }

        // Бросание
        if (!mouse.left && this.draggedShip) {
            const ship = this.draggedShip;
            this.draggedShip = null;

            const {left, top} = ship.div.getBoundingClientRect();
            const {width, height} = player!.cells[0][0].getBoundingClientRect();

            const point = {
                x: left + width / 2,
                y: top + height /2,
            };

            const cell = player?.cells
                .flat()
                .find((cell) => isUnderPoint(point, cell));

            if (cell) {
                const x = parseInt(cell.dataset.x as string);
                const y = parseInt(cell.dataset.y as string);

                player?.removeShip(ship);
                player?.addShip(ship, x, y);
            } else {
                player?.removeShip(ship);
                player?.addShip(ship);
            }
        }

        // Вращение
        if (this.draggedShip && mouse.delta) {
            this.draggedShip.toggleDirection();
        }

        if (player?.complete) {
            document.querySelector('[data-computer="simple"]')?.setAttribute('disabled', 'false');
            document.querySelector('[data-computer="middle"]')?.setAttribute('disabled', 'false');
            document.querySelector('[data-computer="hard"]')?.setAttribute('disabled', 'false');
        } else {
            document.querySelector('[data-computer="simple"]')?.setAttribute('disabled', 'true');
            document.querySelector('[data-computer="middle"]')?.setAttribute('disabled', 'true');
            document.querySelector('[data-computer="hard"]')?.setAttribute('disabled', 'true');
        }
    }

    randomize() {
        const {player} = this.game;

        player?.randomize();

        for (let i = 0; i < 10; i++) {
            const ship = player!.ships[i];

            ship.startX = shipDatas[i].startX;
            ship.startY = shipDatas[i].startY;
        }
    }

    manually() {
        const {player} = this.game;

        player?.removeAllShips();

        for (const {size, direction, startX, startY} of shipDatas) {
            const ship = new ShipView(size, direction, startX, startY);
            player?.addShip(ship, startX, startY);
        }
    }

    startComputer () {

        // TODO: Добавить логику с усложением уровней
        // const matrix = this.game?.player?.matrix;
        // // const withoutShipItems = matrix?.flat().filter((item) => !item.ship) as Matrix;
        // // let untouchables = [] as Matrix[];
        // //
        // // if (level === "simple") {
        // // } else if (level === "middle") {
        // //     untouchables = getRandomSeveral(withoutShipItems, 20);
        // // } else if (level === "hard") {
        // //     untouchables = getRandomSeveral(withoutShipItems, 40);
        // // }

        this.game.start("computer");
    }
}

export default PreparationScene