import React from 'react';
import { Grid, withStyles, Link, Typography } from '@material-ui/core';

import styles from './styles';

const Footer = ({ classes }) => (
  <Grid container alignItems="center" className={classes.root}>
    <Link href="https://github.com/DrD1esel" target="_blank">My GitHub</Link>
    <Typography>2021</Typography>    
    <Link href="https://rs.school/js/" target="_blank"><img className={classes.img} src="https://rs.school/images/rs_school_js.svg" alt="rs-logo"/></Link>
  </Grid>
);

export default withStyles(styles)(Footer);
