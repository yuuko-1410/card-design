import { getNumberLabel } from "../../../utils/page";
import { useSize } from "ahooks";
import { usePageStore } from "../../../store/page";
import { useEffect } from "react";
import { Segment } from "../../../types/page";

const FillInTheBlank = ({ id, title, no, score, blocks }: Segment) => {
  const { changeSegmentHeight } = usePageStore();
  const size = useSize(document.getElementById(`#block-${id}`));
  useEffect(() => {
    if (size?.height) {
      changeSegmentHeight(id, size?.height ?? 0);
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
      <div className="w-full border border-black p-4 font-mono flex flex-wrap gap-4">
        {blocks.map((block, index) => (
          <label key={index}>
            {`${block.qno}`.padStart(2, "0")}. {"____".repeat(block.lines ?? 4)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlank;
