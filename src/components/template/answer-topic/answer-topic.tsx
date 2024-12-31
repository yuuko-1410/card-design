import { Resizable } from "re-resizable";
import { useLayoutEffect, useState, useRef } from "react";
import { useSize } from "ahooks";
import { getNumberLabel } from "../../../utils/page";
import { usePageStore } from "../../../store/page";
import { render } from "../../../utils/processor";
import { Segment } from "../../../types/page";

const AnswerTopic = ({ id, title, no, score, blocks, is_paging }: Segment) => {
  const { changeSegmentHeight, changeBlockHeight } = usePageStore();
  const [showImg, setShowImg] = useState(false);
  const heightUpdateTimeoutRef = useRef<number | null>(null);

  const size = useSize(document.getElementById(`#answer-topic-block-${id}`));

  useLayoutEffect(() => {
    if (!size?.height) return;

    // 清除之前的timeout
    if (heightUpdateTimeoutRef.current) {
      window.clearTimeout(heightUpdateTimeoutRef.current);
    }

    // 设置新的timeout
    heightUpdateTimeoutRef.current = window.setTimeout(() => {
      changeSegmentHeight(id, size.height!);
      render();
      heightUpdateTimeoutRef.current = null;
    }, 100);

    // 清理函数
    return () => {
      if (heightUpdateTimeoutRef.current) {
        window.clearTimeout(heightUpdateTimeoutRef.current);
      }
    };
  }, [size?.height, id, changeSegmentHeight]);

  return (
    <div id={`#answer-topic-block-${id}`}>
      {is_paging ? (
        <></>
      ) : (
        <div className="h-8 flex items-center">
          <label>
            {getNumberLabel(no)}、{title}({score}分)
          </label>
        </div>
      )}
      <div className={`flex flex-col last:border-black last:border-b`}>
        {blocks.map((block, i) => (
          <Resizable
            key={i}
            defaultSize={{ width: "100%", height: `${block.height ?? 200}px` }}
            onResizeStop={(e, direction, ref) => {
              const newHeight = ref.offsetHeight;
              changeBlockHeight(block.id, newHeight);
              
              // 使用 setTimeout 来延迟渲染
              setTimeout(() => {
                render();
              }, 0);
            }}
            enable={{ bottom: true }}
            size={{ height: block.height ?? 200 }}
            className={`border-t border-x border-black font-mono p-4 flex flex-col gap-4`}
          >
            <label onClick={() => setShowImg(!showImg)}>{block.qno}.</label>
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
