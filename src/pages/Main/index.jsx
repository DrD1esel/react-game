import React, { Component } from 'react';
import Game from '../../components/Game';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';
import OutlinedButton from '../../components/OutlinedButton';
import ControlsModal from '../../components/ControlsModal';
import SettingsModal from '../../components/SettingsModal';
import ResultsModal from '../../components/ResultsModal';
import SaveService from '../../services/save.service';

export class Main extends Component {
  state = {
    isGameStarted: false,
    isControlsOpen: false,
    isSettingssOpen: false,
    isResultsOpen: false,
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

  componentDidMount() {
    const settings = SaveService.loadSettings();
    if(settings) {
      this.setState({settings})
    }
  }

  saveSettings = () => {
    SaveService.saveSettings(this.state.settings);
  }

  handleStartGame = () => this.setState({ isGameStarted: true });
  handleEndGame = () => this.setState({ isGameStarted: false });

  handleOpenControls = () => this.setState({ isControlsOpen: true });
  handleCloseControls = () => this.setState({ isControlsOpen: false });

  handleOpenSettings = () => this.setState({ isSettingssOpen: true });
  handleCloseSettings = () => this.setState({ isSettingssOpen: false });

  handleOpenResults = () => this.setState({ isResultsOpen: true });
  handleCloseResults = () => this.setState({ isResultsOpen: false });

  handleChangeSettings = (e) => {
    const { name, value, checked } = e.target;
    this.setState((state) => ({ settings: { ...state.settings, [name]: value ? parseInt(value) : checked } }), this.saveSettings);
  };

  handleSoundVolumeChange = (e, newValue) => {
    this.setState((state) => ({ settings: { ...state.settings, soundVolume: newValue } }), this.saveSettings)
  };

  handleMusicVolumeChange = (e, newValue) => {
    this.setState((state) => ({ settings: { ...state.settings, musicVolume: newValue } }), this.saveSettings)
  };

  render() {
    const { classes } = this.props;
    const { isGameStarted, isControlsOpen, isSettingssOpen, settings, isResultsOpen } = this.state;
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
            <OutlinedButton variant="contained" color="outlined" onClick={this.handleOpenResults}>
              Results
            </OutlinedButton>
          </Grid>
        )}
        {isControlsOpen && <ControlsModal onClose={this.handleCloseControls} />}
        {isResultsOpen && <ResultsModal onClose={this.handleCloseResults} />}
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
