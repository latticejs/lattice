import { Link } from 'react-router-dom';
import { OrgContext } from './context';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { makeStyles } from '@material-ui/core/styles';

import './css/font.css';
import { useAuth0 } from './react-auth0-spa';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import LatticeLogo from './images/latticelogoy.svg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useContext } from 'react';
import Toolbar from '@material-ui/core/Toolbar';

// Custom Style
const useStyles = makeStyles((theme) => ({
  flex: {
    flexGrow: 1,
  },
  appBar: {
    position: 'fixed',
    backgroundColor: theme.palette.secondary.light,
    color: '#fff',
    boxShadow: '0px 3px 12px -4px #131D3122',
  },
  NavButtons: {
    textTransform: 'none',
  },
  profileLink: {
    textDecoration: 'none',
    color: theme.palette.secondary.main,
  },
}));

const TopNav = () => {
  const { userOrgs, selectedOrg, changeOrg, isSuperAdmin, orgMatch } = useContext(OrgContext);
  const orgPopupState = usePopupState({
    variant: 'popover',
    popupId: 'orgSwitcher',
  });
  const userPopupState = usePopupState({
    variant: 'popover',
    popupId: 'orgSwitcher',
  });
  const classes = useStyles();
  const { logout } = useAuth0();
  let orgLogo = LatticeLogo;
  let headerColor = '';
  const selectedOrgCode = orgMatch && orgMatch.params.orgCode ? orgMatch.params.orgCode : '';

  if (!isSuperAdmin && selectedOrg && selectedOrgCode) {
    orgLogo = selectedOrg.logo_url ? selectedOrg.logo_url : LatticeLogo;
    headerColor = selectedOrg.skin_color ? selectedOrg.skin_color : '';
  }

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };
  let orgSelector;

  if (userOrgs && selectedOrg) {
    orgSelector = (
      <React.Fragment key="key">
        <Button className={classes.NavButtons} color="inherit" {...bindTrigger(orgPopupState)}>
          {selectedOrg.name}
          <ExpandMoreIcon fontSize="small" />
        </Button>
        <Menu {...bindMenu(orgPopupState)}>
          {userOrgs.map((org, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                changeOrg({ org });
                orgPopupState.close();
              }}
            >
              {org.name}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
  return (
    <AppBar className={classes.appBar} style={{ backgroundColor: headerColor }}>
      <Toolbar>
        <div className={classes.flex}>
          <img height="44px" src={orgLogo} alt="latticeJs_logo" />
        </div>
        {orgSelector}
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            {...bindTrigger(userPopupState)}
          >
            <AccountCircle />
          </IconButton>
          <Menu {...bindMenu(userPopupState)}>
            <MenuItem onClick={userPopupState.close}>
              <Link to="/profile" className={classes.profileLink}>
                Profile
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                userPopupState.close();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default TopNav;
