import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import classNames from 'classnames';
// Material UI
import { withStyles } from '@material-ui/core';
import IconBold from '@material-ui/icons/FormatBold';
import IconButton from '@material-ui/core/IconButton';

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
      // Mimics the default input display property used by browsers for an input.
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(16),
      lineHeight: '1.1875em', // Reset (19px), match the native input line-height
      cursor: 'text',
      display: 'inline-flex',
      alignItems: 'center',
      '&$disabled': {
        color: theme.palette.text.disabled,
        cursor: 'default'
      },
      position: 'relative',
      padding: '15px 0 0',
      marginTop: '10px'
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
      padding: `${8 - 2}px 0 ${8 - 1}px`,
      border: 0,
      boxSizing: 'content-box',
      background: 'transparent',
      margin: 0, // Reset for Safari
      // Remove grey highlight
      WebkitTapHighlightColor: 'transparent',
      display: 'block',
      width: '100%',
      borderBottom: '1px solid #d2d2d2',
      outline: 0,
      fontSize: theme.typography.pxToRem(16),
      transition: theme.transitions.create('border-color', {
        duration: theme.transitions.duration.shorter
      }),
      // Make the flex item shrink with Firefox
      minWidth: '100px',
      '&::-webkit-input-placeholder': placeholder,
      '&::-moz-placeholder': placeholder, // Firefox 19+
      '&:-ms-input-placeholder': placeholder, // IE 11
      '&::-ms-input-placeholder': placeholder, // Edge
      '&:focus': {
        paddingBottom: '6px',
        borderBottom: '2px solid #009788',
        outline: 0
      },
      // Reset Firefox invalid required input style
      '&:invalid': {
        boxShadow: 'none'
      },
      '&::-webkit-search-decoration': {
        // Remove the padding when type=search.
        '-webkit-appearance': 'none'
      },
      // Show and hide the placeholder logic
      '&$disabled': {
        opacity: 1 // Reset iOS opacity
      },
      '&::placeholder': {
        color: 'transparent'
      },
      '$label, &:focus ~ $label': {
        position: 'absolute',
        top: 0,
        display: 'block',
        transition: theme.transitions.create('all', {
          duration: theme.transitions.duration.shorter
        }),
        fontSize: '12px',
        color: '#9b9b9b'
      },
      '&:focus ~ $label': {
        color: '#009788'
      }
    },
    label: {
      position: 'absolute',
      top: 0,
      display: 'block',
      transition: theme.transitions.create('all', {
        duration: theme.transitions.duration.shorter
      }),
      fontSize: '12px',
      color: '#9b9b9b',
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
  state = {
    value: initialValue
  };

  onChangeFn = ({ value }) => {
    this.setState({ value });
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
      <IconButton
        color="secondary"
        disabled={!isActive}
        aria-label="do something"
        onClick={event => this.onClickMark(event, type)}
      >
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Editor
          id={RichText.id}
          className={classes.editorContainer}
          ref={node => (this.editor = node)}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          onChange={this.onChangeFn}
          aria-multiline={true}
          aria-placeholder="Editor crazy"
        />
        <label htmlFor={RichText.id} className={classes.label}>
          Editor
        </label>
      </div>
    );
  }
}
export default withStyles(styles, { name: 'RichText' })(RichText);
