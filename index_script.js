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
// also get current wrapper width & height
var currentWidth = wrapper.clientWidth;
var currentHeight = wrapper.clientHeight;

// create shapes
var square = new Square(wrapper, 150 + wrapper.clientWidth / 5, "#e83544", engine);
var circle = new Circle(wrapper, 150 + wrapper.clientWidth / 5, "#356ee8", engine);
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
    heightRatio = wrapper.clientHeight / currentHeight;
    currentWidth = wrapper.clientWidth;
    currentHeight = wrapper.clientHeight;
    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            wrapper.clientWidth / 2,
            wrapper.clientHeight + WALL_SIZE / 2
        )
    );
    Matter.Body.scale(ground, widthRatio, 1);
    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
            wrapper.clientWidth + WALL_SIZE / 2,
            wrapper.clientHeight / 2
        )
    );
    Matter.Body.scale(rightWall, 1, heightRatio);
    Matter.Body.setPosition(
        leftWall,
        Matter.Vector.create(
            WALL_SIZE / -2,
            wrapper.clientHeight / 2
        )
    );
    Matter.Body.scale(leftWall, 1, heightRatio);
}
window.addEventListener("resize", handleResize);

// handle navigation to the other pages (if click, not drag, then navigate)
Matter.Events.on(mouseConstraint, "startdrag", () => {
    startDragTime = Date.now();
})
Matter.Events.on(mouseConstraint, "enddrag", (event) => {
    endDragTime = Date.now();
    if (endDragTime - startDragTime < 200) {
        if (event.body.id == 1) {
            // clicked on right square
            window.location.href = 'page1.html'
        }
        if (event.body.id == 2) {
            // clicked on left square
            window.location.href = 'page2.html'
        }
    }
})