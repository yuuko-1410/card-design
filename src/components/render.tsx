import { Column, Segment } from "../types/page";
import CardInfo from "./info/card-info";
// import { useSize } from "ahooks";
import { usePageStore } from "../store/page";
import AnswerTopic from "./template/answer-topic/answer-topic";
import Ban from "./template/ban/ban";
import FillInTheBlank from "./template/fill-in-the-blank/fill-in-the-blank";
import OptionTopic from "./template/option-topic/option-topic";
import SingleBox from "./template/single-box/single-box";
import WritingCN from "./template/writing-cn/writing-cn";
import WritingEN from "./template/writing-en/writing-en";

const Render = ({ colum }: { colum: Column }) => {
  const { columns } = usePageStore();
  // const ele = useRef(null);
  // const size = useSize(ele);
  // console.log("size: ", size);
  const { segments } = colum;
  return (
    <div className="flex flex-col">
      {/* 第一页第一栏显示答题卡信息区 */}
      <div>{colum.id === columns[0].id ? <CardInfo /> : <></>}</div>
      {/* 题目块儿 */}
      {segments.map((s) => selectBlock(s))}
    </div>
  );
};

const selectBlock = (segment: Segment): JSX.Element => {
  // const { blocks } = segment;
  switch (segment.type) {
    //选择题类型
    case "single-box":
      return <SingleBox {...segment} key={segment.id} />;
    case "fill":
      return <FillInTheBlank {...segment} key={segment.id} />;
    case "answer-topic":
      return <AnswerTopic {...segment} key={segment.id} />;
    case "writing-cn":
      return <WritingCN {...segment} key={segment.id} />;
    case "writing-en":
      return <WritingEN {...segment} key={segment.id} />;
    case "ban":
      return <Ban {...segment} key={segment.id} />;
    case "option-box":
      return <OptionTopic {...segment} key={segment.id} />;
    default:
      return (
        <div
          key={segment.id}
          className="h-20 border border-[#ff0000] flex justify-center items-center"
        >
          <label>题目类型出错</label>
        </div>
      );
  }
};

export default Render;
