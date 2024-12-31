import { getNumberLabel, arrGroups } from "../../../utils/page";
import SingleBoxOption from "./components/option";
import { useSize } from "ahooks";
import { useEffect } from "react";
import { Segment } from "../../../types/page";
import { usePageStore } from "../../../store/page";

const SingleBox = ({ id, title, no, score, blocks }: Segment) => {
  const { changeSegmentHeight, syncSegmentHeight, columns } = usePageStore();
  // 定义 chunk 方法
  // const groups = numberGroups(startQno, number);
  const groups = arrGroups(blocks, 5);

  const size = useSize(document.getElementById(`#block-${id}`));
  // console.log(`id: ${id}`, size);

  useEffect(() => {
    if (size?.height) {
      changeSegmentHeight(id, size?.height ?? 0);
      syncSegmentHeight();
      console.log(columns);
      // console.log(`变化了`, size?.height);
      // render();
    }
  }, [size?.height]);
  return (
    <div id={`#block-${id}`}>
      {title == null ? (
        <></>
      ) : (
        <div className="h-8 flex items-center">
          <label>
            {getNumberLabel(no)}、{title}({score}分)
          </label>
        </div>
      )}
      <div className="w-full flex flex-wrap gap-x-10 gap-y-4 after:m-auto">
        {groups.map((group, i) => (
          <div className="" key={i}>
            {group.map((block, j) => (
              <SingleBoxOption
                qno={block.qno}
                key={j}
                optionNum={block.option_num}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleBox;
