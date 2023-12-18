type Count<
  TList extends Array<string>,
  TItem extends string,
  TAcc extends Array<TItem> = []
> = TList extends [infer First, ...infer Rest extends Array<string>]
  ? Count<Rest, TItem, First extends TItem ? [...TAcc, TItem] : TAcc>
  : TAcc['length'];
