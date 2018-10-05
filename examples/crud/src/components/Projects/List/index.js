import React from 'react';
import { compose } from 'recompose';
import { Widget } from '@latticejs/widgets';
import { withStyles, Grid } from '@material-ui/core';
import ProjectList from './List';
import ProjectListActions from './ListActions';
import ProjectTitle from './Title';

const List = props => {
  const { classes, onEditProject, onAddProject } = props;

  return (
    <Widget title={() => <ProjectTitle />} border="bottom" classes={{ root: classes.containerRoot }}>
      <Grid container direction="column" justify="center" alignItems="stretch">
        <ProjectListActions onAdd={onAddProject} />

        <Grid item xs>
          <ProjectList onEditProject={onEditProject} />
        </Grid>
      </Grid>
    </Widget>
  );
};

const styles = () => ({
  containerRoot: {
    flex: 1,
    height: '100%'
  },
  listRoot: {
    flex: 1,
    height: '100%'
  }
});

export default compose(withStyles(styles))(List);
