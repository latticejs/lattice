import React, { Component } from 'react';
import { action } from '@storybook/addon-actions';

// Ours
import Tree from '../src/tree';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';
import pkg from '../package.json';
import { JSONIcon } from './json-icons';

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

const input = [
  {
    label: 'index.js'
  },
  {
    label: 'assets',
    children: [
      {
        label: 'index.css'
      },
      {
        label: 'logo.svg'
      },
      {
        label: 'tmp',
        children: [
          {
            label: 'foo',
            children: [
              {
                label: 'lambda'
              },
              {
                label: 'gamma'
              }
            ]
          },
          {
            label: 'bar'
          },
          {
            label: 'baz'
          }
        ]
      }
    ]
  }
];

class BasicTree extends Component {
  state = {
    treeData: input
  };

  render() {
    return <Tree treeData={this.state.treeData} cascadeCheck {...this.props} />;
  }
}

class CustomTree extends Component {
  state = {
    treeData: input
  };

  parseExt = label => label.split('.')[1];

  customIcon = ({ item, isChild, expanded }) => {
    const ext = this.parseExt(item.label);
    if (ext === 'js') {
      return (
        <svg
          viewBox="0 0 256 256"
          preserveAspectRatio="xMidYMid"
          aria-labelledby="apksi-logos-javascript-title"
          id="si-logos-javascript"
          width="1.5em"
          height="1.5em"
          style={{ 'margin-right': 0 }}
        >
          <title id="apksi-logos-javascript-title">logo of javascript</title>
          <path d="M0 0h256v256H0V0z" fill="#F7DF1E" />
          <path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247L210.29 147.43c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574" />
        </svg>
      );
    }
    if (ext === 'css') {
      return (
        <svg
          viewBox="0 0 256 232"
          preserveAspectRatio="xMidYMid"
          aria-labelledby="ahpsi-logos-css-3_official-title"
          id="si-logos-css-3_official"
          width="1.5em"
          height="1.5em"
          style={{ 'margin-right': 0 }}
        >
          <title id="ahpsi-logos-css-3_official-title">logo of css-3_official</title>
          <path
            d="M100.902 231.618l116.456-38.653L256 0H37.867L29.57 43.056h174.812l-5.443 27.49H23.862L15.3 113.602h174.823l-9.602 49.284-70.547 23.076-60.955-23.076 4.16-21.528H10.123L0 192.965l100.902 38.653"
            fill="#444"
          />
        </svg>
      );
    }
  };

  render() {
    return <Tree treeData={this.state.treeData} {...this.props} renderItemIcon={this.customIcon} />;
  }
}

const isString = value => typeof value === 'string';
const isDate = value => value !== '' && (value instanceof Date || new Date(value).toString() !== 'Invalid Date');
const isNumber = value => typeof value === 'number';
const isArray = value => Array.isArray(value);
const isObject = value => typeof value === 'object';

const getType = value => {
  switch (true) {
    case isArray(value):
      return 'array';
    case isObject(value):
      return 'object';
    case isNumber(value):
      return 'number';
    case isDate(value):
      return 'date';
    case isString(value):
      return 'string';
    default:
      return '';
  }
};

var transform = (input, level = 0) => {
  if (Array.isArray(input)) {
    return input.map(key => transform(key, level + 1));
  }

  if (typeof input === 'string') {
    return { label: <pre>{input}</pre>, type: 'string' };
  }

  const result = [];

  for (const key of Object.keys(input)) {
    const value = input[key];
    const valueType = getType(value);
    const isString = valueType === 'string';

    const item = {
      type: valueType,
      id: key
    };

    if (['string', 'number', 'date'].includes(valueType)) {
      item.label = (
        <React.Fragment>
          <b>{key}</b>: {isString ? ' "' : ' '}
          <pre style={{ display: 'inline' }}>{value}</pre>
          {isString ? '"' : ''}
        </React.Fragment>
      );
    } else {
      item.label = <b>{key}</b>;
      item.children = transform(value, level + 1);
    }

    result.push(item);
  }

  return result;
};

class JSONTree extends Component {
  state = {
    treeData: []
  };

  customIcon = ({ item, isChild, expanded }) => {
    return <JSONIcon type={item.type} bold={expanded} item={item} />;
  };

  componentDidMount() {
    this.setState({
      treeData: transform(pkg)
    });
  }

  getItemKey = ({ item, lvl }) => `custom-key-${item.id}-${lvl}`;

  render() {
    return (
      <Tree
        treeData={this.state.treeData}
        {...this.props}
        getItemKey={this.getItemKey}
        renderItemIcon={this.customIcon}
        expandedAll
        cascadeCheck
      />
    );
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('tree', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'basic',
      withApiReadme(() => (
        <BasicTree
          onCheckItem={action('checkItem')}
          onFoldItem={action('onFoldItem')}
          onUnfoldItem={action('onUnfoldItem')}
        />
      ))
    )
    .add(
      'customized',
      withApiReadme(() => (
        <CustomTree
          onCheckItem={action('checkItem')}
          onFoldItem={action('onFoldItem')}
          onUnfoldItem={action('onUnfoldItem')}
        />
      ))
    )
    .add('JSON tree', withApiReadme(() => <JSONTree />));
};
