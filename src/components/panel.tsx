import { useEffect, useRef } from "react";
// import useLayoutStore from "../store/layout";
import { usePageStore } from "../store/page.ts";
import { getPageSize, arrGroups } from "../utils/page";
import { useSize } from "ahooks";
import { EventEnum, EventType } from "../types/event";
import { EventEmitter } from "ahooks/lib/useEventEmitter";
import PageLayout from "../layout/page-layout";
import * as htmlToImage from "html-to-image";
import { initPageData } from "../render/index.ts";

export default function Panel({ bus }: { bus: EventEmitter<EventType> }) {
  // const { config, pages } = useLayoutStore();
  const { config, columns } = usePageStore();
  const { column_num } = config;
  const [width, height] = getPageSize(column_num);
  const sizeRef = useRef(null);
  const size = useSize(sizeRef);
  const pages = arrGroups(columns, column_num);

  useEffect(() => {
    initPageData();
    // initRender();
  }, []);

  bus.useSubscription((type) => {
    if (type.type === EventEnum.DOWNLOAD_PDF) {
      handleDownloadPdf();
    }
  });
  const handleDownloadPdf = () => {
    const content = document.getElementsByClassName("page-content");
    const baseUrls: string[] = [];
    Array.from(content).forEach(async (x) => {
      // @ts-expect-error 忽略类型报错
      const res = await htmlToImage.toPng(x);
      baseUrls.push(res);
      console.log("导出图片: ", res);
    });
    console.log("导出图片: ", baseUrls);
  };
  return (
    <div
      className="p-16 overflow-auto space-y-4"
      ref={sizeRef}
      style={{
        display: (size?.width ?? 0) > width ? "flex" : "block",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {pages.map((columns, i) => (
        <div
          className="page-content paper-card-shadow bg-white"
          style={{ width, height }}
          key={i}
        >
          <PageLayout colums={columns} />
        </div>
      ))}
    </div>
  );
}
