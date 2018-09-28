import React from 'react';
import Types from 'prop-types';
import { ProjectStore } from '../stores/project';
import { UiStore } from '../stores/ui';

/**
 * @augments {React.Component<{
 *  projectStore: ProjectStore,
 *  uiStore: UiStore
 * }>}
 */
export default class StoreComponent extends React.Component {}

StoreComponent.propTypes = {
  projectStore: Types.instanceOf(ProjectStore),
  uiStore: Types.instanceOf(UiStore)
};

// export const inject = (...stores) => {
//   const component = mobxReactInject(stores);
//   component.propTypes = StoreComponent.propTypes;

//   return component;
// };
