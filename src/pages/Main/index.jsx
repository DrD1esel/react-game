import React, { Component } from 'react';
import Game from '../../components/Game';
import { Button, Grid, withStyles } from '@material-ui/core';
import styles from './styles';

export class Main extends Component {
  state = {
    isGameStarted: false,
  };

  handleStartGame = () => this.setState({ isGameStarted: true });

  render() {
    const { classes } = this.props;
    const { isGameStarted } = this.state;
    return (
      <Grid className={classes.root}>
        <Game start={isGameStarted} />
        {!isGameStarted && (
          <Grid container justify="center" alignItems="center" className={classes.overlay}>
            <Grid>
              <Button variant="contained" color="primary" onClick={this.handleStartGame}>
                Start
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(Main);
