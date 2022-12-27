import loadData from "../advent.js"


type Unit = -1|0|1

class UnitVector {
    public x: Unit;
    public y: Unit;
    
    constructor(x: Unit, y: Unit) {
        this.x = x;
        this.y = y;
    }
}

const ODirection = {
    R: new UnitVector(1, 0),
    L: new UnitVector(-1, 0),
    U: new UnitVector(0, 1),
    D: new UnitVector(0, -1)
} as const
type DirectionKey = keyof typeof ODirection;
type Direction = typeof ODirection[DirectionKey];

type Position = {
    x: number;
    y: number;
}

class Knot {
    public position: Position = {x: 0, y: 0};

    move(vector: UnitVector) {
        this.position.x += vector.x
        this.position.y += vector.y
    }
}

class Tail extends Knot {
    public visitedLocations: Set<string> = new Set(['0,0']);

    follow(headPosition: Position) {
        const xDistance = headPosition.x - this.position.x;
        const yDistance = headPosition.y - this.position.y;
        if (Math.abs(xDistance) > 1 || Math.abs(yDistance) > 1) {
            this.move(
                new UnitVector(
                    Math.sign(xDistance) as Unit,
                    Math.sign(yDistance) as Unit,
                )
            )
            this.visitedLocations.add(`${this.position.x},${this.position.y}`)
        }
    }
}

class Instruction {
    public direction: Direction;
    public steps: number;

    constructor(direction: Direction, steps: number) {
        this.direction = direction;
        this.steps = steps;
    }
}

class Rope {
    public head: Knot = new Knot();
    public knots: Tail[];
    public tail: Tail = new Tail();

    constructor(amountOfKnots: number) {
        this.knots = Array.from({length: amountOfKnots},_ => new Tail())
    }

    moveHead(direction: Direction) {
        this.head.move(direction)
    }

    do(instruction: Instruction) {
        for (let step = 0; step < instruction.steps; step++) {
            this.moveHead(instruction.direction)
            let previousKnotPosition: Position = {...this.head.position};
            for (const knot of this.knots) {
                knot.follow(previousKnotPosition)
                previousKnotPosition = {...knot.position};
            }
            this.tail.follow(previousKnotPosition)
        }
    }
}



loadData('input.txt')
    .then((lines: string[]) => {
        return lines.map(line => {
            const [direction, steps] = line.split(' ');
            return new Instruction(ODirection[direction as DirectionKey], Number(steps))
        })
    })
    .then((instructions: Instruction[]) => {
        const shortRope = new Rope(0);
        const longRope = new Rope(8);
        for (const instruction of instructions) {
            shortRope.do(instruction)
            longRope.do(instruction)
        }
        console.log(`The tail of the short rope has moved to ${shortRope.tail.visitedLocations.size} locations`);
        console.log(`The tail of the long rope has moved to ${longRope.tail.visitedLocations.size} locations`);
    })