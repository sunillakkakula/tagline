import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import  CategoryForm from './CategoryForm';
import  Section  from './organisms/Section/Section';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { Button, Grid } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 500,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const CategoryCreate = ({ location, history }) => {
  const classes = useStyles();
  
  
  return (
    <div>
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
          </Grid>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
           <CategoryForm location={location} history={history}/> 
        </div>
      </Section>

    </div>
  );
};

export default CategoryCreate;