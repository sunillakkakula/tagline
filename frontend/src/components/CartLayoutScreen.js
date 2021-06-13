import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
} from "../actions/cartAction";
import rupeeSvgIcon from "../assets/images/currency-inr.svg";
import {
  useMediaQuery,
  Grid,
  Typography,
  Button,
  IconButton,
  Icon,
  Divider,

} from "@material-ui/core";
import { Link } from "react-router-dom";
import { DeleteOutline } from "@material-ui/icons";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Card from "./Card/Card";
import CardHeader from "./Card/CardHeader";
import CardBody from "./Card/CardBody";
import BackHomeNavigator from "./BackHomeNavigator";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mainContainer: {
    marginTop: "5em",
    [theme.breakpoints.down("md")]: {
      marginTop: "3em"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "2em"
    }
  },
  heroTextContainer: {
    minWidth: "21em",
    maxWidth: "50em",
    marginLeft: "1em",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      maxWidth: "30em",
      marginTop: "2em",

    }
  },
  animation: {
    maxWidth: "50em",
    minWidth: "21em",
    // marginTop: "2em",
    marginLeft: "10%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "30em",
      marginTop: "2em",
    }
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    // whiteSpace: "nowrap",
    // marginBottom: theme.spacing(1),
  },
  childPaper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  imageIcon: {
    height: "1rem",
  },
  iconRoot: {
    textAlign: "center",
  },
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
}));

export default function CartLayoutScreen({ match, location, history }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const productId = match.params.id;
  const searchStringArray = location.search.split("&");
  console.log("searchStringArray : " + searchStringArray);
  let qty, uom, order, price;
  searchStringArray.forEach(function (item) {
    var tempField = item.split("=");
    switch (tempField[0]) {
      case "?qty":
        qty = Number(tempField[1]);
        break;
      case "uom":
        uom = tempField[1];
        break;
      case "order":
        order = tempField[1];
        break;
      case "price":
        price = Number(tempField[1]);
        break;
      default:
        break;
    }
  });
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty, uom, order, price));
    }
  }, [dispatch, productId, qty, uom, order, price]);

  const removeFromCartHandler = (id, indx) => {
    console.log("Id :" + id);
    dispatch(removeFromCart(id, indx));
  };

  const checkoutHandler = () => {
    history.push("/signin?redirect=shipping");
  };

  return (
    <div>
      <GridContainer style={{ marginBottom: "2rem" }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <BackHomeNavigator history={history} />
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Cart Items</h4>
            </CardHeader>
            <CardBody>
              {cartItems.length === 0 ? (
                <div>Empty Cart</div>
              ) : (

                <Grid container direction="column" className={classes.mainContainer}>
                  <Grid item>
                    <Grid container justify="flex-end" alignItems="center" direction="row">
                      <Grid sm item className={classes.heroTextContainer}>
                        <Paper className={classes.paper}>
                          {cartItems.map((item, index) => (
                            <>
                              <Grid
                                container
                                key={item.id + "-" + index}
                              >
                                <Grid item xs={2}>
                                  <img
                                    alt="Staples"
                                    style={{
                                      height: "3.5rem",
                                      width: "3.5rem",
                                    }}
                                    src={item.imageUrl}
                                  />
                                </Grid>

                                <Grid item xs={8} >
                                      <Grid container >
                                        <Grid item xs={6} >
                                          <Typography variant="body1" align="center">
                                            {item.name}
                                          </Typography>
                                          <Typography variant="body2" align="center">
                                            <Icon
                                              classes={{ root: classes.iconRoot }}
                                            >
                                              <img
                                                alt="curency inr"
                                                src={rupeeSvgIcon}
                                                className={classes.imageIcon}
                                              />
                                            </Icon>
                                            {item.unitPrice}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Typography variant="body2">
                                            UOM : {item.uom}
                                          </Typography>
                                          <Typography variant="body2">
                                            QTY :{item.quantityOrdered}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    {/* </Grid> */}
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      removeFromCartHandler(item.product, index)
                                    }
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              <Divider />
                            </>
                          ))}
                        </Paper>
                      </Grid>
                      <Grid sm item className={classes.animation}>
                        <Paper className={classes.paper}>
                          <Grid container spacing={1} data-aos="fade-up">
                            <Grid item xs={12}>
                              <Typography
                                variant="h6"
                                color="primary"
                                align={isMd ? "left" : "center"}
                              >
                                Subtotal (
                                {cartItems.reduce(
                                  (acc, item) => acc + item.quantityOrdered,
                                  0
                                )}
                                ) items
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Icon classes={{ root: classes.iconRoot }}>
                                <img
                                  alt="curency inr"
                                  src={rupeeSvgIcon}
                                  className={classes.imageIcon}
                                />
                              </Icon>
                              {cartItems
                                .reduce(
                                  (acc, item) =>
                                    acc + item.quantityOrdered * item.unitPrice,
                                  0
                                )
                                .toFixed(2)}
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                disabled={cartItems.length === 0}
                                size="small"
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={checkoutHandler}
                              >
                                Proceed To Checkout
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
              }
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
