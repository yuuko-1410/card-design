import { create } from "zustand";
import { Block, Column, Config, Page, Segment } from "../types/page";
import { guid } from "../utils/common";

interface PageStoreAction {
  // 基本信息设置
  setTitle: (title: string) => void;
  changeHeaderHeight: (height: number) => void;
  changeConfig: (config: Config) => void;
  setColumns: (columns: Column[]) => void;
  getSegmentById: (id: string) => Segment | undefined;
  getBlockById: (id: string) => Block | undefined;
  changeSegmentHeight: (id: string, height: number) => void;
  changeBlockHeight: (id: string, height: number) => void;
  syncSegmentHeight: () => void;
}

const usePageStore = create<Page & PageStoreAction>((set, get) => ({
  id: guid(),
  title: "未命名",
  header_height: 0,
  page_height: 1108,
  config: {
    is_red: true,
    is_bar_code: false,
    is_ab: true,
    number_digits: 10,
    column_num: 1,
    precautions: [
      "1. 答题前请将姓名、班级、考场、座号和准考证号填写清楚。",
      "2. 选择题必须使用2B铅笔填涂，非选择题必须使用黑色字迹的签字笔填写。",
      "3. 必须在题号对应的答题区域内作答，超出答题区域书写无效。",
      "4. 保持答卷清洁完整，不要折叠、不要弄破、弄皱，不准使用涂改液、刮纸刀。"
    ]
  },
  columns: [],
  //==================
  setTitle(title) {
    set({ title });
  },
  changeHeaderHeight(height) {
    set({ header_height: height });
  },
  changeConfig(config) {
    set({ config });
  },
  setColumns(columns) {
    set({ columns });
  },
  getSegmentById(id) {
    let segment: Segment | undefined;
    get().columns.forEach(x => {
      x.segments.forEach(y => {
        if (y.id == id) {
          segment = y;
          return;
        }
      })
    });
    return segment;
  },
  getBlockById(id) {
    let block: Block | undefined;
    get().columns.forEach(x => {
      x.segments.forEach(y => {
        y.blocks.forEach(z => {
          if (z.id == id) {
            block = z;
            return;
          }
        })
      })
    });
    return block;
  },
  changeSegmentHeight(id, height) {
    set((state) => ({
      ...state,
      columns: state.columns.map(x => ({
        ...x,
        segments: x.segments.map(y => (
          y.id === id ? { ...y, height: height } : y
        ))
      }))
    }))
  },
  changeBlockHeight(id, height) {
    set((state) => ({
      ...state,
      columns: state.columns.map(x => ({
        ...x,
        segments: x.segments.map(y => ({
          ...y,
          blocks: y.blocks.map(z => ({
            ...z,
            ...(z.id === id ? { height } : {})
          }))
        })),
      }))
    }))
  },
  syncSegmentHeight() {
    set((state) => ({
      ...state,
      columns: state.columns.map(x => ({
        ...x,
        use_height: x.segments.map(a => a.height).reduce((a, b) => {
          return a + b
        }, 0),
        free_height: state.page_height - x.use_height,
      }))
    }))
  },

}));


export {
  usePageStore
}