import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ZipCodeTracker from "./ZipCodeTracker";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import $ from "jquery";
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

// import logo from "./assets/images/logo.jpg"
import logo from "../assets/images/logo.jpg"
import ShoppingCartCountScreen from './ShoppingCartCountScreen';
import { ShoppingBasketRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appLogo: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    fontStyle:'roboto',
    fontFamily:'roboto',
    color:'white',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function CustomHeader() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const getCurrentLocationZipCode = () => {
    let latitude = 0.0;
    let longitude = 0.0;
    const KEY = "AIzaSyDt-KMX0JInMJHvQ55xBfCGE0YkXh4P7Ys";
    const errorCB = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    const successCB = (pos) => {
      let crd = pos.coords;
      console.log(`Latitude : ${crd.latitude} Longitude: ${crd.longitude}`);
      latitude = `${crd.latitude}`;
      longitude = `${crd.longitude}`;
      const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${KEY}`;
      console.log(
        `Now Fetching the Zip Code for  ${crd.latitude} Longitude: ${crd.longitude} `
      );

      fetch(URL)
        .then((response) => response.json())
        .then((results) => {
          console.log(results);
          const zip_code = results.results[0].address_components.find(
            (addr) => addr.types[0] === "postal_code"
          ).short_name;
          console.log("zip_code : " + zip_code);
          $("#zip_code").html("Deliver to " + zip_code);
        });
    };
    const accuracyOptions = {
      enableHighAccuracy: true,
    };
    navigator.geolocation.getCurrentPosition(
      successCB,
      errorCB,
      accuracyOptions
    );
  };
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <ShoppingBasketRounded />
              </Badge>
            </IconButton>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={() => {
          getCurrentLocationZipCode();
        }}>
      <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
               <RoomOutlinedIcon
        onClick={() => {
          getCurrentLocationZipCode();
        }}
      />
            </IconButton>
           
      <div id="zip_code" style={{ fontSize: "0.85rem" ,justifyItems:"center"}} />
        
        <p>ZipCode</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="fixed" style={{maxHeight:"3.5rem"}}>
        <Toolbar style={{maxHeight:"3rem"}}>
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <img
              className="img-thumbnail"
              alt=" Logo"
              src={logo}
              style={{
                height: "2.75rem",
                width: "2.75rem",
              }}
            />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
            Tagline
          </Typography>
         
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <ShoppingBasketRounded />
              </Badge>
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
               <RoomOutlinedIcon
        onClick={() => {
          getCurrentLocationZipCode();
        }}
      />
            </IconButton>
           
          <div id="zip_code" style={{ fontSize: "0.85rem" }}/>
        </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
