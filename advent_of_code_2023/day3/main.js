import loadData from '../advent.js';

const isSymbol = symbol => symbol !== '.' && isNaN(Number(symbol));

loadData('input.txt').then(data => {
    const symbols = [];
    for (const [row, line] of data.entries()) {
        for (const [col, symbol] of line.split('').entries()) {
            if (isSymbol(symbol)) {
                symbols.push({
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
    
    const numbersNextToSymbols = [];
    
    numbers.forEach(number => {
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
        for (const position of posiblePositions) {
            if (data[position.row]
                && data[position.row][position.col]
                && isSymbol(data[position.row][position.col])) {
                numbersNextToSymbols.push(number);
                break;
            }
        }
    });

    console.log(numbersNextToSymbols);
    console.log(numbersNextToSymbols.reduce((acc, number) => acc + number.number, 0));

});