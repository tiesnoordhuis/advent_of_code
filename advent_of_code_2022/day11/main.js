import loadData from "../advent.js";
class Item {
    worryLevel;
    constructor(worryLevel) {
        this.worryLevel = worryLevel;
    }
}
class Monkey {
    static superModulo = 1;
    pocket = [];
    operation;
    test;
    trueTarget;
    falseTarget;
    inspectCounter = 0;
    constructor(items, operation, test, trueTarget, falseTarget) {
        this.operation = operation;
        this.test = test;
        this.trueTarget = trueTarget;
        this.falseTarget = falseTarget;
        for (const item of items) {
            this.addItem(item);
        }
    }
    addItem(item) {
        this.pocket.push(item);
    }
    inspectItem(item) {
        item.worryLevel = this.operation(item.worryLevel);
        this.inspectCounter += 1;
    }
    postInspectionRelief(item) {
        if (process.argv[2] === 'part2') {
            item.worryLevel = (item.worryLevel % Monkey.superModulo);
        }
        else {
            item.worryLevel = Math.floor(item.worryLevel / 3);
        }
    }
    throwItem(item) {
        if (this.test(item.worryLevel)) {
            return [this.trueTarget, item];
        }
        return [this.falseTarget, item];
    }
    takeTurn() {
        const item = this.pocket.shift();
        this.inspectItem(item);
        this.postInspectionRelief(item);
        return this.throwItem(item);
    }
}
loadData('input.txt')
    .then(lines => {
    const monkeys = {};
    let monkeyNumberCache = 0;
    let startingItemsCache = [];
    let operationCache = (_) => NaN;
    let testCache = (_) => false;
    let trueTargetCache = 0;
    let falseTargetCache = 0;
    for (const line of lines) {
        if (line.startsWith('Monkey')) {
            monkeyNumberCache = Number(line.split('Monkey ')[1].split(':')[0]);
        }
        else if (line.startsWith('Starting items')) {
            startingItemsCache = line.split('Starting items: ')[1].split(', ').map(worry => new Item(Number(worry)));
        }
        else if (line.startsWith('Operation')) {
            operationCache = new Function('old', `return ${line.split('Operation: new = ')[1]}`);
        }
        else if (line.startsWith('Test')) {
            const modulo = Number(line.split('divisible by ')[1]);
            Monkey.superModulo *= modulo;
            testCache = new Function('worry', `return worry % ${modulo} === 0`);
        }
        else if (line.startsWith('If true')) {
            trueTargetCache = Number(line.split('throw to monkey ')[1]);
        }
        else if (line.startsWith('If false')) {
            falseTargetCache = Number(line.split('throw to monkey ')[1]);
            Object.defineProperty(monkeys, `${monkeyNumberCache}`, {
                value: new Monkey(startingItemsCache, operationCache, testCache, trueTargetCache, falseTargetCache),
                writable: false,
                enumerable: true,
                configurable: false
            });
        }
    }
    return monkeys;
})
    .then((pack) => {
    const monkeys = Object.values(pack);
    const amountOfRounds = Number(process.argv[3]);
    for (let round = 0; round < amountOfRounds; round++) {
        for (let monkeyNumber = 0; monkeyNumber < monkeys.length; monkeyNumber++) {
            const monkey = monkeys[monkeyNumber];
            while (monkey.pocket.length >= 1) {
                const [toMonkeyNumber, itemToGive] = monkey.takeTurn();
                monkeys[toMonkeyNumber].addItem(itemToGive);
            }
        }
    }
    const counters = [];
    monkeys.forEach((monkey, monkeyNumber) => {
        counters.push(monkey.inspectCounter);
        console.log(monkeyNumber, monkey.inspectCounter);
    });
    counters.sort((a, b) => b - a);
    console.log(`monkey business after ${amountOfRounds} rounds: ${counters[0] * counters[1]}`);
});
