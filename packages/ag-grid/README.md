# @latticejs/ag-grid

An ag-Grid component to customise the behaviour of the grid.

## Install

```bash
npm install @latticejs/ag-grid --save-dev

```

## Features

- Use ag-Grid to customise Grid.
- Storybook
- ag-Grid with MUI Theme
- No `react-script` usage

## Usage

```javascript
import React, { Component } from 'react';
import LatticeAgGgrid from '@latticejs/ag-grid';
import '@latticejs/ag-grid/styles/lattice-ag-grid-style.css';

export class AgGrid extends Component {
  getGrid(gridObj) {
    console.log(gridObj);
  }
  render() {
    return (
      <LatticeAgGgrid
        animateRows
        enableSorting
        enableFilter
        enableColResize
        rowDragManaged
        pagination
        paginationAutoPageSize
        columnDefs="Pass your column definition"
        rowData="Pass your ag-grid data array coming from api here"
        rowSelection="multiple"
        afterGridCreated={this.getGrid}
      >
      </LatticeAgGgrid>
    );
  }
}

```

The above snippet will render a basic ag-Grid with a material _look'n'feel_. It also support themes (dark, light). 


## PROPS


### animateRows
> `boolean` | Defaults to `true` 

### enableSorting
> `boolean` | Defaults to `true`
                
### enableFilter
> `boolean` | Defaults to `true`

### enableColResize
> `boolean` | Defaults to `true` 

### rowDragManaged
> `boolean` | Defaults to `true`
        
### pagination
> `boolean` | Defaults to `true`

### paginationAutoPageSize
> `boolean` | Defaults to `true` 

### columnDefs
- Pass your array of objects containing ag-Grid header column names.
        
### rowData
- Set your row data containing array of objects in state and pass it to rowData props .

### rowSelection
> Pass either `multiple` or `single` in this prop.

### afterGridCreated
- This prop is used to get the reference of lattice ag-Grid so that user can use the properties of ag-Grid by using `getGrid()` function.

You can also pass other props. Here are the reference of props list [references](https://www.ag-grid.com/javascript-grid-properties/).
