import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { UserContext } from '../context';
import { emailValidator, getFormattedDate } from '../helper/commonHelper';
import { toast } from 'react-toastify';
import React, { Fragment, useContext, useEffect, useState } from 'react';

/**
 * @function useStyles
 * @description css for modal popup
 * @returns {object}
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: '40%',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: '500',
    },
    modalCancel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    submitButton: {
      margin: 8,
    },
    layoutTypeWidth: {
      width: '100%',
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
    cancelBtn: {
      maxHeight: '56px',
      padding: '16px 18px',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    showError: {
      color: '#DC143C',
    },
  })
);

/**
 * @constructor EditorModal
 * @description create the modal pop. Taking props from parent and pass props to child component
 * @param {orgID}
 * @param {selectedUser}
 * @param {toggleDrawer}
 * @param {initialUserData}
 */
const ManageUser = ({ orgID, selectedUser, toggleDrawer, initialUserData }) => {
  const classes = useStyles();
  const { validateUserEmail, userDetailsContext, updateUserOrganizationContext, addNewUser } = useContext(UserContext);
  let userData = !userDetailsContext ? [] : userDetailsContext;
  const [state, setState] = useState({
    formData: {
      userEmail: '',
      userName: '',
      userRole: '',
    },
    error: {
      userEmail: false,
      userName: false,
      userRole: false,
    },
    isEmailVerified: false,
    isShowValidateBtn: true,
    userID: null,
    userCreationDate: '',
    isDateCreation: false,
    isUserFromSameOrg: false,
  });

  /**
   * @function onHandleChange
   * @description set the updated value
   */
  const onHandleChange = (event) => {
    const { name, value } = event.target;
    let status = !value;

    if (name === 'userEmail') {
      status = !emailValidator(value);
    }

    setState({
      ...state,
      formData: {
        ...state.formData,
        [name]: value,
      },
      error: {
        ...state.error,
        [name]: status,
      },
      isShowValidateBtn: status,
    });
  };

  /**
   * @function onVerifyEmail
   * @description get the entered email to validate, is it valid or not
   */
  const onVerifyEmail = () => {
    validateUserEmail(state.formData.userEmail);
    setState({
      ...state,
      isEmailVerified: true,
      isDateCreation: false,
      userID: null,
      formData: {
        ...state.formData,
        userName: '',
      },
    });
  };

  /**
   * @function onSubmit
   * @description pass the user data to save into database
   */
  const onSubmit = () => {
    let response;
    const requestObj = {
      userRole: state.formData.userRole,
      orgID,
      userName: state.formData.userName,
      userEmail: state.formData.userEmail,
    };

    if (state.error.userName || state.error.userRole || !state.formData.userName || !state.formData.userRole) {
      return false;
    }

    if ((userData && userData.user && userData.user.length > 0) || Object.values(selectedUser).length > 0) {
      requestObj.isUserFromSameOrg = state.isUserFromSameOrg;
      requestObj.userID = state.userID;
      response = updateUserOrganizationContext(requestObj);
    } else {
      response = addNewUser(requestObj);
    }

    if (response) {
      const message = state.isUserFromSameOrg ? 'User Updated successfully' : 'User added successfully';
      toast.info(message);
      toggleDrawer('right', false);
    } else {
      toast.error('Please try again!!!');
    }
    initialUserData();
    userData = [];
  };

  const changeAndSetState = () => {
    const userDataCount = userData && userData.user && userData.user.length ? userData.user.length : 0;

    if ((state.isEmailVerified && userDataCount > 0) || Object.values(selectedUser).length > 0) {
      let validatedData;
      let checkOrgCount = [];

      if (Object.values(selectedUser).length > 0) {
        validatedData = selectedUser;

        validatedData.role = selectedUser.organization_members[0].role;
      } else {
        validatedData = userData.user[0];
        checkOrgCount = Object.values(validatedData.organization_members).filter(
          (data) => data.organization_id === orgID
        );
        let setRole = 'User';
        validatedData.organization_members.forEach((orgMember) => {
          if (orgMember.organization_id === orgID) {
            setRole = orgMember.role;
          }
        });
        validatedData.role = setRole;
      }

      const checkOrg = !!(checkOrgCount.length > 0 || Object.values(selectedUser).length > 0);

      if (!state.isEmailVerified || userDataCount > 0) {
        setState({
          ...state,
          formData: {
            ...state.formData,
            userName: validatedData.name,
            userRole: validatedData.role ? validatedData.role : 'User',
            userEmail: validatedData.email,
          },
          userID: validatedData.id,
          userCreationDate: getFormattedDate(validatedData.created_at),
          isDateCreation: true,
          isEmailVerified: true,
          isUserFromSameOrg: checkOrg,
        });
      }
    }
  };

  useEffect(changeAndSetState, [orgID, userData, selectedUser]);

  /**
   * @function renderActionButton
   * @description enable and disable the action button
   */
  const renderActionButton = () => {
    let isDisable = true;

    if (state.formData.userName && state.formData.userRole) {
      isDisable = false;
    }
    return (
      <Fragment>
        <Box clone mt={4}>
          <Grid container spacing={2}>
            <Grid item md={6} lg={6}>
              <Button
                fullWidth
                className={classes.primaryBtn}
                disabled={isDisable}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Save User
              </Button>
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
      </Fragment>
    );
  };

  /**
   * @function renderAdditionalField
   * @description render name field and user role field
   */
  const renderAdditionalField = () => {
    let isDisable = false;

    if (!state.isUserFromSameOrg && userData && userData.user && userData.user.length > 0) {
      isDisable = true;
    }

    if (state.isEmailVerified) {
      return (
        <Fragment>
          <Grid item md={12} lg={12}>
            <Box my={1}>
              <TextField
                fullWidth
                id="outlined-basic-name"
                label="User Name"
                variant="outlined"
                name="userName"
                value={state.formData.userName}
                onChange={onHandleChange}
                autoComplete="false"
                disabled={isDisable}
              />
              <p className={classes.showError}>{state.error.userName ? "Name can't be blank. " : ''}</p>
            </Box>
          </Grid>
          <Grid item md={12} lg={12}>
            <Box my={1.5}>
              <FormControl fullWidth variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label">User Role</InputLabel>
                <Select
                  className={classes.layoutTypeWidth}
                  value={state.formData.userRole}
                  name="userRole"
                  onChange={onHandleChange}
                >
                  <MenuItem key={1} value="Admin">
                    Admin
                  </MenuItem>
                  <MenuItem key={2} value="User">
                    User
                  </MenuItem>
                </Select>
                {state.error.userRole ? 'Please select user role' : ''}
              </FormControl>
            </Box>
          </Grid>
        </Fragment>
      );
    }
    return '';
  };

  /**
   * @function renderValidationButton
   * @description render the validation button conditionally
   */
  const renderValidationButton = () => {
    if (!state.isEmailVerified) {
      return (
        <Box my={2}>
          <Button
            className={classes.primaryBtn}
            disabled={state.isShowValidateBtn}
            variant="contained"
            color="primary"
            onClick={onVerifyEmail}
          >
            Verify Email
          </Button>
        </Box>
      );
    }

    return '';
  };

  /**
   * @function renderDateCreation
   * @description render the user creation date
   */
  const renderDateCreation = () => {
    const isDisable = true;

    if (state.isDateCreation) {
      return (
        <Grid item md={12} lg={12}>
          <Box my={1.5}>
            <TextField
              fullWidth
              id="outlined-basic-date"
              label="Date of Joining"
              variant="outlined"
              name="userCreationDate"
              value={state.userCreationDate}
              onChange={onHandleChange}
              autoComplete="false"
              disabled={isDisable}
            />
          </Box>
        </Grid>
      );
    }
    return '';
  };

  return (
    <Box px={2} py={2}>
      <Grid container>
        <Box clone mb={3}>
          <Grid item md={12} lg={12} className={classes.modalHeader}>
            <Typography variant="h2" id="simple-modal-title">
              Manage Users
            </Typography>
          </Grid>
        </Box>
        <Grid item md={12} lg={12}>
          <div>
            <Box>
              <Paper elevation={0}>
                <Grid container>
                  <Grid item md={12} lg={12}>
                    <Box my={1}>
                      <TextField
                        fullWidth
                        id="outlined-basic-email"
                        label="User Email"
                        variant="outlined"
                        name="userEmail"
                        onChange={onHandleChange}
                        autoComplete="false"
                        value={state.formData.userEmail}
                        disabled={state.isEmailVerified}
                      />
                    </Box>
                    <p className={classes.showError}>{state.error.userEmail ? 'Enter the valid email.' : ''}</p>
                    {renderValidationButton()}
                  </Grid>
                  {renderAdditionalField()}
                  {renderDateCreation()}
                </Grid>
              </Paper>
            </Box>
          </div>
        </Grid>
        <Grid item md={12} lg={12}>
          <Grid container direction="row" justify="flex-end" alignItems="center">
            {renderActionButton()}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageUser;
