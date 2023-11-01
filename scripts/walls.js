class Walls {
    constructor(parentElem, thickness, overlap, height, matterEngine) {
        this.parentElem = parentElem;
        this.thickness = thickness;
        this.overlap = overlap;
        this.height = height;
        this.matterEngine = matterEngine;
        // create a ground and walls
        this.ground = Matter.Bodies.rectangle(
            this.parentElem.clientWidth / 2, this.parentElem.clientHeight + this.thickness / 2,
            this.parentElem.clientWidth + this.overlap * 2, this.thickness,
            { isStatic: true }
        );
        // ceiling is at height / 2
        this.ceiling = Matter.Bodies.rectangle(
            this.parentElem.clientWidth / 2, -1 * (this.height / 2 + this.thickness / 2),
            this.parentElem.clientWidth + this.overlap * 2, this.thickness,
            { isStatic: true }
        );
        this.rightWall = Matter.Bodies.rectangle(
            this.parentElem.clientWidth + this.thickness / 2, this.parentElem.clientHeight / 2,
            this.thickness, this.parentElem.clientHeight + this.overlap * 2 + this.height * 2,
            { isStatic: true }
        );
        this.leftWall = Matter.Bodies.rectangle(
            this.thickness / -2, this.parentElem.clientHeight / 2,
            this.thickness, this.parentElem.clientHeight + this.overlap * 2 + this.height * 2,
            { isStatic: true }
        );
        // add to world
        Matter.Composite.add(this.matterEngine.world, [this.ground, this.ceiling, this.rightWall, this.leftWall]);
    }
    // method to handle window resize
    // scale matter.js body by ratio (new width / old width), and change its position
    handleResize(widthRatio) {
        Matter.Body.setPosition(
            this.ground,
            Matter.Vector.create(
                this.parentElem.clientWidth / 2,
                this.parentElem.clientHeight + this.thickness / 2
            )
        );
        Matter.Body.scale(this.ground, widthRatio, 1);
        Matter.Body.setPosition(
            this.ceiling,
            Matter.Vector.create(
                this.parentElem.clientWidth / 2,
                -1 * (this.height / 2 + this.thickness / 2)
            )
        );
        Matter.Body.scale(this.ceiling, widthRatio, 1);
        Matter.Body.setPosition(
            this.rightWall,
            Matter.Vector.create(
                this.parentElem.clientWidth + this.thickness / 2,
                this.parentElem.clientHeight / 2
            )
        );
        Matter.Body.setPosition(
            this.leftWall,
            Matter.Vector.create(
                this.thickness / -2,
                this.parentElem.clientHeight / 2
            )
        );
    }
}