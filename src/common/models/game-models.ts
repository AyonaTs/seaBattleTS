export enum GameStateType {
  FirstPlayerTurn = 'first-player-turn',
  SecondPlayerTurn = 'first-player-turn',
  ComputerTurn = 'computer-turn',
  GameOver = 'game-over',
  Placement = 'placement'
}

export enum Opponent {
  Ai = 'ai',
  User = 'user'
}

export enum GameMode {
  Miss = 'miss',
  Queue = 'queue'
}
