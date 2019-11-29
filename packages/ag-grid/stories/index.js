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
      // gridClass: 'ag-theme-material',
      showPagination: false
    };
    console.log(this.state);
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

  handleNightModeChange() {
    const { updateTheme, nightMode } = this.props;

    // if (this.state.gridClass === 'ag-theme-material') {
    //   this.setState({ gridClass: 'ag-theme-balham-dark' });
    // } else {
    //   this.setState({ gridClass: 'ag-theme-material' });
    // }

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
      ></LatticeAgGrid>
    );
  }
}

// class AdvancedGauge extends Component {
//   constructor() {
//     super();
//     this.customGauge = {
//       units: 'mph',
//       width: 300,
//       height: 300,
//       barWidth: '5',
//       barShadow: '0',
//       borderShadowWidth: '20',
//       borderInnerWidth: '0',
//       borderOuterWidth: '0',
//       borderMiddleWidth: '0',
//       highlights: 'false',
//       valueBoxStroke: '0',
//       needleWidth: '3',
//       animateOnInit: 'true',
//       animatedValue: 'true',
//       animationDuration: '1500',
//       animationRule: 'linear',
//       colorValueBoxShadow: '0',
//       valueBoxBorderRadius: '0',
//       valueTextShadow: '0',
//       needleType: 'arrow',
//       colorValueBoxBackground: 'transparent'
//     };
//   }
//   render() {
//     return <Gauge value={30} settings={this.customGauge} />;
//   }
// }

// class BasicThemedGauge extends Component {
//   constructor() {
//     super();
//     this.customGauge = {
//       width: 250,
//       height: 250,
//       startAngle: 90,
//       ticksAngle: 180,
//       needleStart: 70,
//       needleEnd: 95,
//       valueBox: false,
//       maxValue: 100,
//       highlights: [],
//       barWidth: 20,
//       majorTicks: [],
//       minorTicks: 0,
//       strokeTicks: false,
//       colorPlate: 'transparent',
//       colorMajorTicks: 'transparent',
//       colorNumbers: 'transparent',
//       borderShadowWidth: 0,
//       borders: false,
//       needleType: 'line',
//       needleWidth: 3,
//       needleCircleOuter: false,
//       needleCircleInner: false,
//       animateOnInit: 'true',
//       animationDuration: 1500,
//       animationRule: 'linear'
//     };
//   }
//   render() {
//     return <Gauge value={30} settings={this.customGauge} />;
//   }
// }

// class AdvancedThemedGauge extends Component {
//   constructor() {
//     super();
//     this.customGauge = {
//       units: 'mph',
//       width: 300,
//       height: 300,
//       barWidth: '5',
//       barShadow: '0',
//       borderShadowWidth: '20',
//       borderInnerWidth: '0',
//       borderOuterWidth: '0',
//       borderMiddleWidth: '0',
//       highlights: 'false',
//       valueBoxStroke: '0',
//       needleWidth: '3',
//       animateOnInit: 'true',
//       animatedValue: 'true',
//       animationDuration: '1500',
//       animationRule: 'linear',
//       colorValueBoxShadow: '0',
//       valueBoxBorderRadius: '0',
//       valueTextShadow: '0',
//       needleType: 'arrow',
//       colorValueBoxBackground: 'transparent'
//     };
//   }
//   render() {
//     return <Gauge value={30} settings={this.customGauge} />;
//   }
// }

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
      'dark Theme',
      withApiReadme(() => <AgGrid />)
    );

  // storiesOf('gauge', module)
  //   .addDecorator(Flexed)
  //   .addDecorator(muiTheme())
  //   .addDecorator(FullViewport)
  //   .add('advanced', withApiReadme(() => <AdvancedGauge />));

  // storiesOf('gauge/themed', module)
  //   .addDecorator(Flexed)
  //   .addDecorator(muiTheme({ palette: { type: 'dark' } }))
  //   .addDecorator(FullViewport)
  //   .add(
  //     'basic (dark)',
  //     withApiReadme(() => (
  //       <PaperWrap>
  //         <BasicThemedGauge />
  //       </PaperWrap>
  //     ))
  //   );

  // storiesOf('gauge/themed', module)
  //   .addDecorator(Flexed)
  //   .addDecorator(muiTheme({ palette: { type: 'dark' } }))
  //   .addDecorator(FullViewport)
  //   .add(
  //     'advanced (dark)',
  //     withApiReadme(() => (
  //       <PaperWrap>
  //         <AdvancedThemedGauge />
  //       </PaperWrap>
  //     ))
  //   );
};
