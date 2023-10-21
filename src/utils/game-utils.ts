import { BOARD, BOARD_COLUMNS, BOARD_ROWS, POINT } from '../common/models/board-nodels.ts';
import { CellState } from '../common/models/cell-models.ts';
import { Orientation, PlacedShip, Ship } from '../common/models/ship-models.ts';
import { Hit } from '../common/models/hit-models.ts';


export const generateEmptyLayout = (): Array<CellState> => {
  return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(CellState.empty);
};

// Возвращает обратный индекс выбранной ячейки
export const coordsToIndex = (coordinates: POINT | null) => {
  if (!coordinates) return BOARD;

  const {x, y} = coordinates;

  return y * BOARD_ROWS + x;
};

export const indexToCoords = (index: number) => {
  return {
    x: index % BOARD_ROWS,
    y: Math.floor(index / BOARD_ROWS),
  };
};
// Возвращает индексы, которые занял бы объект
export const entityIndices = (entity: PlacedShip) => {
  let position = coordsToIndex(entity.position);

  let indices = [];

  for (let i = 0; i < entity.length; i++) {
    indices.push(position);
    position = entity.orientation === Orientation.VERTICAL ? position + BOARD_ROWS : position + 1;
  }

  return indices;
};

// Возвращает индексы, которые занял бы объект ( 2 способ)
export const entityIndexes = (entity: PlacedShip) => {
  let indices = [];
  for (let i = 0; i < entity.length; i++) {
    const position =
      entity.orientation === Orientation.VERTICAL
        ? coordsToIndex({y: entity.position.y + i, x: entity.position.x})
        : coordsToIndex({y: entity.position.y, x: entity.position.x + i});
    indices.push(position);
  }

  return indices;
};

// Проверка на возможность размещения
export const isWithinBounds = (entity: PlacedShip) => {
  return (
    (entity.orientation === Orientation.VERTICAL &&
      entity.position.y + entity.length <= BOARD_ROWS) ||
    (entity.orientation === Orientation.HORIZONTAL &&
      entity.position.x + entity.length <= BOARD_COLUMNS)
  );
};


// Размещение на карте
export const putEntityInLayout = (oldLayout: Array<CellState>, entity: PlacedShip | Hit, type: CellState) => {
  let newLayout = oldLayout.slice();

  if (type === 'ship') {
    entityIndices(entity as PlacedShip).forEach((idx) => {
      newLayout[idx] = CellState.ship;
    });
  }

  if (type === 'forbidden') {
    entityIndices(entity as PlacedShip).forEach((idx) => {
      newLayout[idx] = CellState.forbidden;
    });
  }

  if (type === 'hit') {
    newLayout[coordsToIndex(entity.position)] = CellState.hit;
  }

  if (type === 'miss') {
    newLayout[coordsToIndex(entity.position)] = CellState.miss;
  }

  if (type === 'ship-sunk') {
    entityIndices(entity as PlacedShip).forEach((idx) => {
      newLayout[idx] = CellState.ship_sunk;
    });
  }

  return newLayout;
};

// Проверка доступности ячеек для корабля
export const isPlaceFree = (entity: PlacedShip, layout: Array<CellState>) => {
  const shipIndices = entityIndexes(entity);

  // Проверяем, что ни одна из ячеек, которые занимает корабль, не занята другими кораблями
  for (const idx of shipIndices) {
    if (layout[idx] !== CellState.empty) {
      return false;
    }

    // Получаем соседей для текущей клетки
    const neighbors = getNeighbors(indexToCoords(idx));

    // Проверяем, что ни одна из диагональных соседних клеток не занята другими кораблями
    for (const neighborIdx of neighbors) {
      if (layout[neighborIdx] !== CellState.empty) {
        return false;
      }
    }
  }

  return true;
};

// Вычисление  того, на сколько квадратов корабль выходит за пределы поля
export const calculateOverhang = (entity: PlacedShip) =>
  Math.max(
    entity.orientation === Orientation.VERTICAL
      ? entity.position.y + entity.length - BOARD_ROWS
      : entity.position.x + entity.length - BOARD_COLUMNS,
    0
  );

// Проверяет, находится ли корабль, который вы пытаетесь разместить, в пределах установленных границ и свободно ли пространство. Оба должны возвращать значение true
export const canBePlaced = (entity: PlacedShip, layout: Array<CellState>) =>
  isWithinBounds(entity) && isPlaceFree(entity, layout);

// Генерирует макет и присваивает каждому комп-кораблю случайную ориентацию и набор координат; возвращает все размещенные корабли
export const placeAllComputerShips = (computerShips: Ship[]) => {
  let compLayout = generateEmptyLayout();

  return computerShips.map((ship) => {
    while (true) {
      let decoratedShip = randomizeShipProps(ship) as PlacedShip;

      if (canBePlaced(decoratedShip, compLayout)) {
        compLayout = putEntityInLayout(compLayout, decoratedShip, CellState.ship);
        return {...decoratedShip, placed: true};
      }
    }
  });
};

// Генерируйте случайную ориентацию кораблей компьютера
export const generateRandomOrientation = () => {
  let randomNumber = Math.floor(Math.random() * Math.floor(2));

  return randomNumber === 1 ? Orientation.VERTICAL : Orientation.HORIZONTAL;
};

export const generateRandomIndex = (value = BOARD) => {
  return Math.floor(Math.random() * Math.floor(value));
};

// Присвоить кораблю случайную ориентацию и набор координат
export const randomizeShipProps = (ship: Ship) => {
  let randomStartIndex = generateRandomIndex();

  return {
    ...ship,
    position: indexToCoords(randomStartIndex),
    orientation: generateRandomOrientation(),
  };
};

// Размещаем на доске
export const placeShipInLayout = (ship: PlacedShip, aiLayout: Array<CellState>) => {
  let newCompLayout = aiLayout.slice();

  entityIndexes(ship).forEach((idx) => {
    newCompLayout[idx] = CellState.ship;
  });
  return newCompLayout;
};

// Поиск соседей
export const getNeighbors = (coords: POINT) => {
  let firstRow = coords.y === 0;
  let lastRow = coords.y === 9;
  let firstColumn = coords.x === 0;
  let lastColumn = coords.x === 9;

  let neighbors = [];

  // coords.y === 0;
  if (firstRow) {
    neighbors.push(
      {x: coords.x + 1, y: coords.y},
      {x: coords.x - 1, y: coords.y},
      {x: coords.x, y: coords.y + 1}
    );
  }

  // coords.y === 9;
  if (lastRow) {
    neighbors.push(
      {x: coords.x + 1, y: coords.y},
      {x: coords.x - 1, y: coords.y},
      {x: coords.x, y: coords.y - 1}
    );
  }

  // coords.x === 0
  if (firstColumn) {
    neighbors.push(
      {x: coords.x + 1, y: coords.y}, // справа
      {x: coords.x, y: coords.y + 1}, // снизу
      {x: coords.x, y: coords.y - 1} // сверху
    );
  }

  // coords.x === 9
  if (lastColumn) {
    neighbors.push(
      {x: coords.x - 1, y: coords.y}, // слева
      {x: coords.x, y: coords.y + 1}, // снизу
      {x: coords.x, y: coords.y - 1} // сверху
    );
  }

  if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
    neighbors.push(
      {x: coords.x - 1, y: coords.y}, // слева
      {x: coords.x + 1, y: coords.y}, // справа
      {x: coords.x, y: coords.y - 1}, // сверху
      {x: coords.x, y: coords.y + 1}, // снизу
      {x: coords.x - 1, y: coords.y - 1}, // Слева сверху
      {x: coords.x + 1, y: coords.y - 1}, // Справа сверху
      {x: coords.x - 1, y: coords.y + 1}, // Слева снизу
      {x: coords.x + 1, y: coords.y + 1}, // Справа снизу
    );
  }

  let filteredResult = [
    ...new Set(
      neighbors
        .map((coords) => coordsToIndex(coords))
        .filter((number) => number >= 0 && number < BOARD)
    ),
  ];

  return filteredResult;
};

// Устанавливаем флаг - "затонул" кораблям, чтобы обновить их цвет
export const updateSunkShips = (currentHits: Array<Hit>, opponentShips: PlacedShip[]) => {

  let playerHitIndices = currentHits.map((hit) => coordsToIndex(hit.position));

  let indexWasHit = (index: number) => playerHitIndices.includes(index);

  let shipsWithSunkFlag = opponentShips.map((ship) => {
    let shipIndices = entityIndexes(ship);
    if (shipIndices.every((idx) => indexWasHit(idx))) {
      return {...ship, sunk: true};
    } else {
      return {...ship, sunk: false};
    }
  });

  return shipsWithSunkFlag;
};
