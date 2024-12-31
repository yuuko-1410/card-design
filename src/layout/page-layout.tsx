import OneColumsLayout from "./one-colums-layout";
import TwoColumsLayout from "./two-colums-layout";
import ThreeColumsLayout from "./three-colums-layout";
import { usePageStore } from "../store/page";
import { Column } from "../types/page";
const PageLayout = ({ colums }: { colums: Column[] }) => {
  const { config } = usePageStore();
  switch (config.column_num) {
    case 1:
      return <OneColumsLayout colums={colums} />;
    case 2:
      return <TwoColumsLayout colums={colums} />;
    case 3:
      return <ThreeColumsLayout colums={colums} />;
    default:
      return <>Error</>;
  }
};
export default PageLayout;
