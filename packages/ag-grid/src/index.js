import React, { Component } from 'react';
// Material-UI
import { Grid } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

class LatticeAgGrid extends Component {
  constructor(props) {
    super(props);
    this.agGridRef = this.agGridRef.bind(this);

    if (this.props.theme.palette.type === 'light') {
      this.state = { gridClass: this.props.lightTheme };
    } else if (this.props.theme.palette.type === 'dark') {
      this.state = { gridClass: this.props.darkTheme };
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.theme !== prevProps.theme) {
      if (this.props.theme.palette.type === 'light') {
        this.setState({ gridClass: this.props.lightTheme });
      } else if (this.props.theme.palette.type === 'dark') {
        this.setState({ gridClass: this.props.darkTheme });
      }
    }
  }

  /**
   * This function is created to send ag-grid object to afterGridCreated function .
   */
  agGridRef(gridObj) {
    if (this.props.afterGridCreated) {
      this.props.afterGridCreated(gridObj);
    }
  }

  render() {
    return (
      <Grid item xs={12} className={this.state.gridClass} style={this.props.gridContainerStyle}>
        <AgGridReact {...this.props} ref={this.agGridRef} />
      </Grid>
    );
  }
}

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

export default withTheme(LatticeAgGrid);
