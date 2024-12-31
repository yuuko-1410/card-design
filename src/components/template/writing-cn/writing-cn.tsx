import { useEffect } from "react";
import { usePageStore } from "../../../store/page";
import { getNumberLabel } from "../../../utils/page";
import { useSize } from "ahooks";
import { Segment } from "../../../types/page";

/**
 * 语文作文
 * @param param0
 * @returns
 */
const WritingCN = ({
  id,
  title,
  no,
  score,
  prev_nums,
  rows,
  is_paging,
}: Segment) => {
  const { changeSegmentHeight, config } = usePageStore();
  const { column_num } = config;

  const size = useSize(document.getElementById(`#writing-cn-block-${id}`));

  useEffect(() => {
    if (size?.height) {
      changeSegmentHeight(id, size?.height ?? 0);
      console.log("作文高度", size?.height);
    }
  }, [size?.height]);
  return (
    <div className="flex flex-col" id={`#writing-cn-block-${id}`}>
      <div>
        {is_paging ? (
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
            length: rows,
          }).map((_, i) => (
            <div
              className="w-full mb-1 flex after:border-r after:border-black"
              key={i}
            >
              {Array.from({ length: getRowNum(column_num) }).map((_, j) => (
                <div
                  className="w-[30px] h-[30px] border-l border-y border-black flex justify-end items-end"
                  key={j}
                >
                  {(getRowNum(column_num) * i + j + 1 + prev_nums) % 100 ==
                  0 ? (
                    <a className="text-[8px] relative -bottom-[6px]">
                      {getRowNum(column_num) * i + prev_nums + j + 1}
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
