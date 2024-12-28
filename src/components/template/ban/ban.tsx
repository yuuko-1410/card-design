import { useEffect, useState } from "react";
import useLayoutStore from "../../../store/layout";
import { Resizable } from "re-resizable";
import { useSize } from "ahooks";
import { render } from "../../../utils/render";

interface BanProps {
  id: string;
  height?: number;
}
/**
 * 非作答区域
 * @param param0 占用空间高度值px
 * @returns
 */
const Ban = ({ height = 200, id }: BanProps) => {
  const { config, changeBlockHeight, changeRealBlockHeight } = useLayoutStore();
  const { isRed } = config;
  const [startClientY, setStartClientY] = useState(0);
  const [isChangeSize, setIsChangeSize] = useState(false);

  const size = useSize(document.getElementById(`#block-${id}`));
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
      <Resizable
        size={{ height: height }}
        // 上下边距，故减去16px
        style={{
          height: height,
        }}
        enable={{ bottom: true }}
        onResizeStart={(e) => {
          // @ts-expect-error 此处一切正常
          setStartClientY(e.clientY ?? 0);
          setIsChangeSize(true);
        }}
        onResizeStop={(e) => {
          setIsChangeSize(false);
          // @ts-expect-error 此处一切正常
          changeBlockHeight(id, height + e.clientY - startClientY);
          render();
        }}
        className={`border ${
          isRed
            ? "border-[#ff0000] text-[#ff0000] ban-bg-red"
            : "border-black ban-bg-black"
        } flex justify-center items-center text-2xl`}
      >
        <div className="bg-white">请勿在此区域作答</div>
      </Resizable>
    </div>
  );
};
export default Ban;
