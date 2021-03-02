import { Grid, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import classNames from 'classnames';

import GameService from '../../services/game.service';
import styles from './styles';
import OutlinedButton from '../OutlinedButton';

const DISTANCE_MULTIPLIER = 0.02;
const SPEED_INCREASE_STEP = 1000;
const SPEED_STEP = 5;
const M_IN_KM = 1000;
const SPEED_BOOSTER = 100;

const THEME_PATH = './assets/sounds/theme.mp3';
const ENGINE_PATH = './assets/sounds/engine.mp3';
const CRASH_PATH = './assets/sounds/crash.mp3';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: 0,
      speed: 0,
      lastSpeedIncreaseDistance: 0,
      isAutoPilotEnabled: false,
      isBoost: false,
      isPaused: false,
      isGameOver: false,
    };
    this.musicPlayer = new Audio();
    this.soundPlayer = new Audio();
    this.musicPlayer.loop = true;
    this.canvasRef = React.createRef();
    this.canvasRef2 = React.createRef();
  }

  componentDidMount() {
    const { distance, speed, isAutoPilotEnabled, isPaused } = this.state;
    this.gameService = new GameService({
      lowerCanvas: this.canvasRef.current,
      upperCanvas: this.canvasRef2.current,
      onDistanceChange: this.handleDistanceChange,
      onGameOver: this.handleGameOver,
    });
    this.gameService.setSpeed(speed);
    this.gameService.setDistance(distance / DISTANCE_MULTIPLIER);
    this.gameService.toggleAutoPilot(isAutoPilotEnabled);
    this.gameService.setPause(isPaused);
    this.musicPlayer.src = THEME_PATH;
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate(prevProps) {
    const { start, settings } = this.props;
    const { startSpeed, autopilot, musicVolume, soundVolume } = settings;
    if (prevProps.start !== start) {
      if (start) {
        this.musicPlayer.volume = musicVolume;
        this.soundPlayer.volume = soundVolume;
        this.setState({ isPaused: false, isAutoPilotEnabled: autopilot, speed: startSpeed });
        this.handleRestart();
      } else {
        this.gameService.offScreen();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleDistanceChange = (newDistance) => {
    const { lastSpeedIncreaseDistance, speed } = this.state;
    const formattedNewDistance = newDistance * DISTANCE_MULTIPLIER;
    if (this.props.increasingDifficulty && lastSpeedIncreaseDistance + SPEED_INCREASE_STEP < formattedNewDistance) {
      const newSpeed = speed + SPEED_STEP;
      this.gameService.setSpeed(newSpeed);
      this.setState({ lastSpeedIncreaseDistance: formattedNewDistance, speed: newSpeed });
    }
    this.setState({ distance: formattedNewDistance });
  };

  handleRestart = () => {
    const { settings } = this.props;
    const { startSpeed, autopilot, hd, isMusicOn, isSoundsOn } = settings;
    this.setState({
      distance: 0,
      speed: startSpeed,
      lastSpeedIncreaseDistance: 0,
      isPaused: false,
      isGameOver: false,
      isAutoPilotEnabled: autopilot,
    });
    this.musicPlayer.currentTime = 0;
    if (isMusicOn) {
      this.musicPlayer.play();
    }
    if (isSoundsOn) {
      this.soundPlayer.src = ENGINE_PATH;
      this.soundPlayer.loop = true;
      this.soundPlayer.play();
    }
    
    this.gameService.startNewGame({ distance: 0, speed: startSpeed, autopilot, hd });
  };

  handleResume = () => {
    this.gameService.setPause(false);
    this.setState({ isPaused: false });
  };

  handleGameOver = () => {
    this.musicPlayer.pause();    
    this.soundPlayer.pause();
    if (this.props.settings.isSoundsOn) {
      this.soundPlayer.src = CRASH_PATH;
      this.soundPlayer.loop = false;
      this.soundPlayer.play();
    }
    this.setState({ isGameOver: true, isPaused: true });
  };

  handleKeyDown = (e) => {
    const { isAutoPilotEnabled, isBoost, speed, isPaused } = this.state;
    const { start } = this.props;

    if (e.code === 'KeyE') {
      this.gameService.toggleAutoPilot(!isAutoPilotEnabled);
      this.setState({ isAutoPilotEnabled: !isAutoPilotEnabled });
    }
    if (e.code === 'KeyR') {
      this.handleRestart();
    }
    if (e.code === 'Escape' && start) {
      this.gameService.setPause(!isPaused);
      this.setState({ isPaused: !isPaused });
    }

    if (e.key === ' ' && !isBoost && !isAutoPilotEnabled) {
      const newSpeed = speed + SPEED_BOOSTER;
      this.gameService.setSpeed(newSpeed);
      this.setState({ speed: newSpeed, isBoost: true });
    }
  };

  handleKeyUp = (e) => {
    const { speed, isBoost, isAutoPilotEnabled } = this.state;
    if (isAutoPilotEnabled) {
      return;
    }
    if (e.code === 'Space' && isBoost) {
      const newSpeed = speed - SPEED_BOOSTER;
      this.gameService.setSpeed(newSpeed);
      this.setState({ speed: newSpeed, isBoost: false });
    }
  };

  handleBactToMain = () => {
    const { onBackToMenu } = this.props;
    this.musicPlayer.pause();
    this.soundPlayer.pause();
    onBackToMenu();
  };

  render() {
    const { distance, speed, isAutoPilotEnabled, isPaused, isGameOver } = this.state;
    const { start, classes } = this.props;
    return (
      <div ref={this.canvasWrapperRef} className={classes.root}>
        <canvas className={classes.canvas} width="500" height="500" ref={this.canvasRef}></canvas>
        <canvas
          className={classNames(classes.canvas, classes.canvas2)}
          width="500"
          height="500"
          ref={this.canvasRef2}
        ></canvas>
        {start && !isGameOver && (
          <Grid container direction="column" justify="center" alignItems="flex-end" className={classes.overlay}>
            <Typography>{(distance / M_IN_KM).toFixed(1)} km</Typography>
            <Typography>{speed} km/h</Typography>
            <Typography>
              Autopilot:{' '}
              {isAutoPilotEnabled ? (
                <span className={classes.apOn}>On</span>
              ) : (
                <span className={classes.apOff}>Off</span>
              )}
            </Typography>
          </Grid>
        )}
        {isPaused && start && (
          <Grid container direction="column" justify="center" alignItems="center" className={classes.pauseOverlay}>
            {!isGameOver && <OutlinedButton onClick={this.handleResume}>Resume</OutlinedButton>}
            <OutlinedButton onClick={this.handleRestart}>New game</OutlinedButton>
            <OutlinedButton onClick={this.handleBactToMain}>Main menu</OutlinedButton>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Game);
