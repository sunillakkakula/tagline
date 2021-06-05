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
import { listSubCategoriesByCategoryId } from "../actions/subCategoryAction";

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
  },
  imageUrl: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  isVttBestSeller: {
    presence: { allowEmpty: false, message: 'is required' },
  },

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
  
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product, success_create } = productCreate;

  
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    dispatch(listSubCategoriesByCategoryId(categorySelected));
  }, [dispatch, categorySelected]);

  const subCategoriesByCategory = useSelector(
    (state) => state.subCategoryListByCategory
  );
  const { subcategories } = subCategoriesByCategory;
  // console.log(subcategories);
  
  let cats = [];
  if (categories) //console.log(categories);
    cats = categories ? categories.categories : [];

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
  if (subcategories && subcategories.length > 0) {
    renderSubCategoriesOptions = subcategories.map((eachSubCategory, idx) => {
      return (
        <MenuItem key={idx} value={eachSubCategory._id}>
          {eachSubCategory.name}
        </MenuItem>
      );
    });
  }
  if (success_create) {
    console.log("Success Response to redirecting to Products List");
    history.push("/admin/products");
  }

    const handleChangeCategory = (e) => {
    console.log("Category Changed  " + e.target.value);
    setCategorySelected(() => e.target.value);
    setSubCategorySelected(() => "");
  };

  const handleChangeSubCategory = (e) => {
    console.log("Sub Category Changed  " + e.target.value);
    setSubCategorySelected(() => e.target.value);
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
    console.log("EXEC handleSubmit()...")
    console.log(formState.values,subCategorySelected)
    
    if (formState.isValid) {
      console.log(formState.values,subCategorySelected)
      dispatch(
        createProduct(
          formState.values.name,
          formState.values.brand,
          formState.values.description,
          formState.values.countInStock,
          formState.values.isTaxable,
          formState.values.taxPercent,
          formState.values.imageUrl,
          formState.values.isVttBestSeller,
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
                <Grid item xs={6} style={{display:"flex" , justifyContent:"center"}}>
                    <Select
                      value={categorySelected}
                      onChange={handleChangeCategory}
                      placeholder="Category"
                      style={{ width: "10rem" }}
                    >
                      {renderCategoriesOptions}
                    </Select>
                  </Grid>
                  <Grid item xs={6} style={{display:"flex" , justifyContent:"center"}}>
                    <Select
                      value={subCategorySelected}
                      onChange={handleChangeSubCategory}
                      placeholder="SubCategory"
                      style={{ width: "10rem" }}
                    >
                      {renderSubCategoriesOptions}
                    </Select>
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
                    <TextField
                      placeholder="imageUrl"
                      label="imageUrl*"
                      variant="outlined"
                      size="medium"
                      name="imageUrl"
                      fullWidth
                      helperText={hasError('imageUrl') ? formState.errors.imageUrl[0] : null}
                      error={hasError('imageUrl')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.imageUrl || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="isVttBestSeller"
                      label="isVttBestSeller*"
                      variant="outlined"
                      size="medium"
                      name="isVttBestSeller"
                      fullWidth
                      helperText={hasError('isVttBestSeller') ? formState.errors.isVttBestSeller[0] : null}
                      error={hasError('isVttBestSeller')}
                      onChange={handleChange}
                      type="text"
                      value={formState.values.isVttBestSeller || ''}
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
