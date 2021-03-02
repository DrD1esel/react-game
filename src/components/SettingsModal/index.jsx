import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
  Switch,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

import styles from './styles';

const SettingsModal = ({ onClose, onChange, classes, settings, onSoundVolumeChange, onMusicVolumeChange }) => (
  <Dialog
    open
    onClose={onClose}
    className={classes.root}
    classes={{
      paper: classes.paper,
    }}
  >
    <DialogTitle>Settings</DialogTitle>
    <DialogContent>
      <Grid container direction="column" className={classes.content}>
        <Typography>Sounds</Typography>
        <Grid container alignItems="center">
          <Switch checked={settings.isSoundsOn} onChange={onChange} color="primary" name="isSoundsOn" />
          <Grid className={classes.sliderWrapper}>
            <Grid container spacing={2}>
              <Grid item>
                <VolumeDown />
              </Grid>
              <Grid item xs>
                <Slider
                  disabled={!settings.isSoundsOn}
                  className={classes.slider}
                  step={0.1}
                  min={0}
                  max={1}
                  value={settings.soundVolume}
                  onChange={onSoundVolumeChange}
                />
              </Grid>
              <Grid item>
                <VolumeUp />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Typography>Music</Typography>
        <Grid container alignItems="center">
          <Switch checked={settings.isMusicOn} onChange={onChange} color="primary" name="isMusicOn" />
          <Grid className={classes.sliderWrapper}>
            <Grid container spacing={2}>
              <Grid item>
                <VolumeDown />
              </Grid>
              <Grid item xs>
                <Slider
                  disabled={!settings.isMusicOn}
                  className={classes.slider}
                  step={0.1}
                  min={0}
                  max={1}
                  value={settings.musicVolume}
                  onChange={onMusicVolumeChange}
                />
              </Grid>
              <Grid item>
                <VolumeUp />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Typography className={classes.title}>{'UltraHD Mode :)'}</Typography>
        <Switch checked={settings.hd} onChange={onChange} color="primary" name="hd" />
        <Typography className={classes.title}>{'Hard mode (Speed increases every 1000 meters)'}</Typography>
        <Switch
          checked={settings.increasingDifficulty}
          onChange={onChange}
          color="primary"
          name="increasingDifficulty"
        />
        <Typography className={classes.title}>Autopilot</Typography>
        <Switch
          checked={settings.autopilot}
          onChange={onChange}
          color="primary"
          name="autopilot"
        />
        <Typography className={classes.title}>Start speed</Typography>
        <TextField
        className={classes.textField}
          variant="outlined"
          value={settings.startSpeed}
          name="startSpeed"
          onChange={onChange}
          type="number"
          min={10}
          max={1000}
          step={5}
        ></TextField>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button className={classes.closeButton} onClick={onClose} variant="contained" color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles)(SettingsModal);
