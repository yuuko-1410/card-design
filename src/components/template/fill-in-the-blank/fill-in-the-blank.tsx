import { getNumberLabel } from "../../../utils/page";
import { useSize } from "ahooks";
import useLayoutStore from "../../../store/layout";
import { useEffect } from "react";
import { render } from "../../../utils/render";

interface FillInTheBlankProps {
  id: string;
  title?: string;
  no: number;
  startQno: number;
  number: number;
  scores?: number[];
  lineSizes?: number[];
}

const FillInTheBlank = ({
  id,
  title,
  no,
  startQno,
  number,
  scores = [],
  lineSizes = [],
}: FillInTheBlankProps) => {
  const {changeRealBlockHeight} = useLayoutStore();

  const size = useSize(document.getElementById(`#block-${id}`));
  useEffect(() => {
    if (size?.height) {
      changeRealBlockHeight(id, size?.height ?? 0);
      // console.log(`变化了`, size?.height);
      // render();

    }
  }, [id, size?.height, changeRealBlockHeight]);
  return (
    <div id={`#block-${id}`}>
      {title == null ? (
        <></>
      ) : (
        <div className="h-8 flex items-center">
          <label>
            {getNumberLabel(no)}、{title}({scores.reduce((a, b) => a + b, 0)}分)
          </label>
        </div>
      )}
      <div className="w-full border border-black p-4 font-mono flex flex-wrap gap-4">
        {Array.from({ length: number }).map((_, index) => (
          <label key={index}>
            {`${startQno + index}`.padStart(2, "0")}.{" "}
            {"____".repeat(lineSizes[index] ?? 4)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlank;
