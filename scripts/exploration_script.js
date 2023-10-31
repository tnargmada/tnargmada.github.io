// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 100000;
// define the line between small and big width (to determine if shapes fall stacked or not)
const WIDTH_THRESHOLD = 800;
// define shape sizes
// (shapes will have width of SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth)
const SHAPE_MIN_WIDTH = 80;
const SHAPE_WIDTH_SCALE = 0.2;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// create an matter.js engine
var engine = Matter.Engine.create();
// get wrapper element (element which will contain shapes & walls)
var wrapper = document.getElementById("wrap");
// also get current wrapper width (so we can keep track when window resizes)
var currentWidth = wrapper.clientWidth;

if (wrapper.clientWidth <= WIDTH_THRESHOLD) {
    // if small screen, lower gravity
    engine.gravity.scale = 0.0006;
}
// function to randomize positions
function randomX() {
    return Math.random() * wrapper.clientWidth;
}
function randomY() {
    // change this
    return -1 * (wrapper.clientHeight + Math.random() * wrapper.clientHeight);
}
// create shapes (explorations)
var eelSquare = new Square(document.getElementById("eel"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var clicksSquare = new Square(document.getElementById("clicks"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var clockSquare = new Square(document.getElementById("clock"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var tugofwarSquare = new Square(document.getElementById("tugofwar"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var backSquare = new Square(document.getElementById("back"), wrapper, SHAPE_MIN_WIDTH * 0.7, SHAPE_WIDTH_SCALE * 0.7, engine, wrapper.clientWidth / 4, wrapper.clientHeight / -2);
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
    eelSquare.updateElem();
    clicksSquare.updateElem();
    clockSquare.updateElem();
    tugofwarSquare.updateElem();
    backSquare.updateElem();
})();

// handle resize (change shape and walls to match new window size)
function handleResize() {
    widthRatio = wrapper.clientWidth / currentWidth;
    currentWidth = wrapper.clientWidth;
    eelSquare.handleResize();
    clicksSquare.handleResize();
    clockSquare.handleResize();
    tugofwarSquare.handleResize();
    backSquare.handleResize();
    walls.handleResize(widthRatio);
}
window.addEventListener("resize", handleResize);

// handle navigation to the other pages (if click, not drag, then navigate)
backSquare.element.addEventListener("pointerdown", () => {
    startDragTime = Date.now();
});
backSquare.element.addEventListener("pointerup", () => {
    if (Date.now() - startDragTime < 200) {
        window.location.href = 'index.html';
    }
});
// handle popup closing/opening
// closing by X button
document.querySelectorAll(".xbutton").forEach((xbutton) => {
    xbutton.addEventListener("click", () => {
        document.querySelectorAll(".popup_wrap").forEach((popup) => {
            popup.style.visibility = "hidden";
        });
    });
});
// closing by clicking outside div
document.querySelectorAll(".popup_wrap").forEach((popup) => {
    popup.addEventListener("click", (event) => {
        if (!popup.children[0].contains(event.target)) {
            // click outside popup
            popup.style.visibility = "hidden";
        }
    });
});
// handle opening
function addOpeningFunction(shapeElem, popupId) {
    shapeElem.element.addEventListener("pointerdown", () => {
        startDragTime = Date.now();
    });
    shapeElem.element.addEventListener("pointerup", () => {
        if (Date.now() - startDragTime < 200) {
            document.getElementById(popupId).style.visibility = "visible";
        }
    });
}
addOpeningFunction(eelSquare, "eel_popup");
addOpeningFunction(clicksSquare, "clicks_popup");
addOpeningFunction(clockSquare, "clock_popup");
addOpeningFunction(tugofwarSquare, "tugofwar_popup");