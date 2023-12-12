type SantasList<
  TBadList extends ReadonlyArray<unknown>,
  TGoodList extends ReadonlyArray<unknown>
> = [...TBadList, ...TGoodList];
