type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type ToInt<T> = T extends `${infer N extends number}` ? N : never;

type ArrayReplaceAt<Array extends any[], X extends number, value> = {
  [key in keyof Array]: key extends `${X}` ? value : Array[key];
};

type MatrixReplaceAt<Matrix extends any[][], Position extends [number, number], value> = {
  [key in keyof Matrix]: key extends `${Position[1]}`
    ? ArrayReplaceAt<Matrix[key], Position[0], value>
    : Matrix[key];
};

type FindEmptyRow<board extends Connect4Cell[][], column extends number> = board extends [
    ...infer rows extends Connect4Cell[][],
    infer row extends Connect4Cell[],
  ]
  ? row[column] extends "  "
    ? rows["length"]
    : FindEmptyRow<rows, column>
  : never;

type PlaceChip<
  board extends Connect4Cell[][],
  column extends number,
  chip extends Connect4State,
> = chip extends Connect4Chips
  ? FindEmptyRow<board, column> extends infer row extends number
    ? Extract<MatrixReplaceAt<board, [column, row], chip>, Connect4Cell[][]>
    : board
  : board;

/************************
 * Check for 4 in a row *
 ************************/

type DiagonalMap = [
  [[0, 3], [1, 2], [2, 1], [3, 0]],
  [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
  [[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]],
  [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
  [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2]],
  [[2, 6], [3, 5], [4, 4], [5, 3]],
  [[2, 0], [3, 1], [4, 2], [5, 3]],
  [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]],
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]],
  [[0, 3], [1, 4], [2, 5], [3, 6]],
];

type GetColumn<Board extends Connect4Cell[][], column extends number> = {
  [key in keyof Board]: Board[key][column];
};

type GetRow<Board extends Connect4Cell[][], row extends number> = Board[row];

type GetDiagonal<
  Board extends Connect4Cell[][],
  N extends number,
  $map extends [number, number][] = DiagonalMap[N],
  $acc extends Connect4Cell[] = [],
> = $map extends [infer head extends [number, number], ...infer tail extends [number, number][]]
  ? GetDiagonal<Board, N, tail, [Board[head[0]][head[1]], ...$acc]>
  : $acc;

type Check4<
  Board extends Connect4Cell[],
  $acc extends Connect4Chips[] = [],
> = $acc["length"] extends 4
  ? $acc[0]
  : Board extends [infer head, ...infer tail extends Connect4Cell[]]
    ? head extends Connect4Chips
      ? [$acc[0]] extends [head]
        ? Check4<tail, [...$acc, head]>
        : Check4<tail, [head]>
      : Check4<tail>
    : never;

type WinnerInRows<Board extends Connect4Cell[][], $rows = ToInt<keyof Board>> = $rows extends number
  ? Check4<GetRow<Board, $rows>>
  : never;

type WinnerInColumns<
  Board extends Connect4Cell[][],
  $columns = ToInt<keyof Board[0]>,
> = $columns extends number ? Check4<GetColumn<Board, $columns>> : never;

type WinnerInDiagonals<
  Board extends Connect4Cell[][],
  $diags = ToInt<keyof DiagonalMap>,
> = $diags extends number ? Check4<GetDiagonal<Board, $diags>> : never;

type Winner<Board extends Connect4Cell[][]> =
  | WinnerInRows<Board>
  | WinnerInColumns<Board>
  | WinnerInDiagonals<Board>;

type CheckDraw<Board extends Connect4Cell[][]> = "  " extends Board[number][number] ? false : true;

type NextGameState<
  Board extends Connect4Cell[][],
  State extends Connect4State,
  $winner extends Connect4Chips = Winner<Board>,
> = [$winner] extends [never]
  ? CheckDraw<Board> extends false
    ? State extends "🔴"
      ? "🟡"
      : "🔴"
    : "Draw"
  : `${$winner} Won`;

type Connect4<
  Game extends { board: Connect4Cell[][]; state: Connect4State },
  Column extends number,
  $NewBoard extends Connect4Cell[][] = PlaceChip<Game["board"], Column, Game["state"]>,
  $NewState = NextGameState<$NewBoard, Game["state"]>,
> = {
  board: $NewBoard;
  state: $NewState;
};
