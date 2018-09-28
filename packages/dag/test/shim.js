global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

global.getComputedStyle = () => ({
  transform: 'matrix(1, 0, 0, 1, 11, -38)' // sample value
});
