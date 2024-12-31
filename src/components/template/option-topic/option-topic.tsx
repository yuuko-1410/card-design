import { Resizable } from "re-resizable";
import { useEffect, useRef } from "react";
import { useSize } from "ahooks";
import { getNumberLabel } from "../../../utils/page";
import { usePageStore } from "../../../store/page";
import { render } from "../../../utils/processor";
import { Segment } from "../../../types/page";

const OptionTopic = ({
  id,
  title,
  desc,
  no,
  score,
  blocks,
  height: initialHeight,
}: Segment) => {
  const { changeSegmentHeight } = usePageStore();
  const heightRef = useRef<number | null>(null);
  const resizingRef = useRef(false);
  const renderTimeoutRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 使用 useSize 获取实际高度
  const titleSize = useSize(titleRef.current);
  const contentSize = useSize(contentRef.current);

  // 使用 ref 保存的高度或初始高度
  const currentHeight = heightRef.current || initialHeight || 200;

  useEffect(() => {
    if (!titleSize?.height || !contentSize?.height || resizingRef.current) return;
    
    // 使用实际测量的高度
    const actual_height = titleSize.height + contentSize.height;
    if (!heightRef.current) {
      changeSegmentHeight(id, actual_height);
      render();
    }
  }, [titleSize?.height, contentSize?.height, id]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        window.clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div id={`#option-box-block-${id}`}>
      <div ref={titleRef}>
        {title == null ? (
          <></>
        ) : (
          <div className="my-1 flex flex-col">
            <label>
              {getNumberLabel(no)}、{title}({score}分)
            </label>
            <div className="text-sm">({desc})</div>
          </div>
        )}
      </div>
      <Resizable
        defaultSize={{ width: "100%", height: `${currentHeight}px` }}
        enable={{ bottom: true }}
        onResizeStart={() => {
          resizingRef.current = true;
        }}
        onResize={() => {
          if (renderTimeoutRef.current) {
            window.clearTimeout(renderTimeoutRef.current);
          }
        }}
        onResizeStop={(_e, _direction, ref) => {
          resizingRef.current = false;
          const newHeight = ref.offsetHeight;
          heightRef.current = newHeight;
          changeSegmentHeight(id, newHeight + (titleSize?.height || 0));
          
          renderTimeoutRef.current = window.setTimeout(() => {
            render();
            renderTimeoutRef.current = null;
          }, 100);
        }}
        className="border border-black font-mono p-4 flex flex-col gap-4"
      >
        <div ref={contentRef} className="flex items-center h-6 gap-2 text-xs">
          <a>我选的题号</a>
          {blocks.map((block, i) => (
            <div
              key={i}
              className="w-[26px] h-[14px] border border-black flex justify-center items-center"
            >
              {block.qno}
            </div>
          ))}
        </div>
      </Resizable>
    </div>
  );
};

export default OptionTopic;
