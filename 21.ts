type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  ';
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [['  ', '  ', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

interface TicTacToeYPositionsIndex {
  top: 0;
  middle: 1;
  bottom: 2;
}

interface TicTacToeXPositionsIndex {
  left: 0;
  center: 1;
  right: 2;
}

type SetCol<
  TRow extends TicTactToeBoard[number],
  TContent extends TicTacToeChip,
  TPosition extends number,
> = {
  [K in keyof TRow]: K extends `${TPosition}` ? TContent : TRow[K];
};

type SetPosition<
  TBoard extends TicTactToeBoard,
  TContent extends TicTacToeChip,
  Y extends number,
  X extends number,
> = {
  [Row in keyof TBoard]: Row extends `${Y}` ? SetCol<TBoard[Row], TContent, X> : TBoard[Row];
};

type WinningPositions = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

type Won<
  TBoard extends TicTactToeBoard,
  TChip extends TicTacToeChip,
  TChecks = WinningPositions,
> = TChecks extends [
    infer Current extends [number, number][],
    ...infer Rest extends [number, number][][],
  ]
  ? TBoard[Current[0][0]][Current[0][1]] extends TChip
    ? TBoard[Current[1][0]][Current[1][1]] extends TChip
      ? TBoard[Current[2][0]][Current[2][1]] extends TChip
        ? true
        : Won<TBoard, TChip, Rest>
      : Won<TBoard, TChip, Rest>
    : Won<TBoard, TChip, Rest>
  : false;

type IsRowFull<TRow extends TicTactToeBoard[number]> = TRow extends [
    infer Chip,
    ...infer Rest extends TicTactToeBoard[number],
  ]
  ? Chip extends TicTacToeEmptyCell
    ? false
    : IsRowFull<Rest>
  : true;

type IsFull<TBoard extends TicTactToeBoard> = TBoard extends [
    infer Row extends TicTactToeBoard[number],
    ...infer Rest extends TicTactToeBoard,
  ]
  ? IsRowFull<Row> extends true
    ? IsFull<Rest>
    : false
  : true;

type GenGame<TBoard extends TicTactToeBoard, TState extends TicTacToeChip> = {
  board: TBoard;
  state: Won<TBoard, '❌'> extends true
    ? '❌ Won'
    : Won<TBoard, "⭕"> extends true
      ? '⭕ Won'
      : IsFull<TBoard> extends true
        ? 'Draw'
        : TState extends '❌'
          ? '⭕'
          : '❌';
};

type ParsePosition<TPosition extends TicTacToePositions> = TPosition extends `${infer Y extends
    TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
  ? [TicTacToeYPositionsIndex[Y], TicTacToeXPositionsIndex[X]]
  : never;

type TicTacToe<
  TGame extends TicTacToeGame,
  TMove extends TicTacToePositions,
  $board extends TicTactToeBoard = TGame['board'],
  $state extends TicTacToeState = TGame['state'],
  $coords extends [number, number] = ParsePosition<TMove>,
> = $state extends TicTacToeChip
  ? $coords extends [infer $Y extends number, infer $X extends number]
    ? $board[$Y][$X] extends TicTacToeEmptyCell
      ? GenGame<SetPosition<$board, $state, $Y, $X>, $state>
      : TGame
    : TGame
  : TGame;
