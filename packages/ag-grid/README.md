# @latticejs/ag-grid

An ag-Grid component to customise the behaviour of the grid.

## Install

```bash
npm install @latticejs/ag-grid
```

## Usage

```javascript
import React, { Component } from 'react';
import LatticeAgGgrid from '@latticejs/ag-grid';
import '@latticejs/ag-grid/styles/lattice-ag-grid-style.css';

export class AgGrid extends Component {
  render() {
    return (
      <LatticeAgGgrid
        animateRows
        enableSorting
        enableFilter
        enableColResize
        rowSelection="multiple"
      >
      </LatticeAgGgrid>
    );
  }
}

```

The above snippet will render a basic ag-grid with a material _look'n'feel_. It also support themes (dark, light). 

<!-- start:api -->

## API


### animateRows

> `boolean` | Defaults to `true` 


### enableSorting

> `boolean` | Defaults to `true`
        
        
### enableFilter

> `boolean` | Defaults to `true`


<!-- end:api -->

## FAQs

// TBD
