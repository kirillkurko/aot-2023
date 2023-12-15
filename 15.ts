type BoxToysInternal<
  TToy extends string,
  TCount extends number,
  TAcc extends Array<string> = []
> = TAcc['length'] extends TCount
  ? TAcc
  : BoxToysInternal<TToy, TCount, [TToy, ...TAcc]>;

type BoxToys<TToy extends string, TCount extends number> = TCount extends number
  ? BoxToysInternal<TToy, TCount>
  : never;
