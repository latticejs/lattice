import React, { useState, useEffect } from 'react';
// Material-UI
import { Grid } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';

/**
 * Primary UI component for user interaction
 */
const LatticeAgGrid = ({ ...props }) => {
  const theme = useTheme();
  const [gridClass, setState] = useState(props.lightTheme);

  useEffect(() => {
    if (theme.palette.type === 'light') {
      setState(props.lightTheme);
    } else if (theme.palette.type === 'dark') {
      setState(props.darkTheme);
    }
  });

  /**
   * This function is created to send ag-grid object to afterGridCreated function .
   */
  const agGridRef = (gridObj) => {
    if (props.afterGridCreated) {
      props.afterGridCreated(gridObj);
    }
  };

  return (
    <Grid item xs={12} className={gridClass} style={props.gridContainerStyle}>
      <AgGridReact {...props} ref={agGridRef} />
    </Grid>
  );
};

LatticeAgGrid.propTypes = {
  darkTheme: PropTypes.string,
  lightTheme: PropTypes.string,
  gridContainerStyle: PropTypes.object,
};

LatticeAgGrid.defaultProps = {
  darkTheme: 'ag-theme-material-dark',
  lightTheme: 'ag-theme-material',
  gridContainerStyle: {
    height: window.innerHeight - 315,
  },
};

export default LatticeAgGrid;
