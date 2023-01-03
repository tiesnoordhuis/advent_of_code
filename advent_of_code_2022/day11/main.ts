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

    public inspectCounter: number = 0;

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

    inspectItem(item: Item) {
        item.worryLevel = this.operation(item.worryLevel)
        this.inspectCounter += 1;
    }

    postInspectionRelief(item: Item) {
        item.worryLevel = Math.floor(item.worryLevel / 3);
    }

    throwItem(item: Item): [number, Item] {
        if (this.test(item.worryLevel)) {
            return [this.trueTarget, item];
        }
        return [this.falseTarget, item];
    }

    takeTurn(): [number, Item] {
        const item = this.pocket.shift() as Item;
        this.inspectItem(item)
        this.postInspectionRelief(item)
        return this.throwItem(item)
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
            if (line.startsWith('Monkey')) {
                monkeyNumberCache = Number(line.split('Monkey ')[1].split(':')[0])
            } else if (line.startsWith('Starting items')) {
                startingItemsCache = line.split('Starting items: ')[1].split(', ').map(worry => new Item(Number(worry)))
            } else if (line.startsWith('Operation')) {
                operationCache = new Function(
                    'old', 
                    `return ${line.split('Operation: new = ')[1]}`
                ) as (old: number) => number
            } else if (line.startsWith('Test')) {
                testCache = new Function(
                    'worry',
                    `return worry % ${Number(line.split('divisible by ')[1])} === 0`    
                ) as (worry: number) => boolean
            } else if (line.startsWith('If true')) {
                trueTargetCache = Number(line.split('throw to monkey ')[1])
            } else if (line.startsWith('If false')) {
                falseTargetCache = Number(line.split('throw to monkey ')[1])
                Object.defineProperty(monkeys, `${monkeyNumberCache}`, {
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
    .then((pack: any) => {
        for (let round = 0; round < 20; round++) {
            for (const monkey of Object.values(pack) as Monkey[]) {
                
                while (monkey.pocket.length >= 1){
                    const [toMonkeyNumber, itemToGive] = monkey.takeTurn()
                    pack[`${toMonkeyNumber}`].addItem(itemToGive);
                }
            }
        }

        const counters: number[] = []
        for (const [monkeyNumber, monkey] of Object.entries(pack) as [string, Monkey][]) {
            counters.push(monkey.inspectCounter)
        }
        counters.sort((a, b) => b - a)
        console.log(`monkey business after 20 rounds: ${counters[0] * counters[1]}`);
        
    })