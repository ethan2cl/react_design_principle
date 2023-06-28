"use strict";
/**
 * vue中 const y = computed(() => x * 2 + 1)
 *
 * 这种自动追踪依赖的技术被称为 “细粒度更新”，也是很多框架实现 “自变量到UI变化” 的底层原理
 *
 * 接下来编程实现，命名参考React API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemo = exports.useEffect = exports.useState = void 0;
// effect调用栈
const effectStack = [];
/**
 * state订阅effect
 * effect订阅依赖的state
 * @param effect
 * @param deps
 */
const subscribe = (effect, subs) => {
    subs.add(effect);
    effect.deps.add(subs);
};
const cleanup = (effect) => {
    for (const sub of [...effect.deps]) {
        sub.delete(effect);
    }
    effect.deps.clear();
};
function useState(value) {
    // 收集订阅的effect, Set不会添加重复的数据
    const subs = new Set();
    const getter = () => {
        const effect = effectStack[effectStack.length - 1];
        if (effect) {
            subscribe(effect, subs);
        }
        return value;
    };
    const setter = (newValue) => {
        value = newValue;
        for (const effect of [...subs]) {
            effect.execute();
        }
    };
    return [getter, setter];
}
exports.useState = useState;
function useEffect(callback) {
    const execute = () => {
        // 重置依赖，每次执行 callback 的时候重新收集依赖
        cleanup(effect);
        // effect入栈，为state的getter提供effect
        effectStack.push(effect);
        try {
            callback();
        }
        finally {
            effectStack.pop();
        }
    };
    const effect = {
        execute,
        // 订阅状态
        deps: new Set(),
    };
    execute();
}
exports.useEffect = useEffect;
function useMemo(callback) {
    const [s, set] = useState();
    // 首次执行，初始化value
    useEffect(() => set(callback()));
    return s;
}
exports.useMemo = useMemo;
