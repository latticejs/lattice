import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import Title from '../../List/Title';

export default compose(
  inject('uiStore', 'projectStore'),
  observer
)(({ uiStore: { projectList }, projectStore }) => {
  const filtered = projectStore.projects.size !== projectList.list.length;
  let prefix = '';

  if (filtered) {
    prefix = `Showing ${projectList.list.length} filtered from `;
  }

  return <Title main="Projects" secondary={`${prefix}${projectStore.projects.size}`} />;
});
