class Square {
    constructor(element, parentElem, widthMin, widthScale, matterEngine, initialX, initialY) {
        this.parentElem = parentElem;
        this.widthMin = widthMin;
        this.widthScale = widthScale;
        this.width = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        this.originalWidth = this.width;
        this.matterEngine = matterEngine;
        this.element = element;
        // style DOM element
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.position = "absolute";
        this.element.style.top = "0px";
        this.element.style.left = "0px";
        this.element.style.fontSize = `${this.width / 8}px`;
        if (this.element.children[1]) {
            this.element.children[1].style.fontSize = `${this.width / 12}px`;
        }
        // initialize matter.js body
        this.body = Matter.Bodies.rectangle(initialX, initialY, this.width, this.width);
        // add matter.js body to matter.js world
        Matter.Composite.add(this.matterEngine.world, this.body);
    }
    // method to update DOM element based on matter.js engine, for rendering
    updateElem() {
        // set position, size, and rotation
        this.element.style.transform = `
            translate(${this.body.position.x - this.element.clientWidth / 2}px,
            ${this.body.position.y - this.element.clientHeight / 2}px)
            rotate(${this.body.angle}rad)
            scale(${this.width / this.originalWidth})
        `;
    }
    // method to handle window resize
    // change this.width, and scale matter.js body by (new width / old width)
    handleResize() {
        var newWidth = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        Matter.Body.scale(this.body, newWidth / this.width, newWidth / this.width);
        this.width = newWidth;
    }
}

class Circle {
    constructor(element, parentElem, widthMin, widthScale, matterEngine, initialX, initialY) {
        this.parentElem = parentElem;
        this.widthMin = widthMin;
        this.widthScale = widthScale;
        this.width = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        this.matterEngine = matterEngine;
        this.element = element;
        // style DOM element
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.position = "absolute";
        this.element.style.borderRadius = "50%";
        this.element.style.fontSize = `${this.width / 8}px`;
        if (this.element.children[1]) {
            this.element.children[1].style.fontSize = `${this.width / 12}px`;
        }
        // initialize matter.js body
        this.body = Matter.Bodies.circle(initialX, initialY, this.width / 2);
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
    // method to handle window resize
    // change this.width, and scale matter.js body by (new width / old width)
    handleResize() {
        var newWidth = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        Matter.Body.scale(this.body, newWidth / this.width, newWidth / this.width);
        this.width = newWidth;
        // change font size
        this.element.style.fontSize = `${this.width / 8}px`;
        if (this.element.children[1]) {
            this.element.children[1].style.fontSize = `${this.width / 12}px`;
        }
    }
}

class Triangle {
    constructor(element, parentElem, widthMin, widthScale, matterEngine, initialX, initialY) {
        this.parentElem = parentElem;
        this.widthMin = widthMin;
        this.widthScale = widthScale;
        this.width = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        this.matterEngine = matterEngine;
        this.element = element;
        // style DOM element
        this.element.style.width = `${this.width / 0.866}px`;
        this.element.style.height = `${this.width}px`;
        this.element.style.position = "absolute";
        this.element.style.fontSize = `${this.width / 8}px`;
        // initialize matter.js body
        this.body = Matter.Bodies.polygon(initialX, initialY, 3, this.width * 2 / 3);
        // rotate it to be pointing up
        Matter.Body.rotate(this.body, Math.PI / 2);
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
        this.element.style.transform = `rotate(${this.body.angle - Math.PI / 2}rad)`;
    }
    // method to handle window resize
    // change this.width, and scale matter.js body by (new width / old width)
    handleResize() {
        var newWidth = this.widthMin + this.widthScale * this.parentElem.clientWidth;
        Matter.Body.scale(this.body, newWidth / this.width, newWidth / this.width);
        this.width = newWidth;
        // change font size
        this.element.style.fontSize = `${this.width / 8}px`
    }
}