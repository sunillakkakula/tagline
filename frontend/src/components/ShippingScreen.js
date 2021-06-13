import React from "react";
import { useDispatch} from "react-redux";
import { saveShippingAddress } from "../actions/cartAction";
import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Card from "./Card/Card";
import CardHeader from "./Card/CardHeader";
import CardBody from "./Card/CardBody";
import StepperScreen from "./StepperScreen";
import BackHomeNavigator from "./BackHomeNavigator";

import validate from "validate.js";
import { Section } from "./organisms";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
    // height: 200,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  textarea: {
    resize: "both",
    margin: "auto",
    padding: "1rem",
    alignContent: "center",
  },
  paper: {
    height: "45vh",
    width: "70vh",
  },
  inputText: {
    margin: "auto",
    padding: "1rem",
    alignContent: "center",
  },

  input: {
    "&::placeholder": {
      color: "gray",
      fontSize: "0.85rem",
      fontWeight: 500,
      fontFamily: "Roboto",
    },
    color: "gray", // if you also want to change the color of the input, this is the prop you'd use
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

const schema = {
  address: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 300,
    },
  },
  city: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 150,
    },
  },
  postalCode: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      minimum: 6,
      maximum: 6,
    },
  },
};

const ShippingScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  React.useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Handle handleSubmit .!")
    if (formState.isValid) {
      console.log(formState.values);
      dispatch(
        saveShippingAddress(formState.values.address, formState.values.city,formState.values.postalCode)
      );
      history.push("/payment");
    }

    setFormState((formState) => ({
      ...formState,
      touched: {
        ...formState.touched,
        ...formState.errors,
      },
    }));
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <>
     
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <BackHomeNavigator history={history} />
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <StepperScreen currentStep={0} />
        </GridItem>
      </GridContainer>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Shipping Details</h4>
            </CardHeader>
            <CardBody>
            <Section className={classes.section}>
              <div className={classes.formContainer} style={{marginBottom:"1rem"}}>
                <form onSubmit={handleSubmit}>
                  <Grid item xs={12} sm={12} md={12} align="center" style={{marginBottom:"1rem"}}>
                    <TextField
                      placeholder="Address"
                      variant="outlined"
                      size="medium"
                      name="address"
                      helperText={
                        hasError("address") ? formState.errors.address[0] : null
                      }
                      error={hasError("address")}
                      onChange={handleChange}
                      value={formState.values.address || ""}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} align="center" style={{marginBottom:"1rem"}}>
                  <TextField
                      placeholder="City"
                      variant="outlined"
                      size="medium"
                      name="city"
                      helperText={
                        hasError("city") ? formState.errors.city[0] : null
                      }
                      error={hasError("city")}
                      onChange={handleChange}
                      value={formState.values.city || ""}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} align="center" style={{marginBottom:"1rem"}}>
                  <TextField
                      placeholder="Postal Code"
                      variant="outlined"
                      size="medium"
                      name="postalCode"
                      helperText={
                        hasError("postalCode") ? formState.errors.postalCode[0] : null
                      }
                      error={hasError("postalCode")}
                      onChange={handleChange}
                      value={formState.values.postalCode || ""}
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} align="center">
                    <Button
                      size="large"
                      variant="contained"
                      type="submit"
                      color="primary"
                      // fullWidth
                    >
                      Proceed to Payment
                    </Button>
                    
                  </Grid>
                </form>
            </div>
            </Section>
            </CardBody>
          </Card>
    </>
  );
};

export default ShippingScreen;
