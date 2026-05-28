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

// Always mount the router - it's a client-side app
// The innerHTML check is for SSR hydration which we're disabling
router.mount();