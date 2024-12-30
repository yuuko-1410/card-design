import { usePageStore } from "../store/page"
import { Block, Column, Segment, SegmentType } from "../types/page";
import { guid } from "./common";
import { getRowNum } from "./render";


const render = () => {
  const { columns, setColumns, page_height, header_height, config } = usePageStore.getState();
  const { column_num } = config;
  const temp: Segment[] = columns.flatMap(x => x.segments);
  const segments: Segment[] = [];
  // 合并相同no的题块儿
  for (let i = 0; i < temp.length; i++) {
    const segment = temp[i];
    if (i + 1 < temp.length && segment.no === temp[i + 1].no) {
      const title_height = segment.height - segment.blocks.map(x => x.height).reduce((a, b) => a + b, 0);
      // 如果下一个 segment 的 no 相同，则合并 blocks
      const saved: Segment = {
        ...segment,
        height: (segment.height ?? 0) + (temp[i + 1].height ?? 0) + title_height,
        blocks: [...segment.blocks, ...temp[i + 1].blocks],
        prev_nums: 0,
        rows: segment.rows + temp[i + 1].rows,
        lines: segment.lines + temp[i + 1].lines,
      };
      segments.push(saved);
      // 跳过下一个 segment，因为它已经被合并
      i++;
    } else {
      // 如果下一个 segment 的 no 不相同，则直接添加当前 segment
      segments.push(segment);
    }
  }
  // 保证height正确
  segments.forEach(x => {
    if (x.type == SegmentType.AnswerTopic) {
      x.height = x.height = x.blocks.map(y => y.height).reduce((a, b) => a + b, 0) + 32;
    }
  })
  console.log("合并之后", JSON.stringify(columns));



  let current_column = 0;
  let use_height = 0;
  // 初始化一个空的Columns
  const saved_columns: Column[] = [{
    id: guid(),
    use_height: 0,
    free_height: 0,
    segments: []
  }];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const current_header_height = current_column == 0 ? header_height : 0;
    const free_height = page_height - use_height - current_header_height;

    const { height, blocks } = segment;
    console.log("当前列高度", current_column, free_height, height);
    console.log("columns:", columns);
    console.log("当前", segment, segment.type, height, free_height);
    if (height > free_height) {
      current_column++;
      use_height = 0;
      // 添加新的column防止数组越界
      if (saved_columns.length - 1 < current_column) {
        saved_columns.push({
          id: guid(),
          use_height: 0,
          free_height: 0,
          segments: []
        })
      }
      // 题块儿分栏
      // 解答题块儿分块儿处理
      if (segment.type == SegmentType.AnswerTopic) {
        console.log("============>开始处理简答题");
        let block_use_height = 0;
        const title_height = segment.height - blocks.map(x => x.height).reduce((a, b) => a + b, 0);
        const this_column_block: Block[] = [];
        const next_column_block: Block[] = [];

        for (let j = 0; j < blocks.length; j++) {
          if (block_use_height + blocks[j].height + title_height > free_height) {
            next_column_block.push(...blocks.slice(j));
            break;
          }
          this_column_block.push(blocks[j]);
          block_use_height += blocks[j].height;
        }
        if (this_column_block.length != 0 && next_column_block.length != 0) {
          segment.blocks = this_column_block;
          segment.height = title_height + this_column_block.map(x => x.height).reduce((a, b) => a + b, 0);
          saved_columns[current_column - 1].segments.push(segment);
          saved_columns[current_column].segments.unshift({
            ...segment,
            id: guid(),
            height: next_column_block.map(x => x.height).reduce((a, b) => a + b, 0),
            blocks: next_column_block.length > 0 ? next_column_block : blocks,
            is_paging: true,
          })
          use_height += next_column_block.map(x => x.height).reduce((a, b) => a + b, 0);
          continue;
        }
      }
      // 作文分块儿处理
      if (segment.type == SegmentType.WritingCN) {
        console.log("============>开始处理作文题");
        // 计算当前的空间可以容纳几行
        console.log("剩余空间", free_height);
        let rows = Math.floor((free_height - 6 - 36) / 34)
        console.log("剩余空间可容纳行数：", rows);
        let is_paging = false;
        let sub_height = segment.height;
        if (rows > 0) {
          const this_segment: Segment = {
            ...segment,
            prev_nums: 0,
            rows,
            height: 33*rows + 2+(rows+1)*4 + 32,
          }
          sub_height -= free_height;
          saved_columns[current_column - 1].segments[i] = this_segment;
          is_paging = true;
        } else {
          rows = 0;
          delete saved_columns[current_column - 1].segments[i];
        }
        // 处理接下来的页面
        let remaining_rows = segment.rows - rows;
        let remaining_nums = rows * getRowNum(column_num);

        const next_segment: Segment[] = [];
        while (remaining_rows > 32) {
          next_segment.push({
            ...segment,
            id: guid(),
            prev_nums: remaining_nums,
            rows: remaining_rows,
            is_paging,
            height: page_height,
          });
          sub_height -= page_height;
          is_paging = true;
          remaining_nums += 32 * getRowNum(column_num);
          remaining_rows -= 32;
        }
        next_segment.push({
          ...segment,
          id: guid(),
          prev_nums: remaining_nums,
          rows: remaining_rows,
          is_paging,
          height: sub_height,
        });
        saved_columns[current_column].segments.unshift(...next_segment);
        continue;
      }
    }
    saved_columns[current_column].segments.push(segment);
    use_height += segment.height;
  }
  setColumns(saved_columns);
  console.log("render finish......")
  console.log("columns:", saved_columns);
}

const changeCNGridRows = (newColumnNum: number) => {
  const { config, columns } = usePageStore.getState();
  const { column_num } = config;
  columns.map(x => ({
    ...x,
    segments: x.segments.map(y => ({
      ...y,
      rows: Math.ceil(y.rows * column_num / newColumnNum),
    }))
  }))
}

export {
  render,
  changeCNGridRows
}