import loadData from "../advent.js";
class UnitVector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
const ODirection = {
    R: new UnitVector(1, 0),
    L: new UnitVector(-1, 0),
    U: new UnitVector(0, 1),
    D: new UnitVector(0, -1)
};
class Knot {
    position = { x: 0, y: 0 };
    move(vector) {
        this.position.x += vector.x;
        this.position.y += vector.y;
    }
}
class Tail extends Knot {
    visitedLocations = new Set(['0,0']);
    follow(headPosition) {
        const xDistance = headPosition.x - this.position.x;
        const yDistance = headPosition.y - this.position.y;
        if (Math.abs(xDistance) > 1 || Math.abs(yDistance) > 1) {
            this.move(new UnitVector(Math.sign(xDistance), Math.sign(yDistance)));
            this.visitedLocations.add(`${this.position.x},${this.position.y}`);
        }
    }
}
class Instruction {
    direction;
    steps;
    constructor(direction, steps) {
        this.direction = direction;
        this.steps = steps;
    }
}
class Rope {
    head = new Knot();
    knots;
    tail = new Tail();
    constructor(amountOfKnots) {
        this.knots = Array.from({ length: amountOfKnots }, _ => new Tail());
    }
    moveHead(direction) {
        this.head.move(direction);
    }
    do(instruction) {
        for (let step = 0; step < instruction.steps; step++) {
            this.moveHead(instruction.direction);
            let previousKnotPosition = { ...this.head.position };
            for (const knot of this.knots) {
                knot.follow(previousKnotPosition);
                previousKnotPosition = { ...knot.position };
            }
            this.tail.follow(previousKnotPosition);
        }
    }
}
loadData('input.txt')
    .then((lines) => {
    return lines.map(line => {
        const [direction, steps] = line.split(' ');
        return new Instruction(ODirection[direction], Number(steps));
    });
})
    .then((instructions) => {
    const shortRope = new Rope(0);
    const longRope = new Rope(8);
    for (const instruction of instructions) {
        shortRope.do(instruction);
        longRope.do(instruction);
    }
    console.log(`The tail of the short rope has moved to ${shortRope.tail.visitedLocations.size} locations`);
    console.log(`The tail of the long rope has moved to ${longRope.tail.visitedLocations.size} locations`);
});
