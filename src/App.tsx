import { useRoutes } from "react-router-dom";
import routes from "./routes/index";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import "./App.scss";

const App = () => {
  const views = useRoutes(routes as any);

  // 自动管理页面标题
  useDocumentTitle();

  return <>{views}</>;
};

export default App;
