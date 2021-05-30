import React, { useEffect, Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import DialogContent from "@material-ui/core/DialogContent";
import { Table, Spinner } from "react-bootstrap";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import {
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  Dialog,
} from "@material-ui/core";
import Message from "../components/Message";
import { listCategories } from "../actions/categoryAction";
import {
  listSubCategoriesByCategoryId,
  updateSubCategory,
  deleteSubCategory,
} from "../actions/subCategoryAction";
import { SUB_CATEGORY_UPDATE_RESET } from "../constants/subCategoryConstants.js";
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

const SubCategoryListScreen = ({ history, match }) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [categorySelected, setCategorySelected] = useState(() => "");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(() => false);
  const [confirmOpen, setConfirmOpen] = useState(() => false);

  const [filteredSubCat, setFilteredSubCat] = useState(() => {});
  const [action, setAction] = useState(() => {});

  const subCategoryUpdate = useSelector((state) => state.subCategoryUpdate);
  const { loading, error, success_subcat_update } = subCategoryUpdate;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    console.log("useEffect Getting Called CategoryListScreen");
    setAction(() => "");
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listSubCategoriesByCategoryId(categorySelected));
  }, [dispatch, categorySelected]);

  const subCategoriesByCategory = useSelector(
    (state) => state.subCategoryListByCategory
  );

  let cats;
  if (categories) {
    console.log(categories);
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

  const handleChangeCategory = (e) => {
    console.log("Category Changed  " + e.target.value);
    setCategorySelected(() => e.target.value);
  };

  const createHandler = (category) => {
    history.push("/admin/subcategory/new");
  };

  const handleEdit = (subcatg) => {
    setOpen(true);
    console.log("ID SELECTED : " + subcatg._id);
    setFilteredSubCat(subcatg);
    setAction("edit");
  };

  const handleDelete = (subcatg) => {
    console.log("handleDelete Exec..." + subcatg._id);
    setAction("delete");
    setConfirmOpen(true);
    console.log("ID SELECTED : " + subcatg._id);
  };

  const nameChangeHandler = (nm) => {
    setFilteredSubCat({ ...filteredSubCat, name: nm });
    console.log(filteredSubCat);
  };

  const descChangeHandler = (dsc) => {
    setFilteredSubCat({ ...filteredSubCat, description: dsc });
    console.log(filteredSubCat);
  };

  const submitHandler = () => {
    console.log("EXEC submitHandler");
    if (action === "edit") {
      console.log(filteredSubCat);
      dispatch(
        updateSubCategory(
          filteredSubCat._id,
          filteredSubCat.name,
          filteredSubCat.description
        )
      );
      setOpen(false);
      setFilteredSubCat({});
    } else if (action === "delete") {
      console.log(filteredSubCat);
      dispatch(deleteSubCategory(filteredSubCat._id));
      setOpen(false);
    }
  };
  let renderContent = "";
  if (subcategories) {
    renderContent = (
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>
              <Typography className={classes.cardTitleGreen} align="center">
                Name
              </Typography>
            </th>
            <th>
              <Typography className={classes.cardTitleGreen} align="center">
                Decsription
              </Typography>
            </th>
            {/* First: add column header for Action */}
            <th>
              <Typography className={classes.cardTitleGreen} align="center">
                Action
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((eachsubcat) => (
            <tr key={eachsubcat._id}>
              <td>{eachsubcat.name}</td>
              <td>{eachsubcat.description}</td>
              <td>
                <EditRoundedIcon
                  style={{ color: "green" }}
                  onClick={() => handleEdit(eachsubcat)}
                />
                <DeleteOutlineIcon
                  style={{ color: "red" }}
                  onClick={() => handleDelete(eachsubcat)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  return (
    <Fragment>
      {/* {loading && <Spinner />}
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : ( */}
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Button
          variant="contained"
          color="primary"
          className={classes.button}
          style={{marginTop:"1rem",marginBottom:"1rem"}}
          onClick={() => createHandler()}
          startIcon={<AddCircleOutlineRoundedIcon />}
          >
          Sub Category
            </Button>
          </Grid>
          <Grid item xs={12}  style={{display: "flex", justifyContent: "center"}}>  
                <Select
                  labelId="category-controlled-open-select-label"
                  placeholder="Category"
                  value={categorySelected}
                  onChange={handleChangeCategory}
                  alignItems="center"
                  style={{ width: "40%" }}
                >
                  {renderCategoriesOptions}
                </Select>
           </Grid> 
          <Dialog open={open}>
            <DialogContent>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>Edit Category </h4>
                    </CardHeader>
                    <CardBody>
                      <form onSubmit={submitHandler}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Grid
                              container
                              spacing={1}
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={6}>
                                <TextField
                                  className={classes.inputText}
                                  placeholder="Name"
                                  variant="outlined"
                                  name="name"
                                  onChange={(e) =>
                                    nameChangeHandler(e.target.value)
                                  }
                                  type="text"
                                  size="small"
                                  value={
                                    filteredSubCat && filteredSubCat.name
                                      ? filteredSubCat.name
                                      : ""
                                  }
                                  fullWidth
                                  InputProps={{
                                    classes: { input: classes.input },
                                  }}
                                />
                              </Grid>

                              <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                justify="center"
                              >
                                <Grid item xs={6}>
                                  <TextField
                                    className={classes.inputText}
                                    placeholder="Description"
                                    variant="outlined"
                                    name="description"
                                    id="description"
                                    onChange={(e) =>
                                      descChangeHandler(e.target.value)
                                    }
                                    type="text"
                                    size="small"
                                    value={
                                      filteredSubCat &&
                                      filteredSubCat.description
                                        ? filteredSubCat.description
                                        : ""
                                    }
                                    fullWidth
                                    InputProps={{
                                      classes: { input: classes.input },
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                justify="center"
                              >
                                <Grid item xs={5} justify="center"></Grid>
                                <Grid item xs={2} justify="center">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                  >
                                    Update
                                  </Button>
                                </Grid>
                                <Grid item xs={5} justify="center"></Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </DialogContent>
          </Dialog>
          <Grid item xs={12} >
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Sub Categories </h4>
              </CardHeader>
              <CardBody>{renderContent ? renderContent : ""}</CardBody>
            </Card>
          </Grid>
        </Grid>
    </Fragment>
  )
}

export default SubCategoryListScreen;
