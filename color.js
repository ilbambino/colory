const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 3022]
};

const pointsCount = 30; // to create a grid of pointsCount x pointsCount

const seed = random.getRandomSeed();
console.log(seed);
// random.setSeed(4);

const createGrid = () => {
  const points = [];

  for (let x = 0; x < pointsCount; x++) {
    for (let y = 0; y < pointsCount; y++) {
      const u = pointsCount < 2 ? 0.5 : x / (pointsCount - 1);
      const v = pointsCount < 2 ? 0.5 : y / (pointsCount - 1);

      points.push({
        position: [u, v],
        point: [x, y]
      });
    }
  }
  return points;
};

const hexToRgb = hex =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));

function rgbToHsl(rgbArr) {
  var r1 = rgbArr[0] / 255;
  var g1 = rgbArr[1] / 255;
  var b1 = rgbArr[2] / 255;

  var maxColor = Math.max(r1, g1, b1);
  var minColor = Math.min(r1, g1, b1);
  //Calculate L:
  var L = (maxColor + minColor) / 2;
  var S = 0;
  var H = 0;
  if (maxColor != minColor) {
    //Calculate S:
    if (L < 0.5) {
      S = (maxColor - minColor) / (maxColor + minColor);
    } else {
      S = (maxColor - minColor) / (2.0 - maxColor - minColor);
    }
    //Calculate H:
    if (r1 == maxColor) {
      H = (g1 - b1) / (maxColor - minColor);
    } else if (g1 == maxColor) {
      H = 2.0 + (b1 - r1) / (maxColor - minColor);
    } else {
      H = 4.0 + (r1 - g1) / (maxColor - minColor);
    }
  }

  L = L * 100;
  S = S * 100;
  H = H * 60;
  if (H < 0) {
    H += 360;
  }
  // var result = [H, S, L];
  return { h: H, s: S, l: L };
}

// const points = createGrid();
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
  const bits = letterBitMap(letter);

  const blockSize = width / pointsCount;
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "black";
  context.strokeStyle = "black";
  context.lineWidth = 5;

  for (let j = 0; j < pointsCount; j++) {
    for (let i = 0; i < pointsCount; i++) {
      const x = i * blockSize;
      const y = j * blockSize;
      context.beginPath();
      context.rect(x, y, blockSize + 1, blockSize + 1);
      let n = random.noise2D(x, y, 1);
      const impression =
        bits.data[j * (pointsCount * 4) + i * 4 + 3] > 0 ? 1 : 0;
      if (impression) {
        context.fillStyle = `hsl(${color.h + 15 * n},${color.s +
          15 * n}%,${color.l + 15 * n}%)`;
      } else {
        context.fillStyle = `hsl(${color.h + 5 * n},${color.s +
          5 * n}%,${color.l + 1 * n}%)`;
      }
      context.fill();
    }
  }
};
// const bits = letterBitMap("A");
// console.log(bits);
const sketch = () => {
  // const palette = random.pick(palettes);
  // const backColorHex = random.pick(palette);
  // const backColorRGB = hexToRgb(backColorHex);
  // const backColorHSL = rgbToHsl(backColorRGB);

  // // const frontColorHex = random.pick(palette);
  // // const frontColorRGB = hexToRgb(frontColorHex);
  // // const frontColorHSL = rgbToHsl(frontColorRGB);
  // const frontColorHSL = Object.assign({}, backColorHSL); //copy object
  // frontColorHSL.h = frontColorHSL.h + 2;
  // frontColorHSL.l = frontColorHSL.l + 5;
  // frontColorHSL.s = frontColorHSL.s + 2;
  // return ({ context, width, height }) => {
  //   const positionToXY = position => {
  //     const x = lerp(margin, width - margin, position[0]);
  //     const y = lerp(margin, height - margin, position[1]);
  //     return [x, y];
  //   };

  //   const blockSize = (width - margin * 2) / pointsCount;
  //   context.fillStyle = "white";
  //   context.fillRect(0, 0, width, height);

  //   context.fillStyle = "black";
  //   context.strokeStyle = "black";
  //   context.lineWidth = 5;

  //   for (let j = 0; j < pointsCount; j++) {
  //     for (let i = 0; i < pointsCount; i++) {
  //       const x = i * blockSize + margin;
  //       const y = j * blockSize + margin;
  //       context.beginPath();
  //       context.rect(x, y, blockSize + 1, blockSize + 1);
  //       let n = random.noise2D(x, y, 1);
  //       const impresion =
  //         bits.data[j * (pointsCount * 4) + i * 4 + 3] > 0 ? 1 : 0;
  //       // console.log(impresion);
  //       if (impresion) {
  //         context.fillStyle = `hsl(${backColorHSL.h + 15 * n},${backColorHSL.s +
  //           15 * n}%,${backColorHSL.l + 15 * n}%)`;
  //       } else {
  //         context.fillStyle = `hsl(${backColorHSL.h + 5 * n},${backColorHSL.s +
  //           5 * n}%,${backColorHSL.l + 1 * n}%)`;
  //       }
  //       context.fill();
  //     }
  //   }
  // };
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.rect(0, 0, width, height);
    const name = "ABCDEF";
    const verticalCells = Math.ceil(name.length / 2);
    let x = 0,
      y = 0;
    const cellWidth = (width - margin * 3) / 2;
    const cellHeigh = (height - margin * (verticalCells + 1)) / verticalCells;
    if (cellHeigh != cellWidth) {
      console.error(
        "wrong height, it should be:",
        cellWidth * verticalCells + margin * (verticalCells + 1)
      );
    }

    const palette = random.pick(palettes).slice(0, 6);

    for (let i = 0; i < name.length; i++) {
      const backColorHex = random.pick(palette);
      const backColorRGB = hexToRgb(backColorHex);
      const backColorHSL = rgbToHsl(backColorRGB);

      context.save();
      x = i % 2;
      y = Math.floor(i / 2);
      context.translate(
        x * cellWidth + margin + margin * x,
        y * cellHeigh + margin + margin * y
      );
      paintLetter(cellWidth, cellHeigh, context, name[i], backColorHSL);

      context.restore();
    }
  };
};
canvasSketch(sketch, settings);
