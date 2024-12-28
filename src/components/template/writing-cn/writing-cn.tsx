import { useEffect, useState } from "react";
import useLayoutStore from "../../../store/layout";
import { getNumberLabel } from "../../../utils/page";
import { useDebounce, useDebounceEffect, useSize } from "ahooks";
import { combinedPrevWithId, render } from "../../../utils/render";

interface WritingCNProps {
  id: string;
  title?: string;
  no: number;
  startQno: number;
  score?: number;
  startWords?: number;
  maxWordNum?: number;
  actualWordNum?: number;
}
/**
 * 语文作文
 * @param param0
 * @returns
 */
const WritingCN = ({
  id,
  title,
  no,
  score = 0,
  startQno,
  maxWordNum = 200,
  startWords = 0,
}: WritingCNProps) => {
  const { config, changeRealBlockHeight, getBlock, changeBlockInfo } =
    useLayoutStore();
  const { column } = config;
  const [shouldCombined, setShouldCombined] = useState(false);

  const size = useSize(document.getElementById(`#writing-cn-block-${id}`));

  // console.log(`id: ${id}`, size);
  // 获取上方元素
  const block = document.getElementById(`#writing-cn-block-${id}`);
  const prev = block?.previousElementSibling;
  const prevId = prev?.id;
  // useDebounce(() => {
  //   // 合并在同一页的
  //   if (prevId?.includes("#writing-cn-block") && title == undefined) {
  //     combinedPrevWithId(id);
  //     setShouldCombined(true);
  //   } else {
  //     setShouldCombined(false);
  //   }
  // });

  useEffect(() => {
    if (size?.height) {
      changeRealBlockHeight(id, size?.height ?? 0);
      const line = Math.ceil(maxWordNum / getRowNum(column));
      const wordNum = getRowNum(column) * line;
      // console.log(`${startQno}-中文作文变化了`, size?.height);
      // console.log(`行数：${line}，格子：${wordNum}`);
      const block = getBlock(id);
      // console.log(block, id);
      if (block) {
        changeBlockInfo(id, {
          ...block,
          actualWordNum: wordNum,
        });
      }
      // render();

      // 合并在同一页的
      // if (prevId?.includes("#writing-cn-block") && title == undefined) {
      //   combinedPrevWithId(id);
      //   setShouldCombined(true);
      // } else {
      //   setShouldCombined(false);
      // }
    }
  }, [size?.height, id]);
  return (
    <div className="flex flex-col" id={`#writing-cn-block-${id}`}>
      <div>
        {title == null ? (
          <></>
        ) : (
          <div className="h-8 flex items-center">
            <label>
              {getNumberLabel(no)}、{title}({score}分)
            </label>
          </div>
        )}
      </div>
      {/* <p>{`合并：${shouldCombined}`}</p> */}
      <div className="flex justify-center border-[1px] border-black pt-1">
        <div>
          {Array.from({
            length: Math.ceil(maxWordNum / getRowNum(column)),
          }).map((_, i) => (
            <div
              className="w-full mb-1 flex after:border-r after:border-black"
              key={i}
            >
              {Array.from({ length: getRowNum(column) }).map((_, j) => (
                <div
                  className="w-[30px] h-[30px] border-l border-y border-black flex justify-end items-end"
                  key={j}
                >
                  {(startWords + getRowNum(column) * i + j + 1) % 100 == 0 ? (
                    <a className="text-[8px] relative -bottom-[6px]">
                      {getRowNum(column) * i + j + 1 + startWords}
                    </a>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
export default WritingCN;
