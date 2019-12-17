import React, { Component } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins/font_family.min.js';

import './customButton.js';
// import bold from '@material-ui/icons/WbSunnyOutlined';
import { withTheme } from '@material-ui/core/styles';

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
    console.log(initControls.getEditor());
    // initControls.getEditor().DefineIcon('imageIcon', { SRC: 'https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_black_36dp.png', ALT: 'Image button', template: 'image' });
    // initControls.getEditor().RegisterCommand('imageButton', {
    //   title: 'Image',
    //   icon: 'imageIcon'
    // });
    this.setState({ initControls });
  }

  /**
   * This function is used to get config.
   */
  getConfig() {
    const { theme } = this.props;

    let config = {
      theme: this.state.theme,
      pluginsEnabled: ['fontAwesome'],
      toolbarButtons: [
        'clear',
        'insert',
        'imageIcon',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        '|',
        'fontFamily',
        'fontSize',
        'color',
        'inlineStyle',
        'inlineClass',
        'clearFormatting',
        '|',
        'emoticons',
        'fontAwesome',
        'specialCharacters',
        '-',
        'paragraphFormat',
        'lineHeight',
        'paragraphStyle',
        'align',
        'formatOL',
        'formatUL',
        'outdent',
        'indent',
        'quote',
        '|',
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertFile',
        'insertTable',
        '-',
        'insertHR',
        'selectAll',
        'getPDF',
        'print',
        'help',
        'html',
        'fullscreen',
        '|',
        'undo',
        'redo'
      ],
      ...this.props.config
    };

    if (theme.typography && theme.typography.fontFamily) {
      config.fontFamily = theme.typography.fontFamily;
    }

    return config;
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
    console.log('I am rendering.');
    const config = this.getConfig();
    return <FroalaEditor tag="textarea" config={config} onManualControllerReady={this.handleManualController} />;
  }
}

Editor.defaultProps = {
  config: {}
};

export default withTheme(Editor);
