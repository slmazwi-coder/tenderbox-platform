import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

const router = getRouter();

router.isInitialRender = true;
router.subscribe("onRender", () => {
  router.isInitialRender = false;
});

if (rootElement.innerHTML) {
  router.mount();
}