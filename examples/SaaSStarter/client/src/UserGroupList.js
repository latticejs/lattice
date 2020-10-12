import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Dialog,
  Drawer,
  Fab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { OrgContext, UserGroupContext } from './context';
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import GridAction from './components/GridAction';
import ManageUserGroup from './components/ManageUserGroup';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import OrgBreadcrumbs from './components/utils/OrgBreadcrumbs';
import React, { Fragment, useContext, useState } from 'react';
import clsx from 'clsx';

/**
 * @function useStyles
 * @description css for modal popup
 * @returns {object}
 */
const useStyles = makeStyles((theme) => ({
  parentContainer: {
    width: '540px',
    padding: '20px',
  },
  formControl: {
    minWidth: '300px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  tlListDiv: {
    maxHeight: 'calc(100vh - 180px)',
    width: '100%',
    overflow: 'auto',
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tlListItm: {
    backgroundColor: '#fff',
    padding: '14px 24px',
  },
  tlName: {
    fontSize: '20px',
    textTransform: 'capitalize',
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
  inputValue: {
    fontSize: '16px',
    fontWeight: '300px',
  },
  addIconContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  list: {
    width: 300,
  },
  sideDrawerPaper: {
    width: '36%',
  },
  userLabel: {
    marginRight: 5,
  },
  actionColumn: {
    width: 120,
  },
  fab: {
    color: '#ffff',
    marginTop: 20,
  },
}));

/**
 * This component will return Group list
 * @param {showLoader}
 */
const UserGroupList = ({ showLoader }) => {
  const classes = useStyles();
  const { userGroupsLoading, userGroupsData, deleteGroupCotext } = useContext(UserGroupContext);
  const { selectedOrg, userOrgRoles, isSuperAdmin } = useContext(OrgContext);
  const [selectedUserGroup, setUserGroup] = useState({});
  const [open, setOpen] = useState(false);
  const [deletedUserGroup, setDeletedUserGroup] = useState({});
  const [isShowLoader, setShowLoader] = useState(false);
  let userGroupsList = [];
  const anchor = 'right';
  const [state, setState] = useState({ right: false });
  let isUserAdmin = false;

  if (userOrgRoles.length > 0 && selectedOrg) {
    const userRole = userOrgRoles.find((role) => role.orgId === selectedOrg.id);
    isUserAdmin = !!(userRole.role === 'Admin' || isSuperAdmin);
  }

  /**
   * To open and close the drawer
   */
  const toggleDrawer = (anchor, open, userGroup = {}) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUserGroup(userGroup);
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    />
  );

  /**
   * Open the confirm dialog box
   */
  const onConfirmOpenDialog = (userGroup) => {
    setDeletedUserGroup(userGroup);
    setOpen(true);
  };

  /**
   *Handle renderAddGroupBtn
   * @description this method return component if user superadmin or admin(isUserAdmin) otherwise null
   */
  const renderAddGroupBtn = () => {
    if (isUserAdmin) {
      return (
        <Box mt={5} textAlign="right" clone>
          <Grid item md={4} lg={4}>
            <Tooltip title="Add New Group" aria-label="add">
              <Fab color="primary" className={classes.fab}>
                <AddIcon onClick={toggleDrawer(anchor, true)} />
              </Fab>
            </Tooltip>
          </Grid>
        </Box>
      );
    }
    return null;
  };

  /**
   * Handle User grid action Edit and Delete component
   */
  const ActionComponent = (props) => {
    if (isUserAdmin) {
      return (
        <GridAction
          {...props}
          deleteHandler={onConfirmOpenDialog}
          openDrawer={toggleDrawer}
          selectedPatient={props.userGroup}
        />
      );
    }
    return null;
  };

  if (!userGroupsLoading) {
    userGroupsList = userGroupsData;
  } else {
    return showLoader(true);
  }

  /**
   * Close the confirm dialog box
   */
  const handleClose = () => {
    setOpen(false);
    setDeletedUserGroup({});
    setUserGroup({});
  };

  /**
   * @function onDeletePatient [delete the selected patient]
   */
  const onDeleteUser = () => {
    setShowLoader(true);
    handleClose();
    const response = deleteGroupCotext(deletedUserGroup);
    response
      .then(() => {
        setShowLoader(false);
      })
      .catch(() => {
        toast.error('Group can not deleted!');
      });
  };

  return (
    <Fragment key="key">
      {isShowLoader && showLoader(true)}
      <div>
        <ToastContainer />
        <Box mx={4} mb={4}>
          <Grid container>
            <Grid item md={8} lg={8}>
              <Typography variant="h2">
                <Box mt={5} color="secondary.main">
                  {' '}
                  Group Management
                </Box>
              </Typography>
              <Box mt={1}>
                <OrgBreadcrumbs current="Group List" />
              </Box>
            </Grid>
            {renderAddGroupBtn()}
          </Grid>
        </Box>
        <Box mx={4} mt={2}>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Users</TableCell>
                    {isUserAdmin ? <TableCell>Action</TableCell> : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userGroupsList.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell key={`${row.id}1`} className={classes.dataColumn}>
                        {row.group_details.name}
                      </TableCell>
                      <TableCell key={`${row.id}2`} className={classes.dataColumn}>
                        {row.users.map((user, userIndex) => (
                          <span className={classes.userLabel} key={user.value}>
                            {userIndex < row.users.length - 1 ? `${user.label},` : user.label}
                          </span>
                        ))}
                      </TableCell>
                      {isUserAdmin ? (
                        <TableCell key={`${row.id}5`} className={classes.actionColumn}>
                          <ActionComponent userGroup={row} />
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
        <Drawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          classes={{ paper: classes.sideDrawerPaper }}
        >
          {list(anchor)}
          <ManageUserGroup
            selectedUserGroup={selectedUserGroup}
            toggleDrawer={toggleDrawer(anchor, false)}
            showLoader={showLoader}
          />
        </Drawer>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">Delete User</Typography>
          </MuiDialogTitle>
          <MuiDialogContent className={classes.dialogContent} dividers>
            <Typography gutterBottom>Are you sure want to delete group ?</Typography>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button variant="contained" color="default" onClick={handleClose}>
              No
            </Button>
            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={onDeleteUser}>
              Yes
            </Button>
          </MuiDialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default UserGroupList;
