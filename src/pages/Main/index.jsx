import React, { Component } from 'react';
import Game from '../../components/Game';
import { Button, Grid } from '@material-ui/core';
import './style.css';

export class Main extends Component {
  state = {
    isGameStarted: false,
  };

  handleStartGame = () => this.setState({ isGameStarted: true });

  render() {
    const { isGameStarted } = this.state;
    return (
      <Grid className='root'>
        <Game start={isGameStarted} />
        {!isGameStarted && (
          <Grid className="overlay">
            <Grid>
              <Button onClick={this.handleStartGame}>Start</Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default Main;
