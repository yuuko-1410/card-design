import { createUseStyles } from "react-jss";
import { LayoutColumn } from "../types/layout";
import Render from "../components/render";
const OneColumsLayout = ({ colums }: { colums: LayoutColumn[] }) => {
  const style = usePageStyle();
  const [colum1] = colums;
  return (
    <div className={style.pageColums_1}>
      <AnchorPoint />
      <div />
      <AnchorPoint />
      <div />
      {colum1 != undefined ? <Render colum={colum1} /> : <div />}
      <div />
      <AnchorPoint />
      <div />
      <AnchorPoint />
    </div>
  );
};

const AnchorPoint = () => <div className="w-[20px] h-[20px] bg-black"></div>;

const usePageStyle = createUseStyles({
  pageColums_1: {
    height: "100%",
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "20px 1fr 20px",
    gridTemplateRows: "20px 1fr 20px",
  }
});

export default OneColumsLayout;
