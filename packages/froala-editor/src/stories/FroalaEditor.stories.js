import React from 'react';

// Ours
import Editor from '../components';
import muiTheme from '../../.storybook/decorator-material-ui';
import './styles/css/style.css';

export default {
  title: 'Example/Froala Editor',
  component: Editor,
};

const BasicEditor = () => {
  return <Editor />;
};

const Template = (args) => <BasicEditor {...args} />;

export const Basic = Template.bind({});
Basic.decorators = [muiTheme()];

export const Dark = Template.bind({});
Dark.decorators = [muiTheme({ palette: { type: 'dark' } })];
