import React, { Component } from 'react';
import classnames from 'classnames';

// Material-UI
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Grid from 'material-ui/Grid'
import Hidden from 'material-ui/Hidden';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

// Material-UI Icons
import Exit from 'material-ui-icons/ExitToApp';
import LightbulbOutline from 'material-ui-icons/LightbulbOutline';
import MenuIcon from 'material-ui-icons/Menu';
import MoreVerticalIcon from 'material-ui-icons/MoreVert';

// Router
import { Redirect, withRouter } from 'react-router-dom';

// Apollo
import { compose, graphql } from 'react-apollo';

// @lattice
import SideMenu from '@lattice/widgets/SideMenu';

// Ours
import routes, { routeByPath, navigation } from './routes';
import Content from '../components/Content';
import Lightbulb from '../components/icons/Lightbulb';
import PrivateRoute from './PrivateRoute';

import ui, { updateNightMode } from '../queries/ui';
import { signOut } from '../queries/user';

const styles = theme => ({
  root: {
    'transition-property': 'padding',
    'transition-duration': '.35s',
    'transition-timing-function': 'ease',
    margin: 0,
    width: `100%`,
  
  },
  'with-sidemenu': {
    [theme.breakpoints.up('sm')]: {
      'padding-left': 200
    }    
  },
  'with-sidemenumini': {
    [theme.breakpoints.up('sm')]: {
      'padding-left': 70
    }
  },
  drawer: {
    backgroundColor: '#444'
  },
  appBar: {
    backgroundColor: theme.palette.type === 'dark' ? '#444' : '#fff',
    color: theme.palette.type === 'dark' ? '#fafafa' : '#444'
  },
  flexed: {
    flex: 1
  }
});

class Main extends Component {
  state = {
    sideMenuMini: false,
    sideOpen: false
  }

  handleDrawerMiniToggle = () => {
    this.setState({
      sideMenuMini: !this.state.sideMenuMini
    });
  }

  handleDrawerToggle = () => {
    this.setState({
      sideOpen: !this.state.sideOpen
    });
  }

  handleMenuItemClick = ({ path }) => {
    const { history } = this.props;
    this.setState({
      sideOpen: false
    }, () => { history.push(path); })
    
  }

  handleNightModeChange =  (e, checked) => {
    const { updateNightMode, nightMode } = this.props;
    updateNightMode({
        variables: {
          nightMode: !nightMode
        }
    })
  }

  handleSignOut = () => {
    const { signOut } = this.props;
    signOut();
  }

  renderSideMenu () {
    const { location: { pathname: activePath } } = this.props;
    const { sideMenuMini } = this.state;
    const activeRoute = routeByPath(activePath);

    return (
      <SideMenu
        width={200}
        miniWidth={70}
        mini={sideMenuMini}
        navigation={navigation}
        activeRoute={activeRoute}
        onItemClick={this.handleMenuItemClick}
      />
    )
  }

  render() {
    const { location: { pathname: activePath }, classes, nightMode } = this.props;
    const { sideMenuMini, sideOpen } = this.state;
    const activeRoute = routeByPath(activePath);
    const className = classnames(classes.root, classes['with-sidemenu' + (sideMenuMini ? 'mini' : '') ]);

    return (
      <Grid container className={className}>
        <Hidden xsDown>
          <Drawer
            open
            variant="persistent"
            classes={{paper: classes.drawer}}
          >
          {this.renderSideMenu()}
          </Drawer>
        </Hidden>
        <Hidden smUp>
          <Drawer
            open={sideOpen}
            variant="temporary"
            classes={{paper: classes.drawer}}

          >
          {this.renderSideMenu()}
          </Drawer>
        </Hidden>        
        <AppBar position="static" className={classes.appBar} elevation={2} >
          <Toolbar>
            <Hidden xsDown>
              <Tooltip id="appbar-sidemenu" title="Toggle mini/full menu" placement="bottom-start" enterDelay={300}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerMiniToggle}
                >
                  { sideMenuMini ?  <MenuIcon /> : <MoreVerticalIcon /> }
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden smUp>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="title" color="inherit">
              {activeRoute && (activeRoute.breadcrumb || activeRoute.title)}
            </Typography>
            <div className={classes.flexed}/>
            <Tooltip id="appbar-theme" title="Toggle Night Mode" enterDelay={300}>
              <IconButton onClick={this.handleNightModeChange} color="inherit">
              { nightMode ? <LightbulbOutline /> : <Lightbulb /> }
              </IconButton>
            </Tooltip>
            <IconButton onClick={this.handleSignOut} color="inherit">
              <Exit/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Content className={classes.content}>
          {
            routes.map((route, index) => {
              const { path, redirect, component: RouteComponent } = route;
              return (
                <PrivateRoute
                  key={`route-${index}`}
                  exact
                  path={path}
                  render={ props => {
                    return redirect ?
                      <Redirect to={redirect} /> :
                      <RouteComponent {...props} />
                  }}
                />
              )
            })
          }
        </Content>
      </Grid>
    );
  }
}

export default compose(
  graphql(ui, {
    props: ({ data: { ui: { nightMode } } }) => ({
      nightMode
    })
  }),
  graphql(updateNightMode, { name: 'updateNightMode' }),
  graphql(signOut, { name: 'signOut' }),
  withRouter,
  withStyles(styles)
)(Main);

