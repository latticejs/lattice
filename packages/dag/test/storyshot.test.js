import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

function createNodeMock(element) {
  if (element.type === 'text') {
    return {
      getBoundingClientRect() {
        return {};
      }
    };
  }
  return null;
}

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock
  })
});
