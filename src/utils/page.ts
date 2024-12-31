
/**
 * 获取页面尺寸
 * @param paperSpec A3, A4
 * @returns [width, height]
 */
const getPageSize = (column: number): [number, number] => {
  switch (column) {
    case 1:
      return [840, 1188];
    default:
      return [1680, 1188];
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
function arrGroups<T>(arr: T[], groupSize: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    groups.push(arr.slice(i, i + groupSize));
  }
  return groups;
}

export {
  getPageSize,
  getNumberLabel,
  numberGroups,
  arrGroups
}