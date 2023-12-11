import loadData from '../advent.js';

class Card {
    constructor(line) {
        this.constructorString = line;
        const [name, rest] = line.split(': ', 2);
        this.name = parseInt(name.substring(5));
        const [winningRaw, pickedRaw] = rest.split(' | ', 2);
        this.winning = winningRaw.split(' ').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        this.picked = pickedRaw.split(' ').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }

    get points() {
        return this.picked.reduce((acc, curr) => {
            const point = this.winning.includes(curr) ? 1 : 0;
            return acc + point;
        }, 0)
    }

    get number() {
        return this.name;
    }
}

loadData('input.txt').then(data => {
    const cards = data.map(line => new Card(line));
    let counter = 0;
    while (cards.length >= 1) {
        const card = cards.shift();
        for (let index = 1; index <= card.points; index++) {
            const cardToClone = cards.find(x => x.number === card.number + index)
            if (cardToClone === undefined) {
                continue;
            }
            cards.unshift(new Card(cardToClone.constructorString));
        }
        // cards.sort((a, b) => a.number - b.number)
        counter++;
    }
    console.log(counter);
});
