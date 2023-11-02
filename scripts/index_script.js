// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 10000;
// define the line between small and big width (to determine if shapes fall stacked or not)
const WIDTH_THRESHOLD = 800;
// define shape sizes
// (shapes will have width of SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth)
const SHAPE_MIN_WIDTH = 100;
const SHAPE_WIDTH_SCALE = 0.25;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// use these variables for transitioning
const ANIMATION_TIME = 500;
var transitioning = null;
var startTransitionTime;
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
    if (!transitioning) {
        square.updateElem();
        circle.updateElem();
        triangle.updateElem();
    } else {
        var timeElapsed = Date.now() - startTransitionTime;
        if (timeElapsed >= ANIMATION_TIME) {
            if (transitioning == "square") {
                window.location.href = 'exploration.html';
            } else if (transitioning == "circle") {
                window.location.href = 'projects.html';
            }
        } else {
            var orig_size = SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth;
            var max_size = Math.max(wrapper.clientHeight * 3, wrapper.clientWidth * 3);
            size = orig_size + (timeElapsed / ANIMATION_TIME) * (timeElapsed / ANIMATION_TIME) * (max_size - orig_size);
            var shape_elem = document.getElementById(transitioning);
            shape_elem.style.width = `${size}px`;
            shape_elem.style.height = `${size}px`;
            shape_elem.style.marginLeft = `${-1 * (size - orig_size) / 2}px`
            shape_elem.style.marginTop = `${-1 * (size - orig_size) / 2}px`
        }
    }
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
        transitioning = "square";
        startTransitionTime = Date.now();
        square.element.style.zIndex = "1";
        square.element.firstElementChild.style.visibility = "hidden";
    }
});
circle.element.addEventListener("pointerup", () => {
    if (Date.now() - startDragTime < 200) {
        transitioning = "circle";
        startTransitionTime = Date.now();
        circle.element.style.zIndex = "1";
        circle.element.firstElementChild.style.visibility = "hidden";
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
addOpeningFunction(triangle, "about_popup");