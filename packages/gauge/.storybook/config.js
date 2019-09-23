if (process.env.NODE_ENV === 'test') {
  const registerRequireContextHook = require('babel-plugin-require-context-hook/register');
  registerRequireContextHook();
}

import * as storybook from '@storybook/react';

const req = require.context('../stories', true, /[^\/]+.js$/);
function loadStories() {
  req.keys().forEach(path => {
    const story = req(path).default;
    story(storybook);
  });
}

storybook.configure(loadStories, module);
