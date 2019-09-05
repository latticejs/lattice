import { createMuiTheme } from '@material-ui/core/styles';
import { blue, amber } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: amber.A400,
      light: amber[200],
      dark: amber[700]
    },
    type: 'dark'
  },
  spacing: {
    unit: 10
  },
  typography: {
    useNextVariants: true
  },
  props: {
    MuiWithWidth: {
      initialWidth: 'lg'
    }
  }
});
