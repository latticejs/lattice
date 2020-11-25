import React, { useState } from 'react';
import classnames from 'classnames';

// Material-UI
import { Collapse, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.grey[800],
    paddingTop: 0,
    'transition-property': 'all',
    'transition-duration': '.35s',
    'transition-timing-function': 'ease',
  },
  topSpacer: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(0),
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  listItemGutters: {
    padding: '12px 25px',
  },
  listItemPrimary: {
    color: '#fff',
  },
  listItemText: {
    whiteSpace: 'nowrap',
  },
  listItemHidden: {
    display: 'none',
  },
  listItemTextInset: {
    marginLeft: 8,
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});

const SideMenu = (props) => {
  const getActiveRouteGroup = () => {
    const { activeRoute, navigation } = props;
    return navigation.filter((r) => r.children && r.children.includes(activeRoute))[0] || null;
  };

  const [state, setState] = useState({
    showMini: props.mini || false,
    mouseOver: false,
    open: getActiveRouteGroup(),
  });

  const handleMouseEnter = () => {
    setState({ ...state, mouseOver: true });
  };

  const handleMouseLeave = () => {
    setState({ ...state, mouseOver: false });
  };

  const isOpen = (route) => {
    const { open } = state;
    return open === route;
  };

  const toggleGroup = (route) => {
    setState({
      ...state,
      open: isOpen(route) ? null : route,
    });
  };

  const isActive = (route) => {
    const { activeRoute } = props;
    return route === activeRoute || (route.children && route.children.includes(activeRoute));
  };

  const renderRoute = (route, index, inset) => {
    const { showMini, mouseOver } = state;
    const { title, icon: Icon } = route;
    const { onItemClick, classes } = props;
    const itemClassName = classnames([
      classes.listItemText,
      !showMini || mouseOver ? '' : classes.listItemHidden,
      inset && classes.listItemTextInset,
    ]);
    return (
      <ListItem
        button
        key={`nav-route-${index}`}
        onClick={() => onItemClick(route)}
        className={classnames(isActive(route) ? classes.activeItem : classes.listItem)}
        classes={{
          gutters: classes.listItemGutters,
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
            primary: classes.listItemPrimary,
          }}
        />
      </ListItem>
    );
  };

  const isActiveNew = (route) => {
    const { activeRoute } = props;
    return route === activeRoute || (route.children && route.children.includes(activeRoute));
  };

  const isOpenNew = (route) => {
    const { open } = state;
    return open === route;
  };

  const renderGroup = (route, index) => {
    const { showMini, mouseOver } = state;
    const { classes } = props;
    const itemClassName = classnames(classes.listItemText, !showMini || mouseOver ? '' : classes.listItemHidden);

    const { title, children, icon: Icon } = route;

    const isActive = isActiveNew(route);
    const isOpen = isOpenNew(route);

    return (
      <React.Fragment key={index}>
        <ListItem
          button
          onClick={() => toggleGroup(route)}
          className={classnames(isActive ? classes.activeItem : classes.listItem)}
          classes={{
            gutters: classes.listItemGutters,
          }}
        >
          <ListItemIcon>{Icon && <Icon style={{ margin: '0', color: '#fff' }} />}</ListItemIcon>
          <ListItemText
            primary={title}
            className={itemClassName}
            classes={{
              primary: classes.listItemPrimary,
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
            {children.map((route, idx) => renderRoute(route, `${index}-${idx}`, true))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  const { showMini, mouseOver } = state;
  const { navigation, width = 250, miniWidth = 80, classes, className = '' } = props;
  const wrapperWidth = !showMini || mouseOver ? width : miniWidth;

  return (
    <List
      className={classnames(classes.root, className)}
      style={{ width: wrapperWidth }}
      component="nav"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.topSpacer} />
      {navigation.map((route, index) => {
        return route.children ? renderGroup(route, index) : renderRoute(route, index);
      })}
    </List>
  );
};

export default withStyles(styles)(SideMenu);
