import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dag from '../';
// Material UI
import { createMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CssBaseline from 'material-ui/CssBaseline';
// Typeface
import 'typeface-roboto';

// simple fake props
const getProps = (mix = {}) => {
  const defaults = {
    nodes: [
      {title: 'app'},
      {title: 'lodash'}
    ],
    edges: [{
      source: 'app',
      target: 'lodash'
    }],
    width: 500,
    height: 500,
    nightMode: false
  }
  return Object.assign(defaults, mix)
}

const ThemeDecorator = (storyFn) => {
  const muiTheme = {
    palette: {
      type: storyFn().props.nightMode ? 'dark' : 'light'
    },
    typography: {
      title: {
        fontWeight: 300
      }
    }
  }

  return (
    <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
      <CssBaseline>
        { storyFn() }
      </CssBaseline>
    </MuiThemeProvider>
  )
}

storiesOf('Directed Acyclic Graph Component', module)
  .addDecorator(ThemeDecorator)
  .add('with some props (emulating super simple package.json) with default theme', () => {
    // TODO(dk): parse pkg json deps.
    return <Dag onClick={action('clicked')} {...getProps()} />
  })
  .add('with dark theme ON', () => {
    // TODO(dk): parse pkg json deps.
    return <Dag onClick={action('clicked')} {...getProps({nightMode:true})} />
  })
