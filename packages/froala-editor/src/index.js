import React, { Component } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import PropTypes from 'prop-types';

import './customButton.js';
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
    this.setState({ initControls });
  }

  /**
   * This function is used to get config.
   */
  getConfig() {
    const { theme, isAdvanced } = this.props;

    let config = {
      theme: this.state.theme,
      colorsButtons: ['colorsBack', '|', '-'],
      codeMirror: true,
      pluginsEnabled: [
        'align',
        'charCounter',
        'codeBeautifier',
        'codeView',
        'colors',
        'draggable',
        'embedly',
        'emoticons',
        'entities',
        'file',
        'fontAwesome',
        'fontFamily',
        'fontSize',
        'fullscreen',
        'image',
        'imageTUI',
        'imageManager',
        'inlineStyle',
        'inlineClass',
        'lineBreaker',
        'lineHeight',
        'link',
        'lists',
        'paragraphFormat',
        'paragraphStyle',
        'quickInsert',
        'quote',
        'save',
        'table',
        'url',
        'video',
        'wordPaste'
      ],
      ...this.props.config
    };

    if (isAdvanced) {
      config.toolbarButtons = [
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
      ];
    }

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
    const config = this.getConfig();
    return <FroalaEditor tag="textarea" config={config} onManualControllerReady={this.handleManualController} />;
  }
}

Editor.propTypes = {
  isAdvanced: PropTypes.bool
};

Editor.defaultProps = {
  config: {},
  isAdvanced: false
};

export default withTheme(Editor);
