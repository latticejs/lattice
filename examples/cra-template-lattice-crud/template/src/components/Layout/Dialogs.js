import React from 'react';
import { inject, observer } from 'mobx-react';

const Dialogs = ({ uiStore }) => {
  return (
    <React.Fragment>
      {uiStore.dialogs.stack.map((dialog) => (
        <dialog.component key={`dialog-${dialog.id}`} {...dialog.renderProps} />
      ))}
    </React.Fragment>
  );
};

export default inject('uiStore')(observer(Dialogs));
