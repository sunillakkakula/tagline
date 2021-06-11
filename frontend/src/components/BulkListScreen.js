import React, { useEffect, Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import Spinner from "./controls/Spinner";
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import { Table } from "react-bootstrap";
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import { Typography, Grid, Button,TextField} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import {
  createBulkByProductId,
  listBulkByProductId,
  deleteBulkByProductId,
  updateBulkByProductId
} from "../actions/bulkAction";

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

const BulkListScreen = ({ history, match }) => {
  let productId = match.params.productId;
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  let renderproducts = "";
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(listBulkByProductId(productId));
  }, [dispatch,productId]);

  const bulkList = useSelector(
    (state) => state.bulkListByProductId);
  const { loading,bulk,error } = bulkList;
  
  let renderBulk = "";
  
  if (bulk && bulk.length > 0) {
    renderBulk = bulk.map((eachRec) => (
      <tr key={eachRec._id}>
        <td>{eachRec.unitOfMessure}</td>
        <td>{eachRec.sellingPrice}</td>
        <td>
          <EditRoundedIcon
            style={{ color: "green" }}
            onClick={() => handleEdit(eachRec)}
          />
        </td>
        <td>
          <DeleteOutlineIcon
            style={{ color: "red" }}
            onClick={() => deleteHandler(eachRec._id)}
          />
        </td>
        
      </tr>
    ));
  }

  const deleteHandler = (id) => {
    console.log(bulk)
    // if (window.confirm("Are you sure")) {
    //   dispatch(delete(id));
    // }
  };

  const handleEdit = (bulk) => {
    console.log(bulk)
    // setOpen(true)
    console.log("ID SELECTED : "+bulk._id)
    // setAction("edit");
  };

  return (
    <>
        <Fragment>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Button
               variant="contained"
               color="primary"
               className={classes.button}
               style={{marginTop:"1rem",marginBottom:"1rem"}}
               startIcon={<AddCircleOutlineRoundedIcon />}
              >
          BULK
          </Button>
         
        </GridItem>
        </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Bulk List </h4>
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
                            Unit Of Meassure
                          </Typography>
                        </th>
                        <th>
                          <Typography
                            className={classes.cardTitleGreen}
                            align="center"
                          >
                            Selling Price
                          </Typography>
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderBulk ? renderBulk : ""}</tbody>
                  </Table>
                  
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          </Fragment>
    </>
  );
};

export default BulkListScreen;
