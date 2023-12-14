// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 10000;
// define the line between small and big width (to determine if shapes fall stacked or not)
const WIDTH_THRESHOLD = 1000;
// define shape sizes
// (shapes will have width of SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth)
const SHAPE_MIN_WIDTH = 120;
const SHAPE_WIDTH_SCALE = 0.2;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// use these variables for animating
const ANIMATION_TIME = 500; //ms
const MS_PER_FRAME = 15;
var animating = false;
// create an matter.js engine
var engine = Matter.Engine.create();
// define variables to run the engine
const MAX_DELTA = 250; //ms
var lastFrame;
var enabled = true;
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
    squareX = wrapper.clientWidth * 0.3 * randomFactorNearOne();
    triangleX = wrapper.clientWidth / 2 * randomFactorNearOne();
    circleX = wrapper.clientWidth * 0.68 * randomFactorNearOne();
    squareY = -2.5 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
    triangleY = -(1.2 - 0.1667) * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
    circleY = -2.5 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth) * randomFactorNearOne();
}
var square = new Square(document.getElementById("square"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, squareX, squareY);
var circle = new Circle(document.getElementById("circle"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, circleX, circleY);
var triangle = new Triangle(document.getElementById("triangle"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, triangleX, triangleY);
// make shapes visible (they're initially hidden so they don't flash on page load, before we position them)
square.element.style.visibility = "visible";
circle.element.style.visibility = "visible";
triangle.element.style.visibility = "visible";
// create walls
var walls = new Walls(wrapper, WALL_THICKNESS, WALL_OVERLAP, WALL_HEIGHT, engine);

// add mouse control
mouseConstraint = Matter.MouseConstraint.create(engine, { element: wrapper });
Matter.Composite.add(engine.world, mouseConstraint);
// run engine & render shapes (update their DOM elements to reflect engine values)
lastFrame = Date.now();
(function run() {
    window.requestAnimationFrame(run);
    // update shapes based on engine values
    var currentFrame = Date.now();
    if (enabled) {
        var delta = currentFrame - lastFrame;
        if (delta > MAX_DELTA) {
            delta = 0;
        }
        Matter.Engine.update(engine, delta);
        square.updateElem();
        circle.updateElem();
        triangle.updateElem();
    }
    lastFrame = currentFrame;
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
function animate(shape, startTime, isReverse, clearFunction) {
    var timeElapsed = Date.now() - startTime;
    var orig_size = SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth;
    var max_size = Math.max(wrapper.clientHeight * 4, wrapper.clientWidth * 4);
    if (timeElapsed >= ANIMATION_TIME) {
        if (isReverse) {
            shape.element.style.marginLeft = "auto";
            shape.element.style.marginTop = "auto";
            shape.element.style.width = `${orig_size}px`;
            shape.element.style.height = `${orig_size}px`;
        }
        clearFunction();
    } else {
        scaleFactor = (timeElapsed / ANIMATION_TIME) * (timeElapsed / ANIMATION_TIME);
        if (isReverse) {
            scaleFactor = 1 - Math.sqrt(Math.sqrt(scaleFactor));
        }
        size = orig_size + scaleFactor * (max_size - orig_size);
        shape.element.style.width = `${size}px`;
        shape.element.style.height = `${size}px`;
        shape.element.style.marginLeft = `${-1 * (size - orig_size) / 2}px`;
        shape.element.style.marginTop = `${-1 * (size - orig_size) / 2}px`;
    }
}
function navigate(shape, popupId) {
    // stop physics
    enabled = false;
    // remove text and put in front
    shape.element.style.zIndex = "1";
    shape.element.querySelector(".shape_text").style.visibility = "hidden";
    // animate (and define what to do when done animating)
    animating = true;
    var interval = setInterval(animate, MS_PER_FRAME, shape, Date.now(), false, () => {
        clearInterval(interval);
        animating = false;
        if (shape == square) {
            window.location.href = "exploration.html";
        } else if (shape == circle) {
            window.location.href = "projects.html";
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
    animating = true;
    interval = setInterval(animate, MS_PER_FRAME, shape, Date.now(), true, () => {
        clearInterval(interval);
        animating = false;
        // start physics
        enabled = true;
        // add text back again, and move element back from the front
        shape.element.style.zIndex = "auto";
        shape.element.querySelector(".shape_text").style.visibility = "visible";
    })
}
function addNavigateFunction(shape, popupId) {
    shape.element.addEventListener("pointerdown", () => {
        if (!animating) {
            startDragTime = Date.now();
        }
    });
    shape.element.addEventListener("pointerup", () => {
        if (!animating && Date.now() - startDragTime < 200) {
            navigate(shape, popupId);
        }
    });
}
function addGoBackFunction(shape, popupId) {
    var popupElem = document.getElementById(popupId);
    popupElem.querySelector(".back").addEventListener("click", () => {
        if (!animating) {
            goBack(shape, popupId);
        }
    });
}
addNavigateFunction(square, null);
addNavigateFunction(circle, null);
addNavigateFunction(triangle, "about_popup");
addGoBackFunction(triangle, "about_popup");

// allow back button to work (reset shape stuff on pageshow)
window.addEventListener("pageshow", () => {
    // reset shape animations on pageshow
    // need to remove margins, change width/height, and show text
    enabled = true;
    var orig_size = SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth;
    // square reset
    square.element.style.zIndex = "auto";
    square.element.querySelector(".shape_text").style.visibility = "visible";
    square.element.style.width = `${orig_size}px`;
    square.element.style.height = `${orig_size}px`;
    square.element.style.marginLeft = "0px";
    square.element.style.marginTop = "0px";
    // circle reset
    circle.element.style.zIndex = "auto";
    circle.element.querySelector(".shape_text").style.visibility = "visible";
    circle.element.style.width = `${orig_size}px`;
    circle.element.style.height = `${orig_size}px`;
    circle.element.style.marginLeft = "0px";
    circle.element.style.marginTop = "0px";
})