import React, { useEffect, useState } from 'react';
import LatticeAgGrid from '../components';
import muiTheme from '../../.storybook/decorator-material-ui';
import './styles/lattice-ag-grid-style.css';
import httpHelper from '../../helper/httpHelper';

export default {
  title: 'Example/LatticeAgGrid',
  component: LatticeAgGrid,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const AgGrid = () => {
  const [fields, setState] = useState({
    columnDefs: [
      {
        headerName: 'Name',
        field: 'name',
        pinned: true,
        filter: 'agTextColumnFilter',
        rowDrag: true,
        checkboxSelection: true,
      },
      {
        headerName: 'Native Name',
        field: 'nativeName',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Capital',
        field: 'capital',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Population',
        field: 'population',
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Region Info',
        children: [
          {
            headerName: 'Region',
            field: 'region',
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Sub-Region',
            field: 'subregion',
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'Area',
            field: 'area',
            filter: 'agNumberColumnFilter',
          },
        ],
      },
    ],
    rowData: [],
    showPagination: false,
  });

  const gotData = ({ data }) => {
    setState({ ...fields, rowData: data });
  };

  useEffect(() => {
    const httpObj = {
      url: '/all?fields=name;capital;currencies;region;subregion;area;nativeName;languages;timezones;population',
      method: 'get',
    };
    httpHelper(httpObj, gotData);
  });

  const { columnDefs, rowData, showPagination } = fields;
  return (
    <LatticeAgGrid
      animateRows
      enableSorting
      enableColResize
      enableFilter
      rowDragManaged={!showPagination}
      pagination={showPagination}
      paginationAutoPageSize={showPagination}
      columnDefs={columnDefs}
      rowData={rowData}
      rowSelection="multiple"
      gridContainerStyle={{
        height: window.innerHeight,
      }}
    />
  );
};

const Template = (args) => <AgGrid {...args} />;

export const Primary = Template.bind({});
Primary.decorators = [muiTheme()];

export const Secondary = Template.bind({});
Secondary.decorators = [muiTheme({ palette: { type: 'dark' } })];
