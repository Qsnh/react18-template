import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";
import "./index.scss";
import AutoScorllTop from "./AutoTop";
import mitt from "mitt";
import VConsole from "vconsole";
import { restoreUserState } from "./stores/userStore";

(window as any).emitter = mitt();

if (localStorage.getItem("enabled_debug") === "1") {
  const vConsole = new VConsole();
  (window as any).vConsole = vConsole;
}

// 恢复用户登录状态
restoreUserState();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider>
    <BrowserRouter>
      <AutoScorllTop>
        <App />
      </AutoScorllTop>
    </BrowserRouter>
  </ConfigProvider>
);
