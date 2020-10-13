import { Box, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { UserGroupContext } from '../context';
import { toast } from 'react-toastify';
import React, { useContext, useState } from 'react';
import Select from 'react-select';

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
    submitButton: {
      margin: 8,
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
  })
);

/**
 * @Variable Object for new user group
 */
const userGroupObj = {
  group_details: { id: '', name: '' },
  id: '',
  users: [],
};

/**
 * @constructor EditorModal
 * @description create the modal pop. Taking props from parent and pass props to child component
 * @param {selectedUserGroup}
 * @param {toggleDrawer}
 */
const ManageUserGroup = ({ toggleDrawer, selectedUserGroup, showLoader }) => {
  const classes = useStyles();
  const { userOptions, insertGroupDetail, updateGroupDetail } = useContext(UserGroupContext);
  const userGroupCopy = selectedUserGroup.id ? { ...selectedUserGroup } : { ...userGroupObj };

  if (!selectedUserGroup.id) {
    userGroupCopy.group_details = { id: '', name: '' };
  }
  const [groupState, setGroupState] = useState(userGroupCopy);
  const [isShowLoader, setShowLoader] = useState(false);
  const anchor = 'right';

  /**
   * @function inputChangeHandler
   * @description set the updated value
   */
  const inputChangeHandler = (e) => {
    const updateGroup = { ...groupState };
    if (e.target) {
      updateGroup.group_details[e.target.name] = e.target.value;
    } else {
      updateGroup.users = e;
    }
    setGroupState(updateGroup);
  };

  /**
   * @function validateOrg
   * @param {orgData}
   * @description validateOrg before save in database
   */
  const validateGroup = (groupState) => {
    let message = '';
    if (!groupState.group_details.name) {
      message = 'Group name is required!';
      toast.info(message);
      return false;
    }
    return true;
  };

  /**
   * @function onSubmit
   * @description pass the user group data to save into database
   */
  const onSubmit = () => {
    let response = '';
    if (validateGroup(groupState)) {
      setShowLoader(true);
      if (groupState.id) {
        response = updateGroupDetail(groupState);
      } else {
        response = insertGroupDetail(groupState);
      }
      response
        .then(() => {
          setShowLoader(false);
          toggleDrawer(anchor, false);
        })
        .catch(() => {
          toast.error('Please try again!!!');
        });
    }
  };

  return (
    <Box px={2} py={2}>
      {isShowLoader && showLoader(true)}
      <Grid container>
        <Box clone mb={3}>
          <Grid item md={12} lg={12} className={classes.modalHeader}>
            <Typography variant="h2" id="simple-modal-title">
              Manage Group
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
                        label="Group Name"
                        variant="outlined"
                        name="name"
                        onChange={inputChangeHandler}
                        autoComplete="false"
                        value={groupState.group_details.name}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={12} lg={12}>
                    <Box my={1}>
                      <Select
                        closeMenuOnSelect={false}
                        value={groupState.users}
                        onChange={inputChangeHandler}
                        isMulti
                        options={userOptions}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </div>
        </Grid>
        <Grid item md={12} lg={12}>
          <Grid container direction="row" justify="flex-end" alignItems="center">
            <Box clone mt={4}>
              <Grid container spacing={2}>
                <Grid item md={6} lg={6}>
                  <Button
                    fullWidth
                    className={classes.primaryBtn}
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                  >
                    Save Group
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
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageUserGroup;
