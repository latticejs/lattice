import React, { Component } from 'react';
import Types from 'prop-types';

// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';

// Material colors
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';

// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';
import { CssBaseline } from '@material-ui/core';
import Dialogs from './Dialogs';

const generateClassName = createGenerateClassName({
  productionPrefix: 'c'
});

// Custom Style
const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyItems: 'stretch',
    flexDirection: 'column'
  },
  appBar: {
    color: theme.palette.primary.contrastText
  },
  flex: {
    flexGrow: 1
  },
  container: {
    flex: '1',
    display: 'flex',
    padding: theme.spacing.unit,
    flexDirection: 'row'
  }
});

class Layout extends Component {
  state = {
    nightMode: false
  };

  createTheme() {
    const { nightMode } = this.state;

    return createMuiTheme({
      palette: {
        primary: blue,
        secondary: pink,
        type: nightMode ? 'dark' : 'light'
      },
      typography: {
        useNextVariants: true,
        suppressDeprecationWarnings: true
      }
    });
  }

  toggleTheme = () => {
    this.setState({
      nightMode: !this.state.nightMode
    });
  };

  render() {
    const { classes, children } = this.props;
    const { nightMode } = this.state;

    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline />

          <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.flex}>
                  Lattice CRUD
                </Typography>
                <Tooltip title="Toggle Night Mode" enterDelay={300}>
                  <IconButton onClick={this.toggleTheme} color="inherit">
                    {nightMode ? <DayIcon /> : <NightIcon />}
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <div className={classes.container}>{children}</div>
            <Dialogs />
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

Layout.propTypes = {
  children: Types.element,
  classes: Types.object
};

export default withStyles(styles)(Layout);
