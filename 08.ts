type RemoveNaughtyChildren<T> = {
  [K in keyof T as K extends `naughty_${string}` ? never : K]: T[K];
};
