import React from 'react';
import { action } from '@storybook/addon-actions';

// Material UI
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
// Material UI Icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Map';
import PageViewIcon from '@material-ui/icons/Pageview';
import PeopleIcon from '@material-ui/icons/People';

// Ours
import { SideMenu } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { JssDecorator } from './utils';

// Decorators

const InGrid = story => (
  <Grid container spacing={24}>
    <Drawer open variant="persistent">
      {story()}
    </Drawer>
  </Grid>
);

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);
const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

export default ({ storiesOf }) => {
  storiesOf('widgets/SideMenu', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', () => (
      <Styled>
        {classes => <SideMenu navigation={navigation} className={classes.flexed} onItemClick={action('click')} />}
      </Styled>
    ))
    .add('selected', () => (
      <Styled>
        {classes => (
          <SideMenu
            navigation={navigation}
            activeRoute={navigation[0]}
            className={classes.flexed}
            onItemClick={action('click')}
          />
        )}
      </Styled>
    ))
    .add('mini selected', () => (
      <Styled>
        {classes => (
          <SideMenu
            mini
            navigation={navigation}
            activeRoute={navigation[0]}
            className={classes.flexed}
            onItemClick={action('click')}
          />
        )}
      </Styled>
    ));
};

const styles = theme => ({
  flexed: {
    flex: 1
  }
});

const Styled = withStyles(styles)(({ classes, children }) => {
  return children(classes);
});

const navigation = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: DashboardIcon
  },
  {
    path: '/employees',
    title: 'Employees',
    icon: PeopleIcon
  },
  {
    title: 'Theme',
    icon: InsertChartIcon,
    children: [
      {
        path: '/map',
        title: 'Maps',
        icon: MapIcon
      },
      {
        path: '/pageview',
        title: 'Page Views',
        icon: PageViewIcon
      }
    ]
  }
];
