type Santa = '🎅🏼';

type FindSantaColumn<
  TForest extends Array<string>,
  TIndex extends Array<number> = []
> = TForest extends [infer T, ...infer Rest extends Array<string>]
  ? T extends Santa
    ? TIndex['length']
    : FindSantaColumn<Rest, [0, ...TIndex]>
  : never;

type FindSanta<
  TForest extends Array<Array<string>>,
  TRowIndex extends Array<number> = []
> = FindSantaColumn<TForest[TRowIndex['length']]> extends never
  ? FindSanta<TForest, [0, ...TRowIndex]>
  : [TRowIndex['length'], FindSantaColumn<TForest[TRowIndex['length']]>];
