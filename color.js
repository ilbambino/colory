const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const mathutil = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048]
};

const pointsCount = 30; // to create a grid of pointsCount x pointsCount

const seed = random.getRandomSeed();
console.log(seed);
// random.setSeed(679988);
random.setSeed(seed);

const margin = 100;

const letterBitMap = letter => {
  const canvas = new OffscreenCanvas(pointsCount, pointsCount);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";

  ctx.font = "26px serif";
  ctx.fillText(letter, 6, 24);
  return ctx.getImageData(0, 0, pointsCount, pointsCount);
};

const paintLetter = (width, height, context, letter, color) => {
  const maxRandom = 3900;
  const circleSize = Math.floor(width / 27);

  const bits = letterBitMap(letter);
  const blockSize = width / pointsCount;
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "black";
  context.strokeStyle = "black";
  context.lineWidth = 5;

  const palette = random.pick(palettes);
  const paletteIn = palette.slice(0, 2);
  const paletteOut = palette.slice(3, 6);
  for (let point = 0; point < maxRandom; point++) {
    const x = random.rangeFloor(0, width);
    const y = random.rangeFloor(0, height);

    const i = Math.floor(x / blockSize);
    const j = Math.floor(y / blockSize);
    context.beginPath();
    const impression = bits.data[j * (pointsCount * 4) + i * 4 + 3] > 0 ? 1 : 0;
    let n = mathutil.clamp(random.noise2D(x, y, 1), 0, 50);

    if (impression) {
      context.fillStyle = random.pick(paletteIn);
      context.arc(x, y, circleSize * n * 0.8, 0, 2 * Math.PI);
    } else {
      context.fillStyle = random.pick(paletteOut);
      context.arc(x, y, circleSize * n, 0, 2 * Math.PI);
    }
    context.fill();
  }
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    const name = "ABCD";
    const verticalCells = Math.ceil(name.length / 2);
    let x = 0,
      y = 0;
    const cellWidth =
      name.length < 2 ? width - margin * 2 : (width - margin * 3) / 2;
    const cellHeigh = (height - margin * (verticalCells + 1)) / verticalCells;
    if (cellHeigh != cellWidth) {
      console.error(
        "wrong height, it should be:",
        cellWidth * verticalCells + margin * (verticalCells + 1)
      );
    }

    for (let i = 0; i < name.length; i++) {
      context.save();
      x = i % 2;
      y = Math.floor(i / 2);
      context.translate(
        x * cellWidth + margin + margin * x,
        y * cellHeigh + margin + margin * y
      );
      paintLetter(cellWidth, cellHeigh, context, name[i]);

      context.restore();
    }
  };
};
canvasSketch(sketch, settings);
