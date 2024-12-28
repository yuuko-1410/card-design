import { LayoutColumn, LayoutElement } from "../types/layout";
import CardInfo from "./info/card-info";
// import { useSize } from "ahooks";
import AnswerTopic from "./template/answer-topic/answer-topic";
import Ban from "./template/ban/ban";
import FillInTheBlank from "./template/fill-in-the-blank/fill-in-the-blank";
import OptionTopic from "./template/option-topic/option-topic";
import SingleBox from "./template/single-box/single-box";
import WritingCN from "./template/writing-cn/writing-cn";
import WritingEN from "./template/writing-en/writing-en";

const Render = ({ colum }: { colum: LayoutColumn }) => {
  // const ele = useRef(null);
  // const size = useSize(ele);
  // console.log("size: ", size);

  const { pageNum, columNum, elements } = colum;
  return (
    <div className="flex flex-col" >
      {/* 第一页第一栏显示答题卡信息区 */}
      <div>{pageNum === 1 && columNum === 1 ? <CardInfo /> : <></>}</div>
      {/* 题目块儿 */}
      {elements.map((ele) => selectBlock(ele))}
    </div>
  );
};

const selectBlock = (
  ele: LayoutElement,
): JSX.Element => {
  switch (ele.type) {
    // 选择题类型
    case "single-box":
      return <SingleBox {...ele} type={ele.optionType} key={ele.id} />;
    case "fill":
      return <FillInTheBlank {...ele} key={ele.id} />;
    case "answer-topic":
      return <AnswerTopic {...ele} key={ele.id} />;
    case "writing-cn":
      return <WritingCN {...ele} key={ele.id} />;
    case "writing-en":
      return <WritingEN {...ele} key={ele.id} />;
    case "ban":
      return <Ban {...ele} key={ele.id} />;
    case "option-box":
      return <OptionTopic {...ele} key={ele.id} />;
    default:
      return <></>;
  }
};

export default Render;
