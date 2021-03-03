import React from 'react';
import classNames from 'classnames';
import { Button, withStyles } from '@material-ui/core';

import styles from './styles';

const OutlinedButton = ({ onClick, children, classes, className }) => (
  <Button className={classNames(classes.root, className)} variant="outlined" onClick={onClick}>
    {children}
  </Button>
);

export default withStyles(styles)(OutlinedButton);
