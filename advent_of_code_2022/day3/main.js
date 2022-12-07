import { readFile } from 'node:fs/promises';
import path from 'node:path';
class Rucksack {
    leftCompartment;
    rightCompartment;
    constructor(input) {
        this.leftCompartment = input.substring(0, input.length / 2);
        this.rightCompartment = input.substring(input.length / 2);
    }
    get compartments() {
        return this.leftCompartment + this.rightCompartment;
    }
    get priority() {
        return Rucksack.priorityOfChar(this.sharedType);
    }
    get sharedType() {
        return this.findMatch(this.leftCompartment, this.rightCompartment);
    }
    findMatch(str1, str2) {
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
    static priorityOfChar(char) {
        const charCode = char.charCodeAt(0);
        if (charCode >= 97) {
            return charCode - 96;
        }
        return charCode - 64 + 26;
    }
    findSharedType(content) {
        return this.findMatch(this.compartments, content);
    }
}
function loadData(data) {
    const lines = data.split(/(\r\n|\r|\n)/);
    return lines
        .filter((rawLine) => rawLine.length > 1)
        .map((rawLine) => rawLine.trim());
}
function mapData(lines) {
    return lines.map((input) => new Rucksack(input));
}
function solution1(rucksacks) {
    return rucksacks.reduce((acc, rucksack) => {
        return acc + rucksack.priority;
    }, 0);
}
function solution2(rucksacks) {
    const chunkSize = 3;
    let sum = 0;
    for (let i = 0; i < rucksacks.length; i += chunkSize) {
        const group = rucksacks.slice(i, i + chunkSize);
        const rucksack1 = group[0].compartments;
        const matches1 = group[1].findSharedType(rucksack1);
        const itemType = group[2].findSharedType(matches1);
        sum += Rucksack.priorityOfChar(itemType);
    }
    return sum;
}
try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        .then(mapData)
        .then(solution1)
        .then((result) => { console.log(`solultion 1 ${result}`); });
}
catch (err) {
    console.error(err.message);
}
try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        .then(mapData)
        .then(solution2)
        .then((result) => { console.log(`solultion 2 ${result}`); });
}
catch (err) {
    console.error(err.message);
}
