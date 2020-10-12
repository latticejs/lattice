import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { OrgContext } from './context';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import AccountIcon from '@material-ui/icons/AccountCircleOutlined';
import ChangePassword from './ChangePassword';
import KeyIcon from '@material-ui/icons/VpnKeyOutlined';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import OrgIcon from '@material-ui/icons/WorkOutlineOutlined';
import PlaceholderImg from './images/userPlaceholder.png';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useState } from 'react';
import classNames from 'classnames';
import httpHelper from './helper/httpHelper';

const useStyles = makeStyles((theme) =>
  createStyles({
    menuContainer: {
      background: '#fff',
      height: 'calc(100vh - 180px)',
      position: 'relative',
    },
    scrollDiv: {
      height: 'calc(100vh - 300px)',
      overflowY: 'auto',
    },
    userProfileAvatar: {
      height: 120,
      width: 120,
      borderRadius: 20,
      border: '1px solid #33333366',
    },
    secondaryBtn: {
      boxShadow: 'none',
      width: 150,
      borderRadius: 10,
      maxHeight: 48,
      padding: '18px 14px',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    btnLightColor: {
      backgroundColor: theme.palette.primary.light,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    errorColor: {
      color: '#EA4F4F',
    },
    actionBtnDiv: {
      position: 'absolute',
      bottom: 0,
      borderTop: '1px solid #33333322',
      width: '77%',
      backgroundColor: '#fff',
    },
    primaryBtn: {
      color: '#fff',
      fontSize: 18,
      textTransform: 'capitalize',
      maxHeight: '56px',
      padding: '16px 18px',
      boxShadow: '0px 0px 20px -4px rgba(51,36,5,0.37)',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    input: {
      display: 'none',
    },
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 'calc(100vh - 180px)',
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: '20%',
    },
    acntTab: {
      minWidth: 320,
    },
    tabContainer: {
      width: '80%',
    },
    showError: {
      color: '#DC143C',
    },
    viewImageCls: {
      height: 190,
      width: '100%',
    },
    breadcrumbsNavlink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    customNavlink: {
      textDecoration: 'none',
    },
    optTabs: {
      display: 'block',
      paddingLeft: 16,
    },
    tabSelectedBg: {
      backgroundColor: '#F0E5CB',
    },
  })
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const userObj = {};

const UserProfile = ({ showLoader }) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { loggedInUserDetails, idToken, updateUser } = useContext(OrgContext);
  const [selectedImage, setSelectedImage] = useState([]);
  const [error, setError] = useState({ status: false, message: '' });
  const [validateState, setValidateState] = useState({
    userError: { name: false },
  });

  const [isShowLoader, setShowLoader] = useState(false);

  if (loggedInUserDetails) {
    for (const key in loggedInUserDetails) {
      userObj[key] = loggedInUserDetails[key];
    }
  }
  const [userValue, setUserValue] = useState(userObj);
  const [viewSelectImage, setViewSelectImage] = useState('');
  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  if (!loggedInUserDetails) {
    showLoader(true);
    return false;
  }

  /**
   * @function imageUploadHandler
   * @description set patient image and view patient image
   */
  const imageUploadHandler = (e) => {
    const fileData = e.target.files;
    const viewImage = URL.createObjectURL(fileData[0]);
    setViewSelectImage(viewImage);
    setSelectedImage(fileData);
  };

  /**
   * @function removeImageHandler
   * @description remove selected image and set initial state
   */
  const removeImageHandler = () => {
    setViewSelectImage('');
    setSelectedImage([]);
    const updateUserValue = { ...userValue };
    updateUserValue.profile_photo = '';
    setUserValue(updateUserValue);
  };

  /**
   * @function inputChangeHandler
   * @description calling this method on chnage user value
   */
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    const updateUserObj = { ...userValue };
    let status = !value;

    setValidateState({
      ...validateState,
      userError: {
        ...validateState.userError,
        [name]: status,
      },
    });
    updateUserObj[name] = value;
    setUserValue(updateUserObj);
  };

  /**
   * @function updateProfileHandler
   * @param {string} profilePhoto default value null
   */
  const updateProfileHandler = (profilePhoto = '') => {
    setShowLoader(true);
    userValue.profile_photo = profilePhoto || userValue.profile_photo;

    const response = updateUser(userValue);

    if (response) {
      const message = 'Profile updated successfully';
      toast.success(message);
      setShowLoader(false);
    }
  };

  /**
   * @function imageUploadSuccessful
   * @param {data} get response from image successfully upload on server
   */
  const imageUploadSuccessful = (data) => {
    const profilePhoto = data.data[0].url;
    updateProfileHandler(profilePhoto);
  };

  /**
   * @function requestFailure
   * @param {error} when image not upload on server get error
   */
  const requestFailure = (e) => {
    setShowLoader(false);
    const error = {
      status: true,
      message: e.message,
    };
    setError(error);
  };

  /**
   * Upload Image function and start progress bar
   * @return {[type]} [description]
   */
  const uploadImage = () => {
    const data = new FormData();
    setShowLoader(true);
    data.append('image', selectedImage[0]);
    const httpObj = {
      url: 'storage/upload',
      method: 'POST',
      data,
      fileType: 'image',
      headers: { Authorization: `Bearer ${idToken}` },
    };
    httpHelper(httpObj, imageUploadSuccessful, requestFailure, false);
  };

  /**
   * Submit profile
   * @return {[boolean]} [retrun false if username and useremail is not valid]
   */
  const submitProfile = () => {
    if (validateState.userError.name || !userValue.name) {
      return false;
    }

    if (selectedImage.length > 0) {
      uploadImage();
    } else {
      updateProfileHandler();
    }
  };

  let userProfile = viewSelectImage || userValue.profile_photo;
  userProfile = userProfile || PlaceholderImg;

  return (
    <Fragment>
      {isShowLoader && showLoader(true)}
      <Box mx={4} mt={5}>
        <Typography variant="h2">
          <Box mb={1.5} mt={11} color="secondary.main">
            Your Profile
          </Box>
        </Typography>
        <Grid item md={12} lg={12}>
          <Box mb={2}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <NavLink className={classes.breadcrumbsNavlink} to="/">
                Organisation List
              </NavLink>
              <Typography color="textPrimary">User Profile</Typography>
            </Breadcrumbs>
          </Box>
        </Grid>
        <Grid container>
          <Grid item md={12} lg={12} className={classes.menuContainer}>
            <div className={classes.root}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                indicatorColor="primary"
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="Profile Options Tabs"
                className={classes.tabs}
              >
                <Tab
                  className={classes.acntTab}
                  classes={{
                    wrapper: classes.optTabs,
                    selected: classes.tabSelectedBg,
                  }}
                  label={
                    <Box display="flex">
                      <Box order={1}>
                        <AccountIcon style={{ verticalAlign: 'middle' }} />
                      </Box>
                      <Box order={2} mx={2} display="flex" alignItems="center">
                        <Typography variant="h4">Profile Information</Typography>
                      </Box>
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  className={classes.acntTab}
                  classes={{
                    wrapper: classes.optTabs,
                    selected: classes.tabSelectedBg,
                  }}
                  label={
                    <Box display="flex">
                      <Box order={1}>
                        <KeyIcon style={{ verticalAlign: 'middle' }} />
                      </Box>
                      <Box order={2} mx={2} display="flex" alignItems="center">
                        <Typography variant="h4">Account Credential</Typography>
                      </Box>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  className={classes.acntTab}
                  classes={{
                    wrapper: classes.optTabs,
                    selected: classes.tabSelectedBg,
                  }}
                  label={
                    <Box display="flex">
                      <Box order={1}>
                        <OrgIcon style={{ verticalAlign: 'middle' }} />
                      </Box>
                      <Box order={2} mx={2} display="flex" alignItems="center">
                        <Typography variant="h4">Your Organisation</Typography>
                      </Box>
                    </Box>
                  }
                  {...a11yProps(2)}
                />
              </Tabs>
              <TabPanel className={classes.tabContainer} value={selectedTab} index={0}>
                <Box mb={2}>
                  <Grid item md={12} lg={12}>
                    <Typography variant="h3" color="primary">
                      Profile Information
                    </Typography>
                  </Grid>
                </Box>
                <Grid item md={12} lg={12}>
                  <Divider />
                </Grid>
                <Box py={4} px={4}>
                  <Grid item md={12} lg={12}>
                    <Box display="flex">
                      <Box order={1}>
                        <Avatar variant="rounded" className={classes.userProfileAvatar} src={userProfile} />
                      </Box>
                      <Box order={2} ml={3}>
                        <Box component="span" display="block">
                          <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                            onChange={imageUploadHandler}
                          />
                          <label htmlFor="contained-button-file">
                            <Button
                              component="span"
                              variant="contained"
                              className={classNames(classes.secondaryBtn, classes.btnLightColor)}
                            >
                              Upload New
                            </Button>
                          </label>
                        </Box>
                        <Box component="span" display="block" mt={2}>
                          <Button
                            variant="contained"
                            className={classNames(classes.secondaryBtn, classes.errorColor)}
                            onClick={removeImageHandler}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    <span className={classes.showError}>{error.message ? error.message : ''}</span>
                  </Grid>
                </Box>
                <Box py={2} px={4}>
                  <Grid container>
                    <Grid item md={5} lg={5}>
                      <Box component="span" display="block">
                        <Typography> Full Name</Typography>
                      </Box>
                      <Box component="span" display="block">
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={userValue.name}
                          name="name"
                          onChange={inputChangeHandler}
                        />
                      </Box>
                      <span className={classes.showError}>{validateState.userError.name ? 'Enter the name.' : ''}</span>
                    </Grid>
                    <Grid item md={1} lg={1} />
                    <Grid item md={5} lg={5}>
                      <Box component="span" display="block">
                        <Typography> Email Address</Typography>
                      </Box>
                      <Box component="span" display="block">
                        <TextField fullWidth variant="outlined" name="email" value={userValue.email} disabled />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box py={2} px={4} className={classes.actionBtnDiv}>
                  <Grid item md={12} lg={12}>
                    <Button variant="contained" color="primary" className={classes.primaryBtn} onClick={submitProfile}>
                      Save Changes
                    </Button>
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel className={classes.tabContainer} value={selectedTab} index={1}>
                <ChangePassword userId={loggedInUserDetails.id} />
              </TabPanel>
              <TabPanel className={classes.tabContainer} value={selectedTab} index={2}>
                <Box mb={2}>
                  <Grid item md={12} lg={12}>
                    <Typography variant="h3" color="primary">
                      Your Organisation
                    </Typography>
                  </Grid>
                </Box>
                <Grid item md={12} lg={12}>
                  <Divider />
                </Grid>
                <Box py={4} px={4}>
                  <Grid item md={8} lg={8}>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="h5">Organisation Name</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h5">Your Role</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loggedInUserDetails.organization_member.map((org, index) => (
                            <TableRow key={index}>
                              <TableCell>{org.organization.name}</TableCell>
                              <TableCell>{org.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Box>
              </TabPanel>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default UserProfile;
