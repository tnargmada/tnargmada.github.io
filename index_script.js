// define walls/ground thickness
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
var wrapper = document.getElementById("wrap");
// also get current wrapper width & height
var currentWidth = wrapper.clientWidth;
var currentHeight = wrapper.clientHeight;

// create a renderer
var render = Render.create({
    element: wrapper,
    engine: engine,
    options: {
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
        wireframes: false,
        background: '#ffffff00'
    }
});

// initialize variables to reference objects we'll need
var square, circle, triangle, ground, leftWall, rightWall;

function initializeShapes() {
    // create two boxes
    size = 150 + wrapper.clientWidth / 5;
    square = Bodies.rectangle(0.5 * wrapper.clientWidth, size * -1.8, size, size, {render: { fillStyle: '#e83544' }});
    circle = Bodies.circle(0.2 * wrapper.clientWidth, size * -2.3, size / 2, {render: { fillStyle: '#356ee8' }});
    triangle = Bodies.polygon(0.8 * wrapper.clientWidth, size * -3, 3, size * 2 / 3, {render: { fillStyle: '#ffdf29' }});
    Matter.Body.rotate(triangle, Math.PI / 2);
    // launch them a little bit to the side 
    Matter.Body.rotate(square, (Math.random() - 0.5) * Math.PI / 4);
    Matter.Body.rotate(circle, (Math.random() - 0.5) * Math.PI / 4);
    Matter.Body.rotate(triangle, (Math.random() - 0.5) * Math.PI / 4);
    Matter.Body.setVelocity(square, Matter.Vector.create((Math.random() - 0.4) * 15, 5));
    Matter.Body.setVelocity(circle, Matter.Vector.create((Math.random() - 0.4) * 15, 5));
    Matter.Body.setVelocity(triangle, Matter.Vector.create((Math.random() - 0.4) * 15, 5));
    // add to world
    Composite.add(engine.world, [square, circle, triangle]);
}

function resetShapeSizes() {
    
}

function initializeWalls() {
    // create a ground and walls
    ground = Bodies.rectangle(
        wrapper.clientWidth / 2, wrapper.clientHeight + WALL_SIZE / 2,
        wrapper.clientWidth + 1000, WALL_SIZE,
        { isStatic: true, render: { visible: false } }
    );
    rightWall = Bodies.rectangle(
        wrapper.clientWidth + WALL_SIZE / 2, wrapper.clientHeight / 2,
        WALL_SIZE, wrapper.clientHeight + 100000,
        { isStatic: true, render: { visible: false } }
    );
    leftWall = Bodies.rectangle(
        -1 * WALL_SIZE / 2, wrapper.clientHeight / 2,
        WALL_SIZE, wrapper.clientHeight + 100000,
        { isStatic: true, render: { visible: false } }
    );
    // add to world
    Composite.add(engine.world, [ground, rightWall, leftWall]);
}

initializeShapes();
initializeWalls();
resetShapeSizes();

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
    widthRatio = wrapper.clientWidth / currentWidth;
    heightRatio = wrapper.clientHeight / currentHeight;
    currentWidth = wrapper.clientWidth;
    currentHeight = wrapper.clientHeight;
    render.bounds.max.x = wrapper.clientWidth;
    render.bounds.max.y = wrapper.clientHeight;
    render.options.width = wrapper.clientWidth;
    render.options.height = wrapper.clientHeight;
    render.canvas.width = wrapper.clientWidth;
    render.canvas.height = wrapper.clientHeight;
    Matter.Body.scale(square, widthRatio, widthRatio);
    Matter.Body.scale(circle, widthRatio, widthRatio);
    Matter.Body.scale(triangle, widthRatio, widthRatio);
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

Events.on(mouseConstraint, "startdrag", () => {
    startDragTime = Date.now();
})

Events.on(mouseConstraint, "enddrag", (event) => {
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