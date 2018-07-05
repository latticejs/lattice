import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  card: {
    position: 'absolute'
  },
  details: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.background.default
  },
  content: {
    flex: '1 0 auto'
  },
  controls: {
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

class GraphPanel extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
  componentDidMount() {
    this.props.outerEl.appendChild(this.el);
    if (this.panel) this.panel.focus();
  }

  componentWillUnmount() {
    this.props.outerEl.removeChild(this.el);
  }

  renderContentNode({ title }) {
    return (
      <Grid item xs={12}>
        <Typography variant="caption" color="default">
          Node
        </Typography>
        <Typography variant="body2" color="inherit">
          {title}
        </Typography>
      </Grid>
    );
  }

  renderContentEdge({ source, target }) {
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="default">
            Source
          </Typography>
          <Typography variant="body2" color="inherit">
            {source}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="default">
            Target
          </Typography>
          <Typography variant="body2" color="inherit">
            {target}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { children, classes, title, source, target, style, actions = {} } = this.props;

    return createPortal(
      <Card className={classes.panel} style={style}>
        <Grid item container alignItems="center">
          <Grid item xs={12} className={classes.details}>
            <CardContent className={classes.content}>
              {title ? this.renderContentNode({ title }) : this.renderContentEdge({ source, target })}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.controls}>{children && children({ ...actions })}</div>
          </Grid>
        </Grid>
      </Card>,
      this.el
    );
  }
}

export default withStyles(styles, { withTheme: true })(GraphPanel);
