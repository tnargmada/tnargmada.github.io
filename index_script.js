// define walls/ground thickness
const WALL_SIZE = 10000;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;

// create an engine
var engine = Matter.Engine.create();

// get wrapper element
var wrapper = document.getElementById("wrap");
var circleElem = document.getElementById("circle");
var triangleElem = document.getElementById("triangle");
// also get current wrapper width & height
var currentWidth = wrapper.clientWidth;
var currentHeight = wrapper.clientHeight;

// create shapes
var square = new Square(wrapper, 150 + wrapper.clientWidth / 5, "#e83544", engine);
var circle = new Circle(wrapper, 150 + wrapper.clientWidth / 5, "#356ee8", engine);

// initialize variables to reference objects we'll need
var ground, leftWall, rightWall;

function initializeWalls() {
    // create a ground and walls
    ground = Matter.Bodies.rectangle(
        wrapper.clientWidth / 2, wrapper.clientHeight + WALL_SIZE / 2,
        wrapper.clientWidth + 1000, WALL_SIZE,
        { isStatic: true, render: { visible: false } }
    );
    rightWall = Matter.Bodies.rectangle(
        wrapper.clientWidth + WALL_SIZE / 2, wrapper.clientHeight / 2,
        WALL_SIZE, wrapper.clientHeight + 100000,
        { isStatic: true, render: { visible: false } }
    );
    leftWall = Matter.Bodies.rectangle(
        -1 * WALL_SIZE / 2, wrapper.clientHeight / 2,
        WALL_SIZE, wrapper.clientHeight + 100000,
        { isStatic: true, render: { visible: false } }
    );
    // add to world
    Matter.Composite.add(engine.world, [ground, rightWall, leftWall]);
}

initializeWalls();

// add mouse control
mouseConstraint = Matter.MouseConstraint.create(engine, { element: wrapper });

Matter.Composite.add(engine.world, mouseConstraint);

// create runner
var runner = Matter.Runner.create();

// run the engine
Matter.Runner.run(runner, engine);

// render
(function render() {
    window.requestAnimationFrame(render);
    // update shapes based on engine values
    square.updateElem();
    circle.updateElem();
})();

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