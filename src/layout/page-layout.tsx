import OneColumsLayout from "./one-colums-layout";
import TwoColumsLayout from "./two-colums-layout";
import ThreeColumsLayout from "./three-colums-layout";
import useLayoutStore from "../store/layout";
import { LayoutColumn } from "../types/layout";
const PageLayout = ({ colums }: { colums: LayoutColumn[] }) => {
  const { config } = useLayoutStore();
  switch (config.column) {
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
