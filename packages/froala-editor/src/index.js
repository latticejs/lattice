import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import '../plugins/supersetPlugins.js';
import './customButton.js';

import 'typeface-roboto/index.css';
import 'typeface-montserrat/index.css';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleManualController = this.handleManualController.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.getTheme = this.getTheme.bind(this);

    this.state = { theme: this.getTheme(), initControls: null };
  }

  /**
   * Evaluates and returns the intial theme before render.
   */
  getTheme() {
    let palleteType = '';
    const { theme } = this.props;

    if (theme && theme.palette && theme.palette.type) {
      palleteType = theme.palette.type;
    }

    let themeVal = 'royal';

    if (palleteType !== 'light') {
      themeVal = palleteType;
    }

    return themeVal;
  }

  /**
   * This function is used to get initControls object.
   * It is used to set the initControls state variable.
   * @param {[Object]} initControls Object
   */
  handleManualController(initControls) {
    initControls.initialize();
    this.setState({ initControls });
  }

  /**
   * This function is used to get config.
   */
  getConfig() {
    const { theme } = this.state;
    const { config } = this.props;

    const froalaConfig = {
      theme,
      ...config
    };

    return froalaConfig;
  }

  componentDidUpdate(prevProps, prevState) {
    const { theme } = this.props;

    if (theme !== prevProps.theme) {
      let selectedThemeName = 'royal';

      if (theme.palette.type !== 'light') {
        selectedThemeName = theme.palette.type;
      }

      this.state.initControls.destroy();
      this.setState(
        {
          theme: selectedThemeName
        },
        () => {
          if (!this.state.initControls.getEditor()) {
            this.state.initControls.initialize();
          }
        }
      );
    }
  }

  render() {
    const { model, onModelChange } = this.props;
    const config = this.getConfig();
    return (
      <FroalaEditor
        tag="textarea"
        config={config}
        onManualControllerReady={this.handleManualController}
        model={model}
        onModelChange={onModelChange}
      />
    );
  }
}

Editor.defaultProps = {
  config: {}
};

export default withTheme(Editor);
