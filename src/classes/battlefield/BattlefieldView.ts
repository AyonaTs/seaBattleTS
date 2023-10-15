import Battlefield from "./Battlefield.ts";
import ShipView from "../ships/ShipView.ts";
import {isUnderPoint} from "../../utils/game-utils.ts";
import {Point} from "../../common/models.ts";
import ShotView from "../shot/ShotView.ts";

class BattlefieldView extends Battlefield {
  root: HTMLElement ;
  table: HTMLElement;
  dock: HTMLElement;
  polygon: HTMLElement;
  showShips = true;

  cells = [] as HTMLTableCellElement[][];

  constructor(showShips = true) {
    super();

    const root = document.getElementById("battlefield") ||  document.createElement("battlefield");
    root.classList.add("battlefield");

    const table = document.createElement("table");
    table.classList.add("battlefield-table");

    const dock = document.createElement("div");
    dock.classList.add("battlefield-dock");

    const polygon = document.createElement("div");
    polygon.classList.add("battlefield-polygon");

    this.root = root
    this.polygon = polygon
    this.table = table
    this.dock = dock
    this.showShips = showShips
    root.append(table, dock, polygon);

    for (let y = 0; y < 10; y++) {
      const row = [] ;
      const tr = document.createElement("tr");
      tr.classList.add("battlefield-row");
      tr.dataset.y = y.toString();

      for (let x = 0; x < 10; x++) {
        const td = document.createElement("td");
        td.classList.add("battlefield-item");
        Object.assign(td.dataset, {x, y});

        tr.append(td);
        row.push(td);
      }

      table.append(tr);
      this.cells.push(row);
    }

    for (let x = 0; x < 10; x++) {
      const cell = this.cells[0][x]
      const marker = document.createElement("div")

      marker.classList.add("marker", "marker-column");
      marker.textContent = 'АБВГДЕЖЗИК'[x];

      cell.append(marker);
    }

    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement("div");

      marker.classList.add("marker", "marker-row");
      marker.textContent = (y + 1).toString();

      cell.append(marker);
    }
  }

  addShip(ship: ShipView, x?: number, y?: number) {
    if (!super.addShip(ship, x, y)) {
      return false;
    }

    if (this.showShips) {
      this.dock.append(ship.div);

      if (ship.placed) {
        const cell = this.cells[Number(y)][Number(x)];
        const cellRect = cell.getBoundingClientRect();
        const rootRect = this.root.getBoundingClientRect()

        ship.div.style.left = `${cellRect.left - rootRect.left}px`;
        ship.div.style.top = `${cellRect.top - rootRect.top}px`;
      } else {
        ship.setDirection("row");
        ship.div.style.left = `${ship.startX}px`;
        ship.div.style.top = `${ship.startY}px`;
      }
    }
    return true;
  }

  removeShip(ship: ShipView) {
    if (!super.removeShip(ship)) {
      return false;
    }

    if (Array.prototype.includes.call(this.dock.children, ship.div)) {
      ship.div.remove();
    }

    return true;
  }

  isUnder(point: Point) {
    return isUnderPoint(point, this.root);
  }

  addShot(shot: ShotView) {
    if (!super.addShot(shot)) {
      return false;
    }

    this.polygon.append(shot.div);

    const cell = this.cells[shot.y][shot.x];
    const cellRect = cell.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();

    shot.div.style.left = `${cellRect.left - rootRect.left}px`;
    shot.div.style.top = `${cellRect.top - rootRect.top}px`;

    return true;
  }

  removeShot(shot: ShotView) {
    if (!super.removeShot(shot)) {
      return false;
    }

    if (Array.prototype.includes.call(this.polygon.children, shot.div)) {
      shot.div.remove();
    }

    return true;
  }
}

export default BattlefieldView