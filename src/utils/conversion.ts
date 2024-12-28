import useLayoutStore from "../store/layout";
import { LayoutElement } from "../types/layout"
import { deepCopy, guid } from "./common";
import { getRowNum } from "./render";
// 默认最大高度
const MAX_HEIGHT = 1108;

const writingConversion = (blocks: LayoutElement[]) => {
  const { config } = useLayoutStore.getState();
  const { column, realHeight } = config;
  // ============首先合并=============
  const arr = deepCopy(blocks);
  for (let i = 0; i < arr.length; i++) {
    if (arr.length > i + 1 && arr[i].no == arr[i + 1].no) {
      arr[i] = {
        ...arr[i],
        maxWordNum: (arr[i].maxWordNum ?? 0) + (arr[i + 1].maxWordNum ?? 0),
        startQno: arr[i].startQno + arr[i].number,
        number: arr[i].number + arr[i + 1].number,
        height: (arr[i].height ?? 0) + (arr[i + 1].height ?? 0),
        heights: [...(arr[i].heights ?? []), ...(arr[i + 1].heights ?? [])],
        score: (arr[i].score ?? 0) + (arr[i + 1].score ?? 0),
        scores: [...(arr[i].scores ?? []), ...(arr[i + 1].scores ?? [])],
        lineSizes: [...(arr[i].lineSizes ?? []), ...(arr[i + 1].lineSizes ?? [])],
        optionsNums: [...(arr[i].optionsNums ?? []), ...(arr[i + 1].optionsNums ?? [])],
        optionType: arr[i].optionType ?? arr[i + 1].optionType,
        maxLine: arr[i].maxLine ?? arr[i + 1].maxLine,
      }
      arr.splice(i + 1, 1);
      i--;
    } else {
      continue;
    }
  }
  console.log("合并结束的：", arr);
  // =============开始拆分==============
  let columnIndex = 0;
  let virtualHeight = 0;
  for (let i = 0; i < arr.length; i++) {
    const topHeight = (columnIndex == 0) ? realHeight : 0;
    if (arr[i].realHeight + virtualHeight + topHeight > MAX_HEIGHT) {
      const remainingH = MAX_HEIGHT - virtualHeight - topHeight;
      console.log(`【colum】当前/剩余: 【${columnIndex}】${virtualHeight}/${remainingH}`);
      // 处理简答题
      if (arr[i].type == "answer-topic") {
        console.log("============>开始处理简答题");

      }

      // 处理语文作文
      if (arr[i].type == "writing-cn") {
        console.log("============>开始处理语文作文");
        if (arr[i].realHeight < remainingH) continue;
        const titleH = (arr[i].startWords != 0 ? 36 : 0);
        const finalNum = getRowNum(column) * Math.floor((remainingH - 6 - titleH)) / 34;

        arr[i] = {
          ...arr[i],
          maxWordNum: Math.floor(finalNum),
          realHeight: remainingH,

        }

        const subNum = (arr[i].actualWordNum ?? 0) - Math.floor(finalNum);
        const maxNum = 32 * getRowNum(column);
        let newColumNum = 0;
        const newElements = [];
        while (subNum - newColumNum > maxNum) {
          newColumNum += maxNum;
          newElements.push({
            ...arr[i],
            id: guid(),
            actualWordNum: 0,
            score: 0,
            title: undefined,
            maxWordNum: maxNum,
            realHeight: MAX_HEIGHT,
            startWords: Math.floor(finalNum + newColumNum),
          });
        }
        console.log("subNum:", subNum, newColumNum);
        if (subNum - newColumNum > 0) {
          newElements.push({
            ...arr[i],
            id: guid(),
            score: 0,
            title: undefined,
            actualWordNum: 0,
            maxWordNum: subNum - newColumNum,
            // realHeight: arr[i].realHeight - ,
            startWords: Math.floor(finalNum + newColumNum),
          });
        }
        arr.splice(i + 1, 0, ...newElements);
        i += newElements.length;
      }

      virtualHeight = 0;
      columnIndex++;
    }

    // 处理添加操作
    virtualHeight += arr[i].realHeight;
  }


  console.log("处理结果->", arr);
  return arr;
}


export {
  writingConversion,
}