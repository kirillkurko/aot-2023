type Santa = '🎅🏼';

type FindSanta<
  TForest extends Array<string>,
  TIndex extends Array<number> = []
> = TForest extends [infer T, ...infer Rest extends Array<string>]
  ? T extends Santa
    ? TIndex['length']
    : FindSanta<Rest, [0, ...TIndex]>
  : never;
