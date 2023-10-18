class Walls {
    constructor(parentElem, thickness, overlap, height, matterEngine) {
        this.parentElem = parentElem;
        this.thickness = thickness;
        this.overlap = overlap;
        this.height = height;
        this.matterEngine = matterEngine;
        // create a ground and walls
        var ground = Matter.Bodies.rectangle(
            this.parentElem.clientWidth / 2, this.parentElem.clientHeight + this.thickness / 2,
            this.parentElem.clientWidth + this.overlap * 2, this.thickness,
            { isStatic: true }
        );
        var rightWall = Matter.Bodies.rectangle(
            this.parentElem.clientWidth + this.thickness / 2, this.parentElem.clientHeight / 2,
            this.thickness, this.parentElem.clientHeight + this.overlap * 2 + this.height * 2,
            { isStatic: true }
        );
        var leftWall = Matter.Bodies.rectangle(
            this.thickness / -2, this.parentElem.clientHeight / 2,
            this.thickness, this.parentElem.clientHeight + this.overlap * 2 + this.height * 2,
            { isStatic: true }
        );
        // add to world
        Matter.Composite.add(this.matterEngine.world, [ground, rightWall, leftWall]);
    }
}