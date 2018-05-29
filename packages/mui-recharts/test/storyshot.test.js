import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

function createNodeMock(element) {
  if (element.type === 'div') {
    return {
      scrollWidth: 111,
      scrollHeight: 222,
      offsetWidth: 333,
      offsetHeight: 444,
      parentElement: {
        scrollWidth: 555,
        scrollHeight: 666,
        offsetWidth: 777,
        offsetHeight: 888,
        currentStyle: {
          position: 'relative',
        },
      }
    }
  }
  return null
}

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock
  })
});
