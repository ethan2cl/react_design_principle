export type Effect<T = any> = {
  execute: () => void;
  deps: Set<T>;
};
