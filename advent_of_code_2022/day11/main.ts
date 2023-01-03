import loadData from "../advent.js"

class Item {
    public worryLevel: number;

    constructor(worryLevel: number) {
        this.worryLevel = worryLevel;
    }
}

class Monkey {
    static superModulo: number = 1;
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
        if (process.argv[2] === 'part2') {
            item.worryLevel = (item.worryLevel % Monkey.superModulo);
        } else {
            item.worryLevel = Math.floor(item.worryLevel / 3);
        }
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
                const modulo = Number(line.split('divisible by ')[1])
                Monkey.superModulo *= modulo;
                testCache = new Function(
                    'worry',
                    `return worry % ${modulo} === 0`    
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
                        writable: false,
                        enumerable: true,
                        configurable: false
                    }
                )
            }
        }        
        return monkeys
    })
    .then((pack: any) => {
        const monkeys = Object.values(pack) as Monkey[];
        const amountOfRounds = Number(process.argv[3])
        for (let round = 0; round < amountOfRounds; round++) {
            for (let monkeyNumber = 0; monkeyNumber < monkeys.length; monkeyNumber++) {
                const monkey = monkeys[monkeyNumber];
                while (monkey.pocket.length >= 1){
                    const [toMonkeyNumber, itemToGive] = monkey.takeTurn()
                    monkeys[toMonkeyNumber].addItem(itemToGive);
                }
            }
        }

        const counters: number[] = []
        monkeys.forEach((monkey, monkeyNumber) => {
            counters.push(monkey.inspectCounter)
            console.log(monkeyNumber, monkey.inspectCounter);
        })
        counters.sort((a, b) => b - a)
        console.log(`monkey business after ${amountOfRounds} rounds: ${counters[0] * counters[1]}`);
        
    })