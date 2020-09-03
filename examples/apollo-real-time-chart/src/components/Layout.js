import React from 'react';

// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';

// Custom Style
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText,
  },
  flex: {
    flexGrow: 1,
  },
  container: {
    margin: 8,
  },
});

const layout = (props) => {
  const { classes, nightMode, children } = props;

  const handleNightModeChange = () => {
    const { handleUpdateTheme, nightMode } = props;
    handleUpdateTheme(!nightMode);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Dashboard
          </Typography>
          <Tooltip title="Toggle Night Mode" enterDelay={300}>
            <IconButton onClick={handleNightModeChange} color="inherit">
              {nightMode ? <DayIcon /> : <NightIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>{children}</div>
    </div>
  );
};

export default withStyles(styles)(layout);
