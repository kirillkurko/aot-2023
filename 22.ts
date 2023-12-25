/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type Tuple<
  TSize extends number,
  TItem,
  TResult extends Array<TItem> = []
> = TSize extends TResult["length"]
  ? TResult
  : Tuple<TSize, TItem, [...TResult, TItem]>;

type GridRow = Tuple<3, Reindeer>;
type Grid = Tuple<3, GridRow>;
type Game = Tuple<9, Grid>;

type GridRepeat<TGame extends Array<Grid>> = TGame extends [
    ...infer TFirst extends Grid,
    ...infer TRest extends Array<Grid>
  ]
  ? Reindeer extends TFirst[number][number]
    ? GridRepeat<TRest>
    : true
  : false;

type RowRepeat<TGame extends Array<Grid>> = TGame extends [
    infer TFirst extends Grid,
    infer TSecond extends Grid,
    infer TThird extends Grid,
    ...infer TRest extends Grid[]
  ]
  ? [Reindeer, Reindeer, Reindeer] extends [
        TFirst[0][number] | TSecond[0][number] | TThird[0][number],
        TFirst[1][number] | TSecond[1][number] | TThird[1][number],
        TFirst[2][number] | TSecond[2][number] | TThird[2][number]
    ]
    ? RowRepeat<TRest>
    : true
  : false;

type ColumnRepeat<
  TGame extends Array<Grid>,
  TCount extends Array<1> = []
> = TCount["length"] extends 3
  ? false
  : Reindeer extends TGame[number][number][TCount["length"]]
    ? ColumnRepeat<TGame, [...TCount, 1]>
    : true;

type Validate<TGame extends Game> = true extends [
    GridRepeat<TGame>,
    RowRepeat<TGame>,
    ColumnRepeat<TGame>
  ][number]
  ? false
  : true;
