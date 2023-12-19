type Gift = '🛹' | '🚲' | '🛴' | '🏄';

interface NextThingMap {
  ['🛹']: '🚲';
  ['🚲']: '🛴';
  ['🛴']: '🏄';
  ['🏄']: '🛹';
}

type BuildArray<
  TLength extends number,
  TItem extends unknown,
  TAcc extends Array<unknown> = []
> = TAcc['length'] extends TLength
  ? TAcc
  : BuildArray<TLength, TItem, [...TAcc, TItem]>;

type Rebuild<
  TList extends Array<number>,
  TGifts extends Array<Gift> = ['🛹'],
  TResult extends Array<unknown> = [],
  TCounter extends Array<number> = []
> = TCounter['length'] extends TList['length']
  ? TResult
  : Rebuild<
    TList,
    [...TGifts, NextThingMap[TGifts[TCounter['length']]]],
    [
      ...TResult,
      ...BuildArray<TList[TCounter['length']], TGifts[TCounter['length']]>
    ], [...TCounter, 0]
  >;
