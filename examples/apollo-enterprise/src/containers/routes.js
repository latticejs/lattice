import WidgetsIcon from '@material-ui/icons/Widgets';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExtensionIcon from '@material-ui/icons/Extension';
import PeopleIcon from '@material-ui/icons/People';
import TextFormatIcon from '@material-ui/icons/TextFormat';

import Dashboard from './Dashboard';
import Employees from './employees/List';
import EmployeesForm from './employees/Form';
import General from './theme/General';
import Widgets from './theme/Widgets';

export const MAIN = '/';
export const SIGN_IN = '/login';
export const DASHBOARD = '/dashboard';
export const EMPLOYEES = '/employees';
export const EMPLOYEES_CREATE = `${EMPLOYEES}/create`;
export const EMPLOYEES_EDIT = `${EMPLOYEES}/:id/edit`;
export const THEME_GENERAL = '/theme/general';
export const THEME_WIDGETS = '/theme/widgets';

export const navigation = [
  {
    path: DASHBOARD,
    title: 'Dashboard',
    component: Dashboard,
    icon: DashboardIcon,
  },
  {
    path: EMPLOYEES,
    title: 'Employees',
    component: Employees,
    icon: PeopleIcon,
  },
  {
    title: 'Theme',
    icon: ExtensionIcon,
    children: [
      {
        path: THEME_GENERAL,
        title: 'General',
        component: General,
        icon: TextFormatIcon,
      },
      {
        path: THEME_WIDGETS,
        title: 'Widgets',
        component: Widgets,
        icon: WidgetsIcon,
      },
    ],
  },
];

const routesInNavigation = () => {
  const sub = navigation
    .filter((r) => r.children)
    .map((r) => {
      const { title, children } = r;
      children.map((c) => (c.breadcrumb = `${title} | ${c.title}`));
      return r;
    })
    .reduce((prev, curr) => prev.concat(...curr.children), []);

  return navigation.filter((r) => r.path).concat(...sub);
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: EMPLOYEES_CREATE,
    title: 'Create Employee',
    component: EmployeesForm,
  },
  {
    path: EMPLOYEES_EDIT,
    title: 'Edit Employee',
    component: EmployeesForm,
  },
  ...routesInNavigation(),
];

export default routes;

export const routeByPath = (pathname) => {
  return routes.filter((route) => !route.redirect && route.path === pathname)[0];
};
