import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, withStyles } from '@material-ui/core';

import styles from './styles';
import ControlsItem from './ControlsItem';

const hotkeys = [
  { key: 'A', description: 'Turn left' },
  { key: 'D', description: 'Turn right' },
  { key: 'Space', description: 'Boost speed' },
  { key: 'Esc', description: 'Pause' },
  { key: 'E', description: 'Autopilot' },
];

const ControlsModal = ({ onClose, classes }) => (
  <Dialog
    open
    onClose={onClose}
    className={classes.root}
    classes={{
      paper: classes.paper,
    }}
  >
    <DialogTitle>Controls</DialogTitle>
    <DialogContent>
      {hotkeys.map((hotkey) => (
        <ControlsItem key={hotkey.key} hotkey={hotkey.key} description={hotkey.description} />
      ))}
    </DialogContent>
    <DialogActions>
      <Button className={classes.closeButton} onClick={onClose} variant="contained" color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles)(ControlsModal);
