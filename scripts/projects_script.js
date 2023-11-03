// define walls/ground size
const WALL_THICKNESS = 10000;
const WALL_OVERLAP = 5000;
const WALL_HEIGHT = 100000;
// define the line between small and big width (to determine if shapes fall stacked or not)
const WIDTH_THRESHOLD = 800;
// define shape sizes
// (shapes will have width of SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth)
const SHAPE_MIN_WIDTH = 100;
const SHAPE_WIDTH_SCALE = 0.2;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;
// use these variables for transitioning
const ANIMATION_TIME = 500; //ms
var transitioning = false;
var startTransitionTime;
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
// create shapes (projects)
var cornCatcherCircle = new Circle(document.getElementById("corn_catcher"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var scottyReportsCircle = new Circle(document.getElementById("scotty_reports"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var favoriteFoodsCircle = new Circle(document.getElementById("favorite_foods"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var portfolioCircle = new Circle(document.getElementById("portfolio_site"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var finulatorCircle = new Circle(document.getElementById("finulator"), wrapper, SHAPE_MIN_WIDTH, SHAPE_WIDTH_SCALE, engine, randomX(), randomY());
var backCircle = new Circle(document.getElementById("back"), wrapper, SHAPE_MIN_WIDTH * 0.75, SHAPE_WIDTH_SCALE * 0.75, engine, wrapper.clientWidth / 4, wrapper.clientHeight / -2);
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
        cornCatcherCircle.updateElem();
        scottyReportsCircle.updateElem();
        favoriteFoodsCircle.updateElem();
        portfolioCircle.updateElem();
        finulatorCircle.updateElem();
        backCircle.updateElem();
    } else {
        var timeElapsed = Date.now() - startTransitionTime;
        if (timeElapsed >= ANIMATION_TIME) {
            window.location.href = 'index.html';
        } else {
            var orig_size = 0.75 * (SHAPE_MIN_WIDTH + SHAPE_WIDTH_SCALE * wrapper.clientWidth);
            var max_size = Math.max(wrapper.clientHeight * 3, wrapper.clientWidth * 3);
            size = orig_size + (timeElapsed / ANIMATION_TIME) * (timeElapsed / ANIMATION_TIME) * (max_size - orig_size);
            backCircle.element.style.width = `${size}px`;
            backCircle.element.style.height = `${size}px`;
            backCircle.element.style.marginLeft = `${-1 * (size - orig_size) / 2}px`
            backCircle.element.style.marginTop = `${-1 * (size - orig_size) / 2}px`
        }
    }
})();

// handle resize (change shape and walls to match new window size)
function handleResize() {
    widthRatio = wrapper.clientWidth / currentWidth;
    currentWidth = wrapper.clientWidth;
    cornCatcherCircle.handleResize();
    scottyReportsCircle.handleResize();
    favoriteFoodsCircle.handleResize();
    portfolioCircle.handleResize();
    finulatorCircle.handleResize();
    backCircle.handleResize();
    walls.handleResize(widthRatio);
}
window.addEventListener("resize", handleResize);

// handle navigation to the other pages (if click, not drag, then navigate)
backCircle.element.addEventListener("pointerdown", () => {
    startDragTime = Date.now();
});
backCircle.element.addEventListener("pointerup", () => {
    if (Date.now() - startDragTime < 200) {
        transitioning = true;
        startTransitionTime = Date.now();
        backCircle.element.style.zIndex = "1";
        backCircle.element.firstElementChild.style.visibility = "hidden";
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
addOpeningFunction(cornCatcherCircle, "corn_popup");
addOpeningFunction(scottyReportsCircle, "scotty_popup");
addOpeningFunction(favoriteFoodsCircle, "foods_popup");
addOpeningFunction(portfolioCircle, "portfolio_popup");
addOpeningFunction(finulatorCircle, "finulator_popup");