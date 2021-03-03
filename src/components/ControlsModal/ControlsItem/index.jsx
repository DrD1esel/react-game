import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';

import styles from './styles';

const ControlsItem = ({ hotkey, description, classes }) => (
  <Grid className={classes.root} container justify="space-between" alignItems="center">
    <Typography className={classes.key}>{hotkey}</Typography>
    <Typography className={classes.description}>{description}</Typography>
  </Grid>
);

export default withStyles(styles)(ControlsItem);
