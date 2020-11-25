import React from 'react';

import { SideMenu } from '../components';

import { action } from '@storybook/addon-actions';
import { withStyles } from '@material-ui/core/styles';

import DashboardIcon from '@material-ui/icons/Dashboard';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Map';
import PageViewIcon from '@material-ui/icons/Pageview';
import PeopleIcon from '@material-ui/icons/People';

export default {
  title: 'Widgets/SideMenu',
  component: SideMenu,
};

const Template = (args) => {
  if (args.type === 'basic') {
    return <Styled>{(classes) => <SideMenu navigation={navigation} className={classes.flexed} />}</Styled>;
  }

  if (args.type === 'selected') {
    return (
      <Styled>
        {(classes) => <SideMenu navigation={navigation} activeRoute={navigation[0]} className={classes.flexed} />}
      </Styled>
    );
  }
  if (args.type === 'mini') {
    return (
      <Styled>
        {(classes) => <SideMenu mini navigation={navigation} activeRoute={navigation[0]} className={classes.flexed} />}
      </Styled>
    );
  }
};

export const Basic = Template.bind({});
Basic.args = {
  type: 'basic',
};
Basic.argTypes = {
  onItemClick: { action: 'click' },
};

export const Selected = Template.bind({});
Selected.args = {
  type: 'selected',
};
Selected.argTypes = {
  onItemClick: { action: 'click' },
};

export const MiniSelected = Template.bind({});
MiniSelected.args = {
  type: 'mini',
};
MiniSelected.argTypes = {
  onItemClick: { action: 'click' },
};

const styles = (theme) => ({
  flexed: {
    flex: 1,
  },
});

const Styled = withStyles(styles)(({ classes, children }) => {
  return children(classes);
});

const navigation = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    path: '/employees',
    title: 'Employees',
    icon: PeopleIcon,
  },
  {
    title: 'Theme',
    icon: InsertChartIcon,
    children: [
      {
        path: '/map',
        title: 'Maps',
        icon: MapIcon,
      },
      {
        path: '/pageview',
        title: 'Page Views',
        icon: PageViewIcon,
      },
    ],
  },
];
