import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { login } from "../actions/userAction";
import  Form from './Form';
import SectionHeader  from '../components/molecules/SectionHeader/SectionHeader';
import  Section  from '../components/organisms/Section/Section';

const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 500,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const SigninSimple = ({ location, history }) => {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(userName, password));
  };
  const handleSignUp = (e) => {
    console.log("Clicked Sign Up");
    e.preventDefault();
    history.push("/signup");
  };

  return (
    <div>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            title="Sign in"
            titleProps={{
              variant: 'h3',
            }}
          />
           <Form /> 
        </div>
      </Section>

    </div>
  );
};

export default SigninSimple;