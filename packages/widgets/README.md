# @latticejs/widgets

Set of small Lattice components for common tasks like loaders, side-menus and more.

## Table of contents

- [Install](#install)
- [Loader](#loader)
- [SideMenu](#sidemenu)
- [Widget](#widget) 

## <a name="install"></a>Install

```bash
npm install @latticejs/widgets
```

## <a name="loader"></a>Loader

### Usage

```jsx
import React, { Component } from 'react';
import { Loader } from '@latticejs/widgets';

class App extends Component {
  state = {
    isLoading: true 
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false 
      });
    }, 2000);    
  }

  render() {
    const { isLoading } = this.state;
    return (
      <Loader loading={isLoading}>
        <h1>Loaded!</h1>
      </Loader>
    );    
  }
}
```

### API

#### loader

> `boolean` | defaults to `false`

Used to indicate when the content is loaded and the loader should disappear.

#### component

> `string`/`function` | defaults to `linear`

Used to indicate the type of loader. `Loader` comes with a couple of predefined loaders, these are: `linear` and `circular`. It can also receive a custom function (stateless component) as a loader.

#### children

> `function` | defaults to `undefined`

Used to indicate the content to be displayed after the loader.

## <a name="sidemenu"></a>SideMenu

### Usage

```jsx
import React, { Component } from 'react';
import { SideMenu } from '@latticejs/widgets';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';

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
  }
];

class App extends Component {
  render() {
    return (
      <SideMenu 
        navigation={navigation}
        onItemClick={(item) => console.log(item)} 
      />
    )
  }
}
```

### API

#### navigation

> `array` | defaults to `undefined`

Used to indicate navigable routes.

#### activeRoute

> `object` | defaults to `undefined`

Used to indicate if a route should be highlighted or selected. 

#### onItemClick

> `function` | defaults to `noOp`

Used to capture a click triggered on any navigation route. The cb function will be called with an object containing the selected route.

#### width

> `number` | defaults to `250`

Used to indicate component's width.

#### minWidth

> `number` | defaults to `80`

Used to indicate component's min width.

## <a name="widget"></a>Widget 

### Usage

```jsx
import React, { Component } from 'react';
import { Widget } from '@latticejs/widgets';

class App extends Component {
  render() {
    return (
      <Widget featured title="Title">
        Basic Widget 
      </Widget>
    )    
  }
}
```

### API

#### title

> `string` | defaults to `undefined`

Used to indicate a widget's title.


#### featured

> `boolean` | defaults to `false`

Used to indicate if the widget should have the _featured_ style applied.

#### elevation

> `number` | defaults to `2`

Used to indicate Material Paper elevation's property.

#### border

> `string` | defaults to `undefined`

Used to indicate if the widget should display a themed border. Values can be: `top`, `bottom` or you can pass a customized border style.

#### classes

> `object` | defaults to `undefined`

Used to pass a JSS object for overwriting top or bottom style.


## FAQs

_TBD_
