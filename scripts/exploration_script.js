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
// use these variables for transitioning
const ANIMATION_TIME = 500; //ms
const MS_PER_FRAME = 15;
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
    if (runner.enabled) {
        eelSquare.updateElem();
        clicksSquare.updateElem();
        clockSquare.updateElem();
        tugofwarSquare.updateElem();
        backSquare.updateElem();
    }
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
function animate(shape, startTime, isReverse, clearFunction) {
    var timeElapsed = Date.now() - startTime;
    if (timeElapsed >= ANIMATION_TIME) {
        if (isReverse) {
            shape.element.style.marginLeft = "auto";
            shape.element.style.marginTop = "auto";
        }
        clearFunction();
    } else {
        var orig_size = SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth;
        if (shape == backSquare) {
            orig_size *= 0.7;
        }
        var max_size = Math.max(wrapper.clientHeight * 3, wrapper.clientWidth * 3);
        scaleFactor = (timeElapsed / ANIMATION_TIME) * (timeElapsed / ANIMATION_TIME);
        if (isReverse) {
            scaleFactor = 1 - Math.sqrt(Math.sqrt(scaleFactor));
        }
        size = orig_size + scaleFactor * (max_size - orig_size);
        shape.element.style.width = `${size}px`;
        shape.element.style.height = `${size}px`;
        shape.element.style.marginLeft = `${-1 * (size - orig_size) / 2}px`
        shape.element.style.marginTop = `${-1 * (size - orig_size) / 2}px`
    }
}
function navigate(shape, popupId) {
    // stop physics
    runner.enabled = false;
    // remove child (text) and put in front
    shape.element.style.zIndex = "1";
    shape.element.firstElementChild.style.visibility = "hidden";
    // animate (and define what to do when done animating)
    var interval = setInterval(animate, MS_PER_FRAME, shape, Date.now(), false, () => {
        clearInterval(interval);
        if (shape == backSquare) {
            window.location.href = "index.html";
        } else {
            // make popup visible
            document.getElementById(popupId).style.visibility = "visible";
        }
    });
}
function goBack(shape, popupId) {
    // remove popup
    document.getElementById(popupId).style.visibility = "hidden";
    // animate (and define what to do when done animating)
    interval = setInterval(animate, MS_PER_FRAME, shape, Date.now(), true, () => {
        clearInterval(interval);
        // start physics
        runner.enabled = true;
        // add child (text) back again, and move element back from the front
        shape.element.style.zIndex = "auto";
        shape.element.firstElementChild.style.visibility = "visible";
    })
}
function addNavigateFunction(shape, popupId) {
    shape.element.addEventListener("pointerdown", () => {
        startDragTime = Date.now();
    });
    shape.element.addEventListener("pointerup", () => {
        if (Date.now() - startDragTime < 200) {
            navigate(shape, popupId);
        }
    });
}
function addGoBackFunction(shape, popupId) {
    var popupElem = document.getElementById(popupId);
    popupElem.querySelector(".back").addEventListener("click", () => {
        goBack(shape, popupId);
    });
}
addNavigateFunction(backSquare, null);
addNavigateFunction(eelSquare, "eel_popup");
addNavigateFunction(clicksSquare, "clicks_popup");
addNavigateFunction(clockSquare, "clock_popup");
addNavigateFunction(tugofwarSquare, "tugofwar_popup");
addGoBackFunction(eelSquare, "eel_popup");
addGoBackFunction(clicksSquare, "clicks_popup");
addGoBackFunction(clockSquare, "clock_popup");
addGoBackFunction(tugofwarSquare, "tugofwar_popup");