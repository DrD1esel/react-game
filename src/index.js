import React from "react";
import ReactDOM from "react-dom";
import Main from "./pages/Main";
import './index.css'

ReactDOM.render(<Main />, document.getElementById("root"));

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept();
}
