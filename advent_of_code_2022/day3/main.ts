import { readFile } from 'node:fs/promises';
import path from 'node:path';

class Rucksack {
    leftCompartment: string;
    rightCompartment: string;

    constructor(input: string) {
        this.leftCompartment = input.substring(0, input.length/2)
        this.rightCompartment = input.substring(input.length/2)
    }

    public get compartments(): string {
        return this.leftCompartment + this.rightCompartment;
    }

    public get priority(): number {
        return Rucksack.priorityOfChar(this.sharedType)
    }
    
    private get sharedType(): string {
        return this.findMatch(this.leftCompartment, this.rightCompartment);
    }

    public findMatch(str1: string, str2: string): string {
        let match = '';
        for (const leftChar of str1) {
            for (const rightChar of str2) {
                if (leftChar === rightChar && !match.includes(leftChar)) {
                    match += leftChar;
                }
            }
        }
        return match;
    }
    
    static priorityOfChar(char: string): number {
        const charCode = char.charCodeAt(0);
        if (charCode >= 97) {
            return charCode - 96;
        }
        return charCode - 64 + 26;
    }

    public findSharedType(content: string): string {
        return this.findMatch(this.compartments, content);
    }
}


function loadData(data: string) {
    const lines: string[] = data.split(/(\r\n|\r|\n)/);
    return lines
    .filter((rawLine) => rawLine.length > 1)
    .map((rawLine) => rawLine.trim())
}

function mapData(lines:string[]): Rucksack[] {
    return lines.map((input) => new Rucksack(input))
}

function solution1(rucksacks: Rucksack[]) {
    return rucksacks.reduce((acc, rucksack) => {
        return acc + rucksack.priority
    }, 0)
}

function solution2(rucksacks: Rucksack[]) {
    const chunkSize = 3;
    let sum = 0;
    for (let i = 0; i < rucksacks.length; i += chunkSize) {
        const group = rucksacks.slice(i, i + chunkSize);
        const rucksack1 = group[0].compartments
        const matches1 = group[1].findSharedType(rucksack1);
        const itemType = group[2].findSharedType(matches1);
        sum += Rucksack.priorityOfChar(itemType)
    }
    return sum;
}

    
try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        .then(mapData)
        .then(solution1)
        .then((result) => {console.log(`solultion 1 ${result}`)})
    
} catch (err: any) {
    console.error(err.message);
}

try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        .then(mapData)
        .then(solution2)
        .then((result) => {console.log(`solultion 2 ${result}`)})
    
} catch (err: any) {
    console.error(err.message);
}