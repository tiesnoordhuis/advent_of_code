import loadData from "../advent.js";
class Item {
    worryLevel;
    constructor(worryLevel) {
        this.worryLevel = worryLevel;
    }
}
class Monkey {
    pocket = [];
    operation;
    test;
    trueTarget;
    falseTarget;
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
        console.log(line);
        if (line.startsWith('Monkey')) {
            monkeyNumberCache = Number(line.split('Monkey ')[1].split(':')[0]);
        }
        else if (line.startsWith('Starting items')) {
            startingItemsCache = line.split('Starting items: ')[1].split(', ').map(worry => new Item(Number(worry)));
        }
        else if (line.startsWith('Operation')) {
            operationCache = new Function('old', `return ${line.split('Operation: new = ')[1]}`);
            console.log(operationCache.toString());
        }
        else if (line.startsWith('Test')) {
            testCache = new Function('worry', `return worry % ${Number(line.split('divisible by ')[1])} === 0`);
            console.log(testCache.toString());
        }
        else if (line.startsWith('If true')) {
            trueTargetCache = Number(line.split('throw to monkey ')[1]);
        }
        else if (line.startsWith('If false')) {
            falseTargetCache = Number(line.split('throw to monkey ')[1]);
            Object.defineProperty(monkeys, monkeyNumberCache, {
                value: new Monkey(startingItemsCache, operationCache, testCache, trueTargetCache, falseTargetCache),
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }
    return monkeys;
})
    .then(pack => {
    console.log(pack);
});
