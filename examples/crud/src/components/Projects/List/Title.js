import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import Title from '../../List/Title';

export default compose(
  inject('uiStore'),
  observer
)(({ uiStore: { projectList } }) => <Title title={`Projects (${projectList.list.length})`} />);
