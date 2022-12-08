import loadData from "../advent.js"

loadData('input.txt')
    .then(lines => {
        solution1(lines);
        solution2(lines);
    })

class Elf {
    public start: number;
    public end: number;
    constructor(rangeString: string) {
        [this.start, this.end] = rangeString.split('-').map(str => parseInt(str));
    }

    public get length(): number {
        return this.end - this.start;
    }
}

class Pair {
    public firstElf: Elf;
    public secondElf: Elf;
    constructor(pairString: string) {
        [this.firstElf, this.secondElf] = pairString.split(',').map(str => new Elf(str))
    }

    public get fullyContain(): boolean {
        if (this.firstElf.start >= this.secondElf.start && this.firstElf.end <= this.secondElf.end) {
            return true
        } else if (this.secondElf.start >= this.firstElf.start && this.secondElf.end <= this.firstElf.end) {
            return true
        }
        return false
    }

    public get overlap(): boolean {
        if (
            this.firstElf.start === this.secondElf.start ||
            this.firstElf.start === this.secondElf.end ||
            this.firstElf.end === this.secondElf.start ||
            this.firstElf.end === this.secondElf.start
        ) {
            return true
        }
        if (this.firstElf.start > this.secondElf.start) {
            if (this.firstElf.start < this.secondElf.end) {
                return true
            }
        } else {
            if (this.secondElf.start < this.firstElf.end) {
                return true
            }
        }
        return false;
    }
    
}

const solution1 = (lines: string[]) => {
    const pairs = lines.map(line => new Pair(line))
    let total = 0;
    for (const pair of pairs) {
        if (pair.fullyContain) {    
            total += 1;
        }
    }
    console.log(`solution 1: ${total}`);   
}

const solution2 = (lines: string[]) => {
    const pairs = lines.map(line => new Pair(line))
    let total = 0;
    for (const pair of pairs) {
        if (pair.overlap) {    
            total += 1;
        }
    }
    console.log(`solution 2: ${total}`);   
}