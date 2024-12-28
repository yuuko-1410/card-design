import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { getNumberLabel } from "../../../utils/page";
import useLayoutStore from "../../../store/layout";
import { useSize } from "ahooks";
import { render } from "../../../utils/render";

interface OptionTopicProps {
  id: string;
  title?: string;
  no: number;
  startQno: number;
  score?: number;
  number?: number;
  height?: number;
}
const OptionTopic = ({
  id,
  title,
  no,
  score = 0,
  startQno,
  number = 2,
  height,
}: OptionTopicProps) => {
  const { changeBlockHeight, changeRealBlockHeight } = useLayoutStore();
  const [showImg, setShowImg] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isChangeSize, setIsChangeSize] = useState(false);

  const onClick = () => {
    console.log("点击了");
    setShowImg(!showImg);
  };
  const label =
    "请考生用2B铅笔将所选题目对应题号涂黑，答题区域只允许选择一题，多涂、错涂漏涂均不给分，如果多做，则按所选做的前一题计分。";

  const size = useSize(document.getElementById(`#block-${id}`));
  // console.log(`id: ${id}`, size);

  useEffect(() => {
    if (size?.height) {
      changeRealBlockHeight(id, size?.height ?? 0);
      // console.log(`变化了`, size?.height);
      if (!isChangeSize) {
        // render();
      }
    }
  }, [size?.height]);
  return (
    <div id={`#block-${id}`}>
      <div>
        {title == null ? (
          <></>
        ) : (
          <div className="my-1 flex flex-col ">
            <label>
              {getNumberLabel(no)}、{title}({score}分)
            </label>
            <div className="text-sm">({label})</div>
          </div>
        )}
      </div>
      <Resizable
        defaultSize={{ width: "100%", height: `${height}px` }}
        size={{ height }}
        enable={{ bottom: true }}
        onResizeStart={(e) => {
          setIsChangeSize(true);
          // @ts-expect-error 此处一切正常
          setStartY(e.clientY ?? 0);
        }}
        onResizeStop={(e) => {
          setIsChangeSize(false);
          // @ts-expect-error 此处一切正常
          changeBlockHeight(id, height + e.clientY - startY);
          render();
        }}
        className="border border-black font-mono p-4 flex flex-col gap-4"
      >
        <div className="flex items-center h-6 gap-2 text-xs" onClick={onClick}>
          <a>我选的题号</a>
          {Array.from({ length: number }).map((_, i) => (
            <div
              key={i}
              className="w-[24px] h-[12px] border border-black flex justify-center items-center"
            >
              {startQno + i}
            </div>
          ))}
        </div>
        {showImg ? (
          <Resizable defaultSize={{ width: "80px", height: "80px" }}>
            <img
              src="http://42.193.105.175:9000/education/exam%2FexamInfoId-144%2Ftrim%2Fexam_number-0000000002%2F6-10.jpg"
              width="100%"
              height="100%"
            />
          </Resizable>
        ) : (
          <></>
        )}
      </Resizable>
    </div>
  );
};

export default OptionTopic;
