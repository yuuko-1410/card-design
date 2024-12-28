import useLayoutStore from "../store/layout";
import { LayoutElement, LayoutPage } from "../types/layout";
import { deepCopy, guid } from "./common";
import { writingConversion } from "./conversion";
// 默认最大高度
const MAX_HEIGHT = 1108;

/**
 * 此处执行初始化操作，用于获取答题卡Block等基本操作
 */
const initRender = () => {
  const { setPages } = useLayoutStore.getState();
  // 先清空页面的内容再重新渲染
  setPages(genEmptyPage());
  setPages(getPageWithElements(elements));
  // 执行渲染函数
  render();
  setTimeout(() => {
    render();
  }, 500)
}

const render = () => {
  const { pages, config, setPages } = useLayoutStore.getState();
  const { column } = config;
  // console.log("render", pages)
  const blocks: LayoutElement[] = [];
  pages.forEach(page => {
    page.colums.forEach(colum => {
      colum.elements.forEach(element => {
        // height += element.realHeight || 0;
        blocks.push(element);
      })
    })
  })
  // combinedElements(blocks);
  console.log("处理之前->", blocks);
  const newBlocks = writingConversion(blocks);
  blocks.length = 0;
  blocks.push(...newBlocks);

  const arr: LayoutPage[] = genEmptyPage();

  let pageIndex = 0;
  let columIndex = 0;
  let currentHeight = 0;


  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const realHeight = getPaperInfoHeight(pageIndex, columIndex);
    if (currentHeight + realHeight + blocks[i].realHeight > MAX_HEIGHT) {
      // 单个题块儿大于最大高度
      // const remainingH = MAX_HEIGHT - currentHeight - realHeight;
      // // console.log("页面的剩余高度", remainingH, block.type);
      // if (block.type == "writing-cn") {
      //   // console.log("开始处理语文作文");
      //   console.log(">", blocks, i);
      //   console.log("<",writingConversion(blocks, i, remainingH))
      //   // const rn = getRowNum(column);
      //   // const titleH = (block.startWords != 0 ? 36 : 0);
      //   // let finalNum = 0;
      //   // let finalLine = 0;
      //   // for (let j = 1; j < 30; j++) {
      //   //   const h = 30 * j + 4 * (j + 1) + 2 + titleH;
      //   //   if (h > remainingH) {
      //   //     finalNum = rn * (j - 1)
      //   //     finalLine = j - 1;
      //   //     break;
      //   //   }
      //   //   finalNum = rn * (j - 1)
      //   //   finalLine = j - 1;
      //   //   console.log(`行数：${j}, 高度：${h}, 格子：${rn * i}`);
      //   // }
      //   // console.log("最终设置", finalNum);
      //   // console.log(block);
      //   // // 设置当前colum的格子数量，并添加剩余的分块儿到下一页
      //   // if (finalLine > 0) {
      //   //   const prevEle = {
      //   //     ...block,
      //   //     height: 30 * finalLine + 4 * (finalLine + 1) + 2,
      //   //     // realHeight: remainingH,
      //   //     realHeight: 30 * finalLine + 4 * (finalLine + 1) + 2 + titleH,
      //   //     maxWordNum: finalNum,
      //   //     actualWordNum: finalNum
      //   //   };
      //   //   const nextEle = {
      //   //     ...block,
      //   //     id: guid(),
      //   //     title: undefined,
      //   //     height: block.realHeight - titleH - prevEle.height,
      //   //     realHeight: block.realHeight - prevEle.realHeight,
      //   //     maxWordNum: block.actualWordNum! - finalNum,
      //   //     actualWordNum: block.actualWordNum! - finalNum,
      //   //     startWords: finalNum,
      //   //   };
      //   //   console.log("finalNum", finalNum);
      //   //   if (block.actualWordNum! - finalNum > 0) {
      //   //     blocks.splice(i, 1, prevEle, nextEle);
      //   //     block = blocks[i];
      //   //   }
      //   // }
      // }
      // // 题块儿拆分
      // if (block.type == "answer-topic") {
      //   const titleHeight = block.realHeight - block.heights!.reduce((a, b) => a + b, 0);
      //   let qnos_height: number = 0;
      //   const prevIndex: number[] = [];
      //   if (block.heights?.length) {
      //     for (let j = 0; j < block.heights?.length; j++) {
      //       if (titleHeight + qnos_height + block.heights[j] + realHeight + currentHeight < MAX_HEIGHT) {
      //         prevIndex.push(j);
      //         qnos_height += block.heights[j];
      //       } else {
      //         break;
      //       }
      //     }
      //   }
      //   // todo:
      //   if (prevIndex.length > 0) {
      //     const prevEle = {
      //       ...block,
      //       height: block.heights!.slice(0, prevIndex.length).reduce((a, b) => a + b, 0),
      //       realHeight: block.heights!.slice(0, prevIndex.length).reduce((a, b) => a + b, 0) + titleHeight,
      //       number: prevIndex.length,
      //       heights: block.heights!.slice(0, prevIndex.length),
      //       scores: block.scores!.slice(0, prevIndex.length),
      //     };
      //     const nextEle = {
      //       ...block,
      //       id: guid(),
      //       title: undefined,
      //       startQno: block.startQno + prevIndex.length,
      //       height: block.heights!.slice(prevIndex.length).reduce((a, b) => a + b, 0),
      //       realHeight: block.heights!.slice(prevIndex.length).reduce((a, b) => a + b, 0),
      //       number: block.number - prevIndex.length,
      //       heights: block.heights!.slice(prevIndex.length),
      //       scores: block.scores!.slice(prevIndex.length),
      //     };
      //     blocks.splice(i, 1, prevEle, nextEle);
      //     block = blocks[i];
      //   }
      // }

      if (columIndex + 1 == Number(column)) {
        pageIndex++;
        columIndex = 0;
      } else {
        columIndex++;
      }
      currentHeight = 0;
    }

    // // 执行添加操作
    currentHeight += block?.realHeight || 0;
    if (arr.length - 1 < pageIndex) {
      arr.push({
        pageNum: pageIndex + 1,
        colums: [{ pageNum: pageIndex + 1, columNum: 1, elements: [] },]
      })
    }
    if (arr[pageIndex].colums.length - 1 < columIndex) {
      arr[pageIndex].colums.push({ pageNum: pageIndex + 1, columNum: columIndex + 1, elements: [] })
    }
    arr[pageIndex].colums[columIndex].elements.push(block);
  }
  setPages(arr);
}
/**
 * 和上一个合并
 * @param id 待合并的block
 */
const combinedPrevWithId = (id: string) => {
  const { pages } = useLayoutStore.getState();
  const blocks: LayoutElement[] = [];
  pages.forEach(page => {
    page.colums.forEach(colum => {
      colum.elements.forEach(e => blocks.push(e))
    })
  });

  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i].colums.length; j++) {
      const eles = deepCopy(pages[i].colums[j].elements);
      const eleIndex = eles.findIndex((x) => x?.id == id);
      if (eleIndex != -1) {
        const prev = eles[eleIndex - 1];
        const current = eles[eleIndex];
        console.log("合并", prev, current);
        if (prev == undefined || current == undefined) return;
        const createEle: LayoutElement = {
          ...prev,
          id: guid(),
          height: (prev.height ?? 0) + (current.height ?? 0),
          heights: (prev.heights ?? []).concat(current.heights!),
          scores: (prev.scores ?? []).concat(current.scores!),
          realHeight: prev.realHeight + (current.realHeight ?? 0),
          number: prev.number + current.number,
          // 作文的情况
          maxLine: (prev.maxLine ?? 0) + (current.maxLine ?? 0),
          maxWordNum: (prev.maxWordNum ?? 0) + (current.maxWordNum ?? 0),
          actualWordNum: (prev.actualWordNum ?? 0) + (current.actualWordNum ?? 0),
          startWords: prev.startWords
        };
        eles[eleIndex - 1] = createEle;
        delete eles[eleIndex];
        pages[i].colums[j].elements = eles;
      }
    }
  }
}


// const combinedColums = (pages: LayoutPage[]) => {
//   // 创建一个新的数组来存储处理后的页面
//   const newPages: LayoutPage[] = deepCopy(pages);
//   for (let i = 0; i < newPages.length; i++) {
//     const page = newPages[i];
//     for (let j = 0; j < page.colums.length; j++) {
//       const colum = page.colums[j];
//       // 创建一个新的数组来存储处理后的元素
//       const newEles: LayoutElement[] = colum.elements.map(ele => ({ ...ele }));
//       const eles = newEles;
//       for (let k = 0; k < eles.length; k++) {
//         let prevEle = newEles[k - 1]; // 使用新的数组索引
//         if (!prevEle) {
//           prevEle = eles[k];
//           continue;
//         }
//         if (prevEle.no !== eles[k].no || eles[k].no === undefined || prevEle.type !== eles[k].type) continue;
//         console.log("这个和上次一样", prevEle, eles[k]);
//         const createEle: LayoutElement = {
//           ...prevEle,
//           id: guid(),
//           height: (prevEle.height ?? 0) + (eles[k].height ?? 0),
//           heights: prevEle.heights ? [...prevEle.heights, ...(eles[k].heights ?? [])] : (eles[k].heights ?? []),
//           scores: prevEle.scores ? [...prevEle.scores, ...(eles[k].scores ?? [])] : (eles[k].scores ?? []),
//           realHeight: prevEle.realHeight + (eles[k].realHeight ?? 0),
//           number: prevEle.number + eles[k].number,
//           // 作文的情况
//           maxLine: (prevEle.maxLine ?? 0) + (eles[k].maxLine ?? 0),
//           maxWordNum: (prevEle.maxWordNum ?? 0) + (eles[k].maxWordNum ?? 0),
//         };
//         // 替换前一个元素，并移除当前元素
//         newEles[k - 1] = createEle;
//         newEles.splice(k, 1);
//         k--; // 因为数组长度减少，所以递减 k
//       }
//       // 更新列的元素数组
//       page.colums[j].elements = newEles;
//     }
//   }
//   return newPages; // 返回新数组
// };

const getPaperInfoHeight = (pageNum: number, columNum: number): number => {
  if (pageNum != 0 || columNum != 0) return 0;
  const { config } = useLayoutStore.getState();
  return config.realHeight;
}

const genEmptyPage = () => {
  return [{
    pageNum: 1,
    colums: [{ pageNum: 1, columNum: 1, elements: [] },]
  }]
}

const getPageWithElements = (ele: LayoutElement[]) => {
  return [{
    pageNum: 1,
    colums: [{ pageNum: 1, columNum: 1, elements: ele },]
  }]
}

const elements = [
  {
    id: guid(),
    type: "single-box",
    no: 1,
    startQno: 1,
    number: 10,
    title: "单选题",
    scores: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    optionsNums: [4, 4, 4, 4, 7, 7, 7, 7, 7],
    optionType: "single"
  },
  {
    id: guid(),
    type: "fill",
    no: 2,
    startQno: 11,
    number: 5,
    title: "填空题",
    scores: [1, 1, 1, 1, 1],
    lineSizes: [3, 10, 10, 3, 3],
  },
  {
    id: guid(),
    type: "answer-topic",
    no: 3,
    startQno: 16,
    number: 3,
    title: "解答题",
    scores: [1, 1, 1],
    heights: [300, 100, 100],
  },
  {
    id: guid(),
    type: "writing-cn",
    no: 4,
    startQno: 18,
    number: 1,
    title: "作文",
    score: 10,
    maxWordNum: 520,
    actualWordNum: 0,
  },
  {
    id: guid(),
    type: "writing-cn",
    no: 4,
    startQno: 800,
    number: 1,
    score: 0,
    maxWordNum: 100,
    actualWordNum: 0,
  },
  {
    id: guid(),
    type: "writing-cn",
    no: 4,
    startQno: 900,
    number: 1,
    score: 0,
    maxWordNum: 20,
    actualWordNum: 0,
  },
  {
    id: guid(),
    type: "writing-en",
    no: 5,
    startQno: 18,
    number: 1,
    title: "写作",
    score: 10,
    maxLine: 6
  },
  {
    id: guid(),
    type: "writing-cn",
    no: 6,
    startQno: 0,
    number: 1,
    score: 10,
    maxWordNum: 20,
    actualWordNum: 0,
  },
  {
    id: guid(),
    type: "writing-cn",
    no: 6,
    startQno: 0,
    number: 1,
    score: 10,
    maxWordNum: 20,
    actualWordNum: 0,
  },
  {
    id: guid(),
    type: "option-box",
    no: 6,
    startQno: 18,
    number: 3,
    title: "选做题",
    score: 10,
    height: 200,
    maxLine: 8
  },
  {
    id: guid(),
    type: "answer-topic",
    no: 7,
    startQno: 22,
    number: 3,
    title: "解答题",
    scores: [1, 1, 1],
    heights: [100, 200, 100],
  },
  {
    id: guid(),
    type: "ban",
    no: 0,
    startQno: 0,
    number: 0,
  }
]

const getRowNum = (colum: number) => {
  switch (colum) {
    case 1:
      return 25;
    case 2:
      return 26;
    case 3:
      return 17;
    default:
      return 0;
  }
};

// const tempPages = [{
//   pageNum: 1,
//   colums: [
//     {
//       pageNum: 1,
//       columNum: 1,
//       elements: [
//         {
//           id: guid(),
//           type: "single-box",
//           no: 1,
//           startQno: 1,
//           number: 10,
//           title: "单选题",
//           scores: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
//           optionsNums: [4, 4, 4, 4, 7, 7, 7, 7, 7],
//           optionType: "single"
//         },
//         {
//           id: guid(),
//           type: "fill",
//           no: 2,
//           startQno: 11,
//           number: 5,
//           title: "填空题",
//           scores: [1, 1, 1, 1, 1],
//           lineSizes: [3, 10, 10, 3, 3],
//         },
//         {
//           id: guid(),
//           type: "answer-topic",
//           no: 3,
//           startQno: 16,
//           number: 2,
//           title: "解答题",
//           scores: [1, 1],
//         },
//       ],
//     },
//     {
//       pageNum: 1,
//       columNum: 2,
//       elements: [
//         {
//           id: guid(),
//           type: "writing-cn",
//           no: 4,
//           startQno: 18,
//           number: 1,
//           title: "作文",
//           score: 10,
//           maxWordNum: 200,
//           actualWordNum: 200,
//         },
//         {
//           id: guid(),
//           type: "writing-en",
//           no: 4,
//           startQno: 18,
//           number: 1,
//           title: "写作",
//           score: 10,
//           maxLine: 6
//         },
//         {
//           id: guid(),
//           type: "option-box",
//           no: 5,
//           startQno: 18,
//           number: 3,
//           title: "选做题",
//           score: 10,
//           height: 200,
//           maxLine: 8
//         },
//         {
//           id: guid(),
//           type: "ban",
//           no: 0,
//           startQno: 0,
//           number: 0,
//         }
//       ]
//     }
//   ]
// },
// {
//   pageNum: 2,
//   colums: []
// }];
export { initRender, render, combinedPrevWithId, getPaperInfoHeight, getRowNum }