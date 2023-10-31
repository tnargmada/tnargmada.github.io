// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 100000;
// define the line between small and big width (to determine if shapes fall stacked or not)
const WIDTH_THRESHOLD = 800;
// define shape sizes
// (shapes will have width of SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth)
const SHAPE_MIN_WIDTH = 100;
const SHAPE_WIDTH_SCALE = 0.25;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// create an matter.js engine
var engine = Matter.Engine.create();
// get wrapper element (element which will contain shapes & walls)
var wrapper = document.getElementById("wrap");
// also get current wrapper width (so we can keep track when window resizes)
var currentWidth = wrapper.clientWidth;

// create shapes
var squareX, squareY, circleX, circleY, triangleX, triangleY;
function randomFactorNearOne() {
    return 1 - ((Math.random() - 0.5) * 0.1);
}
if (wrapper.clientWidth <= WIDTH_THRESHOLD) {
    // if small width, put shapes in middle stacked on top of each other
    // (bottom -> top: square, circle, triangle)
    squareX = wrapper.clientWidth / 2 * randomFactorNearOne();
    circleX = wrapper.clientWidth / 2 * randomFactorNearOne();
    triangleX = wrapper.clientWidth / 2 * randomFactorNearOne();
    squareY = -1 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth);
    circleY = -2.1 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth);
    triangleY = -3.2 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth);
    engine.gravity.scale = 0.0006;
} else {
    // if big width, put shapes next to each other horizontally, with middle one raised a bit
    // (left -> rigth: square, circle, triangle)
    squareX = wrapper.clientWidth / 4 * randomFactorNearOne();
    circleX = wrapper.clientWidth / 2 * randomFactorNearOne();
    triangleX = wrapper.clientWidth * 3 / 4 * randomFactorNearOne();
    squareY = -2.5 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
    circleY = -1.2 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
    triangleY = -(2.5 - 0.1667) * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
}
var square = new Square(document.getElementById("square"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, squareX, squareY);
var circle = new Circle(document.getElementById("circle"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, circleX, circleY);
var triangle = new Triangle(document.getElementById("triangle"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, triangleX, triangleY);
// create walls
var walls = new Walls(wrapper, WALL_THICKNESS, WALL_OVERLAP, WALL_HEIGHT, engine);

// add mouse control
mouseConstraint = Matter.MouseConstraint.create(engine, { element: wrapper });
Matter.Composite.add(engine.world, mouseConstraint);
// run the engine
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);
// render shapes (update their DOM elements to reflect engine values)
(function render() {
    window.requestAnimationFrame(render);
    // update shapes based on engine values
    square.updateElem();
    circle.updateElem();
    triangle.updateElem();
})();

// handle resize (change shape and walls to match new window size)
function handleResize() {
    widthRatio = wrapper.clientWidth / currentWidth;
    currentWidth = wrapper.clientWidth;
    square.handleResize();
    circle.handleResize();
    triangle.handleResize();
    walls.handleResize(widthRatio);
}
window.addEventListener("resize", handleResize);

// handle navigation to the other pages (if click, not drag, then navigate)
square.element.addEventListener("pointerdown", () => {
    startDragTime = Date.now();
});
circle.element.addEventListener("pointerdown", () => {
    startDragTime = Date.now();
});
square.element.addEventListener("pointerup", () => {
    if (Date.now() - startDragTime < 200) {
        window.location.href = 'exploration.html';
    }
});
circle.element.addEventListener("pointerup", () => {
    if (Date.now() - startDragTime < 200) {
        window.location.href = 'projects.html';
    }
});