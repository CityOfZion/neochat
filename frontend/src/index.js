import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "containers";
import { Provider } from "react-redux";
import store from "./store";
import "./styles/bootstrap.css";
import "./styles/fontawesome-all.css";

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);
