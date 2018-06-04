import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dag from '../';
// Material UI
import { Paper } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// simple fake props
const getProps = (mix = {}) => {
  const defaults = {
    title: 'Package Dependencies',
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
  }
  return Object.assign(defaults, mix)
}

const PaperWrap = ({children}) => (
  <Paper
    elevation={2}
    style={{ width:'500px', height: '500px' }}
  >
    { children }
  </Paper>
)

export default ({storiesOf, action})  => {
storiesOf('Directed Acyclic Graph Component', module)
  .add('no wrapper, with dummy props (emulating super simple package.json) & default theme', () => {
    // TODO(dk): parse pkg json deps.
    return <Dag onClick={action('clicked')} {...getProps()} />
  })
  .add('with paper wrapper, dummy props & light theme', () => {
    // TODO(dk): parse pkg json deps.
    const props = getProps()
    const muiTheme = {
      palette: {
        type: 'light'
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
          <PaperWrap>
            <Dag onClick={action('clicked')} {...props} />
          </PaperWrap>
        </CssBaseline>
      </MuiThemeProvider>
    )
  })
  .add('with paper wrapper, dummy props & dark theme', () => {
    // TODO(dk): parse pkg json deps.
    const props = getProps()
    const muiTheme = {
      palette: {
        type: 'dark'
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
          <PaperWrap>
            <Dag onClick={action('clicked')} {...props} />
          </PaperWrap>
        </CssBaseline>
      </MuiThemeProvider>
    )
  })
}
