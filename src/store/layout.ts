import { create } from "zustand";
import { LayoutConfig, LayoutElement, LayoutPage, LayoutStore } from "../types/layout";
interface LayoutStoreAction {
  changePageInfo: (config: LayoutConfig) => void;
  clearPages: () => void;
  setPages: (pages: LayoutPage[]) => void;
  changeSubBlockHeight: (id: string, index: number, height: number) => void;
  changeBlockHeight: (id: string, height: number) => void;
  changeRealBlockHeight: (id: string, realHeight: number) => void;
  changeBlockInfo: (id: string, ele: LayoutElement) => void;
  getBlock: (id: string) => LayoutElement | undefined;
}

const useLayoutStore = create<LayoutStore & LayoutStoreAction>((set, get) => ({
  config: {
    title: "未命名",
    paperSpec: "A4",
    column: 1,
    precautions: [
      "1. 答题前请将姓名、班级、考场、座号和准考证号填写清楚。",
      "2. 选择题必须使用2B铅笔填涂，非选择题必须使用黑色字迹的签字笔填写。",
      "3. 必须在题号对应的答题区域内作答，超出答题区域书写无效。",
      "4. 保持答卷清洁完整，不要折叠、不要弄破、弄皱，不准使用涂改液、刮纸刀。"
    ],
    isIdentityCode: false,
    isMutalVersion: true,
    isRed: false,
    numberColNum: 10,
    realHeight: 0,
    maxWordNum: 0,
    startWords: 0,
    actualWordNum: 0,
    maxLine: 0,
  },
  pages: [],
  // action
  changePageInfo: (_config: LayoutConfig) => set(() => ({ config: _config })),
  clearPages: () => set(() => ({ pages: [] })),
  setPages: (_pages: LayoutPage[]) => set(() => ({ pages: _pages })),
  // 修改子块高度
  changeSubBlockHeight: (id: string, index: number, height: number) => {
    set((state) => ({
      pages: state.pages.map((x) => {
        return {
          ...x,
          colums: x.colums.map((y) => {
            return {
              ...y,
              elements: y.elements.map((z) => {
                return {
                  ...z,
                  ...(z.id === id
                    ? {
                      heights: z.heights?.map((_x, _i) =>
                        _i == index ? height : _x
                      ),
                    }
                    : {}),
                };
              }),
            };
          }),
        };
      })
    }))
  },
  // 修改块高度
  changeBlockHeight: (id: string, height: number) => {
    set((state) => ({
      pages: state.pages.map((x) => {
        return {
          ...x,
          colums: x.colums.map((y) => {
            return {
              ...y,
              elements: y.elements.map((z) => {
                return {
                  ...z,
                  ...(z.id === id ? { height } : {}),
                };
              }),
            };
          }),
        };
      })
    }))
  },
  // 设置block真实高度
  changeRealBlockHeight: (id: string, realHeight: number) => {
    set((state) => ({
      pages: state.pages.map((x) => {
        return {
          ...x,
          colums: x.colums.map((y) => {
            return {
              ...y,
              elements: y.elements.map((z) => {
                return {
                  ...z,
                  ...(z.id === id ? { realHeight } : {}),
                };
              }),
            };
          }),
        };
      })
    }))
  },
  // 修改Block信息
  changeBlockInfo: (id: string, ele: LayoutElement) =>
    set((state) => ({
      pages: state.pages.map((x) => {
        return {
          ...x,
          colums: x.colums.map((y) => {
            return {
              ...y,
              elements: y.elements.map((e) => e.id == id ? ele : e),
            };
          }),
        };
      })
    })),
  // 拿到block
  getBlock: (id: string) => {
    let res: undefined|LayoutElement
    get().pages.forEach(x => {
      x.colums.forEach(y => {
        y.elements.forEach(e => {
          if (e.id == id) {
            res = e
            return;
          }
        })
      });
    });
    return res;
  }

}));


export default useLayoutStore