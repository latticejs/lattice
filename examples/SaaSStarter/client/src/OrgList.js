import {
  Box,
  Button,
  Dialog,
  Drawer,
  Fab,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { CommonContext, OrgContext } from './context';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import OrgEditorDrawer from './components/OrgEditorDrawer';
import LogoImg from './images/logoFileDummy.svg';
import MoreIcon from '@material-ui/icons/MoreVert';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import React, { useContext, useState } from 'react';

/**
 * Set OrgList Component style
 */
const useStyles = makeStyles(() => ({
  manageMedia: {
    paddingLeft: '20px',
  },
  orgCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: '0px 3px 12px #3e3c3c11',
    border: '0.5px solid #0000001a',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'none',
      border: '0.8px solid #00000022',
    },
  },
  alignCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignItems: {
    display: 'flex',
    alignItems: 'center',
  },
  orgNameDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  moreIconDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgIconFont: {
    fontFamily: 'CPS-Icon',
    fontSize: 20,
    padding: '7px 11px',
    borderRadius: '4px',
    backgroundColor: '#F7F9FB',
    border: '0.5px solid #EAF0F5',
  },
  orgAnchr: {
    textDecoration: 'none',
    color: 'black',
  },
  navLinkText: {
    textDecoration: 'none',
  },
  sideDrawerPaper: {
    width: '36%',
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
  righBtn: {
    float: 'right',
  },
  deleteCls: {
    color: '#F25151',
  },
  titleContainer: {
    marginBottom: 24,
  },
  moreMenu: {
    boxShadow: '0px 3px 10px -1px #33333311',
  },
  fab: {
    color: '#ffff',
  },
}));

/**
 * This component is used to list Org
 * @param {boolean} showLoader [recieved from props for showing loader]
 */
const Org = ({ showLoader }) => {
  const { userOrgs, isSuperAdmin, deleteOrgMemberDetail } = useContext(
    OrgContext
  );

  const { countList } = useContext(CommonContext);
  const classes = useStyles();
  const [state, setState] = useState({ right: false, openMenu: false });
  const [open, setOpen] = useState(false);
  const [deletedOrg, setDeletedOrg] = useState({});
  const anchor = 'right';
  const [anchorEl, setAnchorEl] = useState(null);
  const [orgData, setOrgData] = useState({});

  /**
   * Set the count of media, timeline and patient
   */
  if (userOrgs && userOrgs.length > 0) {
    userOrgs.forEach((data) => {
      if (countList && countList.organization_stats) {
        const orgStats = countList.organization_stats;
        const filterOrg = orgStats.filter((org) => org.id === data.id);

        if (filterOrg.length > 0) {
          data.usersCount = filterOrg[0].users_count;
          data.groupsCount = filterOrg[0].groups_count;
        }
      }
    });
  }
  /**
   * To open and close the drawer
   */
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type) {
      event.preventDefault();
    }

    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
    setAnchorEl(null);
  };

  /**
   *Handle handleClick
   * @param {event} e
   * @param {object} orgData set selected org
   */
  const handleClick = (event, orgData) => {
    event.preventDefault();
    setOrgData(orgData);
    setAnchorEl(event.currentTarget);
  };

  /**
   *Handle handleClose
   * @description close action icon
   */
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    setAnchorEl(null);
  };

  /**
   *Handle addNewOrg
   * @description this method call on click on new org
   */
  const addNewOrg = () => {
    setState({ ...state, [anchor]: true });
    setOrgData({});
  };

  /**
   * Open the confirm dialog box
   * @param {event} e
   * @param{object} org set selected org for delete org
   */
  const onConfirmOpenDialog = (e, org) => {
    e.preventDefault();
    setDeletedOrg(org);
    setOpen(true);
  };

  /**
   *Handle handleClose confirm box
   * @description close action icon
   */
  const closeConfirmDialog = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpen(false);
    setDeletedOrg({});
    setOrgData({});
  };

  /**
   *Handle onDeleteOrg
   * @param {event} e
   */
  const onDeleteOrg = (e) => {
    e.preventDefault();
    deleteOrgMemberDetail(deletedOrg);
    handleClose();
    closeConfirmDialog();
  };

  /**
   *Handle renderNewOrgBtn
   * @description this method return component if user superadmin otherwise null
   */
  const renderNewOrgBtn = () => {
    if (isSuperAdmin) {
      return (
        <Box mb={3} textAlign="right" clone>
          <Grid item md={4} lg={4} className={classes.righBtn}>
            <Tooltip title="Add New Organisation" aria-label="add">
              <Fab color="primary" className={classes.fab}>
                <AddIcon onClick={addNewOrg} />
              </Fab>
            </Tooltip>
          </Grid>
        </Box>
      );
    }
    return null;
  };

  const isUserOrgs = (org) => {
    if (userOrgs) {
      return userOrgs.map((org) => (
        <Grid key={org.orgCode} item md={6} lg={4}>
          <NavLink
            to={`/${org.orgCode}/`}
            className={classes.navLinkText}
            onClick={routePath}
          >
            <div className={classes.orgCard}>
              <Box clone mt={2}>
                <Grid container>
                  <Grid item md={2} lg={2} className={classes.alignCenter}>
                    <img src={LogoImg} alt="logo" />
                  </Grid>
                  <Grid item md={8} lg={8} className={classes.orgNameDiv}>
                    <Typography variant="h4">
                      <Box color="secondary.main">{org.name}</Box>
                    </Typography>
                  </Grid>

                  {renderOrgActionIcon(org)}
                </Grid>
              </Box>
              <Box mt={5} ml={3} mb={3}>
                <Grid container>
                  <Grid item md={4} lg={4} className={classes.orgLogoDiv}>
                    <Box display="flex">
                      <Box order={1}>
                        <Typography
                          color="primary"
                          className={classes.orgIconFont}
                        >
                          B
                        </Typography>
                      </Box>
                      <Box order={2} ml={0.5}>
                        <Grid container>
                          <Grid
                            item
                            md={12}
                            lg={12}
                            className={classes.alignCenter}
                          >
                            <Typography variant="h4">
                              <Box color="secondary.main">{org.usersCount}</Box>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            lg={12}
                            className={classes.alignCenter}
                          >
                            <Typography variant="subtitle1">
                              <Box color="secondary.light">User</Box>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={4} lg={4} className={classes.orgLogoDiv}>
                    <Box display="flex">
                      <Box order={1}>
                        <Typography
                          color="primary"
                          className={classes.orgIconFont}
                        >
                          B
                        </Typography>
                      </Box>
                      <Box order={2} ml={0.5}>
                        <Grid container>
                          <Grid
                            item
                            md={12}
                            lg={12}
                            className={classes.alignCenter}
                          >
                            <Typography variant="h4">
                              <Box color="secondary.main">
                                {org.groupsCount}
                              </Box>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            lg={12}
                            className={classes.alignCenter}
                          >
                            <Typography variant="subtitle1">
                              <Box color="secondary.light">User Group</Box>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </NavLink>
        </Grid>
      ));
    }
    return null;
  };

  /**
   *Handle renderOrgActionIcon
   * @description this method return action component if user superadmin otherwise null
   * @param {object} org set selected org
   */
  const renderOrgActionIcon = (org) => {
    if (isSuperAdmin) {
      return (
        <Grid item md={2} lg={2} className={classes.moreIconDiv}>
          <IconButton onClick={(e) => handleClick(e, org)}>
            <MoreIcon fontSize="large" />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{ paper: classes.moreMenu }}
          >
            <MenuItem onClick={toggleDrawer(anchor, true)}>Edit</MenuItem>
            <MenuItem
              className={classes.deleteCls}
              onClick={(e) => onConfirmOpenDialog(e, org)}
            >
              Delete
            </MenuItem>
          </Menu>
        </Grid>
      );
    }
    return null;
  };

  /**
   *Handle renderOrgActionIcon
   * @param {event} e stop event propagation on click card
   */
  const routePath = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <Box px={4} mt={12}>
        <Grid
          container
          className={classes.titleContainer}
          style={{ marginBottom: '30px' }}
        >
          <Grid item md={6} lg={6} className={classes.alignItems}>
            <Typography variant="h2">
              <Box display="flex" color="secondary.main">
                Organisations List
              </Box>
            </Typography>
          </Grid>
          <Grid item md={6} lg={6}>
            {renderNewOrgBtn()}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {isUserOrgs()}
          {!userOrgs && showLoader(true)}
        </Grid>
        <Drawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          classes={{ paper: classes.sideDrawerPaper }}
        >
          <OrgEditorDrawer
            toggleDrawer={toggleDrawer(anchor, false)}
            orgData={orgData}
            showLoader={showLoader}
          />
        </Drawer>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">Delete User</Typography>
          </MuiDialogTitle>
          <MuiDialogContent className={classes.dialogContent} dividers>
            <Typography gutterBottom>
              Are you sure want to delete Org ?
            </Typography>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button
              variant="contained"
              color="default"
              onClick={closeConfirmDialog}
            >
              No
            </Button>
            <Button
              className={classes.buttonMargin}
              variant="contained"
              color="primary"
              onClick={onDeleteOrg}
            >
              Yes
            </Button>
          </MuiDialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Org;
