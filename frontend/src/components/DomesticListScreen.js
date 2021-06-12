import React, { useEffect, Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import { Table } from "react-bootstrap";
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import { Typography, Grid, Button,TextField} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Dialog from '@material-ui/core/Dialog'
import ConfirmDialog from './ConfirmDialog'
import DialogContent from '@material-ui/core/DialogContent'
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { deleteDomesticByProductId, listDomesticByProductId, updateDomesticByProductId } from "../actions/domesticAction";

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

const DomesticListScreen = ({ history, match }) => {
  let productId = match.params.id;
  console.log("productId : "+productId)

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [open, setOpen] = useState(() => false);
  const [confirmOpen, setConfirmOpen] = useState(() => false);
  const [editableRecord,setEditableRecord]  = useState(()=>{});
  const [action,setAction]  = useState(()=>{});

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(listDomesticByProductId(productId));
  }, [dispatch,productId]);

  const domesticList = useSelector(
    (state) => state.domesticListByProductId);
  const { loading,domestic,error } = domesticList;
  
  let renderDomestic = "";
  
  if (domestic && domestic.length > 0) {
    renderDomestic = domestic.map((eachRec) => (
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
            onClick={() => handleDelete(eachRec._id)}
          />
        </td>
        
      </tr>
    ));
  }

  const unitOfMessureChangeHandler = (unitOfMessure)=>{
    setEditableRecord({...editableRecord,unitOfMessure:unitOfMessure})
    console.log(editableRecord)
  }
  
  const sellingPriceChangeHandler = (sellPrice)=>{
    setEditableRecord({...editableRecord,sellingPrice:sellPrice})
    console.log(editableRecord)
  }

  const handleEdit = (record) => {
    setOpen(true)
    console.log("ID SELECTED : "+record._id)
    setEditableRecord(record);
    setAction("edit");
  }

  const handleDelete = (record) => {
    console.log("handleDelete Exec..."+record._id)
    setAction("delete");
    setConfirmOpen(true)
    console.log("ID SELECTED : "+record._id)
  }


  const createItemHandler = (product) => {
    console.log("Before Push  product :"+product)
    history.push('/admin/bulk/new/'+product);
  };

  const submitHandler=()=>{
    console.log("EXEC submitHandler")
    if(action==="edit"){
    console.log(editableRecord)
    dispatch(updateDomesticByProductId(editableRecord._id, editableRecord.unitOfMessure, editableRecord.sellingPrice));
    setOpen(false);
    setEditableRecord({})
    }else if(action==="delete"){
      console.log(editableRecord)
    dispatch(deleteDomesticByProductId(editableRecord._id));
    setOpen(false);
    }
  }


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
               onClick={() => createItemHandler(productId)}
               startIcon={<AddCircleOutlineRoundedIcon />}
              >
          DOMESTIC
          </Button>
         
        </GridItem>
        </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Domestic List </h4>
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
                    <tbody>{renderDomestic ? renderDomestic : ""}</tbody>
                  </Table>
                  
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <ConfirmDialog
    title="Delete Category ?"
    open={confirmOpen}
    setOpen={setConfirmOpen}
    onConfirm={()=>console.log("...DELETING")}
  >
    Are you sure you want to delete ?
  </ConfirmDialog>
        <Dialog open={open} onClose={()=>setOpen(false)}>
            <DialogContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Edit Bulk Record </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={submitHandler}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                            <TextField
                              className={classes.inputText}
                              placeholder="Units Of Messure"
                              variant="outlined"
                              name="unitOfMessure"
                              onChange={(e)=>unitOfMessureChangeHandler(e.target.value)}
                              type="text"
                              size="small"
                              value={editableRecord && editableRecord.unitOfMessure  ?editableRecord.unitOfMessure:""}
                              fullWidth
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                className={classes.inputText}
                                placeholder="Selling Price"
                                variant="outlined"
                                name="sellingPrice"
                                id="sellingPrice"
                                onChange={(e)=>sellingPriceChangeHandler(e.target.value)}
                                type="text"
                                size="small"
                                value={editableRecord && editableRecord.sellingPrice  ?editableRecord.sellingPrice:""}
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
    </>
  );
};

export default DomesticListScreen;
