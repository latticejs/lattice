HTMLCanvasElement.prototype.getContext = () => ({
  translate: () => {},
  beginPath: () => {},
  arc: () => {},
  createLinearGradient: () => ({
    addColorStop: () => {},
  }),
  stroke: () => {},
  closePath: () => {},
  fill: () => {},
  rotate: () => {},
  fillRect: function () {},
  clearRect: function () {},
  getImageData: function (x, y, w, h) {
    return {
      data: new Array(w * h * 4),
    };
  },
  putImageData: function () {},
  createImageData: function () {
    return [];
  },
  setTransform: function () {},
  drawImage: function () {},
  save: function () {},
  fillText: function () {},
  restore: function () {},
  moveTo: function () {},
  lineTo: function () {},
  scale: function () {},
  measureText: function () {
    return { width: 0 };
  },
  transform: function () {},
  rect: function () {},
  clip: function () {},
});
