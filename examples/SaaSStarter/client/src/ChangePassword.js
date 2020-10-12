import { Box, Button, Divider, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { OrgContext } from './context';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { passwordValidator } from './helper/commonHelper';
import { toast } from 'react-toastify';
import { useAuth0 } from './react-auth0-spa';
import BulletIcon from '@material-ui/icons/FiberManualRecord';
import React, { useContext, useState } from 'react';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

/**
 * Set the Style for media details
 */
const useStyles = makeStyles((theme) =>
  createStyles({
    actionBtnDiv: {
      position: 'absolute',
      bottom: 0,
      borderTop: '1px solid #33333322',
      width: '77%',
      backgroundColor: '#fff',
    },
    primaryBtn: {
      color: '#051923',
      fontSize: 18,
      textTransform: 'capitalize',
      maxHeight: '56px',
      padding: '16px 18px',
      boxShadow: '0px 0px 20px -4px rgba(51,36,5,0.37)',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 'calc(100vh - 180px)',
    },
    errorColor: {
      color: '#EA4F4F',
    },
  })
);

const ChangePassword = ({ userId }) => {
  const classes = useStyles();
  const { changeUserPassword } = useContext(OrgContext);
  const { logout } = useAuth0();
  const [isShowCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isErrorCurrentPass: false,
    isErrorNewPass: false,
    isErrorConfirmPass: false,
    isErrorMatchPass: false,
  });

  /**
   * @function onChangePassword
   * @param evt [handle the password field]
   */
  const onChangePassword = (evt, fieldName) => {
    const { name, value } = evt.target;
    const errorName = fieldName;
    let errorStatus = !passwordValidator(value);

    if (name === 'currentPassword') {
      errorStatus = !(value.length > 0);
    }

    const isMatch = !!(name === 'confirmPassword' && state.newPassword !== value);

    setState({
      ...state,
      [name]: value,
      [errorName]: errorStatus,
      isErrorMatchPass: isMatch,
    });
  };

  /**
   * @function onChangePassword [Handle show/hide password]
   */
  const handleClickShowPassword = (actionType, actionValue) => {
    actionType(!actionValue);
  };

  /**
   * @function handleLogout
   */
  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  /**
   * @function onSubmitPassword [Submit the state value to server]
   */
  const onSubmitPassword = () => {
    let isMatchPass = false;
    const requestObj = {
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
      userId,
    };

    const oldPassStatus = !state.currentPassword;
    const newPassStatus = !state.currentPassword;
    const confirmPassstatus = !state.currentPassword;

    if (state.newPassword !== state.confirmPassword) {
      isMatchPass = true;
    }

    if (
      isMatchPass ||
      (oldPassStatus && newPassStatus && confirmPassstatus) ||
      state.isErrorCurrentPass ||
      state.isErrorNewPass ||
      state.isErrorConfirmPass
    ) {
      setState({
        ...state,
        isErrorCurrentPass: oldPassStatus,
        isErrorNewPass: newPassStatus,
        isErrorConfirmPass: confirmPassstatus,
        isErrorMatchPass: isMatchPass,
      });
      return false;
    }

    const changeStatus = changeUserPassword(requestObj);
    changeStatus
      .then(() => {
        toast.info('Passowrd updated successfully');
        handleLogout();
      })
      .catch((errors) => {
        toast.error(errors.graphQLErrors[0].message);
      });
  };

  return (
    <Grid container>
      <Box mb={2}>
        <Grid item md={12} lg={12}>
          <Typography variant="h3" color="primary">
            Account Credentials
          </Typography>
        </Grid>
      </Box>
      <Grid item md={12} lg={12}>
        <Divider />
      </Grid>
      <Box py={4} px={4}>
        <Grid item md={12} lg={12}>
          <Box display="flex" mt={2}>
            <Box order={1}>
              <BulletIcon fontSize="small" />
            </Box>
            <Box order={2} ml={2}>
              <Typography variant="h5">
                Your Password should be at least 7-8 characters long — longer is better.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item md={12} lg={12}>
          <Box display="flex" mb={2}>
            <Box order={1}>
              <BulletIcon fontSize="small" />
            </Box>
            <Box order={2} ml={2}>
              <Typography variant="h5">
                Should contain alphanumeric with lower-case letters, upper-case letter, numeric and special character.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item md={7} lg={7}>
          <Box component="span" display="block">
            <Typography>Current Password</Typography>
          </Box>
          <Box component="span" display="block" mb={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your Current Password"
              onChange={(e) => onChangePassword(e, 'isErrorCurrentPass')}
              name="currentPassword"
              type={isShowCurrentPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => handleClickShowPassword(setShowCurrentPassword, isShowCurrentPassword)}
                    >
                      {isShowCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {state.isErrorCurrentPass && <span className={classes.errorColor}>Please enter the current password </span>}
          </Box>
        </Grid>
        <Grid item md={7} lg={7}>
          <Box component="span" display="block">
            <Typography>Set New Password</Typography>
          </Box>
          <Box component="span" display="block" mb={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter a New Password"
              onChange={(e) => onChangePassword(e, 'isErrorNewPass')}
              name="newPassword"
              type={isShowNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => handleClickShowPassword(setShowNewPassword, isShowNewPassword)}
                    >
                      {isShowNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {state.isErrorNewPass && <span className={classes.errorColor}>Please enter the valid password</span>}
          </Box>
        </Grid>
        <Grid item md={7} lg={7}>
          <Box component="span" display="block">
            <Typography>Confirm New Password</Typography>
          </Box>
          <Box component="span" display="block">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Re-Enter New Password"
              onChange={(e) => onChangePassword(e, 'isErrorConfirmPass')}
              name="confirmPassword"
              type={isShowConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => handleClickShowPassword(setShowConfirmPassword, isShowConfirmPassword)}
                    >
                      {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {state.isErrorConfirmPass && <span className={classes.errorColor}>Please enter the valid password</span>}
            <br />
            {state.isErrorMatchPass && (
              <span className={classes.errorColor}>New password and confirm password should be same</span>
            )}
          </Box>
        </Grid>
      </Box>
      <Box py={2} px={4} className={classes.actionBtnDiv}>
        <Grid item md={12} lg={12}>
          <Button variant="contained" color="primary" onClick={onSubmitPassword} className={classes.primaryBtn}>
            Change Password
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ChangePassword;
