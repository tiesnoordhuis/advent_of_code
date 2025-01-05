import loadData from '../loading.ts';

const data = await loadData('./input.txt');



class Equation {
    testValue: number;
    formulaParts: number[];
    valid: boolean;

    constructor(line: string) {
        [this.testValue, this.formulaParts] = this.parse(line)
        this.valid = this.check([this.formulaParts])
    }

    parse(line: string): [number, number[]] {
        const [rawTestValue, rest] = line.split(': ')
        return [Number(rawTestValue), rest.split(' ').map(Number)]
    }

    check(multipleParts: number[][]): boolean {
        if (multipleParts[0].length === 1) {
            return multipleParts.some((parts) => parts.some(value => value === this.testValue))
        }
        const temp = []
        for (const parts of multipleParts) {
            const [first, second, ...rest] = parts
            temp.push(
                [first + second, ...rest],
                [first * second, ...rest],
                [Number(`${first}${second}`), ...rest], // comment for part 1
            )
        }
        return this.check(temp)
    }
}
const equations: Equation[] = [];
for (const point of data) {
    const testEquation = new Equation(point);
    if (testEquation.valid) {
        equations.push(testEquation)
    }
}

const outcome1 = equations.reduce((prev, curr) => {
    return prev + curr.testValue
}, 0)

console.log(outcome1);
