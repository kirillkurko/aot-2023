type Split<
  TString extends string,
  TDelimiter extends string
> = string extends TString
  ? Array<string>
  : TString extends ''
    ? []
    : TString extends `${infer T}${TDelimiter}${infer U}`
      ? [T, ...Split<U, TDelimiter>]
      : [TString];

type DecipherNaughtyList<TList extends string> = Split<TList, '/'>[number];
