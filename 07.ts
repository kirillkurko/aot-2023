type AppendGood<T extends Record<string, unknown>> = {
  [K in keyof T & string as `good_${K}`]: T[K];
};
