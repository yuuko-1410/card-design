/**
 * 获取页面尺寸
 * @param paperSpec A3, A4
 * @returns [width, height]
 */
const getPageSize = (paperSpec: string): [number, number] => {
    switch (paperSpec) {
        case "A3":
            return [1680, 1188];
        case "A4":
            return [840, 1188];
        default:
            return [0, 0]
    }
};
const labels = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"];
const getNumberLabel = (num: number) => {
    if (num > labels.length || num < 1) {
        return "";
    }
    return labels[num - 1];
}
const numberGroups = (startNo: number, number: number): number[][] => {
    const groups = [];
    for (let i = 0; i < number; i += 5) {
        const group = [];
        for (let j = 0; j < 5; j++) {
            if (i + j < number) {
                group.push(startNo + i + j);
            }
        }
        groups.push(group);
    }
    return groups;
}

export {
    getPageSize,
    getNumberLabel,
    numberGroups
}