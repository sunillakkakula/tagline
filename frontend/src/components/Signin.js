import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from './LoginForm';
import Section from '../components/organisms/Section/Section';
import GridContainer from "./Grid/GridContainer";
import GridItem from "./Grid/GridItem";
import Card from "./Card/Card";
import CardHeader from "./Card/CardHeader";
import CardBody from "./Card/CardBody";

const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(50vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 300,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const Signin = ({ location, history }) => {
  const classes = useStyles();


  return (
    <div>
      <GridContainer spacing={2} alignItems="center" justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}> Sign In </h4>
            </CardHeader>
            <CardBody>
              <Section className={classes.section}>
                <div className={classes.formContainer}>
                  <LoginForm location={location} history={history} />
                </div>
              </Section>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

    </div>
  );
};

export default Signin;