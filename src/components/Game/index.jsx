import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import classNames from 'classnames';

import GameService from '../../services/game.service';
import styles from './styles';

const DISTANCE_MULTIPLIER = 0.02;
const SPEED_INCREASE_STEP = 1000;
const SPEED_STEP = 5;
const M_IN_KM = 1000;
const SPEED_BOOSTER = 100;
const INITIAL_SPEED = 165;

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: 0,
      speed: INITIAL_SPEED,
      lastSpeedIncreaseDistance: 0,
      isAutoPilotEnabled: true,
      isBoost: false,
      isPaused: false,
      isGameOver: false,
    };

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

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate(prevProps) {
    const { start } = this.props;
    const { speed, distance } = this.state;
    if (prevProps.start !== start) {
      if (start) {
        this.gameService.startNewGame({ distance: distance / DISTANCE_MULTIPLIER, speed });
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
    if (lastSpeedIncreaseDistance + SPEED_INCREASE_STEP < formattedNewDistance) {
      const newSpeed = speed + SPEED_STEP;
      this.gameService.setSpeed(newSpeed);
      this.setState({ lastSpeedIncreaseDistance: formattedNewDistance, speed: newSpeed });
    }
    this.setState({ distance: formattedNewDistance });
  };

  handleRestart = () => {
    this.setState({ distance: 0, speed: INITIAL_SPEED, lastSpeedIncreaseDistance: 0, isPaused: false, isGameOver: false });
    this.gameService.startNewGame({ distance: 0, speed: INITIAL_SPEED });
  };

  handleResume = () => {
    this.gameService.setPause(false);
    this.setState({ isPaused: false });
  };

  handleGameOver = () => {
    this.setState({isGameOver: true, isPaused: true})
  };

  handleKeyDown = (e) => {
    const { isAutoPilotEnabled, isBoost, speed, isPaused } = this.state;

    if (e.code === 'KeyE') {
      this.gameService.toggleAutoPilot(!isAutoPilotEnabled);
      this.setState({ isAutoPilotEnabled: !isAutoPilotEnabled });
    }
    if (e.code === 'KeyR') {
      this.handleRestart();
    }
    if (e.code === 'Escape') {
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
        {start && (
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
        {isPaused && (
          <Grid container direction="column" justify="center" alignItems="center" className={classes.pauseOverlay}>
            {!isGameOver && (
              <Button variant="outlined" onClick={this.handleResume}>
                Resume
              </Button>
            )}
            <Button variant="outlined" onClick={this.handleRestart}>
              New game
            </Button>
            <Button variant="outlined" onClick={this.handleResume}>
              Main menu
            </Button>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Game);
