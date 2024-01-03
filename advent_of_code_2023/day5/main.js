import loadData from '../advent.js';

class Mapper {
    constructor({mapToName, mapFromName, ranges}) {
        this.to = mapToName;
        this.from = mapFromName;
        this.ranges = ranges
        return this;
    }

    get name() {
        return `${this.from}-to-${this.to}`;
    }

    map(input) {
        for (const range of this.ranges) {
            if (input >= range[1] && input <= range[1] + range[2]) {
                return range[0] + (input - range[1]);
            }
        }
        return input;
    }
}

loadData('input.txt')
    .then(data => {
        const mapperConstructorOptions = [];
        
        let rowNumber = 0;
        // read seeds from first row
        const seeds = [];
        seeds.push(...data[rowNumber].substring(7).split(' ').map(it => Number(it)));

        rowNumber++;
        let mapperOptions;
        for (; rowNumber < data.length; rowNumber++) {
            const row = data[rowNumber];
            if (row.endsWith('map:')) {
                if (mapperOptions) {
                    mapperConstructorOptions.push(mapperOptions);
                }
                const [mapFromName, mapToName] = row.substring(0, row.length - 5).split('-to-');
                mapperOptions = {
                    mapToName,
                    mapFromName,
                    ranges: [],
                };
            } else {
                mapperOptions.ranges.push(row.split(' ').map(it => Number(it)))
            }
        }
        mapperConstructorOptions.push(mapperOptions);
        const mappers = mapperConstructorOptions.map(options => new Mapper(options));

        let location = 10000000000;
        for (let index = 0; index < seeds.length; index += 2) {
            const startSeed = seeds[index];
            const range = seeds[index + 1];
            
            for (let seed = startSeed; seed < startSeed + range; seed++) {
                let newLocation = findLocationOfSeed(seed, mappers);
                if (newLocation < location) {
                    location = newLocation;
                }
            }
        }
        
        console.log(location);
    })

function findLocationOfSeed(seed, mappers) {
    let mapper = mappers.find(pred => pred.from = 'seed');
    let value = mapper.map(seed);
    while (mapper.to != 'location') {
        mapper = mappers.find(pred => pred.from === mapper.to);
        value = mapper.map(value);
    }
    return value
}