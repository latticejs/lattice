import React from 'react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { default as MuiTable } from '@material-ui/core/Table';
import { default as MuiTableHead } from '@material-ui/core/TableHead';
import { default as MuiTableRow, styles as muiTableRowStyles } from '@material-ui/core/TableRow/TableRow';
import { default as MuiTableCell, styles as muiTableCellStyles } from '@material-ui/core/TableCell/TableCell';

import ScrollLoader from './ScrollLoader';

// possible variants head, body, footer
const TableContext = React.createContext();

const withDiv = WrappedComponent => ({ ...props }) => <WrappedComponent {...props} component="div" />;

const stylesHead = theme => ({ root: { display: 'block' } });
const stylesBody = theme => ({ root: { display: 'block' } });
const stylesRow = theme => {
  const styles = muiTableRowStyles(theme);
  const { root: cellRoot } = muiTableCellStyles(theme);

  return {
    ...styles,
    root: {
      display: 'flex',
      boxSizing: 'border-box',
      alignItems: 'center',
      borderBottom: cellRoot.borderBottom
    }
  };
};
const stylesCell = theme => {
  const styles = muiTableCellStyles(theme);
  return {
    ...styles,
    root: {
      borderBottom: 'none',
      flex: 1,
      minWidth: 40,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:last-child': {
        paddingRight: 60
      }
    }
  };
};

const withDivAndStyles = (WrappedComponent, styles) => withStyles(styles)(withDiv(WrappedComponent));

const InnerTableBody = props => {
  const { classes, className, rvListProps = {}, ...loaderProps } = props;

  return (
    <TableContext.Provider value="body">
      <ScrollLoader
        rvListProps={{ ...rvListProps, className: classnames(classes.root, className, rvListProps.className) }}
        {...loaderProps}
      />
    </TableContext.Provider>
  );
};

const InnerTableCell = props => {
  const { ...cellProps } = props;

  return (
    <TableContext.Consumer>
      {variant => <MuiTableCell variant={variant} {...cellProps} component="div" />}
    </TableContext.Consumer>
  );
};

export const Table = withDiv(MuiTable);
export const TableBody = withStyles(stylesBody)(InnerTableBody);
export const TableCell = withStyles(stylesCell)(InnerTableCell);
export const TableHead = withDivAndStyles(MuiTableHead, stylesHead);
export const TableRow = withDivAndStyles(MuiTableRow, stylesRow);
