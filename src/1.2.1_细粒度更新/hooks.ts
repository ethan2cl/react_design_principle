/**
 * vue中 const y = computed(() => x * 2 + 1)
 *
 * 这种自动追踪依赖的技术被称为 “细粒度更新”，也是很多框架实现 “自变量到UI变化” 的底层原理
 *
 * 接下来编程实现，命名参考React API
 */

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

export function useState<T = any>(value?: T) {
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
  };

  return [getter, setter] as const;
}

export function useEffect(callback: Function) {
  const execute = () => {
    // 重置依赖，每次执行 callback 的时候重新收集依赖
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

export function useMemo(callback: Function) {
  const [s, set] = useState();
  // 首次执行，初始化value
  useEffect(() => set(callback()));
  return s;
}
