import React from "react";
import {  Grid, IconButton, Tooltip } from "@material-ui/core";
import GridContainer from "./Grid/GridContainer";
import HomeIcon from "@material-ui/icons/Home";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


export default function BackHomeNavigator({ history }) {
    const navigateBack = ()=>{
        console.log("Navigating Back...")
        window.history.back();
    }
    const navigateHome = ()=>{
        console.log("Navigating Home...")
        history.push("/");
    }
    return (
        <>
            <GridContainer spacing={2}>
                <Grid item xs={12} container justify="space-evenly">
                    <Tooltip title="Back" arrow>
                        <IconButton color="primary" onClick={navigateBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Home" arrow>
                        <IconButton color="primary" onClick={navigateHome}>
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </GridContainer>
        </>
    );
}
