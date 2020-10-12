import { Box, Breadcrumbs, Button, Drawer, Fab, Grid, Tooltip, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { OrgContext } from './context';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import OrgEditorDrawer from './components/OrgEditorDrawer';
import React, { useContext, useEffect, useState } from 'react';
import UpdateIcon from '@material-ui/icons/BorderColorRounded';
/**
 * Set OrgLandingPage Component style
 */
const useStyles = makeStyles((theme) => ({
  orgIconFont: {
    fontFamily: 'CPS-Icon',
    fontSize: 20,
    padding: '7px 11px',
    borderRadius: '4px',
    backgroundColor: '#F7F9FB',
    border: '0.5px solid #EAF0F5',
  },
  orgCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: '0px 3px 12px #3e3c3c11',
    border: '0.5px solid #0000001a',
    cursor: 'pointer',
  },
  secondaryBtn: () => ({
    backgroundColor: theme.palette.primary.light,
    boxShadow: 'none',
    borderRadius: 10,
    maxHeight: 48,
    marginLeft: 16,
    padding: '18px 14px',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main,
    },
  }),
  breadcrumbsNavlink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  customNavlink: {
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
  fab: {
    color: '#ffff',
  },
}));

/**
 * Gets the user info card on the basis of role.
 */
const getUserCard = (selectedOrg, userOrgRoles, classes) => {
  let usersInfoCard = null;
  const selectedOrgWithRole = userOrgRoles.filter((org) => org.orgId === selectedOrg.id);

  if (selectedOrgWithRole && selectedOrgWithRole[0].role === 'Admin') {
    usersInfoCard = (
      <Grid item md={6} lg={4}>
        <div className={classes.orgCard}>
          <Grid container>
            <Grid item md={12} lg={12}>
              <Box mt={3} mx={3} display="flex">
                <Box order={1}>
                  <Typography color="primary" className={classes.orgIconFont}>
                    B
                  </Typography>
                </Box>
                <Box order={2} ml={1}>
                  <Grid container>
                    <Grid item md={12} lg={12} className={classes.alignCenter}>
                      <Typography variant="h4">
                        <Box color="secondary.main">User Management</Box>
                      </Typography>
                    </Grid>
                    <Grid item md={12} lg={12} className={classes.alignCenter}>
                      <Typography variant="subtitle1">
                        <Box color="secondary.light"> Add New users, Edit Existing users.</Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box my={3} mx={3} textAlign="right">
            <Grid item md={12} lg={12}>
              <NavLink to={`/${selectedOrg.orgCode}/users/`} className={classes.customNavlink}>
                <Button variant="contained" className={classes.secondaryBtn}>
                  Users
                </Button>
              </NavLink>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
  return usersInfoCard;
};

/**
 * Gets the user group info card on the basis of role.
 */
const getUserGroupCard = (selectedOrg, userOrgRoles, classes) => {
  const userGroupInfoCard = null;
  const selectedOrgWithRole = userOrgRoles.filter((org) => org.orgId === selectedOrg.id);

  if (selectedOrgWithRole && selectedOrgWithRole[0].role === 'Admin') {
    return (
      <Grid item md={6} lg={4}>
        <div className={classes.orgCard}>
          <Grid container>
            <Grid item md={12} lg={12}>
              <Box mt={3} mx={3} display="flex">
                <Box order={1}>
                  <Typography color="primary" className={classes.orgIconFont}>
                    B
                  </Typography>
                </Box>
                <Box order={2} ml={1}>
                  <Grid container>
                    <Grid item md={12} lg={12} className={classes.alignCenter}>
                      <Typography variant="h4">
                        <Box color="secondary.main">User Group</Box>
                      </Typography>
                    </Grid>
                    <Grid item md={12} lg={12} className={classes.alignCenter}>
                      <Typography variant="subtitle1">
                        <Box color="secondary.light">Manage user by Group</Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box my={3} mx={3} textAlign="right">
            <Grid item md={12} lg={12}>
              <NavLink to={`/${selectedOrg.orgCode}/groups/`} className={classes.customNavlink}>
                <Button variant="contained" className={classes.secondaryBtn}>
                  Groups
                </Button>
              </NavLink>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
  return userGroupInfoCard;
};
/**
 * This component is used to landing of Org
 */
const OrgLandingPage = ({ showLoader }) => {
  const { selectedOrg, userOrgRoles, isSuperAdmin } = useContext(OrgContext);
  const classes = useStyles();
  const usersInfoCard = getUserCard(selectedOrg, userOrgRoles, classes);
  const userGroupInfoCard = getUserGroupCard(selectedOrg, userOrgRoles, classes);
  const [state, setState] = useState({ right: false, openMenu: false });
  const [orgData, setOrgData] = useState({});
  const anchor = 'right';
  /**
   * To open and close the drawer
   */
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  /**
   * To open drawer on click on update org
   */
  const updateOrg = () => {
    setState({ ...state, [anchor]: true });
  };
  /**
   *Handle renderUpdateOrgBtn
   * @description this method return component if user superadmin otherwise null
   */
  const renderUpdateOrgBtn = () => {
    const userRole = userOrgRoles.find((role) => role.orgId === selectedOrg.id);

    if (userRole.role === 'Admin' && !isSuperAdmin) {
      return (
        <div>
          <Tooltip title="Update Organisation" aria-label="update">
            <Fab color="primary" onClick={updateOrg} className={classes.fab}>
              <UpdateIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    setOrgData(selectedOrg);
  }, [selectedOrg]);
  return (
    <div>
      <Box px={4} mt={12}>
        <Grid container>
          <Grid item md={8} lg={8}>
            <Typography variant="h2">
              <Box color="secondary.main">Organisations Dashboard</Box>
            </Typography>
            <Grid item md={12} lg={12}>
              <Box mt={1} mb={3}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                  <NavLink className={classes.breadcrumbsNavlink} to="/">
                    Organisation List
                  </NavLink>
                  <Typography color="textPrimary">
                    {selectedOrg ? selectedOrg.name : 'Organisation Dashboard'}
                  </Typography>
                </Breadcrumbs>
              </Box>
            </Grid>
          </Grid>
          <Box mb={3} textAlign="right" clone>
            <Grid item md={4} lg={4} className={classes.righBtn}>
              {renderUpdateOrgBtn()}
            </Grid>
          </Box>
          <Box clone>
            <Grid container spacing={3}>
              {usersInfoCard}
              {userGroupInfoCard}
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        classes={{ paper: classes.sideDrawerPaper }}
      >
        <OrgEditorDrawer toggleDrawer={toggleDrawer(anchor, false)} orgData={orgData} showLoader={showLoader} />
      </Drawer>
    </div>
  );
};
export default OrgLandingPage;
