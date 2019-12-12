import React, { Component } from 'react';

// Lattice packages
import LatticeAgGrid from '@latticejs/ag-grid';
import '@latticejs/ag-grid/styles/lattice-ag-grid-style.css';
import dataArr from '../resources/data';

class AgGrid extends Component {
    constructor(props) {
        super(props);

        this.rowData = dataArr;
        this.columnDefs = [{
            headerName: 'State',
            field: 'name',
            width: window.innerWidth/3.3,
            filter: 'agTextColumnFilter',
            rowDrag: true,
            checkboxSelection: true
        },
        {
            headerName: 'County',
            field: 'county',
            width: window.innerWidth/3.3,
            filter: 'agTextColumnFilter'
        },
        {
            headerName: 'Population',
            field: 'size',
            width: window.innerWidth/3.4,
            filter: 'agTextColumnFilter'
        }];

        this.state = {
            showPagination: false
        };
    }
    
    render() {
        const { showPagination } = this.state;

        return(
            <LatticeAgGrid
              animateRows
              enableSorting
              enableFilter
              rowDragManaged={!showPagination}
              pagination={showPagination}
              paginationAutoPageSize={showPagination}
              columnDefs={this.columnDefs}
              rowData={this.rowData}
              rowSelection="multiple"
              gridContainerStyle={{
                height: window.innerHeight - 315
              }}
            />
        )
    }
}

export default AgGrid;