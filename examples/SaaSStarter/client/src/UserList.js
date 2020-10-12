import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Dialog,
  Drawer,
  Fab,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { OrgContext, UserContext } from './context';
import { getFormattedDate } from './helper/commonHelper';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import FilterList from '@material-ui/icons/FilterList';
import GridAction from './components/GridAction';
import ManageUser from './components/ManageUser';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import OrgBreadcrumbs from './components/utils/OrgBreadcrumbs';
import React, { Fragment, useContext, useState } from 'react';
import clsx from 'clsx';

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
  tableHeader: {
    backgroundColor: '#fff',
  },
  fab: {
    color: '#ffff',
    marginTop: 20,
  },
}));

let typingTimeout = null;
/**
 * Define the column for user table
 */
const columns = [
  {
    id: 'name',
    label: 'Name',
    minWidth: 100,
    type: 'desc',
    isShow: true,
    isFilter: true,
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 100,
    type: 'desc',
    isShow: true,
    isFilter: true,
  },
  {
    id: 'role',
    label: 'Role',
    minWidth: 100,
    type: 'desc',
    isShow: false,
    isFilter: true,
  },
  {
    id: 'created_at',
    label: 'Created date',
    minWidth: 100,
    isShow: true,
    isFilter: false,
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 100,
    isShow: false,
    isFilter: false,
  },
];

const UserList = ({ showLoader }) => {
  const classes = useStyles();
  const { usersLoading, users, deleteUserCotext, totalUser, fetchUsers } = useContext(UserContext);
  const { selectedOrg, userOrgRoles, isSuperAdmin } = useContext(OrgContext);
  const [selectedUser, setUser] = useState({});
  const [isModalOpen, setModalStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState({});
  let userList = [];
  const orgID = selectedOrg.id;
  const anchor = 'right';
  const [state, setState] = useState({ right: false });

  const defaultPageSize = 20;
  const [page, setPage] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [orderBy, setOrderBy] = useState({});
  const filteringObj = { name: '', email: '', role: '' };
  let isUserAdmin = false;

  if (userOrgRoles.length > 0 && selectedOrg) {
    const userRole = userOrgRoles.find((role) => role.orgId === selectedOrg.id);
    isUserAdmin = userRole.role === 'Admin' || isSuperAdmin ? true : false;
  }
  /**
   * To open and close the drawer
   */
  const toggleDrawer = (anchor, open, user = {}) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUser(user);
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
  const onConfirmOpenDialog = (userDetails) => {
    const delObj = {
      orgId: orgID,
      userId: userDetails.id,
    };
    setDeletedUser(delObj);
    setOpen(true);
  };

  /**
   * Handle User grid action Edit and Delete component
   */
  const ActionComponent = (props) => (
    <GridAction
      {...props}
      deleteHandler={onConfirmOpenDialog}
      openDrawer={toggleDrawer}
      selectedPatient={props.patient}
    />
  );

  if (!usersLoading) {
    userList = users;
  } else {
    return showLoader(true);
  }

  /**
   * Handle Modal popup isModalOpen
   * @param {boolean} status [if modal  open status is `true` otherwise `false`]
   */
  const handleModalStatus = (status) => {
    setModalStatus(status);
  };

  /**
   * Close the confirm dialog box
   */
  const handleClose = () => {
    setOpen(false);
    setDeletedUser({});
    setUser({});
  };

  /**
   * @function showMessage [display the toaster message]
   * @param {string} message
   * @param {string} messageType
   * @returns {component}
   */
  const showMessage = (message, messageType) => {
    const options = {
      autoClose: true || 5000,
      hideProgressBar: false,
      pauseOnHover: true,
    };
    if (messageType) {
      toast.info(message, options);
    } else {
      toast.error(message, options);
    }
  };

  /**
   * @function onDeletePatient [delete the selected patient]
   */
  const onDeleteUser = () => {
    const response = deleteUserCotext(deletedUser);

    if (response) {
      showMessage('User deleted successfully', true);
    } else {
      showMessage('Please try again', false);
    }
    handleClose();
  };

  /**
   * Clear patient list data
   */
  const initialUserData = () => {
    const event = {
      target: { value: defaultPageSize },
    };
    handleChangeRowsPerPage(event);
  };

  /**
   * Handle page change request
   * @param {event} event
   * @param {integer} newPage
   */
  const handleChangePage = (event, newPage) => {
    if (newPage > maxCurrentPage) {
      setMaxCurrentPage(newPage);
    }
    setPage(newPage);
    pageChangeHandler(orderBy, rowsPerPage, newPage, maxCurrentPage);
  };

  /**
   * Handle the number of rows on a page.
   * @param {event} event
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
    setMaxCurrentPage(0);
    handleChangeRowsPerPageParent(orderBy, event.target.value, 0);
  };

  /**
   *
   * @param {interger} rowsPerPage
   * @param {interger} page
   * @param {interger} maxCurrentPage
   */
  const pageChangeHandler = (orderBy, rowsPerPage, page, maxCurrentPage) => {
    const maxPage = Math.ceil(totalUser / rowsPerPage);

    if (page > maxCurrentPage && maxCurrentPage < maxPage) {
      fetchUsers({
        orderBy,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        filteringObj,
      });
    }
  };

  /**
   * Function which gets onChange of the textField.
   * @param {interger} rowsPerPage
   * @param {interger} page
   * @param {interger} maxCurrentPage
   */
  const filterChangeHandler = (selectedColumn, { currentTarget }) => {
    clearTimeout(typingTimeout);

    if (selectedColumn.id === 'name') {
      filteringObj.name = currentTarget.value;
    } else if (selectedColumn.id === 'email') {
      filteringObj.email = currentTarget.value;
    } else if (selectedColumn.id === 'role') {
      filteringObj.role = currentTarget.value;
    }

    typingTimeout = setTimeout(callSearchOnFilter, 475);
  };

  /**
   * Function which gets called after user completes entering the field.
   * @param {interger} rowsPerPage
   * @param {interger} page
   * @param {interger} maxCurrentPage
   */
  const callSearchOnFilter = () => {
    setPage(0);
    setMaxCurrentPage(0);
    setOrderBy(orderBy);
    sortingHandlerParent(orderBy, rowsPerPage, 0, filteringObj);
  };

  /**
   * Handle the grid sorting
   * @param {object} column
   */
  const sortingHandler = (column) => {
    const obj = { name: column.id };
    const filterObjIndex = columns.findIndex((data) => data.id === column.id);
    const filterObj = columns[filterObjIndex];
    obj.type = filterObj.type === 'asc' ? 'desc' : 'asc';
    columns[filterObjIndex].type = obj.type;
    setPage(0);
    setMaxCurrentPage(0);
    setOrderBy(obj);
    sortingHandlerParent(obj, rowsPerPage, 0, filteringObj);
  };

  const sortingHandlerParent = (orderBy, rowsPerPage, page, filteringObjData) => {
    fetchUsers({
      orderBy,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      clearData: true,
      filteringObj: filteringObjData,
    });
  };

  /**
   * Fetch Data when per page rows request change
   * @param {object} orderBy
   * @param {integer} rowsPerPage
   * @param {integer} page
   */
  const handleChangeRowsPerPageParent = (orderBy, rowsPerPage, page) => {
    fetchUsers({
      orderBy,
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      clearData: true,
      filteringObj,
    });
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
            <Tooltip title="Add New User" aria-label="add">
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

  if (!isUserAdmin && userOrgRoles) {
    const findIndex = columns.findIndex((column) => column.id === 'action');
    if (findIndex > 0) {
      columns.splice(findIndex, 1);
    }
  }

  return (
    <Fragment key="key">
      <div>
        <Box px={4} mt={12}>
          <ToastContainer />
          <Box>
            <Grid container>
              <Grid item md={8} lg={8}>
                <Typography variant="h2">
                  <Box color="secondary.main"> User Management</Box>
                </Typography>
                <Box mt={1}>
                  <OrgBreadcrumbs current="User Management" />
                </Box>
              </Grid>
              {renderAddGroupBtn()}
            </Grid>
          </Box>
          <Box mt={2}>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          className={classes.tableHeader}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                          {column.isShow ? (
                            <TableSortLabel onClick={() => sortingHandler(column)} active={false} />
                          ) : null}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      {columns.map((column) =>
                        column.isFilter ? (
                          <TableCell
                            className={classes.tableHeader}
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            <Input
                              id={'standard-adornment-password' + column.id}
                              type="text"
                              onChange={filterChangeHandler.bind(this, column)}
                              endAdornment={
                                <InputAdornment position="start">
                                  <IconButton aria-label="filter list">
                                    <FilterList />
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </TableCell>
                        ) : (
                          <TableCell
                            className={classes.tableHeader}
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          />
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell key={`${row.id}1`} className={classes.dataColumn}>
                          {row.name}
                        </TableCell>
                        <TableCell key={`${row.id}2`} className={classes.dataColumn}>
                          {row.email}
                        </TableCell>
                        <TableCell key={`${row.id}3`} className={classes.dataColumn}>
                          {row.organization_members[0].role}
                        </TableCell>
                        <TableCell key={`${row.id}4`} className={classes.dataColumn}>
                          {getFormattedDate(row.created_at)}
                        </TableCell>
                        {isUserAdmin ? (
                          <TableCell key={`${row.id}5`} className={classes.actionColumn}>
                            <ActionComponent patient={row} />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[20, 50]}
                component="div"
                count={totalUser}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            classes={{ paper: classes.sideDrawerPaper }}
          >
            {list(anchor)}
            <ManageUser
              open={isModalOpen}
              selectedUser={selectedUser}
              initialUserData={initialUserData}
              toggleDrawer={toggleDrawer(anchor, false)}
              handleClose={() => handleModalStatus(false)}
              orgID={orgID}
            />
          </Drawer>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <MuiDialogTitle disableTypography className={classes.root}>
              <Typography variant="h6">Delete User</Typography>
            </MuiDialogTitle>
            <MuiDialogContent className={classes.dialogContent} dividers>
              <Typography gutterBottom>Are you sure want to delete user ?</Typography>
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
        </Box>
      </div>
    </Fragment>
  );
};

export default UserList;
