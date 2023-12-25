type Alley = "  ";
type Santa = "🎅";
type MazeItem = "🎄" | Santa | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type FindSanta<T extends MazeMatrix, Row extends readonly unknown[] = []> = T extends [
    infer Head extends MazeMatrix[number],
    ...infer Rest extends MazeMatrix,
  ]
  ? FindSantaInRow<Head> extends infer Col extends readonly unknown[]
    ? [Col] extends [never]
      ? FindSanta<Rest, [...Row, unknown]>
      : [Row, Col]
    : never
  : never;

type FindSantaInRow<T extends MazeMatrix[number], Col extends readonly unknown[] = []> = T extends [
    infer Head,
    ...infer Rest extends MazeMatrix[number],
  ]
  ? Head extends Santa
    ? Col
    : FindSantaInRow<Rest, [...Col, unknown]>
  : never;

type Next<
  Row extends readonly unknown[],
  Col extends readonly unknown[],
  Direction extends Directions,
> = Direction extends "up"
  ? [Tail<Row>, Col]
  : Direction extends "down"
    ? [[...Row, unknown], Col]
    : Direction extends "left"
      ? [Row, Tail<Col>]
      : [Row, [...Col, unknown]];

type Tail<T extends readonly unknown[]> = T extends [unknown, ...infer Rest] ? Rest : unknown;

type InBounds<
  T extends MazeMatrix,
  Row extends readonly unknown[],
  Col extends readonly unknown[],
> = Row["length"] extends keyof T
  ? Col["length"] extends keyof T[Row["length"]]
    ? true
    : false
  : false;

type CanMove<
  T extends MazeMatrix,
  Row extends readonly unknown[],
  Col extends readonly unknown[],
> = T[Row["length"]][Col["length"]] extends Alley ? true : false;

type SetAt<
  T extends MazeMatrix,
  Value extends MazeItem,
  Row extends readonly unknown[],
  Col extends readonly unknown[],
> = {
  [R in keyof T]: R extends `${Row["length"]}` ? SetInRow<T[R], Value, Col> : T[R];
};

type SetInRow<
  T extends MazeMatrix[number],
  Value extends MazeItem,
  Col extends readonly unknown[],
> = {
  [C in keyof T]: C extends `${Col["length"]}` ? Value : T[C];
};

type Win<T extends MazeMatrix> = {
  [Row in keyof T]: WinRow<T[Row]>;
};

type WinRow<T extends MazeMatrix[number]> = {
  [Col in keyof T]: DELICIOUS_COOKIES;
};

type Move<T extends MazeMatrix, Direction extends Directions> = FindSanta<T> extends [
    infer SantaRow extends readonly unknown[],
    infer SantaCol extends readonly unknown[],
  ]
  ? Next<SantaRow, SantaCol, Direction> extends [
      infer NextRow extends readonly unknown[],
      infer NextCol extends readonly unknown[],
    ]
    ? InBounds<T, NextRow, NextCol> extends false
      ? Win<T>
      : CanMove<T, NextRow, NextCol> extends true
        ? SetAt<SetAt<T, Alley, SantaRow, SantaCol>, Santa, NextRow, NextCol>
        : T
    : Win<T>
  : never;
