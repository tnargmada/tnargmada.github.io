class Square {
    constructor(parentElem, width, color, matterEngine) {
        this.parentElem = parentElem;
        this.width = width;
        this.matterEngine = matterEngine;
        // initialize DOM element
        this.element = document.createElement("div");
        parentElem.appendChild(this.element);
        // style DOM element
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.backgroundColor = color;
        this.element.style.position = "absolute";
        // initialize matter.js body
        this.body = Matter.Bodies.rectangle(0.5 * parentElem.clientWidth, width * -1.8, width, width);
        // add matter.js body to matter.js world
        Matter.Composite.add(this.matterEngine.world, this.body);
    }
    // method to update DOM element based on matter.js engine, for rendering
    updateElem() {
        // set position, size, and rotation
        this.element.style.top = `${this.body.position.y - this.element.clientHeight / 2}px`;
        this.element.style.left = `${this.body.position.x - this.element.clientWidth / 2}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
    }
}

class Circle {
    constructor(parentElem, width, color, matterEngine) {
        this.parentElem = parentElem;
        this.width = width;
        this.matterEngine = matterEngine;
        // initialize DOM element
        this.element = document.createElement("div");
        parentElem.appendChild(this.element);
        // style DOM element
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.backgroundColor = color;
        this.element.style.position = "absolute";
        this.element.style.borderRadius = "50%";
        // initialize matter.js body
        this.body = Matter.Bodies.circle(0.2 * parentElem.clientWidth, width * -1.8, width / 2);
        // add matter.js body to matter.js world
        Matter.Composite.add(this.matterEngine.world, this.body);
    }
    // method to update DOM element based on matter.js engine, for rendering
    updateElem() {
        // set position, size, and rotation
        this.element.style.top = `${this.body.position.y - this.element.clientHeight / 2}px`;
        this.element.style.left = `${this.body.position.x - this.element.clientWidth / 2}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
    }
}