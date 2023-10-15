import Ship from "./Ship.ts";
import {isUnderPoint} from "../../utils/game-utils.ts";
import {Point} from "../../common/models.ts";

class ShipView extends Ship {
  div: HTMLElement = document.createElement("div");
  startX: number| null = null;
  startY: number | null = null;

  constructor(size : number, direction: string, startX: number, startY: number) {
    super(size, direction);

    this.div.classList.add("ship");

    Object.assign(this, {startX, startY});

    this.setDirection(direction, true);
  }

  setDirection(newDirection: string, force = false) {
    if (!force && this.direction === newDirection) {
      return false;
    }

    this.div.classList.remove(`ship-${this.direction}-${this.size}`);
    this.direction = newDirection;
    this.div.classList.add(`ship-${this.direction}-${this.size}`);

    return true;
  }

  toggleDirection() {
    const newDirection = this.direction === "row" ? "column" : "row";
    this.setDirection(newDirection);
  }

  isUnder(point: Point) {
    return isUnderPoint(point, this.div);
  }
}

export default ShipView