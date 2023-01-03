import loadData from "../advent.js"

class Item {
    public worryLevel: number;

    constructor(worryLevel: number) {
        this.worryLevel = worryLevel;
    }
}

class Monkey {
    public pocket: Item[] = [];

    public operation: (old: number) => number;
    public test: (worry: number) => boolean;
    public trueTarget: number;
    public falseTarget: number;

    constructor(
        items: Item[],
        operation: (old: number) => number,
        test: (worry: number) => boolean,
        trueTarget: number,   
        falseTarget: number   
    ) {
        this.operation = operation;
        this.test = test;
        this.trueTarget = trueTarget;
        this.falseTarget = falseTarget;
        for (const item of items) {
            this.addItem(item)
        }
    }

    addItem(item: Item) {
        this.pocket.push(item)
    }
}

loadData('input.txt')
    .then(lines => {
        const monkeys = {};

        let monkeyNumberCache: number = 0;
        let startingItemsCache: Item[] = [];
        let operationCache: (old: number) => number = (_) => NaN;
        let testCache: (worry: number) => boolean = (_) => false;
        let trueTargetCache: number = 0;
        let falseTargetCache: number = 0;
        for (const line of lines) {
            console.log(line);
            if (line.startsWith('Monkey')) {
                monkeyNumberCache = Number(line.split('Monkey ')[1].split(':')[0])
            } else if (line.startsWith('Starting items')) {
                startingItemsCache = line.split('Starting items: ')[1].split(', ').map(worry => new Item(Number(worry)))
            } else if (line.startsWith('Operation')) {
                operationCache = new Function(
                    'old', 
                    `return ${line.split('Operation: new = ')[1]}`
                ) as (old: number) => number
                console.log(operationCache.toString());
            } else if (line.startsWith('Test')) {
                testCache = new Function(
                    'worry',
                    `return worry % ${Number(line.split('divisible by ')[1])} === 0`    
                ) as (worry: number) => boolean
                console.log(testCache.toString());
            } else if (line.startsWith('If true')) {
                trueTargetCache = Number(line.split('throw to monkey ')[1])
            } else if (line.startsWith('If false')) {
                falseTargetCache = Number(line.split('throw to monkey ')[1])
                Object.defineProperty(monkeys, monkeyNumberCache, {
                        value: new Monkey(
                            startingItemsCache,
                            operationCache,
                            testCache,
                            trueTargetCache,
                            falseTargetCache
                        ),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                )
            }
        }        
        return monkeys
    })
    .then(pack => {
        console.log(pack);
    })