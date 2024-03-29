import React, { useState } from 'react';
// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MuiTooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';

// Lattice
import Editor from '@latticejs/froala-editor';
import '@latticejs/froala-editor/styles/css/style.css';
import { Widget } from '@latticejs/widgets';
import { PieChart, Pie, Tooltip } from '@latticejs/mui-recharts';

// Custom Style
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText,
  },
  widget: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4),
  },
  link: {
    color: theme.palette.text.secondary,
  },
});

const Chart = (props) => (
  <PieChart width={400} height={400}>
    <Pie data={props.deps} dataKey="value" cx={200} cy={200} outerRadius={60} fill="#8884d8" />
    <Pie data={props.devDeps} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" />
    <Tooltip />
  </PieChart>
);

const App = (props) => {
  const [data] = useState({
    deps: [
      { name: '@latticejs/widgets', value: 123369 },
      { name: '@material-ui/core', value: 392567 },
      { name: '@material-ui/icons', value: 3630161 },
      { name: 'react', value: 5529 },
      { name: 'react-dom', value: 92455 },
      { name: 'typeface-roboto', value: 3064 },
    ],
    devDeps: [
      { name: 'babel-core', value: 539213 },
      { name: 'babel-loader', value: 46534 },
      { name: 'babel-plugin-transform-class-properties', value: 371741 },
      { name: 'babel-preset-env', value: 61171 },
      { name: 'babel-preset-react', value: 129792 },
      { name: 'css-loader', value: 214658 },
      { name: 'file-loader', value: 179134 },
      { name: 'html-webpack-plugin', value: 625851 },
      { name: 'style-loader', value: 170557 },
      { name: 'webpack', value: 1900109 },
    ],
  });

  const { classes, nightMode } = props;

  const handleNightModeChange = () => {
    const { updateTheme, nightMode } = props;
    updateTheme(!nightMode);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Minimal With Gulp Example
          </Typography>
          <MuiTooltip title="Toggle Night Mode" enterDelay={300}>
            <IconButton onClick={handleNightModeChange} color="inherit">
              {nightMode ? <DayIcon /> : <NightIcon />}
            </IconButton>
          </MuiTooltip>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={6}>
          <Grid container justify="space-around" spacing={Number(0)}>
            <Grid item xs={10}>
              <Widget className={classes.widget} title="About" border="bottom">
                <Typography variant="body1">
                  This is a minimal demo with respect to:
                  <br />
                  - minimal tooling (webpack and babel),
                  <br />
                  - no react-scripts,
                  <br />- consuming Lattice packages directly.
                </Typography>
              </Widget>
            </Grid>
            <Grid item xs={10}>
              <Widget className={classes.widget} title="Froala Editor" border="bottom">
                <Editor config={{ width: '100%' }} />
              </Widget>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="space-around" spacing={Number(0)}>
            <Grid item>
              <Widget className={classes.widget} title="Bundle data" border="bottom">
                <div>
                  {Chart(data)}
                  <Typography variant="caption" align="center">
                    NOTE: Actual sizes might be smaller if only parts of the package are used.
                  </Typography>
                </div>
              </Widget>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center">
            Want to learn more? Check the&nbsp;
            <a
              className={classes.link}
              href="https://github.com/latticejs/lattice"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs
            </a>
            !
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(App);
