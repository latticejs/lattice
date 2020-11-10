import React, { useState } from 'react';
import { withTheme } from '@material-ui/core/styles';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import '../../plugins/supersetPlugins.js';
import './customButton.js';

import 'typeface-roboto/index.css';
import 'typeface-montserrat/index.css';

const Editor = (props) => {
  const getTheme = (props) => {
    let palleteType = '';
    const { theme } = props;

    if (theme && theme.palette && theme.palette.type) {
      palleteType = theme.palette.type;
    }

    let themeVal = 'royal';

    if (palleteType !== 'light') {
      themeVal = palleteType;
    }

    return themeVal;
  };

  const [state, setState] = useState({ theme: getTheme(props), initControls: null });

  /**
   * Evaluates and returns the intial theme before render.
   */
  // const getTheme = () => {
  //   let palleteType = '';
  //   const { theme } = this.props;

  //   if (theme && theme.palette && theme.palette.type) {
  //     palleteType = theme.palette.type;
  //   }

  //   let themeVal = 'royal';

  //   if (palleteType !== 'light') {
  //     themeVal = palleteType;
  //   }

  //   return themeVal;
  // }

  /**
   * This function is used to get initControls object.
   * It is used to set the initControls state variable.
   * @param {[Object]} initControls Object
   */
  const handleManualController = (initControls) => {
    initControls.initialize();
    setState({ ...state, initControls });
  };

  /**
   * This function is used to get config.
   */
  const getConfig = () => {
    const { theme } = state;
    const { config } = props;

    const froalaConfig = {
      theme,
      ...config,
    };

    return froalaConfig;
  };

  const { model, onModelChange } = props;
  const config = getConfig();
  return (
    <FroalaEditor
      tag="textarea"
      config={config}
      onManualControllerReady={handleManualController}
      model={model}
      onModelChange={onModelChange}
    />
  );
};

Editor.defaultProps = {
  config: {},
};

export default withTheme(Editor);
