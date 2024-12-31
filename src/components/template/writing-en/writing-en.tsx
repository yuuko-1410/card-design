import { getNumberLabel } from "../../../utils/page";
import { useSize } from "ahooks";
import { usePageStore } from "../../../store/page";
import { useEffect } from "react";
import { Segment } from "../../../types/page";

const WritingEN = ({ id, title, no, score, lines }: Segment) => {
  // const { changeRealBlockHeight } = useLayoutStore();
  const { changeSegmentHeight } = usePageStore();
  const size = useSize(document.getElementById(`#block-${id}`));
  // console.log(`id: ${id}`, size);

  useEffect(() => {
    if (size?.height) {
      changeSegmentHeight(id, size?.height ?? 0);
      // changeRealBlockHeight(id, size?.height ?? 0);
      // console.log(`变化了`, size?.height);
      // render();
    }
  }, [size?.height]);
  return (
    <div className="flex flex-col" id={`#block-${id}`}>
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
      <div className="border border-black px-2 pb-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div className="w-full h-8 border-b border-black" key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default WritingEN;
