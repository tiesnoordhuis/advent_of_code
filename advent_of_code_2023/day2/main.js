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
            console.log(count, color);
            parsedGrab[color] += parseInt(count);
        }
        parsedGrabs.push(parsedGrab);
    }
    return parsedGrabs;
};

const isPossible = grabs => {
    const maxGrabs = {
        'red': 12,
        'green': 13,
        'blue': 14,
    };
    for (const grab of grabs) {
        for (const color in maxGrabs) {
            if (!isNaN(grab[color]) && grab[color] > maxGrabs[color]) {
                return false;
            } else {
                // niks
                let niks = 0;
            }

        }
    }
    return true;
};
    

loadData('input.txt').then(data => {
    const ids = [];
    for (const line of data) {
        let [id, grabs] = line.split(': ', 2);
        id = parseInt(id.split('Game ')[1]);
        grabs = parseGrabs(grabs);
        if (isPossible(grabs)) {
            ids.push(id);
        }
    }
    console.log(ids);
    console.log(ids.reduce((a, b) => a + b, 0));
});
