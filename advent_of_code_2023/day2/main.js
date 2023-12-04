import loadData from '../advent.js';

const parseGrabs = grabs => {
    grabs = grabs.split('; ');
    const parsedGrabs = [];
    for (const grab of grabs) {
        const parsedGrab = {
            'red': 0,
            'green': 0,
            'blue': 0,
        };
        for (const hand of grab.split(', ')) {
            const [count, color] = hand.split(' ');
            parsedGrab[color] += parseInt(count);
        }
        parsedGrabs.push(parsedGrab);
    }
    return parsedGrabs;
};

const powerOfGrabs = grabs => {
    const minGrabs = {
        'red': 0,
        'green': 0,
        'blue': 0,
    };
    for (const grab of grabs) {
        for (const color in minGrabs) {
            if (grab[color] > minGrabs[color]) {
                minGrabs[color] = grab[color];
            }

        }
    }
    return minGrabs.red * minGrabs.green * minGrabs.blue;
};
    

loadData('input.txt').then(data => {
    const powers = [];
    for (const line of data) {
        let [id, grabs] = line.split(': ', 2);
        id = parseInt(id.split('Game ')[1]);
        grabs = parseGrabs(grabs);
        powers.push(powerOfGrabs(grabs));
    }
    console.log(powers);
    console.log(powers.reduce((a, b) => a + b, 0));
});
