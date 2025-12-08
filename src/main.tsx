import React from "react";
import ReactDOM from "react-dom/client";  // Use the "react-dom/client" module
import { Provider } from "react-redux";
import { store } from "./app/store";
import './index.css'
import App from "./App";

// Create a root element using `createRoot`
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// Use `root.render()` to render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
