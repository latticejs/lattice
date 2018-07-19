import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

function createNodeMock(element) {
  if (element.type === 'div') {
    return {
      scrollLeft: 200,
      scrollRight: 200,
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  }
  return null;
}

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock
  })
});
