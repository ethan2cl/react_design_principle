import { Effect } from "./types";

// effect调用栈
const effectStack: Effect[] = [];

/**
 * state订阅effect
 * effect订阅依赖的state
 * @param effect
 * @param deps
 */
const subscribe = (effect: Effect, subs: Set<Effect>) => {
  subs.add(effect);
  effect.deps.add(subs);
};

const cleanup = (effect: Effect<Set<Effect>>) => {
  for (const sub of [...effect.deps]) {
    sub.delete(effect);
  }
  effect.deps.clear();
};

export function useState<T = any>(value: T) {
  // 收集订阅的effect, Set不会添加重复的数据
  const subs = new Set<Effect>();

  const getter = () => {
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      subscribe(effect, subs);
    }
    return value;
  };

  const setter = (newValue: T) => {
    value = newValue;
    for (const effect of [...subs]) {
      effect.execute();
    }
    // return value;
  };

  return [getter, setter] as const;
}

export function useEffect(callback: Function) {
  const execute = () => {
    // 重置依赖 ？？
    cleanup(effect);
    // effect入栈，为state的getter提供effect
    effectStack.push(effect);
    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };

  const effect: Effect = {
    execute,
    // 订阅状态
    deps: new Set(),
  };

  execute();
}
