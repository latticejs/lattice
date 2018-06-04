import * as storybook from '@storybook/react';

const req = require.context('..', true, /packages\/((?!node_modules).)*\/stories\/[^\/]+\.js$/);
function loadStories() {
  req.keys().forEach(path => {
    const story = req(path).default;
    story(storybook);
  });
}

storybook.configure(loadStories, module);
