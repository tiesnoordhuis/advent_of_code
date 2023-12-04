import loadData from '../advent.js';

const isSymbol = symbol => symbol === '*';

loadData('input.txt').then(data => {
    const gears = [];
    for (const [row, line] of data.entries()) {
        for (const [col, symbol] of line.split('').entries()) {
            if (isSymbol(symbol)) {
                gears.push({
                    symbol,
                    row,
                    col,
                });
            }
        }
    }
    const numbers = [];
    for (const [row, line] of data.entries()) {
        let numberString = '';
        for (const [col, symbol] of line.split('').entries()) {
            if (!isNaN(Number(symbol))) {
                numberString += symbol;
            } else if (numberString.length > 0) {
                numbers.push({
                    number: Number(numberString),
                    row,
                    col: col - numberString.length,
                });
                numberString = '';
            }
        }
        if (numberString.length > 0) {
            numbers.push({
                number: Number(numberString),
                row,
                col: data[row].length - numberString.length,
            });
        }
    }

    const numbersWithPossiblePositons = numbers.map(number => {
        const posiblePositions = []
        for (let col = Math.max(0, number.col - 1); col <= number.col + number.number.toString().length; col++) {
            posiblePositions.push({
                row: number.row -1,
                col,
            });
            posiblePositions.push({
                row: number.row + 1,
                col,
            });
        }
        posiblePositions.push({
            row: number.row,
            col: number.col - 1,
        });
        posiblePositions.push({
            row: number.row,
            col: number.col + number.number.toString().length,
        });
        return {
            ...number,
            posiblePositions,
        };
    });
    
    const gearsWithTwoNumbers = [];
    gears.forEach((gear) => {
        const numbersInGear = numbersWithPossiblePositons.filter(
            number => number.posiblePositions.some(
                pos => pos.row === gear.row && pos.col === gear.col
            )
        );
        if (numbersInGear.length === 2) {
            gearsWithTwoNumbers.push({
                ...gear,
                numbers: numbersInGear,
            });
        }
    });

    
    console.log(gearsWithTwoNumbers);
    console.log(gearsWithTwoNumbers.reduce((acc, gear) => acc + gear.numbers[0].number * gear.numbers[1].number, 0));

});