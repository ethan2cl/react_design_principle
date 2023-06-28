"use strict";
/**
 * vue中 const y = computed(() => x * 2 + 1)
 *
 * 这种自动追踪依赖的技术被称为 “细粒度更新”，也是很多框架实现 “自变量到UI变化” 的底层原理
 *
 * 接下来编程实现，命名参考React API
 */
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("./hooks");
const [count, setCount] = (0, hooks_1.useState)(0);
(0, hooks_1.useEffect)(() => {
    console.log(`count:  ${count()}`); // log 0
});
setCount(2); // log 2
