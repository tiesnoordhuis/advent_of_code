import loadData from '../advent.js';

class Race {
    constructor(time, distance) {
        this.time = time;
        this.distance = distance;
    }

    waysToBeatRecord() {
        let ways = 0;
        for (let pressSeconds = 0; pressSeconds < this.time; pressSeconds++) {
            const distanceTraveled = pressSeconds * 1 * (this.time - pressSeconds);
            if (distanceTraveled > this.distance) {
                ways++;
            }
        }
        return ways;
    }

}

loadData('input.txt')
    .then(data => {
        const times = data[0].split(':')[1].trim().split(' ').filter(it => it).map(Number)
        const distances = data[1].split(':')[1].trim().split(' ').filter(it => it).map(Number)
        const races = [];
        for (let index = 0; index < times.length; index++) {
            races.push(new Race(times[index], distances[index]))
        }
        const result = races.reduce((prev, curr) => {
            return prev * curr.waysToBeatRecord();
        }, 1)
        console.log(result);
    })