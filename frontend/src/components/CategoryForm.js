import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import validate from 'validate.js';
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../actions/categoryAction";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
  description: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
};

const CategoryForm = ({ location, history }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  React.useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {loading,success_create,category} = categoryCreate;

  if (success_create) {
    console.log("Success Response to redirecting to Category List");
    history.push("/admin/category");
  }

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
    event.preventDefault();

    if (formState.isValid) {
      console.log(formState.values)
      dispatch(createCategory(formState.values.name , formState.values.description));
    }

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
      <form name="password-reset-form" method="post" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{marginTop:"1rem",marginBottom:"1rem"}}
          // onClick={() => createCategoryHandler()}
          startIcon={<ArrowBackIosIcon />}
          >
          BACK
          </Button>
          </Grid>
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
              placeholder="Description"
              label="Description *"
              variant="outlined"
              size="medium"
              name="description"
              fullWidth
              helperText={
                hasError('description') ? formState.errors.description[0] : null
              }
              error={hasError('description')}
              onChange={handleChange}
              type="description"
              value={formState.values.description || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              size="large"
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
            >
              CREATE
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
            >
            </Typography>
          </Grid>
         
        </Grid>
      </form>
    </div>
  );
};

export default CategoryForm;
