import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import validate from 'validate.js';

import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userAction";
import Message from "./Message";
import CustomBackdropSpinner from "./CustomBackdropSpinner";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
  userName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 5,
    },
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 300,
    },
  },
  contactNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
    },
  },

};

const SignUpForm = ({ location, history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  React.useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSubmit = event => {
    console.log("Values Submitted are : ", formState.values)
    event.preventDefault();
    if (formState.isValid) 
      dispatch(register(formState.values.name, formState.values.userName, formState.values.password, formState.values.email, formState.values.contactNo, 0));

      setFormState(formState => ({
      ...formState,
      touched: {
        ...formState.touched,
        ...formState.errors,
      },
    }));
  };
 

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
       {error && <Message variant='danger'>{error}</Message>}
      {loading && <CustomBackdropSpinner />}
      <form name="password-reset-form" method="post" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
              placeholder="Name"
              label="Name*"
              variant="outlined"
              size="medium"
              name="name"
              fullWidth
              helperText={hasError('name') ? formState.errors.name[0] : null}
              error={hasError('name')}
              onChange={handleChange}
              type="text"
              value={formState.values.name || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="User Name"
              label="User Name*"
              variant="outlined"
              size="medium"
              name="userName"
              fullWidth
              helperText={hasError('userName') ? formState.errors.userName[0] : null}
              error={hasError('userName')}
              onChange={handleChange}
              type="text"
              value={formState.values.userName || ''}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder="E-mail"
              label="E-mail *"
              variant="outlined"
              size="medium"
              name="email"
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              error={hasError('email')}
              onChange={handleChange}
              type="email"
              value={formState.values.email || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="Password"
              label="Password *"
              variant="outlined"
              size="medium"
              name="password"
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              error={hasError('password')}
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              placeholder=""
              label="Contact No*"
              variant="outlined"
              size="medium"
              name="contactNo"
              fullWidth
              helperText={hasError('contactNo') ? formState.errors.contactNo[0] : null}
              error={hasError('contactNo')}
              onChange={handleChange}
              type="number"
              value={formState.values.contactNo || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
            >
          <Button
              size="large"
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
            >
              REGISTER
            </Button>
            </Typography>
          </Grid>
        
        </Grid>
      </form>
    </div>
  );
};

export default SignUpForm;
