import {getRandomBetween, getRandomFrom} from "../../utils/game-utils.ts";
import Ship from "../ships/Ship.ts";
import Shot from "../shot/Shot.ts";
import ShipView from "../ships/ShipView.ts";
import ShotView from "../shot/ShotView.ts";
export interface Cell {   x: number;   y: number;   ship: Ship;   free: boolean;   shoted: boolean;   wounded: boolean; }
class Battlefield {
  ships = [] as ShipView[];
  shots = [] as ShotView[];

  _matrix = [[]] as Cell[][];
  _changed = true;

  get loser () {
    for (const ship of this.ships) {
      if (!ship.killed) {
        return false;
      }
    }
    return true;
  }

  get matrix() {
    if (!this._changed) {
      return  this._matrix;
    }

    const matrix = [];

    for (let y = 0; y < 10; y++) {
      const row = [];

      for (let x = 0; x < 10; x++) {
        const item = {
          x,
          y,
          ship: {} as Ship,
          free: true,

          shoted: false,
          wounded: false,
        };

        row.push(item);
      }

      matrix.push(row);
    }

    for (const ship of this.ships) {
      if (!ship.placed) {
        continue;
      }

      const {x, y} = ship;
      const dx = Number(ship.direction === "row");
      const dy = Number(ship.direction === "column");

      for (let i = 0; i < ship.size ; i++) {
        const cx = Number(x) + dx * i;
        const cy = Number(y) + dy * i;

        const item = matrix[cy][cx];
        item.ship = ship ;
      }

      for (let y = Number(ship.y) - 1; y < Number(ship.y) + ship.size * dy + dx + 1; y++) {
        for (let x = Number(ship.x) - 1; x < Number(ship.x) + ship.size * dx + dy + 1; x++) {
          if (this.inField(x, y)) {
            const item = matrix[y][x];
            item.free = false;
          }
        }
      }
    }

    for (const {x, y} of this.shots) {
      const item = matrix[y][x];
      item.shoted = true;

      if (item.ship) {
        item.wounded = true;
      }
    }

    this._matrix = matrix;
    this._changed = false;

    return this._matrix;
  }

  get complete() {
    if (this.ships.length !== 10) {
      return false;
    }

    for (const ship of this.ships) {
      if (!ship.placed) {
        return false;
      }
    }

    return true;
  }

  inField(x?: number, y?: number) {
    if (!x || !y) {
      return false;
    }

    return 0 <= x && x < 10 && 0 <= y && y < 10;
  }

  addShip(ship: ShipView, x?: number, y?: number) {
    if (this.ships.includes(ship)) {
      return false;
    }

    this.ships.push(ship);

    if (this.inField(x, y)) {
      const dx = Number(ship.direction === "row");
      const dy = Number(ship.direction === "column");

      let placed = true;

      for (let i = 0; i < ship.size; i++) {
        const cy = Number(y) + dy * i;
        const cx = Number(x) + dx * i;

        if (!this.inField(cx, cy)) {
          placed = false;
          break;
        }

        const item = this.matrix[cy][cx];
        if (!item.free) {
          placed = false;
          break;
        }
      }

      if (placed) {
        Object.assign(ship, {x, y});
      }
    }

    this._changed = true;
    return true;
  }

  removeShip(ship: ShipView) {
    if (!this.ships.includes(ship)) {
      return false;
    }

    const index = this.ships.indexOf(ship)
    this.ships.splice(index, 1);
    ship.x = null;
    ship.y = null;

    this._changed = true;
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice()

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }

  addShot(shot: ShotView) {
    for(const {x, y} of this.shots) {
      if (x === shot.x && y === shot.y) {
        return false;
      }
    }

    this.shots.push(shot);
    this._changed = true;

    const matrix = this.matrix;
    const {x, y} = shot;

    if (matrix[y][x].ship) {
      shot.setVariant ("wounded");

      const {ship} = matrix[y][x];
      const dx = Number(ship.direction === "row");
      const dy = Number(ship.direction === "column");

      let killed = true;

      for(let i = 0; i < ship.size; i++) {
        const cx = Number(ship.x) + dx * i;
        const cy = Number(ship.y) + dy * i;
        const item = matrix[cy][cx];

        if (!item.wounded) {
          killed = false;
          break;
        }
      }

      if (killed) {
        ship.killed = true;

        for (let i = 0; i < ship.size; i++) {
          const cx = Number(ship.x )+ dx * i;
          const cy = Number(ship.y)  + dy * i;

          const shot = this.shots.find(
            (shot) => shot.x === cx && shot.y === cy
          ) as Shot;
          shot.setVariant("killed");
        }
      }
    }
    this._changed = true;
    return true;
  }

  removeShot(shot: ShotView) {
    if (!this.shots.includes(shot)) {
      return false;
    }

    const index = this.shots.indexOf(shot);
    this.shots.splice(index, 1);

    this._changed = true;
    return true;
  }

  removeAllShots() {
    const shots = this.shots.slice()

    for (const shot of shots) {
      this.removeShot(shot);
    }

    return shots.length;
  }

  randomize() {
    this.removeAllShips();

    for (let size = 4; size >= 1; size--) {
      for (let n = 0; n < 5 - size; n++) {
        const direction = getRandomFrom("row", "column");
        const ship = new Ship(size, direction);

        while (!ship.placed) {
          const x = getRandomBetween(0, 9);
          const y = getRandomBetween(0, 9);
          const shipView = new ShipView(size, direction, x ,y)
          this.removeShip(shipView);
          this.addShip(shipView, x, y);
        }
      }
    }
  }

  clear () {
    this.removeAllShots();
    this.removeAllShips();
  }


}

export default Battlefield