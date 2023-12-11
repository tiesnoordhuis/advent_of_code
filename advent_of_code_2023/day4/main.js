import loadData from '../advent.js';

class Card {
    constructor(line) {
        const [name, rest] = line.split(': ', 2);
        this.name = name.substring(5)
        const [winningRaw, pickedRaw] = rest.split(' | ', 2);
        this.winning = winningRaw.split(' ').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        this.picked = pickedRaw.split(' ').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }

    get points() {
        let wins = 0;
        for (const pick of this.picked) {
            if (this.winning.includes(pick)) {
                wins++;
            }
        }
        return wins === 0 ? 0 : Math.pow(2, wins - 1);
    }
}

loadData('input.txt').then(data => {
    const cards = data.map(line => new Card(line));
    const points = cards.map(card => card.points);
    const total = points.reduce((a, b) => a + b, 0);
    console.log(total);
});