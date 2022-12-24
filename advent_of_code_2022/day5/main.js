import loadData from "../advent.js";
const stacks = await loadData('stacks.txt')
    .then(lines => {
    const keys = [1, 5, 9, 13, 17, 21, 25, 29, 33];
    const stacks = keys.map(_ => []);
    for (const line of lines) {
        const arrayLine = line.split('');
        for (let index = 0; index < arrayLine.length; index++) {
            const crate = arrayLine[index];
            if (keys.includes(index) && crate !== ' ') {
                stacks[keys.indexOf(index)].push(crate);
            }
        }
    }
    return stacks;
})
    .then(stacks => stacks.map(stack => stack.reverse()));
class Instruction {
    amount;
    fromStack;
    toStack;
    constructor(amount, fromStack, toStack) {
        this.amount = amount;
        this.fromStack = fromStack - 1;
        this.toStack = toStack - 1;
    }
}
const instructions = await loadData('input.txt')
    .then(lines => {
    return lines.map(line => {
        const [_, ...matches] = line.match(/move (\d+) from (\d+) to (\d+)/) ?? [];
        const params = matches.map(match => Number(match));
        return new Instruction(...params);
    });
});
for (const instruction of instructions) {
    const crates = stacks[instruction.fromStack].splice(-instruction.amount);
    // const crates = stacks[instruction.fromStack].splice(-instruction.amount).reverse()
    stacks[instruction.toStack].push(...crates);
}
console.log(stacks.map(stack => stack[stack.length - 1]).join(''));
