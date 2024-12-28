import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { useSize } from "ahooks";
import { getNumberLabel } from "../../../utils/page";
import useLayoutStore from "../../../store/layout";
import { combinedPrevWithId, render } from "../../../utils/render";
interface SingleBoxProps {
  id: string;
  title?: string;
  no: number;
  startQno: number;
  number: number;
  scores?: number[];
  heights?: number[];
  pageNum?: number;
  columNum?: number;
}

const AnswerTopic = ({
  id,
  title,
  no,
  startQno,
  number,
  scores = [],
  heights = [],
}: SingleBoxProps) => {
  const { changeSubBlockHeight, changeRealBlockHeight } = useLayoutStore();
  const [showImg, setShowImg] = useState(false);
  const [startY, setStartY] = useState(0);
  const [shouldCombined, setShouldCombined] = useState(false);
  const [isChangeSize, setIsChangeSize] = useState(false);
  const onClick = () => {
    console.log("点击了");
    setShowImg(!showImg);
  };
  const size = useSize(document.getElementById(`#answer-topic-block-${id}`));
  // 获取上方元素
  const block = document.getElementById(`#answer-topic-block-${id}`);
  const prev = block?.previousElementSibling;
  const prevId = prev?.id;

  useEffect(() => {
    if (!size?.height) return;
    changeRealBlockHeight(id, size?.height ?? 0);
    // console.log(`变化了`, size?.height);
    if (!isChangeSize) {
      // render();
    }
    
    if (prevId?.includes("#answer-topic") && title == undefined) {
      combinedPrevWithId(id);
      setShouldCombined(true);
    } else {
      setShouldCombined(false);
    }
  }, [size?.height, prevId]);
  return (
    <div id={`#answer-topic-block-${id}`}>
      {title == null ? (
        <></>
      ) : (
        <div className="h-8 flex items-center">
          <label>
            {getNumberLabel(no)}、{title}({scores.reduce((a, b) => a + b, 0)}分)
          </label>
        </div>
      )}
      <div className={`flex flex-col last:border-black last:border-b`}>
        {Array.from({ length: number }).map((_, i) => (
          <Resizable
            key={i}
            defaultSize={{ width: "100%", height: `${heights[i] ?? 200}px` }}
            onResizeStop={(e) => {
              setIsChangeSize(false);
              // @ts-expect-error 此处一切正常
              changeSubBlockHeight(id, i, heights[i] + e.clientY - startY);
              render();
            }}
            onResizeStart={(e) => {
              setIsChangeSize(true);
              // @ts-expect-error 此处一切正常
              setStartY(e.clientY ?? 0);
            }}
            enable={{ bottom: true }}
            size={{ height: heights[i] ?? 200 }}
            className={`border-t border-x border-black font-mono p-4 flex flex-col gap-4`}
            // className={`${
            //   showTopBorder && i == 0 ? "" : "first:border-t"
            // } border-x border-b border-black font-mono p-4 flex flex-col gap-4`}
          >
            <label onClick={onClick}>{startQno + i}.</label>

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
        ))}
      </div>
    </div>
  );
};

export default AnswerTopic;
