import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// TODO (elmasse): Move this into a common location
export default (theme = {}) => (story, context) => {
  const muiTheme = { ...theme };
  return (
    <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
      <CssBaseline>{story(context)}</CssBaseline>
    </MuiThemeProvider>
  )
}
