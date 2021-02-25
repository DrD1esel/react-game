import React, { Component } from "react";
import Game from "../../components/Game";
import "./style.css";

export class Main extends Component {
  render() {
    return (
      <div className="root">
        <Game />
      </div>
    );
  }
}

export default Main;
