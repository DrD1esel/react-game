import React, { Component } from 'react';
import Game from '../../components/Game';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';
import OutlinedButton from '../../components/OutlinedButton';
import ControlsModal from '../../components/ControlsModal';

export class Main extends Component {
  state = {
    isGameStarted: false,
    isControlsOpen: false
  };  

  handleStartGame = () => this.setState({ isGameStarted: true });
  handleEndGame = () => this.setState({ isGameStarted: false });

  handleOpenMenu = () => this.setState({isControlsOpen: true})
  handleCloseMenu = () => this.setState({isControlsOpen: false})

  render() {
    const { classes } = this.props;
    const { isGameStarted, isControlsOpen } = this.state;
    return (
      <Grid className={classes.root}>
        <Game start={isGameStarted} onBackToMenu={this.handleEndGame}/>
        {!isGameStarted && !isControlsOpen  && (
          <Grid container direction="column" justify="center" alignItems="center" className={classes.overlay}>
              <OutlinedButton variant="contained" color="outlined" onClick={this.handleStartGame}>
                Start
              </OutlinedButton>
              <OutlinedButton variant="contained" color="outlined" onClick={this.handleOpenMenu}>
                Controls
              </OutlinedButton>
          </Grid>
        )}
        {isControlsOpen && <ControlsModal onClose={this.handleCloseMenu} />}
      </Grid>
    );
  }
}

export default withStyles(styles)(Main);
