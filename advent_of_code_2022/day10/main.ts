import loadData from "../advent.js"

type Function = 'addx'|'noop'

const createInstruction = (name: Function, argument?: number) => {
    switch (name) {
        case 'addx':
            return new addx(argument as number)
        case 'noop':
            return new noop();
    }
}

abstract class Instruction {
    public duration: number;
    
    constructor(duration: number) {
        this.duration = duration;
    }

    abstract modify(register: number): number;
}

class noop extends Instruction {
    constructor() {
        super(1);
    }

    modify(register: number): number {
        return register;
    }
}

class addx extends Instruction {
    public increment: number;

    constructor(increment: number) {
        super(2);
        this.increment = increment;  
    }

    modify(register: number): number {
        return register + this.increment;
    }
}

class Drawing {
    public store: string[][] = [];

    draw(register: number, cycleCounter: number) {
        // change cycle from 1 startIndex to 0 startIndex
        cycleCounter -= 1;
        const rowIndex = Math.floor(cycleCounter / 40);
        const columnIndex = cycleCounter % 40;
        if (rowIndex >= this.store.length) {
            this.store.push([])
        }
        this.store[rowIndex].push(this.sprite(register, columnIndex))
    }

    sprite(register: number, columnIndex: number): '#'|'.' {
        if (columnIndex >= register - 1 && columnIndex <= register + 1) {
            return '#';
        }
        return '.'
    }

    display() {
        for (const row of this.store) {
            console.log(row.join(''));
        }
    }
}

loadData('input.txt')
    .then((lines) => {
        return lines.map(line => {
            const [func, arg] = line.split(' ');
            return createInstruction(func as Function, Number(arg))
        })
    })
    .then(instructions => {
        let cycleCounter = 1;
        let register = 1;
        let instruction = instructions.shift() as Instruction;
        let runUntil = cycleCounter + instruction.duration;
        let total = 0;
        const drawing = new Drawing();
        do {
            if (cycleCounter >= runUntil) {
                register = instruction.modify(register);
                instruction = instructions.shift() as Instruction;
                runUntil = cycleCounter + instruction.duration;
            }
            if ((cycleCounter - 20) % 40 === 0) {
                total += register * cycleCounter;
            }
            drawing.draw(register, cycleCounter);
            cycleCounter += 1;
        } while (instructions.length > 0);
        console.log(`total number is ${total}`);
        console.log(drawing.display());
    })