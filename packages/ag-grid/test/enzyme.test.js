import React from 'react';
import { mount } from 'enzyme';
import LatticeAgGrid from '../src';

describe('<AgGrid />', () => {
  let wrapper, childWrapper;
  const showPagination = false;
  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      pinned: true,
      filter: 'agTextColumnFilter',
      rowDrag: true,
      checkboxSelection: true
    },
    { headerName: 'Native Name', field: 'nativeName', filter: 'agTextColumnFilter' },
    { headerName: 'Capital', field: 'capital', filter: 'agTextColumnFilter' },
    { headerName: 'Population', field: 'population', filter: 'agNumberColumnFilter' },
    {
      headerName: 'Region Info',
      children: [
        { headerName: 'Region', field: 'region', filter: 'agTextColumnFilter' },
        { headerName: 'Sub-Region', field: 'subregion', filter: 'agTextColumnFilter' },
        { headerName: 'Area', field: 'area', filter: 'agNumberColumnFilter' }
      ]
    }
  ];

  const rowData = [
    {
      area: 652230,
      capital: 'Kabul',
      currencies: [
        {
          code: 'AFN',
          name: 'Afghan afghani',
          symbol: '؋'
        }
      ]
    }
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
      />
    );

    childWrapper = wrapper.find(LatticeAgGrid).childAt(0);
  });

  it('renders one <AgGrid /> component', () => {
    expect(wrapper.props().animateRows).toBe(true);
    expect(wrapper.props().enableSorting).toBe(true);
    expect(wrapper.props().enableFilter).toBe(true);
    expect(wrapper.props().enableColResize).toBe(true);
    expect(wrapper.props().rowDragManaged).toBe(true);
    expect(wrapper.props().pagination).toBe(false);
    expect(wrapper.props().paginationAutoPageSize).toBe(false);
    expect(wrapper.props().columnDefs.length).toBe(5);
    expect(wrapper.props().columnDefs[0].headerName).toEqual('Name');
    expect(wrapper.props().columnDefs[0].field).toEqual('name');
    expect(wrapper.props().columnDefs[0].pinned).toEqual(true);
    expect(wrapper.props().columnDefs[0].filter).toEqual('agTextColumnFilter');
    expect(wrapper.props().columnDefs[0].rowDrag).toEqual(true);
    expect(wrapper.props().columnDefs[0].checkboxSelection).toEqual(true);

    expect(wrapper.props().columnDefs[1].headerName).toEqual('Native Name');
    expect(wrapper.props().columnDefs[1].field).toEqual('nativeName');
    expect(wrapper.props().columnDefs[1].filter).toEqual('agTextColumnFilter');

    expect(wrapper.props().columnDefs[2].headerName).toEqual('Capital');
    expect(wrapper.props().columnDefs[2].field).toEqual('capital');
    expect(wrapper.props().columnDefs[2].filter).toEqual('agTextColumnFilter');

    expect(wrapper.props().columnDefs[3].headerName).toEqual('Population');
    expect(wrapper.props().columnDefs[3].field).toEqual('population');
    expect(wrapper.props().columnDefs[3].filter).toEqual('agNumberColumnFilter');

    expect(wrapper.props().columnDefs[4].headerName).toEqual('Region Info');
    expect(wrapper.props().columnDefs[4].children.length).toBe(3);
    expect(wrapper.props().rowSelection).toBe('multiple');
  });

  it('stateful component returns a valid component instance', () => {
    const callLength = wrapper.props().afterGridCreated.mock.calls.length;
    const prevPropsForThemeLight = {
      theme: {
        palette: {
          type: 'light'
        }
      }
    };
    childWrapper.instance().agGridRef({ gridInfo: 'I am AG-Grid' });
    expect(wrapper.props().afterGridCreated.mock.calls.length).toEqual(callLength + 1);
    expect(wrapper.props().afterGridCreated.mock.calls[callLength][0]).toHaveProperty('gridInfo', 'I am AG-Grid');
    expect(wrapper.props().afterGridCreated.mock.calls[callLength][0]).toEqual({ gridInfo: 'I am AG-Grid' });
    childWrapper.instance().componentDidUpdate(prevPropsForThemeLight);
    expect(childWrapper.instance().state.gridClass).toMatch('ag-theme-material');
    const prevPropsForThemedark = {
      theme: {
        palette: {
          type: 'dark'
        }
      }
    };
    wrapper.setProps(prevPropsForThemedark);
    wrapper.update();
    expect(childWrapper.instance().state.gridClass).toMatch('ag-theme-material-dark');
  });
});
