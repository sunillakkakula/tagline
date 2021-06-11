import React, { useEffect, Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Spinner from "../components/controls/Spinner";
import { MenuItem } from "@material-ui/core";
import GridItem from "../components/Grid/GridItem.js";
import GridContainer from "../components/Grid/GridContainer.js";
import Card from "../components/Card/Card.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardBody from "../components/Card/CardBody.js";
import { Table } from "react-bootstrap";
import Paginate from "../components/Paginate";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Dialog from '@material-ui/core/Dialog'
import ConfirmDialog from './ConfirmDialog'
import DialogContent from '@material-ui/core/DialogContent'
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import BusinessIcon from '@material-ui/icons/Business';
import HomeIcon from '@material-ui/icons/Home';
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { Typography, Grid, Button,  Select ,TextField} from "@material-ui/core";
import {
  deleteProduct,
  listProductsByCategoryId,
  listProductsBySubCategoryId,
  updateProduct
} from "../actions/productAction";
import { listCategories } from "../actions/categoryAction";
import { listSubCategoriesByCategoryId } from "../actions/subCategoryAction";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleGreen: {
    color: "#26A541",
    marginTop: "0px",
    minHeight: "auto",
    fontFamily: "Roboto",
    marginBottom: "3px",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "capitalize",
    textAlign: "left",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const ProductListScreen = ({ history, match }) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const pageNumber = match.params.pageNumber || 1;

  const [categorySelected, setCategorySelected] = useState(() => "");
  const [subCategorySelected, setSubCategorySelected] = useState(() => "");

  const [open, setOpen] = useState(() => false);
  const [confirmOpen, setConfirmOpen] = useState(() => false);
  const [filteredProduct,setFilteredProduct ] = useState(()=>{});
  const [action,setAction]  = useState(()=>{});


  const dispatch = useDispatch();

  const handleChangeCategory = (e) => {
    console.log("Category Changed  " + e.target.value);
    setCategorySelected(() => e.target.value);
    setSubCategorySelected(() => "");
  };
  const handleChangeSubCategory = (e) => {
    console.log("Sub Category Changed  " + e.target.value);
    setSubCategorySelected(() => e.target.value);
  };

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  useEffect(() => {
    dispatch(listSubCategoriesByCategoryId(categorySelected));
  }, [dispatch, categorySelected]);

  useEffect(() => {
    dispatch(listProductsBySubCategoryId(subCategorySelected));
  }, [dispatch, subCategorySelected]);

  const nameChangeHandler = (nm)=>{
    setFilteredProduct({...filteredProduct,name:nm})
  }

  const descChangeHandler = (dsc)=>{
    setFilteredProduct({...filteredProduct,description:dsc})
  }

  const countInStockHandler = (cis)=>{
    setFilteredProduct({...filteredProduct,countInStock:cis})
  }

  const taxPercentHandler = (tp)=>{
    setFilteredProduct({...filteredProduct,taxPercent:tp})
  }

  const isTaxableChangeHandler = (it)=>{
    setFilteredProduct({...filteredProduct,isTaxable:it})
  }
  
  const brandChangeHandler = (brd)=>{
    setFilteredProduct({...filteredProduct,brand:brd})
  }
  
  const productListBySubCategory = useSelector(
    (state) => state.productListBySubCategory
  );
  const { products, page, pages } = productListBySubCategory;

  const subCategoriesByCategory = useSelector(
    (state) => state.subCategoryListByCategory
  );
  let cats=[];
  if (categories) {
    cats = categories.categories;
  }

  const { subcategories } = subCategoriesByCategory;

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

  let renderproducts = "";

  if (products && products.length > 0) {
    renderproducts = products.map((product) => (
      <tr key={product._id}>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td>{product.countInStock}</td>
        <td>{product.taxPercent}</td>
        <td>{product.brand}</td>
        <td>{product.isTaxable}</td>
        <td>
          <EditRoundedIcon
            style={{ color: "green" }}
            onClick={() => handleEdit(product)}
          />
        </td>
        <td>
          <DeleteOutlineIcon
            style={{ color: "red" }}
          />
        </td>
        <td>
        <SettingsIcon
            style={{ color: "green" }}
          />
        <HomeIcon
            style={{ color: "green" }}
            onClick={() => handleDomestic(product._id)}
          />
        </td>
        <td>
          <SettingsIcon
            style={{ color: "green" }}
          />
          <BusinessIcon
          style={{ color: "green" }}
          onClick={() => handleBusiness(product._id)}
        />
        </td>
      </tr>
    ));
  }

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo.role === "ROLE_ADMIN") history.push("/login");
    if (successCreate) {
      history.push("/admin/products");
    } else {
      dispatch(listProductsByCategoryId());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleEdit = (product) => {
    console.log(product)
    setOpen(true)
    console.log("ID SELECTED : "+product._id)
    setFilteredProduct(product);
    setAction("edit");
  };
  const handleSettings = (id) => {
    history.push(`/admin/product-settings/${id}`);
  };
  const handleDomestic = (id) => {
    history.push(`/admin/product-domestic/${id}`);
  };
  const handleBusiness = (id) => {
    history.push(`/admin/product-business/${id}`);
  };
  const createProductHandler = (product) => {
    history.push("/admin/product/new");
  };

  const submitHandler=()=>{
    console.log("EXEC submitHandler")
    if(action==="edit"){
    console.log(filteredProduct)
    // dispatch(updateProduct(filteredProduct._id, filteredProduct.name, filteredProduct.description,filteredProduct.countInStock,filteredProduct.isTaxable,filteredProduct.taxPercent,filteredProduct.isTaxable,filteredProduct.brand));
    dispatch(updateProduct(filteredProduct));
    setOpen(false);
    setFilteredProduct({})
    }else if(action==="delete"){
      console.log(filteredProduct)
    dispatch(deleteProduct(filteredProduct._id));
    setOpen(false);
    }
  }

  return (
    <>
      {loadingDelete && <Spinner />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Spinner />}
      {errorCreate && <Message variant="info">{errorCreate}</Message>}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Fragment>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Button
               variant="contained"
               color="primary"
               className={classes.button}
               style={{marginTop:"1rem",marginBottom:"1rem"}}
               onClick={() => createProductHandler()}
               startIcon={<AddCircleOutlineRoundedIcon />}
              >
          Product
          </Button>
         
        </GridItem>
           <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
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
              </GridContainer>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Products </h4>
                </CardHeader>
                <CardBody>
                  <Table striped bordered hover responsive className="table-sm">
                    <thead>
                      <tr>
                        <th>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center"
                          >
                            Name
                          </Typography>
                        </th>
                        <th>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center"
                          >
                            Description
                          </Typography>
                        </th>
                        <th style={{width:"2rem"}}>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center" 
                          >
                            Stock#
                          </Typography>
                        </th>
                        <th style={{width:"2rem"}}>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center" 
                          >
                            Tax %
                          </Typography>
                        </th>
                        <th>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center"
                          >
                            Brand
                          </Typography>
                        </th>
                        <th style={{width:"2rem"}}>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center" 
                          >
                            Taxable?
                          </Typography>
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderproducts ? renderproducts : ""}</tbody>
                  </Table>
                  <Paginate pages={pages} page={page} isAdmin={true} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <Dialog open={open} onClose={()=>setOpen(false)}>
            <DialogContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Edit Product </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={submitHandler}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="Name"
                              variant="outlined"
                              name="name"
                              onChange={(e)=>nameChangeHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={filteredProduct && filteredProduct.name  ?filteredProduct.name:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                            />
                      </Grid>
                      <Grid item xs={12}>
                            <TextField
                                className={classes.inputText}
                                placeholder="Description"
                                variant="outlined"
                                name="description"
                                id="description"
                                onChange={(e)=>descChangeHandler(e.target.value)}
                                type="text"
                                size="small"
                                value={filteredProduct && filteredProduct.description  ?filteredProduct.description:""}
                                fullWidth
                                InputProps={{
                                  classes: { input: classes.input },
                                }}
                              />
                      </Grid>
                       <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="In Stock #"
                              variant="outlined"
                              name="countInStock"
                              id="countInStock"
                              onChange={(e)=>countInStockHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={filteredProduct && filteredProduct.countInStock  ?filteredProduct.countInStock:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                            />
                      </Grid>
                      <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="Tax Percent"
                              variant="outlined"
                              name="countInStock"
                              onChange={(e)=>taxPercentHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={filteredProduct && filteredProduct.taxPercent  ?filteredProduct.taxPercent:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                            />
                      </Grid>
                      <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="Brand"
                              variant="outlined"
                              name="brand"
                              onChange={(e)=>brandChangeHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={filteredProduct && filteredProduct.brand  ?filteredProduct.brand:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                            />
                      </Grid>
                      <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="Brand"
                              variant="outlined"
                              name="brand"
                              onChange={(e)=>isTaxableChangeHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={filteredProduct && filteredProduct.isTaxable  ?filteredProduct.isTaxable:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
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
                                UPDATE
                              </Button>
                            </Grid>
                    </Grid>
                  </form>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
            </DialogContent>
        </Dialog>
        </Fragment>
      )}
    </>
  );
};

export default ProductListScreen;
