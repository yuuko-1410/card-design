function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function deepCopy<T>(obj: T): T {
    // 检查是否为 null 或 undefined，如果是，则直接返回
    if (obj === null || obj === undefined) {
        return obj;
    }
    // 检查是否为对象或数组
    if (typeof obj !== 'object') {
        return obj;
    }
    // 创建一个新的对象或数组，取决于原始对象的类型
    const copy: T = Array.isArray(obj) ? ([] as unknown as T) : ({ ...obj });
    // 遍历对象的每个属性
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // 递归复制每个属性的值
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}
export {
    guid, deepCopy
}