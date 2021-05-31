import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, TextField, Select, MenuItem } from '@material-ui/core';
import validate from 'validate.js';
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryAction";
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import { createProduct } from "../actions/productAction";

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
  brand: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 300,
    },
  },
  countInStock: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  isTaxable: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  taxPercent: {
    presence: { allowEmpty: false, message: 'is required' },
  }
  

};

const ProductCreateForm = ({ location, history }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [categorySelected, setCategorySelected] = useState(() => "");
  const [subCategorySelected, setSubCategorySelected] = useState(() => "");

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

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product, success } = productCreate;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  if (categories) console.log(categories);
  let cats = categories ? categories.categories : [];

  let renderCategoriesOptions = "";
  if (cats && cats.length > 0) {
    renderCategoriesOptions = cats.map((eachCategory, idx) => {
      return (
        <MenuItem key={idx} value={eachCategory._id}>
          {eachCategory.name}
        </MenuItem>
      );
    });
  }

  let renderSubCategoriesOptions = "";
  if (categorySelected) {
    let filteredCategory = [];
    filteredCategory = cats.filter(function (eachCategory) {
      return (
        eachCategory._id === categorySelected &&
        eachCategory.subCategories.length > 0
      );
    });
    if (
      filteredCategory[0] &&
      filteredCategory[0].subCategories &&
      filteredCategory[0].subCategories.length
    ) {
      renderSubCategoriesOptions = filteredCategory[0].subCategories.map(
        (eachSubCategory) => {
          return (
            <MenuItem key={eachSubCategory.id} value={eachSubCategory.id}>
              {eachSubCategory.name}
            </MenuItem>
          );
        }
      );
    }
  }
  if (success) {
    console.log("Success Response to redirecting to Products List");
    history.push("/admin/products");
  }

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   console.log(
  //     "name : " +
  //       name +
  //       " , description : " +
  //       description +
  //       " , brand : " +
  //       brand +
  //       " , countInStock : " +
  //       countInStock +
  //       " , isTaxble : " +
  //       isTaxble +
  //       " , taxPercent : " +
  //       taxPercent
  //   );
  //   dispatch(
  //     createProduct({
  //       name,
  //       brand,
  //       categorySelected,
  //       subCategorySelected,
  //       description,
  //       countInStock,
  //       isTaxble,
  //       taxPercent,
  //     })
  //   );
  // };

  const handleChangeCategory = (e) => {
    setCategorySelected(() => e.target.value);
  };
  const handleChangeSubCategory = (e) => {
    console.log("Exc handleChangeSubCategory" + e.target.value);
    setSubCategorySelected(e.target.value);
  };
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
    console.log(formState.values,categorySelected,subCategorySelected)
    
    if (formState.isValid) {
      console.log(formState.values,categorySelected,subCategorySelected)
      dispatch(
        createProduct(
          formState.values,
          formState.values.brand,
          formState.values.description,
          formState.values.countInStock,
          formState.values.isTaxble,
          formState.values.taxPercent,
          categorySelected,
          subCategorySelected
        )
      );
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
              <h4 className={classes.cardTitleWhite}> Product </h4>
            </CardHeader>
            <CardBody>
              <form name="password-reset-form" method="post" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <Select
                      value={categorySelected}
                      onChange={handleChangeCategory}
                      placeholder="Category"
                      style={{ width: "10rem" }}
                    >
                      {renderCategoriesOptions}
                    </Select>
                  </Grid>
                  <Grid item xs={12} >
                    {/* <Select
                      value={subCategorySelected}
                      onChange={handleChangeSubCategory}
                      placeholder="SubCategory"
                      style={{ width: "10rem" }}
                    >
                      {renderSubCategoriesOptions}
                    </Select> */}
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
                    <TextField
                      placeholder="Brand"
                      label="Brand*"
                      variant="outlined"
                      size="medium"
                      name="brand"
                      fullWidth
                      helperText={hasError('brand') ? formState.errors.brand[0] : null}
                      error={hasError('brand')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.brand || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="Count In Stock"
                      label="Count In Stock*"
                      variant="outlined"
                      size="medium"
                      name="countInStock"
                      fullWidth
                      helperText={hasError('countInStock') ? formState.errors.countInStock[0] : null}
                      error={hasError('countInStock')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.countInStock || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="isTaxable"
                      label="is Taxable*"
                      variant="outlined"
                      size="medium"
                      name="isTaxable"
                      fullWidth
                      helperText={hasError('isTaxable') ? formState.errors.isTaxable[0] : null}
                      error={hasError('isTaxable')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.isTaxable || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="taxPercent"
                      label="taxPercent*"
                      variant="outlined"
                      size="medium"
                      name="taxPercent"
                      fullWidth
                      helperText={hasError('taxPercent') ? formState.errors.taxPercent[0] : null}
                      error={hasError('taxPercent')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.taxPercent || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <Button
                         size="small"
                         variant="contained"
                         type="submit"
                         color="primary"
                         fullWidth
                          >
                            Create
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

export default ProductCreateForm;
