import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const initialUser = {
  firstName: '',
  lastName: '',
  age: 0,
  visits: 0,
  status: 'single',
  progress: 0,
  subRows: undefined,
};

const AddUserDialog = (props) => {
  const [user, setUser] = useState(initialUser);
  const { addUserHandler } = props;
  const [open, setOpen] = React.useState(false);

  const [switchState, setSwitchState] = React.useState({
    addMultiple: false,
  });

  const handleSwitchChange = (name) => (event) => {
    setSwitchState({ ...switchState, [name]: event.target.checked });
  };

  const resetSwitch = () => {
    setSwitchState({ addMultiple: false });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetSwitch();
  };

  const handleAdd = (event) => {
    addUserHandler(user);
    setUser(initialUser);
    switchState.addMultiple ? setOpen(true) : setOpen(false);
  };

  const handleChange = (name) => ({ target: { value } }) => {
    setUser({ ...user, [name]: value });
  };

  return (
    <div>
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        aria-labelledby="form-dialog-title"
        onClose={handleClose}
        open={open}
      >
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>Demo add item to react table.</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="First Name"
            margin="dense"
            onChange={handleChange('firstName')}
            type="text"
            value={user.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            margin="dense"
            onChange={handleChange('lastName')}
            type="text"
            value={user.lastName}
          />
          <TextField
            fullWidth
            label="Age"
            margin="dense"
            onChange={handleChange('age')}
            type="number"
            value={user.age}
          />
          <TextField
            fullWidth
            label="Visits"
            margin="dense"
            onChange={handleChange('visits')}
            type="number"
            value={user.visits}
          />
          <TextField
            fullWidth
            label="Status"
            margin="dense"
            onChange={handleChange('status')}
            type="text"
            value={user.status}
          />
          <TextField
            fullWidth
            label="Profile Progress"
            margin="dense"
            onChange={handleChange('progress')}
            type="number"
            value={user.progress}
          />
        </DialogContent>
        <DialogActions>
          <Tooltip title="Add multiple">
            <Switch
              checked={switchState.addMultiple}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={handleSwitchChange('addMultiple')}
              value="addMultiple"
            />
          </Tooltip>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddUserDialog.propTypes = {
  addUserHandler: PropTypes.func.isRequired,
};

export default AddUserDialog;
