import { Breadcrumbs, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { OrgContext } from '../../context';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useContext } from 'react';

const useStyles = makeStyles((theme) => ({
  breadcrumbsNavlink: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

const OrgBreadcrumbs = ({ current }) => {
  const { selectedOrg } = useContext(OrgContext);
  const classes = useStyles();

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      <Link className={classes.breadcrumbsNavlink} to={`/${selectedOrg.orgCode}`}>
        {selectedOrg.name}
      </Link>
      <Typography color="textPrimary">{current}</Typography>
    </Breadcrumbs>
  );
};

export default OrgBreadcrumbs;
