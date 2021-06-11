import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import  Section  from './organisms/Section/Section';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { Button, Grid } from "@material-ui/core";
import BulkItemForm from "./BulkItemForm";
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

const BulkItemCreate = ({ location, history ,match}) => {
  const classes = useStyles();
  let productId = match.params.id;
  console.log(" From BulkItemCreate : "+productId)
  return (
    <div>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{marginTop:"1rem",marginBottom:"1rem"}}
          startIcon={<ArrowBackIosIcon />}
          >
          </Button>
          </Grid>
          </Grid>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
           <BulkItemForm location={location} history={history} product ={productId}/> 
        </div>
      </Section>

    </div>
  );
};

export default BulkItemCreate;