import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { createOrder } from "../actions/orderAction";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import {
  Button,
  Paper,
  useMediaQuery,
  Grid,
  Typography,
  Icon,
  Card,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import rupeeSvgIcon from "../assets/images/currency-inr.svg";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import StepperScreen from "./StepperScreen";
import CustomBackdropSpinner from "./CustomBackdropSpinner";
import BackHomeNavigator from "./BackHomeNavigator";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mainContainer: {
    marginTop: "4em",
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
      marginTop: "1em",

    }
  },
  animation: {
    maxWidth: "50em",
    minWidth: "21em",
    // marginTop: "2em",
    // marginLeft: "10%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "50em",
      minWidth: "21em",
      marginTop: "1em",
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
const PlaceOrderScreen = ({ history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [payMethod, setPayMethod] = useState("");

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantityOrdered,
      0
    )
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.05 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      // let cartItems = localStorage.getItem("paymentMethod");
      console.log(
        "localStorage.getItem(paymentMethod : " +
        localStorage.getItem("paymentMethod")
      );
      setPayMethod(localStorage.getItem("paymentMethod"));
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    console.log("EXEC placeOrderHandler ...!");
    console.log(cart);
    dispatch(
      createOrder({
        user: userInfo[0]._id,
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      {order && <CustomBackdropSpinner />}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <BackHomeNavigator history={history} />
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer >
        <GridItem xs={12} >
          <StepperScreen currentStep={2} />
        </GridItem>
      </GridContainer>
      {cart.cartItems.length === 0 ? (<Message>Your cart is empty</Message>) : ""}
      <Grid container direction="column" className={classes.mainContainer}>
        <Grid item>
          <Grid container justify="flex-end" alignItems="center" direction="row">
            <Grid sm item className={classes.heroTextContainer}>
              <Paper className={classes.paper}>
                <form onSubmit={placeOrderHandler}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid conatiner>
                        <Grid item xs={12}>
                          <Typography variant="h6">Shipping Details</Typography>
                          <Divider />
                        </Grid>
                        <Grid item xs={12} style={{ margin: ".5rem" }}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid item xs={3}>
                                  <Typography variant="body1">
                                    Address
                                  </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                  <Typography variant="body1">
                                    {cart.shippingAddress.address}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid item xs={3}>
                                  <Typography variant="body1">City</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                  <Typography variant="body1">
                                    {" "}
                                    {cart.shippingAddress.city}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid item xs={3}>
                                  <Typography variant="body1">
                                    Postal Code
                                  </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                  <Typography variant="body1">
                                    {cart.shippingAddress.postalCode}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6">Order Details</Typography>
                          <Divider />
                        </Grid>
                        {cart.cartItems.map((item, index) => (
                          <Grid item key={index} style={{ margin: ".5rem" }}>
                            <Grid container>
                              <Grid item xs={3}>
                                <img
                                  className="img-thumbnail"
                                  src={item.imageUrl}
                                  alt={item.name}
                                  style={{
                                    height: "3.5rem",
                                    width: "3.5rem",
                                    marginRight: "5rem",
                                  }}
                                />
                              </Grid>
                              <Grid item xs={9}>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{
                                      justify: "center",
                                      alignContent: "center",
                                      marginRight: "1rem",
                                      marginTop: "1rem",
                                    }}
                                  >
                                    <Link to={`/product/${item.product}`}>
                                      <Typography variant="body1">
                                        {item.name}
                                      </Typography>
                                    </Link>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography >
                                      {item.quantityOrdered} X{" "}
                                      <Icon classes={{ root: classes.iconRoot }}>
                                        <img
                                          alt="curency inr"
                                          src={rupeeSvgIcon}
                                          className={classes.imageIcon}
                                        />
                                      </Icon>
                                      {item.unitPrice}
                                    </Typography>
                                  </Grid>
                                  
                                  <Grid item xs={4}>
                                    <Typography
                                      color="primary"
                                      align={isMd ? "left" : "center"}>
                                        =
                                      <Icon classes={{ root: classes.iconRoot }}>
                                        <img
                                          alt="curency inr"
                                          src={rupeeSvgIcon}
                                          className={classes.imageIcon}
                                        />
                                      </Icon>


                                      {item.quantityOrdered * item.unitPrice}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Divider />
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography variant="h6">
                                Payment Details
                                <Divider />
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="body1">
                                Payment Method
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <Typography variant="body1">
                                {cart.paymentMethod}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
            <Grid sm item className={classes.animation}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Order Summary</Typography>
                <Divider />
                <Grid container spacing={1} row="true" justify="center">
                  <Grid item xs={12} justify="center">
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="body1">Items Cost</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <Icon classes={{ root: classes.iconRoot }}>
                            <img
                              alt="curency inr"
                              src={rupeeSvgIcon}
                              className={classes.imageIcon}
                            />
                          </Icon>
                          {cart.itemsPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="body1">Shipping Cost</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <Icon classes={{ root: classes.iconRoot }}>
                            <img
                              alt="curency inr"
                              src={rupeeSvgIcon}
                              className={classes.imageIcon}
                            />
                          </Icon>
                          {cart.shippingPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="body1">Tax</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <Icon classes={{ root: classes.iconRoot }}>
                            <img
                              alt="curency inr"
                              src={rupeeSvgIcon}
                              className={classes.imageIcon}
                            />
                          </Icon>
                          {cart.taxPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="body1">Total</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          <Icon classes={{ root: classes.iconRoot }}>
                            <img
                              alt="curency inr"
                              src={rupeeSvgIcon}
                              className={classes.imageIcon}
                            />
                          </Icon>
                          {cart.totalPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {error && <Message variant="danger">{error}</Message>}
                  </Grid>
                  <Grid item xs={12} align="center">
                    <Button
                      size="small"
                      variant="contained"
                      type="submit"
                      color="primary"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems === 0}
                      justify="center"
                    >
                      Place Order
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
