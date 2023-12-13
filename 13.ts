type DayCounter<
  TStart extends number,
  TEnd extends number,
  TRange extends Array<number> = [],
  TAcc extends number = never
> = TRange['length'] extends TEnd
  ? TStart | TAcc | TEnd
  : DayCounter<
    TStart,
    TEnd,
    [...TRange, 1],
    TRange[TStart] extends undefined ? TAcc : TAcc | TRange['length']
  >;
