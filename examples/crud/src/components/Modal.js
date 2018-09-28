import { Modal } from '@material-ui/core';
import React from 'react';

export default ({ open, onClose, children, ...props }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute'
        }}
      >
        {children}
      </div>
    </Modal>
  );
};
