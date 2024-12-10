import loadData from '../loading.ts'; 

const data = await loadData('./input.txt');

const search = 'XMAS';

type Word = [string, string, string, string]

interface Mask {
    letters: Word
}

type SmallBoard = [Word, Word, Word, Word];

const getSmallBoard = (bigBoard: string[][], x, y): SmallBoard => {
    const smallBoard = [];
    for (let row = x; row < x + search.length; row++) {
        const rowMask = []
        for (let column = y; column < y + search.length; column++) {
            rowMask.push(bigBoard.at(row)?.at(column))
        }
        smallBoard.push(rowMask)
    }
    return smallBoard as SmallBoard
}

const maskGetters: {(board: string[][]): Mask }[] = [
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[0][1], board[0][2], board[0][3]]}), // horizontal
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[0][1], board[0][2], board[0][3]].reverse() as Word}), // horizontal backwards
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[1][0], board[2][0], board[3][0]]}), // vertical
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[1][0], board[2][0], board[3][0]].reverse() as Word}), // vertical backwards
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[1][1], board[2][2], board[3][3]]}), // diagonal backslash
    (board: SmallBoard): Mask => ({letters: [board[0][0], board[1][1], board[2][2], board[3][3]].reverse() as Word}), // diagonal backslash backwards
    (board: SmallBoard): Mask => ({letters: [board[0][3], board[1][2], board[2][1], board[3][0]]}), // diagonal forwardslash
    (board: SmallBoard): Mask => ({letters: [board[0][3], board[1][2], board[2][1], board[3][0]].reverse() as Word}), // diagonal forwardslash backwards
]

console.log('validate masks');

for (const getter of maskGetters) {
    console.log(getter(
        [
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'],
            ['i', 'j', 'k', 'l'],
            ['m', 'n', 'o', 'p'],
        ]
    ));
}

const bigBoard = data.map(row => row.split(''))

let counter = 0;
for (let x = 0; x < bigBoard.length; x++) {
    for (let y = 0; y < bigBoard[0].length; y++) {
        const smallBoard = getSmallBoard(bigBoard, x, y);
        const masks: Mask[] = maskGetters.map(fn => fn(smallBoard))
        for (const mask of masks) {
            if (mask.letters.join('') === search) {
                counter++
            }
        }
    }
}

console.log(counter);

type XMask = [string, string, string, string, string]

const searches = [
    'MMASS',
    'MSAMS',
    'SSAMM',
    'SMASM',
]

const xMaskGetter = (board: SmallBoard): XMask => ([board[0][0], board[0][2], board[1][1], board[2][0], board[2][2]])


let xCounter = 0;
for (let x = 0; x < bigBoard.length; x++) {
    for (let y = 0; y < bigBoard[0].length; y++) {
        const smallBoard = getSmallBoard(bigBoard, x, y);
        const xMask: XMask = xMaskGetter(smallBoard)
        if (searches.includes(xMask.join(''))) {
            xCounter++
        }
    }
}
console.log(xCounter);
