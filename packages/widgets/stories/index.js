import React from 'react';
import { Widget, SideMenu } from '../src';
// Material UI
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';

const DummyComponent = () => <div>Children</div>;

const navigation = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: DummyComponent,
    icon: DashboardIcon
  },
  {
    path: '/employees',
    title: 'Employees',
    component: DummyComponent,
    icon: PeopleIcon
  }
];

const MuiThemeWrapper = ({ children }) => {
  const muiTheme = {
    palette: {
      type: 'light'
    },
    typography: {
      title: {
        fontWeight: 300
      }
    }
  };
  return (
    <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
      <CssBaseline>{children}</CssBaseline>
    </MuiThemeProvider>
  );
};

export default ({ storiesOf, action }) => {
  storiesOf('Widget', module)
    .add('basic Widget', () => <Widget title="basic Widget" />)
    .add('Widget with light theme', () => (
      <MuiThemeWrapper>
        <Widget title="MUI Widget" />
      </MuiThemeWrapper>
    ));

  storiesOf('SideMenu', module).add('basic SideMenu', () => (
    <SideMenu width={200} miniWidth={70} navigation={navigation} />
  ));
};
