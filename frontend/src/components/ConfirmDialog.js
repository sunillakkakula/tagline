import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Divider, Grid } from '@material-ui/core';
const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <Divider/>
      <DialogContent>{children}</DialogContent>
      <Divider/>
      <DialogActions>
      <Grid container spacing={2}  justify="space-between">
                      <Grid item >
                        <Button variant="contained" onClick={() => setOpen(false)} color="primary" >No</Button>
                        </Grid>
                        <Grid item>
                        <Button  variant="contained" onClick={() => {setOpen(false); onConfirm();}} style={{ backgroundColor: "red",color:"white" }}>Yes</Button>
                        </Grid>
        </Grid>
       
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;