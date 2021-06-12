import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import validate from 'validate.js';
import { useDispatch, useSelector } from "react-redux";
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import { createDomesticByProductId} from "../actions/domesticAction";
import { listProductDetailsByProductId} from "../actions/productAction";
const useStyles = makeStyles(theme => ({
  root: { 
    width: '100%',
  },
}));

const schema = {
  unitOfMessure: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
  sellingPrice: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
};

const DomesticItemForm = (props) => {
  const classes = useStyles();
  const productId = props.product;
  let history = props.history;

  const dispatch = useDispatch();
  console.log("ProductId  from DomesticItemForm Create :==>  "+productId)
  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const productDetailsByProductId = useSelector(
    (state) => state.productDetailsByProductId
  );
  
  console.log("productDetailsByProductId ")
  console.log(productDetailsByProductId)

  const {loading,error,product} = productDetailsByProductId;

  if (product) {
    console.log("Success Response from Product Details ID #  "+product._id+" , Name : "+product.name);
  }

  useEffect(() => {
    dispatch(listProductDetailsByProductId(productId));
  }, [dispatch,productId]);

  React.useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);
  
  const domesticCreateByProductId = useSelector(
    (state) => state.domesticCreateByProductId
  );
 
  if(domesticCreateByProductId && domesticCreateByProductId.success_create){
    console.log("Success Response to redirecting to Domestic List");
        history.push(`/admin/product-domestic/${productId}`);
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
      dispatch(createDomesticByProductId(product._id,formState.values.unitOfMessure , formState.values.sellingPrice));
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
      <GridContainer spacing={2} alignItems="center" justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}> Domestic Item Entry </h4>
              </CardHeader>
              <CardBody>
      <form name="password-reset-form" method="post" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField  
              placeholder=""
              variant="outlined"
              size="medium"
              name="Id"
              value={product._id}
              fullWidth
              type="text"
              disabled
            />
          </Grid>
        <Grid item xs={12}>
            <TextField  
              placeholder=""
              variant="outlined"
              size="medium"
              name="name"
              value={product.name}
              fullWidth
              type="text"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField  
              placeholder="Unit Of Messure"
              label="Unit Of Messure*"
              variant="outlined"
              size="medium"
              name="unitOfMessure"
              fullWidth
              helperText={hasError('unitOfMessure') ? formState.errors.unitOfMessure[0] : null}
              error={hasError('unitOfMessure')}
              onChange={handleChange}
              type="text"
              value={formState.values.unitOfMessure || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="SellingPrice"
              label="SellingPrice *"
              variant="outlined"
              size="medium"
              name="sellingPrice"
              fullWidth
              helperText={
                hasError('sellingPrice') ? formState.errors.sellingPrice[0] : null
              }
              error={hasError('sellingPrice')}
              onChange={handleChange}
              type="sellingPrice"
              value={formState.values.sellingPrice || ''}
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
   </CardBody>
   </Card>
   </GridItem>
   </GridContainer>
    </div>
  );
};

export default DomesticItemForm;
