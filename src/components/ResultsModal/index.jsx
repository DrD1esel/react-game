import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, withStyles } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

import styles from './styles';
import SaveService from '../../services/save.service';

const columns = [
  { field: 'distance', headerName: 'Distance (km)', width: 150 },
  { field: 'hardMode', headerName: 'Mode', width: 100 },
  { field: 'date', headerName: 'Date', width: 190 },
];

const ResultsModal = ({ onClose, classes }) => {
  const results = SaveService.loadResults();

  return (
    <Dialog
      open
      onClose={onClose}
      className={classes.root}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>Results</DialogTitle>
      <DialogContent>
        <DataGrid hideFooter autoHeight className={classes.datagrid} columns={columns} rows={results}/>
      </DialogContent>
      <DialogActions>
        <Button className={classes.closeButton} onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ResultsModal);
