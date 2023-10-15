import Scene from "./Scene.ts";
import {addListener, getRandomBetween, isUnderPoint} from "../../utils/game-utils.ts";
import ShotView from "../shot/ShotView.ts";

class ComputerScene extends Scene {
  playerTurn = true;
  status: Element | null = null;
  removeEventListeners = [] as Array<() => void>;

  init() {
    this.status = document.querySelector(".battlefield-status");
  }

  start() {
    const {opponent} = this.game;

    document.querySelectorAll(".app-actions").forEach((element) => element.classList.add("hidden"));

    document.querySelector('[data-scene="computer"]')?.classList.remove("hidden");

    opponent?.clear();
    opponent?.randomize();


    this.removeEventListeners = [];

    const gaveupButton = document.querySelector('[data-action = "gaveup"]') as Element;
    const againButton = document.querySelector('[data-action = "again"]') as Element;

    gaveupButton?.classList.remove("hidden");
    againButton?.classList.add("hidden");

    this.removeEventListeners.push(
      addListener(gaveupButton, () => {
        this.game.start("preparation");
      })
    );

    this.removeEventListeners.push(
      addListener(againButton, () => {
        this.game.start("preparation");
      })
    );
  }

  stop() {
    for (const removeEventListener of this.removeEventListeners) {
      removeEventListener();
    }

    this.removeEventListeners = [];
  }

  update() {
    const {mouse, opponent, player} = this.game;

    const isEnd = opponent?.loser || player?.loser;

    const cells = opponent?.cells.flat();
    cells?.forEach((cell) => cell.classList.remove("battlefield-item_active"));

    if (isEnd && this.status) {
      if (opponent?.loser) {
        this.status.textContent = "Вы выиграли!";
      } else {
        this.status.textContent = "Вы проиграли :/";
      }

      document.querySelector('[data-action = "gaveup"]')?.classList.add("hidden");
      document.querySelector('[data-action = "again"]')?.classList.remove("hidden");

      return;
    }

    if (isUnderPoint(mouse, opponent!.table)) {
      const cell = cells?.find((cell) => isUnderPoint(mouse, cell));

      if (cell) {
        cell.classList.add("battlefield-item_active");

        if (this.playerTurn && mouse.left && !mouse.pLeft) {
          const x = parseInt(cell.dataset.x as string);
          const y = parseInt(cell.dataset.y as string);

          const shot = new ShotView(x, y);
          const result = opponent?.addShot(shot);

          if (result) {
            this.playerTurn = shot.variant !== "miss";
          }
        }
      }
    }

    if (!this.playerTurn) {
      const x = getRandomBetween(0, 9);
      const y = getRandomBetween(0, 9);
      const shot = new ShotView(x, y);
      const result = player?.addShot(shot);

      if (result) {
        this.playerTurn = shot.variant === "miss";
      }
    }
    if (this.status) {
      if (this.playerTurn) {
        this.status.textContent = "Ваш ход:";
      } else {
        this.status.textContent = "Ход компьютера:";
      }
    }
  }
}

export default ComputerScene