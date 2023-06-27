"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = exports.useState = void 0;
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
        // return value;
    };
    return [getter, setter];
}
exports.useState = useState;
function useEffect(callback) {
    const execute = () => {
        // 重置依赖 ？？
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
