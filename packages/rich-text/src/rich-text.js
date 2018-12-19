import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import classNames from 'classnames';
// Material UI
import { withStyles } from '@material-ui/core';
import Outlined from './outlined';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconBold from '@material-ui/icons/FormatBold';
import IconButton from '@material-ui/core/IconButton';

const label = ({ labelValue, id, shrink, labelOnClick, ...other }) => (
  <InputLabel htmlFor={id} shrink={shrink} onClick={labelOnClick} {...other}>
    {labelValue}
  </InputLabel>
);

const variantComponent = {
  standard: props => (
    <div className="standard">
      {props.children}
      {label(props)}
    </div>
  ),
  //filled: FilledInput,
  outlined: Outlined
};

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
});

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

// Style
export const styles = theme => {
  const light = theme.palette.type === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';

  const placeholder = {
    color: 'currentColor',
    opacity: light ? 0.42 : 0.5,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter
    })
  };
  const placeholderHidden = {
    opacity: 0
  };
  const placeholderVisible = {
    opacity: light ? 0.42 : 0.5
  };

  return {
    /* Styles applied to the root element. */
    root: {
      position: 'relative',
      // Mimics the default input display property used by browsers for an input.
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(16),
      lineHeight: '1.1875em', // Reset (19px), match the native input line-height
      cursor: 'text',
      display: 'inline-flex',
      '&$disabled': {
        color: theme.palette.text.disabled,
        cursor: 'default'
      },
      padding: '15px 0 0',
      marginTop: '10px',
      '& > .standard $editorContainer': {
        padding: `${8 - 2}px 0 ${8 - 1}px`
      }
    },
    underline: {
      '&:after': {
        borderBottom: `2px solid ${theme.palette.primary[light ? 'dark' : 'light']}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: 'absolute',
        right: 0,
        transform: 'scaleX(0)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }),
        pointerEvents: 'none' // Transparent to the hover style.
      },
      '&$focused:after': {
        transform: 'scaleX(1)'
      },
      '&$error:after': {
        borderBottomColor: theme.palette.error.main,
        transform: 'scaleX(1)' // error is always underlined in red
      },
      '&:before': {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: 'absolute',
        right: 0,
        transition: theme.transitions.create('border-bottom-color', {
          duration: theme.transitions.duration.shorter
        }),
        pointerEvents: 'none' // Transparent to the hover style.
      },
      '&:hover:not($disabled):not($focused):not($error):before': {
        borderBottom: `2px solid ${theme.palette.text.primary}`,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          borderBottom: `1px solid ${bottomLineColor}`
        }
      },
      '&$disabled:before': {
        borderBottom: `1px dotted ${bottomLineColor}`
      }
    },
    /* Styles applied to the root element if the component is a descendant of `FormControl`. */
    formControl: {},
    /* Styles applied to the root element if the component is focused. */
    focused: {},
    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the root element if `startAdornment` is provided. */
    adornedStart: {},
    /* Styles applied to the root element if `endAdornment` is provided. */
    adornedEnd: {},
    /* Styles applied to the root element if `error={true}`. */
    error: {},
    /* Styles applied to the `input` element if `margin="dense"`. */
    marginDense: {},
    /* Styles applied to the root element if `multiline={true}`. */
    multiline: {
      padding: `${8 - 2}px 0 ${8 - 1}px`
    },
    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: {
      width: '100%'
    },
    /* Styles applied to the `input` element. */
    editorContainer: {
      font: 'inherit',
      color: 'currentColor',
      appearance: 'textfield',
      '-moz-appearance': 'textfield',
      '-webkit-appearance': 'textfield',
      outline: '0 solid transparent',
      boxSizing: 'content-box',
      background: 'none',
      margin: 0, // Reset for Safari
      // Remove grey highlight
      WebkitTapHighlightColor: 'transparent',
      display: 'block',
      width: '100%',
      fontSize: theme.typography.pxToRem(16),
      // Make the flex item shrink with Firefox
      minWidth: '100px',
      '&::-webkit-input-placeholder': placeholder,
      '&::-moz-placeholder': placeholder, // Firefox 19+
      '&:-ms-input-placeholder': placeholder, // IE 11
      '&::-ms-input-placeholder': placeholder, // Edge
      // Reset Firefox invalid required input style
      '&:invalid': {
        boxShadow: 'none'
      },
      '&::-webkit-search-decoration': {
        // Remove the padding when type=search.
        '-webkit-appearance': 'none'
      },
      borderColor: `${theme.palette.text.secondary}`,
      '&$focused': {
        borderColor: `${theme.palette.primary[light ? 'dark' : 'light']}`
      },
      // Show and hide the placeholder logic
      '&$disabled': {
        opacity: 1 // Reset iOS opacity
      },
      '&::placeholder': {
        color: 'transparent'
      }
    },
    label: {
      display: 'block',
      position: 'absolute',
      transition: theme.transitions.create('all', {
        duration: theme.transitions.duration.shorter
      }),
      fontSize: '12px',
      color: theme.palette.text.secondary,
      '&$focused': {
        color: theme.palette.primary[light ? 'dark' : 'light']
      },
      '&$disabled': {
        color: theme.palette.text.disabled
      },
      '&$error': {
        color: theme.palette.error.main
      },
      '&::-webkit-input-placeholder': placeholderHidden,
      '&::-moz-placeholder': placeholderHidden, // Firefox 19+
      '&:-ms-input-placeholder': placeholderHidden, // IE 11
      '&::-ms-input-placeholder': placeholderHidden, // Edge
      '&:focus::-webkit-input-placeholder': placeholderVisible,
      '&:focus::-moz-placeholder': placeholderVisible, // Firefox 19+
      '&:focus:-ms-input-placeholder': placeholderVisible, // IE 11
      '&:focus::-ms-input-placeholder': placeholderVisible // Edge
    },
    /* Styles applied to the `input` element if `margin="dense"`. */
    inputMarginDense: {
      paddingTop: 4 - 1
    },
    /* Styles applied to the `input` element if `multiline={true}`. */
    inputMultiline: {
      resize: 'none',
      padding: 0
    },
    /* Styles applied to the `input` element if `type` is not "text"`. */
    inputType: {
      // type="date" or type="time", etc. have specific styles we need to reset.
      height: '1.1875em' // Reset (19px), match the native input line-height
    },
    /* Styles applied to the `input` element if `type="search"`. */
    inputTypeSearch: {
      // Improve type search style.
      '-moz-appearance': 'textfield',
      '-webkit-appearance': 'textfield'
    }
  };
};
// END Style

class RichText extends Component {
  static id = `lattice_editor_${Date.now()}`;
  static defaultProps = {
    labelValue: 'Editor',
    error: false,
    required: false,
    variant: 'standard'
  };

  constructor(props) {
    super(props);

    this.focusin = false;
  }

  state = {
    focused: true
  };

  componentDidMount() {
    this.focusin = true;
  }

  state = {
    value: initialValue
  };

  onChangeFn = ({ value }) => {
    this.setState({ value, focused: this.focusin });
  };

  renderEditor = (props, editor, next) => {
    // NOTE(dk): use this if the user wants to use a custom toolbar for example
    const children = next();
    return (
      <React.Fragment>
        <div> {this.renderMarkButton('bold', 'format_bold')} </div>
        {children}
      </React.Fragment>
    );
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <IconButton color="secondary" aria-label="do something" onClick={event => this.onClickMark(event, type)}>
        <IconBold />
      </IconButton>
    );
  };

  onKeyDown = (event, editor, next) => {
    let mark;
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  _onBlur = event => {
    this._timeoutID = setTimeout(() => {
      if (this.state.focused) {
        this.focusin = false;
        this.editor.blur();
      }

      if (this.props.onBlur) {
        this.props.onBlur(event);
      }
    }, 0);
  };

  _onFocus = event => {
    clearTimeout(this._timeoutID);
    if (!this.state.focused) {
      setTimeout(() => {
        this.focusin = true;
        //this.setState({ focused: true });
        if (this.props.onFocus) {
          this.props.onFocus(event);
        }
      }, 0);
    }
  };

  handleClick = event => {
    this.focusin = true;
    this.setState({ focused: this.focusin });
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  labelOnClick = () => {
    this.focusin = true;
    this.setState({ focused: true }, () => {
      this.editor.focus();
    });
  };

  render() {
    const { classes, error, fullWidth, required, variant, labelValue, ...other } = this.props;
    const { focused } = this.state;
    const EditorWrapper = variantComponent[variant];
    const editorClasses = [classes.editorContainer];

    const rootClasses = classNames([
      classes.root,
      {
        [classes.focused]: focused
      }
    ]);

    if (variant === 'standard') {
      editorClasses.push(classes.underline);
    }
    const hasValue = this.state.value.document.text.length > 0;
    const EditorComponent = (
      <EditorWrapper
        focused={this.state.focused}
        shrink={this.state.focused || hasValue}
        variant={variant}
        id={RichText.id}
        labelValue={labelValue}
        labelOnClick={this.labelOnClick}
        {...other}
      >
        <Editor
          id={RichText.id}
          className={classNames(editorClasses)}
          ref={node => (this.editor = node)}
          value={this.state.value}
          renderMark={this.renderMark}
          onKeyDown={this.onKeyDown}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onClick={this.handleClick}
          onChange={this.onChangeFn}
        />
      </EditorWrapper>
    );

    return (
      <FormControl
        className={rootClasses}
        error={error}
        fullWidth={fullWidth}
        required={required}
        variant={variant}
        {...other}
      >
        {EditorComponent}
      </FormControl>
    );
  }
}
export default withStyles(styles, { name: 'RichText' })(RichText);
