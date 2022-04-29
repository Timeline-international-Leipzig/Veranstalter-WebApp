import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//import { createStore } from "redux";
import allReducers from "./Redux/Reducer";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const store = configureStore(
  { reducer: allReducers },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>

);
