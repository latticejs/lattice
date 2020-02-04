import React, { Component } from 'react';
import classnames from 'classnames';

// Material-UI
import { Collapse, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.grey[800],
    paddingTop: 0,
    'transition-property': 'all',
    'transition-duration': '.35s',
    'transition-timing-function': 'ease'
  },
  topSpacer: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(0)
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  listItemGutters: {
    padding: '12px 25px'
  },
  listItemPrimary: {
    color: '#fff'
  },
  listItemText: {
    whiteSpace: 'nowrap'
  },
  listItemHidden: {
    display: 'none'
  },
  listItemTextInset: {
    marginLeft: 8
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)'
  }
});

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMini: props.mini || false,
      mouseOver: false,
      open: this.getActiveRouteGroup()
    };
  }

  getActiveRouteGroup() {
    const { activeRoute, navigation } = this.props;
    return navigation.filter(r => r.children && r.children.includes(activeRoute))[0] || null;
  }

  handleMouseEnter = () => {
    this.setState({ mouseOver: true });
  };

  handleMouseLeave = () => {
    this.setState({ mouseOver: false });
  };

  toggleGroup(route) {
    this.setState({
      open: this.isOpen(route) ? null : route
    });
  }

  isOpen(route) {
    const { open } = this.state;
    return open === route;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mini !== prevState.showMini) {
      return {
        showMini: nextProps.mini
      };
    }

    return null;
  }

  isActive(route) {
    const { activeRoute } = this.props;
    return route === activeRoute || (route.children && route.children.includes(activeRoute));
  }

  renderRoute(route, index, inset) {
    const { showMini, mouseOver } = this.state;
    const { title, icon: Icon } = route;
    const { onItemClick, classes } = this.props;
    const itemClassName = classnames([
      classes.listItemText,
      !showMini || mouseOver ? '' : classes.listItemHidden,
      inset && classes.listItemTextInset
    ]);
    return (
      <ListItem
        button
        key={`nav-route-${index}`}
        onClick={() => onItemClick(route)}
        className={classnames(this.isActive(route) ? classes.activeItem : classes.listItem)}
        classes={{
          gutters: classes.listItemGutters
        }}
      >
        {Icon && (
          <ListItemIcon>
            <Icon style={{ margin: '0', color: '#fff' }} />
          </ListItemIcon>
        )}
        <ListItemText
          primary={title}
          className={itemClassName}
          classes={{
            primary: classes.listItemPrimary
          }}
        />
      </ListItem>
    );
  }

  renderGroup(route, index) {
    const { showMini, mouseOver } = this.state;
    const { classes } = this.props;
    const itemClassName = classnames(classes.listItemText, !showMini || mouseOver ? '' : classes.listItemHidden);

    const { title, children, icon: Icon } = route;
    const isActive = this.isActive(route);
    const isOpen = this.isOpen(route);

    return (
      <React.Fragment key={index}>
        <ListItem
          button
          onClick={() => this.toggleGroup(route)}
          className={classnames(isActive ? classes.activeItem : classes.listItem)}
          classes={{
            gutters: classes.listItemGutters
          }}
        >
          <ListItemIcon>{Icon && <Icon style={{ margin: '0', color: '#fff' }} />}</ListItemIcon>
          <ListItemText
            primary={title}
            className={itemClassName}
            classes={{
              primary: classes.listItemPrimary
            }}
          />
          {(!showMini || mouseOver) &&
            (isOpen ? (
              <ExpandLess style={{ margin: '0', color: '#fff' }} />
            ) : (
              <ExpandMore style={{ margin: '0', color: '#fff' }} />
            ))}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((route, idx) => this.renderRoute(route, `${index}-${idx}`, true))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }

  render() {
    const { showMini, mouseOver } = this.state;
    const { navigation, width = 250, miniWidth = 80, classes, className = '' } = this.props;
    const wrapperWidth = !showMini || mouseOver ? width : miniWidth;

    return (
      <List
        className={classnames(classes.root, className)}
        style={{ width: wrapperWidth }}
        component="nav"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={classes.topSpacer} />
        {navigation.map((route, index) => {
          return route.children ? this.renderGroup(route, index) : this.renderRoute(route, index);
        })}
      </List>
    );
  }
}

export default withStyles(styles)(SideMenu);
