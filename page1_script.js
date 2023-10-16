// define walls/ground/ceiling thickness
const WALL_SIZE = 10000;
// use this variable to distinguish a "drag" from a "click"
var startDragTime;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite;
    Events = Matter.Events;

// create an engine
var engine = Engine.create();

// get wrapper element
var wrapper = document.getElementById("wrap")

// create a renderer
var render = Render.create({
    element: wrapper,
    engine: engine,
    options: {
        width: wrapper.clientWidth,
        height: wrapper.clientHeight
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(800, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(
    wrapper.clientWidth / 2, wrapper.clientHeight + WALL_SIZE / 2,
    wrapper.clientWidth + 1000, WALL_SIZE,
    { isStatic: true }
);
var ceiling = Bodies.rectangle(
    wrapper.clientWidth / 2, -1 * WALL_SIZE / 2,
    wrapper.clientWidth + 1000, WALL_SIZE,
    { isStatic: true }
);
var rightWall = Bodies.rectangle(
    wrapper.clientWidth + WALL_SIZE / 2, wrapper.clientHeight / 2,
    WALL_SIZE, wrapper.clientHeight + 1000,
    { isStatic: true }
);
var leftWall = Bodies.rectangle(
    -1 * WALL_SIZE / 2, wrapper.clientHeight / 2,
    WALL_SIZE, wrapper.clientHeight + 1000,
    { isStatic: true }
);

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, ceiling, rightWall, leftWall]);

// add mouse control
var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize() {
    render.bounds.max.x = wrapper.clientWidth;
    render.bounds.max.y = wrapper.clientHeight;
    render.options.width = wrapper.clientWidth;
    render.options.height = wrapper.clientHeight;
    render.canvas.width = wrapper.clientWidth;
    render.canvas.height = wrapper.clientHeight;
    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            wrapper.clientWidth / 2,
            wrapper.clientHeight + WALL_SIZE / 2
        )
    );
    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
            wrapper.clientWidth + WALL_SIZE / 2,
            wrapper.clientHeight / 2
        )
    );
}

window.addEventListener("resize", handleResize);

Events.on(mouseConstraint, "startdrag", () => {
    console.log("Start drag!");
    startDragTime = Date.now();
})

Events.on(mouseConstraint, "enddrag", (event) => {
    console.log("End drag!");
    console.log(event.body);
    endDragTime = Date.now();
    if (endDragTime - startDragTime < 250) {
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