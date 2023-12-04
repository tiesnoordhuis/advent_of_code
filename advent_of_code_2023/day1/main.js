import loadData from '../advent.js';

const numberWords = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four' : 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine' : 9,
    'ten': 10,
}

const numberWordsReverse = {
    'orez': 0,
    'eno': 1,
    'owt': 2,
    'eerht': 3,
    'ruof' : 4,
    'evif': 5,
    'xis': 6,
    'neves': 7,
    'thgie': 8,
    'enin' : 9,
    'net': 10,
}

const isNumeric = (x) => !isNaN(Number(x));

const findNumberLike = (array) => {
    for (let i = 0; i < array.length; i++) {
        for (const numberWord in numberWords) {
            if (array.slice(i, i + numberWord.length).join('') === numberWord) {
                return numberWords[numberWord];
            }
        }
        if (isNumeric(array[i])) {
            return Number(array[i]);
        }
    }
    return null;
}

const findNumberLikeReverse = (array) => {
    for (let i = 0; i < array.length; i++) {
        for (const numberWord in numberWordsReverse) {
            if (array.slice(i, i + numberWord.length).join('') === numberWord) {
                return numberWordsReverse[numberWord];
            }
        }
        if (isNumeric(array[i])) {
            return Number(array[i]);
        }
    }
    return null;
}

const isNumberLike = (x, index, array) => {
    if (Object.hasOwn(numberWords, x)) {
        return true;
    } else if(isNumeric(x)) {
        return true;
    }
    return false;
}

const makeNumber = (x) => {
    if (isNumeric(x)) {
        return Number(x);
    }
    return numberWords[x];
}

loadData('input')
    .then((data) => {
        const total = data.reduce((prev, curr) => {
            const line = Array.from(curr);
            const first = findNumberLike(line)
            const last = findNumberLikeReverse(line.reverse());
            return prev + Number(`${first}${last}`)
        }, 0)
        console.log(total);
    })