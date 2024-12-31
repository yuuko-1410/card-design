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

    // 对于解答题，尝试合并相同no的段落
    if (segment.type === SegmentType.AnswerTopic) {
      let mergedBlocks = [...segment.blocks];
      let totalHeight = segment.height;
      let shouldMerge = false;

      // 向后查找相同no的段落
      while (i + 1 < temp.length && temp[i + 1].no === segment.no) {
        const nextSegment = temp[i + 1];
        // 计算下一个segment的实际高度（如果是分页的，减去标题高度）
        const nextHeight = nextSegment.is_paging ? nextSegment.height - 32 : nextSegment.height;
        
        // 检查合并后的总高度是否超过页面高度
        const mergedTotalHeight = totalHeight + nextHeight;
        if (mergedTotalHeight <= page_height - header_height) {
          mergedBlocks = [...mergedBlocks, ...nextSegment.blocks];
          totalHeight = mergedTotalHeight;
          shouldMerge = true;
          i++;
        } else {
          break;
        }
      }

      if (shouldMerge) {
        // 如果找到了需要合并的段落，创建新的合并后的segment
        segments.push({
          ...segment,
          blocks: mergedBlocks,
          height: totalHeight,
          is_paging: false
        });
      } else {
        segments.push(segment);
      }
      continue;
    }

    // 对于作文题，尝试合并相同no的段落
    if (segment.type === SegmentType.WritingCN) {
      let totalRows = segment.rows;
      let mergedSegment = { ...segment };

      // 向后查找相同no的作文段落
      while (i + 1 < temp.length && temp[i + 1].no === segment.no) {
        totalRows += temp[i + 1].rows;
        i++;
      }

      // 如果找到了需要合并的段落
      if (totalRows !== segment.rows) {
        mergedSegment = {
          ...segment,
          rows: totalRows,
          prev_nums: 0,
          is_paging: false,
          height: 33 * totalRows + 2 + (totalRows + 1) * 4 + 32
        };
      }
      segments.push(mergedSegment);
      continue;
    }

    // 其他类型的segment处理
    if (segment.is_paging) {
      segments.push(segment);
      continue;
    }

    if (i + 1 < temp.length && segment.no === temp[i + 1].no) {
      const title_height = segment.height - segment.blocks.map(x => x.height).reduce((a, b) => a + b, 0);
      const saved: Segment = {
        ...segment,
        height: (segment.height ?? 0) + (temp[i + 1].height ?? 0) + title_height,
        blocks: [...segment.blocks, ...temp[i + 1].blocks],
        prev_nums: 0,
        rows: segment.rows + temp[i + 1].rows,
        lines: segment.lines + temp[i + 1].lines,
      };
      segments.push(saved);
      i++;
    } else {
      segments.push(segment);
    }
  }

  // 按列分配segments
  let current_column = 0;
  let use_height = 0;
  const saved_columns: Column[] = [{
    id: guid(),
    use_height: 0,
    free_height: 0,
    segments: []
  }];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const current_header_height = current_column === 0 ? header_height : 0;
    const free_height = page_height - use_height - current_header_height;

    // 检查下一个segment是否可以合并
    const canMergeWithNext = () => {
      if (i + 1 >= segments.length) return false;
      const nextSegment = segments[i + 1];
      
      // 必须是相同题号和类型的segment
      if (nextSegment.no !== segment.no || nextSegment.type !== segment.type) return false;
      
      // 计算合并后的总高度
      const nextHeight = nextSegment.is_paging ? nextSegment.height : nextSegment.height + 32;
      const totalHeight = segment.height + nextHeight;
      
      // 检查合并后的高度是否适合当前列
      return totalHeight <= free_height;
    };

    if (segment.height <= free_height && canMergeWithNext()) {
      // 可以合并的情况
      const nextSegment = segments[i + 1];
      const mergedHeight = segment.height + 
        (nextSegment.is_paging ? nextSegment.height : nextSegment.height + 32);

      saved_columns[current_column].segments.push({
        ...segment,
        id: guid(),
        blocks: [...segment.blocks, ...nextSegment.blocks],
        height: mergedHeight,
        is_paging: false
      });
      use_height += mergedHeight;
      i++; // 跳过下一个segment
    } else if (segment.height > free_height) {
      // 需要拆分的情况，保持原有的拆分逻辑
      if (segment.type === SegmentType.AnswerTopic && !segment.is_paging) {
        const title_height = 32;
        let currentHeight = title_height;
        const currentBlocks: Block[] = [];
        const remainingBlocks: Block[] = [];

        // 将blocks分成当前列和剩余列
        for (const block of segment.blocks) {
          const nextHeight = currentHeight + block.height;
          const next_column_free_height = page_height - (current_column === 0 ? header_height : 0);
          
          // 检查是否会超出当前页面
          if (nextHeight > free_height) {
            // 如果当前列还没有放置任何block
            if (currentBlocks.length === 0) {
              // 检查当前列和下一列哪个更适合放置
              const current_available = free_height - title_height;
              const next_available = next_column_free_height - title_height;
              
              if (block.height <= current_available || block.height > next_available) {
                // 如果当前列能放下，或者下一列也放不下，就放在当前列
                currentBlocks.push(block);
                currentHeight = title_height + block.height;
              } else {
                // 如果当前列放不下但下一列能放下，移到下一列
                current_column++;
                use_height = 0;
                
                if (saved_columns.length - 1 < current_column) {
                  saved_columns.push({
                    id: guid(),
                    use_height: 0,
                    free_height: 0,
                    segments: []
                  });
                }
                
                currentBlocks.push(block);
                currentHeight = title_height + block.height;
              }
            } else {
              // 如果不是第一个block，将剩余blocks放入remainingBlocks
              remainingBlocks.push(block);
              remainingBlocks.push(...segment.blocks.slice(segment.blocks.indexOf(block) + 1));
              break;
            }
          } else {
            currentBlocks.push(block);
            currentHeight = nextHeight;
          }
        }

        // 添加当前列的segment
        if (currentBlocks.length > 0) {
          saved_columns[current_column].segments.push({
            ...segment,
            id: guid(),
            height: currentHeight,
            blocks: currentBlocks,
            is_paging: false
          });
          use_height += currentHeight;
        }

        // 处理剩余blocks
        if (remainingBlocks.length > 0) {
          current_column++;
          use_height = 0;
          
          if (saved_columns.length - 1 < current_column) {
            saved_columns.push({
              id: guid(),
              use_height: 0,
              free_height: 0,
              segments: []
            });
          }

          const remainingHeight = remainingBlocks.map(b => b.height).reduce((a, b) => a + b, 0) + title_height;
          saved_columns[current_column].segments.push({
            ...segment,
            id: guid(),
            height: remainingHeight,
            blocks: remainingBlocks,
            is_paging: true
          });
          use_height += remainingHeight;
        }
        continue;
      } else if (segment.type === SegmentType.WritingCN) {
        // 处理作文题
        console.log("============>开始处理作文题");
        let remaining_rows = segment.rows;
        let prev_nums = segment.prev_nums || 0;

        // 计算当前页可容纳的最大行数
        const max_rows_per_page = Math.floor((page_height - 38) / 34);

        while (remaining_rows > 0) {
          const current_free_height = page_height - use_height - (current_column === 0 ? header_height : 0);
          let rows = Math.floor((current_free_height - 6 - 36) / 34);

          // 确保不超过每页最大行数和剩余行数
          rows = Math.min(rows, remaining_rows, max_rows_per_page);

          if (rows > 0) {
            // 计算当前segment的高度
            const current_height = 33 * rows + 2 + (rows + 1) * 4 + 32;

            // 添加当前segment
            saved_columns[current_column].segments.push({
              ...segment,
              id: guid(),
              prev_nums,
              rows,
              height: current_height,
              is_paging: prev_nums > 0
            });

            use_height += current_height;
            prev_nums += rows * getRowNum(column_num);
            remaining_rows -= rows;

            // 如果还有剩余行数，准备下一列
            if (remaining_rows > 0) {
              current_column++;
              use_height = 0;

              if (saved_columns.length - 1 < current_column) {
                saved_columns.push({
                  id: guid(),
                  use_height: 0,
                  free_height: 0,
                  segments: []
                });
              }
            }
          } else {
            // 当前列剩余空间不足，转到下一列
            current_column++;
            use_height = 0;

            if (saved_columns.length - 1 < current_column) {
              saved_columns.push({
                id: guid(),
                use_height: 0,
                free_height: 0,
                segments: []
              });
            }
          }
        }
        continue;
      } else if (segment.type === SegmentType.OptionBox && !segment.is_paging) {
        // 选作题的处理逻辑
        const title_height = 32;
        const option_box_height = segment.blocks.length * 24 + 32;
        const padding_height = 48;
        const min_height = title_height + option_box_height + padding_height;
        
        // 使用已有的高度或最小高度
        const actual_height = Math.max(min_height, segment.height || min_height);

        if (free_height >= actual_height) {
          // 如果剩余空间足够，就在当前列放置
          saved_columns[current_column].segments.push({
            ...segment,
            id: guid(),
            height: actual_height,
            is_paging: false
          });
          use_height += actual_height;
        } else {
          // 如果剩余空间不够，移到下一列，但保持调整后的高度
          current_column++;
          use_height = 0;
          
          if (saved_columns.length - 1 < current_column) {
            saved_columns.push({
              id: guid(),
              use_height: 0,
              free_height: 0,
              segments: []
            });
          }
          
          saved_columns[current_column].segments.push({
            ...segment,
            id: guid(),
            height: actual_height, // 保持调整后的高度
            is_paging: true
          });
          use_height += actual_height;
        }
      } else {
        // 其他类型的segment或已分页的segment直接进入下一列
        current_column++;
        use_height = 0;

        if (saved_columns.length - 1 < current_column) {
          saved_columns.push({
            id: guid(),
            use_height: 0,
            free_height: 0,
            segments: []
          });
        }
        saved_columns[current_column].segments.push(segment);
        use_height += segment.height;
      }
    } else {
      // 不需要合并也不需要拆分的情况
      saved_columns[current_column].segments.push(segment);
      use_height += segment.height;
    }
  }

  // 按列分配完segments后，对每列内部进行合并处理
  const mergedColumns = saved_columns.map(column => {
    const mergedSegments: Segment[] = [];
    const processedIndices = new Set<number>();  // 记录已处理的索引

    for (let i = 0; i < column.segments.length; i++) {
      // 如果当前索引已被处理，跳过
      if (processedIndices.has(i)) continue;

      const currentSegment = column.segments[i];

      // 只处理解答题
      if (currentSegment.type === SegmentType.AnswerTopic) {
        let totalHeight = currentSegment.height;
        const mergedBlocks = [...currentSegment.blocks];
        const segmentsToMerge = [i];  // 记录要合并的segment索引

        // 向后查找可以合并的segments
        for (let j = i + 1; j < column.segments.length; j++) {
          const nextSegment = column.segments[j];
          
          // 检查是否是相同题号的解答题
          if (nextSegment.type === SegmentType.AnswerTopic && 
              nextSegment.no === currentSegment.no) {
            
            // 跨页的segment不需要减去标题高度
            const nextHeight = nextSegment.height;
            
            // 检查合并后是否超出页面高度
            if (totalHeight + nextHeight <= page_height - (i === 0 ? header_height : 0)) {
              totalHeight += nextHeight;
              mergedBlocks.push(...nextSegment.blocks);
              segmentsToMerge.push(j);
            } else {
              break;  // 超出高度限制，停止合并
            }
          } else {
            break;  // 遇到不同题号或类型，停止合并
          }
        }

        // 如果找到了可以合并的segments
        if (segmentsToMerge.length > 1) {
          // 标记所有被合并的索引
          segmentsToMerge.forEach(index => processedIndices.add(index));
          
          // 添加合并后的segment
          mergedSegments.push({
            ...currentSegment,
            blocks: mergedBlocks,
            height: totalHeight,
            is_paging: false  // 合并后的segment不再是跨页的
          });
        } else {
          // 没有可合并的，直接添加当前segment
          mergedSegments.push(currentSegment);
        }
      } else {
        // 非解答题直接添加
        mergedSegments.push(currentSegment);
      }
    }

    // 更新列的使用高度
    const totalHeight = mergedSegments.reduce((sum, seg) => sum + seg.height, 0);

    return {
      ...column,
      segments: mergedSegments,
      use_height: totalHeight,
      free_height: page_height - totalHeight
    };
  });

  setColumns(mergedColumns);
  console.log(mergedColumns);
}

const changeCNGridRows = (newColumnNum: number) => {
  const { config, columns, setColumns } = usePageStore.getState();
  const { column_num } = config;
  // 需要保存更新后的结果
  const updatedColumns = columns.map(x => ({
    ...x,
    segments: x.segments.map(y => ({
      ...y,
      rows: Math.ceil(y.rows * column_num / newColumnNum),
    }))
  }));
  // 更新状态
  setColumns(updatedColumns);
}

export {
  render,
  changeCNGridRows
}
