import blocks from "../assets/blocks.json";
import { usePageStore } from "../store/page";
import { SegmentType } from "../types/page";
import { guid } from "../utils/common";

const initPageData = () => {
  const { setColumns } = usePageStore.getState();
  setColumns([{
    id: guid(),
    free_height: 0,
    use_height: 0,
    segments: blocks.map(x => ({
      ...x,
      id: guid(),
      type: x.type as SegmentType,
      blocks: x.blocks.map(y => ({
        ...y,
        id: guid()
      }))
    }))
  }]);
}

export {
  initPageData
}