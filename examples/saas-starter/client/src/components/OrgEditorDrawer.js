import { Avatar, Badge, Box, Button, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { OrgContext } from '../context';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import EditIcon from '@material-ui/icons/Edit';
import PlaceholderImg from '../images/orgPlaceholder.png';
import React, { Fragment, useContext, useState } from 'react';
import classNames from 'classnames';
import httpHelper from '../helper/httpHelper';

/**
 * Set OrgEditorDrawer Component style
 */
const useStyles = makeStyles((theme) => ({
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
  cancelBtn: {
    maxHeight: '56px',
    padding: '16px 18px',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
  usrProfilePic: {
    height: 160,
    width: 160,
    border: '1px solid #33333388',
    objectFit: 'contain',
  },
  orgImg: {
    objectFit: 'contain',
    padding: 10,
  },
  profilePicAction: {
    backgroundColor: '#f9f9f9',
    borderRadius: 3,
    border: '0.5px solid #33333322',
    padding: 8,
    '&:hover': {
      backgroundColor: '#f9f9f9',
      border: '0.5px solid #33333322',
    },
  },
  icoInput: {
    display: 'none',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    marginBottom: 32,
  },
  colorBox: {
    cursor: 'pointer',
    height: 52,
    width: 52,
    borderRadius: 8,
    marginRight: 24,
    boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.26)',
    '&:hover': {
      boxShadow: 'none',
      transform: 'scale(0.98)',
    },
  },
  selectedTheme: {
    border: '4px solid #00a6fb',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
      transform: 'none',
    },
  },
}));

/**
 * Set skinColors data
 */
const skinColors = [
  { id: 1, color: '#00527A' },
  { id: 2, color: '#00a6fb' },
  { id: 3, color: '#FA4B0C' },
  { id: 4, color: '#0C2EFA' },
  { id: 5, color: '#FA9619' },
  { id: 6, color: '#3B4894' },
  { id: 7, color: '#00273B' },
];
/**
 * @Variable Object for new Org
 */
const orgObj = {
  name: '',
  logo_url: '',
  orgCode: '',
  skin_color: '',
};

/**
 * This component is used to Edit the Org and save data
 * @param {function} toggleDrawer [recieved function as props]
 * @param {object} orgData [recieved from props]
 */
const OrgEditorDrawer = ({ toggleDrawer, orgData, showLoader }) => {
  const classes = useStyles();
  const { insertOrgDetail, updateOrgDetail, idToken } = useContext(OrgContext);
  const orgObjCopy = orgData.id ? { ...orgData } : { ...orgObj };
  const [orgState, setOrgState] = useState(orgObjCopy);
  const [selectedImage, setSelectedImage] = useState([]);
  const [viewSelectImage, setViewSelectImage] = useState('');
  const anchor = 'right';
  const [isShowLoader, setShowLoader] = useState(false);

  /**
   *Handle inputChangeHandler
   * @param {event} e
   * @description set org state
   */
  const inputChangeHandler = (e) => {
    const updateOrgState = { ...orgState };
    updateOrgState[e.target.name] = e.target.value;
    setOrgState(updateOrgState);
  };

  /**
   *Handle colorHandler
   * @param {event} e
   * @description set org state
   */
  const colorHandler = (e, color) => {
    const updateOrgState = { ...orgState };
    updateOrgState.skin_color = color;
    setOrgState(updateOrgState);
  };

  /**
   * @function imageUploadHandler
   * @description set org logo image and view logo image
   */
  const imageUploadHandler = (e) => {
    const fileData = e.target.files;
    const viewImage = URL.createObjectURL(fileData[0]);
    setViewSelectImage(viewImage);
    setSelectedImage(fileData);
  };

  /**
   * @function validateOrg
   * @param {orgData}
   * @description validateOrg before save in database
   */
  const validateOrg = (orgData) => {
    let message = '';
    if (!orgData.name) {
      message = 'Organisation name is required!';
      toast.info(message);
      return false;
    }
    if (!orgData.orgCode) {
      message = 'Organisations code is required!';
      toast.info(message);
      return false;
    }
    return true;
  };

  /**
   * @function updateOrg
   * @param {string} logoUrl default value null
   */
  const updateOrgHandler = (logoUrl = '') => {
    const updateOrgState = { ...orgState };
    let response = '';
    setShowLoader(false);
    if (validateOrg(updateOrgState)) {
      setShowLoader(true);
      updateOrgState.logo_url = logoUrl || updateOrgState.logo_url;
      if (!updateOrgState.id) {
        delete updateOrgState.id;
        response = insertOrgDetail(updateOrgState);
      } else {
        response = updateOrgDetail(updateOrgState);
      }
      if (response) {
        const message = updateOrgState.id ? 'Org updated successfully' : 'Org added successfully';
        toast.success(message);
        toggleDrawer(anchor, false);
        setShowLoader(false);
      }
    }
  };

  /**
   * @function imageUploadSuccessfull
   * @param {data} get response from image successfully upload on server
   */
  const imageUploadSuccessfull = (data) => {
    const profilePhoto = data.data[0].url;
    updateOrgHandler(profilePhoto);
  };

  /**
   * @function requestFailure
   * @param {error} when image not upload on server get error
   */
  const requestFailure = (e) => {
    toast.error(e.message);
    setShowLoader(false);
  };

  /**
   * Upload Image function and start progress bar
   * @return {[type]} [description]
   */
  const uploadImage = () => {
    const data = new FormData();
    data.append('image', selectedImage[0]);
    const httpObj = {
      url: 'storage/upload',
      method: 'POST',
      data,
      fileType: 'image',
      headers: { Authorization: `Bearer ${idToken}` },
    };
    httpHelper(httpObj, imageUploadSuccessfull, requestFailure, false);
  };

  /**
   * @function onSubmit [submit org detail]
   */
  const onSubmit = () => {
    setShowLoader(true);
    if (selectedImage.length > 0) {
      uploadImage();
    } else {
      updateOrgHandler();
    }
  };

  let orgIcon = viewSelectImage || orgState.logo_url;
  orgIcon = orgIcon || PlaceholderImg;

  return (
    <Fragment>
      {isShowLoader && showLoader(true)}
      <Box px={2} py={2}>
        <Grid container>
          <Box clone mb={1.5}>
            <Grid item md={12} lg={12} className={classes.modalHeader}>
              <Typography variant="h2" id="simple-modal-title">
                Manage Organisations
              </Typography>
            </Grid>
          </Box>
          <Grid container direction="row" justify="center">
            <Box mb={1}>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <div>
                    <input
                      accept="image/*"
                      className={classes.icoInput}
                      id="icon-button-file"
                      type="file"
                      onChange={imageUploadHandler}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton className={classes.profilePicAction} aria-label="upload picture" component="span">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </label>
                  </div>
                }
              >
                <Avatar
                  className={classes.usrProfilePic}
                  src={orgIcon}
                  alt="Org Icon"
                  variant="rounded"
                  classes={{
                    img: classes.orgImg,
                  }}
                />
              </Badge>
            </Box>
          </Grid>
          <Grid item md={12} lg={12}>
            <Box my={2}>
              <TextField
                fullWidth
                label="Organisations Name"
                variant="outlined"
                name="name"
                value={orgState.name}
                onChange={(e) => inputChangeHandler(e)}
              />
            </Box>
          </Grid>
          <Grid item md={12} lg={12}>
            <Box my={2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Org Code"
                variant="outlined"
                name="orgCode"
                value={orgState.orgCode}
                onChange={(e) => inputChangeHandler(e)}
              />
            </Box>
          </Grid>
          <Grid item md={12} lg={12}>
            <Typography id="theme-color">Theme Color</Typography>
            <Box display="flex">
              {skinColors.map((skinColor) => (
                <Box
                  key={skinColor.id}
                  order={3}
                  lg={2}
                  style={{ background: `${skinColor.color}` }}
                  className={classNames(
                    classes.colorBox,
                    orgState.skin_color === skinColor.color ? classes.selectedTheme : ''
                  )}
                  onClick={(e) => colorHandler(e, skinColor.color)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item md={12} lg={12}>
            <Box mt={6}>
              <Grid container direction="row" justify="flex-end" alignItems="center">
                <Grid item md={6} lg={6}>
                  <Box mr={2}>
                    <Button
                      fullWidth
                      className={classes.primaryBtn}
                      variant="contained"
                      color="primary"
                      onClick={onSubmit}
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={6} lg={6}>
                  <Button
                    fullWidth
                    className={classes.cancelBtn}
                    variant="contained"
                    color="default"
                    onClick={toggleDrawer}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};
export default OrgEditorDrawer;
