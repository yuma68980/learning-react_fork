import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import CommentApp from "./comments/CommentApp";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <CommentApp />
  </StrictMode>
);
