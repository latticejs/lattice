import React, { Component } from 'react';
// Material-UI
import { Grid } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
// import '../styles/lattice-ag-grid-style.css';
import { withTheme } from '@material-ui/core/styles';

class LatticeAgGrid extends Component {
  constructor(props) {
    super(props);
    this.agGridRef = this.agGridRef.bind(this);
    if (this.props.theme.palette.type === 'light') {
      this.state = { gridClass: 'ag-theme-material' };
    } else if (this.props.theme.palette.type === 'dark') {
      this.state = { gridClass: 'ag-theme-material-dark' };
    }
  }

  agGridRef(gridObj) {
    this.props.afterGridCreated(gridObj);
  }

  render() {
    return (
      <Grid
        item
        xs={12}
        className={this.state.gridClass}
        style={{
          height: window.innerHeight - 100,
          margin: '20px 20px'
        }}
      >
        <AgGridReact {...this.props} ref={this.agGridRef} />
      </Grid>
    );
  }
}

export default withTheme(LatticeAgGrid);
