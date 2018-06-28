import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    display: 'flex',
    position: 'absolute'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
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
    // FIXME(dk): we should use the outerEl (div wrapping graph)
    // instead of adding a random div to the body.
    // this.props.outerEl.appendChild(this.el);
    document.body.appendChild(this.el);
    if (this.panel) this.panel.focus();
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  renderContentNode({ title }) {
    return (
      <React.Fragment>
        <Typography variant="body1">Node:</Typography>
        <Typography variant="body1" color="textSecondary">
          {title}
        </Typography>
      </React.Fragment>
    );
  }

  renderContentEdge({ source, target }) {
    return (
      <React.Fragment>
        <div>
          <Typography variant="caption">Source</Typography>
          <Typography variant="body1">{source}</Typography>
        </div>
        <div>
          <Typography variant="caption">Target</Typography>
          <Typography variant="body1">{target}</Typography>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { children, classes, title, source, target, style } = this.props;
    return createPortal(
      <Card className={classes.panel} style={style}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {title ? this.renderContentNode({ title }) : this.renderContentEdge({ source, target })}
          </CardContent>
        </div>
        <div className={classes.controls}>{children && children()}</div>
      </Card>,
      this.el
    );
  }
}

export default withStyles(styles, { withTheme: true })(GraphPanel);
