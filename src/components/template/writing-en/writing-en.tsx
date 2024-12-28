import { getNumberLabel } from "../../../utils/page";
import { useSize } from "ahooks";
import useLayoutStore from "../../../store/layout";
import { useEffect } from "react";
import { render } from "../../../utils/render";

interface WritingENProps {
  id: string;
  title?: string;
  no: number;
  startQno: number;
  score?: number;
  maxLine?: number;
}
const WritingEN = ({
  id,
  title,
  no,
  startQno,
  score = 0,
  maxLine = 10,
}: WritingENProps) => {
  const { changeRealBlockHeight } = useLayoutStore();
  const size = useSize(document.getElementById(`#block-${id}`));
  // console.log(`id: ${id}`, size);

  useEffect(() => {
    if (size?.height) {
      changeRealBlockHeight(id, size?.height ?? 0);
      // console.log(`变化了`, size?.height);
      // render();
    }
  }, [id, size?.height, changeRealBlockHeight]);
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
        {Array.from({ length: maxLine }).map((_, i) => (
          <div className="w-full h-8 border-b border-black" key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default WritingEN;
