type PlainValue = string | number | boolean | Function;

type SantaListProtector<T> = {
  readonly [K in keyof T]: T[K] extends PlainValue
    ? T[K]
    : SantaListProtector<T[K]>;
};
