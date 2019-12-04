import React, { Component } from 'react';
import LatticeAgGrid from '../src/';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';
import '@latticejs/ag-grid/styles/lattice-ag-grid-style.css';
import httpHelper from '../helper/httpHelper';

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class AgGrid extends Component {
  constructor(props) {
    super(props);
    this.gotData = this.gotData.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.getGrid = this.getGrid.bind(this);
    this.state = {
      columnDefs: [
        {
          headerName: 'Name',
          field: 'name',
          pinned: true,
          filter: 'agTextColumnFilter',
          rowDrag: true,
          checkboxSelection: true
        },
        {
          headerName: 'Native Name',
          field: 'nativeName',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Capital',
          field: 'capital',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Population',
          field: 'population',
          filter: 'agNumberColumnFilter'
        },
        {
          headerName: 'Region Info',
          children: [
            {
              headerName: 'Region',
              field: 'region',
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Sub-Region',
              field: 'subregion',
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Area',
              field: 'area',
              filter: 'agNumberColumnFilter'
            }
          ]
        }
      ],
      rowData: [],
      showPagination: false
    };
  }
  componentDidMount() {
    const httpObj = {
      url: '/all?fields=name;capital;currencies;region;subregion;area;nativeName;languages;timezones;population',
      method: 'get'
    };
    httpHelper(httpObj, this.gotData);
  }

  gotData({ data }) {
    this.setState({ rowData: data });
  }

  handlePagination() {
    this.setState({ showPagination: !this.state.showPagination });
  }

  getGrid(gridObj) {
    console.log(gridObj);
  }

  handleNightModeChange() {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  }

  render() {
    const { columnDefs, rowData, showPagination } = this.state;
    return (
      <LatticeAgGrid
        animateRows
        enableSorting
        enableFilter
        enableColResize
        rowDragManaged={!showPagination}
        pagination={showPagination}
        paginationAutoPageSize={showPagination}
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection="multiple"
        afterGridCreated={this.getGrid}
      ></LatticeAgGrid>
    );
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('Ag-Grid', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'Light Theme',
      withApiReadme(() => <AgGrid />)
    );

  storiesOf('Ag-Grid', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'Dark Theme',
      withApiReadme(() => <AgGrid />)
    );
};
