const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [30, 30]
};

const sketch = () => {
  return ({ context, width, height }) => {
    // context.fillStyle = "white";
    // context.fillRect(0, 0, width, height);

    // context.translate(width / 2, height / 2);
    context.fillStyle = "black";
    // context.arc(0, 0, 10, 0, 2 * Math.PI);
    context.font = "26px serif";
    context.fillText("A", 7, 24);
    // context.fill();
  };
};

canvasSketch(sketch, settings);
