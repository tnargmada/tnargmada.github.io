// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 100000;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// create an matter.js engine
var engine = Matter.Engine.create();
// get wrapper element (element which will contain shapes & walls)
var wrapper = document.getElementById("wrap");
// also get current wrapper width (so we can keep track when window resizes)
var currentWidth = wrapper.clientWidth;

// create shapes
var square = new Square(document.getElementById("square"), wrapper, 150, 0.2, engine);
var circle = new Circle(document.getElementById("circle"), wrapper, 150, 0.2, engine);
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
})();

// handle resize (change shape and walls to match new window size)
function handleResize() {
    widthRatio = wrapper.clientWidth / currentWidth;
    currentWidth = wrapper.clientWidth;
    square.handleResize();
    circle.handleResize();
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