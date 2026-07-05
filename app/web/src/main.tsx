import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {api} from "@org/core"
import { getOrgIdFromUrl } from "./utils/axis";
api.setContext({getOrgId: getOrgIdFromUrl})
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
