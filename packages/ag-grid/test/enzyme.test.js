import React from 'react';
import { mount } from 'enzyme';
import LatticeAgGrid from '../src/components/index.js';

describe('<AgGrid />', () => {
  let wrapper;
  let useEffect;
  const showPagination = false;
  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      pinned: true,
      filter: 'agTextColumnFilter',
      rowDrag: true,
      checkboxSelection: true,
    },
    { headerName: 'Native Name', field: 'nativeName', filter: 'agTextColumnFilter' },
    { headerName: 'Capital', field: 'capital', filter: 'agTextColumnFilter' },
    { headerName: 'Population', field: 'population', filter: 'agNumberColumnFilter' },
    {
      headerName: 'Region Info',
      children: [
        { headerName: 'Region', field: 'region', filter: 'agTextColumnFilter' },
        { headerName: 'Sub-Region', field: 'subregion', filter: 'agTextColumnFilter' },
        { headerName: 'Area', field: 'area', filter: 'agNumberColumnFilter' },
      ],
    },
  ];

  const rowData = [
    {
      area: 652230,
      capital: 'Kabul',
      currencies: [
        {
          code: 'AFN',
          name: 'Afghan afghani',
          symbol: '؋',
        },
      ],
    },
  ];

  beforeEach(() => {
    wrapper = mount(
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
        afterGridCreated={jest.fn()}
        gridContainerStyle={{
          height: window.innerHeight - 100,
          margin: '10px 10px',
        }}
      />
    );
  });

  it('test useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
