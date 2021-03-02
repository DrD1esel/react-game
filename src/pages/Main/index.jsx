import React, { Component } from 'react';
import Game from '../../components/Game';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';
import OutlinedButton from '../../components/OutlinedButton';
import ControlsModal from '../../components/ControlsModal';
import SettingsModal from '../../components/SettingsModal';

export class Main extends Component {
  state = {
    isGameStarted: false,
    isControlsOpen: false,
    isSettingssOpen: false,
    settings: {
      soundVolume: 1,
      isSoundsOn: true,
      musicVolume: 1,
      isMusicOn: true,
      hd: true,
      startSpeed: 100,
      increasingDifficulty: true,
      autopilot: false,
    },
  };

  handleStartGame = () => this.setState({ isGameStarted: true });
  handleEndGame = () => this.setState({ isGameStarted: false });

  handleOpenControls = () => this.setState({ isControlsOpen: true });
  handleCloseControls = () => this.setState({ isControlsOpen: false });

  handleOpenSettings = () => this.setState({ isSettingssOpen: true });
  handleCloseSettings = () => this.setState({ isSettingssOpen: false });

  handleChangeSettings = (e) => {
    const { name, value, checked } = e.target;
    let newValue;
    if(name === 'startSpeed') {
      const intValue = parseInt(value);
      if(!intValue || intValue < 20) {
        newValue = 20;
      } else if (intValue > 1000) {
        newValue = 1000;
      } else {
        newValue = intValue;
      }
    }
    this.setState((state) => ({ settings: { ...state.settings, [name]: newValue || checked } }));
  };

  handleSoundVolumeChange = (e, newValue) => {
    this.setState((state) => ({ settings: { ...state.settings, soundVolume: newValue } }))
  };

  handleMusicVolumeChange = (e, newValue) => {
    this.setState((state) => ({ settings: { ...state.settings, musicVolume: newValue } }))
  };

  render() {
    const { classes } = this.props;
    const { isGameStarted, isControlsOpen, isSettingssOpen, settings } = this.state;
    return (
      <Grid className={classes.root}>
        <Game start={isGameStarted} onBackToMenu={this.handleEndGame} settings={settings}/>
        {!isGameStarted && !isControlsOpen && (
          <Grid container direction="column" justify="center" alignItems="center" className={classes.overlay}>
            <OutlinedButton variant="contained" color="outlined" onClick={this.handleStartGame}>
              Start
            </OutlinedButton>
            <OutlinedButton variant="contained" color="outlined" onClick={this.handleOpenControls}>
              Controls
            </OutlinedButton>
            <OutlinedButton variant="contained" color="outlined" onClick={this.handleOpenSettings}>
              Settings
            </OutlinedButton>
          </Grid>
        )}
        {isControlsOpen && <ControlsModal onClose={this.handleCloseControls} />}
        {isSettingssOpen && (
          <SettingsModal
            onClose={this.handleCloseSettings}
            onChange={this.handleChangeSettings}
            onSoundVolumeChange={this.handleSoundVolumeChange}
            onMusicVolumeChange={this.handleMusicVolumeChange}
            settings={settings}
          />
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(Main);
