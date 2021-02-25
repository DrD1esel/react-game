import React from "react";
import GameService from "../../services/game.service";
import "./style.css";

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.canvasRef2 = React.createRef();
  }
  componentDidMount() {
    this.gameService = new GameService(
      this.canvasRef.current,
      this.canvasRef2.current,
    );
  }

  render() {
    return (
      <div ref={this.canvasWrapperRef} className="root">
        <canvas
          className="canvas"
          width="500"
          height="500"
          ref={this.canvasRef}
        ></canvas>
        <canvas
          className="canvas canvas2"
          width="500"
          height="500"
          ref={this.canvasRef2}
        ></canvas>
      </div>
    );
  }
}

export default Game;
