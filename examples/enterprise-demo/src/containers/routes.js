import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExtensionIcon from '@material-ui/icons/Extension';
// import InsertChartIcon from 'material-ui-icons/InsertChart';
// import MapIcon from 'material-ui-icons/Map'
// import PageViewIcon from 'material-ui-icons/Pageview';
import PeopleIcon from '@material-ui/icons/People';
// import PersonIcon from '@material-ui/icons/Person';
import TextFormatIcon from '@material-ui/icons/TextFormat';

import Dashboard from './Dashboard';
//import Employees from './Employees';
//import General from './theme/General';
//import Widgets from './theme/Widgets';

export const MAIN = '/';
export const SIGN_IN = '/login';
export const DASHBOARD = '/dashboard';
export const EMPLOYEES = '/employees';
export const THEME_GENERAL = '/theme/general';
export const THEME_WIDGETS = '/theme/widgets';

export const navigation = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: Dashboard,
    icon: DashboardIcon
  },
  //{
    //path: '/employees',
    //title: 'Employees',
    //component: Employees,
    //icon: PeopleIcon
  //},
  //{
    //title: 'Theme',
    //icon: ExtensionIcon,
    //children: [
      //{
        //path: '/theme/general',
        //title: 'General',
        //component: General,
        //icon: TextFormatIcon
      //},
      //{
        //path: '/theme/widgets',
        //title: 'Widgets',
        //component: Widgets,
        //icon: ContentCopyIcon
      //}
    //]
  //}
];

const routesInNavigation = () => {
  const sub = navigation
    .filter(r => r.children)
    .map(r => {
      const { title, children } = r;
      children.map(c => (c.breadcrumb = `${title} | ${c.title}`));
      return r;
    })
    .reduce((prev, curr) => prev.concat(...curr.children), []);

  return navigation.filter(r => r.path).concat(...sub);
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  ...routesInNavigation()
];

export default routes;

export const routeByPath = pathname => {
  return routes.filter(route => !route.redirect && route.path === pathname)[0];
};
