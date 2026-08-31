import { createRoot } from "react-dom/client";
import "@franco/booking-ui/styles.css";
import { TagungPage } from "./tagung/TagungPage";
import "./tagung/tagung.css";

document.documentElement.classList.add("tagung-route");

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<TagungPage />);
}
