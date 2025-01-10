import loadData from '../loading.ts';

const data = await loadData('./input.txt');

// make row, collum into x, y
data.reverse()

const map = data.map(row => row.split('').map(char => char === '.' ? null : char))
const width = map[0].length;
const heigth = map.length;

type Antenna = {
    frequency: string;
    x: number;
    y: number;
}
type Antinode = Antenna;

type AntennaGroup = {
    frequency: string;
    antennas: Antenna[]
};

const antennas = map.reduce((antennas: AntennaGroup[], row, y) => {
    for (let x = 0; x < row.length; x++) {
        const char = row[x];
        if (
            !char
        ) {
            continue
        }
        const antennaGroup: AntennaGroup = antennas.find(antennaGroup => antennaGroup.frequency === char)
        if (antennaGroup) {
            antennaGroup.antennas.push({
                frequency: char,
                x,
                y,
            })
        } else {
            antennas.push({
                frequency: char,
                antennas: [{
                    frequency: char,
                    x,
                    y,
                }]
            })
        }
    }
    return antennas
}, [])

console.log(antennas.sort((a, b) => a.frequency.charCodeAt(0) - b.frequency.charCodeAt(0)));

const antinodes = map.map(row => row.map(_ => 0))

const calcAntinodes = (antenna1: Antenna, antenna2: Antenna): Antinode[] => {
    const diffx = antenna1.x - antenna2.x
    const diffy = antenna1.y - antenna2.y
    const nodes: Antinode[] = [
        antenna1,
        antenna2
    ]
    let x = antenna1.x + diffx
    let y = antenna1.y + diffy
    while (x >= 0 && x < width && y >= 0 && y < heigth) {
        nodes.push({
            frequency: antenna1.frequency,
            x,
            y
        })
        x += diffx
        y += diffy
    }

    x = antenna2.x - diffx
    y = antenna2.y - diffy
    while (x >= 0 && x < width && y >= 0 && y < heigth) {
        nodes.push({
            frequency: antenna2.frequency,
            x,
            y
        })
        x -= diffx
        y -= diffy
    }

    return nodes
}

for (const antennaGroup of antennas) {
    const antinodesFromGroup: Antinode[] = []
    if (antennaGroup.antennas.length < 2) {
        continue
    }
    antennaGroup.antennas.forEach((antenna1, index, group) => {
        group.slice(index + 1).forEach(antenna2 => {
            antinodesFromGroup.push(...calcAntinodes(antenna1, antenna2))
        })
    })
    
    antinodesFromGroup.forEach(antinode => {
        antinodes[antinode.y][antinode.x] ++
    })
}

console.log(map.map(row => row.map(char => char ? char : '.').join(' ')));

console.log(antinodes.reverse().map(row => row.join(' ')));

console.log(antinodes.flat().reduce((prev: number, curr: number) => prev + (curr > 0 ? 1 : 0), 0));

