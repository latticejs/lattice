import * as storybook from '@storybook/react';

const req = require.context('../stories', true, /[^\/]+.js$/);
function loadStories() {
  req.keys().forEach(path => {
    console.log(path)
    const story = req(path).default;
    story(storybook);
  });
}

storybook.configure(loadStories, module);
