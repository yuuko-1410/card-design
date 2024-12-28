import { getNumberLabel, numberGroups } from "../../../utils/page";
import SingleBoxOption from "./components/option";
import useLayoutStore from "../../../store/layout";
import { useSize } from "ahooks";
import { useEffect } from "react";
import { render } from "../../../utils/render";

interface SingleBoxProps {
  id: string;
  title?: string;
  no: number;
  type?: "single" | "multiple" | "judge" | string;
  startQno: number;
  number: number;
  scores?: number[];
  optionsNums?: number[];
}

const SingleBox = ({
  id,
  title,
  no,
  type = "single",
  startQno,
  number,
  scores = [],
  optionsNums,
}: SingleBoxProps) => {
  const { changeRealBlockHeight } = useLayoutStore();
  // 定义 chunk 方法
  const groups = numberGroups(startQno, number);

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
      <div className="w-full flex flex-wrap gap-x-10 gap-y-4 after:m-auto">
        {groups.map((group, i) => (
          <div className="" key={i}>
            {group.map((qno, j) => (
              <SingleBoxOption
                qno={qno}
                key={j}
                optionNum={
                  optionsNums == undefined ? 4 : optionsNums[5 * i + j - 1] ?? 4
                }
                type={type ?? "single"}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleBox;
